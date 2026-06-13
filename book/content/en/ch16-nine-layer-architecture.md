---
id: ch16
order: 16
part_zh: 第四卷 · Harness 工程专章
part_en: Part IV · Harness Engineering
title_zh: Harness 的 9 层参考架构
title_en: The 9-Layer Harness Reference Architecture
sources: [O1, A2, A3, A5, A6, A10, A11, G1, G8]
---

The last chapter described a harness as "the whole work environment you build for a new contractor." This chapter cuts that environment into nine layers, each one there to stop a different class of risk — whether the task gets in at all, who breaks it down, what material is in front of the agent, which tools it can touch, which actions need a sign-off, which room it works in, what counts as done, who accepts the result, and how you replay and improve after the fact.

The nine layers are not any one product's implementation, and they don't bind you to a vendor. They're a checklist: run your current way of using agents past all nine, and wherever a layer is missing, you've found where risk leaks out. Each layer gets two tiers — a "minimum viable" version one person can stand up over a weekend, and a "mature" version a team grows into over time. Running all nine at full strength is for the few high-risk cases that need it; for most tasks, getting the first few layers solid is enough.

## Everyday analogy

Picture taking a part from blueprint to shipped, on a full shop-floor line.

Work arrives at the **intake desk**: not every order gets taken. First someone checks that the blueprint is complete, the tolerances are marked, and it's a part this shop can actually make — anything unfit goes straight back. Once accepted, the **process planners** break it into operations: how many steps, the acceptance check for each, which machines it touches, written up as a work order. Then **staging**: the drawings, stock, and the previous shift's handoff notes get laid out within arm's reach of the station, so the machinist isn't hunting across the floor. The **tool wall** holds the few tools this operation needs, labeled, so he doesn't grab the wrong jig from the next station over. The floor has **door access**: routine steps he does himself, but touching the expensive machine, or writing data into the finished-goods store, means calling the lead over to badge in. The actual cutting happens in an **isolated bay** — a room physically separated from the finished line, where a wrecked part can't reach the customer's goods. Done parts go to **inspection**: calipers, a test rig; nothing passes that gate until it passes. Overhead, a **camera** records the whole thing — who ran which machine at what time, which step alarmed. Finally the **floor manager signs off** — and by shop rule, the person who placed this order can't sign it off themselves. When a batch defect shows up, you pull the footage and the retained samples, trace it back to which step, which machine, which parameter went wrong, and write that lesson into the process card so the intake desk catches it next time.

Intake desk, process planners, staging, tool wall, door access, isolated bay, inspection, sign-off, camera plus post-mortem — drop any one and risk leaks. No door access, and the new hire writes straight into the finished-goods store. No inspection, and scrap ships to the customer. No camera, and after an incident nobody can say which step broke. The nine layers of a harness are this line, ported onto a coding agent.

## Definition

The **9-layer harness reference architecture** cuts a single agent run, from "take the work" to "hand it back," into nine ordered boundaries, each owning a class of risk. They line up roughly in the time order of a run:

| Layer | Name | Owns | Job in one line |
|---|---|---|---|
| ① | Intake | which tasks get in | triage, score risk, reject the unfit |
| ② | Planning | who decomposes, into what | produce a plan; pin acceptance criteria and file scope |
| ③ | Context | what material is in front of it | stage it, order it, fence out the irrelevant |
| ④ | Tools | which tools it can use | hand it sharp, well-labeled tools |
| ⑤ | Permissions | which actions need approval | tier by risk; set approval points |
| ⑥ | Sandbox | which room it works in | isolation; a wrecked run can't reach prod |
| ⑦ | Evals | what counts as done | executable done-criteria |
| ⑧ | Review | who accepts the result | human + reviewer agent + separation of duties |
| ⑨ | Trace + Learning | how to track and improve | record, post-mortem, feed lessons back upstream |

Each layer has two tiers, minimum-viable versus mature. Minimum-viable is what you can stand up over a weekend and what covers most low-risk tasks; mature is what you need under high throughput and high stakes.

