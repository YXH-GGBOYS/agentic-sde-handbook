---
id: ch12
order: 12
part_zh: 第三卷 · 新工程资产
part_en: Part III · The New Engineering Assets
title_zh: 状态与交接工件：让长任务可恢复
title_en: State & Handoff Artifacts
sources: [A2, A3]
---

An agent runs for three hours and dies partway through its fourth context window. The next agent picks up with no memory of anything that came before — it looks around, sees some code, and either redoes the work from scratch or simply declares the job done. Anthropic has a sharp analogy for long-running agents: a software project staffed by engineers working in shifts, where each new engineer arrives with no memory of what happened on the previous shift [A2].

For that kind of team to actually hand off, you can't rely on remembering what the last shift talked about. You rely on what the last shift wrote down: how far it got, where it's stuck, why it decided what it decided, what the next shift should start on. Those notes are the state and handoff artifacts this chapter is about.

## Everyday analogy

On a construction site, a crew finishing its shift hands off to the next one. A site that runs well doesn't rely on a verbal briefing — it relies on two things: the work log and the shift-handover sheet.

The work log records facts: which columns got poured today, the concrete grade, which one didn't get finished because it rained. The handover sheet records state and judgment: this shift got the east side of the third floor up; we're blocked because the embedded-part dimensions don't match (reported to the client, waiting on a reply); the next shift should leave the east side alone and finish tying the west-side rebar first.

The point is that the person coming on shift wasn't there and didn't hear the discussion. He walks onto the site, reads those two documents, and can keep going — he knows the current state, why earlier calls were made, and where to start. If the last shift only kept "that embedded part is a bit off" in someone's head and never wrote it down, the next shift builds to the wrong dimension, and you find out after the pour, when it has to come out and be redone.

A long-running agent's handoff is exactly this. Every new session is a person coming on shift who didn't hear any of the discussion. Whether it can continue depends entirely on what the last shift left behind.

## Definition

**State and handoff artifacts** are the set of files an agent leaves at the end of a session so that the next session — or the next person — can take over without starting from zero.

The core problem comes from a hard constraint: context windows are limited, most complex tasks don't fit in one window, so a long-running agent has to work in separate sessions, and each session begins with no memory of what came before [A2]. This "memory-less shift change" is structural, not something a smarter model fixes. Even with compaction (summarizing the earlier conversation in place), Anthropic found it isn't enough — compaction doesn't always pass perfectly clear instructions to the next agent [A2]. Reliable continuation rests on artifacts written explicitly to disk, not on whatever context survives in memory.

This chapter breaks the handoff into five artifacts, each with its own job. This is the book's framing — a way to check whether you've left what you should — not a fixed format from any one vendor:

- **PLAN:** goal, non-goals, task decomposition, risks, validation strategy. What this long task should turn into, and what it explicitly will not do.
- **STATUS:** done, in progress, next, current blockers. The first thing the next shift reads.
- **DECISIONS:** the calls that mattered, why this option, which alternatives were dropped. Keeps the next shift from re-litigating what the last shift already thought through.
- **VALIDATION:** which commands ran, what the results were, what failed, what's still unverified. Separates "I tested it" from "I assumed it works."
- **HANDOFF:** the minimum context for the next person or agent — where to start reading, what to do first.

Not every task needs five separate files. A small task might fold STATUS, VALIDATION, and HANDOFF into one progress file. The number of files isn't the point; not dropping any of the five categories is.

## Why it matters

When a human team changes shifts, lost context is recoverable — the person coming on can call the last shift, scroll the chat history, or guess close enough from experience. An agent has none of those fallbacks. It reads only what you explicitly leave it; state that never made it into an artifact does not exist for it.

This bites hardest on long tasks, because failure amplifies down the relay chain. Anthropic observed two typical collapse modes [A2]. In one, the agent tries to one-shot the whole app, runs out of context mid-implementation, and leaves a half-built, undocumented mess for the next shift — which then has to guess what happened and spend real time getting the basic app working again. In the other, late in the project, an agent instance looks around, sees that progress has been made, and declares the job done. Neither is the model being "not smart enough." Both are what happens when no artifact holds the state, so every shift change is a gamble.

There's a counterintuitive part too: the faster it runs, the more it needs to write state down. A session can rewrite a large chunk of code in minutes, and if it leaves no trace on the way out, the next session spends longer doing archaeology on where those changes came from. Anthropic's point is that leaving a progress file and git history removes the need for an agent to guess what happened and get the basic app working again [A2]. Handoff artifacts aren't extra overhead bolted onto long tasks — they're the foundation that lets long tasks run at all.

## In practice

When Anthropic built a clone of claude.ai, they baked "leave a handoff" into the harness itself: the first session uses a dedicated initializer agent to set up the environment, and every coding agent after it is asked to make incremental progress and leave structured updates before it exits [A2]. Concretely, three things get left behind:

1. An **`init.sh` script** that can run the development server. The next shift doesn't have to figure out how to start the project.
2. A **`claude-progress.txt` progress file** that logs what each agent has done.
3. **git commit history**, with a descriptive commit message on each change. This lets the agent use git to revert bad changes and recover a working state [A2].

The coming-on-shift routine is fixed too. Each coding agent starts by running a "get your bearings" sequence [A2]:

- Run `pwd` to see which directory it's working in (it can only edit files there).
- Read the git log and the progress file to learn what was recently worked on.
- Read the feature list and pick the highest-priority feature that isn't done yet.

