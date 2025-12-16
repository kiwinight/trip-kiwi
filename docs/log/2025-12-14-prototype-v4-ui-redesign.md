# Prototype V4 UI Redesign

## Overview

This document captures the design decisions for the next iteration of Trip Kiwi's UI, moving from the tab-based document picker (v3) to a card-based navigation pattern inspired by Lovable and Google NotebookLM.

**Key Principles**:

- "Sources + Plans" mental model (inspired by NotebookLM)
- Card-based list view for browsing, full editor for focused work
- Persistent AI chat panel (inspired by Lovable)
- Header-level view switching for primary navigation

---

## Design Inspirations

### Lovable (AI App Builder)

- Persistent chat agent always visible on left
- Content type switching via header buttons (Preview, Cloud, Code)
- Clear separation between AI conversation and working canvas

### Google NotebookLM

- **Sources**: Raw research materials (documents you upload)
- **Chat**: AI assistant that understands your sources
- **Studio**: Generated outputs (summaries, flashcards, notes)

We adapt this to trip planning:

| NotebookLM | Trip Kiwi | Purpose                                             |
| ---------- | --------- | --------------------------------------------------- |
| Sources    | Sources   | Reference library (restaurants, hotels, activities) |
| Notes      | Plans     | Working documents (itineraries, day plans)          |
| Chat       | Chat      | AI trip planning assistant                          |

---

## Core Concept: Plans + Sources

### Plans

Itinerary documents organized however the user prefers:

- By location: "Taipei", "Taichung", "Kaohsiung"
- By day: "Day 1", "Day 2", "Day 3"
- By theme: "Food Tour", "Temple Visits", "Shopping"

### Sources

Reference library of saved items that can be linked into plans:

- Restaurants (Din Tai Fung, Ice Monster)
- Hotels (Grand Hyatt, W Hotel)
- Activities (Taipei 101 Observatory, Elephant Mountain)
- Transport (HSR Tickets, Airport Transfer)

### Linking

Sources can be referenced within Plans using `@mention` syntax:

```
### 12:00 · @Din Tai Fung
Lunch at the original Xinyi location.
```

This creates a bidirectional relationship — Sources know which Plans reference them.

### Extensibility

Future views can be added alongside Plans and Sources:

- Maps (visual trip overview)
- Budget (expense tracking)
- Packing List
- Tickets/Bookings

---

## Layout Architecture

### Full Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│ ┌─────┐                                                             │
│ │ Nav │  [Plans] [Sources]    Taiwan December 2024            [⋯]  │
│ │     │   ▔▔▔▔▔▔                                                    │
│ │     ├─────────────────────────────────┬───────────────────────────┤
│ │     │                                 │  Chat Title ▾   + New [⋯] │
│ │     │                                 ├───────────────────────────┤
│ │     │  [← Back] (in content area)    │                           │
│ │     │  Card List / Editor             │  [Chat messages...]       │
│ │     │                                 │                           │
│ │     │                                 ├───────────────────────────┤
│ │     │                                 │  Type a message...    [→] │
│ └─────┴─────────────────────────────────┴───────────────────────────┘
```

**Important**: The header (Plans/Sources tabs + Trip title) remains **stable**. The back button appears **inside the content area** when in editor view, not in the header.

### Header Layout (Always Stable)

The header remains **consistent across all views** — it never changes between list and editor views.

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Plans] [Sources]        Taiwan December 2024               [⋯]   │
│   ▔▔▔▔▔▔                                                            │
└─────────────────────────────────────────────────────────────────────┘
   ↑ Left                    ↑ Center                          ↑ Right
   View tabs                 Trip title (editable)             Actions
```

| Position | Element      | Behavior                                      |
| -------- | ------------ | --------------------------------------------- |
| Left     | View tabs    | Switch between Plans/Sources (always visible) |
| Center   | Trip title   | Editable inline (always visible)              |
| Right    | Actions menu | Settings, share, delete (always visible)      |

**Key principle**: Header stability. Navigation state (list vs editor) is managed by the content area below, not the header.

---

## Navigation Flow

### List View → Editor View

**List View (default):**

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Plans] [Sources]        Taiwan December 2024               [⋯]   │ ← Header stays
├─────────────────────────────────────┬───────────────────────────────┤
│                                     │                               │
│  ┌─────────────┐ ┌─────────────┐   │  [Chat...]                    │
│  │ Taipei      │ │ Taichung    │   │                               │
│  │ Day 1-3     │ │ Day 4-5     │   │                               │
│  └─────────────┘ └─────────────┘   │                               │
│                                     │                               │
│  ┌─────────────┐ ┌─────────────┐   │                               │
│  │ Kaohsiung   │ │ + New Plan  │   │                               │
│  │ Day 6-8     │ │             │   │                               │
│  └─────────────┘ └─────────────┘   │                               │
│                                     │                               │
└─────────────────────────────────────┴───────────────────────────────┘
```

**After clicking "Taipei" card:**

```
┌─────────────────────────────────────────────────────────────────────┐
│  [Plans] [Sources]        Taiwan December 2024               [⋯]   │ ← Header unchanged
├─────────────────────────────────────┬───────────────────────────────┤
│                                     │                               │
│  [← Back]                           │  [Chat continues...]          │ ← Back in content
│                                     │                               │
│  Taipei                       [⋯]   │                               │ ← Document title
│  ─────────────────────────────────  │                               │
│                                     │                               │
│  Day 1 — Monday, Dec 15             │                               │
│                                     │                               │
│  09:00 · Taipei 101                 │                               │
│  Visit @Taipei 101 observatory...   │                               │
│                                     │                               │
│  ---                                │                               │
│                                     │                               │
│  12:00 · Din Tai Fung               │                               │
│  Lunch at @Din Tai Fung...          │                               │
│                                     │                               │
└─────────────────────────────────────┴───────────────────────────────┘
```

### State Machine

```
                    ┌──────────────┐
                    │              │
         ┌──────────│  List View   │◄─────────┐
         │          │              │          │
         │          └──────────────┘          │
         │                                    │
    click card                           click back
         │                                    │
         ▼                                    │
    ┌──────────────┐                         │
    │              │                         │
    │ Editor View  │─────────────────────────┘
    │              │
    └──────────────┘
