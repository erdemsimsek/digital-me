"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import type { Message } from "@/lib/types";

interface ChatInterfaceProps {
  welcomeMessage: string;
}

export default function ChatInterface({ welcomeMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [typingText, setTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingText, scrollToBottom]);

  const animateResponse = useCallback(
    (text: string) => {
      setIsTyping(true);
      const words = text.split(" ");
      let current = "";
      let i = 0;

      const interval = setInterval(() => {
        if (i < words.length) {
          current += (i > 0 ? " " : "") + words[i];
          setTypingText(current);
          i++;
        } else {
          clearInterval(interval);
          setTypingText("");
          setIsTyping(false);
          setMessages((prev) => [...prev, { role: "assistant", content: text }]);
          inputRef.current?.focus();
        }
      }, 35);

      return () => clearInterval(interval);
    },
    []
  );

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || loading || isTyping) return;

    const userMessage: Message = { role: "user", content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          history: updatedMessages,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));

        if (response.status === 429) {
          setMessages((prev) => [
            ...prev,
            {
              role: "assistant",
              content:
                errorData.message ||
                "You're sending messages too quickly. Please wait a moment.",
            },
          ]);
          return;
        }

        if (response.status === 400 && errorData.message) {
          setMessages((prev) => [
            ...prev,
            { role: "assistant", content: errorData.message },
          ]);
          return;
        }

        throw new Error(errorData.message || "Something went wrong");
      }

      const { answer } = await response.json();
      setLoading(false);
      animateResponse(answer);
      return;
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px] max-h-[600px]">
        {messages.length === 0 && !isTyping && (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground text-center px-4">
              {welcomeMessage}
            </p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.role === "user"
                  ? "bg-blue-600/90 text-white"
                  : "bg-white/5 border border-white/10 text-gray-200"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {isTyping && typingText && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-2 bg-white/5 border border-white/10 text-gray-200">
              {typingText}
              <span className="inline-block w-1.5 h-4 bg-blue-400 ml-0.5 animate-pulse" />
            </div>
          </div>
        )}

        {loading && (
          <div className="flex justify-start">
            <div className="rounded-lg px-4 py-2 bg-white/5 border border-white/10 text-muted-foreground">
              <span className="flex gap-1">
                <span className="animate-bounce">.</span>
                <span className="animate-bounce [animation-delay:0.1s]">.</span>
                <span className="animate-bounce [animation-delay:0.2s]">.</span>
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-white/10 p-3 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about skills, experience, projects..."
          className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
          disabled={loading || isTyping}
        />
        <Button
          onClick={sendMessage}
          disabled={loading || isTyping || !input.trim()}
          size="icon"
          className="shrink-0"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
}
