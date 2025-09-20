import AddBlockDropdown from "@/core/components/canvas/add-block-placements";
import { draggedBlockAtom } from "@/core/components/canvas/dnd/atoms";
import BlockController from "@/core/components/sidepanels/panels/add-blocks/block-controller";
import { useFrame } from "@/core/frame/frame-context";
import { canDeleteBlock, canDuplicateBlock } from "@/core/functions/block-helpers";
import {
  useDuplicateBlocks,
  useHighlightBlockId,
  useInlineEditing,
  usePermissions,
  useRemoveBlocks,
  useSelectedBlock,
  useSelectedBlockIds,
  useSelectedStylingBlocks,
} from "@/core/hooks";
import { PERMISSIONS } from "@/core/main";
import { ChaiBlock } from "@/types/common";
import { flip, limitShift, size } from "@floating-ui/dom";
import { shift, useFloating } from "@floating-ui/react-dom";
import { ArrowUpIcon, CopyIcon, DragHandleDots2Icon, PlusIcon, TrashIcon } from "@radix-ui/react-icons";
import { useResizeObserver } from "@react-hookz/web";
import { useFeature } from "flagged";
import { useAtom } from "jotai";
import { first, get, isEmpty, pick } from "lodash-es";
import { useEffect, useState } from "react";
import { getElementByDataBlockId } from "./static/chai-canvas";
import { useCanvasZoom } from "@/core/hooks";

/**
 * @param block
 * @param label
 */
const BlockActionLabel = ({ block, label }: any) => {
  const [, setSelected] = useSelectedBlockIds();
  const [, setHighlighted] = useHighlightBlockId();
  const [, setDraggedBlock] = useAtom(draggedBlockAtom);
  const dnd = useFeature("dnd");
  return (
    <div
      className="builder-canvas-action-label mr-10 flex cursor-default items-center space-x-1 px-1"
      draggable={dnd ? "true" : "false"}
      onDragStart={(ev) => {
        ev.dataTransfer.setData("text/plain", JSON.stringify(pick(block, ["_id", "_type", "_name"])));
        //@ts-ignore
        setDraggedBlock(block);
        setTimeout(() => {
          setSelected([]);
          setHighlighted(null);
        }, 200);
      }}>
      <DragHandleDots2Icon className="builder-canvas-action-button" />
      {label}
    </div>
  );
};

type BlockActionProps = {
  block: ChaiBlock | null;
  selectedBlockElement: HTMLElement | null;
};
const getElementByStyleId = (doc: any, styleId: string): HTMLElement =>
  doc.querySelector(`[data-style-id="${styleId}"]`) as HTMLElement;

export const BlockSelectionHighlighter = () => {
  const selectedBlock = useSelectedBlock();
  const { document } = useFrame();
  const [stylingBlocks] = useSelectedStylingBlocks();
  const [selectedElements, setSelectedElements] = useState<HTMLElement[]>([]);
  const [, setSelectedStyleElements] = useState<HTMLElement[] | null[]>([]);

  const isInViewport = (element: HTMLElement, offset = 0) => {
    const { top } = element.getBoundingClientRect();
    return top + offset >= 0 && top - offset <= window.innerHeight;
  };

  useEffect(() => {
    if (!selectedBlock?._id) return;

    if (selectedBlock.type !== "Multiple" && document) {
      const blockElement = getElementByDataBlockId(document, selectedBlock._id);
      if (blockElement) {
        if (!isInViewport(blockElement)) {
          document.defaultView?.scrollTo({ top: blockElement.offsetTop, behavior: "smooth" });
        }
        setSelectedElements([blockElement]);
      }
    }
  }, [selectedBlock?._id, selectedBlock?.type, document]);

  useEffect(() => {
    if (!isEmpty(stylingBlocks) && document) {
      const selectedStyleElement = getElementByStyleId(document, (first(stylingBlocks) as { id: string }).id);
      if (selectedStyleElement) {
        setSelectedStyleElements([selectedStyleElement]);
      } else {
        setSelectedStyleElements([null]);
      }
    } else {
      setSelectedStyleElements([null]);
    }
  }, [stylingBlocks, document]);

  return <BlockFloatingSelector block={selectedBlock} selectedBlockElement={selectedElements[0]} />;
};

