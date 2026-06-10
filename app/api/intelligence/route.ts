import { generateText, Output } from "ai"
import { z } from "zod"
import { STRANDS, SYSTEM_METRICS, EVENT_LOG } from "@/lib/operational-data"
import { AGENTS } from "@/lib/agents"

export const maxDuration = 30

const briefSchema = z.object({
  headline: z.string().describe("One-line executive summary of the current operational picture."),
  threatLevel: z.enum(["nominal", "elevated", "high", "critical"]),
  insights: z
    .array(
      z.object({
        title: z.string(),
        detail: z.string().describe("2-3 sentence analysis."),
        severity: z.enum(["info", "watch", "action"]),
        relatedAgent: z.string().nullable(),
      }),
    )
    .describe("3 to 5 distinct intelligence insights."),
  recommendations: z.array(z.string()).describe("2 to 4 concrete recommended actions."),
})

export async function POST(req: Request) {
  const { focus }: { focus?: string } = await req.json().catch(() => ({}))

  const context = {
    agents: AGENTS.map((a) => ({ name: a.name, role: a.role, status: a.status })),
    strands: STRANDS,
    metrics: SYSTEM_METRICS,
    recentEvents: EVENT_LOG,
  }

  const { experimental_output } = await generateText({
    model: "anthropic/claude-sonnet-4.6",
    system:
      "You are VEGA, the analytics and intelligence agent of ASTRA HUB. Synthesize the provided live operational data into a concise, high-signal intelligence brief for the operator. Be analytical, surface anomalies and risks, and tie insights to specific strands or agents. Do not invent data outside what is provided.",
    prompt: `Generate an intelligence brief from the current operational state.${
      focus ? ` Focus area requested by operator: ${focus}.` : ""
    }\n\nLIVE DATA:\n${JSON.stringify(context, null, 2)}`,
    experimental_output: Output.object({ schema: briefSchema }),
  })

  return Response.json(experimental_output)
}
