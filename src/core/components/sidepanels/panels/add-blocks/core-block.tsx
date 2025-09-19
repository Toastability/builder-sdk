import { draggedBlockAtom } from "@/core/components/canvas/dnd/atoms";
import { CHAI_BUILDER_EVENTS } from "@/core/events";
import { useAddBlock, useBlockHighlight, useSelectedBlockIds } from "@/core/hooks";
import { pubsub } from "@/core/pubsub";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/ui/shadcn/components/ui/tooltip";
import { syncBlocksWithDefaults } from "@chaibuilder/runtime";
import { BoxIcon } from "@radix-ui/react-icons";
import { useFeature } from "flagged";
import { useAtom } from "jotai";
import { capitalize, has, isFunction, isString, omit } from "lodash-es";
import { cloneElement, createElement, isValidElement } from "react";
import { useTranslation } from "react-i18next";

export const DEFAULT_THUMB = "https://edge.dashtrack.com/assets/files/record/280372/wxhpm4vrbai4het99bem7kqvuov9"

export const CoreBlock = ({
  block,
  disabled,
  parentId,
  position,
}: {
  block: any;
  disabled: boolean;
  parentId?: string;
  position?: number;
}) => {
  const [, setDraggedBlock] = useAtom(draggedBlockAtom);
  const { type, icon, iconUrl, label } = block;
  const { addCoreBlock, addPredefinedBlock } = useAddBlock();
  const [, setSelected] = useSelectedBlockIds();
  const { clearHighlight } = useBlockHighlight();
  const { t } = useTranslation();
  const translatedLabel = t(label || type);
  const displayLabel = capitalize(translatedLabel);
  // Prefer a valid iconUrl, then icon component/element; otherwise fall back to DEFAULT_THUMB
  const iconSource = (() => {
    if (isString(iconUrl) && iconUrl.trim().length > 0) return iconUrl;
    if (icon) return icon;
    return DEFAULT_THUMB;
  })();
  const iconClassName = icon ? "w-4 h-4 mx-auto" : "w-full h-auto";
  const iconContent = (() => {
    if (isString(iconSource) && iconSource.trim().length > 0) {
      return (
        <img
          src={iconSource}
          alt={translatedLabel}
          className={`${iconClassName} object-contain`}
        />
      );
    }

    if (isValidElement<{ className?: string }>(iconSource)) {
      return cloneElement(iconSource, {
        className: [iconSource.props?.className, iconClassName].filter(Boolean).join(" "),
      });
    }

    if (iconSource) {
      return createElement(iconSource, { className: iconClassName });
    }

    // Final safeguard; should rarely be hit due to DEFAULT_THUMB fallback
    return <BoxIcon className={iconClassName} />;
  })();
  const addBlockToPage = () => {
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
    <>
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
            className={
              "cursor-pointer builder-sdk-core-block-btn space-y-2 rounded-lg border border-border p-3 text-center hover:bg-slate-300/50 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 dark:border-gray-700 dark:text-white dark:hover:bg-slate-800/50 dark:disabled:bg-gray-900 dark:disabled:text-foreground"
            }>
            {iconContent}
            <p className="truncate text-center w-full py-[20px] px-[10px] text-xs border border-t">{displayLabel}</p>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>{translatedLabel}</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
};
