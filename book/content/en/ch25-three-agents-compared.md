---
id: ch25
order: 25
part_zh: 第六卷 · 三大 coding agent 实战对比
part_en: Part VI · Claude Code / Codex / Copilot in Practice
title_zh: 三者定位与工作流差异
title_en: Positioning & Workflow Differences
sources: [A1, O7, O12, G1, G2, G5, G6]
---

Put Claude Code, Codex, and GitHub Copilot side by side and the first question is usually "which one's the strongest." That's the wrong question. They're closer to three ways of hiring the same capable contractor: one sits beside you and changes a line the moment you point at it; one takes a written work order off the wall, goes off, finishes, and brings back a result for you to inspect; one runs the whole job through a fixed pipeline of access gates and sign-offs. Which model scores higher is one question. Which way of working a task wants is another — and picking wrong isn't the model's fault, it's yours for using an on-site worker as if they were a multi-day contract.

This chapter doesn't rank the three. It lays out where each sits, how you enter, and how the workflows differ, then gives you a selection table so the next time you hand off a task you know which doorbell to ring.

## Everyday analogy

Even with the same capable contractor, you have three ways to use them.

**One: on-site.** The person sits next to you, screen alongside yours. You point at a line — "that's wrong" — and they fix it on the spot. You say "leave that file alone" and they stop. The upside is a tight loop: feedback is instant, you're present the whole time, you can change course anytime. The cost is that you have to watch, and they won't wander off to read the whole repo and come back on their own — they move while you're there. This is you pair-working with an agent synchronously in an IDE or terminal.

**Two: the work order.** You pin a ticket to the wall: "session dies after login timeout, fix it." They take it, spin up their own machine, read the code themselves, run the tests themselves, and hang the result — a PR — back for you to inspect. You don't have to watch and they don't interrupt you. But if the ticket is vague, they build to the letter of what you wrote, with no chance to correct mid-flight. This is the issue → PR async pattern.

**Three: the multi-day contract.** You hand off a big job that spans several days, splits into stages, and needs handoffs in between. They don't just do the work in front of you — they remember where they left off, pick it up tomorrow, pull context from other tools, schedule their own follow-ups. This saves you the most and tests your fridge note and sign-off process the most: get the brief wrong and they can drift for days before you notice.

The three tools lean into these three modes differently, and none nails all three. Seeing what each one's workstation actually looks like is more useful than arguing over whose model scored higher.

## Definition

First, plainly: what each one is and where you enter.

**Claude Code** is Anthropic's agentic coding environment. Unlike a chatbot that answers and waits, it reads your files, runs commands, and changes code — working through problems autonomously while you watch, redirect, or step away [A1]. Its recommended rhythm is explore → plan → code: enter plan mode and let it read without changing anything, ask it for a detailed implementation plan, then switch out of plan mode and let it write against that plan and check its own work, and finally have it open a PR with a descriptive commit message [A1]. Around that loop it hands you a set of autonomy controls: subagents (running in their own context with their own tool set), hooks (scripts that fire deterministically at specific points in the workflow — unlike CLAUDE.md, which is only advisory), and three ways to cut interruptions — auto mode (a separate classifier model reviews commands and blocks only scope escalation, unknown infrastructure, and hostile-content-driven actions), permission allowlists (permit commands you know are safe), and sandboxing (OS-level isolation of filesystem and network) [A1]. You enter from the terminal, an IDE, or the web, where Claude Code on the web runs in Anthropic-managed isolated VMs [A1].

**Codex** is OpenAI's coding agent, built on GPT-5.3-Codex — which OpenAI calls its most capable agentic coding model to date, fusing the prior model's coding performance with GPT-5.2's reasoning and expertise and running 25% faster [O12]. It comes with one unusual claim: OpenAI says it's the first model to play a key role in its own creation — the Codex team used early versions to debug its own training, manage its own deployment, and diagnose test and eval results [O12]. Codex is available through ChatGPT paid plans across the app, the CLI, an IDE extension, and the web [O12], and it's positioned as a partner across the full software development lifecycle (SDLC), not just writing and reviewing code [O7].

