/**
 * ChatPanel Component
 *
 * Conversational AI interface for building pages
 * TODO: Implement AI chat with Octane integration
 */

import { useState } from 'react';
import { Send, User, Bot, Wand2, FileText, Palette, X } from 'lucide-react';
import { BasePanel, EmptyState } from '../components/BasePanel';
import { BasePanelProps } from '../types/semantic-builder';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

type GenerationType = 'component' | 'content' | 'style' | null;

interface ChatPanelProps extends BasePanelProps {}

export function ChatPanel({
  pageId: _pageId,
  websiteId: _websiteId,
  blocks: _blocks,
  onBlocksChange: _onBlocksChange,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generationType, setGenerationType] = useState<GenerationType>(null);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // TODO: Implement actual AI chat via Octane
      // await octaneClient.chat({ message: input, context: { blocks, pageId } })

      // Placeholder response
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'This is a placeholder response. AI chat integration will be implemented in Phase 6.',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Chat error:', error);
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (messages.length === 0 && !generationType) {
    return (
      <BasePanel
        title="AI Chat"
        subtitle="Conversational AI assistant and generation tools"
      >
        <div className="flex flex-col h-full p-4 space-y-6">
          <EmptyState
            icon={<Bot className="w-12 h-12" />}
            title="AI Assistant"
            description="Chat with AI to build your page or use quick generation tools below"
          />

          {/* AI Generation Tools */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Quick Generation Tools</h3>
            <div className="grid grid-cols-1 gap-3">
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
                  <h4 className="text-sm font-medium text-foreground">
                    Generate Component
                  </h4>
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
                  <h4 className="text-sm font-medium text-foreground">
                    Generate Content
                  </h4>
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
                  <h4 className="text-sm font-medium text-foreground">
                    Generate Styles
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Create color schemes and themes
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Chat Input (for direct chat) */}
          <div className="flex-shrink-0 border-t border-border pt-4">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Or start a conversation..."
                className="
                  flex-1 px-3 py-2 rounded-md
                  bg-muted text-foreground text-sm
                  border border-border
                  resize-none outline-none
                  focus:ring-2 focus:ring-primary
                  min-h-[40px] max-h-[120px]
                "
                rows={1}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="
                  px-4 py-2 rounded-md
                  bg-primary text-primary-foreground
                  hover:bg-primary/90
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors
                "
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </BasePanel>
    );
  }

  // Generation Mode Interface
  if (generationType) {
    const getGenerationPlaceholder = () => {
      switch (generationType) {
        case 'component':
          return 'Create a hero section with a call-to-action button';
        case 'content':
          return 'Write a compelling headline for a restaurant homepage';
        case 'style':
          return 'Create a modern dark theme with purple accents';
        default:
          return '';
      }
    };

    const getGenerationExamples = () => {
      switch (generationType) {
        case 'component':
          return [
            'Create a pricing section with three tiers and feature lists',
            'Create a testimonials carousel with customer reviews',
            'Create a contact form with name, email, and message',
          ];
        case 'content':
          return [
            'Write a headline for a local pizza restaurant',
            'Write about us copy for a family-owned bakery',
            'Write service descriptions for a law firm',
          ];
        case 'style':
          return [
            'Create a professional blue theme for a law firm',
            'Create a warm, inviting theme for a restaurant',
            'Create a modern dark theme with green accents',
          ];
        default:
          return [];
      }
    };

    return (
      <BasePanel
        title={`Generate ${generationType.charAt(0).toUpperCase() + generationType.slice(1)}`}
        subtitle="AI-powered generation"
        actions={
          <button
            onClick={() => {
              setGenerationType(null);
              setInput('');
            }}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            <X className="w-4 h-4" />
            Cancel
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
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={`Example: "${getGenerationPlaceholder()}"`}
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

          {/* Examples */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-foreground">Examples</h3>
              <div className="space-y-2">
                {getGenerationExamples().map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setInput(example)}
                    className="block w-full text-left text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    • {example}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Generate Button */}
          <div className="flex-shrink-0 p-4 border-t border-border">
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="
                w-full px-4 py-2 rounded-md
                bg-primary text-primary-foreground
                hover:bg-primary/90
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
                text-sm font-medium
              "
            >
              {isLoading ? (
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

  return (
    <BasePanel
      title="AI Chat"
      subtitle="Conversational AI assistant"
    >
      <div className="flex flex-col h-full">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {/* Avatar */}
              <div
                className={`
                  flex-shrink-0 w-8 h-8 rounded-full
                  flex items-center justify-center
                  ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }
                `}
              >
                {message.role === 'user' ? (
                  <User className="w-4 h-4" />
                ) : (
                  <Bot className="w-4 h-4" />
                )}
              </div>

              {/* Message Content */}
              <div
                className={`
                  flex-1 px-4 py-2 rounded-lg
                  ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }
                `}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div className="flex-1 px-4 py-2 rounded-lg bg-muted">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-100" />
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Generation Tools Toolbar */}
        <div className="flex-shrink-0 px-4 py-2 border-t border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Quick Generate:</span>
            <button
              onClick={() => setGenerationType('component')}
              className="px-3 py-1 rounded-md bg-background hover:bg-accent text-xs font-medium text-foreground transition-colors flex items-center gap-1"
            >
              <Wand2 className="w-3 h-3" />
              Component
            </button>
            <button
              onClick={() => setGenerationType('content')}
              className="px-3 py-1 rounded-md bg-background hover:bg-accent text-xs font-medium text-foreground transition-colors flex items-center gap-1"
            >
              <FileText className="w-3 h-3" />
              Content
            </button>
            <button
              onClick={() => setGenerationType('style')}
              className="px-3 py-1 rounded-md bg-background hover:bg-accent text-xs font-medium text-foreground transition-colors flex items-center gap-1"
            >
              <Palette className="w-3 h-3" />
              Style
            </button>
          </div>
        </div>

        {/* Input */}
        <div className="flex-shrink-0 p-4 border-t border-border">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything..."
              className="
                flex-1 px-3 py-2 rounded-md
                bg-muted text-foreground text-sm
                border border-border
                resize-none outline-none
                focus:ring-2 focus:ring-primary
                min-h-[40px] max-h-[120px]
              "
              rows={1}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="
                px-4 py-2 rounded-md
                bg-primary text-primary-foreground
                hover:bg-primary/90
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              "
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </BasePanel>
  );
}
