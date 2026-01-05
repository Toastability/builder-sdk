/**
 * PreviewIframe Component
 *
 * Renders page preview in sandboxed iframe with device preview options
 * Adapted from v0-clone WebPreview pattern
 */

import React, { useState, useRef, useEffect } from "react";
import { Maximize2, Minimize2, Monitor, Tablet, Smartphone } from "lucide-react";
import { ExpandableIconTabs } from "../../core/components/ui/expandable-icon-tabs";

export type DeviceType = "desktop" | "tablet" | "phone";

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

  /** View tabs to render in header (Templates/Components/Preview) */
  viewTabs?: React.ReactNode;

  /** CSS classes for container */
  className?: string;
}

// Device viewport dimensions
const DEVICE_DIMENSIONS = {
  desktop: { width: "100%", height: "100%", maxWidth: "100%" },
  tablet: { width: "768px", height: "1024px", maxWidth: "100%" },
  phone: { width: "375px", height: "667px", maxWidth: "100%" },
} as const;

// Device preview tabs
const DEVICE_TABS = [
  { title: "Desktop", icon: Monitor },
  { title: "Tablet", icon: Tablet },
  { title: "Phone", icon: Smartphone },
] as const;

export function PreviewIframe({
  url,
  slug = "",
  onSlugChange,
  isFullscreen = false,
  onFullscreenToggle,
  refreshKey = 0,
  isLoading = false,
  viewTabs,
  className = "",
}: PreviewIframeProps) {
  const [isEditingSlug, setIsEditingSlug] = useState(false);
  const [draftSlug, setDraftSlug] = useState(slug);
  const [selectedDevice, setSelectedDevice] = useState<DeviceType>("desktop");
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
    if (e.key === "Enter") {
      handleSlugSubmit();
    } else if (e.key === "Escape") {
      setDraftSlug(slug);
      setIsEditingSlug(false);
    }
  };

  const handleDeviceChange = (index: number | null) => {
    if (index === null) return;
    const deviceTypes: DeviceType[] = ["desktop", "tablet", "phone"];
    setSelectedDevice(deviceTypes[index]);
  };

  const deviceDimensions = DEVICE_DIMENSIONS[selectedDevice];

  return (
    <div className={`flex h-full flex-col bg-background ${className}`} data-preview-iframe>
      {/* Left Section: View Tabs */}
      {viewTabs && <div className="flex flex-1 justify-center">{viewTabs}</div>}

      {/* Preview Navigation Bar */}
      <div className="flex flex-shrink-0 items-center gap-3 border-b border-border px-4 py-3">
        {/* Left Section: Actions and Slug */}
        <div className="flex items-center gap-2">
          {/* URL/Slug Input - Much Narrower */}
          <div className="flex w-48 min-w-[12rem] max-w-[24rem] items-center gap-2 rounded-md bg-muted px-3 py-2">
            {isEditingSlug ? (
              <input
                ref={inputRef}
                type="text"
                value={draftSlug}
                onChange={(e) => setDraftSlug(e.target.value)}
                onBlur={handleSlugSubmit}
                onKeyDown={handleSlugKeyDown}
                className="w-full bg-transparent !p-0 font-mono text-sm text-foreground !outline-none"
                placeholder="/page-slug"
              />
            ) : (
              <button
                onClick={() => setIsEditingSlug(true)}
                className="w-full truncate text-left font-mono text-sm text-foreground transition-colors hover:text-primary"
                title={slug || "/untitled"}>
                {slug || "/untitled"}
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Device Tabs and Fullscreen */}
        <div className="flex items-center gap-2">
          {/* Device Preview Tabs */}
          <div className="flex h-auto flex-wrap rounded-lg border border-[#e3e8ee] bg-white p-1">
            <ExpandableIconTabs
              tabs={DEVICE_TABS}
              selectedIndex={["desktop", "tablet", "phone"].indexOf(selectedDevice)}
              onSelectedIndexChange={handleDeviceChange}
              selectionRequired
              tooltipVariant="bottom"
            />
          </div>

          {/* Fullscreen Toggle */}
          {onFullscreenToggle && (
            <button
              onClick={onFullscreenToggle}
              className="rounded-md p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}>
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Preview Body */}
      <div className="relative flex-1 overflow-auto bg-muted/50">
        {!url ? (
          <div className="flex h-full flex-col items-center justify-center p-8 text-center">
            <div className="mb-2 text-muted-foreground">
              <svg className="mx-auto h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-foreground">No preview available</p>
            <p className="mt-1 text-xs text-muted-foreground">Your page will appear here when you add content</p>
          </div>
        ) : (
          <div className="flex min-h-full items-start justify-center p-0">
            <div
              className="border-none bg-white transition-all duration-300"
              style={{
                width: deviceDimensions.width,
                height: deviceDimensions.height,
                maxWidth: deviceDimensions.maxWidth,
              }}>
              <iframe
                key={refreshKey}
                ref={iframeRef}
                src={url}
                className="h-full w-full border-0"
                title="Page preview"
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
                loading="lazy"
              />
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50">
            <div className="flex flex-col items-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="mt-2 text-sm text-muted-foreground">Loading preview...</p>
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
