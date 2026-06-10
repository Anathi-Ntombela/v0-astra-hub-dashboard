// In-memory operational state for the ASTRA HUB demo.
// In production this would be backed by a database.

export interface Strand {
  id: string
  name: string
  status: "running" | "queued" | "blocked" | "complete"
  assignedAgent: string
  priority: "low" | "medium" | "high" | "critical"
  progress: number
}

export interface SystemMetrics {
  cpuLoad: number
  memoryUsage: number
  queueDepth: number
  throughput: number
  errorRate: number
  uptimeHours: number
}

export const STRANDS: Strand[] = [
  { id: "STR-001", name: "RFI routing pipeline", status: "running", assignedAgent: "ORION", priority: "high", progress: 72 },
  { id: "STR-002", name: "Client intake — Meridian Corp", status: "running", assignedAgent: "HERMES", priority: "high", progress: 45 },
  { id: "STR-003", name: "Subcontractor compliance check", status: "blocked", assignedAgent: "ATLAS", priority: "critical", progress: 30 },
  { id: "STR-004", name: "Q3 telemetry synthesis", status: "queued", assignedAgent: "VEGA", priority: "medium", progress: 0 },
  { id: "STR-005", name: "Document classification batch", status: "running", assignedAgent: "ORION", priority: "medium", progress: 88 },
  { id: "STR-006", name: "Weekly intelligence brief", status: "queued", assignedAgent: "VEGA", priority: "low", progress: 0 },
  { id: "STR-007", name: "Contract anomaly scan", status: "complete", assignedAgent: "ATLAS", priority: "high", progress: 100 },
]

export const SYSTEM_METRICS: SystemMetrics = {
  cpuLoad: 34,
  memoryUsage: 61,
  queueDepth: 3,
  throughput: 142,
  errorRate: 0.4,
  uptimeHours: 4.37,
}

export interface EventLog {
  time: string
  agent: string
  severity: "info" | "warn" | "error"
  message: string
}

export const EVENT_LOG: EventLog[] = [
  { time: "16:22:04", agent: "ORION", severity: "info", message: "Strand execution initialized — RFI routing pipeline active" },
  { time: "16:21:51", agent: "ORION", severity: "info", message: "3 documents classified, 2 routed to ATLAS" },
  { time: "16:20:33", agent: "HERMES", severity: "info", message: "Client intake confirmation pending — Meridian Corp" },
  { time: "16:19:12", agent: "ATLAS", severity: "warn", message: "Subcontractor compliance check stalled — missing insurance cert" },
  { time: "16:17:48", agent: "VEGA", severity: "info", message: "Telemetry buffer flushed — 142 events/min throughput" },
  { time: "16:15:02", agent: "ATLAS", severity: "error", message: "Contract anomaly detected in STR-007 — escalated and resolved" },
]
