/**
 * SideNavigation Component
 *
 * Vertical icon navigation for switching between panels
 * (Chat, AI, Style, SEO, Data, Layout)
 */

import {
  MessageSquare,
  Sparkles,
  Palette,
  Search,
  Database,
  Layout,
  type LucideIcon,
} from 'lucide-react';
import { PanelType } from '../types/semantic-builder';

interface SideNavProps {
  /** Currently active panel */
  activePanel: PanelType;

  /** Callback when panel is selected */
  onPanelChange: (panel: PanelType) => void;

  /** CSS classes for container */
  className?: string;
}

interface NavItem {
  type: PanelType;
  icon: LucideIcon;
  label: string;
  tooltip: string;
}

const NAV_ITEMS: NavItem[] = [
  {
    type: 'chat',
    icon: MessageSquare,
    label: 'Chat',
    tooltip: 'AI Chat Assistant',
  },
  {
    type: 'ai',
    icon: Sparkles,
    label: 'AI',
    tooltip: 'AI Generation Tools',
  },
  {
    type: 'style',
    icon: Palette,
    label: 'Style',
    tooltip: 'Style Editor',
  },
  {
    type: 'seo',
    icon: Search,
    label: 'SEO',
    tooltip: 'SEO Management',
  },
  {
    type: 'data',
    icon: Database,
    label: 'Data',
    tooltip: 'Data Sources',
  },
  {
    type: 'layout',
    icon: Layout,
    label: 'Layout',
    tooltip: 'Page Structure',
  },
];

export function SideNavigation({
  activePanel,
  onPanelChange,
  className = '',
}: SideNavProps) {
  return (
    <nav
      className={`
        flex flex-col items-center py-4 space-y-2
        bg-muted border-r border-border
        w-16 flex-shrink-0
        ${className}
      `}
      aria-label="Panel navigation"
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activePanel === item.type;

        return (
          <button
            key={item.type}
            onClick={() => onPanelChange(item.type)}
            className={`
              relative group
              flex items-center justify-center
              w-12 h-12 rounded-lg
              transition-all duration-200
              ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }
            `}
            title={item.tooltip}
            aria-label={item.label}
            aria-current={isActive ? 'true' : undefined}
          >
            <Icon className="w-5 h-5" />

            {/* Active indicator */}
            {isActive && (
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r" />
            )}

            {/* Tooltip on hover */}
            <span
              className="
                absolute left-full ml-2 px-2 py-1
                bg-popover text-popover-foreground text-sm
                rounded shadow-md whitespace-nowrap
                opacity-0 group-hover:opacity-100
                pointer-events-none transition-opacity
                z-50
              "
            >
              {item.tooltip}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

/**
 * Get nav item by type
 */
export function getNavItem(type: PanelType): NavItem | undefined {
  return NAV_ITEMS.find((item) => item.type === type);
}

/**
 * Get all nav items
 */
export function getAllNavItems(): readonly NavItem[] {
  return NAV_ITEMS;
}
