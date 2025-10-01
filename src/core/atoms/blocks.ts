import { convertToBlocksTree } from "@/core/functions/blocks-fn";
import { atom } from "jotai";
import { splitAtom } from "jotai/utils";
import { filter, has } from "lodash-es";

// derived atoms
// Dev-only debug toggle
const __SDK_DEBUG = typeof process !== 'undefined' && (process as any).env && (process as any).env.NEXT_PUBLIC_BUILDER_DEBUG;

// Signature helper for cheap diffing
const __sigBlocks = (blocks: any[]): string => {
  if (!Array.isArray(blocks)) return 'len:0';
  const ids = blocks.map((b) => b && (b as any)._id).filter(Boolean);
  const first = (ids[0] as string) || '';
  const last = (ids[ids.length - 1] as string) || '';
  return `len:${blocks.length}|first:${first}|last:${last}|ids:${ids.join(',')}`;
};

// Replace simple atom([]) with a derived atom to intercept writes for diagnostics
// Note: functional updates are preserved; behavior remains identical except for dev-only logging
// @ts-ignore - keep loose typing to match existing usages without import churn
const _presentBlocksBase = atom<any[]>([]);
export const presentBlocksAtom = atom(
  (get) => get(_presentBlocksBase),
  (get, set, update: any) => {
    const prev = get(_presentBlocksBase);
    const next = typeof update === 'function' ? update(prev) : update;
    if (__SDK_DEBUG) {
      try {
        const prevSig = __sigBlocks(prev);
        const nextSig = __sigBlocks(next);
        if (prevSig !== nextSig) {
          const prevIds = new Set((prev || []).map((b: any) => b && b._id).filter(Boolean));
          const nextIds = new Set((next || []).map((b: any) => b && b._id).filter(Boolean));
          let added = 0, removed = 0;
          for (const id of nextIds) if (!prevIds.has(id)) added++;
          for (const id of prevIds) if (!nextIds.has(id)) removed++;
          // eslint-disable-next-line no-console
          console.debug('[SDK][presentBlocksAtom] set', { prevSig, nextSig, addedCount: added, removedCount: removed });
        } else {
          // eslint-disable-next-line no-console
          console.debug('[SDK][presentBlocksAtom] set (no sig change)', { sig: nextSig });
        }
      } catch {}
    }
    set(_presentBlocksBase, next);
  }
);
presentBlocksAtom.debugLabel = "presentBlocksAtom";

//TODO: Need a better name for this atom. Also should be a custom hook
export const treeDSBlocks = atom((get) => {
  const presentBlocks = get(presentBlocksAtom);
  return convertToBlocksTree([...presentBlocks]);
});
treeDSBlocks.debugLabel = "treeDSBlocks";

export const pageBlocksAtomsAtom = splitAtom(presentBlocksAtom);
pageBlocksAtomsAtom.debugLabel = "pageBlocksAtomsAtom";

export const builderActivePageAtom = atom<string>("");
builderActivePageAtom.debugLabel = "builderActivePageAtom";

export const destinationDropIndexAtom = atom<number>(-1);
destinationDropIndexAtom.debugLabel = "destinationDropIndexAtom";

export const buildingBlocksAtom: any = atom<Array<any>>([]);
buildingBlocksAtom.debugLabel = "buildingBlocksAtom";

export const globalBlocksAtom = atom<Array<any>>((get) => {
  const globalBlocks = get(buildingBlocksAtom) as Array<any>;
  return filter(globalBlocks, (block) => has(block, "blockId"));
});
globalBlocksAtom.debugLabel = "globalBlocksAtom";