These nine aren't invented from nothing. They're several vendors' own ways of slicing a harness, aligned onto one table. OpenAI defines the harness as the layer of "verification, feedback, recovery, tools, context, and human judgment" around the agent [O1] — which maps onto ③④⑦⑨ plus the human approval points. Anthropic, writing about long-running harnesses, lists the parts as an initializer, state files, artifacts, an evaluator, checkpoints, and human-intervention and recovery paths [A2][A3] — which land on ②③⑦⑨. Different words, same machine.

One thing to hold onto: **these nine are boundaries, not an org chart.** You don't need a person or a service per layer. In a small project, ③④⑤⑥ might be nothing more than "run inside a git worktree, confirm before writing files, use the project's own test command." The layers exist so you can check whether each class of risk has an owner — not so you can pile up architecture.

## Why it matters

There are three reasons to spread the constraints across nine layers and keep them outside the model, and all three cut against the grain of "the model is getting stronger."

First, **most failures aren't in the model; they're at the seams between layers.** Anthropic measured it: on Terminal-Bench 2.0, infrastructure configuration alone moved scores by 6 percentage points — enough to swamp the gap between top models on the leaderboard [A11]. Under the strictest resource limits, about 5.8% of tasks failed from infrastructure errors rather than the model; lift the cap entirely and that drops to 0.5% [A11]. None of those failures means "the model wasn't smart enough" — dependencies won't install, memory gets hard-killed, a subprocess won't spawn. They happen in ⑥ sandbox configuration and ⑦ eval environments, and they have to be isolated and attributed there, or you can't even tell whether the model failed or the environment did. As A11 puts it plainly: a few-point lead might be real capability, or it might just be a bigger VM.

Second, **the faster you run, the more the seams are worth.** OpenAI's team — three engineers driving Codex — opened and merged roughly 1,500 pull requests, an average of 3.5 per engineer per day; throughput actually rose as the team grew to seven [O1]. At that speed, a vague goal or a missing acceptance check gets copied into more files far faster than in the hand-written era. Their answer wasn't "make the model more careful" — it was turning architectural constraints, naming conventions, and file-size limits into lints, so that once encoded, they apply everywhere at once [O1]. Constraints have to become machine-checkable gates to keep pace with throughput.

Third, **layers expire, so you have to be able to remove them.** One line from Anthropic's harness-design piece is worth pinning to the wall: every component in a harness encodes an assumption about what the model can't do on its own, and those assumptions are worth stress-testing, because they may be wrong and they go stale as models improve [A3]. They did exactly that after Opus 4.6 shipped — they dropped the context resets they'd added to treat "context anxiety," because the newer model no longer got anxious [A3]. More layers isn't better. The right boundaries have owners; the stale scaffolding gets torn out.

## In practice

Walk the nine in order. For each, ask only two questions: what's the minimum-viable version, and where does mature go.

**① Intake.** Minimum viable: one shared issue template that forces the requester to spell out what to do, what counts as done, and which files not to touch. Mature: triage on top of the template — score by task type and risk, force high-risk work (touching a migration, auth, secrets) through human review, auto-reject the plainly unfit (no repro steps, unbounded scope). One hard boundary you can copy straight from GitHub: only users with write access to the repo can trigger the agent, and comments from users without write access never reach the agent's context at all [G8].

**② Planning.** Minimum viable: make the agent produce a plan and have a human look at it before it touches code — don't let it read the issue and start editing files. Mature: plans become first-class artifacts, checked into the repo with progress and decision logs [O1], each item traceable to an acceptance criterion and a file scope. In Anthropic's three-agent setup, a planner expands a one-line prompt into a full product spec but pins only the deliverables, not the implementation — because granular technical details, fixed too early and gotten wrong, cascade errors downstream [A3].

