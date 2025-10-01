import { insertBlocksAtPosition } from "@/core/history/insert-block-at-position";
import { moveBlocksWithChildren } from "@/core/history/move-blocks-with-children";
import { useBlocksStore } from "@/core/history/use-blocks-store-undoable-actions";
import { useBroadcastChannel } from "@/core/hooks/use-broadcast-channel";
import { removeNestedBlocks } from "@/core/hooks/use-remove-blocks";
import { useUpdateBlockAtom } from "@/core/hooks/use-update-block-atom";
import { ChaiBlock } from "@/types/chai-block";
import { each, find, omit } from "lodash-es";

export const useBlocksStoreManager = () => {
  const [, setBlocks] = useBlocksStore();
  const { postMessage } = useBroadcastChannel();
  const updateBlockAtom = useUpdateBlockAtom();
  const DEBUG = typeof process !== 'undefined' && (process as any).env && (process as any).env.NEXT_PUBLIC_BUILDER_DEBUG;
  const sig = (blocks: ChaiBlock[]) => {
    if (!Array.isArray(blocks)) return 'len:0';
    const ids = blocks.map((b) => b && b._id).filter(Boolean);
    const first = (ids[0] as string) || '';
    const last = (ids[ids.length - 1] as string) || '';
    return `len:${blocks.length}|first:${first}|last:${last}`;
  };
  return {
    setNewBlocks: (newBlocks: ChaiBlock[]) => {
      if (DEBUG) {
        try {
          // eslint-disable-next-line no-console
          console.debug('[SDK][manager.setNewBlocks]', { count: newBlocks?.length ?? 0, sig: sig(newBlocks) });
        } catch {}
      }
      setBlocks(newBlocks);
      postMessage({ type: "blocks-updated", blocks: newBlocks });
    },
    addBlocks: (newBlocks: ChaiBlock[], parent?: string, position?: number) => {
      if (DEBUG) {
        try {
          // eslint-disable-next-line no-console
          console.debug('[SDK][manager.addBlocks]', { count: newBlocks?.length ?? 0, parent: parent ?? null, position: position ?? null, sig: sig(newBlocks) });
        } catch {}
      }
      setBlocks((prevBlocks) => {
        const blocks = insertBlocksAtPosition(prevBlocks, newBlocks, parent, position);
        postMessage({ type: "blocks-updated", blocks });
        return blocks;
      });
    },
    removeBlocks: (blockIds: string[]) => {
      if (DEBUG) {
        try {
          // eslint-disable-next-line no-console
          console.debug('[SDK][manager.removeBlocks]', { ids: blockIds, count: blockIds?.length ?? 0 });
        } catch {}
      }
      setBlocks((prevBlocks) => {
        const blocks = removeNestedBlocks(prevBlocks, blockIds);
        postMessage({ type: "blocks-updated", blocks });
        return blocks;
      });
    },
    moveBlocks: (blockIds: string[], newParent: string | null, position: number) => {
      if (DEBUG) {
        try {
          // eslint-disable-next-line no-console
          console.debug('[SDK][manager.moveBlocks]', { ids: blockIds, newParent, position });
        } catch {}
      }
      setBlocks((prevBlocks) => {
        let blocks = [...prevBlocks];
        for (let i = 0; i < blockIds.length; i++) {
          blocks = moveBlocksWithChildren(blocks, blockIds[i], newParent, position);
        }
        each(blockIds, (id: string) => {
          const block = find(blocks, (b) => b._id === id);
          if (block) {
            updateBlockAtom({ id, props: { _parent: block._parent || null } });
          }
        });
        postMessage({ type: "blocks-updated", blocks });
        return blocks;
      });
    },
    updateBlocksProps: (blocks: Partial<ChaiBlock>[]) => {
      if (DEBUG) {
        try {
          // eslint-disable-next-line no-console
          console.debug('[SDK][manager.updateBlocksProps]', { count: blocks?.length ?? 0 });
        } catch {}
      }
      blocks.forEach((block) => {
        const updatedBlock = omit(block, "_id");
        updateBlockAtom({ id: block._id, props: updatedBlock });
      });
      postMessage({ type: "blocks-props-updated", blocks });
    },
  };
};
