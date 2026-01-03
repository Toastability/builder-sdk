/**
 * AIPanel Component
 *
 * AI-powered component and content generation
 * TODO: Implement AI generation with Octane integration
 */

import { useState } from 'react';
import { Sparkles, Send } from 'lucide-react';
import { BasePanel, EmptyState, CollapsibleSection } from '../components/BasePanel';
import { BasePanelProps } from '../types/semantic-builder';

interface AIPanelProps extends BasePanelProps {}

export function AIPanel({
  pageId: _pageId,
  websiteId: _websiteId,
  blocks: _blocks,
  onBlocksChange: _onBlocksChange,
  contentBrief,
}: AIPanelProps) {
  const [chatMessage, setChatMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Debug logging
  console.log('[AIPanel] Render - contentBrief:', {
    isPresent: !!contentBrief,
    isNull: contentBrief === null,
    isUndefined: contentBrief === undefined,
    contentBrief: contentBrief,
    keys: contentBrief ? Object.keys(contentBrief) : [],
  });

  const handleSendMessage = async () => {
    if (!chatMessage.trim() || isSending) return;

    setIsSending(true);

    try {
      // TODO: Implement chat with AI about content brief modifications
      // await octaneClient.chat({
      //   message: chatMessage,
      //   context: { contentBrief, pageId, websiteId }
      // })

      // Placeholder response
      setTimeout(() => {
        console.log('AI Chat message:', chatMessage);
        setIsSending(false);
        setChatMessage('');
      }, 2000);
    } catch (error) {
      console.error('Chat error:', error);
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <BasePanel
      title="AI Content Brief"
      subtitle="AI-generated SEO content strategy and recommendations"
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

            {/* No content brief message */}
            {!contentBrief && (
              <EmptyState
                icon={<Sparkles className="w-12 h-12" />}
                title="No content brief available"
                description="Generate a content brief for this page to see AI-powered SEO recommendations and insights."
              />
            )}
          </div>

        {/* AI Chat Interface */}
        <div className="flex-shrink-0 border-t border-border bg-muted/30">
          <div className="p-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-foreground flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                Ask AI to modify the content brief
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    contentBrief
                      ? "e.g., 'Add more focus on local keywords' or 'Suggest alternative meta descriptions'"
                      : "e.g., 'Generate a content brief for this about page'"
                  }
                  className="
                    flex-1 px-3 py-2 rounded-md
                    bg-background text-foreground text-sm
                    border border-border
                    outline-none
                    focus:ring-2 focus:ring-primary
                  "
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!chatMessage.trim() || isSending}
                  className="
                    px-4 py-2 rounded-md
                    bg-primary text-primary-foreground
                    hover:bg-primary/90
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors
                    flex items-center gap-2
                  "
                  title="Send message (Cmd+Enter)"
                >
                  {isSending ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Press Cmd+Enter to send
              </p>
            </div>
          </div>
        </div>
      </div>
    </BasePanel>
  );
}