**③ Context.** Minimum viable: an AGENTS.md plus the few files relevant to this task. Mature: retrieval, summarization, state files, a context budget — the previous chapter covered this in depth. One point belongs here from the nine-layer view: don't write AGENTS.md as an encyclopedia; write it as a table of contents. OpenAI treats it as exactly that, around 100 lines, pointing into a `docs/` directory that holds the deeper sources of truth — so the agent starts from a small stable entry point and is taught where to look next, instead of being buried up front [O1].

**④ Tools.** Minimum viable: file read/write plus a few test commands. Mature: turn CI, logs, tickets, feature flags, and dry-run deploys into tools the agent can call directly, and reach outside capabilities over MCP [G1]. A counterintuitive move that works: write the remediation instructions into the lint error messages themselves, injecting the fix right into the agent's context [O1]. How sharp the tools are decides whether the agent can close the loop on its own work.

**⑤ Permissions.** Minimum viable: confirm before writing files. Mature: tier by risk. Claude Code's auto mode gives a model you can copy outright — Tier 1 is safe read-only operations and the user's allowlist, passed through; Tier 2 is in-project file edits, waved through because version control makes them auditable; Tier 3 is shell commands, external services, and file operations outside the project, all routed to a classifier [A5]. The principle underneath is strict: everything the agent chooses on its own is unauthorized until the user says otherwise [A5]. And the axis isn't only risk — path, command, network, and secrets can each be a basis for a tier.

**⑥ Sandbox.** Minimum viable: a separate git worktree, so multiple instances don't overwrite each other in the same directory. Mature: container / VM / isolated network / no production secrets / a destroy-on-exit environment. Anthropic states the ordering as one principle: design for containment at the environment layer first, then steer behavior at the model layer [A6] — supervising what the agent *can* do is more reliable than supervising what it *did*. In product, they match three strengths to three settings: claude.ai runs code in ephemeral gVisor containers; Claude Code uses OS-level sandboxing on the developer's machine (Seatbelt on macOS, bubblewrap on Linux), with a default posture of "reads allowed, writes allowed inside the workspace, network denied by default"; Cowork, aimed at non-technical users, runs a sealed VM [A6]. And one rule for choosing: don't over-trust isolation you hand-rolled — "the weakest layer is the one you built yourself" [A6].

**⑦ Evals.** Minimum viable: run tests and lint. Mature: task-level evals plus a regression set plus security checks plus an AI judge paired with a human rubric. Anthropic splits acceptance into three grader types, each with a tradeoff: code-based graders (fast, objective, reproducible), model-based graders (flexible, scoring, able to read natural-language assertions), and human graders (the gold standard but expensive, used to calibrate the model-based ones) [A10]. Start with 20–50 realistic tasks, and convert the cases you've tested by hand and the failures users reported into benchmarks [A10]. Here's an agent-specific trap: the eval environment itself has to be cleanly isolated, or the 6-percentage-point infrastructure noise from ⑥ bleeds into the score and you read environment jitter as a model regression [A11].

**⑧ Review.** Minimum viable: a human reviews the PR. Mature: agent self-review plus a dedicated reviewer agent plus code owners plus risk gates. GitHub's hard boundaries for its cloud agent are a ready-made template: the agent can't run `git push` directly and can only push to its own branch; draft PRs must be reviewed by a human, and the agent can't mark its own PR "ready for review," nor approve or merge it; the person who requested the task can't approve the agent's PR (separation of duties) [G8]. OpenAI pushes further — almost all review is handled agent-to-agent, with Codex reviewing its own changes locally, requesting further agent reviews, and iterating until every reviewer agent is satisfied, escalating to a human only when judgment is required [O1].

**⑨ Trace + Learning.** Minimum viable: save the failure cases. Mature: keep the loop turning — review comments become rules, failure samples enter the eval set, templates keep iterating. OpenAI feeds human taste back continuously: review comments, refactoring PRs, and production bugs are captured as documentation updates or encoded directly into tooling, and when documentation falls short, the rule gets promoted into code [O1]. The trace layer has to record enough fields to support a post-mortem — GitHub's agent signs its commits, marks the requester as co-author, leaves session logs and audit events, and puts a link to the session log right in each commit message [G8].

