---
id: ch31
order: 31
part_zh: 第八卷 · 学习路径与 Capstone
part_en: Part VIII · Learning Path & Capstone
title_zh: Capstone：为真实 repo 设计 agentic SDE harness
title_en: Capstone: Design an Agentic SDE Harness for a Real Repo
sources: []
---

A capstone isn't another concept quiz. The previous thirty chapters covered how to write an AGENTS.md, what the nine harness layers are, what evals and traces each do — and being able to recite all that doesn't mean you can use it. The only proof you can use it is to run the whole thing once, on a real repository: write the fridge note, pick out the work you can actually delegate, set up the workstation and the door access, let an agent do a few real runs, then write down, one by one, every place it broke.

So this chapter has no new concepts. It's a build sheet: six steps that bolt the book's parts onto a repo of your choosing, in order. Get them on, get a run through, and be able to explain where it still doesn't run — that's the point where you've actually learned this. This is a synthesis chapter; it introduces no new facts, and every example below is an illustration to make a method concrete, not a reference to any real number.

## Everyday analogy

Picture yourself moving from "calling in a temp now and then" to "running a crew of contractors." On the day you make that jump, you don't go interview someone pricier. You fix up the site first.

The first thing you do is write the house rules on the fridge note: where the materials go, which wall is load-bearing and off-limits, how to hand the job back when it's done. The second thing is to sort through your backlog — which jobs are "swap a lightbulb" and can be handed off freely, which are "touch the gas line" and need an experienced hand in the room. The third thing is to set up the workstation: an isolated room to work in (don't let the new hire practice on the client's load-bearing wall), a labeled tool wall, door access (touching the expensive machine means calling you over to press the button), an inspection bench, a camera running the whole time. Only the fourth thing is to actually send three jobs in as a trial: one the new hire builds from scratch, one where he adds a check an older job skipped, one where he inspects someone else's work. The fifth thing is to save all of it — the footage, what changed, whether it passed inspection, why it broke — and file it into a single sheet of "where this crew most often trips." Last, you sit down and write a short wrap-up: which jobs are good to delegate, which you'll always keep for yourself, how to make the workstation smoother next time.

That whole sequence — note, sort, set up, trial, file, wrap up — is what this chapter asks you to do. Notice that no step is "swap in a smarter agent." This is where the book's through-line lands: you aren't taming a model, you're designing an environment where someone who makes mistakes can still ship.

## Definition

A **capstone** is one end-to-end harness design and verification: pick a real repo, actually build out the book's engineering assets and each harness layer on it, get at least three agent runs through, and file the results as artifacts you can review later. The output isn't a slick demo. It's something another person can take over, audit, and improve.

It's six steps, each mapping to a part or a chapter you've already read:

| Step | What you do | Book part / chapter it draws on |
|---|---|---|
| ① Instructions & docs | Write AGENTS.md / CLAUDE.md / README / runbook for the real repo | Part III · The New Engineering Assets |
| ② Sort the work | Pick 10 real tasks, grade them by risk, write them as agent-ready issues | Part II · Requirements, repriced; Part VI · agent-ready issues |
| ③ Build the harness | Set permissions, tools, sandbox, trace, eval, handoff artifacts | Part IV · Harness Engineering |
| ④ Do the runs | At least three: one implementation, one test backfill, one review | Part V · Agents Engineering; Part VI · agents in practice |
| ⑤ File it | Save traces, diffs, verification results, failure reasons; build a failure taxonomy | Part VII · new metrics & failure taxonomy |
| ⑥ Write the report | What's good to delegate, what isn't, how to change the harness next round | Part IV · maturity model; Part VII · governance |

Pin down a distinction that's easy to blur: a capstone is **not** "ship a feature with an agent." Shipping a feature only proves that this one agent run went right. A capstone has to prove that the environment you built produces acceptable results repeatedly — and that when the agent gets it wrong, you can find it, trace it, and clean up. The first is a single dish; the second is a kitchen that puts out dishes reliably. That's the same distinction the book opened with in chapter one.

## Why it matters

