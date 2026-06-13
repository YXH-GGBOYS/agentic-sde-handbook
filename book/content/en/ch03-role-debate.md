---
id: ch03
order: 3
part_zh: 第一卷 · 格局重置
part_en: Part I · The Reset
title_zh: 角色之争：SDE 会消失，还是会升舱
title_en: The Role Debate — Does the SDE Vanish, or Move Up?
sources: [S1, S2, S3, S4, S6, S7]
---

"Are junior developers finished?" and "Do senior developers still have a moat?" are **open questions** right now. But four positions are worth taking seriously, plus one hard empirical result, and setting them side by side tells you more than any single pundit. This chapter won't decide for you; it just lays the debate out.

> Everything cited here is **secondary analysis** (marked S*), not a vendor stating facts about its own product. Read it with that discount applied.

## Everyday analogy

Think about how grocery shopping changed over twenty years.

At the old wet market, the edge went to whoever could haggle, knew the vendors, and could pick the one ripe tomato out of a pile. Then supermarkets arrived with fixed prices, and haggling was worthless overnight. Did shopping get simpler? Not really. The person who picks well, spots bad goods, and knows what tonight's meal is actually supposed to be became *more* valuable — the choices multiplied, and so did the cheap traps.

Writing code is going through the same shift. "Fast hands, memorized APIs, types out boilerplate from memory" is depreciating; "knows what it's supposed to become, inspects the goods, keeps a fallback" is appreciating. An older metaphor: from the **mason** laying brick by hand to the **foreman** running a crew. But a good foreman is good *because* he was a mason and knows which wall not to knock down. The craft didn't go away; it moved up a level and kept doing work.

## Definition

"The role debate" isn't one question, it's three:

1. **Which skills are depreciating?** (The ones an agent can copy cheaply.)
2. **Which skills are appreciating?** (Constraint, verification, judgment — the things agents can't do.)
3. **Which skills are new?** (The crafts that grew up around the agent.)

Split this way, you dodge the black-and-white shouting match of "programmers are unemployed" versus "nothing changed."

## Why it matters

Because people are betting real career decisions on it: whether to switch fields, whether a junior is still worth hiring, which gap to close. Betting wrong costs far more than writing one bad function. And the signal-to-noise on this topic is terrible — vendors have every reason to shout "disruption," and skeptics get clicks for shouting "bubble." All the more reason to track who's saying what, and how good their evidence is.

## In practice: four positions and one measurement

**1) Karpathy: Software 3.0** [S2] (secondary). He splits software into three layers: 1.0 is hand-written code, 2.0 is neural-network weights, 3.0 is "programming" a model in natural language. He coined "jagged intelligence" — the same model solves a hard math problem, then trips over grade-school arithmetic, and you **can't tell in advance** where it'll trip. "Vibe coding" is his term too. This is the conceptual floor everyone else argues on top of.

**2) Willison: Vibe engineering** [S1] (secondary). He draws a hard line between casual "vibe coding" and doing real engineering *with* agents. On the professional end, the value lands in tests, planning, judgment, and accountability — not in typing faster. His line about "an army of weird digital interns who will absolutely cheat if you give them a chance" is exactly why verification is a core skill in the agent era, not a nuisance.

**3) Yegge: Revenge of the junior developer** [S3] (secondary). The boldest reshuffle of the career ladder. His bet: the job becomes "supervising a fleet of agents," and juniors adapt *faster* because they carry no "I have to type it myself" baggage. The warning from this camp: don't assume seniority is automatically an advantage.

**4) Orosz / Osmani: the 70% problem** [S4][S6] (secondary). Anyone can use AI to reach 70% of a feature fast, but the last 30% — edge cases, security, integration, not spawning new bugs across five interlocked files — is where engineering actually lives [S6]. And a counterintuitive "knowledge paradox": **seniors gain more from AI than juniors**, because they know how to constrain bad output and can see at a glance what's wrong [S4].

**The empirical anchor: METR's randomized controlled trial** [S7] (secondary, an independent nonprofit). Of everything here, this is the one to weigh most. 16 experienced open-source developers, 246 real issues, ~2 hours per task, screen-recorded. The result: with early-2025 AI tools, they were **19% slower**. The sharper part is the perception gap — they forecast a 24% speedup going in, and afterward still believed they'd been sped up by 20%. The stopwatch said otherwise.

Use this carefully: it's about early-2025 tools and a specific senior open-source population, and models keep improving, so you **can't extrapolate to "AI always makes people slower."** But it's enough to puncture one myth — "feels faster" is not "is faster," and any claim resting only on vibes and vendor demos should have to meet this result first.

## Case: all four side by side

Line the five sources up and each is answering a different part of the same question:

- Karpathy supplies the **vision** (the shape of software is changing);
- Willison supplies the **responsible reframing** (what the professional end actually does);
- Yegge supplies the **labor/career shock** (who's up, who's down);
- Orosz supplies the **grounded skepticism** (quality was never bound by typing speed);
- METR supplies the **independent measurement** (don't trust the feeling).

A senior engineer's judgment isn't picking a team. It's holding all five voices at once, knowing how strong each one's evidence is, and then betting on your own situation. My own (hedged) lean: in the short run "replacement" is overrated and "reshuffle" is underrated — jobs don't vanish, the **skill mix inside the job** gets reshuffled, and faster than most people expect.

## Anti-patterns

- **Treating one narrative as settled.** "Juniors are done" and "nothing changed" are both pretending an open question is closed.
- **Using a vendor demo as evidence.** The one-shot in a marketing video and the real task in your repo are two different worlds.
- **Ignoring the inconvenient measurement.** A result like METR's — precisely because it's unflattering — is the one you most need to read. Cherry-picking the pleasant evidence is the most common way people fool themselves here.

## Checklist

- Am I citing a **first-party fact**, a **secondary analysis**, or my **own gut feeling** — and do I know which?
- Does my "AI made me faster" claim have anything harder than a feeling behind it?
- When I bet my own career, am I listening to one narrative, or have I let the disagreement in?

## Self-test

- Could you write one sentence each — for a junior, a senior, and a tech lead — on "what to shore up over the next year"? If not, you've only heard half this debate.
- Your last "AI sped me up" judgment: was it measured, or felt?
