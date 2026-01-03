/**
 * PreviewIframe Component
 *
 * Renders page preview in sandboxed iframe
 * Adapted from v0-clone WebPreview pattern
 */

import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, Maximize2, Minimize2, ExternalLink } from 'lucide-react';

interface PreviewIframeProps {
  /** Preview URL to render */
  url: string | null;

  /** Page slug/path to display */
  slug?: string;

  /** Callback when slug is edited */
  onSlugChange?: (slug: string) => void;

  /** Whether preview is in fullscreen mode */
  isFullscreen?: boolean;

  /** Toggle fullscreen mode */
  onFullscreenToggle?: () => void;

  /** Refresh key to force iframe reload */
  refreshKey?: number;

  /** Callback to trigger refresh */
  onRefresh?: () => void;

  /** Loading state */
  isLoading?: boolean;

  /** CSS classes for container */
  className?: string;
}

export function PreviewIframe({
  url,
  slug = '',
  onSlugChange,
  isFullscreen = false,
  onFullscreenToggle,
  refreshKey = 0,
  onRefresh,
  isLoading = false,
  className = '',
}: PreviewIframeProps) {
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [draftSlug, setDraftSlug] = useState(slug);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync slug with prop
  useEffect(() => {
    setDraftSlug(slug);
  }, [slug]);

  // Focus input when editing
  useEffect(() => {
    if (isEditingSlug && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingSlug]);

  const handleSlugSubmit = () => {
    setIsEditingSlug(false);
    if (draftSlug !== slug) {
      onSlugChange?.(draftSlug);
    }
  };

  const handleSlugKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSlugSubmit();
    } else if (e.key === 'Escape') {
      setDraftSlug(slug);
      setIsEditingSlug(false);
    }
  };

  const handleOpenInNewTab = () => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`flex flex-col h-full bg-background ${className}`}
      data-preview-iframe
    >
      {/* Preview Navigation Bar */}
      <div className="flex-shrink-0 flex items-center gap-2 px-4 py-3 border-b border-border">
        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="
            p-2 rounded-md
            text-muted-foreground hover:text-foreground
            hover:bg-accent transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          title="Refresh preview"
          aria-label="Refresh preview"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>

        {/* URL/Slug Input */}
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-md bg-muted">
          {isEditingSlug ? (
            <input
              ref={inputRef}
              type="text"
              value={draftSlug}
              onChange={(e) => setDraftSlug(e.target.value)}
              onBlur={handleSlugSubmit}
              onKeyDown={handleSlugKeyDown}
              className="
                flex-1 bg-transparent text-sm font-mono
                text-foreground outline-none
              "
              placeholder="/page-slug"
            />
          ) : (
            <button
              onClick={() => setIsEditingSlug(true)}
              className="
                flex-1 text-left text-sm font-mono
                text-foreground hover:text-primary
                transition-colors
              "
            >
              {slug || '/untitled'}
            </button>
          )}
        </div>

        {/* Open in New Tab */}
        <button
          onClick={handleOpenInNewTab}
          disabled={!url}
          className="
            p-2 rounded-md
            text-muted-foreground hover:text-foreground
            hover:bg-accent transition-colors
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          title="Open in new tab"
          aria-label="Open in new tab"
        >
          <ExternalLink className="w-4 h-4" />
        </button>

        {/* Fullscreen Toggle */}
        {onFullscreenToggle && (
          <button
            onClick={onFullscreenToggle}
            className="
              p-2 rounded-md
              text-muted-foreground hover:text-foreground
              hover:bg-accent transition-colors
            "
            title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </button>
        )}
      </div>

      {/* Preview Body */}
      <div className="flex-1 relative bg-muted/50">
        {!url ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="text-muted-foreground mb-2">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">
              No preview available
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Your page will appear here when you add content
            </p>
          </div>
        ) : (
          <iframe
            key={refreshKey}
            ref={iframeRef}
            src={url}
            className="w-full h-full border-0"
            title="Page preview"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            loading="lazy"
          />
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground mt-2">
                Loading preview...
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Hook to manage preview iframe state
 */
export function usePreviewIframe() {
  const [url, setUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const refresh = () => {
    setRefreshKey((prev) => prev + 1);
  };

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

  return {
    url,
    setUrl,
    isLoading,
    setIsLoading,
    refreshKey,
    refresh,
    isFullscreen,
    toggleFullscreen,
  };
}
