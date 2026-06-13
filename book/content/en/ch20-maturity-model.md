---
id: ch20
order: 20
part_zh: 第四卷 · Harness 工程专章
part_en: Part IV · Harness Engineering
title_zh: 成熟度模型与企业落地
title_en: Maturity Model & Enterprise Rollout
sources: [A2, A3, A4, G2, O7, O1]
---

Putting agents into production isn't a switch you flip — it's a staircase. The bottom step is "hit a wall, ask the chat box, paste the answer back." The top step is a crew of contractors that ship in parallel and turn every failure into next week's exam question. There are several steps in between, and each one asks you to add something different — usually not a smarter model, but the environment around the model.

This chapter lays out an L0–L5 maturity model. For each level it answers two things: what that level looks like, and the one thing you add to climb to the next. The model isn't a leaderboard to rush up. It's a mirror: name the level you're actually on, then add only the one thing the next level needs. Skipping a level is where things break.

## Everyday analogy

A small shop's relationship with outside help also comes in stages.

At first, you hit a job you can't crack and you call a friend who knows the trade: "how do I do this?" He talks you through it over the phone, you hang up, you do it yourself. It works, but every time it's you relaying the question and you turning the wrench. He's never set foot in your shop — he doesn't know where your materials are or what your house rules are.

Next, you let a temp in to do one or two specific things, but you watch him the whole time — every screw he turns, you check. A step up from that, you've given him a workstation, a labeled tool wall, a few written rules, and he can finish a job on his own and hand it back for you to inspect. A step up again, several contractors are working at once in separate rooms, somebody schedules who does what, somebody signs off — and now your job is "who takes which task, who checks it," not every individual screw.

The most mature stage is a crew that learns: the kind of job that keeps going wrong gets written into a new rule on the wall and onto the inspection sheet, so the next time a job like that comes in, it's caught automatically. From "phone a friend" to "a crew that improves itself," every step in between is missing something concrete — a workstation, the rules, an inspector, a scheduler, a way to debrief. Skip a level before you've filled the gap and you get the same outcome every time: the work goes faster, and so does the copying of mistakes.

## Definition

A maturity model is a ruler ordered by how complete your harness is. It measures not how strong the model is, but how built-out the environment you've put around the agent is: can it run on its own, where does it run, who signs off, how do you undo a bad run, and does a failure get recorded so it becomes a defense next time.

Here are the six levels. Each level's "look" is something you can hold up a mirror to right now; the "next step" is the one thing the level below it is missing.

| Level | Name | What it looks like | The one thing the level below adds |
|---|---|---|---|
| L0 | Chatbot assist | Q&A in a chat box, manual copy-paste; no agent instructions in the repo; no automated verification | Write down how to run tests, lint, and start the service in the repo; add an issue template |
| L1 | Personal AI coding | Model generates code in an IDE/CLI; a human checks it line by line | Bake tests, lint, and run steps into the repo so "is it right" has an executable check |
| L2 | Agent-ready repo | There's an AGENTS.md, issues are clear, CI runs from a clean environment | Add a sandbox (isolated execution), traces, and risk-tiered task intake |
| L3 | Delegated PR | The agent opens a PR from an issue; a human reviews | Add evals (automated acceptance), automated risk scanning, and rollback |
| L4 | Managed agents | Multiple agents in parallel, with scheduling and review | Quantify cost, quality, throughput, and failure types so scale is manageable |
| L5 | Learning harness | Failure samples flow into evals automatically; rules update continuously | Fold agentic delivery into org-level engineering governance |

A few things to settle before you misuse the ruler.

First, the level scores a workflow, not a company. In the same org, the front end might sit at L1 while one of the back end's CI pipelines is already at L3. Don't ask "what level is my company" — ask "what level is this workflow."

Second, the gate at each level is the environment, not the model. Going from L2 to L3, what's missing isn't a smarter model — it's evals and rollback. No matter how strong the model, without acceptance and undo you won't dare let it open and merge its own PR.

Third, you take the steps one at a time. L2's marker is having a sandbox and traces; L3 adds automated acceptance and rollback on top of that. You can't skip the sandbox and jump straight to "many agents in parallel" — with no isolated rooms, several agents in the same working directory overwrite each other. The specific pitfall comes up later in the chapter.

## Why it matters

The point of the ruler is to force an honest answer to "what level am I actually on," so you don't attempt something your current harness can't catch.

The cost of skipping a level is, at bottom, automation running ahead of the guardrails. At L1 — a human reading every line — when the model copies in a bad pattern, you catch it on the spot. But the moment you jump to "the agent opens and merges its own PR" (an L3 action) without adding L3's evals and rollback, that same bad pattern gets copied into dozens of files while you weren't looking. Faster generation amplifies mistakes — not a new idea, but once an agent raises generation speed by an order of magnitude, it goes from "occasional stumble" to systemic risk.

