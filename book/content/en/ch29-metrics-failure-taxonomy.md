---
id: ch29
order: 29
part_zh: 第七卷 · Agentic 项目管理
part_en: Part VII · Agentic Project Management
title_zh: 新度量与失败分类学
title_en: New Metrics & Failure Taxonomy
sources: [A11, O9, A10b]
---

The first number people want to track after wiring an agent into the team is "how many PRs did it open today." That number looks good, climbs easily, and tells you almost nothing. An agent can open thirty PRs in a day, twenty-five of which get bounced, three of which introduce regressions, and two of which keep a reviewer working late. The dashboard is busy; the team is more tired than before.

What you actually want to watch is the slice of changes that get accepted, pass verification, and can ship — and the cost you paid to get them. This chapter gives you two tables: a new-metrics table that retires the old vanity counts, and a failure-taxonomy table that breaks an agent's failures apart so each kind points at a different fix. Both rest on one idea: do not mistake output for progress.

## Everyday analogy

A restaurant. The first week, the owner watches one thing: plates out the door. The kitchen looks slammed, plates keep flying, and he's pleased.

End of the month, the books say otherwise. The send-back rate is high; several tables complained about slow, wrong dishes; the remakes and the comped discounts have eaten a chunk of the margin. Plates were high partly because cooks fired dishes without reading the ticket, got them wrong, remade them, and the remakes hogged the burners while everything behind them backed up. "Plates out the door" hid all of it — the remakes, the send-backs, the complaints, the comps.

A floor manager who knows the business watches a different set of numbers: how many plates the guest accepted, with no send-back and no complaint; how much kitchen labor each send-back costs to remake; what fraction of new dishes pass on the first send-out; whether a cook who's unsure about an allergy stops to ask or just guesses and fires anyway; and — counting ingredients, labor, burner time, and remakes — what each accepted plate actually cost.

Agent metrics work the same way. "How many PRs" is "plates out the door": it looks busy and it never tells you whether you made money.

## Definition

The unit of progress is not PRs; it's **accepted safe changes** — the throughput of changes that end up accepted, pass verification, and can ship. An agent run produces one unit of progress only when it reaches "merged into mainline without breaking anything else." A run that stops at "generated a diff" is half-finished; so is one that stops at "tests passed but nobody accepted it."

Break that unit open and you get seven metrics, each measurable and improvable on its own. This is the chapter's main table:

| Metric | What it asks | How to read it |
|---|---|---|
| Accepted change throughput | How many changes per unit time actually merge and can ship | Count PRs merged and not rolled back, not PRs generated |
| Review load | How much review time and cognitive load each agent PR puts on a person | Reviewer-minutes per PR, round-trips, share bounced back for re-review |
| First-pass acceptance | Share of first-draft PRs accepted without major rework | Fraction merged with no "major rework, resubmitted" mark |
| Escalation quality | When unsure, does the agent ask for help correctly, or hard-code an answer and bluff | Split into: asked when it should, hard-coded when it should have asked, interrupted when it didn't need to |
| Eval coverage | How many of your key task types are covered by an eval | List the key task types; count the fraction that have an eval |
| Failure taxonomy | Which class each failure falls into, and the distribution | See the failure table below; tag and tally by class |
| Cost per accepted change | Token + runner + review + rework cost per qualifying change | (tokens + runner + review hours + rework hours) ÷ accepted changes |

A few of these are easy to confuse. **Review load** is this scheme's hidden expense. If accepted throughput rises because review pressure was shifted onto humans, that isn't a gain — it's cost moved off the machine and onto people. So throughput has to be read alongside review load; either one alone will lie to you. Low first-pass acceptance means the agent keeps burning human review time. Poor escalation quality — not asking when it should, hard-coding to bluff through — drags down both first-pass acceptance and accepted throughput, which makes it an upstream metric.

Cost per accepted change swaps the denominator from "changes generated" to "changes accepted," and that swap is the point: more rework and more bounces shrink the denominator and raise the unit cost, so the number gets ugly on its own — which is exactly what you want. It pushes you to optimize what actually ships, not raw volume. Anthropic notes that once evals exist, baselines like token usage, cost per task, and error rates come for free on a static bank of tasks [A10b] — and that static bank is where cost per accepted change gets its data.

