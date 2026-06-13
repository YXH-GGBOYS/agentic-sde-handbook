---
id: ch28
order: 28
part_zh: 第七卷 · Agentic 项目管理
part_en: Part VII · Agentic Project Management
title_zh: 从排人天到排 agent-ready work
title_en: From Person-Days to Agent-Ready Work
sources: [G3, A2]
---

For years, planning work meant counting heads and days: this many engineers for that many days, summed into a person-day budget. Headcount was the bottleneck, so the schedule was just headcount times time. Now you have a crew of capable contractors who work alarmingly fast, and you quickly notice the thing that actually holds up the schedule is no longer whether you have people. It is whether the work can be cut into pieces that can be handed off and checked back in, and whether the inspection bench has enough hands.

Some people assumed AI would make project management obsolete: if tasks can run themselves, what is left to plan? The opposite is true. When execution speeds up, a wrong goal, a vague scope, a loose acceptance check, and a broken dependency all speed up with it. Write a bad issue and the agent will implement it badly, very efficiently. The project manager's job did not disappear; its content changed. The job now is to make work **delegable, verifiable, schedulable, and recoverable**.

## Everyday analogy

Picture the same foreman.

His old way of planning was simple. This wall needs to go up: three masons, two days, log six person-days, fold it into the schedule. The whole ledger lived in his head as headcount times time.

Now a crew of contractors shows up — skilled, tireless, able to work a full day off a single drawing. His first reaction is delight, because the work can move fast. After a few rounds of planning, though, he has to rewrite the ledger. The question is no longer "do I have enough people?" It is these four:

- Which jobs **can be handed off**? Laying brick, tiling, painting, yes. Re-planning a load-bearing wall, or negotiating the budget with the owner, no.
- **Who inspects?** A contractor finishing is not the same as the job being right. Someone has to put a level against it and tap it. There are only so many inspectors, and when they jam up, the contractors' speed just piles up uninspected.
- **Is the inspection bench backed up?** Ten contractors start at once and the work floods toward the bench like a tide. Review bandwidth becomes the new bottleneck on the schedule.
- **What happens when something goes wrong?** A contractor chisels through a client's load-bearing wall, and you need an undo and a cleanup plan ready — not improvised after the damage is done.

The foreman's skill shifts from "can he add up person-days" to "can he break a building into a stack of work orders that can be handed off, checked back in, and backstopped when they go wrong." The bottleneck has moved.

## Definition

**Agent-ready work** is work groomed to a state where an agent can pick it up, finish it in a single run without circling back to ask for context, and where afterward someone can judge whether it was done correctly without re-reading all the code.

This is more than "write the task clearly." It has to meet six conditions:

1. **An observable outcome.** Not "optimize login," but "login endpoint P95 drops from 1.8s to under 500ms, verified with `make bench-login`." The outcome has to be visible and testable, not a feeling.
2. **Scoped to one run.** One agent run can finish it. Anything too big for one run gets an exploration issue first — to scout the ground and break it down — rather than dropping a boulder on the agent. GitHub's counterexample is blunt: don't write "Rewrite 3 million lines from Java to Golang"; split it into separate issues for modules like authentication or data validation [G3].
3. **Stated non-goals.** Mark what this run must **not** touch, so the agent doesn't run with the prompt and "improve" unrelated code on the way.
4. **Verification commands and expected evidence.** Which command counts as verified, what green looks like, what screenshot or log to attach.
5. **A risk level.** Low (docs, tests), medium (local code), high (architecture, permissions, data, deployment). Different levels call for different amounts of human involvement downstream.
6. **High risk defaults to plan approval plus human review**, not auto-run.

The first two decide whether the agent can start; the middle two decide whether it drifts and whether you can sign off; the last two decide who backstops a bad run. With all six in place, the work is agent-ready. Miss one and it's a landmine that reworks itself eventually.

None of this was invented from scratch. GitHub compresses its experience into an acronym, **WRAP**: Write effective issues, Refine your instructions, Atomic tasks, Pair with the coding agent [G3]. Anthropic, writing about long-running harnesses, gives the most concrete picture of what "observable outcome" and "verification evidence" look like — expanding a one-line request into a **feature list checked off one item at a time**, each item carrying an executable verification step [A2]. Both describe two halves of the same thing: how to write work an agent can catch, and how to make "done" something you can audit.