Write down each layer's answer and you have a harness spec. Here's a skeleton.

## Case

**Artifact: a harness spec skeleton.** Land the nine answers as a file you can review and version, like this:

```markdown
# Harness Spec: <task family, e.g. "bugfix-web">

## ① Intake
accept:     [bug repro is clear, scope ≤ N files, has acceptance criteria]
reject:     [no repro steps, touches migration/auth/secret unflagged, unbounded scope]
risk_tiers: low=auto | medium=human-review plan | high=human-review plan + human-review PR
trigger:    only write-access users can trigger          # from G8

## ② Planning
agent_roles:
  - planner:   one-line prompt -> product spec, pins deliverables not implementation  # A3
  - generator: works one feature at a time against the spec
  - evaluator: independent acceptance, persona kept separate from generator           # A3
plan_artifact: plans/<id>.md, with progress + decision logs, checked in              # O1
must_link:   every task item -> acceptance criterion + file scope

## ③ Context
sources:    [AGENTS.md (table of contents, ~100 lines), relevant files, progress file, git log]  # O1/A2
state_file: claude-progress.txt + feature_list.json (passes field)   # A2
budget:     retrieve on demand, do not preload the whole repo

## ④ Tools
read_write:  [file read/write, grep/head/tail]
exec:        [test command, lint, dev server via init.sh]            # A2
integrations:[CI, log queries, tickets, feature flags, dry-run deploy] # G1
mcp:         [mounted on demand, list only the tools this task needs]

## ⑤ Permissions matrix              # three-tier model from A5
tier_1_auto:    [file reads, code navigation, allowlisted read-only commands]
tier_2_auto:    [in-project file edits]          # auditable via version control
tier_3_gate:    [shell commands, external services, file ops outside the project]
principle:      everything the agent chooses on its own is unauthorized until the user says otherwise  # A5

## ⑥ Sandbox
isolation:  separate git worktree -> container/VM                    # A6
network:    denied by default, egress via allowlist                  # A6/G8
secrets:    no production secrets mounted
teardown:   destroy on exit
principle:  contain at the environment layer first, steer at the model layer  # A6

## ⑦ Eval gates
gates:      [unit tests green, lint passes, task-level eval, regression set, security scan]
graders:    code-based + model-based + human-rubric calibration       # A10
seed_set:   20-50 realistic tasks, incl. cases converted from past failures  # A10
env:        eval environment cleanly isolated, infra noise fenced off  # A11

## ⑧ Human approval points (Review)
self_review:   agent reviews its own work locally first              # O1
agent_review:  dedicated reviewer agent, loop until it passes        # O1
human_gate:    high-risk tasks get a human PR review
hard_rules:    [no direct git push, pushes only to its own branch,
                requester cannot approve its own PR, workflows need approval before running]  # G8

## ⑨ Trace + Learning
trace_fields:  [which files read, which commands run, per-step results,
                session_log link, signed commits, co-author]          # G8
recovery:      git revert + progress file + checkpoint                # A2
feedback_loop: review comment -> rule; failure sample -> eval;
               templates keep iterating                               # O1

## Cost & failure
cost_budget:   per-run token/wall-clock cap (e.g. full harness ~$200/6hr vs solo ~$9/20min)  # A3
failure_taxonomy: [model error | environment error (infra) | missing context | acceptance gap]  # A11 separates the first two
```

You don't fill all nine for every family. For a low-risk task family, get ③④⑥⑦ solid and let the rest be a line each; only families that touch production, money, or secrets earn a fully written-out permissions matrix and approval points.

**What a long-running harness's recovery artifact looks like.** Anthropic had an agent clone claude.ai: the initializer agent first writes a feature list of over 200 items, each marked "failing" to start, stored as JSON (in practice the model edits JSON more conservatively than Markdown — it's less likely to delete things) [A2]. Alongside it sit an `init.sh` to bring the environment up, a `claude-progress.txt` logging what each session did, and the git history [A2]. Each new session begins by running `pwd`, reading the progress file and git log to get its bearings, then picks an unfinished feature, and on completion flips that item to passing and commits to git [A2]. That bundle is the recovery artifact of layer ⑨ — it carries "where the last shift left off" in files, not in a chat history that's long since been compacted away.

