---
id: ch05
order: 5
part_zh: 第一卷 · 格局重置
part_en: Part I · The Reset
title_zh: 前沿 SDE 的工程原则
title_en: Engineering Principles for the Frontier SDE
sources: [O1, O4, O5, A1, A8, A10, A11, G2, G3]
---

By now the earlier chapters have made one thing clear: your job has shifted. You no longer ship mainly by typing code. You ship by setting up, constraining, and signing off on a very capable newcomer who doesn't know how your shop runs. This chapter adds no new detail. It does one thing — it lays out, up front, the engineering principles the rest of the book keeps coming back to. Treat it as the table of contents.

Each principle gets one sentence on what it is and one on why it matters. How to actually do it, where it breaks, what artifacts to produce — that's left to the chapter that owns it. You don't need to memorize the list. You need the skeleton in your head, because nearly every later chapter is one of these twelve, pried open and made real.

## Everyday analogy

You're opening a restaurant. A skilled cook, a good menu, a room people want to be seen in — all of that matters, and none of it comes first. What decides whether the place survives is a set of **house rules**: written down, posted on the wall, followed by everyone.

A real set of house rules looks like this:

- **Source every ingredient.** Each delivery of meat and produce is logged — supplier, batch, date — so when something goes wrong you can trace it back to which batch from which vendor.
- **Taste before it leaves the pass.** A dish isn't carried straight out of the pan. Someone at the pass tastes it and checks how it looks; if it's off, it goes back.
- **Reconcile the till nightly.** At close, the register matches the receipts. If it doesn't, you find out tonight, not at month-end.
- **A rule for sending food back.** When a guest says a dish is wrong, who can comp it, how it's recorded, how it hits the books — all settled in advance, not argued on the spot.
- **No-go zones in the kitchen.** Some things are simply not done: a dropped plate going back out, expired stock that's "probably still fine." In writing, no gray area.
- **A real trial period.** A new cook isn't hired off one dazzling plate in the interview. You watch a run of real service and see whether they hold up.

Notice: not one of these rules teaches the cook how to work a pan. They govern how the *place* runs — how ingredients arrive, how work gets checked, how mistakes get unwound, how people get vetted. The rules go up first. Swap the menu, swap the chef, open a second location — the skeleton holds. Let the rules slip, and no amount of talent keeps the place out of trouble.

The engineering principles for a frontier SDE are these house rules for the agent era. They don't teach the model to write code — that's its craft. They govern how *your system for shipping software with agents* runs: how work is handed off, where the rules live, how mistakes get undone, who signs off, what gets left to human judgment. This chapter hangs the rules on the wall. The later parts make each one real.

## Definition

The "engineering principles" here are an operating checklist for a frontier SDE: about twelve items, each the seed of a part later in the book. They aren't slogans. They're a basis for judgment — hand me any plan for "getting work done with agents" and I can walk these twelve and ask, item by item, "is this one covered?"

Here they are. Each follows the same shape: **one line on what it is, one line on why.**

**① No eval, no autonomy.** An eval is the agent's trial period — you give it real tasks with checks you can score, and watch whether it holds up. Without that acceptance step, the only signal you have to let go on is "looks done," and "looks done" is exactly where an agent will quietly fool you [A1][A10].

**② An issue is an executable spec, not a wishlist.** Write the task as if for someone who has never touched the codebase: a title that says where the work happens, an example of the intended implementation, and a clear definition of done [G3]. "Update the entire repo to async/await" is a wish; "update the auth middleware to async/await and add unit tests to verify" is a spec [G3]. The vaguer the spec, the faster the agent runs in the wrong direction.

**③ Repo instructions are a first-class engineering asset.** Files like AGENTS.md / CLAUDE.md belong in version control, go through review, and get pruned like code [A1]. They're read into context on every run, and how well they're written directly governs how much the agent edits outside its lane. This isn't documentation for show — it's a source file that shapes output.

**④ Context is a budget, not a dumpster.** The context window holds your whole conversation, every file read, every command run — but it fills fast, and the fuller it gets, the more the model "forgets" earlier instructions and the more mistakes it makes [A1]. So say what needs saying and stop stuffing in the rest. A giant instruction file where everything is "important" is no instruction at all — the agent drowns in it and starts guessing from whatever's nearby [O1].

**⑤ Tools are designed for the agent, not the API handed over raw.** A function written for humans and a tool written for an agent are different things. An agent has limited context and acts under uncertainty, so the tool should fold multi-step work together, trim its return down to the signal, and name things in language the agent recognizes [A8]. More tools isn't better — overlapping, vague tools just make it reach for the wrong knife [A8].

