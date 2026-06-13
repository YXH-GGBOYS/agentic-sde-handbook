---
id: ch27
order: 27
part_zh: 第六卷 · 三大 coding agent 实战对比
part_en: Part VI · Claude Code / Codex / Copilot in Practice
title_zh: Review、rollback 与 Claude Code 的工程精神
title_en: Review, Rollback & the Claude Code Ethos
sources: [G1, A1, S8]
---

The moment an agent hands work back, the most dangerous thought is "tests are green, merge it." Green tests only prove it didn't break the things it happened to think of. Whether it actually understood the request, whether the change stayed in scope, whether the commands it claims to have run were really run — none of that is what the test suite checks.

This chapter covers three things, the same three you do when a contractor says the job is done: how you accept the work (read the diff, read the trace, read the evidence — not just the diff), how you keep an exit (who can approve a PR, who can't, how you put things back if it goes wrong), and how the three tools in this part line up — different shapes, the same engineering instincts.

## Everyday analogy

When the contractor says "finished," you don't pull out the final payment on the spot. A sound process runs like this.

You don't inspect your own work. You bring in someone with no stake in the build — ideally not the person who signed the contract, so it isn't a case of handing in the job and signing off on it yourself. The inspector doesn't just check whether the walls are flat (that's the diff). They go through the build records: was the plumbing pressure-tested, what did the gauge read, was every circuit checked for continuity (that's the trace and the evidence). The final payment always sits behind a passed inspection, not behind materials arriving on site. And most important, the contract keeps one path open: a refund and a way to restore the place to how it was before work started — because if a load-bearing wall got chiseled into, you need something to fall back on.

An agent's work is the same. Inspection has to be independent — let a separate, clean context review it, not the agent that wrote the code grading its own paper. The final payment (the merge, the deploy) sits behind that inspection. And you always keep one path open to roll back and put the code back the way it was. Review, gates, rollback — you need all three.

## Definition

**Review** is someone independently checking an agent's deliverable and deciding whether it can merge and ship. For AI-generated changes, review has three layers, and skipping any one means you haven't really reviewed:

- **The diff** — which files changed, which lines were added. The visible product.
- **The trace** — what the agent read along the way, what it tried, where it failed, why it made each choice. The build record. GitHub's coding agent writes its reasoning and validation steps into the session logs, so you can trace its decisions and spot problems [G1].
- **The evidence** — when it claims "tests pass," did it show the test output, the command it ran, and what came back? Anthropic's advice is to have the agent **show evidence rather than asserting success** — paste the test output, the command, the screenshot. Reviewing evidence is faster than re-running the check yourself [A1].

**Rollback** is the ability to put the system back to its pre-change state after something goes wrong. It comes in two layers: session-level undo (Claude Code's `/rewind` and checkpoints, which restore conversation and code to any earlier point) and engineering-level reversal (git revert, branch protection, never letting the agent push straight to the main branch). One boundary to keep straight: Claude Code's checkpoints only track changes made *by Claude*, not external processes, and the docs say plainly that this is not a replacement for git [A1]. Session undo is scratch paper. Engineering reversal is the actual refund policy.

**A gate** is a human checkpoint that merge and deploy must pass through: who can approve, who can't, which actions require a person to say yes. It turns "independent inspection" from a verbal agreement into a hard process constraint.

## Why it matters

When humans write code, review and rollback matter too, but there's a built-in buffer. People write slowly — a handful of PRs a day, and reviewers keep up. When someone is out of their depth, they tend to mutter "I'm not sure about this part" on their own.

An agent strips out both buffers. It writes fast — by one account, an engineer running five Claude instances at once, each on its own checkout, ships 20–30 PRs a day (secondary; see the next section). Once the volume climbs, "reviewers keep up" stops being automatic, and the pull toward sloppy acceptance gets stronger. And the agent doesn't second-guess itself: where it doesn't understand, it writes on with the same even confidence, the trace reads as if every step were reasoned, and the result can drift for whole sections.

Subtler is the **blind spot of grading your own paper**. Ask the agent that wrote the code to review the code it just wrote, and it will favor it — the same way a person resists overturning a judgment they just made. Anthropic's fix is structural: run the reviewer in a fresh subagent context that sees only the diff and the criteria you give it, not the reasoning that produced the code, so it judges the result on its own terms instead of nodding along with the original line of thought [A1]. That is the agent-world version of "the inspector can't be the person who did the job."

Rollback follows the same logic. The faster generation gets, the faster a mistake gets copied into more files — which makes a path back to the pre-change state worth more, not less.

## In practice

### A PR review checklist for AI-generated changes

Reading the diff is only the first layer. A full review goes through each item below — anything you can't answer, or can only answer with a wince, is a reason not to merge:

```text
[ ] Requirement understanding
    Did the agent actually grasp the problem the issue asks for, rather than
    solve an adjacent, easier problem?

[ ] Scope of change
    Does every touched file trace back to the issue? Did it "helpfully" change
    things outside scope?

[ ] Test quality
    Do the new tests check real behavior, or do they pander to the
    implementation (freezing the current output as the "expected" value)?
    Delete the implementation — can you reconstruct the requirement from the
    tests alone?

[ ] Risk surface
    Does it touch security / permission checks / data migration / concurrency /
    destructive commands / backward compatibility? These are high-risk zones,
    reviewed by a human line by line, never auto-merged.

[ ] Verification evidence
    Did the agent actually run the verification commands? Is the output pasted?
    Is the evidence credible, or is it just a bare "tests pass"?

[ ] Failures and unverified items
    Are failed steps, skipped checks, and "I didn't verify / I'm not sure"
    assumptions stated honestly? (Silence is more dangerous than an admitted
    failure.)

[ ] Maintainability
    Could someone else taking this over understand why it changed this way, or
    does it only make sense inside the agent's context at the time?

[ ] Rollback impact
    If this change goes wrong, is the blast radius of a rollback clear? Is any
    part irreversible (notifications already sent, data already written, a
    migration already run)?
```

This checklist meshes with a few of Anthropic's recommendations: have the agent speak through verification evidence [A1]; use an adversarial review subagent that, in a fresh context, compares only the diff against the plan and reports gaps [A1]. But there's a counter-trap to watch for, one Anthropic names itself: a reviewer told to "find problems" will almost always find some, even when the work is sound, because that is the job it was given. Acting on all of them leads to over-engineering — extra abstraction layers, defensive code, tests for cases that can't happen. So tighten the "risk surface" item to "gaps that actually affect correctness or the stated requirements," and treat the rest as optional [A1].

### Designing rollback and gates

To turn "independent inspection" and "reversible" into hard process constraints, look at the default boundaries GitHub set for its cloud coding agent [G1]:

- The agent **can only push to branches it created**, so it can't touch the default branch or your team's branches.
- **The person who requested the task (who had the agent open the PR) cannot be the one to approve it** — any "required reviews" rule in your repo is honored. That's separation of duties: you don't sign off on your own delivery.
- GitHub Actions workflows **won't run without your approval**, giving you a chance to spot-check the agent's code.
- The agent's network access is limited to a customizable allowlist of trusted destinations.
- Existing branch protections, repository rulesets, and organization policies all apply [G1].

Translate these into your own team's rules: high-risk code (security, migrations, permissions) goes through trace review plus a CODEOWNERS-designated reviewer, never auto-merge; the agent's PRs open as drafts by default and trigger CI only after a human approves; before merging, confirm a rollback path exists (a clean git revert, no irreversible side effects). Session-level `/rewind` and checkpoints are for fast trial-and-error and undo while the work is live [A1] — but don't mistake them for a post-deploy refund policy. That rides on git and branch protection.

## Case

### The Claude Code ethos (secondary, from a Boris Cherny interview)

The claims below come from Gergely Orosz's (The Pragmatic Engineer) interview with Boris Cherny, Head of Claude Code at Anthropic [S8]. **This is a secondary source — opinions and experience as voiced in an interview, not Anthropic's first-party product documentation or an official benchmark.** Read the citations that way. For the record, Boris Cherny has given other interviews too (Latent Space, Lenny's Newsletter, YC, YouTube, and others); this book only captured this one, so the quotations here are limited to what could be verified inside it.

- **Explore first, then plan, then execute; a good plan one-shots almost every time.** Boris's words in the interview: "once there is a good plan, it will one-shot the implementation almost every time" [S8]. This lines up exactly with the four-phase "explore, then plan, then code" workflow in Anthropic's first-party docs [A1] — the docs render it as actionable steps, the interview gives it an experiential endorsement. Note the direction of cause: it isn't "the model is magic, so it one-shots," it's "the plan was right, so it one-shots."

- **20–30 PRs a day from one person.** The interview reports that Boris ships 20–30 PRs daily by running five parallel Claude instances (five terminal tabs, each its own checkout) with a plan-first approach [S8]. What makes this possible is isolation: five separate checkouts are five rooms that don't interfere, so none can overwrite another.

- **glob + grep, deliberately not a vector database.** The interview notes that Claude Code's code search uses basic glob and grep rather than RAG or a vector database — which proved more effective and sidestepped stale-index problems [S8]. It's a counterintuitive call worth remembering: simple beat complex. The interesting contrast is on GitHub's side — its coding agent analyzes the codebase precisely with RAG powered by GitHub code search [G1]. Same kind of problem, opposite choices; there's no single right answer.

- **Quality isn't a virtue, it's a throughput requirement.** The interview cites Boris's experience at Meta: code quality has "a measurable, double-digit-percent impact on engineering productivity" [S8]. A clean codebase is friendlier to both humans and models — which is exactly why "maintainability" sits in that review checklist as a hard item, not a soft suggestion.

All of this is interview-voiced; take it as experiential reference, not vendor-promised hard numbers.

### Comparing the three tools

| Dimension | GitHub Copilot coding agent [G1] | Claude Code [A1] | Boris's parallel setup (secondary) [S8] |
|---|---|---|---|
| Isolation unit | A VM spun up by GitHub Actions | worktree / sandbox / cloud-isolated VM | 5 separate checkouts |
| Code search | RAG powered by GitHub code search | basic glob + grep (interview-voiced) [S8] | same as Claude Code |
| Deliverable | a draft PR pushed to a self-created branch | PR / commit | 20–30 PRs a day |
| Who inspects | not the requester; CI needs human approval | adversarial review subagent in a fresh context | plan-first + tests as the inspector |
| Rollback | branch protection / rulesets / no direct push to main | `/rewind` + checkpoints (not a git replacement) + git | isolated checkouts can't contaminate each other |

Different shapes, same skeleton: an isolated room, an independent inspection, a reversible boundary.

## Anti-patterns

- **Merging on the diff alone.** A clean diff doesn't mean the requirement was understood or the commands were really run. Skip the trace and the evidence and you've checked that the walls are flat without opening the build record.

- **Letting the agent that wrote the code review itself.** It favors what it just wrote. Hand it to a fresh context — this is a structural problem, not an "attitude" one [A1].

- **The requester approving their own agent's PR.** Signing off on your own delivery; separation of duties exists in name only. GitHub makes this a default hard constraint [G1], and your team should have an equivalent rule.

- **Auto-merging high-risk code.** Security, migrations, permissions, concurrency — green tests don't earn an auto-merge here. A human plus CODEOWNERS, every time.

- **Treating session undo as rollback insurance.** `/rewind` and checkpoints only track Claude's own changes and don't replace git [A1]. When something actually breaks in production, git revert and branch protection save you, not `/rewind`.

- **Acting on every line of the adversarial review.** A reviewer told to nitpick will always find something; fixing all of it leads to over-engineering [A1]. Chase only what "affects correctness or the stated requirements," and treat the rest as optional.

- **Starting a migration and not finishing it.** One of Boris's lessons (secondary): "always make sure that when you start a migration, you finish the migration" [S8]. A half-done migration is a rollback nightmare — data stranded in an intermediate state that won't cleanly revert.

## Checklist

- When I reviewed, did I look at all three — diff, trace, and evidence — rather than the diff alone?
- Is the review done by an **independent context / person**, not the agent that wrote the code grading itself?
- Do high-risk changes (security / migrations / permissions / concurrency) go through **trace review + CODEOWNERS** rather than auto-merge?
- Is **the requester kept out of approving their own agent's PR**?
- Is there a **human approval** step before CI / deploy?
- Does the agent's claimed verification come with **credible evidence** (command + output), or just a bare "tests pass"?
- Are failures and "I didn't verify" assumptions **stated honestly** by the agent?
- If this change breaks, is the **rollback blast radius clear**? Is any part irreversible?
- Am I mistaking **session-level undo for engineering-level rollback** (git is the real exit)?

## Self-test

- Pull up the last PR your agent opened: did you read the trace and the evidence, or did you merge once the diff looked fine? If only the diff, how do you know the commands it claimed to run were actually run?
- On your team right now, can the person who requested a task approve their own agent's PR? If they can, is your "independent inspection" written into the process, or does it only live in everyone's good intentions?
- If the last agent change had to be rolled back this minute, could you state the blast radius in one sentence? Is any part already irreversible (notifications sent, data written, a migration half-run)? If you can't answer, that gap is your rollback design failing the test.
