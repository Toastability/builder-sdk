/**
 * BasePanel Component
 *
 * Base panel layout with consistent styling
 * All specific panels (Chat, AI, Style, etc.) extend this
 */

import React from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface BasePanelProps {
  /** Panel title */
  title: string;

  /** Panel subtitle/description */
  subtitle?: string;

  /** Panel content */
  children: React.ReactNode;

  /** Optional header actions */
  actions?: React.ReactNode;

  /** CSS classes for container */
  className?: string;

  /** Whether to show the panel header (default: true) */
  showHeader?: boolean;
}

export function BasePanel({ title, subtitle, children, actions, className = "", showHeader = true }: BasePanelProps) {
  return (
    <div className={`flex h-full flex-col bg-background ${className}`} role="region" aria-label={title}>
      {/* Panel Header */}
      {showHeader && (
        <div className="flex-shrink-0 border-b border-border px-4 py-3">
          <div className="flex items-start justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="truncate text-base font-semibold text-foreground">{title}</h2>
              {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
            </div>

            {actions && <div className="ml-4 flex items-center gap-2">{actions}</div>}
          </div>
        </div>
      )}

      {/* Panel Content - scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">{children}</div>
    </div>
  );
}

/**
 * Collapsible section within a panel
 */
interface CollapsibleSectionProps {
  /** Section title */
  title: string;

  /** Section content */
  children: React.ReactNode;

  /** Initial collapsed state */
  defaultCollapsed?: boolean;

  /** Controlled collapsed state */
  collapsed?: boolean;

  /** Callback when collapsed state changes */
  onCollapsedChange?: (collapsed: boolean) => void;

  /** CSS classes for container */
  className?: string;
}

export function CollapsibleSection({
  title,
  children,
  defaultCollapsed = false,
  collapsed: controlledCollapsed,
  onCollapsedChange,
  className = "",
}: CollapsibleSectionProps) {
  const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed);

  const isCollapsed = controlledCollapsed ?? internalCollapsed;

  const handleToggle = () => {
    const newCollapsed = !isCollapsed;
    setInternalCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

  return (
    <div className={`${className}`}>
      {/* Section Header - Clickable */}
      <button
        onClick={handleToggle}
        className="flex w-full items-center justify-between rounded-sm border p-3 text-left transition-colors hover:bg-accent/50"
        aria-expanded={!isCollapsed}>
        <span className="text-sm font-medium text-foreground">{title}</span>
        {isCollapsed ? (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Section Content */}
      {!isCollapsed && <div className="space-y-3 px-0 py-4">{children}</div>}
    </div>
  );
}

/**
 * Empty state component for panels
 */
interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8 text-center">
      {icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
      <h3 className="mb-2 text-sm font-medium text-foreground">{title}</h3>
      {description && <p className="mb-4 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && (
        <button
          onClick={action.onClick}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          {action.label}
        </button>
      )}
    </div>
  );
}

/**
 * Loading state component for panels
 */
interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
