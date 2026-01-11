# LLM Chat Integration — Technical Design Document

## Overview

This document outlines the design for integrating LLM capabilities into Pick Kiwi. The LLM powers two key features: handling free-form user input during the guided question flow, and generating the shopping recommendation report.

### What We're Building

1. **Free-form chat handling** — When users type instead of selecting predefined answers, the LLM interprets their input and responds appropriately
2. **Report generation** — When all required information is gathered, the LLM generates a structured shopping recommendation report

### v0 Scope

- Streaming responses for real-time display
- Free-form input handling during question flow
- Report generation displayed in chat UI
- Basic error handling

### Out of Scope (v0)

- Report displayed in right panel (v1)
- Conversation memory/persistence (v3)
- Real web search or Reddit integration (v2 — see "Future Iterations")
- Iterating on the report after generation (v4)

---

## System Architecture

### Component Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend                                │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Chat UI                                                    │ │
│  │  - Displays LLM questions with question options          │ │
│  │  - Shows free-form text input                               │ │
│  │  - Renders streamed LLM responses                           │ │
│  │  - Maps LLM's current field → Admin-defined question options │ │
│  │  - Displays generated report                                │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼ HTTP (streaming)
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Mastra)                             │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Shopping Agent                                             │ │
│  │  - Drives conversation (asks questions naturally)           │ │
│  │  - Extracts info from user responses                        │ │
│  │  - Follows conditional rules                                │ │
│  │  - Returns structured output (current field, extracted)     │ │
│  │  - Generates shopping report                                │ │
│  └────────────────────────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │  Admin Config                                               │ │
│  │  - Required fields + question options                          │ │
│  │  - Conditional follow-up rules                              │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                             │
                             ▼
                    LLM Provider API
```

### Key Design Decision: LLM-Driven Collection

The **LLM drives the conversation**, but the **Admin controls what information to collect**.

**Admin defines:**

- Required information fields (occasion, recipient, budget, interests)
- Question options for each field
- Conditional follow-up rules

**LLM handles:**

- Asking questions naturally (phrasing, tone)
- Processing free-form user input
- Extracting information from responses
- Deciding when to skip questions (if info already provided)
- Following conditional rules
- Generating the final report

This gives us:

- **Natural conversation** — LLM adapts to how users communicate
- **Admin control** — Required fields and options are predefined
- **Smart extraction** — User can provide multiple pieces of info at once
- **Flexibility** — LLM handles edge cases naturally

### How It Works

1. Admin configures required fields and question options
2. LLM asks about a field → UI shows Admin-defined question options
3. User picks question option OR types free-form
4. LLM extracts info, updates collected data, decides next question
5. Repeat until all required info is collected
6. LLM generates report

---

## Admin Configuration

### Required Fields

The Admin defines what information needs to be collected. The LLM will ask about each field until all required info is gathered.

| Field ID          | Description                           | Required |
| ----------------- | ------------------------------------- | -------- |
| `occasion`        | Why they're shopping                  | Yes      |
| `recipient`       | Who the item is for                   | Yes      |
| `recipientDetail` | Additional detail (conditional)       | Depends  |
| `budget`          | Price range                           | Yes      |
| `interests`       | Hobbies, preferences, things to avoid | Yes      |

### Question Options per Field

Each field has Admin-defined question option options. When the LLM asks about a field, the UI shows these buttons.

```yaml
fields:
  occasion:
    options:
      - "Birthday gift"
      - "Thank you gift"
      - "Holiday gift"
      - "Just because"

  recipient:
    options:
      - "Partner / Spouse"
      - "Family member"
      - "Friend"
      - "Colleague"

  budget:
    options:
      - "Under $30"
      - "$30 - $50"
      - "$50 - $100"
      - "$100 - $200"
      - "Over $200"

  interests:
    freeFormOnly: true # No question options, just text input
