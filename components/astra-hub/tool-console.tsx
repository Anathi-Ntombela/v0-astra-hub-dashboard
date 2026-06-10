"use client";

import { useRef, useEffect, useState, type FormEvent } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Send, Loader2, Terminal, Wrench } from "lucide-react";

function messageText(message: UIMessage): string {
  return (
    message.parts
      ?.filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("") || ""
  );
}

interface ToolConsoleProps {
  api: string;
  title: string;
  greeting: string;
  suggestions: string[];
  accentLabel: string;
}

export function ToolConsole({ api, title, greeting, suggestions, accentLabel }: ToolConsoleProps) {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api }),
  });

  const isBusy = status === "streaming" || status === "submitted";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const submit = (text: string) => {
    if (!text.trim() || isBusy) return;
    sendMessage({ text });
    setInput("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(input);
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-card border border-border">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-primary">
        <Terminal className="w-4 h-4 text-accent" />
        <h2 className="text-foreground text-sm tracking-wider">{title}</h2>
        <span className="ml-auto text-[10px] text-muted-foreground tracking-wider">{accentLabel}</span>
      </div>

      <div ref={scrollRef} className="flex-1 min-h-0 overflow-y-auto px-4 py-4 space-y-4">
        {messages.length === 0 && (
          <div className="space-y-4">
            <p className="text-muted-foreground text-[11px] leading-relaxed">{greeting}</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => submit(s)}
                  className="px-3 py-1.5 border border-border text-muted-foreground text-[10px] hover:border-accent hover:text-accent transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => {
          const isUser = message.role === "user";
          return (
            <div key={message.id} className="space-y-2">
              {message.parts?.map((part, i) => {
                if (part.type === "text") {
                  return (
                    <div key={i} className="flex items-start gap-2">
                      <span
                        className={`text-[10px] mt-0.5 tracking-wider flex-shrink-0 w-14 ${
                          isUser ? "text-muted-foreground" : "text-accent"
                        }`}
                      >
                        {isUser ? "OPERATOR" : "ASTRA"}
                      </span>
                      <span
                        className={`text-[11px] leading-relaxed whitespace-pre-wrap ${
                          isUser ? "text-muted-foreground" : "text-foreground"
                        }`}
                      >
                        {part.text}
                      </span>
                    </div>
                  );
                }
                if (part.type.startsWith("tool-")) {
                  const toolName = part.type.replace("tool-", "");
                  const state = (part as { state?: string }).state;
                  return (
                    <div key={i} className="ml-16 flex items-center gap-2 text-[10px] text-primary border border-border bg-secondary px-2 py-1">
                      <Wrench className="w-3 h-3" />
                      <span className="tracking-wider">{toolName}</span>
                      <span className="text-muted-foreground">
                        {state === "output-available" ? "· complete" : "· running"}
                      </span>
                    </div>
                  );
                }
                return null;
              })}
            </div>
          );
        })}

        {status === "submitted" && (
          <div className="flex items-center gap-2 text-muted-foreground text-[11px]">
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>controller processing...</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-2 px-4 py-3 border-t border-border">
        <span className="text-accent text-xs">{">"}</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Issue a directive..."
          className="flex-1 bg-transparent text-foreground text-[11px] placeholder:text-muted-foreground focus:outline-none"
        />
        <button
          type="submit"
          disabled={isBusy || !input.trim()}
          className="text-muted-foreground hover:text-accent disabled:opacity-40 transition-colors"
          aria-label="Send"
        >
          {isBusy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
