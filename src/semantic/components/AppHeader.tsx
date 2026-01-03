/**
 * AppHeader Component
 *
 * Top navigation bar with Templates | Components | Preview tabs
 * Matches the UI design from header.png screenshot
 */

import React from 'react';
import { NavigationTab } from '../types/semantic-builder';

interface AppHeaderProps {
  /** Currently active tab */
  activeTab: NavigationTab;

  /** Callback when tab is selected */
  onTabChange: (tab: NavigationTab) => void;

  /** Optional title for the header */
  title?: string;

  /** Optional subtitle/page path */
  subtitle?: string;

  /** Optional action buttons */
  actions?: React.ReactNode;

  /** CSS classes for container */
  className?: string;
}

interface TabItem {
  type: NavigationTab;
  label: string;
}

const TABS: TabItem[] = [
  { type: 'templates', label: 'Templates' },
  { type: 'components', label: 'Components' },
  { type: 'preview', label: 'Preview' },
];

export function AppHeader({
  activeTab,
  onTabChange,
  title,
  subtitle,
  actions,
  className = '',
}: AppHeaderProps) {
  return (
    <header
      className={`
        flex items-center justify-between
        px-6 py-3 border-b border-border
        bg-background
        ${className}
      `}
    >
      {/* Left side: Title and tabs */}
      <div className="flex items-center gap-6">
        {/* Title */}
        {title && (
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            {subtitle && (
              <p className="text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        )}

        {/* Tabs */}
        <nav
          className="flex items-center gap-1"
          role="tablist"
          aria-label="Builder navigation"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.type;

            return (
              <button
                key={tab.type}
                onClick={() => onTabChange(tab.type)}
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${tab.type}`}
                className={`
                  px-4 py-2 text-sm font-medium
                  rounded-md transition-all duration-200
                  ${
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  }
                `}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Right side: Actions */}
      {actions && (
        <div className="flex items-center gap-2">{actions}</div>
      )}
    </header>
  );
}

/**
 * Action button for header
 */
interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'ghost';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export function ActionButton({
  onClick,
  children,
  variant = 'default',
  disabled = false,
  loading = false,
  icon,
  className = '',
}: ActionButtonProps) {
  const baseStyles = `
    inline-flex items-center gap-2 px-4 py-2
    text-sm font-medium rounded-md
    transition-all duration-200
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantStyles = {
    default: 'bg-background text-foreground border border-border hover:bg-accent',
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    ghost: 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseStyles} ${variantStyles[variant]} ${className}`}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
}

/**
 * Get tab by type
 */
export function getTab(type: NavigationTab): TabItem | undefined {
  return TABS.find((tab) => tab.type === type);
}

/**
 * Get all tabs
 */
export function getAllTabs(): readonly TabItem[] {
  return TABS;
}
