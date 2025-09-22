"use client";

import type React from "react";

import { cn } from "@/lib/utils";
import { Avatar } from "@/ui/shadcn/components/ui/avatar";
import { Button } from "@/ui/shadcn/components/ui/button";
import { ScrollArea } from "@/ui/shadcn/components/ui/scroll-area";
import { Textarea } from "@/ui/shadcn/components/ui/textarea";
import { Image, Loader2, Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIChatPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageAttachment, setImageAttachment] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() && !imageAttachment) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "This is a sample response from the AI assistant. In a real implementation, this would be replaced with an actual response from the AI model.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
      setImageAttachment(null);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImageAttachment(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeAttachment = () => {
    setImageAttachment(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex h-full w-full flex-col rounded-lg bg-background shadow-sm">
      {/* Messages */}
      <ScrollArea className="flex-1 p-3">
        {messages.length === 0 ? (
          <div className="mt-10 flex h-full flex-col items-center justify-center p-4 text-center text-muted-foreground">
            <Sparkles className="mb-2 h-8 w-8 text-primary/50" />
            <p className="text-sm">Ask me anything to get started</p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex max-w-full gap-2",
                  message.role === "assistant" ? "items-start" : "items-start justify-end",
                )}>
                {message.role === "assistant" && (
                  <Avatar className="h-6 w-6 bg-primary/10">
                    <Sparkles className="h-3 w-3 text-primary" />
                  </Avatar>
                )}
                <div
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm",
                    message.role === "assistant" ? "bg-muted text-foreground" : "bg-primary text-primary-foreground",
                  )}>
                  {message.content}
                </div>
                {message.role === "user" && (
                  <Avatar className="h-6 w-6 bg-primary">
                    <span className="text-xs text-primary-foreground">You</span>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-2">
                <Avatar className="h-6 w-6 bg-primary/10">
                  <Sparkles className="h-3 w-3 text-primary" />
                </Avatar>
                <div className="rounded-lg bg-muted px-3 py-2">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Image attachment preview */}
      {imageAttachment && (
        <div className="px-3 pt-2">
          <div className="relative h-20 w-20 overflow-hidden rounded-md">
            <img src={imageAttachment || "/placeholder.svg"} alt="Attachment" className="h-full w-full object-cover" />
            <Button
              size="icon"
              variant="destructive"
              className="absolute right-0 top-0 h-5 w-5 rounded-full p-0"
              onClick={removeAttachment}>
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="mt-auto p-3">
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something..."
              className="max-h-[120px] min-h-[40px] resize-none border-0 bg-muted/50 py-2.5 pr-10 focus-visible:ring-1"
            />
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            <Button
              size="icon"
              variant="link"
              className="absolute bottom-2 right-2 h-6 w-6"
              onClick={triggerFileInput}>
              <Image className="h-4 w-4 text-muted-foreground" />
            </Button>
          </div>
          <Button
            size="sm"
            className="h-10 px-3"
            onClick={handleSend}
            disabled={isLoading || (!input.trim() && !imageAttachment)}>
            <Send className="mr-1 h-4 w-4" />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
