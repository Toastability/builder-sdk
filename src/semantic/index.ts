/**
 * Semantic Builder Exports
 *
 * Main entry point for the semantic UI builder system
 */

// Main editor
export { SemanticBuilderEditor } from './SemanticBuilderEditor';

// Components
export { ResizableLayout, usePersistedWidth } from './components/ResizableLayout';
export { SideNavigation, getNavItem, getAllNavItems } from './components/SideNavigation';
export {
  AppHeader,
  ActionButton,
  getTab,
  getAllTabs,
} from './components/AppHeader';
export {
  BasePanel,
  CollapsibleSection,
  EmptyState,
  LoadingState,
} from './components/BasePanel';
export {
  PreviewIframe,
  usePreviewIframe,
} from './components/PreviewIframe';

// Panels
export { ChatPanel } from './panels/ChatPanel';
export { AIPanel } from './panels/AIPanel';
export { StylePanel } from './panels/StylePanel';
export { SEOPanel } from './panels/SEOPanel';
export { DataPanel } from './panels/DataPanel';
export { LayoutPanel } from './panels/LayoutPanel';

// Types
export type {
  PanelType,
  NavigationTab,
  SemanticBuilderEditorProps,
  SideNavItem,
  BasePanelProps,
  ComponentSelection,
  PreviewState,
  SemanticBuilderState,
} from './types/semantic-builder';

export type {
  HSLColor,
  ColorConfig,
  TypographyConfig,
  SpacingConfig,
  StyleConfig,
  StylePreset,
  CSSGenerationOptions,
  ParsedStylesTemplate,
} from './types/style-config';