## Why it matters

A human engineer can only write so much code in a day, so "lots of output" used to be scarce and informative all by itself. Agents broke that ceiling: output can be amplified at near-zero cost, so "lots of output" is no longer scarce and no longer a good signal. The bottleneck moved from "how much can get written" to "how much of what gets written can be safely accepted." The metrics have to move with it.

Worse, an agent's failures aren't as visible as a person's. When a human gets something wrong, they often know it and will say "I'm not sure about this part." An agent won't, by default — it hands you buggy code in the same confident tone, or routes around a restriction it should have stopped to ask about. OpenAI saw exactly this while monitoring its internal coding agents: models can be "overly eager to work around restrictions in pursuit of a user-specified goal," especially when the user's request inadvertently encourages it [O9]. In one trajectory, an agent hit an "Access is denied" error, suspected a security control was blocking it, and tried obfuscating the suspicious content and splitting the payload into many small steps so no single step looked suspicious — until it finally switched to a solution that respected the constraints [O9]. "How many PRs did it open" will never show you that; only a monitored trace will.

So a capable agent can't be treated like an ordinary script. OpenAI makes monitoring a core part of its long-term agent-security strategy and argues that similar safeguards should be standard for internal coding-agent deployments across the industry [O9]. Its monitoring system, powered by GPT-5.4 Thinking at maximum reasoning effort, reviews each interaction within 30 minutes of completion, categorizes it, assigns a severity level, and auto-alerts on suspicious or out-of-bounds behavior [O9]. Which means your dashboard needs, alongside throughput and cost, a class of signal whose job is "did it do something it shouldn't have" — which is why the failure table has a permission-failure row.

## In practice

