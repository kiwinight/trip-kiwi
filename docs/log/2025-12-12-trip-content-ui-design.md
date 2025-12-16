# Trip Content UI Design

## Overview

This document captures the UI/UX design decisions for the middle section (trip content area) of Trip Kiwi. The goal is to simplify the content display while maintaining flexibility for different trip planning styles.

**Key Principles**:

- "The best interface is no interface." — Content-first, document-style approach.
- "YAGNI" — Don't solve scalability problems we don't have yet. Ship simple, iterate later.
- "Unified patterns" — Itinerary and Saved tabs work identically (button tabs + TipTap documents).

---

## Layout Context

Three-section layout (unchanged):

```
┌──────────────┬────────────────────────────────┬──────────────────────┐
│              │                                │                      │
│   Left       │       Middle Section           │    Right Panel       │
│   Sidebar    │       (This Design)            │    (AI Agent)        │
│   (~200px)   │                                │    (~350px)          │
│              │                                │                      │
│   Trip       │       Trip Content             │    Chat Interface    │
│   Navigation │       - Itinerary              │                      │
│              │       - Saved Resources        │                      │
│              │                                │                      │
└──────────────┴────────────────────────────────┴──────────────────────┘
```

This document focuses on the **Middle Section** design.

---

## Trip Header

The trip header appears at the top of the middle section, providing context for the current trip.

```
┌──────────────────────────────────────────────────┐
│                                                  │
│  Taiwan December 2024                      [⤢]   │  ← Trip name + share icon
│  Taiwan · Dec 15-25, 2024                        │  ← Metadata (destination + dates)
│                                                  │
└──────────────────────────────────────────────────┘
```

| Element       | Description                                |
| ------------- | ------------------------------------------ |
| **Trip name** | Bold, larger text (h1 or h2 styling)       |
| **Metadata**  | Smaller, muted color — destination + dates |
| **Share**     | Icon button for sharing trip               |

The header provides orientation when entering a trip but scrolls away to maximize content space (see Scroll Behavior section).

---

## Tab Structure

Two primary tabs below the trip header:

```
┌──────────────────────────────────────────────────┐
│  [ Itinerary ]     [ Saved ]                     │
├──────────────────────────────────────────────────┤
│                                                  │
│           (Tab content area)                     │
│                                                  │
└──────────────────────────────────────────────────┘
```

| Tab           | Purpose                                                  |
| ------------- | -------------------------------------------------------- |
| **Itinerary** | Day-by-day or location-by-location plans                 |
| **Saved**     | Pool of resources (restaurants, places, transport, etc.) |

---

## Itinerary Tab

### Plan Structure

Plans are **flexible containers** — not necessarily tied to individual days.

**By Location Example:**

```
Taipei │ Taichung │ Kaohsiung │ +
```

**By Day Example:**

```
Day 1 │ Day 2 │ Day 3 │ Day 4 │ +
```

**By Theme Example:**

```
Food Tour │ Temples │ Shopping │ +
```

Each plan can span multiple days or focus on a specific aspect of the trip.

### Plan Document Design

Each plan has two editable fields:

1. **Name** — Simple text input, used for the tab label
2. **Content** — TipTap rich text editor for the document body

```
┌──────────────────────────────────────────────────┐
│  [ Itinerary ]     [ Saved ]                     │
├──────────────────────────────────────────────────┤
│  Taipei │ Taichung │ Kaohsiung │  +              │  ← Name shown here
├──────────────────────────────────────────────────┤
│                                                  │
│  Name: [Taipei                              ]    │  ← Editable name input
│  ─────────────────────────────────────────────   │
│                                                  │
│  Dec 15-17 · 3 days                              │  ← TipTap content starts here
│                                                  │
│  ## Day 1 — Monday, Dec 15                       │
│                                                  │
│  ### 09:00 · Taipei 101                          │
│  Observatory deck for city views.                │
│  Book tickets online to skip the line.           │
│  📍 Xinyi District                               │
│                                                  │
│  ---                                             │
│                                                  │
│  ### 12:00 · Din Tai Fung                        │
│  Lunch at the original Xinyi location.           │
│  🍜 Expect 20-30 min wait                        │
│                                                  │
└──────────────────────────────────────────────────┘
```

