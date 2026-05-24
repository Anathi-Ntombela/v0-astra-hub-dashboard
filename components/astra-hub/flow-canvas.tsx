"use client";

import { useCallback } from "react";
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

const initialNodes: Node[] = [
  // Folder nodes
  {
    id: "folder-operations",
    type: "folder",
    position: { x: 100, y: 100 },
    data: { label: "OPERATIONS" },
  },
  {
    id: "folder-clients",
    type: "folder",
    position: { x: 300, y: 80 },
    data: { label: "CLIENTS" },
  },
  {
    id: "folder-internal",
    type: "folder",
    position: { x: 500, y: 120 },
    data: { label: "INTERNAL" },
  },
  {
    id: "folder-saas",
    type: "folder",
    position: { x: 700, y: 90 },
    data: { label: "SAAS" },
  },
  // Terminal nodes (active)
  {
    id: "terminal-orion",
    type: "terminal",
    position: { x: 150, y: 280 },
    data: { label: "ORION", active: true, activeDots: [0, 3] },
  },
  {
    id: "terminal-hermes",
    type: "terminal",
    position: { x: 350, y: 300 },
    data: { label: "HERMES", active: true, activeDots: [2, 5] },
  },
  // Terminal nodes (inactive)
  {
    id: "terminal-atlas",
    type: "terminal",
    position: { x: 550, y: 280 },
    data: { label: "ATLAS", active: false },
  },
  {
    id: "terminal-vega",
    type: "terminal",
    position: { x: 750, y: 300 },
    data: { label: "VEGA", active: false },
  },
  {
    id: "terminal-idle-1",
    type: "terminal",
    position: { x: 250, y: 450 },
    data: { label: "IDLE-01", active: false },
  },
  {
    id: "terminal-idle-2",
    type: "terminal",
    position: { x: 600, y: 450 },
    data: { label: "IDLE-02", active: false },
  },
];

const initialEdges: Edge[] = [
  // Folder connections
  {
    id: "e-ops-clients",
    source: "folder-operations",
    target: "folder-clients",
    style: { stroke: "#1a6bff", strokeOpacity: 0.3 },
  },
  {
    id: "e-clients-internal",
    source: "folder-clients",
    target: "folder-internal",
    style: { stroke: "#1a6bff", strokeOpacity: 0.3 },
  },
  {
    id: "e-internal-saas",
    source: "folder-internal",
    target: "folder-saas",
    style: { stroke: "#1a6bff", strokeOpacity: 0.3 },
  },
  // Folder to terminal connections
  {
    id: "e-ops-orion",
    source: "folder-operations",
    target: "terminal-orion",
    style: { stroke: "#1a6bff", strokeOpacity: 0.3 },
  },
  {
    id: "e-clients-hermes",
    source: "folder-clients",
    target: "terminal-hermes",
    style: { stroke: "#1a6bff", strokeOpacity: 0.3 },
  },
  {
    id: "e-internal-atlas",
    source: "folder-internal",
    target: "terminal-atlas",
    style: { stroke: "#1a6bff", strokeOpacity: 0.3 },
  },
  {
    id: "e-saas-vega",
    source: "folder-saas",
    target: "terminal-vega",
    style: { stroke: "#1a6bff", strokeOpacity: 0.3 },
  },
  // Terminal to terminal connections
  {
    id: "e-orion-hermes",
    source: "terminal-orion",
    target: "terminal-hermes",
    style: { stroke: "#1a6bff", strokeOpacity: 0.3 },
  },
  {
    id: "e-hermes-atlas",
    source: "terminal-hermes",
    target: "terminal-atlas",
    style: { stroke: "#1a6bff", strokeOpacity: 0.3 },
  },
  {
    id: "e-orion-idle1",
    source: "terminal-orion",
    target: "terminal-idle-1",
    style: { stroke: "#1a6bff", strokeOpacity: 0.3 },
  },
  {
    id: "e-atlas-idle2",
    source: "terminal-atlas",
    target: "terminal-idle-2",
    style: { stroke: "#1a6bff", strokeOpacity: 0.3 },
  },
];

export function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeDragStop = useCallback(() => {
    // Optional: persist node positions
  }, []);

  return (
    <div className="flex-1 h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.2}
        maxZoom={2}
        className="bg-background"
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="#1e1e1e"
        />
        <Controls
          className="!bg-card !border-border"
          showInteractive={false}
        />
      </ReactFlow>
    </div>
  );
}
