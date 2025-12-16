# Trip Kiwi Product Redesign

## Overview

A complete redesign of Trip Kiwi, shifting from an editor-centric approach to a full-featured trip planning application with AI Chat as the central hub.

**Core Vision**: AI Chat is the command center where users discover places, plan itineraries, and manage their trip through natural conversation. The surrounding UI provides context and visualization.

---

## Navigation Structure

Two-level navigation inspired by Figma:

### Level 1: Dashboard (Trips List)

A browsing experience for managing trips. No AI Chat here - it's purely for navigation.

```
┌──────────────────────────────────────────────────────────────────┐
│  [KiwiLogo] Trip Kiwi                              [⚙] [User]   │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  My Trips                                        [+ New Trip]    │
│                                                                  │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐     │
│  │  Paris    │  │  Tokyo    │  │  London   │  │  Seoul    │     │
│  │  Dec '24  │  │  Mar '25  │  │  Jun '25  │  │  Aug '25  │     │
│  │           │  │           │  │           │  │           │     │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘     │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

**Main Content:**

- Grid/list of trip cards
- Each card shows: Trip name, dates, thumbnail/destination
- Click to enter Trip Detail view

---

### Level 2: Trip Detail (Planning Workspace)

The main planning interface where AI Chat is always visible.

```
┌──────────────────────────────────────────────────────────────────┐
│  [KiwiLogo] Trip Kiwi                              [⚙] [Share]  │
├────────────────────────────────────┬─────────────────────────────┤
│                                    │  AI Chat                    │
│  Paris December 2024               │                             │
│  Paris, France · Dec 15-20, 2024   │                             │
├────────────────────────────────────┤                             │
│  [Plan*] [Places] [Map] [Notes]    │                             │
├────────────────────────────────────┤                             │
│                                    │  ┌───────────────────────┐  │
│                                    │  │ Add a museum to Day 2 │  │
│                                    │  └───────────────────────┘  │
│    Tab Content Area                │              [You]          │
│                                    │                             │
│    (Changes based on              │  ┌───────────────────────┐  │
│     selected tab)                  │  │ Done! I've added      │  │
│                                    │  │ Musée d'Orsay to your │  │
│                                    │  │ Day 2 morning.        │  │
│                                    │  │                       │  │
│                                    │  │ ✅ Plan updated       │  │
│                                    │  └───────────────────────┘  │
│                                    │              [AI]           │
│                                    │                             │
│                                    ├─────────────────────────────┤
│                                    │  ┌───────────────────────┐  │
│                                    │  │ Type a message...     │  │
│                                    │  └───────────────────────┘  │
│                                    │                    [Send]   │
└────────────────────────────────────┴─────────────────────────────┘
```

**Key Layout Principle:**

- Two-column layout: Left Panel (trip info + tabs) | AI Chat
- Header is consistent across Dashboard and Trip Detail (logo + app name)
- Left panel structure: Trip title → Metadata → Divider → Tabs → Tab content
- Divider spans full width of left panel only
- AI Chat spans full height, parallel to left panel

---

## Tab Structure

### Plan Tab (Default)

The day-by-day itinerary view. Opens by default when entering a trip.

- Markdown-based itinerary editor
- Structured by date (Day 1, Day 2, etc.)
- Each day shows: Morning, Afternoon, Evening activities
- Times, locations, notes for each activity
- Edit/Preview toggle

### Places Tab

Saved places and restaurants (가고 싶은 곳).

- List/grid of saved locations
- Categories: Attractions, Restaurants, Hotels, etc.
- Each place shows: Name, category, notes, photos
- Filtering and tagging ("Must Visit", "Candidates")
- Add places manually or via AI Chat

### Map Tab

Visual representation of trip locations.

- Interactive map showing all saved places
- Color-coded by category or day
- Click markers to see details
- Useful for spatial planning
- (Can be deferred for MVP)

### Notes Tab

Freeform notes and research.

- General trip notes
- Links, references, research
- Packing lists, reminders
- Anything that doesn't fit elsewhere

---

## AI Chat Behavior

### In Trip Detail View

- Always visible in right column
- Full conversation history preserved
- Can modify any aspect of the trip:
  - Update itinerary
  - Add/remove places
  - Look up restaurants
  - Answer travel questions
- Real-time updates reflected in tabs

### Example Interactions

```
User: "Planning a 5-day trip to Paris in December"
AI:   Creates trip, generates initial itinerary
      → Plan tab shows new content

User: "Add this restaurant to my list: Le Comptoir"
AI:   Adds to Places tab
      → Places tab updates with new entry

User: "Put Le Comptoir on Day 2 for lunch"
AI:   Updates itinerary
      → Plan tab reflects the change

User: "Show me museums near the Louvre"
AI:   Provides suggestions
      → User can add to Places via chat
```

---

## Key Design Decisions

| Decision                  | Choice                                       | Rationale                                       |
| ------------------------- | -------------------------------------------- | ----------------------------------------------- |
| Navigation model          | Two-level (Dashboard → Trip Detail)          | Clean separation of browsing vs. planning       |
| Dashboard layout          | No sidebar, simple grid                      | Cleaner UI, less clutter for MVP                |
| New Trip button           | Next to "My Trips" title                     | Contextual, easy to find                        |
| Header consistency        | Same header on all pages (logo + app name)   | Consistent brand presence, clean navigation     |
| Trip info placement       | Title + metadata in content area, above tabs | Clear hierarchy, separates nav from content     |
| Trip content organization | Tabs                                         | Each content type gets full space, simpler UX   |
| AI Chat position          | Full-height parallel column                  | Visually equal to tabs, always accessible       |
| Default tab               | Plan                                         | Most common action is viewing/editing itinerary |
| AI Chat in Dashboard      | No                                           | Dashboard is for navigation, not planning       |

---

## Data Model (Conceptual)

```typescript
interface Trip {
  id: string;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  planContent: string; // Markdown itinerary
  places: Place[];
  notes: string;
  chatHistory: Message[];
  createdAt: string;
  updatedAt: string;
}

interface Place {
  id: string;
  name: string;
  category: "attraction" | "restaurant" | "hotel" | "other";
  notes: string;
  tags: string[];
  coordinates?: { lat: number; lng: number };
}

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
```

---

## MVP Scope

### In Scope

- Dashboard with trip list (basic)
- Trip Detail with Plan and Places tabs
- AI Chat for itinerary generation/modification
- Local storage persistence
- Basic trip CRUD

### Out of Scope (Future)

- Map tab with interactive map
- User authentication
- Trip sharing/collaboration
- Mobile optimization
- Version control for plans
- Rich place details (photos, ratings)

---

## Next Steps

1. Update existing wireframe document or create new implementation plan
2. Implement Dashboard view (trip list)
3. Implement Trip Detail layout (tabs + AI chat)
4. Build Plan tab with markdown editor
5. Build Places tab with basic list
6. Integrate AI Chat with OpenAI/Claude API
7. Connect everything with localStorage persistence