OpenAI's fully agent-generated internal product offers a cautionary footnote. The team used to spend every Friday — 20% of the week — manually cleaning up the "slop" the agents left behind: repetitive, suboptimal patterns the agent kept copying from whatever already existed in the repo [O1]. Manual cleanup didn't scale; what fixed it was encoding "what a good pattern is" into mechanical rules plus a recurring automated cleanup pass [O1]. That is exactly the shape of the L4→L5 jump: failures and bad patterns stop being wiped by hand each time and get encoded into defenses that keep working.

The opposite mistake costs you invisible debt: pretending you've reached a level you haven't. Someone at L0 thinks they're "already using AI," but every time they're re-relaying the question and re-turning the wrench — the agent has never really entered the shop. That habit doesn't grow into L3 on its own; it stays stuck at L0 while the user believes they're advancing. The ruler's first job is to puncture that illusion.

## In practice

There's one rule for rollout: name your current level, add only the one thing the next level needs, then look up again. Here are the concrete moves and the place each one tends to stall.

**L0 → L1: make the repo say how to run itself.** The minimum is writing down three things in the repo — how to run tests, how to lint, how to start the service. Add an issue template (what an issue should describe, where the repro steps go). Where it stalls: people stay at L0 because "I ask, it answers" already feels like enough, and they don't notice the road doesn't lead to autonomy — the agent never has an executable check for "right," so you're stuck being that check at every step.

**L1 → L2: let a stranger run the work in a clean environment.** Add three things: an AGENTS.md (the house-rules note on the fridge — actions, commands, off-limits zones, not prose like "we pursue excellence"); CI that runs green from a clean environment; and a sandbox plus traces. The test here is hard: can a fresh agent (or a new hire), reading only the repo and asking no one, bring up the environment and get the tests green? If it can't, you're still at L1.

