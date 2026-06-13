---
id: ch21
order: 21
part_zh: 第五卷 · Agents 工程专章
part_en: Part V · Agents Engineering
title_zh: 一个 agent 是一个工作单元，不是一个 prompt
title_en: An Agent Is a Work Unit, Not a Prompt
sources: [A14, A1, O3]
---

A lot of people still picture an agent as "a model plus a sentence": write a clever enough prompt and let the model handle the rest. That picture survives toy tasks and leaks the moment you put it on real work. On real work, what you have to decide for the agent goes well past the sentence: what it can touch, whether it has to ask before touching, where it runs, who checks the result, and how things get cleaned up when it breaks. None of that lives in the prompt.

Treating an agent as a work unit rather than an instruction is the starting point for everything in this part. A work unit has a scope of responsibility, a deliverable, someone who accepts it, and a way to account for itself when something goes wrong. A prompt gives you none of that — it's one cell in the work unit, not the whole thing.

## Everyday analogy

You're hiring a new contractor. He may have better hands than you do, but on day one he knows nothing about your operation: how your code is laid out, which directories are minefields, what the release process is, what he has to clear with you first.

You don't toss him "go do the login feature" and walk off. To actually put him to work, you set the whole thing up: what **actions** he's allowed (just look around, or edit files, run scripts, commit); what **tools** he gets (which machine, which repo, which accounts); how much **authority** (can he touch the production database, can he make outbound requests); **when he has to hand the work back** (which point he must stop at and wait for your nod); **who inspects** the result (his "it's done" doesn't count — someone checks); and **how he accounts for himself** when something goes sideways (you need to see what he changed and why).

Lay all of that out and you've actually assigned a job. Drop any one cell and you get a specific failure: don't define what he can touch, and he edits the directory you told him to leave alone; don't name an inspector, and he treats a passing test as delivery; don't define how he accounts for himself, and when something breaks you can't even tell what he did. A single sentence can't carry all of this — at most it's one line on the note you stick to his workstation.

## Definition

An agent is a work unit with a scope of responsibility, bundling **a goal, tools, context, permissions, and a way to be evaluated**. Taken apart:

- **Goal** — what it should deliver this time, and what counts as delivered.
- **Tools** — the set of actions it can invoke: read files, edit files, run commands, query a database, open a PR.
- **Context** — the material in front of it: which code, which rule, which conclusion from the last round (the subject of the previous part, context engineering).
- **Permissions** — among those actions, which it may take on its own and which require a human first.
- **Evaluation** — how its work is judged adequate, and by whom.

As the SDE building this work unit, the things you decide are exactly the ones outside the prompt: whether it **can act on its own** (which actions are open, which are gated), **when it hands work back** (which step it must stop and wait at), **how it explains itself** (what trace it leaves so a human can take over or review), **how it's evaluated** (by what criteria, judged by whom), and **how it works with other agents** (when several run at once, how they divide work and stay out of each other's way).

There's a framework worth memorizing that captures how an agent works. Describing Claude Code, Anthropic gives a four-stage loop that repeats: **gather context → take action → verify work → repeat** [A14]. Those four steps map onto the cells of the work unit: gathering context uses its context and retrieval tools, taking action uses its tools and permissions, verifying work uses its evaluation. The same piece says it plainly — when you hand an agent a task, you give it "more than just a prompt: it needs to be able to fetch and update its own context" [A14]. That sentence is the official footnote to "an agent is not a prompt."

Each step has something for you to decide. Gather context: what it reads, what you keep it from rummaging through. Take action: which actions are open, which need approval. Verify work: A14 names three concrete verification methods — defined rules (have it run a linter, then tell it which rule failed and why), visual feedback (screenshot a UI task and feed it back for the model to compare), and a second model as judge (LLM as a judge, though this one is shakier and adds latency) [A14]. Repeat: pick up the last round's result and keep going until verification passes.

## Why it matters

Treating an agent as "a prompt" gets more dangerous as the agents get more capable, for three reasons.

First, an agent can now actually act. It edits many files, runs commands, reaches the network, opens PRs. The ability to act is the ability to do damage. A chat-only model can, at worst, hand you wrong code; an agent that acts can, at worst, copy that wrong code into ten files, run a destructive command, or write dirty data into production. The more it can do, the more the decision "what can it touch, must it ask first" matters — and that decision isn't in the prompt at all. It's in the permission layer and the sandbox.

