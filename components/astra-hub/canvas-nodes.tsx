"use client";

import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Folder } from "lucide-react";

interface FolderNodeData {
  label: string;
  [key: string]: unknown;
}

interface TerminalNodeData {
  label: string;
  active: boolean;
  activeDots?: number[];
  [key: string]: unknown;
}

export const FolderNode = memo(function FolderNode({
  data,
}: NodeProps<{ data: FolderNodeData }>) {
  const nodeData = data as unknown as FolderNodeData;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="w-20 h-16 bg-card border border-primary rounded-lg flex items-center justify-center">
        <Folder className="w-8 h-8 text-primary" />
      </div>
      <span className="text-white text-[10px] tracking-wider">{nodeData.label}</span>
      <Handle type="target" position={Position.Top} className="!bg-primary !w-2 !h-2" />
      <Handle type="source" position={Position.Bottom} className="!bg-primary !w-2 !h-2" />
    </div>
  );
});

// Constellation pattern for terminal nodes
function ConstellationCluster({ active, activeDots = [0, 3] }: { active: boolean; activeDots?: number[] }) {
  // Define dot positions for constellation pattern
  const dots = [
    { x: 20, y: 10 },
    { x: 40, y: 8 },
    { x: 55, y: 18 },
    { x: 35, y: 28 },
    { x: 15, y: 32 },
    { x: 50, y: 38 },
    { x: 28, y: 45 },
    { x: 8, y: 22 },
  ];

  // Define connections between dots
  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [3, 5], [5, 6], [4, 7], [7, 0]
  ];

  return (
    <svg width="70" height="55" viewBox="0 0 70 55" className="overflow-visible">
      {/* Connection lines */}
      {connections.map(([from, to], index) => (
        <line
          key={index}
          x1={dots[from].x}
          y1={dots[from].y}
          x2={dots[to].x}
          y2={dots[to].y}
          stroke={active ? "#1a6bff" : "#4a4a4a"}
          strokeWidth="1"
          strokeOpacity="0.4"
        />
      ))}
      {/* Dots */}
      {dots.map((dot, index) => {
        const isActiveDot = active && activeDots.includes(index);
        return (
          <circle
            key={index}
            cx={dot.x}
            cy={dot.y}
            r={isActiveDot ? 4 : 3}
            fill={isActiveDot ? "#c084fc" : "#4a4a4a"}
            className={isActiveDot ? "animate-pulse-glow" : ""}
            style={isActiveDot ? { color: '#c084fc' } : {}}
          />
        );
      })}
    </svg>
  );
}

export const TerminalNode = memo(function TerminalNode({
  data,
}: NodeProps<{ data: TerminalNodeData }>) {
  const nodeData = data as unknown as TerminalNodeData;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <ConstellationCluster active={nodeData.active} activeDots={nodeData.activeDots} />
        {nodeData.active && (
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent animate-pulse-glow" style={{ color: '#c084fc' }} />
        )}
      </div>
      <span className="text-white text-[10px] tracking-wider">{nodeData.label}</span>
      <Handle type="target" position={Position.Top} className="!bg-primary !w-2 !h-2 !opacity-0" />
      <Handle type="source" position={Position.Bottom} className="!bg-primary !w-2 !h-2 !opacity-0" />
    </div>
  );
});

export const nodeTypes = {
  folder: FolderNode,
  terminal: TerminalNode,
};
