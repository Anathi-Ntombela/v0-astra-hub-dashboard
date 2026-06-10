"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { AGENTS } from "@/lib/agents";
import { AgentChat } from "./agent-chat";

const MODELS = ["Default - Sonnet 4.6", "Opus 4.8", "Haiku 4.5"];

export function TerminalPanel({
  selectedAgentId,
  onSelectAgent,
}: {
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
}) {
  const [model, setModel] = useState(MODELS[0]);
  const [modelOpen, setModelOpen] = useState(false);
  const [agentOpen, setAgentOpen] = useState(false);
  const agent = AGENTS.find((a) => a.id === selectedAgentId) ?? AGENTS[0];

  return (
    <div className="w-80 flex flex-col bg-[#0d0d0d] border-l border-primary h-full min-h-0">
      {/* Header with agent selector */}
      <div className="px-4 py-3 border-b border-border relative">
        <button
          onClick={() => setAgentOpen((o) => !o)}
          className="flex items-center justify-between w-full"
        >
          <h2 className="text-foreground text-sm tracking-wider">{agent.name} TERMINAL</h2>
          <ChevronDown className="w-3 h-3 text-muted-foreground" />
        </button>
        <p className="text-muted-foreground text-[10px] mt-1">{agent.role}</p>
        {agentOpen && (
          <div className="absolute left-0 right-0 top-full z-20 bg-popover border border-border mx-2 mt-1">
            {AGENTS.map((a) => (
              <button
                key={a.id}
                onClick={() => {
                  onSelectAgent(a.id);
                  setAgentOpen(false);
                }}
                className={`flex items-center justify-between w-full px-3 py-2 text-xs hover:bg-secondary transition-colors ${
                  a.id === selectedAgentId ? "text-accent" : "text-foreground"
                }`}
              >
                <span>{a.name}</span>
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    a.status === "active" ? "bg-green-500" : a.status === "idle" ? "bg-muted-foreground" : "bg-destructive"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Model selector */}
      <div className="px-4 py-3 border-b border-border relative">
        <span className="text-muted-foreground text-xs">ANTHROPIC</span>
        <button
          onClick={() => setModelOpen((o) => !o)}
          className="flex items-center justify-between w-full mt-2 px-3 py-2 bg-secondary text-foreground text-xs"
        >
          <span>{model}</span>
          <ChevronDown className="w-3 h-3" />
        </button>
        {modelOpen && (
          <div className="absolute left-2 right-2 top-full z-20 bg-popover border border-border mt-1">
            {MODELS.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setModel(m);
                  setModelOpen(false);
                }}
                className="block w-full text-left px-3 py-2 text-xs text-foreground hover:bg-secondary transition-colors"
              >
                {m}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Functional AI chat (keyed so switching agents resets the thread) */}
      <AgentChat
        key={agent.id}
        agentId={agent.id}
        greeting={`${agent.description}`}
      />

      {/* Operators section */}
      <div className="px-4 py-3 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground text-xs">CAPABILITIES</span>
        </div>
        <div className="flex flex-wrap gap-1">
          {agent.capabilities.map((cap) => (
            <span
              key={cap}
              className="px-2 py-0.5 bg-secondary text-muted-foreground text-[9px] tracking-wide"
            >
              {cap}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
