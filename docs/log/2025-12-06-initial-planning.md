# Travel Planning AI Agent

## Core Concept

- **Cursor for Travel Planning** - An AI assistant that creates and modifies itineraries through conversation
- Real-time plan generation through chat UI interaction with the Agent

## 3-Panel Layout Structure

### 1. Resources

Database for collecting research before the trip

- **📍 Places**: Tourist attractions list
- **🍴 Restaurants**: Restaurant list
- **🏨 Hotels**: Accommodation list
- Attachable notes, links, and photos for each item
- Tagging/filtering functionality ("Must Visit", "Candidates")

### 2. Plan Editor

Actual travel itinerary

- Structured schedule by date
- Composed of locations referenced from Resources
- **Version Control** feature
  - Saved as Version 1, 2, 3... format
  - Create and compare multiple itinerary options
  - Restore to previous versions

### 3. Chat

Interface for conversing with AI Agent

- Request itinerary creation/modification in natural language
- Agent makes suggestions based on Resources
- Plan updates in real-time

## Feature Ideas by Travel Lifecycle

### 📋 Before Travel (Planning) - Priority 1

- Collect places/restaurants in Resources
- Generate itinerary through conversation with Agent
- Create and compare multiple versions
- Budget planning, checklist
- Share/edit with travel companions

### 📱 During Travel (On-trip) - Priority 2

- Simple view of today's schedule
- Check off visited places
- Quick notes, photo attachments
- Record actual expenses
- Quickly modify itinerary

### 💭 After Travel (Post-trip) - Priority 3

- Review memories through timeline
- Organize photos, rate places
- Expense settlement
- Notes for future travel reference
- Share itinerary with friends

## Agent Usage Examples

### Initial Itinerary Creation

```
You: "Planning a 5-day trip to Paris in December"

Agent: "Great! Will you focus on central Paris, or also visit
        Versailles or other day-trip destinations?"

You: "Just central Paris"

Agent: "5 days in Paris gives you good flexibility.
        What are your interests? Food/Museums/Shopping/Architecture?"

You: "Museums and food"

Agent: [Generates itinerary]
       Day 1: Louvre Museum → Latin Quarter dinner
       Day 2: Musée d'Orsay → Seine River walk
       ...
       "Here's what I came up with. Any changes needed?"
```

### Itinerary Modification

```
You: "Won't Day 2 have too much free time with just Musée d'Orsay?"

Agent: "You're right! Want to add Sainte-Chapelle nearby?
        Or how about visiting Montmartre in the evening?"

You: "Montmartre sounds good"

Agent: ✅ Day 2 updated
       Musée d'Orsay (morning-afternoon) → Montmartre (evening)
```

### Version Management

```
You: "Make the schedule more relaxed"

Agent: "Should I save this as a new version and modify,
        or overwrite the current version?"

You: "New version"

Agent: ✅ Version 4 created
       Day 1: Just Louvre → Added leisurely walk in Tuileries Garden
       ...
```

### Resources Utilization

```
You: "Add a restaurant to Day 2"

Agent: "You have 12 restaurants saved.
        Should I filter for ones near Musée d'Orsay?"

You: "Yes"

Agent: "Le Comptoir du Relais is highly rated nearby. Want to add it?"
```

## Key Differentiators

- **Conversational Interface**: Easily modify itinerary in natural language
- **Separated Resources**: Clear distinction between research and planning
- **Version Control**: Compare multiple scenarios
- **Context Awareness**: Agent understands previous conversations and Resources

## Notes

- Designed to work with any travel destination worldwide
- Borrows UX patterns from Cursor/Claude Code
- Not just a simple itinerary, but a "travel planning assistant"
