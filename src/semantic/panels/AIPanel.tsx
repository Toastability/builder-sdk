/**
 * AIPanel Component
 *
 * AI-powered content brief display with chat interface
 */

import { useState, useRef } from "react";
import { motion, MotionConfig } from "framer-motion";
import { Sparkles, Send, FileText, List, Target, TrendingUp, Search, Info } from "lucide-react";
import { BasePanel, CollapsibleSection } from "../components/BasePanel";
import { BasePanelProps } from "../types/semantic-builder";
import { cn } from "../../lib/utils";

interface AIPanelProps extends BasePanelProps {}

// Animation constants
const SPRING_CONFIG = {
  type: "spring" as const,
  stiffness: 300,
  damping: 30,
};

const BUTTON_BASE_STYLES =
  "bg-muted/50 hover:bg-muted border border-muted cursor-pointer rounded-xl h-10 px-4 flex items-center gap-2 text-sm focus-visible:outline-[1px] -outline-offset-1 outline-primary";

const BUTTON_ACTIVE_STYLES = "bg-primary/15 hover:bg-primary/19 border-primary/10 text-primary";

// Helper Components for Visualizations

const SearchIntentBadge = ({ intent }: { intent: string }) => {
  const getIntentStyles = (intentType: string) => {
    const intentLower = intentType.toLowerCase();
    if (intentLower.includes("informational")) {
      return {
        bg: "bg-blue-500/10",
        text: "text-blue-600",
        border: "border-blue-500/20",
        icon: <Info className="h-3 w-3" />,
      };
    }
    if (intentLower.includes("transactional") || intentLower.includes("commercial")) {
      return {
        bg: "bg-green-500/10",
        text: "text-green-600",
        border: "border-green-500/20",
        icon: <TrendingUp className="h-3 w-3" />,
      };
    }
    if (intentLower.includes("navigational")) {
      return {
        bg: "bg-purple-500/10",
        text: "text-purple-600",
        border: "border-purple-500/20",
        icon: <Target className="h-3 w-3" />,
      };
    }
    return {
      bg: "bg-gray-500/10",
      text: "text-gray-600",
      border: "border-gray-500/20",
      icon: <Search className="h-3 w-3" />,
    };
  };

  const styles = getIntentStyles(intent);

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5",
        styles.bg,
        styles.text,
        styles.border,
      )}>
      {styles.icon}
      <span className="text-sm font-medium capitalize">{intent}</span>
    </div>
  );
};