## Why it matters

Start with the illusion. AI did not make project management optional; it made project management need more specialization.

The logic is direct. Agents compress the "execution" stretch to almost nothing, so every defect upstream gets amplified and accelerated. Set the wrong goal and the agent implements the wrong goal, fast. Draw a fuzzy scope and it improvises in the fuzz. Keep acceptance loose and bad code sails green into main. Hand it a broken dependency and it builds, quickly and steadily, on bad ground. What used to be held back passively by humans being slow now has no such buffer. The cost of one badly written work order goes from "a few people waste an afternoon" to "half the repo paved over by morning."

So the bottleneck moved upstream. It is no longer typing speed; it is these four upstream things:

| Old bottleneck | New bottleneck | What it now means |
|---|---|---|
| Coding headcount | **Definition** | Turn a vague wish into a work order with an observable outcome and stated non-goals |
| Coding speed | **Verification** | Supply executable acceptance commands and expected evidence, not "looks right" |
| Integration coupling | **Integration** | Whether several agents' output merges cleanly without stepping on each other |
| Process compliance | **Governance** | Risk levels, approval gates, undo plans — who may auto-run, who must be approved |

There is one scheduling variable that is easy to forget: **review bandwidth**. Ten agents working at once produce output that floods toward the inspection bench. If only one person can review, that one person is the real ceiling on the schedule — agent speed is wasted because the work jams at the bench. The foreman learned this long ago: hiring a few more contractors is easy; you still only have a handful of inspectors. So when you schedule, runner capacity (CI throughput, context quality, tool availability) and review capacity (how many qualified eyes, how many PRs a day) have to be scheduled alongside the tasks — not the tasks alone, pretending inspection is free.

## In practice

Turning a backlog agent-ready is a set of concrete moves, not a slogan.

**Step one: run every issue through WRAP.** GitHub's advice is plain: write the issue as if you were writing for **someone brand new to the codebase** [G3]. That is the book's throughline — the agent is the capable contractor who doesn't know how your place runs. Concretely: titles that say where the work happens; the context a newcomer would need; an example of the desired implementation. GitHub's own before-and-after makes the point:

| Quality | Example |
|---|---|
| Poor | "Update the entire repository to use async/await" [G3] |
| Better | "Update the authentication middleware to use the newer async/await pattern... Add unit tests for verification" [G3] |

The poor one fails twice: the scope is the whole repo (not atomic), and it never says what counts as verified. The better one pins the scope to one module, the authentication middleware, and asks for verification on the way (add unit tests).

**Step two: send big tasks through an exploration issue first.** When something is genuinely too big for one run, don't force it. Dispatch a read-only scouting task first: let the agent map the current state, list the change points, and break the boulder into a stack of atomic issues. GitHub's atomic principle is one line: rather than a monster "Rewrite 3 million lines from Java to Golang," create separate issues for modules like authentication or data validation [G3].

**Step three: make the definition of done a checklist that gets ticked off item by item.** This is the most worth-stealing move in Anthropic's harness. They had an initializer agent expand a one-line request ("build a clone of claude.ai") into a feature list — for that example, over 200 end-to-end features, each specific to a user action, such as "a user can open a new chat, type in a query, press enter, and see an AI response" [A2]. Every item started marked failing; later coding agents could only flip a verified one to passing, and were forbidden to delete or edit the tests themselves [A2]. One implementation detail is worth keeping: they ended up storing the list as JSON rather than Markdown, because the model is less likely to inappropriately change a JSON file [A2].

This checklist kills the two most common pileups. One: the agent tries to swallow the whole app at once, runs out of context mid-build, and leaves a half-done feature for the next session [A2]. Two: a later agent looks around, sees that progress has been made, and declares the job done [A2]. With a per-feature checklist, "is it done?" stops being the agent's self-assessment and becomes a ledger an outsider can check.

**Step four: mark risk, set the human decision points.** Follow the risk levels from the six conditions: low risk (docs, tests) can be handed to the agent to auto-run; medium risk (touching local code) gets human review; high risk (architecture, permissions, data, deployment) defaults to plan approval first, then human review, never straight to auto-run. This step is GitHub's **Pair** made concrete — humans and agents split the work: humans handle understanding context, resolving ambiguity, cross-system thinking, and strategic decisions; the agent handles tireless execution, repetitive tasks, and exploring multiple approaches [G3]. Mark the decision points on the issue and the agent knows where to stop and wait for a person.

