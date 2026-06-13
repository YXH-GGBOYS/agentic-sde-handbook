---
id: ch23
order: 23
part_zh: 第五卷 · Agents 工程专章
part_en: Part V · Agents Engineering
title_zh: Managed agents 与 subagents：把脑和手解耦
title_en: Managed Agents & Subagents: Decoupling Brain from Hands
sources: [A4, A1]
---

An agent at work is doing two different jobs at once. One is thinking: how to break the task down, which tool to call next, what the thing it just read actually means. The other is acting: actually reading files, running commands, editing code. When those two are welded together it looks natural, but it gets awkward the moment you try to scale. The hands stall — a container dies, a dependency won't install — and the whole train of thought stalls with it. You want to run several in parallel, and you worry they'll step on each other.

Pulling the brain apart from the hands is the spine of this chapter. The brain decides and plans; the hands execute inside a clearly drawn boundary; a stable interface sits between them. Once they're split, the hands can crash and restart, can be spun up on demand, and the brain can scale on its own. The hard part isn't the split — it's stitching the hands' results back together reliably and signing off on them. You can't skip that layer.

## Everyday analogy

The general contractor and the subcontractor are a ready-made template for this whole relationship.

The general contractor doesn't lay brick himself. He decides: how the building is sequenced, whether electrical or framing goes first, whether a given run of work passes, whether the final payment goes out. The subcontractor is a different animal. He does specific work inside a sharply drawn boundary: you handle the wiring on this floor, here are the drawings, here's the material, and I'll inspect it when you're done. He doesn't negotiate scope with the client — that's the GC's job — and he doesn't wander off to fiddle with the plumbing crew's run.

Two things come out of this arrangement, and neither is for show. People can be added and work can run in parallel: three subs on three floors at once, not colliding, because their boundaries and interfaces are separate. And a mistake doesn't sink the whole job: if one sub's work needs redoing, the GC reassigns it, and the building's schedule doesn't collapse because one trade had a bad day.

But the reason this doesn't spin out of control is the step everyone forgets — **inspection**. The GC doesn't release final payment just because the sub says "my part's done." He measures it, powers it up, checks it against the drawings. The sub's own account is a claim to be verified, not a conclusion. Skip inspection, take "all finished" at face value, and the GC role becomes hollow — what's left is a middleman who handed off responsibility but can't stand behind anything. Whether decoupling the brain from the hands holds up at all comes down to this one check.

## Definition

Anthropic gives a concrete way to split an agent into "brain" and "hands" in Managed Agents, its hosted service [A4]. Managed Agents is built for long-horizon agent work, and its starting observation is this: **what gets hard-coded into a harness is a pile of assumptions about what Claude can't do on its own — and those assumptions go stale as the model gets better** [A4].

A4 has a sharp example. Claude Sonnet 4.5 had a habit called "context anxiety" — wrapping tasks up prematurely as it neared its context limit. Engineers added context resets to the harness to counter it. But run the same harness on Claude Opus 4.5 and the habit was gone on its own, leaving those resets as pure overhead [A4]. Harnesses expire. That's the reason to separate them from stable interfaces.

The approach is borrowed from operating systems. OSes solved the problem of building systems "for programs as yet unthought of" by virtualizing hardware into durable abstractions like processes and files [A4]. Managed Agents copies the move and virtualizes an agent into three components [A4]:

- **Session**: an append-only log that records everything that happened.
- **Harness**: the loop that calls Claude and routes its tool calls out.
- **Sandbox**: the execution environment for code and file operations.

Keep the three apart and each one's implementation can change independently while the interfaces stay stable [A4]. Map it onto "brain and hands": **the brain is Claude plus its harness (deciding, planning, scheduling); the hands are the sandbox plus tools (the actual execution); the session log sits between them as external state** [A4].

Two terms here are easy to conflate, and they operate at different levels:

- A **managed agent** is the architecture above — splitting a whole agent into brain / hands / session, decoupled both physically and in terms of responsibility.
- A **subagent** is a usage pattern on the brain side: the main agent hands a sub-problem to another agent, which works in its own separate context window with its own set of allowed tools, then reports its conclusion back [A1]. That's exactly how Claude Code defines a subagent — it "runs in its own context with its own set of allowed tools," good for tasks that read many files or need focused attention without cluttering the main conversation [A1].