const BlockFloatingSelector = ({ block, selectedBlockElement }: BlockActionProps) => {
  const removeBlock = useRemoveBlocks();
  const duplicateBlock = useDuplicateBlocks();
  const [, setSelectedIds] = useSelectedBlockIds();
  const [, setHighlighted] = useHighlightBlockId();
  const [, setStyleBlocks] = useSelectedStylingBlocks();
  const { hasPermission } = usePermissions();
  const { editingBlockId } = useInlineEditing();
  const { document } = useFrame();

  // * Floating element position and size
  const { floatingStyles, refs, update } = useFloating({
    placement: "top-start",
    middleware: [
      shift({
        boundary: document?.body,
        limiter: limitShift({
          offset: 8,
          mainAxis: true,
          crossAxis: true,
        }),
      }),
      flip({
        boundary: document?.body,
        fallbackPlacements: ["bottom-start", "top-end", "bottom-end", "inside"] as any,
      }),
      size({
        boundary: document?.body,
        apply({ availableWidth, availableHeight, elements }) {
          Object.assign(elements.floating.style, {
            maxWidth: `${Math.max(200, availableWidth)}px`,
            maxHeight: `${Math.max(100, availableHeight)}px`,
          });
        },
      }),
    ],
    elements: { reference: selectedBlockElement },
  });

  useResizeObserver(selectedBlockElement as HTMLElement, () => update(), selectedBlockElement !== null);
  useResizeObserver(document?.body, () => update(), document?.body !== null);

  const parentId: string | undefined | null = get(block, "_parent", null);

  const label: string = isEmpty(get(block, "_name", "")) ? get(block, "_type", "") : get(block, "_name", "");

  // * Updating position of floating element when selected block element changes
  useEffect(() => {
    if (selectedBlockElement) {
      const timer = setTimeout(() => update(), 500);
      return () => clearTimeout(timer);
    } else {
      update();
    }
  }, [selectedBlockElement]);

  if (!selectedBlockElement || !block || editingBlockId) return null;

  // Use global canvas zoom so controls remain readable when canvas scales
  const [zoomPercent] = useCanvasZoom();
  const uiScale = Math.max(zoomPercent || 100, 1) / 100; // 1.0 at 100%

  return (
    <>
      <div
        role="button"
        tabIndex={0}
        ref={refs.setFloating}
        style={floatingStyles}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
        }}
        onMouseEnter={(e) => {
          e.stopPropagation();
          setHighlighted(null);
        }}
        onKeyDown={(e) => e.stopPropagation()}
        className="builder-canvas-action-root isolate z-[999] flex items-center text-xs">
        <div
          className="builder-canvas-action-bar flex h-6 items-center bg-blue-500 py-2 text-white"
          style={{ transform: `scale(${1 / uiScale})`, transformOrigin: "top left" }}>
          {parentId && (
            <ArrowUpIcon
              className="builder-canvas-action-button hover:scale-105"
              onClick={() => {
                setStyleBlocks([]);
                setSelectedIds([parentId]);
              }}
            />
          )}
          <BlockActionLabel label={label} block={block} />

          <div className="builder-canvas-action-buttons flex items-center gap-2 pl-1 pr-1.5">
            <AddBlockDropdown block={block}>
              <PlusIcon className="builder-canvas-action-button hover:scale-105" />
            </AddBlockDropdown>
            {canDuplicateBlock(get(block, "_type", "")) && hasPermission(PERMISSIONS.ADD_BLOCK) ? (
              <CopyIcon className="builder-canvas-action-button hover:scale-105" onClick={() => duplicateBlock([block?._id])} />
            ) : null}
            {canDeleteBlock(get(block, "_type", "")) && hasPermission(PERMISSIONS.DELETE_BLOCK) ? (
              <TrashIcon className="builder-canvas-action-button hover:scale-105" onClick={() => removeBlock([block?._id])} />
            ) : null}

            {hasPermission(PERMISSIONS.MOVE_BLOCK) && <BlockController block={block} updateFloatingBar={update} />}
          </div>
        </div>
      </div>
    </>
  );
};
