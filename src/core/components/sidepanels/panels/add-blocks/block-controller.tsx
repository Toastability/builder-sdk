import { getOrientation } from "@/core/components/canvas/dnd/getOrientation";
import { useFrame } from "@/core/frame/frame-context";
import { useBlocksStore, useBlocksStoreUndoableActions } from "@/core/hooks";
import { ChaiBlock } from "@/types/chai-block";
import { PinBottomIcon, PinLeftIcon, PinRightIcon, PinTopIcon } from "@radix-ui/react-icons";
import { filter, findIndex, get } from "lodash-es";
import { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";

const CONTROLS = [
  { ControlIcon: PinTopIcon, dir: "VERTICAL", key: "UP" },
  { ControlIcon: PinBottomIcon, dir: "VERTICAL", key: "DOWN" },
  { ControlIcon: PinLeftIcon, dir: "HORIZONTAL", key: "LEFT" },
  { ControlIcon: PinRightIcon, dir: "HORIZONTAL", key: "RIGHT" },
];

/**
 *
 * @param parentBlockId
 * @param blockId
 * @param canvasIframe
 * @returns Getting orientation of arrow VERTICAL OR HORIZONTAL
 */
const getParentBlockOrientation = (
  parentBlockId: string | null,
  blockId: string | null,
  canvasIframe: HTMLIFrameElement,
) => {
  try {
    if (!parentBlockId || !canvasIframe) return "VERTICAL";

    const selector = `[data-block-id='${parentBlockId}']`;
    const parentBlock = canvasIframe?.querySelector(selector);
    if (parentBlock) {
      const blockElement = canvasIframe?.querySelector(`[data-block-id='${blockId}']`);
      // * Reusing DND util to get orientation of block
      return getOrientation(parentBlock as HTMLElement, blockElement as HTMLElement).toUpperCase();
    }

    return "VERTICAL";
  } catch (error) {
    return "VERTICAL";
  }
};

/**
 *
 * @param isFirstBlock
 * @param isLastBlock
 * @param dir
 * @returns Checking if moving arrow is disabled
 */
const isDisabledControl = (isFirstBlock: boolean, isLastBlock: boolean, dir: "UP" | "DOWN" | "LEFT" | "RIGHT") => {
  if (isFirstBlock && (dir === "UP" || dir === "LEFT")) return true;
  if (isLastBlock && (dir === "DOWN" || dir === "RIGHT")) return true;
  return false;
};

/**
 *
 * @param block
 * @returns Controller hook to manage movement and calculate direction and ids
 */
const useBlockController = (block: ChaiBlock, updateFloatingBar: any) => {
  const [blocks] = useBlocksStore();
  const { document: canvasIframe } = useFrame();
  const { moveBlocks } = useBlocksStoreUndoableActions();

  // * Parent Block
  const blockId = get(block, "_id");
  const parentBlockId = get(block, "_parent");

  // * Ancestor Blocks
  const ancestorBlocks = filter(blocks, (thisBlock: ChaiBlock) => {
    if (!parentBlockId) return !get(thisBlock, "_parent");
    return get(thisBlock, "_parent") === parentBlockId;
  });

  // * Current Block Details
  const isOnlyChild = ancestorBlocks?.length <= 1;
  const blockIndex = findIndex(ancestorBlocks, { _id: blockId });
  const isFirstBlock = blockIndex <= 0;
  const isLastBlock = blockIndex + 1 === ancestorBlocks?.length;

  // * Block Orientations
  const orientation = getParentBlockOrientation(parentBlockId, blockId, canvasIframe);

  // * Move block wrapper functions for all sides
  const moveBlock = useCallback(
    (dir: "UP" | "DOWN" | "LEFT" | "RIGHT") => {
      if (isDisabledControl(isFirstBlock, isLastBlock, dir) || isOnlyChild) return;

      if (dir === "UP" || dir === "LEFT") {
        moveBlocks([blockId], parentBlockId || null, blockIndex - 1);
      } else if (dir === "DOWN" || dir === "RIGHT") {
        moveBlocks([blockId], parentBlockId || null, blockIndex + 2);
      }
      updateFloatingBar();
    },
    [isFirstBlock, isLastBlock, isOnlyChild, blockIndex, blockId, parentBlockId, updateFloatingBar],
  );

  // * Use shfit + [arrow] keyboard actions to move block in [orientation]
  useHotkeys(
    "shift+up, shift+down, shift+left, shift+right",
    ({ key }) => {
      // * Logic to get direction of key : ArrowRight -> Arrow -> ARROW
      moveBlock(key?.replace("Arrow", "")?.toUpperCase() as any);
    },
    { document: canvasIframe?.contentDocument },
    [moveBlock],
  );

  // * Returns
  return { isOnlyChild, isFirstBlock, isLastBlock, moveBlock, orientation };
};

/**
 *
 * @param params
 * @returns Block Arrows to move their position
 */
const BlockController = ({ block, updateFloatingBar }: { block: ChaiBlock; updateFloatingBar: any }) => {
  const { isOnlyChild, isFirstBlock, isLastBlock, moveBlock, orientation } = useBlockController(
    block,
    updateFloatingBar,
  );

  if (isOnlyChild) return null;

  return (
    <>
      {/* CONTROLLERS ARROW BASED ON ORIENTATION */}
      {CONTROLS.map(({ ControlIcon, dir, key }) => {
        if (orientation !== dir) return null;
        const isDisabled = isDisabledControl(isFirstBlock, isLastBlock, key as any);
        if (isDisabled) return null;
        return (
          <ControlIcon
            key={key}
            onClick={() => moveBlock(key as any)}
            className={`${isDisabled ? "pointer-events-none cursor-not-allowed opacity-50" : "duration-300 hover:scale-95 hover:opacity-80"} builder-sdk-block-controller-btn`}
          />
        );
      })}
    </>
  );
};

export default BlockController;
