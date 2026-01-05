/**
 * SEOPanel Component
 *
 * SEO management: meta tags, structured data, and sitemap
 * TODO: Implement SEO editing with backend integration
 */

import { useState, useEffect, useMemo } from "react";
import { Code, Globe } from "lucide-react";
import { BasePanel, CollapsibleSection } from "../components/BasePanel";
import { BasePanelProps } from "../types/semantic-builder";
import { useOpenGraphExtractor } from "@opensite/hooks";

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

  // Construct full page URL for OpenGraph extraction
  const pageUrl = useMemo(() => {
    if (!activeSite?.label || !slug) return null;

    // Ensure URL has protocol
    const domain = activeSite.label.startsWith("http") ? activeSite.label : `https://${activeSite.label}`;

    // Remove trailing slash from domain
    const cleanDomain = domain.replace(/\/$/, "");

    // Add leading slash to slug if needed
    const cleanSlug = slug.startsWith("/") ? slug : `/${slug}`;

    return `${cleanDomain}${cleanSlug}`;
  }, [activeSite?.label, slug]);

  // Extract OpenGraph data using the hook
  const { data: openGraphData, loading: ogLoading } = useOpenGraphExtractor({
    url: pageUrl || "",
    enabled: !!pageUrl,
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
            {/* Search Preview */}
            <CollapsibleSection title="Search Preview">
              <div className="space-y-2 rounded-none bg-white p-0">
                {/* URL breadcrumb */}
                <div className="overflow-hidden truncate text-ellipsis font-mono text-xs text-muted-foreground">
                  {activeSite?.label || "yoursite.com"}
                  {slug ? ` / ${slug.replace(/^\//, "")}` : ""}
                </div>

                {/* Search result preview with favicon */}
                <div className="flex items-start gap-2">
                  {/* Favicon */}
                  <div className="mt-0.5 flex-shrink-0">
                    {ogLoading ? (
                      <div className="h-4 w-4 animate-pulse rounded-sm bg-muted-foreground/20" />
                    ) : openGraphData?.favicon ? (
                      <img
                        src={openGraphData.favicon}
                        alt="Site favicon"
                        className="h-6 w-6 rounded-sm object-contain"
                        onError={(e) => {
                          // Hide on error
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <Globe className="h-4 w-4 text-muted-foreground/50" />
                    )}
                  </div>

                  {/* Title and description */}
                  <div className="min-w-0 flex-1">
                    <a
                      href={`https://${activeSite?.label || ""}${slug || ""}`}
                      target="_blank"
                      className="truncate text-xs font-bold text-primary underline">
                      {seoData.title || "Page Title"}
                    </a>
                    <div className="mt-0.5 text-xs text-muted-foreground">
                      {seoData.description || "Meta description will appear here..."}
                    </div>
                  </div>
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

            {/* Open Graph */}
            <CollapsibleSection title="Open Graph">
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Open Graph tags control how your page appears when shared on social media platforms like Facebook,
                  Twitter, and LinkedIn.
                </p>

                {/* Open Graph Image */}
                {ogLoading ? (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">Preview Image</div>
                    <div className="aspect-video w-full animate-pulse rounded-md bg-muted-foreground/20" />
                  </div>
                ) : openGraphData?.image ? (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">Preview Image</div>
                    <div className="overflow-hidden rounded-md border border-border bg-muted">
                      <img
                        src={openGraphData.image}
                        alt="Open Graph preview"
                        className="h-auto w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.parentElement!.innerHTML =
                            '<div class="aspect-video flex items-center justify-center text-muted-foreground text-sm">Failed to load image</div>';
                        }}
                      />
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Code className="h-3 w-3" />
                      <span>og:image</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="text-sm font-medium text-foreground">Preview Image</div>
                    <div className="aspect-video flex w-full items-center justify-center rounded-md border border-dashed border-border bg-muted/50">
                      <div className="text-center text-muted-foreground">
                        <Globe className="mx-auto mb-2 h-8 w-8 opacity-50" />
                        <p className="text-xs">No Open Graph image found</p>
                        <p className="mt-1 text-xs">Custom upload coming soon</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional OG data if available */}
                {openGraphData?.siteName && (
                  <div className="flex items-center gap-2 text-xs">
                    <Code className="h-3 w-3 text-muted-foreground" />
                    <span className="text-muted-foreground">og:site_name:</span>
                    <span className="text-foreground">{openGraphData.siteName}</span>
                  </div>
                )}
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
