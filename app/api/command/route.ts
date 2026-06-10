import { streamText, convertToModelMessages, tool, stepCountIs, type UIMessage } from "ai"
import { z } from "zod"
import { AGENTS } from "@/lib/agents"
import { STRANDS, SYSTEM_METRICS, EVENT_LOG } from "@/lib/operational-data"

export const maxDuration = 30

const COMMAND_SYSTEM = `You are the ASTRA HUB COMMAND CENTRE controller — a mission-control orchestrator with authority over the agent federation (ORION, HERMES, ATLAS, VEGA).

You help the operator command the system. Use your tools to inspect live operational state (strands, agents, metrics, events) and to dispatch directives before answering. Always ground answers in tool results — never invent strand IDs, statuses, or metrics. Be terse and operational, like mission control. When you dispatch a command, confirm what was actioned.`

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: "anthropic/claude-sonnet-4.6",
    system: COMMAND_SYSTEM,
    messages: await convertToModelMessages(messages),
    stopWhen: stepCountIs(8),
    tools: {
      listStrands: tool({
        description: "List all operational strands (workflows) with their status, assigned agent, priority and progress.",
        inputSchema: z.object({
          status: z
            .enum(["running", "queued", "blocked", "complete", "all"])
            .nullable()
            .describe("Optional status filter. Use 'all' or null for everything."),
        }),
        execute: async ({ status }) => {
          const list = !status || status === "all" ? STRANDS : STRANDS.filter((s) => s.status === status)
          return { count: list.length, strands: list }
        },
      }),
      getAgentStatus: tool({
        description: "Get the status, role, and capabilities of agents in the federation.",
        inputSchema: z.object({
          agentId: z.string().nullable().describe("Agent id (orion, hermes, atlas, vega) or null for all agents."),
        }),
        execute: async ({ agentId }) => {
          const list = agentId ? AGENTS.filter((a) => a.id === agentId.toLowerCase()) : AGENTS
          return {
            agents: list.map((a) => ({
              id: a.id,
              name: a.name,
              role: a.role,
              status: a.status,
              domain: a.domain,
              capabilities: a.capabilities,
            })),
          }
        },
      }),
      getSystemMetrics: tool({
        description: "Get current live system telemetry: CPU, memory, queue depth, throughput, error rate, uptime.",
        inputSchema: z.object({}),
        execute: async () => SYSTEM_METRICS,
      }),
      getEventLog: tool({
        description: "Get the most recent system event log entries across all agents.",
        inputSchema: z.object({
          severity: z.enum(["info", "warn", "error", "all"]).nullable(),
        }),
        execute: async ({ severity }) => {
          const list = !severity || severity === "all" ? EVENT_LOG : EVENT_LOG.filter((e) => e.severity === severity)
          return { events: list }
        },
      }),
      dispatchDirective: tool({
        description:
          "Dispatch an operational directive to an agent — e.g. start, pause, reprioritize, or reassign a strand. This simulates issuing the command.",
        inputSchema: z.object({
          agentId: z.string().describe("Target agent id (orion, hermes, atlas, vega)."),
          action: z.string().describe("The directive, e.g. 'start STR-004' or 'escalate STR-003'."),
        }),
        execute: async ({ agentId, action }) => {
          const agent = AGENTS.find((a) => a.id === agentId.toLowerCase())
          return {
            dispatched: true,
            target: agent?.name ?? agentId.toUpperCase(),
            action,
            acknowledgedAt: new Date().toISOString(),
            note: agent ? `${agent.name} acknowledged directive.` : "Unknown agent — directive logged but unrouted.",
          }
        },
      }),
    },
  })

  return result.toUIMessageStreamResponse()
}