**GitHub Copilot coding agent** is a software-engineering agent welded directly into the GitHub workflow. Assign an issue to Copilot and it spins up a secure development environment powered by GitHub Actions in the background — clones the repo, runs tests, pushes commits to a draft PR as it works, leaves a trail in the session logs, and tags you for review when it's done [G1][G2]. Keep two forms separate here: **coding agent** is asynchronous, working like a teammate inside GitHub Actions and opening a PR on its own; **agent mode** is synchronous, pairing with you in real time inside VS Code, JetBrains, Eclipse, or Xcode [G2].

In short: Claude Code centers on the fast synchronous loop in your terminal or IDE plus the autonomy controls you assemble yourself; Codex centers on a partner that spans the whole SDLC and lets you in from many doors; Copilot coding agent centers on the issue → draft PR pipeline and the guardrails bolted into the GitHub platform.

## Why it matters

Picking an IDE plugin used to come down to whether completions were accurate and the editor stayed snappy. Picking a coding agent now comes down to how much decision and execution authority it hands the model by default, and which layer the guardrails sit in. Get that wrong and the cost isn't a missing feature. It's a mismatched way of working.

Use an on-site worker as a multi-day contract and you get an autonomous run with no one watching and no acceptance gate: it starts before it has read half the context, drifts, and you find out after the meeting. Flip it — cram a multi-day job into synchronous on-site mode — and you're pinned to the screen confirming line by line, the agent stalling whenever it idles, none of the time you meant to save actually saved. The three tools nudge you toward different modes by default: Claude Code's synchronous loop rewards being present to correct; Copilot's issue → PR rewards posting the ticket and walking away; Codex's automations even let the agent schedule its own follow-ups and wake up days later to continue a long task [O7]. The first-principles question isn't "who scores higher" — it's "which mode do I want for this task."

There's a second shift: guardrails moved out of the prompt and into the platform. Copilot enforces several boundaries in the system itself — the agent can only push to branches it created, the person who requested the task can't approve the agent's PR, internet access is limited to a customizable allowlist, and CI/CD won't run without your approval [G1]. These aren't polite sentences in a prompt; they're enforced at the tool, permission, and process layers. The same class of boundary, Claude Code leaves you to build with sandbox, allowlist, and hooks [A1]. One bakes the guardrails into the platform; the other hands you the parts to build them. That's the dividing line between the work-order/contract positioning and the on-site one.

Finally, the models really are getting stronger fast — but read what a benchmark measures. GPT-5.3-Codex scores 77.3% on Terminal-Bench 2.0, clearly above GPT-5.2-Codex at 64.0% and GPT-5.2 at 62.2% [O12]. That benchmark measures the terminal skills a coding agent like Codex needs — a different thing from "is it good in your particular workflow." The score tells you about raw model capability; it tells you nothing about whether the tool fits how you work.

## In practice

Before you hand off, ask one question: which mode do I want for this task? The answer mostly decides the door.

**The same task, across all three.** Take "session dies after login timeout, fix it":

- With **Claude Code (on-site)**: in the terminal or IDE, enter plan mode and have it read `src/auth/`, work out how token refresh flows, and produce a plan; review the plan on the spot, edit a couple of lines; switch out of plan mode and have it write a failing test that reproduces the bug, then fix it, checking against the plan, and finally open a PR [A1]. You're present the whole time — one sentence pulls it back when it drifts.
- With **Copilot coding agent (work order)**: write the bug as an issue and assign it to Copilot. It reads the code, runs tests, and pushes commits to a draft PR inside the GitHub Actions ephemeral environment, then tags you when it's done [G1][G2]. You post the ticket and go do something else, then come back to review that PR.
- With **Codex (whichever mode you want)**: it lets you in from many doors — stay synchronous in the CLI or IDE extension and watch, or hand it off async and on long-running work, covering the SDLC from writing code through debugging, deployment, and monitoring [O7][O12].

**When to use each entry point:**

