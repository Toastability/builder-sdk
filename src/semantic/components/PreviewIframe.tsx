/**
 * PreviewIframe Component
 *
 * Renders page preview in sandboxed iframe with device preview options
 * Adapted from v0-clone WebPreview pattern
 */

import React, { useState, useRef, useEffect } from "react";
import { Maximize2, Minimize2, Monitor, Tablet, Smartphone, ChevronDown, type LucideIcon } from "lucide-react";
import { ExpandableIconTabs } from "../../core/components/ui/expandable-icon-tabs";
import { SemanticEngineEmptyState } from "./SemanticEngineEmptyState";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export type DeviceType = "desktop" | "tablet" | "phone";

export interface ViewTab {
  title: string;
  icon: LucideIcon;
  type?: undefined;
}

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

  /** View tabs configuration for responsive rendering */
  viewTabs?: {
    tabs: readonly ViewTab[];
    selectedIndex: number;
    onSelectedIndexChange: (index: number | null) => void;
  };

  /** CSS classes for container */
  className?: string;
}

// Device viewport dimensions
const DEVICE_DIMENSIONS = {
  desktop: { width: "100%", height: "100%", maxWidth: "100%", maxHeight: "100%" },
  tablet: { width: "1024px", height: "768px", maxWidth: "100%", maxHeight: "100%" },
  phone: { width: "375px", height: "600px", maxWidth: "100%", maxHeight: "600px" },
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

  // Apply device-specific wrapper constraints
  const wrapperStyle = selectedDevice !== 'desktop'
    ? { maxWidth: deviceDimensions.width, maxHeight: deviceDimensions.maxHeight, margin: '0 auto' }
    : {};

  // Render view tabs responsively based on device
  const renderViewTabs = () => {
    if (!viewTabs) return null;

    const { tabs, selectedIndex, onSelectedIndexChange } = viewTabs;
    const selectedTab = tabs[selectedIndex];

    // Desktop: show full ExpandableIconTabs
    if (selectedDevice === 'desktop') {
      return (
        <div className="bg-white border border-[#e3e8ee] p-1 h-auto flex flex-wrap rounded-lg overflow-visible">
          <ExpandableIconTabs
            tabs={tabs}
            selectedIndex={selectedIndex}
            onSelectedIndexChange={onSelectedIndexChange}
            selectionRequired
            tooltipVariant="bottom"
          />
        </div>
      );
    }

    // Tablet/Phone: show compact dropdown menu
    const SelectedIcon = selectedTab?.icon;

    return (
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <button className="inline-flex items-center gap-2 rounded-md bg-white border border-[#e3e8ee] px-3 py-2 text-sm font-medium text-foreground hover:bg-accent transition-colors">
            {SelectedIcon && <SelectedIcon className="h-4 w-4" />}
            <span>{selectedTab?.title || 'Select view'}</span>
            <ChevronDown className="h-3 w-3 opacity-50" />
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Portal>
          <DropdownMenu.Content
            className="z-50 min-w-[12rem] rounded-md border border-border bg-white p-1 shadow-md"
            sideOffset={5}
          >
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              return (
                <DropdownMenu.Item
                  key={tab.title}
                  className="flex items-center gap-2 rounded-sm px-3 py-2 text-sm cursor-pointer outline-none hover:bg-accent hover:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground"
                  onSelect={() => onSelectedIndexChange(index)}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.title}</span>
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    );
  };

  return (
    <div
      className={`flex h-full flex-col bg-background ${className}`}
      style={wrapperStyle}
      data-preview-iframe
    >
      {/* Left Section: View Tabs */}

      {/* Preview Navigation Bar */}
      <div className="flex flex-shrink-0 items-center justify-between gap-3 border-b border-border p-2">
        {/* Responsive view tabs */}
        {renderViewTabs()}

        {/* Left Section: Actions and Slug */}
        <div className="flex items-center gap-2">
          {/* URL/Slug Input - Responsive width */}
          <div className="flex w-48 min-w-[12rem] max-w-[24rem] items-center gap-2 rounded-md bg-muted px-3 py-2 sm:w-64 md:w-80 lg:w-96">
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

          {/* Fullscreen Toggle - Only show on desktop */}
          {onFullscreenToggle && selectedDevice === "desktop" && (
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
          <div className="flex h-full items-center justify-center p-8">
            <SemanticEngineEmptyState />
          </div>
        ) : (
          <div className="flex min-h-full items-center justify-center p-0">
            <div className="w-full h-full border-none bg-white transition-all duration-300">
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
