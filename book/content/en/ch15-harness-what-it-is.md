---
id: ch15
order: 15
part_zh: 第四卷 · Harness 工程专章
part_en: Part IV · Harness Engineering
title_zh: Harness 是什么，不是什么
title_en: What a Harness Is — and Isn't
sources: [O1, A2, A3, A11, G8, S1, S5, S8]
---

A stronger model with no harness is a random-number generator with a keyboard. A harness isn't a tool you install — it's the whole controlled environment you build around an agent. Drop the same model into a good harness and it ships your work; drop it into a bad one and it wrecks it.

## Everyday analogy

You've hired a contractor with great hands and zero knowledge of how your place runs.

You don't drop him into a client's occupied house, say "go ahead," and leave. First you set things up: a **workstation**; a **labeled, within-reach tool wall**; **door access** (which rooms he may enter, which he may not); a **practice room** where he works on a mock-up before touching a load-bearing wall; an **inspector** who checks the work; an **undo agreement** so a mistake can be reverted; and a **note that spells out how to hand the job back**.

That whole kit — station, tools, access, isolated room, inspection, undo, handoff note — is the harness. Notice what isn't in it: "swap this contractor for a pricier one." A better worker helps, sure, but in a chaotic environment even a brilliant one will happily chisel into the wrong wall.

Simon Willison nailed the disposition with his nickname for coding agents: an "army of weird digital interns who will absolutely cheat if you give them a chance" [S1]. The point isn't "don't hire interns." It's that you get good work out of someone capable but unreliable by building a better environment, not by extending more trust. The harness is that environment.

## Definition

**Harness engineering** is the discipline of building a controlled work environment around an agent. That environment has, at minimum, these layers: task intake, context routing, tools, permissions, a sandbox (isolated execution), state and artifacts, evals (acceptance), traces (a record of what happened), recovery, human checkpoints, and a feedback loop.

OpenAI defines the harness as the layer of "verification, feedback, recovery, tools, context, and human judgment" around the agent [O1]. Anthropic, writing about long-running agents, breaks the harness into an initializer, state, artifacts, an evaluator, checkpoints, and human-intervention and recovery paths [A2][A3]. Different words, same thing: **let a fallible agent do real work inside a box you control.**

Two misreadings to clear up:

- A harness is **not** a test harness. A test fixture feeds inputs to code-under-test and asserts on outputs. An agent harness gives a runtime and guardrails to a thing that reads, edits, and runs commands on its own — the name collides, but the two are unrelated.
- A harness is **not** a cleverly worded prompt. The prompt is what you say to the brain; the harness is the operating system around the brain. Cramming every constraint into the prompt is like painting traffic laws on the driver's forehead instead of installing traffic lights.

## Why it matters

**Model capability is necessary, not sufficient.** Whether an agent that can edit many files, run commands, and reach the network causes damage depends on how permissions are split, where it executes, and who signs off — all of which live outside the model.

**Most real-world failures come from system boundaries, not the model.** Dependencies that won't install, flaky tests, a network hiccup, an environment that drifts from production — each can sink an agent run, and none of them means "the model wasn't smart enough." Anthropic measured this directly: on Terminal-Bench 2.0, infrastructure configuration alone moved scores by 6 percentage points — enough to swamp the gap between top models — and under strict resource limits about 6% of tasks failed from infrastructure errors, not the model [A11]. Without a harness to isolate it, you can't even tell whether the model failed or the environment did.

**Faster generation amplifies mistakes.** The quicker execution gets, the quicker a vague goal, a missing acceptance check, or a broken dependency gets copied into more files. That raises the value of constraints, verification, and an undo button — it doesn't lower it.

**A controlled environment makes results repeatable.** Boris Cherny has said that once there's a good plan, the implementation "one-shots almost every time" [S8] (secondary, an interview). But "good plan, one-shot" isn't luck. It rests on every agent instance running in its own checkout, with tests as the inspector and a PR as the handoff. That repeatable scaffolding is the harness. Thoughtworks' Birgitta Böckeler just names the craft outright: "harness engineering" [S5] (secondary).

## In practice

You don't need all nine layers on day one. The smallest version that works is six questions, answered before you hand off any task:

1. What actions **can** this agent take? (Read-only? Write files? Run tests? Reach the network? Open a PR?)
2. Which actions **need human approval**?
3. **Where** does it run? (Directly in your repo, or an isolated worktree / container?)
4. What counts as **done**? (Which tests must be green; which acceptance criterion must hold?)
5. How do you **undo** a bad run? (Branch, snapshot, rollback script?)
6. What **trace** does it leave so you — or the next person — can take over?

Write those six answers down and you have a minimal harness spec. The next chapter expands it into a concrete nine-layer reference architecture. For now, hold onto this: **a harness is the act of making every constraint on the agent explicit and external, instead of quietly hoping it behaves.**

## Case

**Upside: 20–30 PRs a day from one engineer.** Boris Cherny has described running five terminal tabs at once, each with a Claude instance working on its own checkout — one person shipping 20–30 PRs a day [S8] (secondary, interview). What makes this work is the harness, not a magic model. Five isolated checkouts are five rooms that can't interfere; the test suite is the inspector; the PR is the handoff note. Pull any one piece — say, let all five instances edit the same working directory — and you get an instant pileup.

**What a harness looks like in a product.** Look at the hard boundaries GitHub set for its cloud coding agent [G8]: the agent **cannot run `git push`** directly and can only push to its own PR branch; CI workflows **require human approval** before they run; **the person who requested the task cannot approve the agent's PR** (separation of duties); network access is allowlisted. These aren't polite sentences in a prompt — they're guardrails enforced at the tool, permission, and process layers.

**Downside: the contractor dropped into the live floor.** No isolation, no acceptance gate, auto-merge the moment tests pass, the requester approving their own PR. It demos well, and in a real repo it blows up sooner or later.

## Anti-patterns

- **Prompt worship.** Believing a sufficiently magic prompt can replace tests, permissions, and review. The right direction is the reverse: put the prompt inside the harness, not the harness inside the prompt.
- **Security by prompt.** "Don't leak secrets, don't push" is not a control. Real boundaries live in the tool layer and the sandbox, not in the system prompt.
- **Autonomy with no eval.** Letting an agent write files, run commands, and open PRs with no acceptance or regression check. No eval, no autonomy.

## Checklist

- Can I state in one sentence what this agent **can and cannot** do?
- Are the approval-gated actions enforced in the **tool/permission layer**, or only asked for in the prompt?
- Does it run in an **isolated environment**, or against my real repo / real data?
- Is "**done**" an executable test (tests, acceptance criteria), not "looks right"?
- If it goes wrong, do I have an **undo** path?
- Is the trace it leaves enough for **someone else to take over**?

## Self-test

- Is your current way of using agents closer to "set up the workstation, then hand off the task," or "drop him on the live floor and pray"?
- If you cut the network right now, or handed this agent run to someone else, what happens? Your answer tells you how mature your harness really is.
