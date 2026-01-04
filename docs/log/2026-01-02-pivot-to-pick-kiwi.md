# Pivoting from Trip Kiwi to Pick Kiwi

Full pivot from Trip Kiwi (trip planning) to Pick Kiwi (personal shopping assistant). Trip Kiwi development stops today.

---

## Why I'm Pivoting

### Reason 1: Shopping is a more universal problem

Trip planning affects people a few times a year. Shopping decisions happen daily, weekly — constantly.

- Everyone shops. Not everyone travels.
- Decision fatigue from shopping is a daily friction, not an occasional one.
- The potential market is wider: every consumer, every purchase category.

**Caveat I acknowledge**: Bigger market doesn't automatically mean better opportunity. More people also means more competition. But for a product that needs to start small and grow, shopping gives me more surface area to find initial users.

### Reason 2: I can actually dogfood this product

This is the real reason.

I don't travel often. Maybe 2-3 trips a year. Building Trip Kiwi meant building for a version of myself that barely exists — someone who plans trips frequently and feels that pain.

I shop constantly. Weekly groceries, occasional electronics, gifts for people, random household items. I feel the "is this okay to buy?" anxiety regularly. I open 15 tabs, read reviews, compare options, and still hesitate.

**I am the target user for Pick Kiwi. I am not the target user for Trip Kiwi.**

Building something I don't use myself is a recipe for:

- Slow iteration (can't feel when UX is wrong)
- Motivation problems (building for abstract "users")
- Poor intuition (guessing what users want)

Building something I use daily means:

- I'm my own first tester
- I know immediately when something feels off
- I stay motivated because I want the product to exist

This alone justifies the pivot.

---

## Critical Analysis: Am I Making the Right Call?

### What's valid about this reasoning

| Argument                   | Validity                                    |
| -------------------------- | ------------------------------------------- |
| Shopping is more universal | ✅ True — more frequent, more people        |
| Dogfooding matters         | ✅ Very true — maybe the strongest argument |
| Trip Kiwi hasn't launched  | ✅ Low cost to pivot now                    |

### What risks remain

| Risk                                                                   | My Response                                                     |
| ---------------------------------------------------------------------- | --------------------------------------------------------------- |
| Pick Kiwi faces brutal competition (ChatGPT, Wirecutter, etc.)         | Acknowledged. Will need to find a sharp wedge.                  |
| "Bigger market" is a trap — more competition, harder to stand out      | True. I'll focus on a specific category first (probably gifts). |
| I might pivot again when Pick Kiwi gets hard                           | I'm committing publicly. This doc holds me accountable.         |
| The differentiation (structured decisions vs ChatGPT) is easily copied | True. Speed and brand are my only moats.                        |

### Honest acknowledgment

I can't prove Pick Kiwi will succeed. I can't prove Trip Kiwi would have failed.

What I know:

- I'll work harder on something I use myself
- I'll iterate faster on something I feel the pain for
- Motivation matters more than market size in the early days

The dogfooding argument wins.

---

## What I'm Leaving Behind

### Current state of Trip Kiwi

- **Prototypes**: v1 through v6 UI explorations
- **Users**: Zero — never launched publicly
- **Revenue**: Zero
- **Code**: Reusable React components, routing setup, shadcn-ui integration

### What's salvageable

The codebase isn't wasted:

- UI components and styling can be reused
- Project structure (web/, docs/log/) carries over
- Design system (shadcn) stays the same

### Cost of pivoting

**Low**. I'm pivoting before launch, before users, before any real traction. This is the cheapest possible time to pivot.

If I had paying users or meaningful engagement, this would be a much harder decision. I don't. So it's not.

---

## Commitments Going Forward

### 1. Full commitment — no half-pivots

Trip Kiwi is done. I won't keep it "on the side" or "come back to it later." Split focus kills projects.

### 2. Ship fast

My only advantage over big companies is speed. I need to get Pick Kiwi in front of real users within weeks, not months.

### 3. Start narrow

"All shopping" is too broad. I'll pick one category to nail first — likely **gifts** (clear use case, emotional stakes, people actually want help).

### 4. Validate with real users

My PR/FAQ is written. Now I need to test the hypothesis:

- Do people actually want an AI to make shopping decisions for them?
- Will they trust the recommendations?
- Will they come back?

Interviews and a landing page MVP will answer these questions.

---

## Next Steps

1. ~~Write PR/FAQ for Pick Kiwi~~ ✅ Done
2. Build landing page MVP
3. Set up basic decision flow (one category: gifts)
4. Get 10 people to try it
5. Collect feedback, iterate

---

## Final Note

Pivoting feels like admitting failure. It's not.

The failure would be spending 6 more months on Trip Kiwi, a product I don't use, serving users I don't understand, burning out because I'm not motivated.

Pivoting now — before launch, before users, before sunk cost fallacy kicks in — is the right call.

Let's build Pick Kiwi.
