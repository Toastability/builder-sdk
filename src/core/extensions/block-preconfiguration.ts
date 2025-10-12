import { useSyncExternalStore } from "react";
import type { ChaiBlock } from "@/types/chai-block";
import type { ChaiLibrary, ChaiLibraryBlock } from "@/types/chaibuilder-editor-props";

export type BlockPreconfigurationContext = {
  block: ChaiLibraryBlock;
  library: ChaiLibrary;
  parentId?: string;
  position?: number;
  /**
   * Loads the UI library block template.
   * Returns the original HTML (when available) along with the parsed Chai blocks.
   */
  loadTemplate: () => Promise<{ html?: string | null; blocks: ChaiBlock[] }>;
  /**
   * Adds the configured block(s) to the canvas. Implementations should call this
   * once the template has been hydrated with user-provided values.
   */
  insertConfiguredBlock: (blocks: ChaiBlock[]) => Promise<ChaiBlock | undefined>;
  /**
   * Closes the add-blocks panel so the configuration pane can take over focus.
   */
  closeLibraryPanel: () => void;
};

export type BlockPreconfigurationHandler = (
  context: BlockPreconfigurationContext,
) => Promise<boolean> | boolean;

let handler: BlockPreconfigurationHandler | null = null;
const subscribers = new Set<() => void>();

export const registerBlockPreconfiguration = (
  nextHandler: BlockPreconfigurationHandler | null,
) => {
  handler = nextHandler;
  subscribers.forEach((callback) => {
    try {
      callback();
    } catch {
      // no-op - avoid breaking other subscribers
    }
  });
};

export const resetBlockPreconfiguration = () => {
  registerBlockPreconfiguration(null);
};

const subscribe = (callback: () => void) => {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
};

const getSnapshot = () => handler;

export const useBlockPreconfigurationHandler = () =>
  useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