```

---

## Component Decisions

### View Switcher: shadcn Tabs

Use `Tabs` component (not `ToggleGroup`) for Plans/Sources switching.

**Why Tabs:**

- Clean underline indicator
- Well-suited for 2-5 items
- Better visual hierarchy than pill buttons
- Extensible for future views (Maps, Budget)

```tsx
<Tabs defaultValue="plans">
  <TabsList>
    <TabsTrigger value="plans">Plans</TabsTrigger>
    <TabsTrigger value="sources">Sources</TabsTrigger>
  </TabsList>
</Tabs>
```

### Cards: shadcn Card

Use `Card` component for list items with consistent styling.

```tsx
<Card className="cursor-pointer hover:shadow-md transition-shadow">
  <CardHeader>
    <CardTitle>Taipei</CardTitle>
    <CardDescription>Day 1-3 · Dec 15-17</CardDescription>
  </CardHeader>
</Card>
```

### Back Navigation

Simple button with arrow icon, positioned **at the top of the content area**:

```tsx
<div className="p-4">
  <Button variant="ghost" onClick={handleBack}>
    <ArrowLeft className="size-4 mr-2" />
    Back
  </Button>

  {/* Document title and content below */}
  <input type="text" value={name} ... />
  <EditorContent editor={editor} />
</div>
```

The back button is part of the content area, not the header. This keeps the header stable.

### Editor

Continue using existing TipTap setup from v3.

---

## Source Types

Sources are displayed as a flat list with type badges on cards.

| Type       | Icon | Examples                      |
| ---------- | ---- | ----------------------------- |
| Restaurant | 🍜   | Din Tai Fung, Ice Monster     |
| Hotel      | 🏨   | Grand Hyatt, W Taipei         |
| Activity   | 🎯   | Taipei 101, Elephant Mountain |
| Transport  | 🚄   | HSR Ticket, Airport Transfer  |

**Card with type badge:**

```
┌─────────────────────────┐
│  🍜 Restaurant          │  ← Type badge
│                         │
│  Din Tai Fung           │  ← Name
│  Xinyi District         │  ← Location/subtitle
└─────────────────────────┘
```

Custom types can be added later (user-created).

---

## Chat Panel Behavior

The chat panel remains **persistent** across all views:

| View State    | Chat Behavior                                 |
| ------------- | --------------------------------------------- |
| Plans list    | Chat visible, can discuss trip planning       |
| Plan editor   | Chat visible, context-aware of current plan   |
| Sources list  | Chat visible, can discuss sources             |
| Source editor | Chat visible, context-aware of current source |

The chat title/picker remains in the chat header (unchanged from v3).

---

## Comparison with V3

| Aspect             | V3 (Current)             | V4 (New)                                     |
| ------------------ | ------------------------ | -------------------------------------------- |
| Primary navigation | Document picker combobox | Tabs (Plans/Sources)                         |
| Document view      | Direct editor            | Card list → Editor drill-down                |
| Mental model       | Single document pool     | Separated Plans + Sources                    |
| Header content     | Doc picker + New button  | Tabs (left), Title (center), Actions (right) |
| Header stability   | Changes per document     | Always consistent                            |
| Back navigation    | N/A (always in editor)   | Back button in content area                  |

---

## Data Model

No changes to the underlying data model from v3. The UI change is purely presentational:

```typescript
// Plans (itinerary documents)
interface Plan {
  id: string;
  name: string;
  content: string; // TipTap HTML
  order: number;
}

// Sources (reference library)
interface Source {
  id: string;
  name: string;
  type: "restaurant" | "hotel" | "activity" | "transport" | string;
  content: string; // TipTap HTML
  order: number;
  planReferences: string[]; // Which plans reference this source
}
```

---

## Implementation Checklist

1. [ ] Create new route `prototype-v4.tsx`
2. [ ] Implement header with Tabs (left) + Title (center) + Actions (right)
3. [ ] Create card grid component for list views
4. [ ] Add list/editor state management
5. [ ] Implement back navigation from editor to list
6. [ ] Add type badges to source cards
7. [ ] Ensure chat panel persists across all views
8. [ ] Test responsive behavior

---

## Future Considerations

- **Maps view**: Visual overview of trip locations
- **Source linking**: Click `@mention` in Plan to jump to Source
- **Filtering**: Search/filter within card lists
- **Sorting**: Drag-and-drop reordering of cards
- **Bulk actions**: Select multiple cards for batch operations
