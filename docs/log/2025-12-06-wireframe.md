# Trip Kiwi MVP Wireframe

## Overall Layout

3-panel desktop layout inspired by Claude's web interface:

```
+----------+----------------------------------------+------------------+
|          |                                        |                  |
| Sidebar  |         Plan Editor                    |      Chat        |
| (~200px) |         (Markdown)                     |      Panel       |
|          |                                        |   (~350px)       |
|          |                                        |                  |
+----------+----------------------------------------+------------------+
```

**Layout Specifications:**

- **Sidebar**: Fixed width ~200px, scrollable if needed
- **Plan Editor**: Flexible width, takes remaining space
- **Chat Panel**: Fixed width ~350px
- Desktop-first design (mobile optimization out of scope for MVP)
- All panels are full height (viewport height)

---

## 1. Sidebar (Left Panel)

### Structure

```
+------------------+
|  Trip Kiwi       |
|  ─────────────   |
|                  |
|  📋 Paris Trip   | ← Active (highlighted)
|  📋 Tokyo 2024   |
|  📋 London       |
|                  |
|  [+ New Plan]    |
|                  |
+------------------+
```

### Components

**Header:**

- App name/logo "Trip Kiwi" at top
- Simple divider line

**Plan List:**

- Scrollable list of saved plans/trips
- Each plan item shows:
  - Plan name (e.g., "Paris Trip", "Tokyo 2024")
  - Truncate long names with ellipsis
- Active plan is highlighted (background color or border)
- Click to switch between plans

**Actions:**

- "[+ New Plan]" button at bottom
  - When clicked: Clears current chat, starts fresh conversation
  - User can then describe their trip in chat to create a new plan
  - No modal/form - creation happens through conversation
- Edit icon (✏️) next to each plan name (for metadata editing)
- Hover states for all interactive elements

**Empty State:**

```
+------------------+
|  Trip Kiwi       |
|  ─────────────   |
|                  |
|  No plans yet    |
|                  |
|  [+ New Plan]    |
|                  |
+------------------+
```

**Note:** "[+ New Plan]" button is optional - users can also just start chatting directly. The button provides a clear way to start fresh.

---

## 2. Plan Editor (Center Panel)

### Header with Toggle

```
+----------------------------------------+
|  [Edit] [Preview]    [Save] [Download] |
+----------------------------------------+
```

**Toggle Tabs:**

- "Edit" tab: Shows raw markdown editor
- "Preview" tab: Shows rendered markdown
- Active tab is highlighted
- Only one view visible at a time (not split view)

**Actions (optional for MVP):**

- Save button (auto-save is primary, manual save secondary)
- Download button (export as .md file)

### Edit Mode

```
+----------------------------------------+
|  [Edit] [Preview]                      |
+----------------------------------------+
|                                        |
|  # Paris Trip                          |
|                                        |
|  **Destination:** Paris, France        |
|  **Dates:** Dec 15-20, 2024           |
|                                        |
|  ## Day 1 - December 15               |
|                                        |
|  ### Morning                           |
|  - 9:00 AM - Check in to hotel         |
|  - 10:30 AM - Visit Louvre Museum     |
|                                        |
|  ### Afternoon                         |
|  - 2:00 PM - Lunch at Le Comptoir     |
|  - 4:00 PM - Walk along Seine         |
|                                        |
|  ### Evening                           |
|  - 7:00 PM - Dinner in Latin Quarter  |
|                                        |
|  ## Day 2 - December 16               |
|  ...                                   |
|                                        |
+----------------------------------------+
```

**Edit Mode Features:**

- Textarea or code editor component
- Syntax highlighting for markdown (optional, nice-to-have)
- Full markdown editing capabilities
- Scrollable content area
- AI can modify this content directly

### Preview Mode

```
+----------------------------------------+
|  [Edit] [Preview]                      |
+----------------------------------------+
|                                        |
|  Paris Trip                            |
|  ─────────────────                     |
|                                        |
|  Destination: Paris, France            |
|  Dates: Dec 15-20, 2024               |
|                                        |
|  Day 1 - December 15                   |
|                                        |
|  Morning                               |
|  • 9:00 AM - Check in to hotel         |
|  • 10:30 AM - Visit Louvre Museum     |
|                                        |
|  Afternoon                             |
|  • 2:00 PM - Lunch at Le Comptoir     |
|  • 4:00 PM - Walk along Seine         |
|                                        |
|  Evening                               |
|  • 7:00 PM - Dinner in Latin Quarter  |
|                                        |
|  Day 2 - December 16                   |
|  ...                                   |
|                                        |
+----------------------------------------+
```

