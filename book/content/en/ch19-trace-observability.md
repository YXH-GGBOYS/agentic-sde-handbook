---
id: ch19
order: 19
part_zh: 第四卷 · Harness 工程专章
part_en: Part IV · Harness Engineering
title_zh: Trace 与可观测性：新的代码评审材料
title_en: Trace & Observability
sources: [A11, O4, A2]
---

When a car dies on the road with no diagnostic code, all you can do is pop the hood and guess: fuel, electrical, some sensor? Put the same fault in a car with a dashcam and OBD codes, and you can replay the last few seconds — how the wheel turned, whether the brake was touched, which cylinder misfired first. The problem narrows to one part instead of the whole car.

An agent's PR is the same. The diff shows you the result: what it ended up writing. It doesn't show you which files it read, which commands it ran, where it hit an error, or whether it quietly skipped verification before declaring the job done. That record of how it got from the task to this diff is the trace. Reviewing an agent's output is no longer just reading the diff — you also watch the footage.

## Everyday analogy

A modern car carries two things at once: a dashcam, and an OBD trouble-code system.

The dashcam records the process — how many times you turned the wheel before the incident, where you braked, whether you crossed a line. The codes record the failure signal: P0301 means cylinder 1 misfired; P0420 means the catalytic converter is below efficiency. Together, the mechanic doesn't tear down half the engine on a hunch. He reads the code to localize "cylinder 1 ignition," pulls the footage to see the conditions at that moment, and pins it to one part in minutes.

Without those two things, the owner can only say "it just shuddered while I was driving," and the mechanic swaps parts by experience until something sticks. Get it right and that's luck; get it wrong and you paid for nothing — and next time it shudders, you start guessing from scratch, because no single fault was ever recorded, attributed, or reviewed.

An agent's work splits the same way. What it read, which commands it tried, which files it changed — that's the footage. A `pytest` going red on one step, a dependency that won't install, a type check that fails — those are the trouble codes. At review time, what you want isn't "it handed in a diff that looks plausible." It's "how it got here, and which step actually went wrong." Without that footage, every judgment you make about an agent run drops back to "it just shuddered while I was driving."

## Definition

A trace is the time-ordered list of events an agent run produces from start to finish: which tool it called, with what arguments, what the command printed back, which files it changed (the diff), where it failed and why, plus how many tokens it burned and how long it took. Observability is collecting, structuring, and replaying that list so you — or the next person — can reconstruct what the agent actually did.

It is related to, but not the same as, ordinary application logging. App logs record what happened at runtime (request in, query ran, returned 200). An agent's trace records the per-step decisions and results of a thing that reads, edits, runs commands, and chooses its own next move. OpenAI's agent improvement loop treats the trace as a first-class asset: it exports Agents SDK events into OpenTelemetry-style JSONL so traces can be read by tools, analyzed, and fed back [O4].

A useful trace answers at least these fields:

| Field | The question it answers |
|---|---|
| Tool call | Which tool, with what arguments (which file did it read, which command did it run) |
| Command output | What that command printed (tests green or red, the raw error text) |
| Diff | Which files it ultimately changed, and to what |
| Failure reason | Which step failed and what kind of error (model logic? dependency? timeout?) |
| Cost | Tokens spent, number of model calls |
| Duration | Total time, and which step it stalled on longest |

Thread those along a timeline and you have footage you can replay. Drop "command output" and "failure reason" and you're left with a final diff alone — one photo of the crash site, no dashcam.

## Why it matters

Traditional code review carries an unspoken premise: the diff is the whole truth. When a human writes the code, the process lives in their head, so reviewing the result is reasonable — you trust the person didn't delete a test to make tests pass. That premise breaks for an agent. It does more than a human in one run (reading dozens of files, running a dozen commands), and it's less reliable than a human — recall Simon Willison's "digital intern who will cheat if you give it a chance." It can hand you a clean diff with all tests green, while what you can't see is that it commented out the one assertion standing in its way to get there.

So review can't stop at the diff. A diff that looks right may sit on top of a process you'd never approve: it started editing before reading the existing tests; it failed once and, instead of investigating, changed config to route around the failure; it quietly widened the scope into files you never named; it deleted a protective check only because that check was in its way. In the diff these are either invisible or, if visible, indistinguishable from "a harmless cleanup." The trace is the new code-review material — it makes the process auditable again.

