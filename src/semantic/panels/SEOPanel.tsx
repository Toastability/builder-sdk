/**
 * SEOPanel Component
 *
 * SEO management: meta tags, structured data, and sitemap
 * TODO: Implement SEO editing with backend integration
 */

import { useState, useEffect } from "react";
import { Code } from "lucide-react";
import { BasePanel, CollapsibleSection } from "../components/BasePanel";
import { BasePanelProps } from "../types/semantic-builder";

interface SEOPanelProps extends BasePanelProps {}

export function SEOPanel({
  pageId: _pageId,
  websiteId: _websiteId,
  activeSite,
  blocks: _blocks,
  onBlocksChange: _onBlocksChange,
  seoTitle,
  seoDescription,
  slug,
  contentBrief: _contentBrief,
  onSeoChange,
}: SEOPanelProps) {
  const [seoData, setSeoData] = useState({
    title: seoTitle || "",
    description: seoDescription || "",
  });

  // Update state when props change (e.g., when page data loads)
  useEffect(() => {
    setSeoData({
      title: seoTitle || "",
      description: seoDescription || "",
    });
  }, [seoTitle, seoDescription]);

  const handleChange = (field: string, value: string) => {
    setSeoData((prev) => ({ ...prev, [field]: value }));

    // Notify parent component of SEO field changes
    if (onSeoChange && (field === "title" || field === "description")) {
      onSeoChange(field, value);
    }
  };

  const characterCount = (text: string, max: number) => {
    const isOverLimit = text.length > max;
    return (
      <span className={`text-xs ${isOverLimit ? "text-destructive" : "text-muted-foreground"}`}>
        {text.length}/{max}
      </span>
    );
  };

  return (
    <BasePanel title="SEO Manager" subtitle="Meta tags, structured data, and sitemap" showHeader={false}>
      <div className="flex h-full flex-col">
        <div className="flex-1 overflow-y-auto">
          <div className="space-y-4 p-4">
            {/* Preview */}
            <CollapsibleSection title="Search Preview">
              <div className="space-y-2 rounded-md bg-muted p-3">
                <div className="overflow-hidden truncate text-ellipsis font-mono text-xs text-muted-foreground">
                  {activeSite?.label || "yoursite.com"}
                  {slug ? ` › ${slug}` : ""}
                </div>
                <div className="text-sm font-medium text-primary">{seoData.title || "Page Title"}</div>
                <div className="text-xs text-muted-foreground">
                  {seoData.description || "Meta description will appear here..."}
                </div>
              </div>
            </CollapsibleSection>

            {/* Basic Meta Tags */}
            <CollapsibleSection title="Basic Meta Tags" defaultCollapsed={false}>
              <div className="space-y-4">
                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Page Title</label>
                    {characterCount(seoData.title, 60)}
                  </div>
                  <input
                    type="text"
                    value={seoData.title}
                    onChange={(e) => handleChange("title", e.target.value)}
                    placeholder="Enter page title..."
                    className="w-full rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Optimal: 50-60 characters</p>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-sm font-medium text-foreground">Meta Description</label>
                    {characterCount(seoData.description, 160)}
                  </div>
                  <textarea
                    value={seoData.description}
                    onChange={(e) => handleChange("description", e.target.value)}
                    placeholder="Enter meta description..."
                    rows={3}
                    className="w-full resize-none rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">Optimal: 150-160 characters</p>
                </div>
              </div>
            </CollapsibleSection>

            {/* Structured Data */}
            <CollapsibleSection title="Structured Data (JSON-LD)">
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Structured data will be auto-generated based on page content and type. Manual editing will be
                  available in a future update.
                </p>

                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">LocalBusiness</span>
                  <span className="text-xs text-muted-foreground">Auto-generated</span>
                </div>

                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">WebPage</span>
                  <span className="text-xs text-muted-foreground">Auto-generated</span>
                </div>

                <div className="flex items-center gap-2">
                  <Code className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">Organization</span>
                  <span className="text-xs text-muted-foreground">Auto-generated</span>
                </div>
              </div>
            </CollapsibleSection>
          </div>
        </div>
      </div>
    </BasePanel>
  );
}