const WordCountGauge = ({ targetCount }: { targetCount: number }) => {
  // Calculate visual segments based on target count
  const segments = [
    { label: "Minimum", value: Math.round(targetCount * 0.7), color: "bg-yellow-500" },
    { label: "Target", value: targetCount, color: "bg-green-500" },
    { label: "Ideal", value: Math.round(targetCount * 1.2), color: "bg-blue-500" },
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <span className="text-2xl font-bold text-foreground">{targetCount.toLocaleString()}</span>
          <span className="text-sm text-muted-foreground">words</span>
        </div>
      </div>

      <div className="space-y-2">
        {segments.map((segment, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-20 text-xs text-muted-foreground">{segment.label}</div>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
              <div
                className={cn("h-full rounded-full transition-all duration-300", segment.color)}
                style={{ width: `${Math.min((segment.value / (targetCount * 1.2)) * 100, 100)}%` }}
              />
            </div>
            <div className="w-16 text-right font-mono text-xs text-muted-foreground">
              {segment.value.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ContentOutlineTree = ({ outline }: { outline: Array<{ section: string; subsections?: string[] }> }) => {
  return (
    <div className="space-y-3">
      {outline.map((section, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-start gap-2 rounded-md bg-muted/50 p-2">
            <List className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
            <div className="flex-1 space-y-2">
              <h4 className="text-sm font-semibold leading-tight text-foreground">
                {index + 1}. {section.section}
              </h4>
              {section.subsections && section.subsections.length > 0 && (
                <ul className="space-y-1.5">
                  {section.subsections.map((subsection: string, subIndex: number) => (
                    <li key={subIndex} className="flex items-start gap-2 pl-6">
                      <span className="mt-0.5 text-xs text-muted-foreground">•</span>
                      <span className="text-xs leading-relaxed text-muted-foreground">{subsection}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="flex-shrink-0 rounded bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
              {section.subsections?.length || 0}
            </div>
          </div>
        </div>
      ))}

      <div className="mt-4 rounded-md border border-border bg-muted/30 p-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Total Sections</span>
          <span className="font-semibold text-foreground">{outline.length}</span>
        </div>
        <div className="mt-1 flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Total Subsections</span>
          <span className="font-semibold text-foreground">
            {outline.reduce((sum, section) => sum + (section.subsections?.length || 0), 0)}
          </span>
        </div>
      </div>
    </div>
  );
};

export function AIPanel({
  pageId,
  websiteId,
  blocks: _blocks,
  onBlocksChange: _onBlocksChange,
  contentBrief,
  onChatMessage,
}: AIPanelProps) {
  const [userInput, setUserInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  const inputContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle message submission - generates content brief
  const handleMessageSubmit = async () => {
    if (userInput.trim() === "" || isSending) {
      return;
    }

    const userMessage = userInput.trim();
    setIsSending(true);
    setUserInput("");

    try {
      if (onChatMessage) {
        // TODO: This should trigger content brief generation, not return a chat response
        // The callback needs to be updated to generate a full content brief
        // and update the page's content_brief data
        await onChatMessage(userMessage, {
          contentBrief,
          pageId,
          websiteId,
        });

        // TODO: After successful generation, refresh the content brief display
        console.log("Content brief generation requested:", userMessage);
      } else {
        console.warn("Content brief generation not configured");
      }
    } catch (error) {
      console.error("Content brief generation error:", error);
      // TODO: Show error toast/notification to user
    } finally {
      setIsSending(false);
    }
  };

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <BasePanel title="AI Content Brief" subtitle="AI-generated SEO content strategy and chat" showHeader={false}>
      <MotionConfig transition={SPRING_CONFIG}>
        <div className="relative flex h-full flex-col">
          {/* Content Brief Display */}
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {contentBrief && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-border pb-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">Generated Content Brief</h3>
                </div>

                {/* Primary Keyword */}
                {contentBrief.primary_keyword && (
                  <CollapsibleSection title="Primary Keyword" defaultCollapsed={false}>
                    <p className="rounded-md bg-muted px-3 py-2 font-mono text-sm text-foreground">
                      {contentBrief.primary_keyword}
                    </p>
                  </CollapsibleSection>
                )}

                {/* Secondary Keywords */}
                {contentBrief.secondary_keywords?.length > 0 && (
                  <CollapsibleSection title="Secondary Keywords">
                    <div className="flex flex-wrap gap-2">
                      {contentBrief.secondary_keywords.map((keyword: string, index: number) => (
                        <span key={index} className="rounded-md bg-primary/10 px-2 py-1 text-xs text-primary">
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </CollapsibleSection>
                )}

                {/* Search Intent */}
                {contentBrief.search_intent && (
                  <CollapsibleSection title="Search Intent" defaultCollapsed={false}>
                    <SearchIntentBadge intent={contentBrief.search_intent} />
                  </CollapsibleSection>
                )}

                {/* Content Outline */}
                {contentBrief.content_outline?.length > 0 && (
                  <CollapsibleSection title="Content Outline" defaultCollapsed={false}>
                    <ContentOutlineTree outline={contentBrief.content_outline} />
                  </CollapsibleSection>
                )}

                {/* Recommended Word Count */}
                {contentBrief.recommended_word_count && (
                  <CollapsibleSection title="Recommended Word Count" defaultCollapsed={false}>
                    <WordCountGauge targetCount={contentBrief.recommended_word_count} />
                  </CollapsibleSection>
                )}

                {/* Meta Description Guidance */}
                {contentBrief.meta_description_guidance && (
                  <CollapsibleSection title="Meta Description Guidance">
                    <p className="text-sm text-foreground">{contentBrief.meta_description_guidance}</p>
                  </CollapsibleSection>
                )}

                {/* Internal Linking Strategy */}
                {contentBrief.internal_linking_strategy && (
                  <CollapsibleSection title="Internal Linking Strategy">
                    <p className="text-sm text-foreground">{contentBrief.internal_linking_strategy}</p>
                  </CollapsibleSection>
                )}

                {/* Featured Snippet Optimization */}
                {contentBrief.featured_snippet_optimization && (
                  <CollapsibleSection title="Featured Snippet Optimization">
                    <p className="text-sm text-foreground">{contentBrief.featured_snippet_optimization}</p>
                  </CollapsibleSection>
                )}
              </div>
            )}

            {/* No content brief message */}
            {!contentBrief && (
              <div className="flex h-full flex-col items-center justify-center py-8">
                <Sparkles className="mb-4 h-12 w-12 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium text-foreground">No content brief available</h3>
                <p className="max-w-sm text-center text-sm text-muted-foreground">
                  Generate a content brief for this page or ask the AI assistant for help.
                </p>
              </div>
            )}
          </div>

          {/* Input Container - Fixed at bottom */}
          <motion.div ref={inputContainerRef} className="flex-shrink-0 border-t border-border bg-background p-4">
            <div className="rounded-2xl border border-muted bg-muted p-1">
              {/* Text Input Area */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={userInput}
                  autoFocus
                  placeholder={
                    contentBrief
                      ? "Describe what changes you'd like to make to the content brief..."
                      : "Describe your page topic to generate a content brief..."
                  }
                  rows={2}
                  style={{ minHeight: "60px" }}
                  className="max-h-52 w-full resize-none rounded-xl border-none !bg-background p-4 !text-base leading-[1.2] shadow-none placeholder:text-muted-foreground focus-visible:outline-0 focus-visible:ring-0"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleMessageSubmit();
                    }
                  }}
                  onChange={handleTextareaChange}
                  disabled={isSending}
                />
              </div>

              {/* Control Buttons Row */}
              <div className="flex justify-end rounded-2xl border border-muted bg-transparent p-1">
                {/* Send Button */}
                <button
                  type="button"
                  onClick={handleMessageSubmit}
                  disabled={!userInput.trim() || isSending}
                  className={cn(
                    BUTTON_BASE_STYLES,
                    "flex w-10 items-center justify-center p-0 transition-all ease-in-out active:scale-95",
                    userInput.trim() && !isSending && BUTTON_ACTIVE_STYLES,
                    (!userInput.trim() || isSending) && "cursor-not-allowed opacity-50",
                  )}>
                  {isSending ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </MotionConfig>
    </BasePanel>
  );
}