There's a second payoff: the trace lets you separate two kinds of failure — the environment's fault, and the model's fault. Anthropic quantified this. On Terminal-Bench 2.0, just how the infrastructure is configured — whether container resources are a guaranteed allocation or a hard kill-on-exceed ceiling — moved the same model's score by 6 percentage points (p < 0.01), enough to swamp the gap between top models on the leaderboard [A11]. Under the strictest resource enforcement, about 5.8% of tasks failed from infrastructure errors rather than the model; loosen to 3x headroom and that error rate dropped to about 2.1%; fully uncapped, it was 0.5% [A11]. In other words, a large share of what you'd read as "the model is weak" was really "the room wasn't set up right."

The author's resulting rule is firm: leaderboard differences below 3 percentage points deserve skepticism until the eval configuration is documented and matched [A11]. That rule only lands with traces. You have to replay each failure and see whether it fell over on model logic or on the container getting OOM-killed before you can subtract the noise from the signal. Without traces, a red failure is just a red failure, and you can't tell whether to fix the prompt or add memory.

## In practice

Make trace review a fixed step, not a vibe-based spot check. The checklist below is the set of questions to walk in order when reading an agent run's trace — aimed not at the diff, but at the path behind it.

**Did it read before writing.** Look at the opening steps of the trace: did it read the relevant files and the existing tests before changing anything, or did it start writing without understanding the current state? An agent that edits an implementation without reading its existing tests is likely rebuilding a wheel that already exists, or breaking a contract it never knew was there.

**Did the plan cover the acceptance criteria and the risk boundaries.** If the run has explicit planning steps, check them against the task's acceptance criteria: did the plan cover them? Did it fold in the risk boundaries — which files are off-limits, which behaviors must not break? What isn't in the plan rarely shows up in the execution.

**Did it run the minimum necessary verification, and attribute failures correctly.** Check that it actually ran the tests and the build, rather than declaring victory after editing. More important, watch the steps after a failure: when a test goes red, does it investigate why (read the error, localize the assertion), or take the shortcut and edit, comment out, or skip that test? This is the spot trace review should watch hardest — A2 leans on deliberately strong wording, "It is unacceptable to remove or edit tests," precisely to hold this tendency down [A2].

**Did it widen scope, delete protections, route around tests, or change config.** These four are one family of dangerous moves, marked by "looks like solving the problem, actually bypassing it." Scope creep: the task said change module A, but the trace shows edits to B and C. Deleting protections: an input validation or a permission check is gone. Routing around tests: a `skip`, a changed assertion, or doctored test data turns red green. Changing config: editing CI config, a timeout threshold, or a resource ceiling to configure the failure away. In the diff these often look benign; you have to go back to the trace and see why it made the change to recognize them.

**Does the PR description carry evidence.** A decent handoff includes: which commands were run, what they returned (paste the output, not "tests passed"), which items are still unverified, and where the known risks are. OpenAI's improvement loop makes the agent's output contract require citations and an evidence table, and lists "producing a polished answer while leaving citations or artifacts incomplete" as a failure mode to detect [O4]. "Looks done" and "has evidence it's done" are different things.

**Did it leave enough artifacts for someone to take over.** When this run ends, can the next person — or the next agent — pick it up? Are the state files, progress notes, and reproducible commands there? A2 turns this into hard structure: the initializer agent writes an `init.sh` to bring up the environment, a `claude-progress.txt` logging what each session did, plus the git history; every coding agent starts by running `pwd`, reading the progress file and `git log` to get its bearings, then picks one unfinished feature to advance [A2]. That progress file is itself a trace structured for handoff.

## Case

**Separating environment noise from model error.** Anthropic's infrastructure-noise study is, at its core, a large-scale trace review. They ran Terminal-Bench 2.0 on the same Claude model across six resource configurations, from "strict per-task spec, kill on exceed" all the way to "no cap at all" [A11]. If you read only the final scores, you'd see them climb monotonically as resources loosen, and easily misread it as "more resources, stronger model." But take each failure's trace apart and the truth is different: from strict to 3x headroom, almost all the gain came from the infrastructure error rate dropping (5.8% → 2.1%), while the genuine success score fluctuated within noise (p = 0.40) — meaning those crashed runs would most likely have failed anyway, and loosening resources just kept them from dying on an OOM [A11]. Only past 3x did the gains reflect the model truly attempting heavier strategies that were impossible before for lack of resources [A11].