In one line: a managed agent is "decoupling the brain and hands as a whole"; a subagent is "the brain outsourcing one chunk of exploration and taking back only the compressed conclusion." Both serve the same end — don't make one context and one execution environment carry everything — but they act at different layers.

## Why it matters

Welding the brain to the hands is fine in a single-machine demo and starts chafing the moment you scale. A4 calls the early design — all components stuffed into one container — keeping a "pet": a named, hand-tended machine you can't afford to lose [A4]. A4 lists the cost of that coupling [A4]:

- A container dies and the whole session dies with it.
- A container goes unresponsive and someone has to debug it by hand.
- The harness assumes every resource lives in the same container, so the moment that assumption breaks, everything breaks.
- A customer connecting into their own VPC has to deal with network peering on top of all this.

Decoupling changes the nature of these problems. A4 moved the harness outside the container and made it call the container as a tool: `execute(name, input) → string`. If the container dies, the harness treats it as a tool-call error and Claude can retry with a freshly provisioned environment; a harness failure itself is recoverable through the durable session log [A4]. The hands crash and restart, the brain is untouched — which is the whole point of the old ops line about cattle, not pets: a single machine is no longer precious, you replace it when it breaks.

Security improves along the same seam. Before decoupling, the untrusted code Claude generated ran in the same container as the credentials, a real injection risk [A4]. The decoupled design guarantees tokens never reach the sandbox where Claude's generated code runs [A4] — this is the "isolated room" layer of the central metaphor: you don't let the contractor near your keys; what he needs is handed to him at initialization, or fetched through a proxy from a secure vault.

The performance gain is measurable. A4's numbers: after decoupling containers from harnesses, time-to-first-token (TTFT) dropped by roughly 60% at p50 and over 90% at p95 [A4]. Inference starts immediately instead of idling while a container boots — the container only boots when something actually needs to run [A4].

Finally, long-horizon context has somewhere to live. A long task overruns Claude's context window, and leaning on "selective retention" can quietly drop the one fact that mattered [A4]. A4 uses the session log as an external context object: the harness calls `getEvents()` to fetch and transform a positional slice of the event stream, all without spending Claude's context window [A4]. It's the same idea as the previous chapter's "carry long-task state in a file, not in chat history," landed one layer down in the hosted architecture.

## In practice

Not everyone needs to build the Managed Agents infrastructure. But "decouple the brain from the hands" as a habit cashes out into a few things you can do directly with the agents you already use.

**Hand big exploration to a subagent and take back only the compressed conclusion.** This is the move that pays for itself fastest. Anthropic's own framing: context is an agent's most fundamental constraint, which makes subagents one of the most powerful tools available [A1]. When Claude researches a codebase it reads a lot of files, and every read burns your main context; a subagent explores in a separate context window and reports back a summary [A1]. One clear instruction is enough — "use subagents to investigate how our auth system handles token refresh and whether we have OAuth utilities to reuse" — and it goes off, reads, comes back with findings, and your main conversation stays clean [A1].

**Make the inspector someone other than the worker.** A1 puts this bluntly: a reviewer running in a fresh subagent context sees only the diff and the criteria you give it, not the reasoning that produced the change, so it judges the result on its own terms instead of vouching for code it just wrote [A1]. The agent doing the work shouldn't be the one grading it [A1]. The bundled `/code-review` does exactly this: it reviews the current diff in a fresh subagent and returns the findings [A1].

**Put the acceptance criteria into the assignment, not just "review this."** A1's review prompt names the diff to check, the plan to check it against, and what counts as a finding: "review the rate limiter diff against PLAN.md — check that every requirement is implemented, the listed edge cases have tests, and nothing outside the task's scope changed. Report gaps, not style preferences" [A1]. The more concrete the criteria, the less the reviewer wanders.

**Scope the subagent's tools.** A subagent runs with its own set of allowed tools [A1] — that's the "door access" layer of the central metaphor. An investigation subagent that should only read, never edit, shouldn't be handed a file-writing tool. This matters most when you fan out in parallel: A1's fan-out example uses `--allowedTools` to box in what each parallel instance can do, on the grounds that "restricting what it can do matters when you're running unattended" [A1].

## Case

**TTFT: roughly 60% off at p50, over 90% off at p95.** This number from A4 is worth pulling out on its own, because it shows decoupling isn't architectural fussiness — it has a concrete payoff [A4]. With container and harness bound together, every kickoff has to wait for the container to boot before inference can start; pull them apart and the harness lives outside, inference starts immediately, and the container boots on demand only when there's actually something to run [A4]. The brain (a stateless harness) scales independently and the hands are provisioned on demand — this is what "parallel without losing control" looks like at the infrastructure layer [A4].