**⑥ Explore, then plan, then execute.** Let an agent jump straight to code and it tends to solve the wrong problem. The order is three phases: explore read-only first (read files, answer questions, change nothing), then produce a concrete implementation plan, and only then switch to execution and code against the plan [A1]. Keeping them separate is how you catch "wrong direction" before any code is written.

**⑦ Automation must be undoable.** Anywhere you let an agent change or run things on its own, decide first how you'd get back to a clean state — branch, snapshot, checkpoint, "undo that last step" [A1]. The hard lines GitHub draws for its cloud agent are exactly this: it can only push to its own branch, never to the trunk directly, and CI won't run without human approval [G2]. If you can't verify it, don't let it merge [A1].

**⑧ The sandbox is infrastructure, not an option.** An agent should work in an isolated room — a separate working directory, an isolated execution environment, throwaway dependencies and services — not against your real repo and real data [A1]. GitHub's agent runs in a "secure, ephemeral" environment [G2]; OpenAI made the app bootable per worktree, with logs and metrics scoped to that worktree and torn down when the task ends [O1]. Skimp on isolation and the first mistake lands on something real.

**⑨ More agents isn't better.** Running agents, worktrees, and agent teams in parallel can multiply output [A1], but "more" is not the goal. The same holds for tools — pile on too many and you scatter the agent's attention and it picks wrong [A8]. The number worth holding onto is OpenAI's: three engineers driving agents averaged about 3.5 merged PRs per engineer per day, and throughput kept rising as the team grew to seven [O1] — that came from the structure of the collaboration, not from headcount.

**⑩ The trace is the new code-review material.** Review used to mean reading a diff. Now it also means reading a trace — what the agent read, which commands it ran, in what order, where it failed [O5]. At its core an eval is just: a prompt → a captured run (trace + artifacts) → a small set of checks → a score you can compare across versions [O5]. Reading traces regularly is the only way you'll notice it was flailing the whole time [A10].

**⑪ Quantify infrastructure noise — don't blame the model for a flake.** A dependency that won't install, a flaky test, a starved container, a network hiccup — each can sink a run, and none of them means "the model got dumber." Anthropic measured it: on Terminal-Bench 2.0, resource configuration alone moved scores by 6 percentage points, enough to swamp the gap between top models, and under strict resource limits about 5.8% of tasks failed from infrastructure errors rather than the model [A11]. If you can't tell the environment's fault from the model's, every judgment you make is noise.

**⑫ Human judgment moves up.** People no longer sit mainly at the "typing code" layer. They move up — set priorities, translate user feedback into acceptance criteria, validate outcomes, and step in when judgment is required [O1]. Humans are good at understanding context, working through ambiguity, and reasoning across systems; agents are good at tireless execution, repetitive work, and trying many approaches at once — split the labor along that line [G3].

Once more, plainly: this is the **overview**. It's the table-of-contents skeleton for the whole book, and it doesn't unpack the details here. The sections below only hint at practice; the real treatment of each principle lives in the part that owns it.

## Why it matters

A good share of these twelve were sound engineering long before agents existed — reversibility, isolated environments, a clear bar for done, writing the rules down. So why list them again? Because agents **reprice** them.

When you wrote code by hand, one person's daily output was bounded, mistakes accrued slowly, and you had time to look back and fix things in passing. Not anymore. An agent edits many files, runs commands, opens PRs, and can keep going overnight [O1]. As generation speeds up, mistakes get copied just as fast — a vague goal, a missing acceptance check, a broken dependency all replicate into more files at the same speed. So constraints, verification, and an undo button go *up* in value, not down.

There's a second shift. A human newcomer reads the room — watches how colleagues work, gets pulled back from a mistake. An agent doesn't; it only reads what you give it explicitly [O1]. Any rule that lives only in the team's tacit knowledge effectively doesn't exist for the agent. So writing the rules down (③), turning a task into a spec (②), and stating context cleanly (④) — optional before — become hard constraints now. Skip them and the agent walks straight into the gap.

Finally, the agent era introduces a failure mode the old workflow didn't have: **infrastructure noise**. With hand-written code, "the environment glitched" and "I made a mistake" were usually easy to tell apart. An agent installs its own dependencies, runs tests, spawns subprocesses — the runtime becomes part of solving the problem, and the line between "model capability" and "environment behavior" blurs [A11]. That's why ⑪ gets its own line: you have to be able to quantify the noise, or you'll read one flake as the model getting dumber and go "fix" a problem that was never there.

## In practice

This chapter teaches none of the twelve in depth — that's the later parts' job. This section gives one use: **run the twelve as a checklist.**