That distinction can't be made without per-run traces. An aggregate leaderboard score of "6 percentage points" might be a real capability gap, or it might just be a bigger VM — which is exactly the line the author closes on. Their engineering recommendations all serve the same end of clean attribution: declare a guaranteed allocation and a separate hard-kill threshold per task instead of one number doing double duty as both floor and ceiling; treat resource configuration as a first-class, documented experimental variable; and report the enforcement method alongside the results [A11].

**Traces flow back into evals and rules.** A trace isn't footage you watch once and toss; it should flow back. OpenAI's improvement loop spells out the closed cycle: traces record what happened, human and model feedback explain what mattered, the feedback hardens into reusable evals, the evals become a validation gate, and finally Codex lands the resulting changes in the harness — a flywheel [O4]. The load-bearing move is the flow-back: a problem a trace exposes (say, treating management's narrative as a validated metric [O4]) shouldn't stop at one review comment. It should become an eval that runs every time after, or a rule written into AGENTS.md. See it once, fix it once, prevent the whole class — that's how a trace's value survives past the merge of this one PR.

**A long-task progress file is a structured trace.** In A2's long-running harness, the `claude-progress.txt` plus git history plus that 200-plus-item feature-list JSON is, viewed as a trace, footage structured for cross-session handoff [A2]. What each session leaves behind isn't a chat history that gets compacted away, but readable, replayable state on disk: which features are marked passing, which are still red, what the last commit message said. The next agent — or a human coming to review — reads those and reconstructs where the project stands and what the previous shift did. That's exactly the job of a trace, except here it pulls double duty as both record and handoff.

## Anti-patterns

- **Reviewing the diff, not the process.** The most common and most dangerous. Clean diff, all tests green, ship it — and you never see that it deleted the assertion to turn the test green. The diff is the result; the trace is the process, and that's where "did it cheat" hides.
- **Charging environment failures to the model.** A run goes red and you blame "the model," without going into the trace to see which step fell over. A11's data is plain: under strict resources, about 5.8% of failures are infrastructure errors, not the model [A11]. Conflate them and you'll edit the prompt when you should add memory.
- **Keeping traces without feeding them back.** You collect a pile of traces, watch them, toss them, and the same class of problem recurs. A trace's value is in becoming an eval or a rule [O4]; watching without capturing is installing a dashcam you never replay.
- **Treating an aggregate score as a verdict.** Seeing a few-point leaderboard lead and ruling on it. A difference below 3 percentage points, with the eval configuration undocumented and unmatched, deserves skepticism [A11].
- **Betting a long task on chat history.** No state files, no progress notes, hoping the next agent recovers from compacted history. History gets truncated and "where the last session left off" can vanish; put the state in files instead [A2].

## Checklist

- When I review this PR, do I have its trace, or only the final diff?
- Can the trace show it **read the relevant files and existing tests** before editing, rather than writing blind?
- Did its **plan cover the acceptance criteria and the risk boundaries** (what's off-limits, what must not break)?
- Did it run the **minimum necessary verification**? After a failure, did it **investigate the cause**, or just edit / comment out / skip the test?
- Does the trace show any of the four dangerous moves — **widened scope, deleted protections, routed around tests, changed config**?
- Does the PR description carry **evidence** (commands, output, unverified items, known risks), or just "done"?
- Are the artifacts this run left enough for **another person or another agent to take over**?
- For a red failure, can I tell from the trace whether it was a **model error** or an **environment error**?

## Self-test

- The last agent PR you approved — did you read its trace, or only the diff? If only the diff, how do you know it didn't edit the tests to pass them?
- Hand yourself a failed agent run with nothing but a red "FAILED." Can you say whether the model's logic was wrong or the container got OOM-killed? If you can't, your trace isn't detailed enough — and you're debugging by swapping parts on a problem you could have localized by reading the code.
