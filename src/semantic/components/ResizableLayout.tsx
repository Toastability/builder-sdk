/**
 * ResizableLayout Component
 *
 * Adapted from v0-clone resizable layout pattern
 * Provides a split-panel interface with drag-to-resize functionality
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';

export interface ResizableLayoutProps {
  /** Left panel content */
  leftPanel: React.ReactNode;

  /** Right panel content */
  rightPanel: React.ReactNode;

  /** Default width percentage for left panel (0-100) */
  defaultLeftWidth?: number;

  /** Minimum width percentage for left panel */
  minLeftWidth?: number;

  /** Maximum width percentage for left panel */
  maxLeftWidth?: number;

  /** Single panel mode for mobile/small screens */
  singlePanelMode?: boolean;

  /** Active panel in single panel mode */
  activePanel?: 'left' | 'right';

  /** Callback when resize occurs */
  onResize?: (leftWidth: number) => void;

  /** CSS classes for container */
  className?: string;
}

export function ResizableLayout({
  leftPanel,
  rightPanel,
  defaultLeftWidth = 30,
  minLeftWidth = 20,
  maxLeftWidth = 60,
  singlePanelMode = false,
  activePanel = 'left',
  onResize,
  className = '',
}: ResizableLayoutProps) {
  const [leftWidth, setLeftWidth] = useState(defaultLeftWidth);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse down on divider
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  // Handle mouse move during drag
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - containerRect.left;
      const newLeftWidth = (mouseX / containerRect.width) * 100;

      // Clamp width between min and max
      const clampedWidth = Math.min(
        Math.max(newLeftWidth, minLeftWidth),
        maxLeftWidth
      );

      setLeftWidth(clampedWidth);
      onResize?.(clampedWidth);
    },
    [isDragging, minLeftWidth, maxLeftWidth, onResize]
  );

  // Handle mouse up to end drag
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add/remove global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Single panel mode for mobile
  if (singlePanelMode) {
    return (
      <div className={`h-full ${className}`} ref={containerRef}>
        {activePanel === 'left' ? leftPanel : rightPanel}
      </div>
    );
  }

  // Desktop: Always render both panels to prevent remounting
  return (
    <div
      ref={containerRef}
      className={`flex h-full gap-0 ${className}`}
      data-resizable-layout
    >
      {/* Left Panel */}
      <div
        className="flex-shrink-0 overflow-hidden"
        style={{ width: `${leftWidth}%` }}
        data-panel="left"
      >
        {leftPanel}
      </div>

      {/* Divider */}
      <div
        className={`
          w-1 cursor-col-resize bg-border hover:bg-primary transition-colors
          ${isDragging ? 'bg-primary' : ''}
        `}
        onMouseDown={handleMouseDown}
        data-divider
      />

      {/* Right Panel */}
      <div
        className="flex-1 overflow-hidden"
        data-panel="right"
      >
        {rightPanel}
      </div>
    </div>
  );
}

/**
 * Hook to persist resizable layout width
 */
export function usePersistedWidth(
  key: string,
  defaultWidth: number
): [number, (width: number) => void] {
  const [width, setWidthState] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(`resizable-width-${key}`);
      return stored ? parseFloat(stored) : defaultWidth;
    } catch {
      return defaultWidth;
    }
  });

  const setWidth = useCallback(
    (newWidth: number) => {
      setWidthState(newWidth);
      try {
        localStorage.setItem(`resizable-width-${key}`, newWidth.toString());
      } catch {
        // Ignore localStorage errors
      }
    },
    [key]
  );

  return [width, setWidth];
}