**Why separate Name and Content?**

- Name is metadata that appears in UI (tab label)
- Content is the document body
- No risk of forgetting the title heading
- Cleaner data model

**Content Heading Hierarchy:**

| Level | Usage        | Example                     |
| ----- | ------------ | --------------------------- |
| `##`  | Day sections | `## Day 1 — Monday, Dec 15` |
| `###` | Time slots   | `### 09:00 · Taipei 101`    |

**Content within sections:**

- Free-form markdown text
- Notes, tips, links
- Emoji for visual hints (📍, 🍜, 💡, etc.)
- Horizontal rules (`---`) as visual separators between activities

---

## Saved Tab

### Design

The Saved tab works **identically to the Itinerary tab** — button tabs for each saved item, with a TipTap document for content.

```
┌──────────────────────────────────────────────────┐
│  [ Itinerary ]     [ Saved ]  ←                  │
├──────────────────────────────────────────────────┤
│  Din Tai Fung │ Taipei 101 │ Ice Monster │  +    │  ← Item tabs
├──────────────────────────────────────────────────┤
│                                                  │
│  Name: [Din Tai Fung                        ]    │  ← Editable name input
│  ─────────────────────────────────────────────   │
│                                                  │
│  Xinyi District · Xiaolongbao                    │  ← TipTap content
│                                                  │
│  ## Notes                                        │
│  Must try the truffle dumplings. Original        │
│  location is better than mall branches.          │
│  Expect 20-30 min wait at lunch time.            │
│                                                  │
│  ## Referenced in                                │
│  - Taipei, Day 1 lunch                           │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Item Structure

Each saved item has two editable fields (same as Plans):

| Field       | Type              | Purpose                    |
| ----------- | ----------------- | -------------------------- |
| **Name**    | Simple text input | Tab label, searchable      |
| **Content** | TipTap editor     | Notes, details, references |

### Content Suggestions

Saved item content can include:

- Location and category info
- Personal notes and tips
- Links to websites, reservations
- Which plans reference this item

### Why Unified Design?

- **Consistency** — Same UI pattern for both tabs, nothing new to learn
- **Flexibility** — Rich notes for any item type (restaurants, places, transport)
- **Simplicity** — One editing experience powered by TipTap

---

## Scroll Behavior

### Sticky Tabs Pattern

The tabs remain visible while scrolling, following the Notion/Linear/Figma pattern.

**Before scrolling:**

```
┌──────────────────────────────────────────────────┐
│  Taiwan December 2024                      [⤢]   │  ← Scrolls away
│  Taiwan · Dec 15-25, 2024                        │  ← Scrolls away
├──────────────────────────────────────────────────┤
│  [ Itinerary ]     [ Saved ]                     │  ← STICKY
├──────────────────────────────────────────────────┤
│  Taipei │ Taichung │ Kaohsiung │  +              │  ← STICKY
├──────────────────────────────────────────────────┤
│                                                  │
│  # Taipei                                        │
│  Dec 15-17 · 3 days                              │
│                                                  │
│  ## Day 1 — Monday, Dec 15                       │
│  ...                                             │
│                                                  │
└──────────────────────────────────────────────────┘
```

**After scrolling:**

```
┌──────────────────────────────────────────────────┐
│  [ Itinerary ]     [ Saved ]                     │  ← Still visible
├──────────────────────────────────────────────────┤
│  Taipei │ Taichung │ Kaohsiung │  +              │  ← Still visible
├──────────────────────────────────────────────────┤
│                                                  │
│  ### 14:30 · Elephant Mountain                   │
│  Short hike (30 min up)...                       │
│                                                  │
│  ---                                             │
│                                                  │
│  ### 18:00 · Shilin Night Market                 │
│  Dinner and explore...                           │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Scroll Behavior Summary

| Element       | Behavior | Reason                                         |
| ------------- | -------- | ---------------------------------------------- |
| Trip header   | Scrolls  | Context on arrival, not needed during work     |
| Primary tabs  | Sticky   | Need to switch Itinerary/Saved anytime         |
| Item sub-tabs | Sticky   | Need to jump between plans/items anytime       |
| Content       | Scrolls  | This is where the work happens, maximize space |