Running the whole book once tracks a real shift: in the agent era, the bottleneck in engineering moves from "can I write this code" to "can I design, constrain, and verify a delivery system." The first is now largely something you can hand off; the second isn't. The capstone is the end of the book because it tests exactly the part you can't hand off.

There's a deep gap between reading and doing, and that gap is wider now than it used to be. Many harness failures live not inside any single layer but in the seams between layers. You nod along reading "grade permissions" and "isolate the sandbox" — but only by actually building it and actually letting an agent run inside do you discover that the off-limits zone you thought you'd fenced got read anyway through a side door, or that the test you thought was your inspector was quietly written to flatter the agent's own implementation. Problems in the seams don't show up on the page; you only find them by running it.

There's a plainer reason too. The earlier chapters handed you separate parts — instruction files, context, tools, sandbox, eval, trace. Each part is clear enough on its own; the hard part is bolting them together so the thing still turns. Assembly is a skill in itself, and a new core skill at that. The difference between someone who can walk these six steps through on a real repo and someone who can only recite their definitions isn't how much they know — it's judgment: which layer can be thin on this repo, which has to be thick, which task shouldn't be delegated at all. That judgment only grows out of one real assembly.

## In practice

Here are the six steps expanded into a build order. Each gives the smallest version that works — what one person can do in a few days, not what a team needs half a year to stand up.

**① Pick a repo, write the instructions and docs.** The selection criteria are practical: you know it well enough (you can tell whether the agent changed things correctly), it has runnable tests (otherwise there's no inspector), and the risk is bounded (don't use the production payments system as a practice yard). A mid-sized internal tool or open-source project you know, with tests, is ideal. Then write four documents, the Part III way:

- **AGENTS.md / CLAUDE.md**: project shape, commands, definition of done, safety boundaries (the off-limits zones), review expectations. Written as actions and commands, not prose.
- **README**: the human-facing overview, so whoever takes over knows what this is and how to start it.
- **runbook**: how to start the service, how to run the full test suite, how to triage common failures — this doubles as context for the agent and a handoff for the next person.

How to check this step: hand the documents to someone who knows nothing about the project. Can they get the tests passing and know what not to touch, working from the docs alone? If they can't, neither can the agent.

**② Pick 10 tasks, grade them by risk, write them as agent-ready issues.** Pull from the repo's real backlog. Don't cherry-pick easy ones to make the deliverable look good. Grade into three tiers and triage them the way a hospital intake desk does:

| Risk tier | Traits (illustrative) | Handling |
|---|---|---|
| Low | Local, reversible, covered by tests: add docs, a helper function, a copy fix | Let the agent work fairly autonomously |
| Mid | Spans a few files, changes a public interface, touches tests | Agent does it, but a human reviews every step; no auto-merge |
| High | Touches migrations, auth, secrets, billing, concurrency | Default to not delegating, or only let the agent draft a plan a human implements |

Fill in each issue the Part VI way: background, verifiable acceptance criteria, the verification commands to run, the range of files it may change, non-goals, known risks. A vague "fix login" and an issue that spells out "repro steps + expected behavior + verification command + don't touch session storage" produce agent output two orders of magnitude apart in quality.

**③ Design the harness.** Map Part IV's nine layers onto this repo, answering for each only "what's the smallest version on this repo":

- **Permissions**: which actions the agent does on its own (read, edit non-restricted files, run tests), which need your nod (reaching the network to install a new dependency, changing CI, writing a migration). Put the off-limits zones in the tool and permission layer, not just in the prompt — security by prompt is an anti-pattern.
- **Tools**: give it the project's own test, lint, and typecheck commands, clearly named, with clear error semantics. Don't make it improvise commands.
- **Sandbox**: run each run in a separate git worktree or container, not against your main working copy. This is the isolated room; a wreck in there can't reach production.
- **Eval**: which tests must be green, which acceptance criterion must hold, written as an executable check rather than "looks right."
- **Trace**: make sure you can get the full record of the run — what it read, which commands it ran, what the diff was, which step failed.
- **Handoff artifacts**: agree on what a run leaves behind (plan, status, decisions, verification record, handoff note) so you or the next person can take over.

