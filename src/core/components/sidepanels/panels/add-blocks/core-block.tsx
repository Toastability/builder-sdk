import { draggedBlockAtom } from "@/core/components/canvas/dnd/atoms";
import { CHAI_BUILDER_EVENTS } from "@/core/events";
import { useAddBlock, useBlockHighlight, useSelectedBlockIds } from "@/core/hooks";
import { pubsub } from "@/core/pubsub";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/shadcn/components/ui/tooltip";
import { syncBlocksWithDefaults } from "@chaibuilder/runtime";
import { BoxIcon, LaptopIcon, MobileIcon } from "@radix-ui/react-icons";
import { useFeature } from "flagged";
import { useAtom } from "jotai";
import { capitalize, has, isFunction, isString, omit } from "lodash-es";
import { cloneElement, isValidElement, useState } from "react";
import { useTranslation } from "react-i18next";
import { useBlockPreconfigurationHandler } from "@/core/extensions/block-preconfiguration";
import { emitBuilderDebug } from "@/core/utils/debug";

export const DEFAULT_THUMB = "https://edge.dashtrack.com/assets/files/record/280372/wxhpm4vrbai4het99bem7kqvuov9"

export const CoreBlock = ({
  block,
  disabled,
  parentId,
  position,
}: {
  block: any; // Runtime block metadata (see CoreBlock interface) – includes optional thumbData, icon
  disabled: boolean;
  parentId?: string;
  position?: number;
}) => {
  const [, setDraggedBlock] = useAtom(draggedBlockAtom);
  const { type, icon, thumbData, label } = block;
  const { addCoreBlock, addPredefinedBlock } = useAddBlock();
  const [, setSelected] = useSelectedBlockIds();
  const { clearHighlight } = useBlockHighlight();
  const { t } = useTranslation();
  const translatedLabel = t(label || type);
  const displayLabel = capitalize(translatedLabel);
  const preconfigHandler = useBlockPreconfigurationHandler();
  // Device thumbnail selection (only desktop & mobile required per spec)
  const hasThumbData = thumbData && typeof thumbData === "object" && (thumbData.desktop || thumbData.mobile);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  // Resolve which image (if any) to show
  const currentThumb = hasThumbData
    ? (thumbData[device] || thumbData.desktop || thumbData.mobile)
    : null;

  // Build visual content for the block card
  let visual: React.ReactNode;
  if (currentThumb) {
    visual = (
      <img
        src={currentThumb}
        alt={translatedLabel}
        className="w-full h-auto object-contain"
        draggable={false}
      />
    );
  } else if (icon) {
    // icon may be string (url) or component/element
    if (isString(icon)) {
      visual = <img src={icon} alt={translatedLabel} className="w-full h-auto object-contain" draggable={false} />;
    } else if (isValidElement<{ className?: string }>(icon)) {
      visual = cloneElement(icon, { className: [icon.props?.className, "w-12 h-12 mx-auto my-4"].filter(Boolean).join(" ") });
    } else if (isFunction(icon)) {
      const Comp: any = icon;
      visual = <Comp className="w-12 h-12 mx-auto my-4" />;
    }
  } else {
    visual = <BoxIcon className="w-12 h-12 mx-auto my-4" />;
  }
  const addBlockToPage = async () => {
    // Create preconfiguration context similar to BlockCard
    const contextHandlers = {
      loadTemplate: async () => {
        emitBuilderDebug("preconfig.core-block.load-template:start", {
          blockType: block?.type,
          blockLabel: block?.label,
        });
        let blocks: any[] = [];
        let html: string | null = null;
        
        if (has(block, "blocks")) {
          blocks = isFunction(block.blocks) ? block.blocks() : block.blocks;
        } else {
          // For core blocks without predefined blocks, create a simple structure
          blocks = [block];
        }
        
        emitBuilderDebug("preconfig.core-block.load-template:done", {
          blockType: block?.type,
          hasHtml: Boolean(html),
          blockCount: Array.isArray(blocks) ? blocks.length : 0,
        });
        return { html, blocks };
      },
      insertConfiguredBlock: async (blocksToInsert: any[]) => {
        emitBuilderDebug("preconfig.core-block.insert-configured-block:start", {
          blockType: block?.type,
          providedCount: Array.isArray(blocksToInsert) ? blocksToInsert.length : 0,
        });
        if (Array.isArray(blocksToInsert) && blocksToInsert.length > 0) {
          addPredefinedBlock(syncBlocksWithDefaults(blocksToInsert), parentId || null, position);
        } else if (has(block, "blocks")) {
          const blocks = isFunction(block.blocks) ? block.blocks() : block.blocks;
          addPredefinedBlock(syncBlocksWithDefaults(blocks), parentId || null, position);
        } else {
          addCoreBlock(block, parentId || null, position);
        }
        pubsub.publish(CHAI_BUILDER_EVENTS.CLOSE_ADD_BLOCK);
        emitBuilderDebug("preconfig.core-block.insert-configured-block:done", {
          blockType: block?.type,
        });
        return undefined;
      },
      closeLibraryPanel: () => {
        pubsub.publish(CHAI_BUILDER_EVENTS.CLOSE_ADD_BLOCK);
        emitBuilderDebug("preconfig.core-block.close-library-panel", {
          blockType: block?.type,
        });
      },
    };

    // Check for preconfiguration handler
    if (preconfigHandler) {
      try {
        emitBuilderDebug("preconfig.core-block.handler:invoke", {
          blockType: block?.type,
          blockLabel: block?.label,
          hasHandler: true,
        });
        const handled = await preconfigHandler({
          block: block,
          library: { id: 'core', name: 'Core Blocks' }, // Mock library for core blocks
          parentId,
          position,
          ...contextHandlers,
        });
        emitBuilderDebug("preconfig.core-block.handler:result", {
          blockType: block?.type,
          handled,
        });
        if (handled) {
          return;
        }
      } catch (error) {
        console.error("[Builder] Core block pre-configuration handler failed", error);
        emitBuilderDebug("preconfig.core-block.handler:error", {
          blockType: block?.type,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    } else {
      emitBuilderDebug("preconfig.core-block.handler:missing", {
        blockType: block?.type,
        blockLabel: block?.label,
      });
    }

    // Fallback to original behavior if no handler or handler returned false
    if (has(block, "blocks")) {
      const blocks = isFunction(block.blocks) ? block.blocks() : block.blocks;
      addPredefinedBlock(syncBlocksWithDefaults(blocks), parentId || null, position);
    } else {
      addCoreBlock(block, parentId || null, position);
    }
    pubsub.publish(CHAI_BUILDER_EVENTS.CLOSE_ADD_BLOCK);
  };
  const dnd = useFeature("dnd");
  return (
    <div className="relative">
      {hasThumbData && (
        <div className="absolute right-1 top-1 z-10 flex gap-1 rounded-md bg-white/80 p-0.5 shadow ring-1 ring-border">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDevice("desktop");
            }}
            aria-label="Show desktop thumbnail"
            className={"grid h-6 w-6 place-items-center rounded-sm text-[11px] " + (device === "desktop" ? "bg-muted/60" : "hover:bg-muted/40")}
          >
            <LaptopIcon className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setDevice("mobile");
            }}
            aria-label="Show mobile thumbnail"
            className={"grid h-6 w-6 place-items-center rounded-sm text-[11px] " + (device === "mobile" ? "bg-muted/60" : "hover:bg-muted/40")}
          >
            <MobileIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            disabled={disabled}
            onClick={addBlockToPage}
            type="button"
            onDragStart={(ev) => {
              ev.dataTransfer.setData("text/plain", JSON.stringify(omit(block, ["component", "icon"])));
              ev.dataTransfer.setDragImage(new Image(), 0, 0);
              // @ts-ignore
              setDraggedBlock(omit(block, ["component", "icon"]));
              setTimeout(() => {
                setSelected([]);
                clearHighlight();
              }, 200);
            }}
            draggable={dnd ? "true" : "false"}
            className="cursor-pointer w-full builder-sdk-core-block-btn rounded-lg border border-border p-0 text-center bg-white hover:bg-slate-300/50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:border-gray-700 dark:text-white dark:hover:bg-slate-800/50 dark:disabled:bg-gray-900 dark:disabled:text-foreground"
          >
            {visual}
            <p className="truncate text-center w-full py-[20px] px-[10px] text-xs border-t">{displayLabel}</p>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{translatedLabel}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};
