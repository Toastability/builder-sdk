/**
 * Semantic Builder Types
 *
 * TypeScript interfaces for the semantic UI builder system
 */

import { ChaiBlock } from '../../types/chai-block';

/**
 * Panel types available in the semantic builder
 */
export type PanelType = 'chat' | 'ai' | 'style' | 'seo' | 'data' | 'layout';

/**
 * Navigation tabs in the app header
 */
export type NavigationTab = 'templates' | 'components' | 'preview';

/**
 * Props for the main SemanticBuilderEditor component
 */
export interface SemanticBuilderEditorProps {
  /** Current page data */
  page: {
    id: string | number;
    blocks: ChaiBlock[];
    slug: string;
    title: string;
    seo_title?: string;
    seo_description?: string;
  };

  /** Website ID for context */
  websiteId: string | number;

  /** Optional content brief data for SEO panel */
  contentBrief?: any;

  /** Callback when page is saved */
  onSave: (data: {
    blocks: ChaiBlock[];
    theme?: any;
    slug?: string;
    title?: string;
    seo_title?: string;
    seo_description?: string;
  }) => Promise<boolean>;

  /** Callback when style changes */
  onStyleChange?: (styleConfig: any) => void;

  /** Optional initial active panel */
  initialPanel?: PanelType;

  /** Optional initial active tab */
  initialTab?: NavigationTab;
}

/**
 * Side navigation item
 */
export interface SideNavItem {
  type: PanelType;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  tooltip: string;
}

/**
 * Base panel props that all panels receive
 */
export interface BasePanelProps {
  pageId: string | number;
  websiteId: string | number;
  blocks: ChaiBlock[];
  onBlocksChange?: (blocks: ChaiBlock[]) => void;
  seoTitle?: string;
  seoDescription?: string;
  contentBrief?: any;
  onSeoChange?: (field: 'title' | 'description', value: string) => void;
}

/**
 * Component selection result from ComponentPicker
 */
export interface ComponentSelection {
  componentId: string;
  displayName: string;
  category: string;
  importPath: string;
  propsSchema: Record<string, any>;
  semanticTags: string[];
}

/**
 * Preview state
 */
export interface PreviewState {
  isLoading: boolean;
  url: string | null;
  refreshKey: number;
  isFullscreen: boolean;
}

/**
 * Builder state atom structure
 */
export interface SemanticBuilderState {
  activePanel: PanelType;
  activeTab: NavigationTab;
  preview: PreviewState;
  isSaving: boolean;
  lastSaved: Date | null;
}
