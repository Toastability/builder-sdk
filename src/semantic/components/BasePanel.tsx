/**
 * BasePanel Component
 *
 * Base panel layout with consistent styling
 * All specific panels (Chat, AI, Style, etc.) extend this
 */

import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

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

export function BasePanel({
  title,
  subtitle,
  children,
  actions,
  className = '',
  showHeader = true,
}: BasePanelProps) {
  return (
    <div
      className={`flex flex-col h-full bg-background ${className}`}
      role="region"
      aria-label={title}
    >
      {/* Panel Header */}
      {showHeader && (
        <div className="flex-shrink-0 px-4 py-3 border-b border-border">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold text-foreground truncate">
                {title}
              </h2>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>

            {actions && (
              <div className="flex items-center gap-2 ml-4">
                {actions}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Panel Content - scrollable */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {children}
      </div>
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
  className = '',
}: CollapsibleSectionProps) {
  const [internalCollapsed, setInternalCollapsed] = React.useState(defaultCollapsed);

  const isCollapsed = controlledCollapsed ?? internalCollapsed;

  const handleToggle = () => {
    const newCollapsed = !isCollapsed;
    setInternalCollapsed(newCollapsed);
    onCollapsedChange?.(newCollapsed);
  };

  return (
    <div className={`border-b border-border ${className}`}>
      {/* Section Header - Clickable */}
      <button
        onClick={handleToggle}
        className="
          flex items-center justify-between
          w-full px-4 py-3
          text-left
          hover:bg-accent/50
          transition-colors
        "
        aria-expanded={!isCollapsed}
      >
        <span className="text-sm font-medium text-foreground">{title}</span>
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {/* Section Content */}
      {!isCollapsed && (
        <div className="px-4 py-3 space-y-3">
          {children}
        </div>
      )}
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

export function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center">
      {icon && (
        <div className="mb-4 text-muted-foreground">
          {icon}
        </div>
      )}
      <h3 className="text-sm font-medium text-foreground mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">
          {description}
        </p>
      )}
      {action && (
        <button
          onClick={action.onClick}
          className="
            px-4 py-2 text-sm font-medium
            bg-primary text-primary-foreground
            rounded-md hover:bg-primary/90
            transition-colors
          "
        >
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

export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary border-t-transparent mb-4" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
