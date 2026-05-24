"use client";

import { TopBar } from "./top-bar";
import { FlowCanvas } from "./flow-canvas";
import { TerminalPanel } from "./terminal-panel";

export function AstraHubDashboard() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <FlowCanvas />
        <TerminalPanel />
      </div>
    </div>
  );
}