```

### Conditional Follow-Ups

The Admin can define conditional rules. The LLM follows these when relevant.

```yaml
conditionals:
  - when: recipient == "Partner / Spouse"
    ask: recipientDetail
    options:
      - "Less than 1 year"
      - "1-3 years"
      - "3+ years"

  - when: recipient == "Colleague"
    ask: recipientDetail
    options:
      - "Close work friend"
      - "More formal relationship"

  - when: recipient == "Family member"
    ask: recipientDetail
    options:
      - "Parent"
      - "Sibling"
      - "Child"
      - "Extended family"
```

### Input Types

Each field can accept:

- **Options only** — User must pick from options
- **Free-form only** — User types custom answer
- **Both** — Question options shown, but free-form always available

---

## LLM Integration Points

### 1. Conversation Handling

The LLM handles ALL user messages (both question options and free-form). It:

- Responds naturally to what the user said
- Extracts information from the response
- Decides what to ask next
- Returns structured output so the UI knows what question options to show

**Example — Option Selection:**

```
LLM asks: "What are you looking for today?"
UI shows: [Birthday gift] [Thank you gift] [Holiday gift] [Just because]

User taps: "Birthday gift"

LLM responds: "A birthday gift — great choice! Who is this gift for?"
LLM returns: { currentField: "recipient", extracted: { occasion: "birthday" } }

UI shows question options for "recipient" field
```

**Example — Free-Form with Multiple Info:**

```
LLM asks: "What are you looking for today?"
UI shows: [Birthday gift] [Thank you gift] [Holiday gift] [Just because]

User types: "my mom's birthday is next week, budget around $50"

LLM responds: "A birthday gift for your mom with a $50 budget — I can help!
              What are her interests? Anything she's been wanting lately?"
LLM returns: {
  currentField: "interests",
  extracted: { occasion: "birthday", recipient: "mom", budget: "$50" }
}

UI shows input for "interests" field (free-form only)
```

### 2. LLM Structured Output

Every LLM response includes structured data:

| Field           | Type    | Description                                                    |
| --------------- | ------- | -------------------------------------------------------------- |
| `responseText`  | string  | The conversational response to display                         |
| `currentField`  | string  | Which field the LLM is asking about (maps to question options) |
| `extractedInfo` | object  | Info extracted from user's message                             |
| `allCollected`  | boolean | Whether all required info has been gathered                    |

When `allCollected` is true, the frontend triggers report generation.

### 3. Smart Extraction

The LLM extracts info even when users provide it indirectly:

| User says                    | LLM extracts                           |
| ---------------------------- | -------------------------------------- |
| "for my wife"                | recipient: "partner/spouse"            |
| "around fifty bucks"         | budget: "$50"                          |
| "she's turning 30 next week" | occasion: "birthday", recipient: "she" |
| "he hates sports stuff"      | interests: "avoid sports"              |

### 4. Off-Topic Handling

When users ask off-topic questions, the LLM:

1. Answers briefly (if possible)
2. Redirects back to the current question

```
User: "Do you ship internationally?"
LLM: "I'm focused on helping you find the perfect item — shipping depends
      on where you buy. Let's figure out what you're looking for first!
      What's the occasion?"