This routine saves tokens — the agent doesn't have to re-derive how to test the code every session [A2]. It maps straight onto the construction handoff: read the handover sheet, then the work log, then decide where to start today.

A3 distills the practice into a design principle: a long-task harness does two things — decompose the build into tractable chunks, and use structured artifacts to hand off context between sessions [A3]. Add verifiable outputs and points for human intervention, and you have the skeleton of a harness for long-running application development.

One judgment call is worth flagging. A3 notes that as models get stronger (Sonnet 4.5 to Opus 4.5 to 4.6), some scaffolding can come out — Opus 4.5 largely stopped exhibiting "context anxiety" (wrapping up prematurely as it nears what it believes is its context limit), so the context-reset layer could be dropped and the agent could run a whole build in one continuous session [A3]. But hold onto this line: every component in a harness encodes an assumption about something the model can't do on its own, and those assumptions are worth stress-testing, because they may be wrong and because they go stale as models improve [A3]. In other words, whether you need this whole set of handoff artifacts, and how heavy it should be, depends on how reliably the model you're targeting holds up on long tasks — more is not automatically better.

## Case

The state artifact for the claude.ai clone is, at its core, a JSON feature list. The initializer agent expanded the user's high-level prompt — "build a clone of claude.ai" — into a detailed feature-requirements file, in this case **over 200** end-to-end features [A2], each shaped like this:

```json
{
    "category": "functional",
    "description": "New chat button creates a fresh conversation",
    "steps": [
      "Navigate to main interface",
      "Click the 'New Chat' button",
      "Verify a new conversation is created",
      "Check that chat area shows welcome state",
      "Verify conversation appears in sidebar"
    ],
    "passes": false
  }
```

The design folds acceptance and recoverable state into one object. All 200-plus features start marked `"passes": false`, giving every later coding agent a full map of what complete functionality looks like [A2]. A coding agent is allowed to change exactly one field — flipping `passes` from false to true — and only after it has carefully tested the feature [A2]. That fixes both collapse modes at once: with the full map in front of it, the agent won't prematurely declare the whole project done; and because a feature only flips to "passing" after real testing, the agent won't mark something complete that doesn't actually work.

Two details are worth copying. First, why JSON instead of Markdown: Anthropic found the model is less likely to inappropriately change or overwrite a JSON file than a Markdown one, so a file that doubles as acceptance criteria and state holds up better in JSON [A2]. Second, the wording of the gate — Anthropic used strongly worded instructions, along the lines of "it is unacceptable to remove or edit tests because this could lead to missing or buggy functionality" [A2], nailing the list down as a hard constraint the agent may not quietly edit just to look finished.

The three-agent architecture in A3 (planner / generator / evaluator) pushes the handoff one step further: communication between agents happens entirely through files — one agent writes a file, another reads it and responds either inside that file or in a new file the first agent then reads [A3]. Before each sprint, the generator and evaluator negotiate a "sprint contract," agreeing on what "done" looks like for that chunk before any code is written [A3]. That's PLAN and VALIDATION turned into a contract two agents can negotiate and persist to disk.

## Anti-patterns

- **Treating compaction as the handoff.** Believing a summary of the earlier conversation is enough. Compaction preserves continuity but doesn't give the next agent a clean slate, and it doesn't always pass clear instructions through [A2]. Reliable continuation rests on artifacts written to disk, not on summarized leftovers.
- **Logging "what was done" but not "why it was decided."** A progress file full of "implemented X, changed Y" with no DECISIONS. The next shift can't see the reasoning behind the trade-offs, so it re-decides what the last shift settled — sometimes walking back into a pit the last shift already routed around.
- **Treating "changed the code" as "verified."** The agent edits code, runs a unit test or a curl, and marks the feature done without testing end-to-end as a real user would. Anthropic saw this collapse mode directly — unless explicitly prompted to drive a browser like a human user, the agent fails to recognize that a feature doesn't work end-to-end [A2]. A VALIDATION artifact has to separate "actually tested" from "assumed to work."
- **Writing the handoff for yourself, not for a stranger.** A HANDOFF that assumes context the next shift "already knows" — which the genuinely memory-less next session can't read. The test is the same as the construction handover: can someone who heard none of the discussion keep going from this artifact alone?
- **Storing state in a format the agent likes to rewrite.** Keeping the key acceptance-and-state file in Markdown, which the agent edits on a whim. Anthropic switched to JSON precisely because the model is less likely to mess with it [A2].

## Checklist

- Does my long task have a **PLAN** — goal, non-goals, decomposition, risks, validation strategy all written down?
- Is there a **STATUS** that lets the next agent see at a glance what's done, in progress, next, and currently blocked?
- Did the calls that mattered make it into **DECISIONS** — why this option, which alternatives were dropped?
- Does **VALIDATION** separate "actually ran, here's the result" from "not verified yet"? Is "done" backed by a real end-to-end test, or just a code change?
- Is the **HANDOFF** written for a stranger who heard none of the discussion? Can they continue from the artifact alone?
- When the agent exits, does it leave something the next shift can pick up from — progress file, git history, a startup script?
- Are the key state files in a format the agent won't casually rewrite (e.g. JSON)?

## Self-test

- If this agent run lost power right now and the next session (or a colleague) took over, how long would it take them to figure out where things stand, why it was done this way, and what to do first? The closer the answer is to "a few minutes reading a few files," the more mature your handoff artifacts are.
- The last time you let an agent mark a feature "done," was that "done" based on it actually testing end-to-end the way a real user would — or did it just change the code, run a unit test, and declare victory?