**④ Do at least three agent runs.** The three should cover three different kinds of work, because they test different layers of the harness:

- **One implementation**: from issue to PR, testing the whole chain of context, tools, sandbox, eval.
- **One test backfill**: add boundary cases to existing code that's under-tested, testing eval design and resistance to flattering the implementation.
- **One review**: have one agent review the diff a previous run produced, testing how trace works as review material and whether the evaluator should be independent.

Record each run end to end. Don't save only the final PR.

**⑤ File it, build the failure taxonomy.** Save the traces, diffs, verification results, and failure reasons from all three runs, then sort the failures by the Part VII taxonomy. Even if all three "succeeded," note the small deviations along the way — they're the holes the next round of harness has to plug:

| Failure class | What it looks like (illustrative) | Which layer to fix |
|---|---|---|
| spec | The agent did something, but not what you wanted — the issue was underspecified | ② issue / ① instructions |
| context | It didn't read the key file, or got pulled off by irrelevant material | ③ context |
| tool | Misformed a command, misread tool output, took environment noise for success | ④ tools |
| model | It genuinely reasoned wrong or missed a boundary | swap model / split the task |
| infra | Dependency won't install, flaky test, environment drifts from production | ⑥ sandbox |
| permission | It got around an off-limits zone, read what it shouldn't, touched what it shouldn't | ⑤ permissions |
| review | An error slipped past acceptance, or it signed off on its own work | ⑧ review |

**⑥ Write the closing report.** Short, but it has to answer three things: on this repo, **what work is good to hand to an agent** (argued from the actual results of the three runs, not from a feeling), **what work isn't** (which classes of task you tried or judged not to delegate), and **how to change the harness next round** (the failure taxonomy points straight at the layers to thicken). This report is the real output of your capstone. What it proves isn't "agents can do work" — it's "you can design the environment that lets agents do work."

## Case

Here's an illustrative capstone walked through, to put the six steps on the ground. The setting is an internal CLI tool repo — a Python command-line tool that converts CSV reports into a few formats, with a pytest suite, maintained by one person, bounded risk. This is a made-up example to make the method concrete; the numbers are illustrative.

**① Docs.** The author writes an AGENTS.md. The commands section lists `make test`, `make lint`, `make typecheck`. The off-limits section says "don't change `parsers/legacy/` (external users depend on its behavior), don't touch `release.sh`, no network installs by default." The DoD section says "new behavior must have pytest coverage; test real behavior, don't flatter the implementation." The runbook adds "run a sample conversion locally" and "if tests are flaky, regenerate the CSV fixtures first."

**② Sort the work.** Ten items get pulled from the backlog. The triage comes out roughly: 6 low-risk (fix `--help` copy, add a date format, backfill unit tests for three parsers, ...), 3 mid-risk (refactor the output layer, add a new CLI subcommand, change a public return structure), 1 high-risk (change one behavior in `parsers/legacy/`). The high-risk one is marked "not for the agent — let it draft a plan only."

