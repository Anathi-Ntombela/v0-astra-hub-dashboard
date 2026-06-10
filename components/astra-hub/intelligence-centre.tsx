"use client";

import { useState } from "react";
import { Brain, AlertTriangle, Lightbulb, RefreshCw, Loader2 } from "lucide-react";

interface Insight {
  title: string;
  detail: string;
  severity: "info" | "watch" | "action";
  relatedAgent: string | null;
}

interface Brief {
  headline: string;
  threatLevel: "nominal" | "elevated" | "high" | "critical";
  insights: Insight[];
  recommendations: string[];
}

const threatColor: Record<string, string> = {
  nominal: "text-green-500 border-green-500/40 bg-green-500/10",
  elevated: "text-primary border-primary/40 bg-primary/10",
  high: "text-accent border-accent/40 bg-accent/10",
  critical: "text-destructive border-destructive/40 bg-destructive/10",
};

const severityColor: Record<string, string> = {
  info: "text-primary",
  watch: "text-accent",
  action: "text-destructive",
};

const focusOptions = ["Full picture", "Compliance risk", "Client pipeline", "System performance"];

export function IntelligenceCentre() {
  const [brief, setBrief] = useState<Brief | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focus, setFocus] = useState("Full picture");

  async function generate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ focus: focus === "Full picture" ? undefined : focus }),
      });
      if (!res.ok) throw new Error("Failed to generate brief");
      const data = (await res.json()) as Brief;
      setBrief(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex-1 min-h-0 overflow-y-auto p-4">
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        {/* Header / controls */}
        <div className="bg-card border border-border p-4 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="text-accent">
              <Brain className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-foreground text-sm tracking-wider">VEGA INTELLIGENCE SYNTHESIS</h2>
              <p className="text-muted-foreground text-[11px]">
                AI-generated brief from live operational telemetry
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {focusOptions.map((opt) => (
              <button
                key={opt}
                onClick={() => setFocus(opt)}
                className={`text-[10px] tracking-wider px-3 py-1.5 border transition-colors ${
                  focus === opt
                    ? "border-primary text-primary bg-primary/10"
                    : "border-border text-muted-foreground hover:text-foreground"
                }`}
              >
                {opt.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-primary text-primary-foreground text-xs tracking-wider py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> SYNTHESIZING...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" /> {brief ? "REGENERATE BRIEF" : "GENERATE BRIEF"}
              </>
            )}
          </button>

          {error && <p className="text-destructive text-[11px]">{error}</p>}
        </div>

        {/* Empty state */}
        {!brief && !loading && (
          <div className="bg-card border border-border border-dashed p-10 text-center">
            <Brain className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-xs">
              No active brief. Select a focus area and generate an intelligence synthesis.
            </p>
          </div>
        )}

        {/* Brief output */}
        {brief && (
          <div className="flex flex-col gap-4">
            <div className="bg-card border border-border p-4">
              <div className="flex items-start justify-between gap-4">
                <p className="text-foreground text-sm leading-relaxed text-pretty">{brief.headline}</p>
                <span
                  className={`flex-shrink-0 text-[10px] tracking-wider px-2 py-1 border uppercase ${threatColor[brief.threatLevel]}`}
                >
                  {brief.threatLevel}
                </span>
              </div>
            </div>

            <div className="bg-card border border-border">
              <div className="px-4 py-3 border-b border-primary flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-primary" />
                <h3 className="text-foreground text-xs tracking-wider">INSIGHTS</h3>
              </div>
              <div className="divide-y divide-border">
                {brief.insights.map((insight, i) => (
                  <div key={i} className="px-4 py-3">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[9px] tracking-wider uppercase ${severityColor[insight.severity]}`}>
                        {insight.severity}
                      </span>
                      {insight.relatedAgent && (
                        <span className="text-muted-foreground text-[9px]">// {insight.relatedAgent}</span>
                      )}
                    </div>
                    <p className="text-foreground text-[12px] mb-1">{insight.title}</p>
                    <p className="text-muted-foreground text-[11px] leading-relaxed">{insight.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-card border border-border">
              <div className="px-4 py-3 border-b border-primary flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-accent" />
                <h3 className="text-foreground text-xs tracking-wider">RECOMMENDATIONS</h3>
              </div>
              <ul className="px-4 py-3 flex flex-col gap-2">
                {brief.recommendations.map((rec, i) => (
                  <li key={i} className="flex gap-2 text-[11px] text-foreground leading-relaxed">
                    <span className="text-accent flex-shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