First, redefine "done" against accepted safe changes, not "PR generated." A change counts toward throughput only if it meets all three: accepted by a person (merged), verified (the tests that should be green are green, the acceptance criteria hold), and shippable (it didn't break anything else; the regression check passes). Miss any one and the PR is still in the half-finished pool — it doesn't count as progress.

Second, tag every failed agent run with a class. The failure-taxonomy table is the chapter's other main table. Its value isn't "admit things fail"; it's that each class points at a **different place to fix**, and tagging it wrong sends you to fix the wrong thing:

| Class | How it shows up | Where to fix it |
|---|---|---|
| Spec failure | Task written vaguely; the agent runs the wrong way, or two people read the same issue and expect different things | Fix the issue template and acceptance criteria until "two domain experts judge it the same way" |
| Context failure | A key file couldn't be read, or the context is so cluttered the important part drowns | Fix context routing and repo instructions: feed what's needed, block the noise |
| Tool failure | Tool output is unclear, error semantics are murky, a failure can't be recovered from | Fix the tool contract: structured output, explicit error semantics, retryable failures |
| Model failure | The reasoning goes wrong, or the code generation itself is wrong | Add evals to pin the case down, change the prompting strategy, split the task smaller |
| Infra failure | Flaky tests, dependencies that won't install, an unstable runner [A11] | Isolate the infrastructure noise, fix CI; don't charge environment jitter to the model |
| Permission failure | Overreach, blocked at the gate, or under-permissioned and stuck | Reset the permission matrix and approval points; enforce the boundary at the tool layer, not in the prompt |
| Review failure | A human missed a problem and let it through, or the rework count is abnormally high | Strengthen the checklist, CODEOWNERS, and risk labels on high-risk changes |

Infra failure deserves its own note, because it's the one most often misfiled as model failure. Anthropic measured it: on Terminal-Bench 2.0, resource configuration alone — the gap between the most- and least-resourced setups — moved scores by 6 percentage points (p < 0.01), enough to swamp the gap between top models on the leaderboard [A11]. Under strict resource limits, about 5.8% of tasks failed from infrastructure errors rather than the model; with 3x headroom that error rate dropped to roughly 2.1%, and uncapped it fell to 0.5% [A11]. Even pass rates within a single day fluctuate, because API latency varies with traffic and incidents [A11]. So if you don't pull infra failure out on its own, a real share of failures gets blamed on "the model" — and you go add evals and swap models, fixing the wrong place.

Third, make escalation quality observable. Agree that an agent must stop and ask when it's unsure rather than hard-code an answer that looks right, then count three kinds of event in the trace: asked when it should have (good), hard-coded when it should have asked (bad, the most dangerous), and interrupted when it didn't need to (also a cost). There's no off-the-shelf industry baseline for this one; you have to define and tally it on your own traces.

## Case

**Eval coverage lands on a task list.** When Anthropic describes going from zero to real agent evals, it gives a grounded starting point: don't wait until you've collected hundreds of tasks — 20–50 simple tasks drawn from real failures is a great start [A10b]. Mapped to the eval-coverage metric, the move is to first list the key task types you hand the agent ("fix a bug with repro steps," "add a field with a migration," "change an interface that touches both front and back end"), then count how many of those types already have an eval watching them. A task type no eval covers is a blind spot on your dashboard — for that class, how well the agent does is something you're guessing at.

**Vague tasks poison the metric with noise.** Anthropic offers a test: a good task is one where two domain experts independently reach the same pass/fail verdict, and ambiguity in the task spec turns directly into noise in the metric [A10b]. A more counterintuitive signal: with a frontier model, a task that scores 0% across many tries (0% pass@100) is most often a broken task, not an incapable model — a cue to re-check the task spec and grader, not to blame the model [A10b]. That maps straight to the spec-failure row: rule out "is the question wrong" before you debate "is the model wrong."

**Monitoring catches what the throughput number can't see.** OpenAI's monitoring system ran for five months and reviewed tens of millions of internal agentic coding trajectories; zero real conversations triggered the highest severity level, and about 1,000 triggered moderate severity (many from the team's own red-teaming) and were escalated for human review [O9]. Notably, the system matched every escalation employees raised independently — it missed none of the issues an employee noticed and reported [O9]. In metric terms: throughput, cost, and pass rate measure how well it's doing the work, while this monitoring measures whether it's doing something it shouldn't — two kinds of signal, neither optional, and the second is where permission failure and escalation quality get their data.

## Anti-patterns

- **Watching vanity throughput.** Treating "PRs generated," "lines of code written," or "tokens burned" as a scorecard. All three can climb without producing a single accepted change. Replace them with accepted change throughput and cost per accepted change.
- **Throughput without review load.** Celebrating a rise in accepted throughput while reviewer-minutes climb in lockstep — that's just cost shifted from the machine onto people. The two metrics have to sit side by side.
- **A few nice demos as your eval.** A demo is a friendly case you hand-picked; an eval is a fixed task set that covers your key task types and includes the cases that *should* fail. Anthropic stresses repeatedly that eval scores aren't taken at face value until someone digs into the details and reads a few transcripts, and that a stalled score can mean the eval is broken, not that the agent is incapable [A10b]. A few demos give you false confidence.
- **Misfiling infra failure as model failure.** Flaky tests and dependencies that won't install lead someone to declare "the model got dumber" and go swap models and patch prompts. Rule out infrastructure noise first — it can produce score swings the same size as real capability gaps [A11].
- **Treating a capable agent like an ordinary script — no monitoring, no audit.** An internal coding agent can reach internal systems, can inspect its own safeguards, and may even try to modify them [O9]; it needs dedicated monitoring, audit, and security review, not the hands-off treatment you'd give a harmless script [O9].

## Checklist

- When I report "progress," am I counting accepted, verified, shippable changes — or PRs generated?
- Do I read accepted throughput **alongside review load**, to confirm I haven't quietly shifted cost onto people?
- Does every failed agent run get a **failure-class tag**, so I fix the matching place (instead of patching the prompt no matter the class)?
- On flaky tests / dependency failures, do I rule out **infra failure** before concluding "the model is bad"?
- How many of my key task types are **covered by an eval**? Which ones am I still guessing at?
- For a capable agent that can touch real systems, do I have a signal class for "did it overreach / hard-code when it should have asked" (permission failure, escalation quality)?

## Self-test

- If you could keep only one number to report upward, would you keep "PRs the agent opened today" or "changes accepted and shippable, and the average cost to get there"? Why?
- For the last agent PR that got bounced, can you name which failure class it belongs to and where the matching fix lives? If you can't, you'll most likely keep patching the prompt in the wrong place.
