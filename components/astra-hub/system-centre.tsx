"use client";

import { useState } from "react";
import { Cpu, HardDrive, Activity, Clock, ShieldCheck, Loader2, Stethoscope } from "lucide-react";
import { AGENTS } from "@/lib/agents";
import { SYSTEM_METRICS } from "@/lib/operational-data";

interface Check {
  component: string;
  status: "pass" | "warn" | "fail";
  finding: string;
}

interface Diagnostics {
  overallHealth: "healthy" | "degraded" | "critical";
  summary: string;
  checks: Check[];
  remediations: string[];
}

const agentStatusColor: Record<string, string> = {
  active: "bg-green-500",
  idle: "bg-primary",
  offline: "bg-muted-foreground",
};

const checkStatusColor: Record<string, string> = {
  pass: "text-green-500",
  warn: "text-accent",
  fail: "text-destructive",
};

const healthColor: Record<string, string> = {
  healthy: "text-green-500 border-green-500/40 bg-green-500/10",
  degraded: "text-accent border-accent/40 bg-accent/10",
  critical: "text-destructive border-destructive/40 bg-destructive/10",
};

function Gauge({ icon, label, value, unit }: { icon: React.ReactNode; label: string; value: number; unit: string }) {
  return (
    <div className="bg-card border border-border p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-primary">{icon}</span>
        <span className="text-muted-foreground text-[10px] tracking-wider">{label}</span>
      </div>
      <p className="text-foreground text-xl leading-none mb-2">
        {value}
        <span className="text-muted-foreground text-xs ml-1">{unit}</span>
      </p>
      <div className="h-1 bg-secondary overflow-hidden">
        <div
          className={`h-full ${value > 80 ? "bg-destructive" : value > 60 ? "bg-accent" : "bg-primary"}`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </div>
  );
}

export function SystemCentre() {
  const [diag, setDiag] = useState<Diagnostics | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runDiagnostics() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/diagnostics", { method: "POST" });
      if (!res.ok) throw new Error("Diagnostics run failed");
      setDiag((await res.json()) as Diagnostics);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto flex flex-col gap-4">
        {/* Live gauges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Gauge icon={<Cpu className="w-4 h-4" />} label="CPU LOAD" value={SYSTEM_METRICS.cpuLoad} unit="%" />
          <Gauge icon={<HardDrive className="w-4 h-4" />} label="MEMORY" value={SYSTEM_METRICS.memoryUsage} unit="%" />
          <Gauge icon={<Activity className="w-4 h-4" />} label="THROUGHPUT" value={SYSTEM_METRICS.throughput} unit="/m" />
          <Gauge icon={<Clock className="w-4 h-4" />} label="ERROR RATE" value={SYSTEM_METRICS.errorRate} unit="%" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Agent federation */}
          <div className="bg-card border border-border">
            <div className="px-4 py-3 border-b border-primary flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <h3 className="text-foreground text-xs tracking-wider">AGENT FEDERATION</h3>
            </div>
            <div className="divide-y divide-border">
              {AGENTS.map((agent) => (
                <div key={agent.id} className="px-4 py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${agentStatusColor[agent.status]}`} />
                    <div className="min-w-0">
                      <p className="text-foreground text-[12px]">{agent.name}</p>
                      <p className="text-muted-foreground text-[10px] truncate">{agent.role}</p>
                    </div>
                  </div>
                  <span className="text-muted-foreground text-[9px] tracking-wider uppercase flex-shrink-0">
                    {agent.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* AI diagnostics */}
          <div className="bg-card border border-border flex flex-col">
            <div className="px-4 py-3 border-b border-primary flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Stethoscope className="w-4 h-4 text-accent" />
                <h3 className="text-foreground text-xs tracking-wider">AI DIAGNOSTICS</h3>
              </div>
              <button
                onClick={runDiagnostics}
                disabled={loading}
                className="flex items-center gap-1.5 text-[10px] tracking-wider px-2.5 py-1 border border-primary text-primary hover:bg-primary/10 transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Activity className="w-3 h-3" />}
                {loading ? "SCANNING" : "RUN SCAN"}
              </button>
            </div>

            <div className="flex-1 p-4">
              {error && <p className="text-destructive text-[11px]">{error}</p>}

              {!diag && !loading && !error && (
                <p className="text-muted-foreground text-[11px] leading-relaxed">
                  Run an AI diagnostic scan to analyze system health across all subsystems.
                </p>
              )}

              {diag && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-foreground text-[12px] leading-relaxed">{diag.summary}</p>
                    <span
                      className={`flex-shrink-0 text-[9px] tracking-wider px-2 py-1 border uppercase ${healthColor[diag.overallHealth]}`}
                    >
                      {diag.overallHealth}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    {diag.checks.map((check, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className={`text-[10px] mt-0.5 ${checkStatusColor[check.status]}`}>
                          [{check.status.toUpperCase()}]
                        </span>
                        <div>
                          <p className="text-foreground text-[11px]">{check.component}</p>
                          <p className="text-muted-foreground text-[10px] leading-relaxed">{check.finding}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {diag.remediations.length > 0 && (
                    <div className="border-t border-border pt-3">
                      <p className="text-accent text-[9px] tracking-wider mb-2">REMEDIATIONS</p>
                      <ul className="flex flex-col gap-1.5">
                        {diag.remediations.map((rem, i) => (
                          <li key={i} className="text-muted-foreground text-[10px] leading-relaxed flex gap-2">
                            <span className="text-accent flex-shrink-0">→</span>
                            {rem}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