```

### 5. Report Generation

When `allCollected` is true, the LLM generates a structured report.

**Input to LLM:**

- All collected answers (occasion, recipient, budget, interests, etc.)
- Report format instructions

**Output:**
A shopping recommendation report with the following sections:

| Section                 | Always Included | Description                                                   |
| ----------------------- | --------------- | ------------------------------------------------------------- |
| Quick Pick              | ✓               | TL;DR recommendation with product, price, one-sentence reason |
| Top Options Comparison  | ✓               | Table comparing 3-5 options                                   |
| Why This Pick           | ✓               | Detailed reasoning                                            |
| What Reddit Says        | If found        | Real community opinions                                       |
| Watch Out For           | ✓               | Known issues, potential deal-breakers                         |
| Where to Buy            | Optional        | Links and current pricing                                     |
| What We Ruled Out       | Optional        | Alternatives considered and why not                           |
| Gift Presentation Ideas | For gifts       | Wrapping, pairing suggestions                                 |

The report is streamed to the chat UI section by section.

---

## LLM Provider Selection

### Comparison

> ⚠️ **Note:** Pricing changes frequently. Verify on official provider pages before finalizing.

| Provider  | Model             | Input Cost | Output Cost | Notes                            |
| --------- | ----------------- | ---------- | ----------- | -------------------------------- |
| Google    | Gemini 2.0 Flash  | ~$0.10/1M  | ~$0.40/1M   | Very cheap, fast, good quality   |
| OpenAI    | GPT-4o-mini       | ~$0.15/1M  | ~$0.60/1M   | Cheap, widely used               |
| Anthropic | Claude 3.5 Haiku  | ~$0.25/1M  | ~$1.25/1M   | Fast, good instruction following |
| OpenAI    | GPT-4o            | ~$2.50/1M  | ~$10/1M     | Higher quality, higher cost      |
| Anthropic | Claude 3.5 Sonnet | ~$3/1M     | ~$15/1M     | Best quality, most expensive     |

### Recommendation

**v0: Gemini 2.0 Flash or GPT-4o-mini**

- Cheapest options for prototyping
- Good enough quality for conversation and report generation
- Easy to upgrade later if needed

**If quality issues:** Upgrade to Claude 3.5 Haiku or GPT-4o

Mastra supports 40+ models through a unified interface, so switching providers is straightforward.

---

## API Design

### Request: Chat Message

Frontend sends:

- User's message (question option selection or free-form text)
- Currently collected info
- Conversation history (for context)

Backend returns (streamed):

- `responseText` — Conversational response
- `currentField` — Which field the LLM is asking about next
- `extractedInfo` — Info extracted from this message
- `allCollected` — Whether all required info is gathered

### Request: Generate Report

Triggered automatically when `allCollected` is true.

Frontend sends:

- All collected answers as structured data

Backend returns:

- Streamed report content (rendered as markdown in chat)

---

## User Experience Flow

### Happy Path (Question Options)

```
1. User creates new search
2. LLM: "Hi! I'll help you find something great. What are you looking for?"
   → UI shows question options: [Birthday gift] [Thank you gift] [Holiday gift] [Just because]
3. User taps "Birthday gift"
4. LLM: "A birthday gift — nice! Who is this for?"
   → UI shows question options: [Partner] [Family] [Friend] [Colleague]
5. User taps "Partner / Spouse"
6. LLM: "How long have you been together?" (conditional follow-up)
   → UI shows question options: [Less than 1 year] [1-3 years] [3+ years]
7. User taps "3+ years"
8. LLM: "What's your budget?"
   → UI shows question options: [Under $30] [$30-$50] [$50-$100] [$100-$200] [Over $200]
9. User taps "$50 - $100"
10. LLM: "Great! Any specific interests or things to avoid?"
    → UI shows free-form input (no question options for this field)
11. User types "She loves cooking and practical kitchen stuff"
12. LLM: "Got it! A birthday gift for your partner of 3+ years who loves cooking,
    budget $50-$100. Let me find some great options..."
13. Report streams into chat UI
```

### Smart Path (Free-Form with Multiple Info)

```
1. User creates new search
2. LLM: "Hi! I'll help you find something great. What are you looking for?"
   → UI shows question options: [Birthday gift] [Thank you gift] [Holiday gift] [Just because]
3. User types: "my wife's birthday is next week, she's turning 30, budget around $50"
4. LLM: "A 30th birthday gift for your wife with a $50 budget — that's a milestone!
   What are her interests? Anything she's been wanting lately?"
   → UI shows free-form input (skipped recipient, budget — already collected)
5. User types: "She loves cooking and has been eyeing a nice chef's knife"
6. LLM: "Perfect! Let me put together some great options for a chef's knife
   or cooking-related gift..."