**Step five: schedule both capacities together.** When a task goes into a sprint, log two numbers next to it: runner capacity (can CI keep up, is the context good enough, are the needed tools available) and review capacity (how many qualified eyes this week, how many PRs a day). When review bandwidth runs short, hand off less work — don't let PRs ferment in front of the bench.

## Case

**A one-line request, expanded into a 200-plus feature checklist.** Anthropic ran Opus 4.5 in a loop on the Claude Agent SDK to build a clone of claude.ai. Given only a high-level prompt, it could not produce a production-quality app [A2] — and the failures were textbook: either it tried to swallow the whole app and ran out of context, or it decided partway through that it was "close enough" and stopped [A2]. The fix was not a stronger model; it was grooming the request into agent-ready shape. First an initializer agent expanded the one line into 200-plus end-to-end features with steps, all marked failing. Then each coding agent worked on **only the highest-priority feature not yet done**, flipped it to passing, wrote progress notes, and made a git commit — leaving the environment in a clean state fit to merge to main: no major bugs, orderly code, documented [A2].

Notice there is no magic prompt here. Observable outcome (every feature is a runnable user action), atomicity (one feature at a time), guarding against over-reach (no deleting or editing tests), verification evidence (passing only after end-to-end testing) — the whole A2 approach is one full demonstration of the six agent-ready conditions above. Groom work to that level and an agent can hold a long task across many context windows.

**Anthropic's own four-failure table.** They turned the recurring failure modes of long tasks into a table [A2], and every row maps to a grooming move in your backlog:

| Failure mode | Grooming move (mapped to agent-ready) |
|---|---|
| Declares the whole project done too early | Prepare a feature list; each round, pick one not-yet-done feature [A2] |
| Leaves the environment buggy and undocumented | Open by reading progress notes and git log, run a basic test; close by writing a commit plus a progress update [A2] |
| Marks features done without proper testing | Self-verify each feature; only mark passing after careful testing [A2] |
| Spends ages figuring out how to run the app | Write an `init.sh` to start the dev server; read it first each round [A2] |

The table reads like a set of diagnostic codes: symptom on the left, the antidote you should have buried in the grooming on the right.

## Anti-patterns

- **Treating a wish as a work order.** "Optimize performance," "make login look nicer" — no observable outcome, so the agent guesses what you want and guesses wrong. Rewrite it into an outcome with a number and a verification command.
- **Dropping a boulder on the agent.** Handing off "rewrite the entire repo" as-is [G3]. Run an exploration issue first to break it into atomic tasks, or the agent will run out of context and leave a half-done job [A2].
- **Writing only the to-dos, not the non-goals.** With no off-limits zones, the agent improvises in the gaps and "improves" a pile of things you never asked it to touch. Non-goals matter as much as the to-dos.
- **Acceptance by "looks right."** With no executable acceptance command and expected evidence, "done" degrades into the agent's self-assessment — and self-assessment, declaring victory early, is exactly what it is best at [A2].
- **Scheduling tasks but not review.** Pretending inspection takes no time. Ten agents flood one reviewer and the PRs jam at the bench — review bandwidth is the real ceiling.
- **Auto-running high risk.** Merging architecture, permission, data, or deployment changes without plan approval or human review. Letting low risk run is fine; doing this with high risk breaks something eventually.

## Checklist

- Does this issue have an **observable outcome** (visible, testable — not "optimize")?
- Can it finish in **one agent run**? If not, is there an exploration issue to break it down first?
- Are the **non-goals** stated (what not to touch this run)?
- Are **verification commands and expected evidence** given (what to run, what green looks like, what to attach)?
- Is the **risk level** marked (low = docs/tests, medium = local code, high = architecture/permissions/data/deployment)?
- For high risk, does it default to **plan approval plus human review**, or did it slip into auto-run?
- When scheduling, are **runner capacity and review capacity** scheduled together, or is inspection treated as free?

## Self-test

- Take the top issue in your backlog and run it through the six conditions: can it be handed off right now? Which condition is missing?
- If your agent crew grew to ten today, what becomes this week's bottleneck — no work to hand off, or no one to inspect? Your answer measures how far this backlog still is from agent-ready.
