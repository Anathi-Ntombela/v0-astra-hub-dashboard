import { streamText, convertToModelMessages, type UIMessage } from "ai"
import { getAgent, DEFAULT_AGENT_ID } from "@/lib/agents"

export const maxDuration = 30

export async function POST(req: Request) {
  const {
    messages,
    agentId,
  }: { messages: UIMessage[]; agentId?: string } = await req.json()

  const agent = getAgent(agentId ?? DEFAULT_AGENT_ID) ?? getAgent(DEFAULT_AGENT_ID)!

  const result = streamText({
    model: "anthropic/claude-sonnet-4.6",
    system: agent.systemPrompt,
    messages: await convertToModelMessages(messages),
  })

  return result.toUIMessageStreamResponse()
}
