"use client";

import { useRef, useEffect, useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Send, Loader2 } from "lucide-react";
import { getAgent } from "@/lib/agents";

function messageText(message: UIMessage): string {
  return (
    message.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("") || ""
  );
}

interface AgentChatProps {
  agentId: string;
  className?: string;
  placeholder?: string;
  greeting?: string;
}

export function AgentChat({ agentId, className = "", placeholder, greeting }: AgentChatProps) {
  const agent = getAgent(agentId);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ messages }) => ({
        body: { messages, agentId },
      }),
    }),
  });

  const isBusy = status === "streaming" || status === "submitted";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isBusy) return;
    sendMessage({ text: input });
    setInput("");
  };

  return (
    <div className={`flex flex-col h-full min-h-0 ${className}`}>
      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-3">
        {messages.length === 0 && (
          <div className="text-muted-foreground text-[11px] leading-relaxed">
            <span className="text-accent">{agent?.name ?? "AGENT"}</span> online —{" "}
            {greeting ?? "transmit a directive to begin."}
          </div>
        )}
        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <div key={message.id} className="flex items-start gap-2">
              <span
                className={`text-[10px] mt-0.5 tracking-wider flex-shrink-0 w-12 ${
                  isUser ? "text-muted-foreground" : "text-accent"
                }`}
              >
                {isUser ? "OPR>" : `${agent?.name ?? "SYS"}`}
              </span>
              <span
                className={`text-[11px] leading-relaxed whitespace-pre-wrap ${
                  isUser ? "text-muted-foreground" : "text-foreground"
                }`}
              >
                {messageText(message)}
              </span>
            </div>
          );
        })}
        {status === "submitted" && (
          <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>{agent?.name ?? "agent"} processing...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-3 py-3 border-t border-border">
        <span className="text-accent text-xs">{">"}</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder ?? `Message ${agent?.name ?? "agent"}...`}
          className="flex-1 bg-transparent text-foreground text-[11px] placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          type="submit"
          disabled={isBusy || !input.trim()}
          className="text-muted-foreground hover:text-accent disabled:opacity-40 transition-colors"
          aria-label="Send message"
        >
          {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