7. Report streams into chat UI
```

### Off-Topic Detour

```
1. LLM: "What are you looking for today?"
2. User types: "Do you have a return policy?"
3. LLM: "I'm focused on helping you find the perfect item — return policies
   depend on where you buy. Let's figure out what you need first!
   What's the occasion?"
   → UI shows question options for occasion
4. User taps "Birthday gift"
5. ... continues normally
```

---

## Streaming Implementation

All LLM responses are streamed to provide immediate feedback:

1. **Free-form responses** — Text appears word-by-word as LLM generates
2. **Report generation** — Sections appear progressively as they're generated

The frontend renders streamed content in real-time, showing a typing indicator until the first tokens arrive.

---

## Error Handling

| Scenario                   | Handling                                         |
| -------------------------- | ------------------------------------------------ |
| LLM API timeout            | Show retry button, fall back to generic response |
| LLM returns invalid format | Parse what we can, log error for debugging       |
| Rate limit hit             | Queue request, show "thinking..." state          |
| Network error              | Show error message with retry option             |

---

## File Structure

### New Files

| Location                     | Purpose                                              |
| ---------------------------- | ---------------------------------------------------- |
| `mastra/`                    | New package for Mastra backend                       |
| `mastra/agents/`             | Shopping agent configuration                         |
| `mastra/config/questions.ts` | Admin-defined fields, question options, conditionals |
| `mastra/schemas/`            | LLM output schema, report schema                     |
| `web/lib/mastra.ts`          | Frontend client for Mastra API                       |

### Modified Files

| Location               | Change                            |
| ---------------------- | --------------------------------- |
| `pnpm-workspace.yaml`  | Add mastra package                |
| `web/package.json`     | Add Mastra client dependency      |
| `web/routes/index.tsx` | Connect chat UI to Mastra backend |

---

## Success Criteria

- [ ] Mastra server runs and responds to requests
- [ ] Free-form input is handled conversationally by LLM
- [ ] Responses stream in real-time (not wait for full response)
- [ ] Report generates with all required sections
- [ ] Report displays correctly in chat UI
- [ ] Errors are handled gracefully with user feedback

---

## Future Iterations

### v1: Report Panel

- Move report from chat to dedicated right panel
- Add copy/export functionality
- Allow editing sections

### v2: Real Data Sources (Web Search)

Mastra supports multiple approaches for web search:

**Option A: Native LLM Search**
Some models have built-in grounded search:

- OpenAI GPT-4o with grounded search
- Google Gemini 2.5 Flash with built-in search

**Option B: Custom Search Tools**
Create a Mastra tool using search APIs:

- **Exa** — Semantic search designed for AI applications
- **Tavily** — Search API built specifically for AI agents
- **Brave Search** — Privacy-focused search API
- **Serper** — Google search wrapper

**Option C: MCP Servers**
Connect to remote MCP servers that provide search:

- Smithery.ai, mcp.run, Composio.dev, Klavis AI

**What we'd implement:**

- Web search tool for product research
- Reddit API integration for community opinions
- Ground recommendations in real product data

### v3: Conversation Memory

- Remember user preferences across sessions
- Improve recommendations based on history

### v4: Report Iteration

- Allow users to refine report after generation
- "Show me more options under $50"
- "What about something less practical?"

---

## Open Questions

1. ~~Should free-form responses also show question option suggestions?~~ **Answered:** LLM returns `currentField`, UI shows question options for that field
2. ~~How do we handle when user's free-form input doesn't match any question?~~ **Answered:** LLM extracts what it can, redirects to next needed field
3. Should we save partial progress if user abandons mid-flow?
4. How do we handle when LLM extracts info incorrectly? (e.g., user says "not for my wife" but LLM extracts recipient: wife)
5. Should Admin config be stored in code or database for v0?

---

## References

- [Pick Kiwi PR/FAQ](./2026-01-02-pick-kiwi-prfaq.md) — Product requirements and report format
- [Mastra Documentation](https://mastra.ai/docs) — Framework documentation
