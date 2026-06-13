---
id: ch30
order: 30
part_zh: 第八卷 · 学习路径与 Capstone
part_en: Part VIII · Learning Path & Capstone
title_zh: 按模块的学习路线（不按天）
title_en: A Module-Based Learning Path
sources: []
---

This book runs about thirty chapters, from "code is no longer the central artifact" all the way to failure taxonomies. The easiest mistake at this point is trying to cram all of it into your head at once. You end up holding none of it firmly, let alone putting any of it to work.

This chapter teaches nothing new. It does one thing: it rearranges every earlier chapter into a path you can actually start walking. Not by day ("week one: learn the harness" — that plan almost always collapses), but by module — each module has a small target you can hit on the spot, and once you hit it, you move to the next.

## Everyday analogy

Nobody learns to swim by memorizing a fluid-dynamics textbook cover to cover and then getting in the water.

You go module by module. In the first lesson the coach has you do exactly one thing: hold a kickboard, put your face in the water, and feel that a body actually floats. Clear that, and the next lesson teaches breathing — turn the head, exhale, turn again. Once breathing flows, then come the kick and the pull. Each stage is small enough to land within the lesson, and landing it is what earns you the next one. Nobody keeps you out of the pool because you "haven't covered turns and starts yet."

This way of learning has three properties, and all three carry over to learning agentic SDE. First, every stage ends in **something you can touch** — by the end of the lesson you really did float, not "understood the concept of buoyancy." Second, the order has dependencies: drill the kick before you can breathe and you just inhale water; likewise, reach for multi-agent orchestration before your repo is shaped so an agent can read it, and you get a mess. Third, it allows branches: someone training for an open-water crossing and someone training for synchronized swimming share the early stages and split later. Learning this material splits the same way — getting started solo, rolling it out to a team, governing it across an org — shared early modules, then divergence.

This chapter is that module-by-module syllabus, plus three intake routes for three different goals.

## Definition

A **learning path** here means a set of learning modules with real dependencies between them, where each module is pinned down by four things:

- **Goal** — what you can *explain* and *produce* once you clear the stage.
- **Core material** — which chapters of this book it maps to (this is a synthesis chapter; all material points inward, no outside facts).
- **Exercise** — one concrete, do-it-now task.
- **Deliverable (artifact)** — a work product you can drop straight into a real project: an AGENTS.md, a harness spec, an eval rubric. The deliverable is the path's **hard currency**: finishing a module leaves a usable thing in your hands, not just another impression in your head.

The split between "module" and "day" is worth opening up. Scheduling by day cuts along *time* ("Monday through Wednesday: learn X"), which assumes everyone spends the same hours on the same thing and never gets interrupted — two assumptions that almost never hold in real work. Scheduling by module cuts along *capability gates* ("produce an AGENTS.md that lets an agent run the tests green"), which doesn't care whether you took three hours or three days, only whether the deliverable exists. The first is the "30-day plan" taped to the gym wall; the second is "get ten clean push-ups, then add weight."

The test for whether a module is cleared is plain: its deliverable **doesn't exist yet, or won't survive use.** A beautifully written AGENTS.md that an agent can't follow to a green test suite means the module isn't cleared — go back and fix it, don't push on.

## Why it matters

The old way of learning software engineering was roughly linear: syntax, then data structures, then frameworks, then system design. Each layer sits on the one below, and you climb slowly.

The agent era adds a batch of **new engineering objects** — Part III covered them: repo instruction files, context, tools and MCP, state artifacts, evals, traces, sandboxes. None of these exist in the old syllabus, so there's no ready-made order to copy. Plenty of people grab at them by instinct instead: try a new model today, tune a prompt tomorrow, bolt on a multi-agent framework the day after. It looks busy. Six months later they look back and find not one reusable artifact in hand, and nothing a teammate could copy.

Learning by module matters more in this era for three reasons.

**First, these new objects have real dependencies, and skipping a level collapses them.** Part IV hammered one rule: no eval, no autonomy. If you haven't first learned eval — how to tell whether the agent did the job right — then opening up permissions so it merges its own PRs is like letting a contractor ship before anyone inspects the work. Same shape elsewhere: take a repo an agent can't read (Part III) and throw multi-agent orchestration at it (Part V), and you've got a crew of contractors chiseling away in a house with no house rules posted. The dependencies set the order; personal preference doesn't.

**Second, a deliverable focus blocks the spectator trap.** Agent-tool demos look great, and watching one leaves you feeling you "get it." But an empirical note from Part I warned about exactly this: a person's gut sense of "AI made me faster" is not reliable. The way to block the illusion is to force every module to end in an artifact you could put in a real project — if the artifact won't come out, you didn't really understand it.

