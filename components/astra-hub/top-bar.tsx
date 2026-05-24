"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

const tabs = ["STUDIO", "COMMAND CENTRE", "INTELLIGENCE", "SYSTEM"];

export function TopBar() {
  const [activeTab, setActiveTab] = useState(0);
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

  return (
    <div className="flex items-center justify-between h-12 px-4 border-b border-primary bg-background">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-white font-bold text-sm tracking-wide">ASTRA HUB</span>
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-glow" style={{ color: '#22c55e' }} />
      </div>

      {/* Center tabs */}
      <div className="flex items-center gap-1">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            onClick={() => setActiveTab(index)}
            className={`px-3 py-1.5 text-xs tracking-wider transition-colors ${
              activeTab === index
                ? "text-white bg-secondary"
                : "text-muted-foreground hover:text-white"
            }`}
          >
            [{index + 1}] {tab}
          </button>
        ))}
      </div>

      {/* Right metrics */}
      <div className="flex items-center gap-4 text-xs">
        <span className="text-muted-foreground">
          STRANDS: <span className="text-white">12</span>
        </span>
        <span className="text-muted-foreground">
          NODES: <span className="text-white">8</span>
        </span>
        <span className="text-muted-foreground">
          OPERATORS: <span className="text-white">3</span>
        </span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span className="text-white">{formatTime()}</span>
        </div>
        <button className="flex items-center gap-1 px-2 py-1 text-muted-foreground hover:text-white border border-border hover:border-primary transition-colors">
          POP OUT
          <ArrowUpRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
