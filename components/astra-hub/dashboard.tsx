"use client";

import { useState } from "react";
import { TopBar, type ViewId } from "./top-bar";
import { FlowCanvas } from "./flow-canvas";
import { TerminalPanel } from "./terminal-panel";
import { CommandCentre } from "./command-centre";
import { IntelligenceCentre } from "./intelligence-centre";
import { SystemCentre } from "./system-centre";
import { DEFAULT_AGENT_ID } from "@/lib/agents";

export function AstraHubDashboard() {
  const [activeView, setActiveView] = useState<ViewId>("studio");
  const [selectedAgentId, setSelectedAgentId] = useState<string>(DEFAULT_AGENT_ID);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background">
      <TopBar activeView={activeView} onViewChange={setActiveView} />
      <div className="flex flex-1 overflow-hidden min-h-0">
        {activeView === "studio" && (
          <>
            <FlowCanvas selectedAgentId={selectedAgentId} onSelectAgent={setSelectedAgentId} />
            <TerminalPanel selectedAgentId={selectedAgentId} onSelectAgent={setSelectedAgentId} />
          </>
        )}
        {activeView === "command" && <CommandCentre />}
        {activeView === "intelligence" && <IntelligenceCentre />}
        {activeView === "system" && <SystemCentre />}
      </div>
    </div>
  );
}
