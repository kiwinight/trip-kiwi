---
name: V6 Prototype Plan
overview: Create a simplified Trip Kiwi prototype (V6) that flattens the hierarchy to App → Plans, introduces a "Clips" modal for captured content, and uses suggested chips for AI interaction after manual edits.
todos:
  - id: create-route
    content: Create prototype-v6.tsx with basic three-panel layout
    status: completed
  - id: sidebar
    content: Implement left sidebar with plans list and settings
    status: completed
    dependencies:
      - create-route
  - id: plan-editor
    content: Implement plan editor with title input, TipTap editor, and clips button
    status: completed
    dependencies:
      - create-route
  - id: chat-panel
    content: Implement chat panel with messages and input
    status: completed
    dependencies:
      - create-route
  - id: suggested-chips
    content: Add suggested chips row that appears after manual edits
    status: completed
    dependencies:
      - chat-panel
  - id: clips-modal
    content: Implement clips modal with list and detail views
    status: completed
    dependencies:
      - plan-editor
  - id: mock-data
    content: Create mock data for plans, clips, and chat messages
    status: completed
    dependencies:
      - create-route
  - id: interactions
    content: Wire up interactions (select plan, new plan, add clip to plan)
    status: completed
    dependencies:
      - sidebar
      - plan-editor
      - clips-modal
---

# V6 Prototype: Simplified Travel Planning AI

## Overview

A streamlined three-panel layout focused on plan writing with AI assistance. Removes the Trip/Plan hierarchy, replaces Sources with lightweight Clips, and uses one chat per plan.

## Layout

```javascript
┌────────────────┬──────────────────────────────┬──────────────────────┐
│                │                              │                      │
│  Plans         │  Plan Editor            [📎] │  Chat                │
│  ───────────   │  ───────────────────────────│  ────────────────── │
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



## Key Changes from V5

| V5 | V6 ||----|-----|| App → Trip → Plans | App → Plans || Plans/Sources toggle | Clips modal (📎 icon) || Multiple chat threads | One chat per plan || Trip header with name | Plan title as header |

## Components

### 1. Left Sidebar

- Logo + app name
- Collapse/expand toggle
- Plans list (flat, no grouping)
- Active plan highlighted
- "+ New Plan" button
- Settings dropdown (theme, scale)

### 2. Plan Editor (Center)

- Plan title input (editable)
- Clips button (📎) in toolbar → opens modal
- TipTap rich text editor
- Delete plan action (in dropdown)

### 3. Chat Panel (Right)

- Messages area (user right-aligned, AI left-aligned)
- **Suggested chips** row (appears after manual edits):
- "Organize my edits"
- "Check for conflicts"
- "Continue planning"
- Message input with send button

### 4. Clips Modal

- Triggered by 📎 icon in plan editor toolbar
- Lists all clips for current plan
- Each clip shows:
- Type icon (🎬 video, 🏠 message, 📝 article)
- Title (AI-generated)
- Timestamp
- Preview of extracted content
- Click clip → expand details
- "Add to plan" action → inserts extracted text at cursor

## Data Model (Mock)

```typescript
type Plan = {
  id: string;
  title: string;
  content: string; // markdown/HTML
  clips: Clip[];
  createdAt: Date;
};

type Clip = {
  id: string;
  planId: string;
  type: 'video' | 'message' | 'article' | 'image' | 'text';
  sourceUrl?: string;
  rawContent: string;
  extractedSummary: string;
  extractedItems: string[];
  createdAt: Date;
};

type ChatMessage = {
  id: string;
  planId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
};
```



## Key Interactions

### Capture Flow

1. User pastes content into chat
2. AI acknowledges + extracts key info
3. Clip auto-created and saved
4. AI offers: "Want me to add this to your plan?"

### Manual Edit Flow

1. User edits plan directly
2. System tracks "edits since last chat message"
3. Suggested chips appear above input:

- `[Organize my edits]` `[Check for conflicts]`

4. User clicks chip or types their own message
5. AI responds with awareness of recent changes

### Clips Modal Flow

1. User clicks 📎 in plan toolbar
2. Modal opens with list of clips
3. User clicks a clip to expand
4. User clicks "Add to plan" to insert content

## Files to Create/Modify

- **Create**: [`web/app/routes/prototype-v6.tsx`](web/app/routes/prototype-v6.tsx) - Main prototype route
- **Update**: [`web/app/routes.ts`](web/app/routes.ts) - Add route entry

## Visual Style

- Same design system as V5 (shadcn components)
- Dark theme friendly
- Muted card backgrounds for clips
- Ghost buttons for actions
- Resizable panels (sidebar, chat)

## Out of Scope (MVP)

- Actual AI integration (mock responses)
- Clip creation from paste (mock data)
- Persistence (all state is local/ephemeral)
- Tags/folders for plans
- Search