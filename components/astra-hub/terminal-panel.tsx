"use client";

import { ChevronDown } from "lucide-react";

const terminalLines = [
  {
    text: 'Strand execution initialized — RFI routing pipeline active',
    complete: true,
  },
  {
    text: '3 documents classified, 2 routed to ATLAS',
    complete: true,
  },
  {
    text: 'Awaiting HERMES confirmation on client intake',
    complete: true,
  },
  {
    text: '> Processing subcontractor compliance check f...',
    complete: false,
  },
];

export function TerminalPanel() {
  return (
    <div className="w-80 flex flex-col bg-[#0d0d0d] border-l border-primary h-full">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border">
        <h2 className="text-white text-sm tracking-wider">ORION TERMINAL</h2>
      </div>

      {/* Model selector */}
      <div className="px-4 py-3 border-b border-border">
        <span className="text-muted-foreground text-xs">ANTHROPIC</span>
        <button className="flex items-center justify-between w-full mt-2 px-3 py-2 bg-secondary text-white text-xs">
          <span>Default - Sonnet 4.6</span>
          <ChevronDown className="w-3 h-3" />
        </button>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-4 gap-1 px-4 py-3 border-b border-border">
        {["COMPACT", "SAVE", "CLEAR", "RESTART"].map((action) => (
          <button
            key={action}
            className="px-2 py-1.5 bg-secondary text-muted-foreground text-[10px] hover:text-white hover:bg-[#252525] transition-colors"
          >
            {action}
          </button>
        ))}
      </div>

      {/* Terminal output */}
      <div className="flex-1 px-4 py-3 overflow-y-auto">
        <div className="space-y-2">
          {terminalLines.map((line, index) => (
            <div key={index} className="flex items-start gap-2">
              <span
                className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                  line.complete ? "bg-green-500" : "bg-muted-foreground"
                }`}
              />
              <span
                className={`text-[11px] leading-relaxed ${
                  line.complete ? "text-white" : "text-muted-foreground"
                }`}
              >
                {line.text}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Operators section */}
      <div className="mt-auto px-4 py-3 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-muted-foreground text-xs">OPERATORS</span>
          <span className="text-white text-xs">0/3 ACTIVE</span>
        </div>
        <p className="text-muted-foreground text-[10px] leading-relaxed">
          OPEN SYSTEM → FEDERATION TO INVITE AN OPERATOR OR ACCEPT INVITE
        </p>
      </div>
    </div>
  );
}
