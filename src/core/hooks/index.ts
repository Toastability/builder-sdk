import { useBlocksStore } from "@/core/history/use-blocks-store-undoable-actions";
import { useUndoManager } from "@/core/history/use-undo-manager";
import { useAddBlock } from "@/core/hooks/use-add-block";
import { useAddClassesToBlocks } from "@/core/hooks/use-add-classes-to-blocks";
import { useAskAi } from "@/core/hooks/use-ask-ai";
import { useBlockHighlight } from "@/core/hooks/use-block-highlight";
import { useBrandingOptions } from "@/core/hooks/use-branding-options";
import { useBuilderProp } from "@/core/hooks/use-builder-prop";
import { useBuilderReset } from "@/core/hooks/use-builder-reset";
import { useCanvasZoom } from "@/core/hooks/use-canvas-zoom";
import { useCodeEditor } from "@/core/hooks/use-code-editor";
import { useCopyBlocks } from "@/core/hooks/use-copy-blockIds";
import { useCopyToClipboard } from "@/core/hooks/use-copy-to-clipboard";
import { useCurrentPage } from "@/core/hooks/use-current-page";
import { useCutBlockIds } from "@/core/hooks/use-cut-blockIds";
import { useDarkMode } from "@/core/hooks/use-dark-mode";
import { useDuplicateBlocks } from "@/core/hooks/use-duplicate-blocks";
import { useHiddenBlockIds } from "@/core/hooks/use-hidden-blocks";
import { useHighlightBlockId } from "@/core/hooks/use-highlight-blockId";
import { useLanguages } from "@/core/hooks/use-languages";
import { useLibraryBlocks } from "@/core/hooks/use-library-blocks";
import { usePartialBlocksList, usePartialBlocksStore } from "@/core/hooks/use-partial-blocks-store";
import { usePasteBlocks } from "@/core/hooks/use-paste-blocks";
import { usePermissions } from "@/core/hooks/use-permissions";
import { usePreviewMode } from "@/core/hooks/use-preview-mode";
import { useRemoveBlocks } from "@/core/hooks/use-remove-blocks";
import { useRemoveAllClassesForBlock, useRemoveClassesFromBlocks } from "@/core/hooks/use-remove-classes-from-blocks";
import { useResetBlockStyles } from "@/core/hooks/use-reset-block-styles";
import { useSavePage } from "@/core/hooks/use-save-page";
import { useSelectedBlockAllClasses, useSelectedBlockCurrentClasses } from "@/core/hooks/use-select-block-classes";
import {
  useSelectedBlock,
  useSelectedBlockIds,
  useSelectedBlocksDisplayChild,
} from "@/core/hooks/use-selected-blockIds";
import { useSelectedBreakpoints } from "@/core/hooks/use-selected-breakpoints";
import { useSelectedStylingBlocks } from "@/core/hooks/use-selected-styling-blocks";
import { useStylingBreakpoint } from "@/core/hooks/use-styling-breakpoint";
import { useStylingState } from "@/core/hooks/use-styling-state";
import { useRightPanel, useTheme, useThemeOptions } from "@/core/hooks/use-theme";
import { useUpdateBlocksProps, useUpdateBlocksPropsRealtime } from "@/core/hooks/use-update-blocks-props";
import { useWrapperBlock } from "@/core/hooks/use-wrapper-block";
import { useTranslation } from "react-i18next";
import { useInlineEditing } from "./use-inline-editing";
import { useIsPageLoaded } from "@/core/hooks/use-is-page-loaded";
import { atom, useAtom } from "jotai";

// Atom to trigger a transient pulse highlight on the Components sidebar button
export const componentsButtonPulseAtom = atom<number>(0);
componentsButtonPulseAtom.debugLabel = "componentsButtonPulseAtom";
export const useComponentsButtonPulse = () => useAtom(componentsButtonPulseAtom);
export { useBlocksStoreUndoableActions } from "@/core/history/use-blocks-store-undoable-actions";
export { useCanvasDisplayWidth, useScreenSizeWidth } from "@/core/hooks/use-screen-size-width";
export { useSelectedLibrary } from "@/core/hooks/use-selected-library";
export { useSidebarActivePanel } from "@/core/hooks/use-sidebar-active-panel";

export {
  useAddBlock,
  useAddClassesToBlocks,
  useAskAi,
  useBlockHighlight,
  useBlocksStore,
  useBrandingOptions,
  useBuilderProp,
  useBuilderReset,
  useCanvasZoom,
  useCodeEditor,
  useCopyBlocks as useCopyBlockIds,
  useCopyToClipboard,
  useCurrentPage,
  useCutBlockIds,
  useDarkMode,
  useDuplicateBlocks,
  useHiddenBlockIds,
  useHighlightBlockId,
  useInlineEditing,
  useLanguages,
  useLibraryBlocks,
  usePartialBlocksStore as usePartailBlocksStore,
  usePartialBlocksList,
  usePasteBlocks,
  usePermissions,
  usePreviewMode,
  useRemoveBlocks,
  useRemoveClassesFromBlocks,
  useRemoveAllClassesForBlock,
  useResetBlockStyles,
  useRightPanel,
  useSavePage,
  useSelectedBlock,
  useSelectedBlockAllClasses,
  useSelectedBlockCurrentClasses,
  useSelectedBlockIds,
  useSelectedBlocksDisplayChild,
  useSelectedBreakpoints,
  useSelectedStylingBlocks,
  useStylingBreakpoint,
  useStylingState,
  useTheme,
  useThemeOptions,
  useTranslation,
  useUndoManager,
  useUpdateBlocksProps,
  useUpdateBlocksPropsRealtime,
  useWrapperBlock,
  useIsPageLoaded,
};
