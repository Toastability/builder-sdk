/**
 * ChatPanel Component
 *
 * Conversational AI interface for building pages
 * TODO: Implement AI chat with Octane integration
 */

import React, { useState } from 'react';
import { Send, User, Bot } from 'lucide-react';
import { BasePanel, EmptyState } from '../components/BasePanel';
import { BasePanelProps } from '../types/semantic-builder';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatPanelProps extends BasePanelProps {}

export function ChatPanel({
  pageId,
  websiteId,
  blocks,
  onBlocksChange,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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

  if (messages.length === 0) {
    return (
      <BasePanel
        title="AI Chat"
        subtitle="Conversational AI assistant"
      >
        <EmptyState
          icon={<Bot className="w-12 h-12" />}
          title="Start a conversation"
          description="Ask questions, get suggestions, and build your page with AI help. Try asking: 'Add a hero section with a call-to-action button'"
          action={{
            label: 'Start Chat',
            onClick: () => setInput('Add a hero section with a call-to-action button'),
          }}
        />
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
