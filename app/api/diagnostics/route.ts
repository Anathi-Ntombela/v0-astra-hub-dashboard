import { generateText, Output } from "ai"
import { z } from "zod"
import { SYSTEM_METRICS, STRANDS, EVENT_LOG } from "@/lib/operational-data"
import { AGENTS } from "@/lib/agents"

export const maxDuration = 30

const diagnosticsSchema = z.object({
  overallHealth: z.enum(["healthy", "degraded", "critical"]),
  summary: z.string().describe("One or two sentence diagnosis of overall system health."),
  checks: z
    .array(
      z.object({
        component: z.string().describe("The subsystem being assessed, e.g. 'Queue', 'Agent Federation', 'Error Rate'."),
        status: z.enum(["pass", "warn", "fail"]),
        finding: z.string().describe("Short technical finding for this component."),
      }),
    )
    .describe("4 to 6 component health checks."),
  remediations: z.array(z.string()).describe("1 to 3 suggested remediation steps, most urgent first."),
})

export async function POST() {
  const context = {
    agents: AGENTS.map((a) => ({ name: a.name, role: a.role, status: a.status })),
    metrics: SYSTEM_METRICS,
    strands: STRANDS.map((s) => ({ id: s.id, status: s.status, agent: s.assignedAgent, priority: s.priority })),
    recentEvents: EVENT_LOG,
  }

  const { experimental_output } = await generateText({
    model: "anthropic/claude-sonnet-4.6",
    system:
      "You are the ASTRA HUB system diagnostics engine. Analyze the live system metrics, agent federation status, strand backlog, and recent events to produce a technical health report. Be precise and infrastructure-focused. Base every finding strictly on the provided data.",
    prompt: `Run a full system diagnostic.\n\nLIVE DATA:\n${JSON.stringify(context, null, 2)}`,
    experimental_output: Output.object({ schema: diagnosticsSchema }),
  })

  return Response.json(experimental_output)
}