**Third, three kinds of people need different orders.** A senior engineer who just wants their own agent workflow to hum, a tech lead rolling delegation out to a team, and someone setting governance floors for a whole org all start in different places and weight things differently. A linear syllabus can't serve all three; module-plus-route can.

## In practice

Here is the full module map. Thirteen modules, each mapping to a part or a few chapters of this book. Read the whole table first, then see how to pick by route.

### The module map

| Module | Name | Maps to | Goal (explain + produce) | Deliverable |
|---|---|---|---|---|
| M1 | The 2026 SDE big picture | Part I | Explain how the SDE's artifact shifted from "code" to "a delivery system"; explain what's obsolete, downgraded, newly critical | A one-page self-assessment: is my throughput bottleneck typing, or defining and verifying? |
| M2 | Agent-ready repo & AGENTS.md | Part III, ch10 | Turn a team's tacit rules into a machine-readable note an agent will actually follow | An AGENTS.md covering project shape / commands / DoD / safety boundaries / review expectations |
| M3 | Issue engineering | ch06, ch26 | Turn a vague request into a verifiable problem framing; write agent-ready issues with WRAP | A "bad issue vs good issue" pair for one request + an issue template |
| M4 | Harness engineering | Part IV | Explain what a harness is and isn't; draw the system boundary from intake to handoff | A minimal harness spec (six questions: can-do / who-approves / where-it-runs / done / undo / what-trace) |
| M5 | Context engineering | ch11 | Spend context as a budget: retrieve what's needed, summarize the rest, don't dump the whole repo | A context manifest for one task (what to feed, what not to, why) |
| M6 | Tool / MCP engineering | ch13 | Explain why "an API humans like" ≠ "a tool agents use well"; write a tool contract | A tool contract with explicit error semantics |
| M7 | Eval engineering | ch18 | Explain why eval ≠ test; build an eval from real failure samples, not demos | A multi-dimension eval rubric + a regression-set seed |
| M8 | Sandbox & security | ch17 | List the threat model; gate permissions by risk / path / command / network / secret | A permission matrix + a security-floor checklist |
| M9 | Three agents in practice | Part VI | How the same task plays on Claude Code / Codex / Copilot; choose between them | A three-tool selection table (by task type) |
| M10 | Multi-agent orchestration | Part V | Explain when multi-agent is worth it and how to keep them from clashing or burning budget | A small orchestrator-workers design + an independent evaluator |
| M11 | Agentic PM | Part VII | Shift from person-days to agent-ready work; report progress with new metrics, not PR count | An agent-ready backlog standard + a failure taxonomy |
| M12 | Release & operations | Part VII + ch17 | Ship agent-produced changes safely: canary, rollback, an auditable trail | A release runbook (rollback path + audit points) |
| M13 | Capstone | ch31 | Use all of the above once: build a harness for a real repo and run it end to end | A closing report: what to delegate, what not to, how to change the harness next round |

How to read the table: **top to bottom is dependency order**, not difficulty order. M2 (agent-ready repo) has to come before M10 (multi-agent), because an untidy repo won't survive several agents editing it at once. M7 (eval) has to come before M12 (release), because there's no safe ship without acceptance. But parallel modules like M5 and M6 — pick either first, it doesn't matter.

### Three parallel routes

Not everyone walks M1 through M13. Pick by your goal:

**Route A · Getting started solo (you just want one coding agent to work smoothly for you).**
Walk M1 → M2 → M3 → M4 → M5.
The aim is that the work you hand an agent comes back at steady quality, without endless rework. These five give you: knowing what you should be handing off (M1), a tidy repo (M2), clearly written tasks (M3), a minimal work environment set up for the agent (M4), and context fed correctly (M5). Take anything past M6 on demand — keep tripping over tool misuse, add M6; want acceptance discipline, add M7. This route **pays off fastest**: one or two artifacts already make your daily agent use far smoother.

**Route B · Rolling out to a team (you want a whole team using delegation reliably).**
On top of Route A, add M6 → M7 → M8 → M9.
One person working smoothly is just the start; the team bottleneck is **acceptance and safety**, not speed. M7 (eval) is the heart of this route — it's where "no eval, no autonomy" lands in practice, and whether a team dares hand over control rides on it. M8 (sandbox & security) draws the team's safety floor; M9 (three agents compared) helps the team standardize tooling instead of everyone running their own and talking past each other. The deliverables here have to be reusable across the whole team, not personal feel.

