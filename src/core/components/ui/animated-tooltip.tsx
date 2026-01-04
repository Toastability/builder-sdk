"use client";

import { motion, useSpring, animate } from "framer-motion";
import React, { createContext, useContext, useRef, useState, useEffect, useMemo, useCallback } from "react";

import { cn } from "@/lib/utils";

// ============ Types ============
export type TooltipSide = "left" | "right" | "top" | "bottom";

export type SpringConfig = {
  stiffness?: number;
  damping?: number;
  mass?: number;
};

type TooltipContextValue = {
  activeIndex: number | null;
  setActiveIndex: (index: number | null) => void;
  side: TooltipSide;
  springConfig: SpringConfig;
  contentClassName?: string;
  offset: number;
};

// ============ Context ============
const TooltipContext = createContext<TooltipContextValue | null>(null);

const useTooltipContext = () => {
  const context = useContext(TooltipContext);
  if (!context) {
    throw new Error("AnimatedTooltip components must be used within AnimatedTooltipRoot");
  }
  return context;
};

// ============ Default Config ============
const DEFAULT_SPRING: SpringConfig = {
  stiffness: 300,
  damping: 30,
  mass: 0.8,
};

// ============ Root Component ============
export type AnimatedTooltipRootProps = {
  children: React.ReactNode;
  /** Direction the tooltip appears from trigger */
  side?: TooltipSide;
  /** Spring animation config */
  springConfig?: SpringConfig;
  /** Class for the root container */
  className?: string;
  /** Class for the tooltip container (bg, rounded, shadow, etc.) */
  contentClassName?: string;
  /** Gap/offset from trigger to tooltip in pixels */
  offset?: number;
  /** Optional controlled active index. If provided, the tooltip becomes controlled. */
  activeIndex?: number | null;
  /** Change handler for controlled mode. Ignored in uncontrolled mode. */
  onActiveIndexChange?: (index: number | null) => void;
};

export const AnimatedTooltipRoot = ({
  children,
  side = "top",
  springConfig = DEFAULT_SPRING,
  className,
  contentClassName,
  offset = 56,
  activeIndex: controlledActiveIndex,
  onActiveIndexChange,
}: AnimatedTooltipRootProps) => {
  // Support both controlled and uncontrolled usage so callers like
  // ExpandableIconTabs can drive which tooltip is active when needed.
  const [uncontrolledActiveIndex, setUncontrolledActiveIndex] = useState<number | null>(null);

  const isControlled = controlledActiveIndex !== undefined;
  const activeIndex = isControlled ? controlledActiveIndex : uncontrolledActiveIndex;

  const setActiveIndex = useCallback(
    (index: number | null) => {
      if (isControlled) {
        onActiveIndexChange?.(index);
        return;
      }
      setUncontrolledActiveIndex(index);
    },
    [isControlled, onActiveIndexChange],
  );

  const contextValue: TooltipContextValue = useMemo(
    () => ({
      activeIndex,
      setActiveIndex,
      side,
      springConfig,
      contentClassName,
      offset,
    }),
    [activeIndex, setActiveIndex, side, springConfig, contentClassName, offset],
  );

  return (
    <TooltipContext.Provider value={contextValue}>
      <div className={cn("relative", className)}>{children}</div>
    </TooltipContext.Provider>
  );
};

// ============ Item Component ============
export type AnimatedTooltipItemProps = {
  children: React.ReactNode;
  index: number;
  className?: string;
};

export const AnimatedTooltipItem = ({ children, index, className }: AnimatedTooltipItemProps) => {
  const { activeIndex, setActiveIndex, side, springConfig, contentClassName, offset } = useTooltipContext();
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const isActive = activeIndex === index;

  // Extract trigger and content from children
  let triggerContent: React.ReactNode = null;
  let tooltipContent: React.ReactNode = null;

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === AnimatedTooltipTrigger) {
        triggerContent = child;
      } else if (child.type === AnimatedTooltipContent) {
        tooltipContent = child;
      }
    }
  });

  // Animation values
  const opacity = useSpring(0, springConfig);
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  useEffect(() => {
    if (isActive) {
      opacity.set(1);
      // Animate in from the direction
      const initialOffset = 8;
      if (side === "top") {
        y.set(initialOffset);
        animate(y, 0, springConfig);
      } else if (side === "bottom") {
        y.set(-initialOffset);
        animate(y, 0, springConfig);
      } else if (side === "left") {
        x.set(initialOffset);
        animate(x, 0, springConfig);
      } else if (side === "right") {
        x.set(-initialOffset);
        animate(x, 0, springConfig);
      }
    } else {
      opacity.set(0);
    }
  }, [isActive, side, springConfig, opacity, x, y]);

  const handleMouseEnter = useCallback(() => {
    setActiveIndex(index);
  }, [index, setActiveIndex]);

  const handleMouseLeave = useCallback(() => {
    setActiveIndex(null);
  }, [setActiveIndex]);

  const positionConfig = useMemo(() => {
    switch (side) {
      case "top":
        return {
          style: { bottom: offset, left: "50%" },
          className: "left-1/2 -translate-x-1/2",
        };
      case "bottom":
        return {
          style: { top: offset, left: "50%" },
          className: "left-1/2 -translate-x-1/2",
        };
      case "left":
        return {
          style: { right: offset, top: "50%" },
          className: "top-1/2 -translate-y-1/2",
        };
      case "right":
        return {
          style: { left: offset, top: "50%" },
          className: "top-1/2 -translate-y-1/2",
        };
      default:
        return {
          style: { top: offset, left: "50%" },
          className: "left-1/2 -translate-x-1/2",
        };
    }
  }, [side, offset]);

  return (
    <div
      ref={triggerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn("relative flex items-center justify-center", className)}>
      {triggerContent}

      {/* Tooltip */}
      <div
        style={positionConfig.style}
        className={cn("pointer-events-none absolute z-50 flex items-center justify-center", positionConfig.className)}>
        <motion.div
          style={{
            opacity,
            x,
            y,
          }}
          className={cn(
            "flex h-8 items-center justify-center whitespace-nowrap rounded-lg bg-black text-white shadow-xl",
            contentClassName,
          )}>
          {tooltipContent}
        </motion.div>
      </div>
    </div>
  );
};

// ============ Trigger Component ============
export type AnimatedTooltipTriggerProps = {
  children: React.ReactNode;
  className?: string;
};

export const AnimatedTooltipTrigger = ({ children, className }: AnimatedTooltipTriggerProps) => {
  return <div className={className}>{children}</div>;
};

// ============ Content Component ============
export type AnimatedTooltipContentProps = {
  children: React.ReactNode;
  className?: string;
};

export const AnimatedTooltipContent = ({ children, className }: AnimatedTooltipContentProps) => {
  return <div className={cn("px-3 text-sm font-medium", className)}>{children}</div>;
};

// ============ Exports ============
export {
  AnimatedTooltipRoot as Root,
  AnimatedTooltipItem as Item,
  AnimatedTooltipTrigger as Trigger,
  AnimatedTooltipContent as Content,
};