**Preview Mode Features:**

- Rendered markdown with proper typography
- Proper heading hierarchy
- Bullet lists, bold, italic formatting
- Clean, readable layout
- Scrollable content area

### AI Updating Indicator

When AI is modifying the plan:

```
+----------------------------------------+
|  [Edit] [Preview]    [AI is updating...]|
+----------------------------------------+
|                                        |
|  (content with subtle pulsing          |
|   animation or spinner)                |
|                                        |
+----------------------------------------+
```

**Visual Feedback:**

- Subtle animation or spinner
- Disable editing during AI update (optional)
- Show "AI is updating..." message in header

---

## 3. Chat Panel (Right Panel)

### Screenshot View - Active Conversation

```
┌─────────────────────────────────────┐
│ Chat                                 │
├─────────────────────────────────────┤
│                                     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Planning a 5-day trip to      │ │
│  │ Paris in December              │ │
│  └───────────────────────────────┘ │
│                    [You]            │
│                                     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Great! I'll help you create   │ │
│  │ an itinerary for your Paris   │ │
│  │ trip.                         │ │
│  │                               │ │
│  │ What are your main interests? │ │
│  │ Museums, food, shopping, or   │ │
│  │ architecture?                 │ │
│  └───────────────────────────────┘ │
│  [AI]                               │
│                                     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Museums and food              │ │
│  └───────────────────────────────┘ │
│                    [You]            │
│                                     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Perfect! I've created an      │ │
│  │ initial itinerary focusing on │ │
│  │ museums and food experiences. │ │
│  │                               │ │
│  │ ✅ Itinerary updated          │ │
│  │                               │ │
│  │ Check the plan editor to see  │ │
│  │ your Day 1-5 schedule. Want   │ │
│  │ to make any adjustments?       │ │
│  └───────────────────────────────┘ │
│  [AI]                               │
│                                     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Add a museum on Day 2         │ │
│  └───────────────────────────────┘ │
│                    [You]            │
│                                     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ ✅ Done! Added Musée d'Orsay  │ │
│  │ to Day 2 morning. The plan    │ │
│  │ has been updated.             │ │
│  └───────────────────────────────┘ │
│  [AI]                               │
│                                     │
│                                     │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Type your message...          │ │
│  │                               │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│         [📎] [↑ Send]             │
│                                     │
└─────────────────────────────────────┘
```

**Visual Details:**

- **User messages**: Right-aligned, rounded corners, distinct background (e.g., blue/green tint)
- **AI messages**: Left-aligned, rounded corners, different background (e.g., gray/neutral)
- **Message labels**: Small "[You]" and "[AI]" labels below each message
- **Status indicators**: ✅ checkmarks for completed actions
- **Padding**: Generous spacing between messages (16-24px)
- **Scrollable area**: Messages scroll independently, input stays fixed at bottom
- **Input border**: Subtle border/divider above input area

### Screenshot View - AI Typing State

```
┌─────────────────────────────────────┐
│ Chat                                 │
├─────────────────────────────────────┤
│                                     │
│  (previous messages...)             │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Make the schedule more        │ │
│  │ relaxed                       │ │
│  └───────────────────────────────┘ │
│                    [You]            │
│                                     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Thinking...                   │ │
│  │                               │ │
│  │ ● ● ●                         │ │
│  └───────────────────────────────┘ │
│  [AI]                               │
│                                     │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│  ┌───────────────────────────────┐ │
│  │                               │ │
│  │                               │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│         [📎] [↑ Send] (disabled)  │
│                                     │
└─────────────────────────────────────┘
```

**Loading State Details:**

- **Typing indicator**: "Thinking..." or animated dots (● ● ●)
- **Input disabled**: Grayed out, non-interactive
- **Send button**: Disabled state, shows "Sending..." or remains as "Send" but disabled

### Screenshot View - Empty/Initial State

```
┌─────────────────────────────────────┐
│ Chat                                 │
├─────────────────────────────────────┤
│                                     │
│                                     │
│                                     │
│                                     │
│         ┌───────────────────┐       │
│         │                   │       │
│         │  Welcome! 👋      │       │
│         │                   │       │
│         │  I'm your travel  │       │
│         │  planning         │       │
│         │  assistant.       │       │
│         │                   │       │
│         │  Start by creating│       │
│         │  a new plan, or   │       │
│         │  tell me about    │       │
│         │  your trip!        │       │
│         │                   │       │
│         └───────────────────┘       │
│                                     │
│                                     │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Type your message...          │ │
│  │                               │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│         [📎] [↑ Send]             │
│                                     │
└─────────────────────────────────────┘
```

