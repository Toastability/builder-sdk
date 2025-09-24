import type { ChaiBlock } from "@/types/chai-block";

/**
 * Interface for interactive block props that support state persistence
 */
export interface InteractiveBlockProps {
  /**
   * Whether the component is being rendered in the builder
   */
  inBuilder?: boolean;
  
  /**
   * Current active/open state (e.g., accordion item index, tab index)
   */
  activeIndex?: number;
  
  /**
   * Multiple active states for components that support multiple open items
   */
  activeIndices?: number[];
  
  /**
   * Whether to allow multiple items to be open simultaneously
   */
  allowMultiple?: boolean;
  
  /**
   * Animation configuration
   */
  animation?: {
    enabled: boolean;
    duration?: number;
    easing?: string;
  };
}

/**
 * Helper to determine if we're in the builder environment
 */
export function isInBuilder(): boolean {
  if (typeof window === "undefined") return false;
  return !!(window as any).__CHAI_BUILDER__;
}

/**
 * Hook for managing interactive state in the builder
 */
export function useInteractiveState<T = any>(
  initialState: T,
  blockId?: string
): [T, (value: T) => void] {
  const inBuilder = isInBuilder();
  
  // In builder mode, we need to persist state changes
  const setState = (value: T) => {
    if (inBuilder && blockId) {
      // Emit state change event for the builder to capture
      const event = new CustomEvent("chai:interactive-state-change", {
        detail: { blockId, state: value }
      });
      window.dispatchEvent(event);
    }
  };
  
  return [initialState, setState];
}

/**
 * Utility to add data-dnd attribute for builder interaction
 */
export function getInteractiveProps(inBuilder?: boolean): Record<string, any> {
  if (!inBuilder) return {};
  return { "data-dnd": "yes" };
}

/**
 * Helper to sanitize and prepare interactive blocks
 */
export function prepareInteractiveBlock(block: ChaiBlock): ChaiBlock {
  const isBuilder = isInBuilder();
  
  // Add default interactive props if not present
  if (!block.props) block.props = {};
  
  // Set inBuilder flag
  (block.props as any).inBuilder = isBuilder;
  
  // Initialize animation defaults
  if (!(block.props as any).animation) {
    (block.props as any).animation = {
      enabled: true,
      duration: 300,
      easing: "ease-in-out"
    };
  }
  
  return block;
}