- **IDE / CLI (synchronous, on-site):** you want to be present and correct as you go, and the task isn't fully scoped yet. Claude Code, Codex, and Copilot agent mode all enter here [A1][O12][G2].
- **issue (asynchronous work order):** the task fits a clear ticket and you're happy to post it and leave. Copilot coding agent's main entry is assigning an issue to it [G1][G2].
- **PR (review and closeout):** the work already has shape and you want review and sign-off. The Codex app supports addressing GitHub review comments and reviewing PRs [O7]; Copilot's draft PR is itself the handoff, and a `@copilot` comment on it gets picked up automatically [G2].
- **cloud (long-running, run in parallel):** you want several in parallel, a job that spans days, or to resume from any device. Claude Code on the web runs in managed VMs [A1]; Codex's automations re-use threads, schedule their own follow-ups, and wake up days later to continue [O7]; Copilot's cloud sandbox is an isolated, ephemeral Linux environment you can resume remotely [G5].

**Selection table:**

| Dimension | Claude Code | Codex | Copilot coding agent |
|---|---|---|---|
| Primary mode | On-site (mostly synchronous pairing) | Many doors, across the SDLC | Work order (issue → PR, async) |
| Runtime / where it runs | Local (terminal/IDE); web runs in managed isolated VMs [A1] | Local CLI/IDE, app, web [O12] | GitHub Actions ephemeral environment [G1][G2] |
| Entry points | Terminal / IDE / web [A1] | CLI / IDE extension / app / web [O12] | issue / Agents panel / VS Code / CLI [G1][G2] |
| Where guardrails live | You build them with sandbox / allowlist / hooks [A1] | App and platform side | Enforced by the platform (branch limits / two-person approval / network allowlist / CI needs approval) [G1] |
| Typical fit | Exploratory dev with present-tense correction; parallel checkouts | End-to-end work across the whole SDLC; long tasks | Bounded, async-deliverable low-to-medium-complexity work [G1] |

"Typical fit" is a lean, not a hard boundary — all three entry sets are converging, but each nudges you toward a different default.

**Orchestrating across vendors.** If you'd rather not be locked to one vendor: at GitHub Universe 2025, GitHub announced Agent HQ, which orchestrates agents from multiple vendors inside GitHub. Coding agents from Anthropic, OpenAI, Google, Cognition, and xAI roll out to Copilot Pro+ subscribers (OpenAI's Codex was available immediately in VS Code Insiders) [G6]; the accompanying Mission Control is a unified command center across GitHub, VS Code, mobile, and CLI for assigning, monitoring, and managing those agent tasks [G6]. So "which vendor's agent" and "where you orchestrate it" can be decided separately.

## Case

**Claude Code: a bug fix all the way through explore → plan → code.** The sample workflow in A1 has four stages [A1]. Stage one explores read-only in plan mode ("read /src/auth and understand how we handle sessions and login"). Stage two asks for a plan ("I want to add Google OAuth. What files need to change? Create a plan"), and you can press `Ctrl+G` to pull the plan into your editor and edit it directly. Stage three switches out of plan mode to implement ("implement the OAuth flow from your plan. write tests... run the test suite and fix any failures"). Stage four opens a PR. It's explicit about the tradeoff, too: plan mode has overhead, and for a change you could describe in one sentence — a typo, a log line, a rename — you skip the plan and just have it do the work [A1]. That's the flavor of on-site: you're present at every stage, free to edit the plan and pull it back.

**Codex: turning the agent on its own engineering.** O12 gives a concrete set of internal uses [O12]: the research team used Codex to monitor and debug the training run for this very release; the engineering team used it to tune GPT-5.3-Codex's own test harness, pinpointing a bug in context rendering and the root cause of a low cache-hit rate; through the release it kept helping the team dynamically scale GPU clusters to absorb traffic spikes. During the alpha, a researcher who wanted to know how much more work the new model did per turn had Codex devise a few regex classifiers, run them over large session logs, and produce a report with conclusions [O12]. None of this is a demo — it's a company turning its own agent loose on its own hardest work, and it's the evidence behind "across the whole SDLC."