**③ Harness.** Each run executes in a separate directory opened with `git worktree`; the agent freely runs tests and lint, but installing a new dependency, changing CI, or touching an off-limits file needs a human nod. Each run leaves a `HANDOFF.md` at the worktree root (what it did, which verifications it ran, where it's unsure).

**④ Three runs.** The implementation run takes the mid-risk "add a subcommand" task; the test backfill takes "backfill unit tests for three parsers"; the review run has a second agent review the diff from the implementation run.

**⑤ Failure taxonomy (illustrative).** Two of the three pass first try, one hits a snag. Filed, the sheet reads:

| Run | Result | Failure class | One line |
|---|---|---|---|
| Implementation · add subcommand | First-try pass | — | Detailed issue, clear verification command, clean worktree isolation |
| Test backfill | One rework | spec | The issue didn't say "boundary cases must include empty and oversized files"; the first pass only covered normal input |
| Review | Caught a real bug | tool | The reviewed run had dismissed a lint warning as irrelevant noise — it was actually a broken type annotation |

The rework's lesson flows straight back: the AGENTS.md DoD gains a line — "test backfills must cover three boundary classes: empty input, oversized input, malformed input." That's the trace → lesson → rule loop, and a live example of the ninth harness layer feeding lessons back into the earlier ones.

**⑥ Report (excerpt).** "Good to delegate: tasks with a clear verification command, local scope, and a test safety net (this round, the 6 low-risk items and some mid-risk ones went well). Not good: changes like `parsers/legacy/` where behavior is the contract and there's no explicit spec — the agent can't reverse-engineer from the code which boundary behavior external users depend on; a human has to set that. Harness changes next round: ① add a mandatory 'boundary case list' field to the issue template; ② make lint warnings a required eval check, instead of letting the agent decide which is noise."

The report is short, but it uses the whole book: chapter one's "the artifact changed," chapter six's "vague requirements cost more," chapter nine's "don't flatter the implementation," chapter nineteen's "trace as review material," Part VII's "failure taxonomy" — all of it landed on the ground.

## Anti-patterns

- **Cherry-picking easy tasks to look done.** Ten "copy fix"-level jobs, all green, a glossy report. You're fooling yourself — you never hit the mid- and high-risk tasks, so you never tested the risks the harness is actually there to catch. The ten tasks must span all three tiers.
- **Treating a green run as success.** All three runs land their PR, so you declare graduation. But you saved no traces, filed no failures, wrote no report — all you've proven is "those three got lucky," not "the environment is repeatable." The output of a capstone is the reviewable artifacts, not three green PRs.
- **Cramming every constraint into the prompt.** Off-limits zones, permissions, acceptance criteria all piled into the agent's prompt, with the tool layer and sandbox left blank. Leaning on the prompt for all of it looks fine in a demo; the day an agent routes around it and reads a secret, you learn that was never a boundary.
- **No failure, no notes.** All three succeed, so you skip step five. But "success" almost always hides small deviations — it took a detour, it nearly touched an off-limits file, its test didn't actually test the point. If you don't file these into a taxonomy, the next round of harness has nothing to improve on.
- **A report that praises but doesn't judge.** It comes out as "the agent is strong, very efficient." What it should answer is "what's not worth delegating, which layer to change next round." Without those two, the report has no engineering value.

## Checklist

- The repo I picked — do I **know it well enough**, does it have **runnable tests**, is the risk **bounded**?
- Are the four documents (AGENTS.md, README, runbook, plus CLAUDE.md if you use Claude) in place? Can a stranger get a run through, working from them?
- Do the 10 tasks **span low / mid / high risk**, or are they all easy?
- Does each issue have **verifiable acceptance criteria + verification commands + an allowed range + off-limits zones**?
- Are the six harness pieces (permissions / tools / sandbox / trace / eval / handoff artifacts) **landed on this repo**, or still abstract?
- Are the off-limits zones and permissions **in the tool/sandbox layer**, or only in the prompt?
- Do the three runs **cover implementation / test backfill / review**?
- Did you save the **traces, diffs, verification results, and failure reasons** from all three?
- Does each line in the failure taxonomy **point at a specific harness layer to change**?
- Does the closing report answer all three: **what's good to delegate / what isn't / how to change next round**?

## Self-test

This chapter's self-test is also the book's. Three questions, answered honestly against the harness you just built:

- If the agent became unavailable today — the service is down, the quota's spent, it got blocked — could your system still give users a **decent fallback**? Or does every delivery freeze with nobody able to pick it up?
- If the agent answered wrong or broke something, do you **know how to find it, trace it, and improve**? Do you have an eval that stops it when it errs, a trace that lets you replay which step broke, a way to write that lesson back into the rules?
- If someone takes over this repo six months from now, can they understand how the system runs, what the agent did inside it, which work was the agent's and why — **from the docs, code, and traces alone**?

The cleaner your answers, the more mature your harness. The one you can't answer is where you build next round — which is also the last tool this book wants to leave you with. Not a specific technique, but the habit of **improving the environment against these three questions, over and over.**
