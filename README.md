# ASTRA HUB — Operational Canvas Dashboard

ASTRA HUB is a dark, terminal-styled operational dashboard built with [Next.js](https://nextjs.org) and [v0](https://v0.app). It presents a node-based "operational canvas" where folders and AI terminal nodes are visualized as an interactive, draggable constellation graph, paired with a live ORION terminal side panel.

## What it is for

ASTRA HUB is a control surface for orchestrating distributed AI "operators" and workflow "strands." It is designed to give an operator a single-glance view of:

- **Folders** (`OPERATIONS`, `CLIENTS`, `INTERNAL`, `SAAS`) — logical groupings of work.
- **Terminal nodes** (`ORION`, `HERMES`, `ATLAS`, `VEGA`, `IDLE-01`, `IDLE-02`) — AI agents rendered as constellation clusters. Active agents glow; idle agents are dimmed.
- **A live terminal panel** — shows the currently selected agent (ORION), its model selection, action controls, and a streaming execution log.
- **Top-bar telemetry** — running uptime clock plus counts of strands, nodes, and operators.

It is meant to be the front-end "command centre" for a system that routes documents, runs compliance checks, and coordinates multiple AI agents across teams.

## Why it runs the way it does

- **Client-rendered canvas.** The graph is interactive (drag, pan, zoom), so the canvas components are client components (`"use client"`). The graph state lives in React via React Flow's `useNodesState` / `useEdgesState` hooks.
- **Composition over a single page.** `app/page.tsx` is intentionally thin and only mounts `AstraHubDashboard`, which composes the `TopBar`, `FlowCanvas`, and `TerminalPanel`. This keeps each concern isolated and easy to extend.
- **Token-driven theming.** All colors are defined as CSS design tokens in `app/globals.css` (dark background, blue primary, purple accent for active nodes) so the look stays consistent and is easy to retheme.

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js (App Router) + React |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (tokens in `globals.css`), `font-mono` for the terminal aesthetic |
| Graph / canvas | [`@xyflow/react`](https://reactflow.dev) (React Flow) |
| Icons | `lucide-react` |
| Animation | Custom CSS keyframes (`animate-pulse-glow`) |

## Project structure

```
app/
  layout.tsx                       # Root layout, dark theme, metadata, mono font
  page.tsx                         # Mounts <AstraHubDashboard />
  globals.css                      # Design tokens + React Flow overrides + animations
components/
  astra-hub/
    dashboard.tsx                  # Top-level layout: TopBar + FlowCanvas + TerminalPanel
    top-bar.tsx                    # Header: brand, tabs, live uptime, telemetry
    flow-canvas.tsx                # React Flow canvas with nodes + edges
    canvas-nodes.tsx               # FolderNode + TerminalNode (constellation) custom nodes
    terminal-panel.tsx             # ORION terminal: model selector, actions, log, operators
```

## Getting started

Install dependencies and run the dev server:

```bash
pnpm install
pnpm dev
```

Then open [http://localhost:3000](http://localhost:3000).

## How to test it

This project currently has no automated test suite. To manually verify it works:

1. **Canvas renders** — On load you should see four folder nodes across the top and six terminal (constellation) nodes below, connected by faint blue edges.
2. **Active vs idle nodes** — `ORION` and `HERMES` show glowing purple dots (active); the rest are dimmed grey.
3. **Interaction** — Drag any node to reposition it; pan by dragging the background; zoom with the scroll wheel or the bottom-left controls.
4. **Live uptime** — The clock in the top-right (`HH:MM:SS`) ticks up every second.
5. **Tabs** — Clicking `[1] STUDIO` / `[2] COMMAND CENTRE` / etc. highlights the active tab.
6. **Terminal panel** — The right panel shows the ORION terminal with a model selector, action buttons (`COMPACT`, `SAVE`, `CLEAR`, `RESTART`), the execution log, and the operators footer.

## What still needs to be done

The dashboard is currently a high-fidelity, front-end-only prototype. Data is hardcoded for layout and demo purposes. To make it production-ready:

- **Backend / data layer** — Replace the hardcoded `initialNodes`, `initialEdges`, telemetry counts, and terminal log lines with real data from a database or API. (Neon is the recommended default integration.)
- **Live agent state** — Wire active/idle node status and the terminal execution log to real-time updates (e.g. SWR polling or a websocket/stream).
- **Working tabs** — The `STUDIO / COMMAND CENTRE / INTELLIGENCE / SYSTEM` tabs only set local state; each needs its own view/route.
- **Functional terminal controls** — `COMPACT`, `SAVE`, `CLEAR`, `RESTART`, the model selector, and "POP OUT" are currently non-functional buttons.
- **Node interaction** — Clicking a terminal node should select it and drive the side panel (which agent the terminal reflects).
- **Operators / federation** — The "0/3 ACTIVE" operators section needs real invite/accept flows and authentication.
- **Persistence** — Persist node positions after dragging (the `onNodeDragStop` handler is stubbed).
- **Tests** — Add component and interaction tests.

## Built with v0

This repository is linked to a [v0](https://v0.app) project. Start new chats to make changes, and v0 will push commits directly to this repo. Every merge to `main` will automatically deploy.

[Continue working on v0 →](https://v0.app/chat/projects/prj_guVPXPWUZncS2FQXW4CgZDflzTRv)

<a href="https://v0.app/chat/api/kiro/clone/Anathi17/v0-astra-hub-dashboard" alt="Open in Kiro"><img src="https://pdgvvgmkdvyeydso.public.blob.vercel-storage.com/open%20in%20kiro.svg?sanitize=true" /></a>