**L2 → L3: add acceptance and undo before you let it open PRs.** This step adds evals, automated risk scanning, and rollback. The boundaries GitHub set for its cloud coding agent are the standard shape of this L2–L3 line [G2]: you assign a GitHub issue to the agent, it opens a draft PR and logs the key steps into it as it works (that's the trace); it can only push to branches it creates (the copilot/* kind), never straight to main; every PR requires independent human review; CI workflows won't run without approval; network access goes through a firewall allowlist [G2]. None of that is polite prose in a prompt — it's enforced at the tool and process layers. Where it stalls: teams skip the eval and go straight to autonomy, letting the agent open a PR that auto-merges the moment tests pass. The rule is simple: no eval, no autonomy.

**L3 → L4: parallel work requires isolation and scheduling first.** This step runs multiple agents at once, with scheduling and review. The technical prerequisite is that the sandbox is genuinely isolated — each agent gets its own checkout or worktree, or instances in the same directory overwrite each other. Anthropic split the multi-agent job into three roles: planner, generator, evaluator. The planner expands a one-sentence ask into a full spec; the generator implements one feature at a time; the evaluator drives the running app through browser automation (Playwright) the way a real user would and grades it against a few hard criteria, failing the round and sending specific feedback back to the generator if any criterion falls below threshold [A3]. One thing worth keeping: splitting "the worker" from "the inspector" into two agents is far more reliable than one agent grading itself — an LLM scoring its own work skews lenient almost every time, while a separate, deliberately skeptical reviewer agent turns out to be tractable to tune [A3].

**L4 → L5: encode failures into the eval so the harness improves itself.** The top level's marker is that failure samples no longer get logged by a person; they flow into evals automatically, rules update continuously, and the whole thing sits inside org-level engineering governance. OpenAI's internal product gives a concrete shape: they encoded "what a good pattern is" into a set of mechanical rules ("golden principles") and ran a recurring set of background Codex tasks to scan for deviations, update quality grades, and open targeted refactoring PRs — most reviewable in under a minute and auto-merged [O1]. A standing "doc-gardening" agent scans for stale docs that don't match the real code and opens fix-up PRs on its own [O1]. Human taste is captured once, then enforced continuously on every line [O1].

## Case

**Three people, roughly 1,500 PRs: how managed agents scale.** An OpenAI internal product did something extreme: over five months, zero hand-written lines — application logic, tests, CI config, docs, observability, internal tooling, every line written by Codex with humans steering [O1]. At scale, the repo reached on the order of a million lines, with roughly 1,500 PRs opened and merged behind just three engineers driving Codex — about 3.5 PRs per engineer per day [O1]. The most counterintuitive number: as the team grew from three to seven engineers, per-engineer throughput went up, not down [O1]. That isn't "the model is magic." It works because they treated AGENTS.md as a table of contents rather than an encyclopedia (around 100 lines, just a map pointing to deeper sources of truth), pushed almost all review to agent-to-agent, and reserved human effort for the one scarce resource — human time and attention [O1].

**Decoupling the brain from the hands: how managed agents scale more steadily.** Writing about its Managed Agents service, Anthropic gives the other half of the scaling answer: decouple the "brain" (the decision-making — Claude plus its harness) from the "hands" (execution — sandboxes and tools) and from the session log [A4]. The earliest design packed all three into one container, which became what ops calls a "pet" — a named machine you hand-tend and can't afford to lose: if the container died, the session died, and the harness assumed every resource lived in the same container [A4]. Once decoupled, the harness became stateless and called the container as a tool (`execute(name, input) → string`); a dead container is just a tool-call error, and Claude retries with a freshly provisioned environment [A4]. There's a security gain too: the untrusted code Claude generates runs in the sandbox, and credentials never reach that sandbox [A4]. The performance gain is concrete: time-to-first-token dropped roughly 60% at p50 and over 90% at p95, because inference can start immediately instead of waiting for the container to come up [A4].

**issue → agent → PR → human review: the canonical L2–L3 shape.** GitHub Copilot's coding agent productized this pipeline: assign it a GitHub issue and, in a secure, ephemeral environment powered by GitHub Actions, it explores the code, makes changes, runs tests and linters, opens a draft PR, and logs the key steps along the way [G2]. The boundaries are the ones above — push only to its own branch, PRs require independent human review, CI won't run without approval, network through an allowlist [G2]. It's a sample of "delegate plus inspect" turned into a product: delegation isn't walking away, it's authorization with an acceptance gate.

**The org-level surface is widening.** Codex now has more than three million developers using it weekly across the full software development lifecycle — writing code is just the entry point; increasingly people use it to understand systems, gather context, review work, debug, and keep longer-running work moving [O7]. That says coding-agent use is no longer "an individual autocompleting in an IDE" — it's spread, at organizational scale, across many engineering workflows. That spread is the external signal of maturity moving toward L3 and L4.

## Anti-patterns

- **Skipping a level.** Running many agents in parallel with no sandbox; turning on autonomy with no eval. The most common and most expensive mistake. The test is simple: the action you want (auto-merge, parallelism, autonomy) — is the guardrail layer it depends on built? If not, you're skipping a level.
- **Believing a stronger model crosses levels for you.** The gate is the environment, not the model. What's missing from L2 to L3 is evals and rollback; a smarter model doesn't fill that gap — it just pushes unreviewed changes in faster.
- **Using the prompt as a security boundary.** Writing "don't push, don't leak secrets" in the system prompt and calling it a control. The real boundary is the tool layer and the sandbox: the agent can only push its own branch, credentials never reach the sandbox — those are enforced at the tool and permission layers, not spoken [G2][A4].
- **Writing AGENTS.md as an encyclopedia.** A giant instruction file crowds out the task, the code, and the docs that actually matter, and it rots instantly into a graveyard of stale rules — when everything is important, nothing is [O1]. Treat it as a table of contents that points to deeper sources of truth [O1].
- **Scaling L4 without quantifying.** Many agents running in parallel, but you can't state the per-unit cost, the failure types, the quality, or the throughput. Scale without measurement is loss of control — you can't even answer whether this is faster than people or just noisier.
- **Assuming a harness is build-once.** Every component in a harness encodes an assumption about what the model can't do on its own, and those assumptions go stale as models improve [A4][A3]. Sonnet 4.5 needed context resets to handle "context anxiety"; on Opus 4.5 that behavior largely went away, leaving those resets as pure overhead [A4]. When a new model lands, go back and strip out the pieces that are no longer load-bearing [A3].

## Checklist

- Can I state what level **this workflow** is at right now (not "what level my company is")?
- The action I want next — **is the guardrail layer it depends on built**? (Auto-merge → is there an eval? Parallel → is there real isolation?)
- Can a fresh agent, reading only the repo and asking no one, bring up the environment and get tests green? If not, you're not at L2 yet.
- Is "done" an **executable check** (tests, acceptance criteria), or just "looks right"?
- Are the approval-gated actions enforced in the **tool/permission layer**, or only asked for in the prompt?
- If a run goes wrong, is there an **undo path** (branch, snapshot, rollback)? Strong automation needs an undo.
- At L4, can I **quantify** cost, quality, throughput, and failure types — or do I only see "lots happened"?
- Do failure samples **flow into the eval and become a defense next time**, or does a person wipe them by hand each round?

## Self-test

- Take your most-used agent workflow, hold it against the six levels — where does it land? The next action you most want to take: are you skipping a level to get it?
- If you let an agent open and merge its own PR right now and slept on it, what would you worry about most when you woke up? Your answer points straight at the guardrail layer you haven't added — usually evals or rollback.
- The last time an agent botched a job, did that failure get recorded? Did it become a rule, an eval, so the next agent won't hit the same pothole? If not, your harness doesn't learn yet — it's still below L5.