**Route C · Governing across an org (you set the floors and the metrics).**
Weight M4 → M7 → M8 → M11 → M12, with M1 as background and M13 as the check.
A governor needn't master the feel of every agent, but does need to fully grasp the harness system boundary (M4), the acceptance bar (M7), the safety floor (M8), the new project metrics and failure taxonomy (M11), and safe release with rollback (M12). The output of this route is **institutional**: permission matrices, security-floor checklists, failure taxonomies, release runbooks — the org-level documents you write down and revisit on a schedule. M13, the capstone, is the check: can you run the whole thing through one real repo.

The three routes overlap on the early modules (almost everyone passes M1 and M4) and split later — same as swimming, where the first stages are shared and the crossing and the synchronized work part ways afterward.

### How to use the table

Entering each module, do three things: read the matching chapters, do the exercise, produce that deliverable. **No deliverable, no clearing the module** — don't move on. An eval rubric you can't produce is more honest than "I read the eval chapter": it tells you straight where the understanding isn't real yet.

## Case

The path below is **illustrative** — a picture of what "by module, by deliverable" looks like, not a record of any real team.

Picture a five-person backend group that has spent half a year "trying agents": someone runs an in-IDE assistant for completions, someone occasionally lets a cloud agent open a PR, but nobody can say how far they actually dare hand over control. They decide to walk Route B.

**M2 stalled them for three days.** The first AGENTS.md read fine, but handed to an agent, the agent still edited the migrations directory it shouldn't have touched and still used the wrong test command. The deliverable didn't pass — by the module test, the stage isn't cleared. Back to fix it: nail down the off-limits zones (`migrations/` is hands-off) and list the commands in full (which one tests, which one type-checks). The second version ran green for the agent, and only then was the stage clear. The real output wasn't the document; it was that the agent could actually follow it to green.

**M7 nearly slipped past on demos.** They started by using a few "the agent nailed it" successes as the eval. Halfway through they caught the problem — this is exactly the eval theater flagged back in the anti-patterns chapter: grading on hand-picked successes is testing only the questions you can already answer. They switched to mining history: the times the agent genuinely botched things (missed edge cases, skipped verification, quietly widened scope), and used those failure samples as the eval's seed. The deliverable — that rubric — only then grew real teeth.

By the end of Route B they held four reusable things: a team AGENTS.md, an issue template, an eval rubric, and a permission matrix. Half a year of "trying agents" finally settled into artifacts someone else could pick up and use. That's the difference between a deliverable focus and spectating.

## Anti-patterns

- **Hard-scheduling by day ("finish the harness in week one").** A calendar assumes you spend equal time on each thing and never get interrupted — almost never true in real work. Walk by deliverable; if it won't come out, stop at that stage.
- **Skipping levels.** Handing over auto-merge before learning eval (M7); reaching for multi-agent (M10) before tidying the repo (M2). The dependencies are real, and the levels you skip collapse downstream with interest.
- **Reading without doing.** Treating thirteen modules as thirteen articles and producing zero artifacts. The "I finished reading" illusion is the most deceptive one, and the only thing that blocks it is a deliverable.
- **Collecting instead of learning.** Hoarding tools, frameworks, and tutorials. The hoard itself manufactures a sense of progress, but a hoard isn't a skill. The measure is the artifact in hand, not the length of the bookmarks folder.
- **Wanting all three routes at once.** Trying to walk solo, team, and org routes in one go. Pick the one that fits your current role, finish it, then talk — laying all three at once usually abandons all three midway.
- **Treating the map as scripture.** The table is a reference order, not law. If your project carries heavy security pressure, pulling M8 up right after M4 is entirely reasonable. Keep the dependencies (M2 before M10, M7 before M12); order the parallel modules however you like.

## Checklist

- Am I judging "cleared" by the **deliverable**, or by "I finished reading"?
- Which module am I in right now? Does its deliverable **exist**, and will it **survive use**?
- Am I skipping a level — handing over control before touching eval (M7), going multi-agent before tidying the repo (M2)?
- Have I committed to **one route** for now (solo / team / org), or am I laying all three at once?
- For every module I've passed, do I actually hold one more artifact that **could go into a real project**?
- On the stage where I'm stuck, am I going back to fix it, or pushing on and leaving the debt for later?

## Self-test

- Without the book, can you say **why you can't jump straight** from "agent-ready repo" (M2) to "multi-agent orchestration" (M10)? What are the missing stages in between?
- How many artifacts do you currently hold that **could go straight into a real project** (AGENTS.md / issue template / harness spec / eval rubric / permission matrix)? If it's none, you're most likely spectating, not learning to ship.
- If you could only walk one route first, which would you pick? State the reason behind the choice — if you can't, you haven't yet pinned down your current role.
