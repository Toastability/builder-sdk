/**
 * StylePanel Component
 *
 * Visual style editor mapped to STYLES.md template
 * TODO: Implement full style editing with STYLES.md integration (Phase 2)
 */

import React, { useState } from 'react';
import { Palette, Type, Space, Square } from 'lucide-react';
import { BasePanel, CollapsibleSection, EmptyState } from '../components/BasePanel';
import { BasePanelProps } from '../types/semantic-builder';

interface StylePanelProps extends BasePanelProps {}

type StyleTab = 'colors' | 'typography' | 'spacing' | 'components';

export function StylePanel({
  pageId,
  websiteId,
  blocks,
  onBlocksChange,
}: StylePanelProps) {
  const [activeTab, setActiveTab] = useState<StyleTab>('colors');

  const tabs = [
    { id: 'colors' as const, label: 'Colors', icon: Palette },
    { id: 'typography' as const, label: 'Typography', icon: Type },
    { id: 'spacing' as const, label: 'Spacing', icon: Space },
    { id: 'components' as const, label: 'Components', icon: Square },
  ];

  const renderColorsTab = () => (
    <div className="p-4 space-y-4">
      <CollapsibleSection title="Base Colors" defaultCollapsed={false}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">Background</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-border bg-background" />
              <span className="text-xs text-muted-foreground font-mono">
                222.2 47.4% 11.2%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">Foreground</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-border bg-foreground" />
              <span className="text-xs text-muted-foreground font-mono">
                210 40% 98%
              </span>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Primary Colors" defaultCollapsed={false}>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">Primary</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-border bg-primary" />
              <span className="text-xs text-muted-foreground font-mono">
                217.2 91.2% 59.8%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">Primary Foreground</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-border bg-primary-foreground" />
              <span className="text-xs text-muted-foreground font-mono">
                222.2 47.4% 11.2%
              </span>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Accent Colors">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">Accent</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-border bg-accent" />
              <span className="text-xs text-muted-foreground font-mono">
                217.2 32.6% 17.5%
              </span>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Semantic Colors">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">Destructive</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-border bg-destructive" />
              <span className="text-xs text-muted-foreground font-mono">
                0 62.8% 30.6%
              </span>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <p className="text-xs text-muted-foreground px-4 py-2 bg-muted rounded-md">
        Color editing will be fully implemented in Phase 2. These values are mapped
        to STYLES.md template.
      </p>
    </div>
  );

  const renderTypographyTab = () => (
    <div className="p-4 space-y-4">
      <CollapsibleSection title="Font Families" defaultCollapsed={false}>
        <div className="space-y-3">
          <div>
            <label className="text-sm text-foreground">Sans Serif</label>
            <div className="mt-1 px-3 py-2 rounded-md bg-muted text-sm font-mono">
              Inter, system-ui, sans-serif
            </div>
          </div>
          <div>
            <label className="text-sm text-foreground">Monospace</label>
            <div className="mt-1 px-3 py-2 rounded-md bg-muted text-sm font-mono">
              JetBrains Mono, monospace
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Font Sizes">
        <div className="space-y-2">
          {['xs', 'sm', 'base', 'lg', 'xl', '2xl', '3xl', '4xl'].map((size) => (
            <div key={size} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{size}</span>
              <span className="text-xs text-muted-foreground font-mono">
                {size === 'xs'
                  ? '0.75rem (12px)'
                  : size === 'sm'
                  ? '0.875rem (14px)'
                  : size === 'base'
                  ? '1rem (16px)'
                  : size === 'lg'
                  ? '1.125rem (18px)'
                  : size === 'xl'
                  ? '1.25rem (20px)'
                  : size === '2xl'
                  ? '1.5rem (24px)'
                  : size === '3xl'
                  ? '1.875rem (30px)'
                  : '2.25rem (36px)'}
              </span>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Font Weights">
        <div className="space-y-2">
          {['normal', 'medium', 'semibold', 'bold'].map((weight) => (
            <div key={weight} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{weight}</span>
              <span className="text-xs text-muted-foreground font-mono">
                {weight === 'normal'
                  ? '400'
                  : weight === 'medium'
                  ? '500'
                  : weight === 'semibold'
                  ? '600'
                  : '700'}
              </span>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <p className="text-xs text-muted-foreground px-4 py-2 bg-muted rounded-md">
        Typography editing will be fully implemented in Phase 2.
      </p>
    </div>
  );

  const renderSpacingTab = () => (
    <div className="p-4 space-y-4">
      <CollapsibleSection title="Spacing Scale" defaultCollapsed={false}>
        <div className="space-y-2">
          {['0', '1', '2', '3', '4', '6', '8', '12', '16', '24'].map((scale) => (
            <div key={scale} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{scale}</span>
              <div className="flex items-center gap-2">
                <div
                  className="bg-primary"
                  style={{
                    height: '1rem',
                    width: `${
                      scale === '0'
                        ? 0
                        : scale === '1'
                        ? 0.25
                        : scale === '2'
                        ? 0.5
                        : scale === '3'
                        ? 0.75
                        : scale === '4'
                        ? 1
                        : scale === '6'
                        ? 1.5
                        : scale === '8'
                        ? 2
                        : scale === '12'
                        ? 3
                        : scale === '16'
                        ? 4
                        : 6
                    }rem`,
                  }}
                />
                <span className="text-xs text-muted-foreground font-mono">
                  {scale === '0'
                    ? '0px'
                    : scale === '1'
                    ? '4px'
                    : scale === '2'
                    ? '8px'
                    : scale === '3'
                    ? '12px'
                    : scale === '4'
                    ? '16px'
                    : scale === '6'
                    ? '24px'
                    : scale === '8'
                    ? '32px'
                    : scale === '12'
                    ? '48px'
                    : scale === '16'
                    ? '64px'
                    : '96px'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Border Radius">
        <div className="space-y-2">
          {['none', 'sm', 'md', 'lg', 'full'].map((radius) => (
            <div key={radius} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{radius}</span>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 bg-primary"
                  style={{
                    borderRadius:
                      radius === 'none'
                        ? '0'
                        : radius === 'sm'
                        ? '0.125rem'
                        : radius === 'md'
                        ? '0.375rem'
                        : radius === 'lg'
                        ? '0.5rem'
                        : '9999px',
                  }}
                />
                <span className="text-xs text-muted-foreground font-mono">
                  {radius === 'none'
                    ? '0'
                    : radius === 'sm'
                    ? '0.125rem'
                    : radius === 'md'
                    ? '0.375rem'
                    : radius === 'lg'
                    ? '0.5rem'
                    : '9999px'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CollapsibleSection>

      <p className="text-xs text-muted-foreground px-4 py-2 bg-muted rounded-md">
        Spacing editing will be fully implemented in Phase 2.
      </p>
    </div>
  );

  const renderComponentsTab = () => (
    <div className="p-4">
      <EmptyState
        icon={<Square className="w-12 h-12" />}
        title="Component Styles"
        description="Configure default styles for buttons, inputs, cards, and other UI components. This will be implemented in Phase 2."
      />
    </div>
  );

  return (
    <BasePanel
      title="Style Editor"
      subtitle="Customize colors, typography, and spacing"
    >
      <div className="flex flex-col h-full">
        {/* Style Tabs */}
        <div className="flex-shrink-0 flex items-center gap-1 px-4 py-2 border-b border-border">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-3 py-2 rounded-md
                  text-sm font-medium transition-colors
                  ${
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Active Tab Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'colors' && renderColorsTab()}
          {activeTab === 'typography' && renderTypographyTab()}
          {activeTab === 'spacing' && renderSpacingTab()}
          {activeTab === 'components' && renderComponentsTab()}
        </div>
      </div>
    </BasePanel>
  );
}
