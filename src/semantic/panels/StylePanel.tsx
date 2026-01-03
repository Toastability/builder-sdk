/**
 * StylePanel Component
 *
 * Visual style editor mapped to STYLES.md template
 * TODO: Implement full style editing with STYLES.md integration (Phase 2)
 */

import { useState } from 'react';
import { Palette, Type, Space, Square } from 'lucide-react';
import { BasePanel, CollapsibleSection, EmptyState } from '../components/BasePanel';
import { BasePanelProps } from '../types/semantic-builder';

interface StylePanelProps extends BasePanelProps {}

type StyleTab = 'colors' | 'typography' | 'spacing' | 'components';

export function StylePanel({
  pageId: _pageId,
  websiteId: _websiteId,
  blocks: _blocks,
  onBlocksChange: _onBlocksChange,
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
                0 0% 100%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">Foreground</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-border bg-foreground" />
              <span className="text-xs text-muted-foreground font-mono">
                222.2 47.4% 11.2%
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

      <CollapsibleSection title="Secondary Colors">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">Secondary</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-border bg-secondary" />
              <span className="text-xs text-muted-foreground font-mono">
                210 40% 96.1%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">Secondary Foreground</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-border bg-secondary-foreground" />
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
                210 40% 96.1%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">Accent Foreground</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-border bg-accent-foreground" />
              <span className="text-xs text-muted-foreground font-mono">
                222.2 47.4% 11.2%
              </span>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Muted Colors">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">Muted</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-border bg-muted" />
              <span className="text-xs text-muted-foreground font-mono">
                210 40% 96.1%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">Muted Foreground</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-border bg-muted-foreground" />
              <span className="text-xs text-muted-foreground font-mono">
                215.4 16.3% 46.9%
              </span>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Card Colors">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">Card</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-border bg-card" />
              <span className="text-xs text-muted-foreground font-mono">
                0 0% 100%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">Card Foreground</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-border bg-card-foreground" />
              <span className="text-xs text-muted-foreground font-mono">
                222.2 47.4% 11.2%
              </span>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Border Colors">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">Border</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-border bg-border" />
              <span className="text-xs text-muted-foreground font-mono">
                214.3 31.8% 91.4%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">Input</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-border bg-input" />
              <span className="text-xs text-muted-foreground font-mono">
                214.3 31.8% 91.4%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">Ring (Focus)</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border-2 border-ring" />
              <span className="text-xs text-muted-foreground font-mono">
                217.2 91.2% 59.8%
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
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">Destructive Foreground</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-border bg-destructive-foreground" />
              <span className="text-xs text-muted-foreground font-mono">
                210 40% 98%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">Success</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-border" style={{ backgroundColor: 'hsl(142.1 76.2% 36.3%)' }} />
              <span className="text-xs text-muted-foreground font-mono">
                142.1 76.2% 36.3%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">Success Foreground</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-border" style={{ backgroundColor: 'hsl(355.7 100% 97.3%)' }} />
              <span className="text-xs text-muted-foreground font-mono">
                355.7 100% 97.3%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">Warning</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-border" style={{ backgroundColor: 'hsl(38 92% 50%)' }} />
              <span className="text-xs text-muted-foreground font-mono">
                38 92% 50%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm text-foreground">Warning Foreground</label>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded border border-border" style={{ backgroundColor: 'hsl(355.7 100% 97.3%)' }} />
              <span className="text-xs text-muted-foreground font-mono">
                355.7 100% 97.3%
              </span>
            </div>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Chart Colors">
        <div className="space-y-3">
          {[
            { label: 'Chart 1', value: '12 76% 61%' },
            { label: 'Chart 2', value: '173 58% 39%' },
            { label: 'Chart 3', value: '197 37% 24%' },
            { label: 'Chart 4', value: '43 74% 66%' },
            { label: 'Chart 5', value: '27 87% 67%' },
          ].map((chart) => (
            <div key={chart.label} className="flex items-center justify-between">
              <label className="text-sm text-foreground">{chart.label}</label>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded border border-border"
                  style={{ backgroundColor: `hsl(${chart.value})` }}
                />
                <span className="text-xs text-muted-foreground font-mono">
                  {chart.value}
                </span>
              </div>
            </div>
          ))}
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
          {[
            { size: 'xs', value: '0.75rem (12px)' },
            { size: 'sm', value: '0.875rem (14px)' },
            { size: 'base', value: '1rem (16px)' },
            { size: 'lg', value: '1.125rem (18px)' },
            { size: 'xl', value: '1.25rem (20px)' },
            { size: '2xl', value: '1.5rem (24px)' },
            { size: '3xl', value: '1.875rem (30px)' },
            { size: '4xl', value: '2.25rem (36px)' },
            { size: '5xl', value: '3rem (48px)' },
            { size: '6xl', value: '3.75rem (60px)' },
          ].map(({ size, value }) => (
            <div key={size} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{size}</span>
              <span className="text-xs text-muted-foreground font-mono">
                {value}
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
          {[
            { scale: '0', pixels: '0px', rem: 0 },
            { scale: '1', pixels: '4px', rem: 0.25 },
            { scale: '2', pixels: '8px', rem: 0.5 },
            { scale: '3', pixels: '12px', rem: 0.75 },
            { scale: '4', pixels: '16px', rem: 1 },
            { scale: '6', pixels: '24px', rem: 1.5 },
            { scale: '8', pixels: '32px', rem: 2 },
            { scale: '10', pixels: '40px', rem: 2.5 },
            { scale: '12', pixels: '48px', rem: 3 },
            { scale: '16', pixels: '64px', rem: 4 },
            { scale: '20', pixels: '80px', rem: 5 },
            { scale: '24', pixels: '96px', rem: 6 },
          ].map(({ scale, pixels, rem }) => (
            <div key={scale} className="flex items-center justify-between">
              <span className="text-sm text-foreground">{scale}</span>
              <div className="flex items-center gap-2">
                <div
                  className="bg-primary"
                  style={{
                    height: '1rem',
                    width: `${rem}rem`,
                  }}
                />
                <span className="text-xs text-muted-foreground font-mono">
                  {pixels}
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
      showHeader={false}
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
