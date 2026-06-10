"use client";

import { useCallback, useMemo } from "react";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  type Node,
  type Edge,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { nodeTypes } from "./canvas-nodes";
import { AGENTS } from "@/lib/agents";

const folderNodes: Node[] = [
  { id: "folder-operations", type: "folder", position: { x: 100, y: 100 }, data: { label: "OPERATIONS" } },
  { id: "folder-clients", type: "folder", position: { x: 300, y: 80 }, data: { label: "CLIENTS" } },
  { id: "folder-internal", type: "folder", position: { x: 500, y: 120 }, data: { label: "INTERNAL" } },
  { id: "folder-saas", type: "folder", position: { x: 700, y: 90 }, data: { label: "SAAS" } },
];

const agentPositions: Record<string, { x: number; y: number; activeDots?: number[] }> = {
  orion: { x: 150, y: 280, activeDots: [0, 3] },
  hermes: { x: 350, y: 300, activeDots: [2, 5] },
  atlas: { x: 550, y: 280 },
  vega: { x: 750, y: 300 },
};

const initialEdges: Edge[] = [
  { id: "e-ops-clients", source: "folder-operations", target: "folder-clients", style: { stroke: "#1a6bff", strokeOpacity: 0.3 } },
  { id: "e-clients-internal", source: "folder-clients", target: "folder-internal", style: { stroke: "#1a6bff", strokeOpacity: 0.3 } },
  { id: "e-internal-saas", source: "folder-internal", target: "folder-saas", style: { stroke: "#1a6bff", strokeOpacity: 0.3 } },
  { id: "e-ops-orion", source: "folder-operations", target: "terminal-orion", style: { stroke: "#1a6bff", strokeOpacity: 0.3 } },
  { id: "e-clients-hermes", source: "folder-clients", target: "terminal-hermes", style: { stroke: "#1a6bff", strokeOpacity: 0.3 } },
  { id: "e-internal-atlas", source: "folder-internal", target: "terminal-atlas", style: { stroke: "#1a6bff", strokeOpacity: 0.3 } },
  { id: "e-saas-vega", source: "folder-saas", target: "terminal-vega", style: { stroke: "#1a6bff", strokeOpacity: 0.3 } },
  { id: "e-orion-hermes", source: "terminal-orion", target: "terminal-hermes", style: { stroke: "#1a6bff", strokeOpacity: 0.3 } },
  { id: "e-hermes-atlas", source: "terminal-hermes", target: "terminal-atlas", style: { stroke: "#1a6bff", strokeOpacity: 0.3 } },
];

export function FlowCanvas({
  selectedAgentId,
  onSelectAgent,
}: {
  selectedAgentId: string;
  onSelectAgent: (id: string) => void;
}) {
  const initialNodes = useMemo<Node[]>(() => {
    const terminalNodes: Node[] = AGENTS.map((agent) => {
      const pos = agentPositions[agent.id] ?? { x: 400, y: 450 };
      return {
        id: `terminal-${agent.id}`,
        type: "terminal",
        position: { x: pos.x, y: pos.y },
        data: {
          label: agent.name,
          active: agent.status === "active",
          activeDots: pos.activeDots,
          selected: agent.id === selectedAgentId,
        },
      };
    });
    return [...folderNodes, ...terminalNodes];
  }, [selectedAgentId]);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      if (node.id.startsWith("terminal-")) {
        onSelectAgent(node.id.replace("terminal-", ""));
      }
    },
    [onSelectAgent],
  );

  // Reflect selection highlight without losing drag positions
  const decoratedNodes = useMemo(
    () =>
      nodes.map((n) =>
        n.id.startsWith("terminal-")
          ? { ...n, data: { ...n.data, selected: n.id === `terminal-${selectedAgentId}` } }
          : n,
      ),
    [nodes, selectedAgentId],
  );

  return (
    <div className="flex-1 h-full">
      <ReactFlow
        nodes={decoratedNodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        className="bg-background"
        proOptions={{ hideAttribution: true }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#1e1e1e" />
        <Controls className="!bg-card !border-border" showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
