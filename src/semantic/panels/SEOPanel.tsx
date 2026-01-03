/**
 * SEOPanel Component
 *
 * SEO management: meta tags, structured data, and sitemap
 * TODO: Implement SEO editing with backend integration
 */

import { useState, useEffect } from 'react';
import { Code } from 'lucide-react';
import { BasePanel, CollapsibleSection } from '../components/BasePanel';
import { BasePanelProps } from '../types/semantic-builder';

interface SEOPanelProps extends BasePanelProps {}

export function SEOPanel({
  pageId: _pageId,
  websiteId: _websiteId,
  blocks: _blocks,
  onBlocksChange: _onBlocksChange,
  seoTitle,
  seoDescription,
  contentBrief,
}: SEOPanelProps) {
  // Extract keywords from content brief if available
  const initialKeywords = contentBrief?.secondary_keywords?.join(', ') || '';

  const [seoData, setSeoData] = useState({
    title: seoTitle || '',
    description: seoDescription || '',
    keywords: initialKeywords,
    ogTitle: seoTitle || '',
    ogDescription: seoDescription || '',
  });

  // Debug logging
  useEffect(() => {
    console.log('[SEOPanel] Props received:', {
      seoTitle,
      seoDescription,
      contentBrief: contentBrief ? 'present' : 'null/undefined',
      hasSecondaryKeywords: !!contentBrief?.secondary_keywords,
    });
  }, [seoTitle, seoDescription, contentBrief]);

  // Update state when props change (e.g., when page data loads)
  useEffect(() => {
    console.log('[SEOPanel] useEffect triggered, updating state with:', {
      seoTitle,
      seoDescription,
      hasContentBrief: !!contentBrief,
    });

    // Always update if we have any data, even if just empty strings
    setSeoData((prev) => {
      const newData = {
        ...prev,
        title: seoTitle || prev.title,
        description: seoDescription || prev.description,
        keywords: contentBrief?.secondary_keywords?.join(', ') || prev.keywords,
        ogTitle: seoTitle || prev.ogTitle,
        ogDescription: seoDescription || prev.ogDescription,
      };
      console.log('[SEOPanel] Setting seoData to:', newData);
      return newData;
    });
  }, [seoTitle, seoDescription, contentBrief]);

  const handleChange = (field: string, value: string) => {
    setSeoData((prev) => ({ ...prev, [field]: value }));
    // TODO: Trigger auto-save or debounced save
  };

  const characterCount = (text: string, max: number) => {
    const isOverLimit = text.length > max;
    return (
      <span
        className={`text-xs ${
          isOverLimit ? 'text-destructive' : 'text-muted-foreground'
        }`}
      >
        {text.length}/{max}
      </span>
    );
  };

  return (
    <BasePanel
      title="SEO Manager"
      subtitle="Meta tags, structured data, and sitemap"
    >
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Basic Meta Tags */}
            <CollapsibleSection title="Basic Meta Tags" defaultCollapsed={false}>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-foreground">
                      Page Title
                    </label>
                    {characterCount(seoData.title, 60)}
                  </div>
                  <input
                    type="text"
                    value={seoData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    placeholder="Enter page title..."
                    className="
                      w-full px-3 py-2 rounded-md
                      bg-muted text-foreground text-sm
                      border border-border
                      outline-none
                      focus:ring-2 focus:ring-primary
                    "
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Optimal: 50-60 characters
                  </p>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-sm font-medium text-foreground">
                      Meta Description
                    </label>
                    {characterCount(seoData.description, 160)}
                  </div>
                  <textarea
                    value={seoData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    placeholder="Enter meta description..."
                    rows={3}
                    className="
                      w-full px-3 py-2 rounded-md
                      bg-muted text-foreground text-sm
                      border border-border
                      resize-none outline-none
                      focus:ring-2 focus:ring-primary
                    "
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Optimal: 150-160 characters
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    Keywords
                  </label>
                  <input
                    type="text"
                    value={seoData.keywords}
                    onChange={(e) => handleChange('keywords', e.target.value)}
                    placeholder="keyword1, keyword2, keyword3..."
                    className="
                      w-full px-3 py-2 rounded-md
                      bg-muted text-foreground text-sm
                      border border-border
                      outline-none
                      focus:ring-2 focus:ring-primary
                    "
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Comma-separated list of keywords
                  </p>
                </div>
              </div>
            </CollapsibleSection>

            {/* Open Graph */}
            <CollapsibleSection title="Open Graph (Social Sharing)">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    OG Title
                  </label>
                  <input
                    type="text"
                    value={seoData.ogTitle}
                    onChange={(e) => handleChange('ogTitle', e.target.value)}
                    placeholder="Title for social media..."
                    className="
                      w-full px-3 py-2 rounded-md
                      bg-muted text-foreground text-sm
                      border border-border
                      outline-none
                      focus:ring-2 focus:ring-primary
                    "
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">
                    OG Description
                  </label>
                  <textarea
                    value={seoData.ogDescription}
                    onChange={(e) => handleChange('ogDescription', e.target.value)}
                    placeholder="Description for social media..."
                    rows={2}
                    className="
                      w-full px-3 py-2 rounded-md
                      bg-muted text-foreground text-sm
                      border border-border
                      resize-none outline-none
                      focus:ring-2 focus:ring-primary
                    "
                  />
                </div>
              </div>
            </CollapsibleSection>

            {/* Structured Data */}
            <CollapsibleSection title="Structured Data (JSON-LD)">
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Structured data will be auto-generated based on page content and
                  type. Manual editing will be available in a future update.
                </p>

                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">LocalBusiness</span>
                  <span className="text-xs text-muted-foreground">Auto-generated</span>
                </div>

                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">WebPage</span>
                  <span className="text-xs text-muted-foreground">Auto-generated</span>
                </div>

                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">Organization</span>
                  <span className="text-xs text-muted-foreground">Auto-generated</span>
                </div>
              </div>
            </CollapsibleSection>

            {/* Preview */}
            <CollapsibleSection title="Search Preview">
              <div className="p-3 bg-muted rounded-md space-y-2">
                <div className="text-xs text-muted-foreground font-mono">
                  www.example.com › page-slug
                </div>
                <div className="text-sm text-primary font-medium">
                  {seoData.title || 'Page Title'}
                </div>
                <div className="text-xs text-muted-foreground">
                  {seoData.description || 'Meta description will appear here...'}
                </div>
              </div>
            </CollapsibleSection>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex-shrink-0 p-4 border-t border-border">
          <div className="flex items-center gap-2">
            <button
              className="
                flex-1 px-4 py-2 rounded-md
                bg-primary text-primary-foreground
                hover:bg-primary/90
                transition-colors
                text-sm font-medium
              "
            >
              Save SEO Settings
            </button>
            <button
              className="
                px-4 py-2 rounded-md
                text-muted-foreground
                hover:bg-accent hover:text-foreground
                transition-colors
                text-sm
              "
            >
              Reset
            </button>
          </div>
        </div>
      </div>
    </BasePanel>
  );
}