**Empty State Details:**

- **Welcome message**: Centered, friendly greeting
- **Helpful text**: Guides user on next steps
- **Input ready**: Input area available for immediate use

### Component Specifications

**Message Bubbles:**

- Rounded corners (8-12px border-radius)
- Padding: 12-16px vertical, 16-20px horizontal
- Max width: ~80% of chat panel width
- Shadow: Subtle shadow for depth (optional)
- Typography: Use MUI Typography components
- Line height: Comfortable for readability

**Input Area:**

- Multi-line textarea (min 3-4 lines visible)
- Rounded corners matching message style
- Placeholder: "Type your message..."
- Icons: Attachment (📎) and Send (↑) buttons
- Send button: Arrow up icon, enabled/disabled states
- Border: Subtle top border to separate from messages

**Scroll Behavior:**

- Smooth scrolling
- Auto-scroll to bottom on new messages
- Preserve scroll position when user manually scrolls up
- Show scroll indicator when content overflows

---

## 4. Application States

### Empty State (No Plans)

**Sidebar:**

```
+------------------+
|  Trip Kiwi       |
|  ─────────────   |
|                  |
|  No plans yet    |
|                  |
|  [+ New Plan]    |
+------------------+
```

**Plan Editor:**

```
+----------------------------------------+
|  [Edit] [Preview]                      |
+----------------------------------------+
|                                        |
|                                        |
|        No plan selected                |
|                                        |
|        Start chatting to create       │
|        your first plan                │
|                                        |
|                                        |
+----------------------------------------+
```

**Chat:**

```
┌─────────────────────────────────────┐
│ Chat                                 │
├─────────────────────────────────────┤
│                                     │
│                                     │
│         ┌───────────────────┐       │
│         │                   │       │
│         │  Welcome! 👋      │       │
│         │                   │       │
│         │  I'm your travel  │       │
│         │  planning         │       │
│         │  assistant.       │       │
│         │                   │       │
│         │  Tell me about    │       │
│         │  your trip and    │       │
│         │  I'll create a     │       │
│         │  plan for you!     │       │
│         │                   │       │
│         └───────────────────┘       │
│                                     │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Type your message...          │ │
│  │                               │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│         [📎] [↑ Send]             │
│                                     │
└─────────────────────────────────────┘
```

### New Plan Creation Flow (Chat-Based)

**User starts conversation:**

```
┌─────────────────────────────────────┐
│ Chat                                 │
├─────────────────────────────────────┤
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Planning a 5-day trip to      │ │
│  │ Paris in December              │ │
│  └───────────────────────────────┘ │
│                    [You]            │
│                                     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Great! I'll create a plan for │ │
│  │ your Paris trip.              │ │
│  │                               │ │
│  │ What are your main interests? │ │
│  │ Museums, food, shopping, or   │ │
│  │ architecture?                 │ │
│  └───────────────────────────────┘ │
│  [AI]                               │
│                                     │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Type your message...          │ │
│  │                               │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│         [📎] [↑ Send]             │
│                                     │
└─────────────────────────────────────┘
```

**AI generates plan and creates it automatically:**

```
┌─────────────────────────────────────┐
│ Chat                                 │
├─────────────────────────────────────┤
│                                     │
│  (previous messages...)             │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Museums and food              │ │
│  └───────────────────────────────┘ │
│                    [You]            │
│                                     │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Perfect! I've created your     │ │
│  │ "Paris December 2024" plan.   │ │
│  │                               │ │
│  │ ✅ Plan created               │ │
│  │ ✅ Itinerary generated        │ │
│  │                               │ │
│  │ I've set up a 5-day schedule  │ │
│  │ focusing on museums and food   │ │
│  │ experiences. Check the plan   │ │
│  │ editor to see your itinerary! │ │
│  └───────────────────────────────┘ │
│  [AI]                               │
│                                     │
│                                     │
│ ─────────────────────────────────── │
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Type your message...          │ │
│  │                               │ │
│  │                               │ │
│  └───────────────────────────────┘ │
│         [📎] [↑ Send]             │
│                                     │
└─────────────────────────────────────┘
```

**What happens:**

- AI extracts: destination (Paris), dates (December), duration (5 days)
- AI auto-generates plan title: "Paris December 2024" (or similar)
- Plan automatically appears in sidebar
- Plan Editor shows generated markdown itinerary
- No modal/form required - everything happens through conversation

