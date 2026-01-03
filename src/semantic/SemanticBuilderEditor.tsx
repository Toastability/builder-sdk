/**
 * SemanticBuilderEditor Component
 *
 * Main entry point for the semantic UI builder
 * Combines ResizableLayout, SideNavigation, AppHeader, and PreviewIframe
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import { Save, Settings } from 'lucide-react';
import { ResizableLayout, usePersistedWidth } from './components/ResizableLayout';
import { SideNavigation } from './components/SideNavigation';
import { AppHeader, ActionButton } from './components/AppHeader';
import { PreviewIframe, usePreviewIframe } from './components/PreviewIframe';
import { BasePanel, EmptyState } from './components/BasePanel';
import { ComponentsPanel } from './components/ComponentsPanel';
import { ChatPanel } from './panels/ChatPanel';
import { AIPanel } from './panels/AIPanel';
import { StylePanel } from './panels/StylePanel';
import { SEOPanel } from './panels/SEOPanel';
import { DataPanel } from './panels/DataPanel';
import { LayoutPanel } from './panels/LayoutPanel';
import {
  SemanticBuilderEditorProps,
  PanelType,
  NavigationTab,
} from './types/semantic-builder';

export function SemanticBuilderEditor({
  page,
  websiteId,
  contentBrief,
  onSave,
  onStyleChange: _onStyleChange,
  onChatMessage,
  initialPanel = 'chat',
  initialTab = 'preview',
}: SemanticBuilderEditorProps) {
  // State management
  const [activePanel, setActivePanel] = useState<PanelType>(initialPanel);
  const [activeTab, setActiveTab] = useState<NavigationTab>(initialTab);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [slug, setSlug] = useState(page.slug || '');
  const [title, setTitle] = useState(page.title || '');
  const [seoTitle, setSeoTitle] = useState(page.seo_title || '');
  const [seoDescription, setSeoDescription] = useState(page.seo_description || '');

  // Preview state
  const preview = usePreviewIframe();

  // Persisted layout width
  const [leftWidth, setLeftWidth] = usePersistedWidth('semantic-builder', 30);

  // Generate preview URL
  const previewUrl = useMemo(() => {
    if (!page.id) return null;
    return `/api/preview/${page.id}`;
  }, [page.id]);

  useEffect(() => {
    preview.setUrl(previewUrl);
  }, [previewUrl]);

  // Handle save
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const success = await onSave({
        blocks: page.blocks,
        slug,
        title,
        seo_title: seoTitle,
        seo_description: seoDescription,
      });

      if (success) {
        setLastSaved(new Date());
        preview.refresh();
      }
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      setIsSaving(false);
    }
  }, [page.blocks, slug, title, seoTitle, seoDescription, onSave, preview]);

  // Handle slug change
  const handleSlugChange = useCallback((newSlug: string) => {
    setSlug(newSlug);
    // TODO: Trigger save with new slug
  }, []);

  // Handle title change
  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
  }, []);

  // Handle SEO field changes
  const handleSeoChange = useCallback((field: 'title' | 'description', value: string) => {
    if (field === 'title') {
      setSeoTitle(value);
    } else {
      setSeoDescription(value);
    }
  }, []);

  // Render active panel content
  const renderPanelContent = () => {
    const panelProps = {
      pageId: page.id,
      websiteId,
      blocks: page.blocks,
      onBlocksChange: (newBlocks: any[]) => {
        // TODO: Update blocks and trigger save
        console.log('Blocks changed:', newBlocks);
      },
      seoTitle,
      seoDescription,
      slug,
      contentBrief,
      onSeoChange: handleSeoChange,
      onChatMessage,
    };

    // Debug logging
    console.log('[SemanticBuilderEditor] Panel props:', {
      activePanel,
      page_seo_title: page.seo_title,
      page_seo_description: page.seo_description,
      panelProps_seoTitle: panelProps.seoTitle,
      panelProps_seoDescription: panelProps.seoDescription,
      contentBrief_present: !!contentBrief,
    });

    switch (activePanel) {
      case 'chat':
        return <ChatPanel {...panelProps} />;

      case 'ai':
        return <AIPanel {...panelProps} />;

      case 'style':
        return <StylePanel {...panelProps} />;

      case 'seo':
        return <SEOPanel {...panelProps} />;

      case 'data':
        return <DataPanel {...panelProps} />;

      case 'layout':
        return <LayoutPanel {...panelProps} />;

      default:
        return null;
    }
  };

  // Render active tab content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'templates':
        return (
          <BasePanel
            title="Templates"
            subtitle="Browse and search for page templates"
          >
            <EmptyState
              icon={<div className="text-4xl">📄</div>}
              title="Template Browser"
              description="Browse pre-built page templates and layouts. Select a template to start building your page."
            />
          </BasePanel>
        );

      case 'components':
        return (
          <ComponentsPanel
            pageId={page.id}
            websiteId={websiteId}
            blocks={page.blocks}
            onBlocksChange={(newBlocks) => {
              // TODO: Handle blocks update
              console.log('Blocks updated from ComponentsPanel:', newBlocks);
            }}
          />
        );

      case 'preview':
        return (
          <PreviewIframe
            url={preview.url}
            slug={slug}
            onSlugChange={handleSlugChange}
            isFullscreen={preview.isFullscreen}
            onFullscreenToggle={preview.toggleFullscreen}
            refreshKey={preview.refreshKey}
            onRefresh={preview.refresh}
            isLoading={preview.isLoading}
          />
        );

      default:
        return null;
    }
  };

  // Left panel: SideNavigation + Active Panel
  const leftPanel = (
    <div className="flex h-full">
      {/* Side Navigation */}
      <SideNavigation
        activePanel={activePanel}
        onPanelChange={setActivePanel}
      />

      {/* Active Panel Content */}
      <div className="flex-1 overflow-hidden">
        {renderPanelContent()}
      </div>
    </div>
  );

  // Right panel: Active Tab Content
  const rightPanel = (
    <div className="flex flex-col h-full">
      {/* App Header */}
      <AppHeader
        activeTab={activeTab}
        onTabChange={setActiveTab}
        title={title}
        subtitle={slug || undefined}
        onTitleChange={handleTitleChange}
        actions={
          <>
            <ActionButton
              onClick={handleSave}
              variant="primary"
              disabled={isSaving}
              loading={isSaving}
              icon={<Save className="w-4 h-4" />}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </ActionButton>
            <ActionButton
              onClick={() => console.log('Settings')}
              variant="ghost"
              icon={<Settings className="w-4 h-4" />}
            >
              Settings
            </ActionButton>
          </>
        }
      />

      {/* Active Tab Content */}
      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>

      {/* Status Bar */}
      {lastSaved && (
        <div className="flex-shrink-0 px-4 py-2 border-t border-border bg-muted/50">
          <p className="text-xs text-muted-foreground">
            Last saved: {lastSaved.toLocaleTimeString()}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen w-screen overflow-hidden bg-background">
      <ResizableLayout
        leftPanel={leftPanel}
        rightPanel={rightPanel}
        defaultLeftWidth={leftWidth}
        minLeftWidth={20}
        maxLeftWidth={50}
        onResize={setLeftWidth}
      />
    </div>
  );
}