Second, faster generation amplifies mistakes faster. A vague goal or a missing acceptance check gets copied into more files at speed. That's exactly why verification has to be a fixed cell of the work unit, not something you spot-check afterward. A14 puts it directly: agents that can check and improve their own output are "fundamentally more reliable — they catch mistakes before they compound, self-correct when they drift, and get better as they iterate" [A14]. Without the verify cell, going faster just means making mistakes faster.

Third, the boundary of a work unit determines whether it can be reused and orchestrated. A well-defined unit — clear goal, fixed tool set, defined acceptance — can be treated as a building block and scheduled by another agent. That's how Codex gets used: run the Codex CLI as an MCP server and it becomes a member of an Agents SDK toolchain, handling the generate / modify / test / review-code kind of work [O3]. A loose prompt can't be scheduled that way, because its boundary is fuzzy — no one knows what they'll get back from it or what it will touch.

## In practice

Treating "assign an agent" as "build a work unit" comes down to a few fixed moves.

**Explore first, then plan, then code — don't let it edit on arrival.** This is the most repeated rule in Claude Code. A1 says it straight: letting Claude jump into coding "can produce code that solves the wrong problem" [A1]. Its workflow has four steps: explore (enter plan mode — read files, answer questions, no changes), plan (have it produce a detailed implementation plan), implement (leave plan mode, write the code against the plan and verify), and commit (a descriptive message and a PR) [A1]. These aren't ceremony; they push the "take action" cell later so that "gather context" and getting the plan onto the table happen first. Not every task needs the full ritual — A1 also notes that plan mode has overhead, and for tasks with a clear scope and a small change (fix a typo, add a log line, rename a variable) you just ask it to do the thing; if you can describe the diff in one sentence, skip the plan [A1].

**Set the agent's level of autonomy.** This is the "permissions" and "when it hands back" cells above. In Claude Code that lands on specific tools: auto mode (a classifier model reviews commands first and blocks only what looks risky — scope escalation, unknown infrastructure, hostile-content-driven actions), permission allowlists (permit commands you know are safe, like `npm run lint` or `git commit`), and sandboxing (OS-level isolation restricting filesystem and network access, so it can work more freely inside set bounds) [A1]. In Codex, the autonomy level is a few explicit parameters: `approval-policy` controls whether commands need approval (`untrusted` / `on-request` / `never`), and `sandbox` controls the isolation level (`read-only` / `workspace-write` / `danger-full-access`) [O3]. Either way the point holds: autonomy isn't one switch, it's a set of dials graded per action.

**Give it a check it can run, instead of leaning on your own attention.** This is the "verify work" cell made concrete. A14's three methods (rules, visual feedback, an LLM judge) rank by reliability, high to low: if a deterministic rule (tests, a linter, a build exit code) will do, don't reach for the fuzzy judgment [A14]. An independent check earns its keep: A1 recommends adding an adversarial review before you call something done — have a subagent re-check the diff in a clean context, where it sees only the diff and the criteria you give it, not the reasoning that produced the change, so it grades the result on its own terms rather than marking its own paper [A1].

**When you need several agents, give them a shared task contract — don't make them align over chat.** In O3's multi-agent example, a Project Manager coordinates Designer, Frontend Developer, Backend Developer, and Tester roles; the coordination isn't them shouting at each other, it's the PM first building shared files — `REQUIREMENTS.md`, `TEST.md`, `AGENT_TASKS.md` — then orchestrating the hand-offs with gated verification of each deliverable [O3]. Each agent is still a work unit with a clear boundary; the contract lives in files, not in conversation that evaporates.

## Case

**One work unit at two grain sizes: single-agent and multi-agent.** O3 gives a telling pair. The single-agent version: build a game with a Designer and a Developer agent — the Designer writes a three-sentence brief and hands off to the Developer (wired to a Codex MCP server) to implement in HTML/CSS/JS [O3]. The multi-agent version adds a Project Manager that builds the shared requirements and test files, then coordinates the hand-offs among Designer, frontend and backend developers, and a tester, with gated verification at each deliverable [O3]. The difference between the two isn't a stronger model; it's how the work is split into units and what contract holds between them — single-agent is one workstation, multi-agent is a crew plus a roster.

