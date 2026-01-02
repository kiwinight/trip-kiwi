# Prototype V6 Design

Documentation of design decisions for the simplified Trip Kiwi V6 prototype.

## Problem Statement

V5 prototype felt too complex:

- 3-level hierarchy: App → Trip → Plans
- Separate "Sources" page for saved places
- Multiple chat threads per trip
- Users had to navigate layers before doing real work

Key question: "Do I really need multiple plans within a trip? Am I overthinking this?"

## Design Decision: Flatten the Hierarchy

### Before (V5)

```
App
└── Trip (Taiwan December 2024)
    ├── Plans
    │   ├── Taipei (Day 1-3)
    │   ├── Taichung (Day 4-5)
    │   └── Kaohsiung (Day 6-8)
    ├── Sources (shared places/resources)
    └── Multiple Chat threads
```

### After (V6)

```
App
└── Plans (flat list)
    ├── Taipei Trip
    ├── Tokyo 2025
    └── Seoul Food Tour
```

| V5                      | V6                    |
| ----------------------- | --------------------- |
| App → Trip → Plans      | App → Plans           |
| Separate "Sources" page | Clips page (📎 Clips) |
| Multiple chat threads   | One chat per plan     |
| Trip header with name   | Plan title as header  |

## Layout

**Plan Editor View (default):**

```
┌────────────────┬──────────────────────────────┬──────────────────────┐
│                │                              │                      │
│  Plans         │  Taiwan Trip    [📎 Clips]  │  Chat                │
│  ───────────   │  ─────────────────────────── │  ────────────────── │
│  · Taipei      │                              │                      │
│  · Tokyo       │  [Plan title input]          │  [Messages...]       │
│  · Seoul       │                              │                      │
│                │  [TipTap Editor]             │                      │
│  [+ New Plan]  │                              │  ────────────────── │
│                │                              │  [Suggested chips]   │
│  ───────────   │                              │  [Message input]     │
│  [⚙ Settings]  │                              │                      │
└────────────────┴──────────────────────────────┴──────────────────────┘
```

**Clips View (after clicking 📎 Clips):**

```
┌────────────────┬──────────────────────────────┬──────────────────────┐
│                │                              │                      │
│  Plans         │  Taiwan Trip > Clips  [📎 Clips]  │  Chat         │
│  ───────────   │  ─────────────────────────── │  ────────────────── │
│  · Taipei      │                              │                      │
│  · Tokyo       │  [+ Add Clip]                │  [Messages...]       │
│  · Seoul       │                              │                      │
│                │  [Clip cards - editable]     │                      │
│  [+ New Plan]  │                              │  ────────────────── │
│                │                              │  [Suggested chips]   │
│  ───────────   │                              │  [Message input]     │
│  [⚙ Settings]  │                              │                      │
└────────────────┴──────────────────────────────┴──────────────────────┘
```

## Capture Behavior: Chat + Clips

### Problem

Users gather info from everywhere during trip planning:

- YouTube videos about restaurants
- Airbnb host messages
- Blog posts with recommendations
- Government travel alerts
- Friend recommendations on Slack

How do we handle this without re-introducing "Sources" complexity?

### Solution: Chat as Inbox, Clips as Index

| Component | Role                                                   |
| --------- | ------------------------------------------------------ |
| **Chat**  | The inbox—paste anything here                          |
| **AI**    | Acknowledges, extracts key info, offers to add to plan |
| **Clips** | Auto-generated summaries of pasted content             |
| **Plan**  | The curated output—only what you choose to include     |

### Clips (MVP)

- [📎 Clips] button in plan header switches central panel view
- Breadcrumb shows: `[Plan Name] > Clips`
- Lists all clips for current plan
- Each clip shows: type icon, title, timestamp, preview
- Click to expand/edit clip details
- [+ Add Clip] button for manual clip creation

### Clip Types

- Video (🎬) - YouTube links
- Message (🏠) - Airbnb, friend messages
- Article (📝) - Blog posts, guides
- Image (🖼️) - Screenshots
- Text (💬) - General pasted content

### Clips Roadmap (Post-MVP)

1. **Level 1**: Inline embed blocks in plan
2. **Level 2**: Drag & drop from clips panel
3. **Level 3**: Cross-plan global library
4. **Level 4**: AI-powered suggestions while editing
5. **Level 5**: Browser extension / mobile share

## Manual Edits

### Problem

What happens when users edit the plan directly (bypassing AI)?

### Options Considered

| Option                                   | Verdict                   |
| ---------------------------------------- | ------------------------- |
| Block editing                            | No - feels like a toy     |
| Notification to reorganize               | No - too noisy            |
| Auto-chat on every edit                  | No - surveillance feeling |
| **Silent observation + suggested chips** | **Yes**                   |

### Solution: Suggested Chips

1. User edits plan directly
2. System tracks "edits since last chat message"
3. Suggested chips appear above chat input:
   - `[Organize my edits]`
   - `[Check for conflicts]`
   - `[Continue planning]`
4. User clicks chip or types own message
5. AI responds with awareness of recent changes

Benefits:

- Non-intrusive (doesn't add to history)
- User can ignore and type something else
- Familiar pattern (Gmail, ChatGPT, Slack)
- Chips disappear after user sends any message

## Data Model

```typescript
type Plan = {
  id: string;
  title: string;
  content: string; // markdown/HTML
  clips: Clip[];
  messages: ChatMessage[];
  createdAt: Date;
};

type Clip = {
  id: string;
  planId: string;
  type: "video" | "message" | "article" | "image" | "text";
  title: string;
  sourceUrl?: string;
  rawContent: string;
  extractedSummary: string;
  extractedItems: string[];
  createdAt: Date;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};
```

## Components

### 1. Left Sidebar

- Logo + app name
- Collapse/expand toggle
- Plans list (flat, no grouping)
- Active plan highlighted
- "+ New Plan" button
- Settings dropdown (theme, scale)

### 2. Central Panel

Toggles between two views via [📎 Clips] button:

**Plan Editor View:**

- Plan title input (editable)
- TipTap rich text editor
- Delete plan action (in dropdown)

**Clips View:**

- Breadcrumb: `[Plan Name] > Clips`
- [+ Add Clip] button
- Clip cards (editable)
- "Add to plan" action per clip

### 3. Chat Panel (Right)

- Messages area (user right-aligned, AI left-aligned)
- Suggested chips row (appears after manual edits)
- Message input with send button
- ⋯ dropdown menu with "Delete chat history" action

## Out of Scope (MVP)

- Actual AI integration (mock responses)
- Clip creation from paste (mock data)
- Persistence (all state is local/ephemeral)
- Tags/folders for plans
- Search
- Mobile responsive

## Key Insight

> "Ship the simplest thing that delivers your core value: an AI that helps people write better travel plans. You're not building Notion for travel—you're building an AI assistant with a notepad."

The plan stays clean. The chat is the workspace. Clips are the index.
