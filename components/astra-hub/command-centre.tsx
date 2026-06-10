"use client";

import { Activity, Cpu, Layers, AlertTriangle } from "lucide-react";
import { STRANDS, SYSTEM_METRICS } from "@/lib/operational-data";
import { ToolConsole } from "./tool-console";

const statusColor: Record<string, string> = {
  running: "bg-green-500",
  queued: "bg-primary",
  blocked: "bg-destructive",
  complete: "bg-muted-foreground",
};

const priorityColor: Record<string, string> = {
  critical: "text-destructive",
  high: "text-accent",
  medium: "text-primary",
  low: "text-muted-foreground",
};

function MetricCard({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: string | number; unit?: string }) {
  return (
    <div className="flex items-center gap-3 bg-card border border-border px-4 py-3">
      <div className="text-primary">{icon}</div>
      <div>
        <p className="text-muted-foreground text-[10px] tracking-wider">{label}</p>
        <p className="text-foreground text-lg leading-tight">
          {value}
          {unit && <span className="text-muted-foreground text-xs ml-1">{unit}</span>}
        </p>
      </div>
    </div>
  );
}

export function CommandCentre() {
  return (
    <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-y-auto">
      {/* Left column: live operational state */}
      <div className="flex flex-col gap-4 min-h-0">
        <div className="grid grid-cols-2 gap-3">
          <MetricCard icon={<Cpu className="w-5 h-5" />} label="CPU LOAD" value={SYSTEM_METRICS.cpuLoad} unit="%" />
          <MetricCard icon={<Activity className="w-5 h-5" />} label="THROUGHPUT" value={SYSTEM_METRICS.throughput} unit="/min" />
          <MetricCard icon={<Layers className="w-5 h-5" />} label="QUEUE DEPTH" value={SYSTEM_METRICS.queueDepth} />
          <MetricCard icon={<AlertTriangle className="w-5 h-5" />} label="ERROR RATE" value={SYSTEM_METRICS.errorRate} unit="%" />
        </div>

        <div className="flex-1 min-h-0 bg-card border border-border flex flex-col">
          <div className="px-4 py-3 border-b border-primary">
            <h2 className="text-foreground text-sm tracking-wider">ACTIVE STRANDS</h2>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto divide-y divide-border">
            {STRANDS.map((strand) => (
              <div key={strand.id} className="px-4 py-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusColor[strand.status]}`} />
                    <span className="text-muted-foreground text-[10px] flex-shrink-0">{strand.id}</span>
                    <span className="text-foreground text-[11px] truncate">{strand.name}</span>
                  </div>
                  <span className={`text-[9px] tracking-wider uppercase flex-shrink-0 ${priorityColor[strand.priority]}`}>
                    {strand.priority}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-muted-foreground text-[9px] w-12">{strand.assignedAgent}</span>
                  <div className="flex-1 h-1 bg-secondary overflow-hidden">
                    <div className="h-full bg-primary" style={{ width: `${strand.progress}%` }} />
                  </div>
                  <span className="text-muted-foreground text-[9px] w-8 text-right">{strand.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column: AI command console */}
      <div className="min-h-0 h-full">
        <ToolConsole
          api="/api/command"
          title="COMMAND CONSOLE"
          accentLabel="TOOL-ENABLED"
          greeting="Mission control online. I can inspect live strands, agent status, metrics, and dispatch directives. Ask me anything or issue a command."
          suggestions={[
            "What strands are blocked?",
            "Show me agent status",
            "Current system metrics",
            "Escalate STR-003 to ATLAS",
          ]}
        />
      </div>
    </div>
  );
}
