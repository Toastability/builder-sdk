/**
 * AIPanel Component
 *
 * AI-powered content brief display with chat interface
 */

import { useState, useRef, useLayoutEffect } from 'react';
import {
  motion,
  MotionConfig,
  useMotionValue,
} from 'framer-motion';
import { Sparkles, Send } from 'lucide-react';
import { BasePanel, CollapsibleSection } from '../components/BasePanel';
import { BasePanelProps } from '../types/semantic-builder';
import { cn } from '../../lib/utils';

interface AIPanelProps extends BasePanelProps {}

// Animation constants
const SPRING_CONFIG = {
  type: 'spring' as const,
  stiffness: 300,
  damping: 30,
};

const BUTTON_BASE_STYLES =
  'bg-muted/50 hover:bg-muted border border-muted cursor-pointer rounded-xl h-10 px-4 flex items-center gap-2 text-sm focus-visible:outline-[1px] -outline-offset-1 outline-primary';

const BUTTON_ACTIVE_STYLES =
  'bg-primary/15 hover:bg-primary/19 border-primary/10 text-primary';

// Message type
interface ChatMessage {
  id: number;
  message: string;
  isFromUser: boolean;
}

export function AIPanel({
  pageId,
  websiteId,
  blocks: _blocks,
  onBlocksChange: _onBlocksChange,
  contentBrief,
  onChatMessage,
}: AIPanelProps) {
  const [userInput, setUserInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [messageIndex, setMessageIndex] = useState(0);

  const messageEndRef = useRef<HTMLDivElement>(null);
  const messageElementsRef = useRef<HTMLDivElement[]>([]);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const scrollMarginTop = useMotionValue(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle message submission
  const handleMessageSubmit = async () => {
    if (userInput.trim() === '' || isSending) {
      return;
    }

    const userMessage = userInput.trim();
    setIsSending(true);
    setUserInput('');
    setMessageIndex((currentIndex) =>
      currentIndex === 0 ? currentIndex + 1 : currentIndex + 2
    );

    // Add user message immediately
    const newUserMessage: ChatMessage = {
      id: chatMessages.length + 1,
      message: userMessage,
      isFromUser: true,
    };
    setChatMessages((prev) => [...prev, newUserMessage]);

    try {
      if (onChatMessage) {
        const response = await onChatMessage(userMessage, {
          contentBrief,
          pageId,
          websiteId,
        });

        // Add AI response
        const aiMessage: ChatMessage = {
          id: chatMessages.length + 2,
          message: response,
          isFromUser: false,
        };
        setChatMessages((prev) => [...prev, aiMessage]);
      } else {
        // Fallback
        const aiMessage: ChatMessage = {
          id: chatMessages.length + 2,
          message: 'AI chat is not configured. Please contact support.',
          isFromUser: false,
        };
        setChatMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: chatMessages.length + 2,
        message: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        isFromUser: false,
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  // Auto-scroll to latest message when new messages are added
  useLayoutEffect(() => {
    const currentMessageCount = chatMessages.length;
    const calculatedScrollMargin =
      currentMessageCount > 1
        ? window.innerHeight -
          (messageElementsRef.current[currentMessageCount - 2]?.clientHeight ||
            0) -
          (inputContainerRef.current?.clientHeight || 0)
        : 0;

    scrollMarginTop.set(calculatedScrollMargin);

    // Smooth scroll to the latest message
    requestAnimationFrame(() => {
      messageEndRef.current?.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    });
  }, [chatMessages, messageIndex, scrollMarginTop]);

  // Auto-resize textarea
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <BasePanel
      title="AI Content Brief"
      subtitle="AI-generated SEO content strategy and chat"
    >
      <MotionConfig transition={SPRING_CONFIG}>
        <div className="flex flex-col h-full relative">
          {/* Content Brief Display */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
              </div>
            )}

            {/* Chat Messages */}
            {chatMessages.length > 0 && (
              <div className="space-y-2 pt-4 border-t border-border">
                <div className="flex items-center gap-2 pb-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-medium text-foreground">Chat History</h4>
                </div>
                {chatMessages.map((message, messageId) => (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    transition={{ delay: (1 * messageId) % 2 }}
                    ref={(element) => {
                      if (element) {
                        messageElementsRef.current[messageId] = element;
                      }
                    }}
                    key={messageId}
                    className={cn(
                      'my-2 w-fit max-w-[85%] break-words rounded-2xl px-4 py-2',
                      message.isFromUser
                        ? 'self-end ml-auto bg-primary/10 text-foreground'
                        : 'self-start mr-auto bg-muted text-foreground'
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                  </motion.div>
                ))}
                <motion.div
                  ref={messageEndRef}
                  style={{ marginTop: scrollMarginTop }}
                />
              </div>
            )}

            {/* No content brief message */}
            {!contentBrief && chatMessages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full py-8">
                <Sparkles className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No content brief available
                </h3>
                <p className="text-sm text-muted-foreground text-center max-w-sm">
                  Generate a content brief for this page or ask the AI assistant for help.
                </p>
              </div>
            )}
          </div>

          {/* Input Container - Fixed at bottom */}
          <motion.div
            ref={inputContainerRef}
            className="flex-shrink-0 p-4 border-t border-border bg-background"
          >
            <div className="bg-muted/60 border-muted rounded-2xl border p-1">
              {/* Text Input Area */}
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={userInput}
                  autoFocus
                  placeholder={
                    contentBrief
                      ? "Ask AI about the content brief..."
                      : "Ask AI to generate a content brief..."
                  }
                  rows={1}
                  className="max-h-52 w-full resize-none rounded-none border-none !bg-transparent p-4 !text-base leading-[1.2] shadow-none focus-visible:outline-0 focus-visible:ring-0 placeholder:text-muted-foreground"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleMessageSubmit();
                    }
                  }}
                  onChange={handleTextareaChange}
                  disabled={isSending}
                />
              </div>

              {/* Control Buttons Row */}
              <div className="bg-background border-muted flex justify-end rounded-2xl border p-1">
                {/* Send Button */}
                <button
                  type="button"
                  onClick={handleMessageSubmit}
                  disabled={!userInput.trim() || isSending}
                  className={cn(
                    BUTTON_BASE_STYLES,
                    'flex w-10 items-center justify-center p-0 transition-all ease-in-out active:scale-95',
                    userInput.trim() && !isSending && BUTTON_ACTIVE_STYLES,
                    (!userInput.trim() || isSending) && 'cursor-not-allowed opacity-50'
                  )}
                >
                  {isSending ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