**"Try to refute me" beats "looks right" for sign-off.** A1 names a common way this goes wrong: the trust-then-verify gap — Claude produces a plausible-looking implementation that doesn't handle the edge cases [A1]. Its remedy: always attach an executable check (tests, scripts, screenshots), and if you can't verify it, don't ship it [A1]. One layer up is adversarial review — have a fresh model try to refute the result in a clean context, so the grader isn't the worker [A1].

There's a counterintuitive trap here, and A1 flags it directly: a reviewer asked to "find gaps" will almost always report some, even when the work is sound, because that's what it was told to do [A1]. Chasing every finding slides into over-engineering — extra abstraction layers, defensive code, tests for cases that can't happen [A1]. So add a line to the assignment: flag only gaps that affect correctness or violate a stated requirement, treat the rest as optional [A1]. The inspection step needs judgment too — you don't act on every finding just because the reviewer reported it.

**Writer and reviewer in two sessions.** A1's Writer/Reviewer pattern is plain: session A implements a rate limiter, session B reviews the same file in a fresh context, hunting for edge cases, race conditions, and inconsistencies with existing middleware [A1]. It spells out why to separate them — a fresh context improves review because that Claude won't favor code it just wrote [A1]. You can run tests the same way: one Claude writes the tests, another writes code to pass them [A1]. This is the subagent idea in its plainest form — no hosted infrastructure, just two sessions.

## Anti-patterns

| Anti-pattern | How it looks | Why it's dangerous |
|---|---|---|
| **Unscoped authority** | "It's a subagent, just give it the full toolset" | An investigation subagent that should only read gets file-write and command-run access, and out-of-bounds edits go unstopped. A1 does the opposite: a subagent runs with its own set of allowed tools, and parallel runs box scope with `--allowedTools` [A1] |
| **Autonomy with no eval** | "It says it's done, so it's done" | Work handed off with no executable acceptance or regression check. A1's hard rule: if you can't verify it, don't ship it [A1]. This is the trust-then-verify gap [A1] |
| **Skipping the integration / sign-off layer** | "The subagent's own account is the conclusion — just stitch it back in" | A sub saying "my part passes" isn't the same as it passing. Trusting the subagent's self-report is the GC releasing payment without measuring the wall — the entire value of decoupling brain from hands collapses on that one unverified seam |
| **Same agent works and grades** | "Just have it check its own work" | The working agent sees its own reasoning and favors what it just wrote. A1 wants a fresh subagent that sees only the diff and the criteria, judging independently [A1] |
| **Brain and hands welded in one container** | "One machine holds it all, simpler" | The container dies and the whole session is gone; an unresponsive one needs manual rescue; a VPC connection drags in network peering [A4]. This is the cost of keeping a "pet" [A4] |

## Checklist

- Have I separated "thinking" from "acting"? Can I say which parts are the brain's decisions and which are the hands' execution?
- Does the work I hand a subagent have a **scoped toolset** (read-only / writable / can it run commands), or did I give it everything to save effort [A1]?
- Is big exploration **summarized back by a subagent in its own context** [A1], or dumped raw into the main conversation?
- Is "done" an **executable check** (tests, scripts, screenshots), not the agent's word that it "looks right" [A1]?
- Is the inspector **a different agent from the worker** — a fresh subagent seeing only the diff and the criteria, judging independently [A1]?
- Does the review assignment say **what counts as a gap**, so the reviewer doesn't invent findings and walk you into over-engineering [A1]?
- When the hands (the execution environment) crash, can the brain **treat it as a tool-call error and retry in a fresh environment**, instead of losing the whole train of thought [A4]?

## Self-test

- Last time you used a subagent, did you actually outsource a chunk of exploration and take back only the conclusion, or just rename the work while still dumping all the raw material into the main context?
- If you handed a fresh agent only this change's diff and one line of "what counts as passing," could it judge on its own whether the work holds? If it couldn't, what you're missing isn't a stronger model — it's the inspection step you skipped.
- When you run several agents in parallel, is it because their boundaries and interfaces are drawn clearly, or because you're hoping they won't collide? Your answer is roughly the ceiling on how far you can scale this before it breaks.