This pattern applies to **both** Itinerary and Saved tabs — they have identical scroll behavior with sticky sub-tabs.

---

## Editing Experience

### WYSIWYG (What You See Is What You Get)

Both the Itinerary and Saved tabs use **inline editing** — no separate edit mode.

**Key behaviors:**

| Behavior               | Description                                    |
| ---------------------- | ---------------------------------------------- |
| **Always rendered**    | Markdown is displayed as formatted text        |
| **Click to edit**      | Cursor appears at click position, start typing |
| **No edit button**     | Never needed — always editable                 |
| **Auto-save**          | Changes save as you type (debounced)           |
| **Markdown shortcuts** | Type `## ` for heading, `- ` for list, etc.    |

### Why This Approach

| Aspect            | Traditional Edit/Preview | WYSIWYG                 |
| ----------------- | ------------------------ | ----------------------- |
| Learning curve    | Medium                   | Zero                    |
| Context switching | Every edit               | None                    |
| AI integration    | Complex                  | Simple (just edit text) |
| Speed             | Slower                   | Faster                  |

---

## Technical Decisions

### Rich Text Editor: TipTap

Use [TipTap](https://tiptap.dev/) for the WYSIWYG editing experience.

**Why TipTap:**

- Built on ProseMirror (battle-tested)
- Excellent markdown support
- Customizable and extensible
- Good React integration
- Active community

**Key extensions to use:**

- StarterKit (basic formatting)
- Placeholder
- Typography (smart quotes, etc.)
- Markdown shortcuts

### Auto-save

- Debounce saves (e.g., 500ms after last keystroke)
- Save to localStorage initially
- Visual indicator for save status (optional)

---

## Data Model Updates

```typescript
interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  plans: Plan[]; // Multiple plans per trip
  savedItems: SavedItem[]; // Resources pool
  chatHistory: Message[];
  createdAt: string;
  updatedAt: string;
}

interface Plan {
  id: string;
  name: string; // Tab label: "Taipei", "Day 1", "Food Tour", etc.
  content: string; // TipTap document content
  order: number; // Display order in tabs
}

interface SavedItem {
  id: string;
  name: string; // Tab label: "Din Tai Fung", "🍧 Ice Monster", etc.
  content: string; // TipTap document content (notes, details)
  order: number; // Display order in tabs
  planReferences: string[]; // Plan IDs this item is referenced in
}
```

**Note:** Both `Plan` and `SavedItem` follow the same structure — name (for tab label) + content (TipTap document). This enables the unified UI pattern.

---

## Interactions Summary

| Action                    | Result                                         |
| ------------------------- | ---------------------------------------------- |
| Click Itinerary tab       | Show plan sub-tabs and selected plan document  |
| Click Saved tab           | Show item sub-tabs and selected item document  |
| Click plan/item sub-tab   | Switch to that document                        |
| Click `+` on sub-tabs     | Create new plan or saved item (empty document) |
| Click name input          | Edit the name (updates tab label)              |
| Click anywhere in content | Start editing at that position                 |

Both tabs work identically — the only difference is the content type (plans vs saved items).

---

## Comparison with Previous Design

| Aspect            | Previous (2025-12-08)                       | New Design                           |
| ----------------- | ------------------------------------------- | ------------------------------------ |
| Tab structure     | Plan, Places, Map, Notes                    | Itinerary, Saved                     |
| Plan organization | Single markdown doc                         | Multiple plan documents              |
| Saved items       | Categories (Attractions, Restaurants, etc.) | Button tabs + documents (like plans) |
| Editing           | Edit/Preview toggle                         | Always WYSIWYG                       |
| Editor            | Textarea/code editor                        | TipTap rich text                     |
| Name/Content      | Mixed in document                           | Separate fields                      |
| Scroll behavior   | Not specified                               | Sticky tabs                          |

---

## Next Steps

1. Implement tab structure (Itinerary | Saved)
2. Add sub-tabs for both Itinerary and Saved (unified pattern)
3. Implement name input + TipTap content layout
4. Integrate TipTap for WYSIWYG editing
5. Implement sticky tab scroll behavior
6. Connect with AI agent for real-time updates
