"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { AGENTS } from "@/lib/agents";

export type ViewId = "studio" | "command" | "intelligence" | "system";

const tabs: { id: ViewId; label: string }[] = [
  { id: "studio", label: "STUDIO" },
  { id: "command", label: "COMMAND CENTRE" },
  { id: "intelligence", label: "INTELLIGENCE" },
  { id: "system", label: "SYSTEM" },
];

export function TopBar({
  activeView,
  onViewChange,
}: {
  activeView: ViewId;
  onViewChange: (view: ViewId) => void;
}) {
  const [uptime, setUptime] = useState({ hours: 4, minutes: 22, seconds: 17 });

  useEffect(() => {
    const interval = setInterval(() => {
      setUptime((prev) => {
        let { hours, minutes, seconds } = prev;
        seconds++;
        if (seconds >= 60) {
          seconds = 0;
          minutes++;
        }
        if (minutes >= 60) {
          minutes = 0;
          hours++;
        }
        return { hours, minutes, seconds };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = () => {
    const h = String(uptime.hours).padStart(2, "0");
    const m = String(uptime.minutes).padStart(2, "0");
    const s = String(uptime.seconds).padStart(2, "0");
    return `${h}:${m}:${s}`;
  };

  const activeAgents = AGENTS.filter((a) => a.status === "active").length;

  return (
    <div className="flex items-center justify-between h-12 px-4 border-b border-primary bg-background">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-foreground font-bold text-sm tracking-wide">ASTRA HUB</span>
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-glow" style={{ color: "#22c55e" }} />
      </div>

      {/* Center tabs */}
      <div className="flex items-center gap-1">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => onViewChange(tab.id)}
            className={`px-3 py-1.5 text-xs tracking-wider transition-colors ${
              activeView === tab.id
                ? "text-foreground bg-secondary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            [{index + 1}] {tab.label}
          </button>
        ))}
      </div>

      {/* Right metrics */}
      <div className="flex items-center gap-4 text-xs">
        <span className="text-muted-foreground">
          STRANDS: <span className="text-foreground">12</span>
        </span>
        <span className="text-muted-foreground">
          NODES: <span className="text-foreground">{AGENTS.length + 4}</span>
        </span>
        <span className="text-muted-foreground">
          AGENTS: <span className="text-foreground">{activeAgents}</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-foreground">{formatTime()}</span>
        </div>
        <button className="flex items-center gap-1 px-2 py-1 text-muted-foreground hover:text-foreground border border-border hover:border-primary transition-colors">
          POP OUT
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