Take any plan for "getting work done with agents" — your own, or one handed to you for review — and walk it:

- Is there an eval? (①) Is the task written as a spec? (②) Are the rules in version control? (③)
- Is context given where needed and not stuffed where it isn't? (④) Are the tools designed for the agent, or is the raw API handed over? (⑤)
- Does the flow explore before it executes? (⑥) Can a bad run be undone? (⑦) Does it run in an isolated environment? (⑧)
- Is the agent count driven by need, or by "more is faster"? (⑨) Is enough trace kept, and does anyone read it? (⑩)
- Is infrastructure noise quantified? (⑪) Has human judgment moved up to where it belongs? (⑫)

Any item you can't answer is a place you haven't designed yet, and it will bite. The point isn't "tick every box before you start." It's that for any box left unticked, you know why it's unticked and where the risk sits.

## Case

The most complete public sample of these house rules actually running is OpenAI's internal experiment.

A team driving agents started from an empty git repo and, over five months, reached on the order of a million lines of code across roughly 1,500 merged PRs — with **no manually written code** at any point. Application logic, tests, CI config, docs, internal tooling: all written by Codex [O1]. What made it work was, almost entirely, these twelve principles put into practice:

- They treat AGENTS.md as a "table of contents," not an encyclopedia (③④) — a roughly 100-line AGENTS.md injected into context, serving as a map that points to deeper sources of truth, precisely because "context is a scarce resource" and "when everything is important, nothing is" [O1].
- They built "explore before execute" and "plans are first-class artifacts" into the system: complex work is captured as an execution plan, with its decision log, checked into the repo [O1] (⑥).
- They made the app bootable per worktree, with logs and metrics scoped to that worktree and torn down when done — that's the sandbox as infrastructure (⑧), and it's what makes a prompt like "service startup must complete under 800ms" verifiable at all [O1].
- They moved the human role up explicitly: people prioritize, translate user feedback into acceptance criteria, validate outcomes, and step in only when judgment is required [O1] (⑫).
- And they're honest about the boundary: the whole thing leans heavily on this repo's specific structure and tooling and shouldn't be assumed to transfer without similar investment [O1].

A second angle is OpenAI's "agent improvement loop": traces show what happened, feedback explains what mattered, evals turn expectations into reusable checks, and Codex then produces concrete changes from all of it [O4]. That's ⑩ and ① working together — a trace isn't log garbage, it's the review material that drives the next round of improvement.

## Anti-patterns

- **Prompt worship.** Believing one sufficiently magic prompt can replace tests, permissions, isolation, and sign-off. The direction is reversed: put the prompt inside the house rules, not the rules inside the prompt.
- **Treating "tests passed" as acceptance.** An agent stops when the work looks done [A1] — with no check it can run, "looks right" is the only signal, and that's exactly where it fudges. Acceptance needs an executable bar, not a feeling.
- **Instructions written as prose.** A paragraph about how "we hold code quality in high regard" contains no rule the agent can act on. Give it actions, commands, no-go zones.
- **Blaming the model for a flake.** A run dies and you reach for "the model got worse," tweak the prompt, swap models — when the root cause was a dependency that wouldn't install or a starved container [A11]. Quantify infrastructure noise first, then talk about the model.
- **More for its own sake.** Spinning up a swarm of agents and piling on tools, assuming more means faster. Overlapping, vague tools make the agent pick wrong [A8]; "more" without a collaboration structure just manufactures chaos faster.
- **The human staying at the old layer.** The agent can open PRs now, yet the person stays glued to writing and reviewing line by line, never moving up to setting priorities and acceptance criteria — so the human becomes the bottleneck instead of the multiplier [O1].

## Checklist

- Can I walk these twelve and say, for each, whether this plan covers it? The ones I can't answer are the ones I haven't designed.
- Does my agent flow have an **executable acceptance check**, or do I let go on "looks right"? (①)
- Is the task I hand the agent closer to a **spec** or a **wishlist**? (②)
- Do my rules live **in version control**, or only in my head? (③)
- When things go wrong, do I have an **undo path**? Does the agent run in an **isolated environment**, or against the real repo? (⑦⑧)
- Last time a run failed, did I first separate **environment fault from model fault** before "fixing" anything? (⑪)

## Self-test

- Without looking back, how many of the twelve can you write from memory? The ones you can't are the ones you haven't yet internalized as principles — and the ones most likely to trip you.
- Is your current way of using agents closer to "hang the house rules first, then open," or "hire a good cook and just open the doors, deal with problems as they come"?
- The last time an agent's work disappointed you, was your first reflex "get a stronger model" or "which of these house rules did I fail to set"? The second reflex is the frontier SDE's.
