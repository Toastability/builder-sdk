/**
 * SideNavigation Component
 *
 * Vertical icon navigation for switching between panels
 * (Chat, AI, Style, SEO, Data, Layout)
 */

import { MessageSquare, Sparkles, Palette, Search, Database, Layout, type LucideIcon } from "lucide-react";
import * as AnimatedTooltip from "../../core/components/ui/animated-tooltip";
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
      className={`flex w-16 flex-shrink-0 flex-col border-r border-border bg-muted py-4 ${className} `}
      aria-label="Panel navigation">
      <AnimatedTooltip.Root side="right" className="flex flex-col items-center space-y-2">
        {NAV_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const isActive = activePanel === item.type;

          return (
            <AnimatedTooltip.Item key={item.type} index={index}>
              <AnimatedTooltip.Trigger>
                <button
                  onClick={() => onPanelChange(item.type)}
                  className={`relative z-50 flex h-12 w-12 items-center justify-center rounded-xl transition-all ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground !shadow-none hover:bg-accent hover:text-accent-foreground hover:!shadow-md"
                  } `}
                  aria-label={item.label}
                  aria-current={isActive ? "true" : undefined}>
                  <Icon className="h-5 w-5" />

                  {/* Active indicator */}
                  {isActive && <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r bg-primary" />}
                </button>
              </AnimatedTooltip.Trigger>
              <AnimatedTooltip.Content>{item.tooltip}</AnimatedTooltip.Content>
            </AnimatedTooltip.Item>
          );
        })}
      </AnimatedTooltip.Root>
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