**How the permission layer lands in a product.** Claude Code's auto mode implements ⑤ as a classifier: before each action runs, it passes a fast single-token filter (yes to block, no to allow), and only the ones flagged get a second, reasoning pass [A5]. That classifier sees only the user messages and the agent's tool calls — the agent's own text and the tool outputs are deliberately stripped, so the agent can't talk the classifier into a bad decision, and the main prompt-injection vector is closed off [A5]. When blocked, the agent gets a "find a safer alternative" result rather than a hard stop; the session ends only after three consecutive or twenty total denials [A5].

## Anti-patterns

- **Treating the nine layers as an org chart.** A microservice, an agent, and a yaml file per layer, and the small project is crushed by its own harness. The layers are a checklist, not a deployment diagram — they just need an owner per class of risk, and ③④⑤ can be a few lines of convention.
- **Building only the first few layers, then going autonomous.** Context and tools done beautifully, ⑤⑥⑦⑧ skipped entirely — the agent can write files, run commands, and open PRs, with no isolation, no acceptance gate, and nobody to sign off. This is the previous chapter's "no eval, no autonomy," in nine-layer form.
- **An un-isolated eval environment, read as a model regression.** Same model, jitter the resource config, and the score moves by 6 percentage points [A11]. Run evals in an environment that isn't cleanly isolated and you'll read "the cluster was busy today" as "the model got worse," then go fix something that was never broken.
- **Approval points written in the prompt, not the permission layer.** "Remember not to push to main" in the system prompt is taping a speed limit to the dashboard instead of fitting a speed governor. The real boundary is in ⑤⑥ — GitHub's "the agent can't run `git push` at all" is enforced at the tool layer, not a polite line in a prompt [G8].
- **Never removing a layer.** Scaffolding added for an old model stays untouched when a new one arrives. Anthropic dropped context resets after Opus 4.6 because that assumption had expired [A3]. Revisit a harness on a cadence and tear out the scaffolding that's no longer load-bearing.
- **The requester approving their own PR.** Lose separation of duties in ⑧ and autonomy becomes a monologue. GitHub makes "the requester can't approve their own PR" a hard rule precisely to hold the "required reviews" line [G8].

## Checklist

- Can I write each layer's answer for this task as a spec — or are there layers nobody has ever thought about?
- ① Are unfit tasks **stopped at the door** by a template or triage, or taken as-is?
- ② Does the agent **produce a plan and wait for a human**, or read the issue and start editing files? Does the plan trace to acceptance criteria and a file scope?
- ⑤ Are approval points enforced in the **permission/tool layer** (hard), or only asked for in the prompt (soft)?
- ⑥ Does it run in an **isolated environment**, or against the real repo with production secrets mounted? Is egress allowlisted or wide open?
- ⑦ Is "done" an **executable criterion**? Is the eval environment cleanly isolated, or is infrastructure noise mixed into the score?
- ⑧ Who signs off? **Can the requester approve** the PR from their own run?
- ⑨ Do failure cases **feed back upstream** (into evals, into rules, into the template), or get saved and forgotten?
- Am I piling the nine layers into an org chart? Which layers are really just a few lines of convention? Which piece of scaffolding has expired and should come out?

## Self-test

- Take your most recent real agent run and ask, layer by layer, "who owns this one." Which layer do you stall on first? That's where you're leaking the most risk right now.
- If you wiped this run's chat history right now and kept only the trace and recovery artifact you saved to files, could the next person — or the next agent — pick it up? If not, your ⑨ still lives somewhere that disappears.
- For some task family, is the permissions matrix you wrote actually tiered by risk / path / command, or is it a flat "approve everything" or "allow everything"? The first is a harness; the other two are an exhausting grind and a time bomb, respectively.