**A trace makes a work unit reviewable after the fact.** Same O3 setup: Codex automatically records traces, capturing the prompts, the tool calls, and the hand-offs between roles; you can replay them in the Traces dashboard to debug where the workflow stalled and audit agent behavior [O3]. That maps onto the work-unit cell "how it explains itself." A lone prompt is gone once it finishes — you don't know what it read mid-run, what it tried, where it handed off. A work unit with a trace lets you rewind through every step when something breaks. That's the difference between a work unit and a prompt after the fact.

**A real trap in adversarial review.** A1 gives an honest warning: a reviewer agent told to find gaps will almost always report some, even when the work is sound — because finding gaps is what you asked it to do [A1]. Take every finding at face value and you get over-engineering: an extra abstraction layer, defensive code, tests for cases that can't happen [A1]. So the acceptance cell itself needs a boundary: tell the reviewer to flag only gaps that affect correctness or the stated requirements, and treat the rest as optional [A1]. The inspector is a role in the work unit too, and its scope of responsibility needs drawing just as clearly.

## Anti-patterns

| Anti-pattern | How it looks | Why it's dangerous |
|---|---|---|
| One mega agent (a single agent for everything) | Convenient — one context holds it all | Context fills up, unrelated tasks interfere, and the model starts "forgetting" earlier instructions and making more mistakes. Split it into several units with clear boundaries and clean contexts |
| Cramming every constraint into the prompt | "I'll just write 'don't touch production'" | Permissions don't live in the prompt; they live in the permission layer and the sandbox. A sentence won't stop an agent that can run commands |
| Letting it edit on arrival | Fast — skip explore and plan | Tends to produce code that solves the wrong problem [A1]. Explore first, then plan, then code |
| Autonomy with no acceptance | A passing test counts as delivery | Without an independent check, "looks right" is the only signal and mistakes compound [A14]. No eval, no autonomy |
| Taking every adversarial finding | Fix everything the reviewer flags; feels safer | A reviewer told to find gaps always finds some; fixing all leads to over-engineering [A1]. Fix only what affects correctness and the stated requirements |
| Multi-agent aligning over chat | Just let them message each other | Fragmented context, runaway coordination cost. Put the task contract in shared files, not in conversation [O3] |

**One mega agent** deserves its own paragraph, because it's the most seductive. A single long-context agent looks like it can do anything — throw everything at it and it takes everything. But A1 lists this "kitchen sink session" as the top failure pattern: you start with one task, ask something unrelated, circle back to the first, and the context fills with irrelevant information while performance drops [A1]. The right direction is the reverse: split a large goal into several units with clear boundaries, each with its own clean context, its own tool set, its own acceptance — rather than pressing everything into one session that only ever grows.

Different agent roles carry different headline risks; know them before you assign:

| Role | Headline risk |
|---|---|
| Code implementation | Scope quietly expands, business intent misread, thin test coverage |
| Review | False positives and misses, judging a surface diff without context |
| Research | Tangled sources, conclusions that don't reproduce |
| Planning | A pretty plan detached from the repo's reality |
| Operations | Over-broad permissions, fat-finger actions, alert fatigue |
| Multi-agent orchestration | High coordination cost, fragmented context, runaway budget |

## Checklist

Before you assign an agent, run it through as a work unit:

- Does the agent's **goal** spell out what counts as delivered, instead of a vague "do X"?
- **What can it touch?** Which actions are open, which require a human first — and is that enforced in the permission layer / sandbox, or only in the prompt?
- **Where does it run?** Against the real repo, or an isolated worktree / container?
- **Who accepts the work?** Is there a check it can run itself (tests, a linter, a build), ideally plus an independent adversarial review?
- **What trace does it leave?** When something breaks, can another person take over and reconstruct what happened?
- Should **one agent** do this work, or should it split into several units with clear boundaries? Have you accidentally built one mega agent?
- If it's multi-agent, is the **task contract** in shared files, or are you betting they'll align over chat?

## Self-test

- Lay out the last job you handed an agent: did you give it a complete work unit (goal, tools, permissions, acceptance all set), or a prompt and a prayer? The missing cells — did you patch them in by hand later, or did no one patch them at all?
- If you wiped this run's chat history right now and kept only the trace and artifacts it left, could the next person take over? If not, what you assigned was a prompt, not a work unit.
- Do you have an agent quietly growing into a mega agent — every job piled onto it, the context getting longer? If so, which clearly-bounded units should it be split into?
