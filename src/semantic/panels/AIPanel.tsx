/**
 * AIPanel Component
 *
 * AI-powered component and content generation
 * TODO: Implement AI generation with Octane integration
 */

import { useState } from 'react';
import { Sparkles, Wand2, FileText, Palette } from 'lucide-react';
import { BasePanel, EmptyState, CollapsibleSection } from '../components/BasePanel';
import { BasePanelProps } from '../types/semantic-builder';

interface AIPanelProps extends BasePanelProps {}

type GenerationType = 'component' | 'content' | 'style';

export function AIPanel({
  pageId: _pageId,
  websiteId: _websiteId,
  blocks: _blocks,
  onBlocksChange: _onBlocksChange,
  contentBrief,
}: AIPanelProps) {
  const [generationType, setGenerationType] = useState<GenerationType | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);

    try {
      // TODO: Implement actual AI generation via Octane
      // await octaneClient.generate({
      //   type: generationType,
      //   prompt,
      //   context: { blocks, pageId, websiteId }
      // })

      // Placeholder response
      setTimeout(() => {
        console.log(`Generated ${generationType}:`, prompt);
        setIsGenerating(false);
        setPrompt('');
      }, 2000);
    } catch (error) {
      console.error('Generation error:', error);
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  if (!generationType) {
    return (
      <BasePanel
        title="AI Content Brief"
        subtitle="AI-generated SEO content brief and generation tools"
      >
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Content Brief Display */}
            {contentBrief && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-border">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Generated Content Brief
                  </h3>
                </div>

                {/* Primary Keyword */}
                {contentBrief.primary_keyword && (
                  <CollapsibleSection title="Primary Keyword" defaultCollapsed={false}>
                    <p className="text-sm text-foreground font-mono bg-muted px-3 py-2 rounded-md">
                      {contentBrief.primary_keyword}
                    </p>
                  </CollapsibleSection>
                )}

                {/* Secondary Keywords */}
                {contentBrief.secondary_keywords?.length > 0 && (
                  <CollapsibleSection title="Secondary Keywords">
                    <div className="flex flex-wrap gap-2">
                      {contentBrief.secondary_keywords.map((keyword: string, index: number) => (
                        <span
                          key={index}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-md"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </CollapsibleSection>
                )}

                {/* Search Intent */}
                {contentBrief.search_intent && (
                  <CollapsibleSection title="Search Intent">
                    <p className="text-sm text-foreground">{contentBrief.search_intent}</p>
                  </CollapsibleSection>
                )}

                {/* Content Outline */}
                {contentBrief.content_outline?.length > 0 && (
                  <CollapsibleSection title="Content Outline">
                    <div className="space-y-3">
                      {contentBrief.content_outline.map((section: any, index: number) => (
                        <div key={index} className="space-y-2">
                          <h4 className="text-sm font-medium text-foreground">
                            {section.section}
                          </h4>
                          {section.subsections?.length > 0 && (
                            <ul className="list-disc list-inside space-y-1 pl-3">
                              {section.subsections.map((subsection: string, subIndex: number) => (
                                <li key={subIndex} className="text-xs text-muted-foreground">
                                  {subsection}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                )}

                {/* Recommended Word Count */}
                {contentBrief.recommended_word_count && (
                  <CollapsibleSection title="Recommended Word Count">
                    <p className="text-sm text-foreground font-mono">
                      {contentBrief.recommended_word_count}
                    </p>
                  </CollapsibleSection>
                )}

                {/* Meta Description Guidance */}
                {contentBrief.meta_description_guidance && (
                  <CollapsibleSection title="Meta Description Guidance">
                    <p className="text-sm text-foreground">
                      {contentBrief.meta_description_guidance}
                    </p>
                  </CollapsibleSection>
                )}

                {/* Internal Linking Strategy */}
                {contentBrief.internal_linking_strategy && (
                  <CollapsibleSection title="Internal Linking Strategy">
                    <p className="text-sm text-foreground">
                      {contentBrief.internal_linking_strategy}
                    </p>
                  </CollapsibleSection>
                )}

                {/* Featured Snippet Optimization */}
                {contentBrief.featured_snippet_optimization && (
                  <CollapsibleSection title="Featured Snippet Optimization">
                    <p className="text-sm text-foreground">
                      {contentBrief.featured_snippet_optimization}
                    </p>
                  </CollapsibleSection>
                )}

                {/* Additional Fields */}
                {contentBrief.serp_analysis && Object.keys(contentBrief.serp_analysis).length > 0 && (
                  <CollapsibleSection title="SERP Analysis">
                    <div className="space-y-2">
                      {Object.entries(contentBrief.serp_analysis).map(([key, value]: [string, any]) => (
                        <div key={key} className="text-xs">
                          <span className="font-medium text-foreground">{key}: </span>
                          <span className="text-muted-foreground">
                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                )}

                {contentBrief.keyword_metrics && Object.keys(contentBrief.keyword_metrics).length > 0 && (
                  <CollapsibleSection title="Keyword Metrics">
                    <div className="space-y-2">
                      {Object.entries(contentBrief.keyword_metrics).map(([key, value]: [string, any]) => (
                        <div key={key} className="text-xs">
                          <span className="font-medium text-foreground">{key}: </span>
                          <span className="text-muted-foreground">
                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                )}

                {contentBrief.aeo_optimization && Object.keys(contentBrief.aeo_optimization).length > 0 && (
                  <CollapsibleSection title="AEO Optimization">
                    <div className="space-y-2">
                      {Object.entries(contentBrief.aeo_optimization).map(([key, value]: [string, any]) => (
                        <div key={key} className="text-xs">
                          <span className="font-medium text-foreground">{key}: </span>
                          <span className="text-muted-foreground">
                            {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleSection>
                )}

                <div className="pt-4 border-t border-border" />
              </div>
            )}

            {/* AI Generation Tools */}
            <div className="space-y-4">
              <EmptyState
                icon={<Sparkles className="w-12 h-12" />}
                title="Choose what to generate"
                description="Select the type of content you want to create with AI assistance"
              />

            {/* Generation Type Selection */}
            <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
              <button
                onClick={() => setGenerationType('component')}
                className="
                  flex items-center gap-3 p-4 rounded-lg
                  border border-border bg-card
                  hover:bg-accent transition-colors
                  text-left
                "
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Wand2 className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground">
                    Generate Component
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Create UI components from description
                  </p>
                </div>
              </button>

              <button
                onClick={() => setGenerationType('content')}
                className="
                  flex items-center gap-3 p-4 rounded-lg
                  border border-border bg-card
                  hover:bg-accent transition-colors
                  text-left
                "
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground">
                    Generate Content
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Create text, headings, and copy
                  </p>
                </div>
              </button>

              <button
                onClick={() => setGenerationType('style')}
                className="
                  flex items-center gap-3 p-4 rounded-lg
                  border border-border bg-card
                  hover:bg-accent transition-colors
                  text-left
                "
              >
                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Palette className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-foreground">
                    Generate Styles
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Create color schemes and themes
                  </p>
                </div>
              </button>
            </div>
            </div>
          </div>
        </div>
      </BasePanel>
    );
  }

  return (
    <BasePanel
      title="AI Content Brief"
      subtitle={`Generate ${generationType}`}
      actions={
        <button
          onClick={() => {
            setGenerationType(null);
            setPrompt('');
          }}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Change Type
        </button>
      }
    >
      <div className="flex flex-col h-full">
        {/* Prompt Input */}
        <div className="flex-shrink-0 p-4 border-b border-border">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Describe what you want to create
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Example: "${
                generationType === 'component'
                  ? 'Create a hero section with a call-to-action button'
                  : generationType === 'content'
                  ? 'Write a compelling headline for a restaurant homepage'
                  : 'Create a modern dark theme with purple accents'
              }"`}
              className="
                w-full px-3 py-2 rounded-md
                bg-muted text-foreground text-sm
                border border-border
                resize-none outline-none
                focus:ring-2 focus:ring-primary
                min-h-[100px]
              "
              rows={4}
            />
            <p className="text-xs text-muted-foreground">
              Press Cmd+Enter to generate
            </p>
          </div>
        </div>

        {/* Generation Examples */}
        <div className="flex-1 overflow-y-auto p-4">
          <CollapsibleSection title="Examples" defaultCollapsed={false}>
            <div className="space-y-2">
              {generationType === 'component' && (
                <>
                  <button
                    onClick={() =>
                      setPrompt(
                        'Create a pricing section with three tiers and feature lists'
                      )
                    }
                    className="text-sm text-muted-foreground hover:text-foreground text-left"
                  >
                    • Pricing section with three tiers
                  </button>
                  <button
                    onClick={() =>
                      setPrompt('Create a testimonials carousel with customer reviews')
                    }
                    className="text-sm text-muted-foreground hover:text-foreground text-left"
                  >
                    • Testimonials carousel
                  </button>
                  <button
                    onClick={() =>
                      setPrompt('Create a contact form with name, email, and message')
                    }
                    className="text-sm text-muted-foreground hover:text-foreground text-left"
                  >
                    • Contact form
                  </button>
                </>
              )}
              {generationType === 'content' && (
                <>
                  <button
                    onClick={() =>
                      setPrompt('Write a headline for a local pizza restaurant')
                    }
                    className="text-sm text-muted-foreground hover:text-foreground text-left"
                  >
                    • Restaurant headline
                  </button>
                  <button
                    onClick={() =>
                      setPrompt('Write about us copy for a family-owned bakery')
                    }
                    className="text-sm text-muted-foreground hover:text-foreground text-left"
                  >
                    • About us copy
                  </button>
                  <button
                    onClick={() =>
                      setPrompt('Write service descriptions for a law firm')
                    }
                    className="text-sm text-muted-foreground hover:text-foreground text-left"
                  >
                    • Service descriptions
                  </button>
                </>
              )}
              {generationType === 'style' && (
                <>
                  <button
                    onClick={() =>
                      setPrompt('Create a professional blue theme for a law firm')
                    }
                    className="text-sm text-muted-foreground hover:text-foreground text-left"
                  >
                    • Professional blue theme
                  </button>
                  <button
                    onClick={() =>
                      setPrompt('Create a warm, inviting theme for a restaurant')
                    }
                    className="text-sm text-muted-foreground hover:text-foreground text-left"
                  >
                    • Warm restaurant theme
                  </button>
                  <button
                    onClick={() =>
                      setPrompt('Create a modern dark theme with green accents')
                    }
                    className="text-sm text-muted-foreground hover:text-foreground text-left"
                  >
                    • Modern dark theme
                  </button>
                </>
              )}
            </div>
          </CollapsibleSection>
        </div>

        {/* Generate Button */}
        <div className="flex-shrink-0 p-4 border-t border-border">
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className="
              w-full px-4 py-2 rounded-md
              bg-primary text-primary-foreground
              hover:bg-primary/90
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
              text-sm font-medium
            "
          >
            {isGenerating ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Generating...
              </span>
            ) : (
              `Generate ${generationType}`
            )}
          </button>
        </div>
      </div>
    </BasePanel>
  );
}