### Edit Metadata Flow (Modal)

**User clicks edit/gear icon on plan in sidebar or in plan editor header:**

```
        ┌──────────────────────┐
        │  Edit Plan Details   │
        │  ──────────────────   │
        │                       │
        │  Plan Name:           │
        │  ┌─────────────────┐  │
        │  │ Paris December │  │
        │  │ 2024           │  │
        │  └─────────────────┘  │
        │                       │
        │  Destination:         │
        │  ┌─────────────────┐  │
        │  │ Paris, France  │  │
        │  └─────────────────┘  │
        │                       │
        │  Dates:               │
        │  ┌──────┐ to ┌──────┐│
        │  │ Dec  │    │ Dec  ││
        │  │ 15   │    │ 20   ││
        │  └──────┘    └──────┘│
        │                       │
        │  [Cancel]  [Save]     │
        └──────────────────────┘
```

**Edit Metadata Details:**

- Modal appears when user explicitly wants to edit metadata
- Can be triggered from:
  - Sidebar: Click edit icon (✏️) next to plan name
  - Plan Editor header: Edit button or gear icon
- All fields are editable
- Changes save to localStorage
- Plan name updates in sidebar immediately

### Active Planning State

All three panels active:

- Sidebar: Plan selected and highlighted
- Plan Editor: Shows current plan content (Edit or Preview mode)
- Chat: Conversation history visible, input ready

### AI Updating State

**Plan Editor:**

- Shows "AI is updating..." indicator
- Content may be dimmed or show loading animation
- Toggle between Edit/Preview may be disabled

**Chat:**

- Shows "AI is typing..." indicator
- Input disabled
- Last message shows AI is processing

---

## 5. Component Specifications

### Typography

**General Approach:**

- Use Material UI Typography components and theme typography variants
- Follow MUI's typography scale (h1, h2, h3, h4, h5, h6, body1, body2, etc.)
- Edit mode: Use appropriate MUI component for code/monospace display if needed
- Preview mode: Use MUI Typography components for rendered markdown
- Chat messages: Use MUI Typography body variants
- Sidebar: Use MUI Typography components for plan names and buttons
- All typography should respect MUI theme and accessibility guidelines

### Colors (High-level)

- **Sidebar**: Light background, subtle borders
- **Plan Editor**: White/light background, good contrast for text
- **Chat**: Alternating message backgrounds, clear distinction user vs AI
- **Active states**: Subtle highlight colors
- **Loading states**: Muted/grayed out with animation

### Interactions

- **Click plan in sidebar**: Switch active plan, update Plan Editor and Chat
- **Toggle Edit/Preview**: Instant switch, preserve scroll position
- **Send message**: Clear input, add to message history, trigger AI response
- **AI response**: Update Plan Editor markdown, add AI message to chat
- **Auto-save**: Save plan to localStorage on any change (debounced)

---

## 6. Responsive Considerations (Future)

For MVP, desktop-only is acceptable. Future considerations:

- **Tablet**: Sidebar could collapse to icon-only, expand on hover
- **Mobile**: Stack panels vertically or use tab navigation
- **Breakpoints**: 768px (tablet), 480px (mobile)

---

## 7. Data Flow

### Plan Creation Flow

```
User describes trip in Chat
    ↓
AI extracts metadata (destination, dates, duration)
    ↓
AI generates plan title automatically
    ↓
AI creates plan object and generates markdown itinerary
    ↓
Plan appears in sidebar, Plan Editor shows content
    ↓
AI confirms creation in Chat
```

### Plan Modification Flow

```
User types in Chat
    ↓
AI processes request
    ↓
AI updates markdown content
    ↓
Plan Editor reflects changes (auto-save to localStorage)
    ↓
AI responds in Chat with confirmation
```

**Key Points:**

- Plan creation happens entirely through chat - no forms/modals
- AI auto-generates: plan name, extracts destination/dates from conversation
- Plan content is stored as markdown string
- localStorage key: `trip-kiwi-plans` (array of plan objects)
- Each plan object: `{ id, name, destination, dates, content, createdAt, updatedAt }`
- Active plan ID stored separately: `trip-kiwi-active-plan-id`
- Metadata can be edited later via modal (user-initiated)

---

## Notes

- This wireframe represents the MVP scope
- Resources panel and version control are out of scope for MVP
- Focus on core flow: create plan → chat with AI → see markdown update
- Inspiration from Claude's clean, functional interface
- Markdown-first approach keeps it simple and flexible
