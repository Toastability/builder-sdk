/**
 * SideNavigation Component
 *
 * Vertical icon navigation for switching between panels
 * (Chat, AI, Style, SEO, Data, Layout)
 */

import { MessageSquare, Sparkles, Palette, Search, Database, Layout, type LucideIcon } from "lucide-react";
import { PanelType } from "../types/semantic-builder";

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
    type: "chat",
    icon: MessageSquare,
    label: "Chat",
    tooltip: "AI Chat Assistant",
  },
  {
    type: "ai",
    icon: Sparkles,
    label: "AI",
    tooltip: "AI Content Brief",
  },
  {
    type: "style",
    icon: Palette,
    label: "Style",
    tooltip: "Style Editor",
  },
  {
    type: "seo",
    icon: Search,
    label: "SEO",
    tooltip: "SEO Management",
  },
  {
    type: "data",
    icon: Database,
    label: "Data",
    tooltip: "Data Sources",
  },
  {
    type: "layout",
    icon: Layout,
    label: "Layout",
    tooltip: "Page Structure",
  },
];

export function SideNavigation({ activePanel, onPanelChange, className = "" }: SideNavProps) {
  return (
    <nav
      className={`flex w-16 flex-shrink-0 flex-col items-center space-y-2 border-r border-border bg-muted py-4 ${className} `}
      aria-label="Panel navigation">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = activePanel === item.type;

        return (
          <button
            key={item.type}
            onClick={() => onPanelChange(item.type)}
            className={`group relative z-50 flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
              isActive
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground !shadow-none hover:bg-accent hover:text-accent-foreground hover:!shadow-md"
            } `}
            title={item.tooltip}
            aria-label={item.label}
            aria-current={isActive ? "true" : undefined}>
            <Icon className="h-5 w-5" />

            {/* Active indicator */}
            {isActive && <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r bg-primary" />}

            {/* Tooltip on hover */}
            <span className="!group-hover:opacity-100 pointer-events-none absolute left-full ml-2 whitespace-nowrap rounded-lg bg-popover px-2 py-1 text-sm text-popover-foreground opacity-0 shadow-lg transition-opacity">
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
