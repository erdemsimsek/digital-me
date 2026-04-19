"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

  const animateResponse = useCallback((text: string) => {
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
  }, []);

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
            <p className="text-gray-500 text-center px-4">{welcomeMessage}</p>
          </div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                  msg.role === "user"
                    ? "bg-indigo-600/80 text-white"
                    : "bg-white/[0.04] border border-indigo-500/10 text-gray-200 shadow-[0_0_15px_-3px_rgba(99,102,241,0.08)]"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {isTyping && typingText && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="max-w-[80%] rounded-2xl px-4 py-2.5 bg-white/[0.04] border border-indigo-500/10 text-gray-200 shadow-[0_0_15px_-3px_rgba(99,102,241,0.08)]">
              {typingText}
              <span className="inline-block w-1.5 h-4 bg-indigo-400 ml-0.5 animate-pulse rounded-sm" />
            </div>
          </motion.div>
        )}

        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="rounded-2xl px-4 py-3 bg-white/[0.04] border border-indigo-500/10">
              <span className="flex gap-1.5">
                <span className="w-2 h-2 bg-indigo-400/60 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-indigo-400/60 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-2 h-2 bg-indigo-400/60 rounded-full animate-bounce [animation-delay:0.3s]" />
              </span>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-white/[0.08] p-3 flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask about skills, experience, projects..."
          className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500/30 transition-all"
          disabled={loading || isTyping}
        />
        <Button
          onClick={sendMessage}
          disabled={loading || isTyping || !input.trim()}
          size="icon"
          className="shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl"
        >
          <Send size={18} />
        </Button>
      </div>
    </div>
  );
}