**Copilot: the issue → PR pipeline with guardrails grown into the platform.** The flow G1 and G2 describe [G1][G2]: you assign an issue to Copilot; it adds a 👀 reaction, spins up the GitHub Actions ephemeral environment in the background, clones the repo, analyzes the code with RAG (powered by GitHub code search), and pushes commits to a draft PR tagged [WIP] as it goes, leaving its reasoning and validation steps in the session logs; when done it tags you for review, and a `@copilot` comment on the PR gets picked up automatically. The default guardrails are enforced in the system: it can only push to branches it created (e.g. `copilot/*`), every PR needs independent human review, CI/CD won't run without approval, the requester can't approve their own agent's PR, and internet access is restricted by a firewall [G1][G2]. That's the work-order mode landing in a real platform — the ticket, the ephemeral room, the camera footage, the inspector, all wired up for you.

**Writing an issue an agent can actually act on.** Whether async hand-off works comes down to how clear the ticket is. A usable template:

```markdown
## Title
Session dies after login timeout

## Symptom
Users report: after a session timeout, the next action logs them out.
Suspected in token refresh.

## Likely location
src/auth/, especially the token refresh path.

## Definition of Done
- First write a failing test that reproduces the issue, then fix it.
- Relevant tests green; don't suppress the error — fix the root cause.
- PR description states: what changed, what you ran to verify, what's unverified.

## Boundaries
- Don't touch migrations/.
- Default network allowlist is fine.
```

This ticket maps onto the one thing A1 keeps stressing: give the agent a check it can run itself (tests, a build, a screenshot), trading "looks done" for a signal that produces pass or fail, so the loop closes on its own [A1].

## Anti-patterns

- **Choosing on benchmark scores.** Seeing GPT-5.3-Codex at 77.3% on Terminal-Bench 2.0, well ahead of the field [O12], and concluding every task should go to Codex. The benchmark measures a specific capability — terminal skills — not "is it good in your workflow, on your kind of task." A high score is necessary, not an answer.
- **Locking mode to tool.** Believing "on-site means only A, work-order means only B." Codex enters from many doors and runs both sync and async [O12][O7]; Copilot has both an async coding agent and a synchronous agent mode [G2]. What's fixed is which mode a task wants, not which vendor.
- **Async hand-off with a prose ticket.** Assigning Copilot an issue that just says "make login feel better." It can't ask you anything mid-flight in the ephemeral environment, so it drifts to the letter of the text. Async demands far more ticket clarity than on-site does — on-site you can pull it back; async you can't.
- **Assuming guardrails are the same everywhere.** Taking Copilot's platform-enforced boundaries (branch limits, two-person approval, network allowlist) [G1] as the default for every agent. Move to Claude Code and you have to build those yourself with sandbox, allowlist, and hooks [A1]; skip that and you're running exposed.
- **Many doors open, context scattered across all of them.** This is exactly what GitHub built Mission Control to fix — agents spread across windows, you lose track of what's running, code lands in a PR with no trail of what the agent tried [G5]. More entry points don't mean better coordination; without one unified view, parallel just means chaos.

## Checklist

- Before handing off, did I settle which mode I want — **on-site (synchronous, present to correct), work order (async, post a ticket), or multi-day contract (handoffs across days)**?
- Does the entry point I chose (IDE/CLI / issue / PR / cloud) **match** that mode?
- If I'm going async, does my **issue / ticket** spell out symptom, likely location, definition of done, and boundaries — or is it prose?
- Are this agent's **guardrails** enforced by the platform (Copilot's set), or do I have to build them myself with sandbox / allowlist / hooks (Claude Code)? Did I?
- Did I give it a **check it can run itself** (tests, a build, a screenshot) so "done" is a pass/fail signal, not "looks right"?
- Am I choosing on **benchmark scores** alone, instead of asking whether it fits my task type and my workflow?
- If several doors / agents are open at once, do I have one **unified view** of what's running and how far along?

## Self-test

- Given a "session dies after login timeout" bug, which of the three would you reach for, through which entry point, and why? Can you name one reason each fits and one cost when it doesn't?
- Last time you used an agent, was it on-site or work-order? If it was a work order (post an issue and leave), was your ticket clear enough that someone with zero knowledge of the project could fix it from the ticket alone? If not, neither can the agent.
- GPT-5.3-Codex scores 77.3% on Terminal-Bench 2.0 [O12]. Can that number tell you whether it's good in your team's workflow? Why not? Articulate that gap and you're no longer being led by the leaderboard.
