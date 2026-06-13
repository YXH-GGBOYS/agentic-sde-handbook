---
id: ch26
order: 26
part_zh: 第六卷 · 三大 coding agent 实战对比
part_en: Part VI · Claude Code / Codex / Copilot in Practice
title_zh: 写 agent-ready issue 与 repo 指令
title_en: Writing Agent-Ready Issues & Repo Instructions
sources: [G3, G2, G4, A1]
---

When you hand work to an agent, the issue is the work order. Write it vaguely and someone who doesn't know how your shop runs can only guess. Spell out the background, the result you want, what not to touch, how to check it, which command checks it, and where the risk is — and the agent has a real shot at getting it right the first time. This chapter covers two things: how to turn an issue into a spec an agent can execute, and how to collapse the pile of instruction files in your repo (AGENTS.md / CLAUDE.md and friends) into one source of truth all three agents can read.

The quality of the issue sets the quality of the output. That isn't a slogan. Feed the same model "fix the recommendation thing" versus a work order that states the goal, the off-limits files, and the acceptance commands, and you get two completely different PRs back.

## Everyday analogy

You're handing out a stack of jobs to a contractor, each with its own work order.

A bad work order reads: "do something about that recommendation thing." The contractor doesn't know which page "that" is, doesn't know if you want a bug fixed or a feature added, doesn't know which files are heirlooms nobody touches, doesn't know what proof you'll accept that it's done. He picks a direction that makes sense to him, works heads-down for two days, and hands back something that's probably not what you wanted — and you find out only at acceptance.

A good work order is a different animal. The recommendation block on the home page; the current bug is that new users see a blank space; the goal is to fill it with a default top-list for cold-start users. The backend endpoint is in `api/recommend.py`; don't touch `api/migrations/`. When you're done, run `make test` and `pnpm -C web test` — both must be green. Paste what you changed and which commands you ran into the handoff note. With that order in hand, someone walking into your shop for the first time can do the job, and you can glance at the evidence and know whether it's right.

An issue is that work order, for an agent. GitHub's guide on writing issues opens with exactly this: write it "for someone brand new to the codebase" [G3]. An agent needs this more than a person does — a person reads the room and circles back to ask; an agent reads only what you wrote down.

## Definition

**An agent-ready issue is an executable spec, not a wish.** It breaks a task into the pieces an agent can act on and check itself against: background, goal, non-goals, the files likely involved, acceptance criteria, verification commands, the evidence to show, a risk level, the actions it's allowed to take, the points that need a human decision, and a rollback note.

GitHub distilled "how to write issues for a coding agent" into a framework called WRAP [G3]:

- **W — Write effective issues.** Write for someone brand new to the codebase. Use a title that says where the work happens, add the context a newcomer would need, and include an example of the implementation you want. G3's poor example is "Update the entire repository to use async/await"; the better one is "Update the authentication middleware to use the newer async/await pattern... Add unit tests for verification" [G3].
- **R — Refine your instructions.** Put the preferences you keep repeating into repo-level custom instructions instead of rewriting them in every issue. G3 names three kinds: repository instructions, organization instructions, and custom agents for repetitive tasks [G3].
- **A — Atomic tasks.** Break a big problem into small, independent tasks instead of dumping a massive scope. G3's example: rather than "Rewrite 3 million lines from Java to Golang," create separate issues per module — one for authentication, one for data validation [G3].
- **P — Pair with the coding agent.** Play to each side's strengths. G3's split: humans are good at understanding context, handling ambiguity, and cross-system thinking; the agent is good at tireless execution, repetitive tasks, and exploring multiple approaches. Humans make the strategic calls and confirm the change actually solves the underlying problem; the agent handles implementation [G3].

The core of this framework matches the thread that ran through the AGENTS.md chapter: you aren't writing documentation, you're briefing a capable new hire who doesn't know your conventions on one specific job.

## Why it matters

A vague issue used to be survivable. The engineer who picked it up would ask you at standup what "that thing" meant, would read around the code before writing anything, and would get pulled aside by a teammate when heading into a ditch. Those correction moves absorbed the cost of a sloppy work order.

An agent removes that backstop. It won't circle back to ask (unless you tell it to), won't feel that something is off, won't get a sanity check before delivery. It reads what you wrote and starts. A fuzzy goal, a missing acceptance check, an undeclared off-limits zone — it executes all of them as written, and quickly. GitHub's coding agent opens a draft PR the moment it gets an issue, pushes commits as it works, and logs the key steps [G2]. By the time you notice the direction is wrong, it may have spread that wrong direction across several files.

There's a workflow shift too: the issue is now the entry point to an async pipeline. GitHub's setup is an issue → draft PR → your review flow — you assign the work and walk away while the agent explores the code, edits, and runs tests and linters inside an ephemeral environment on GitHub Actions, then fills in the PR title and description and tags you for review [G2]. Write a sloppy entry point and the whole pipeline runs on a wrong premise, which you discover only when you come back to review. So the payoff of writing the issue as a spec is amplified in an async agent flow.

A1 puts the point plainly: the most useful specs are self-contained — they name the files and interfaces involved, state what is out of scope, and end with an end-to-end verification step that proves the feature works; time spent making the spec precise pays off more than time spent watching the implementation [A1].

## In practice

Here's a copy-and-adapt template for an agent-ready issue. Not every field needs filling every time — for a small change the first four blocks are enough; the more irreversible, cross-module, or money-adjacent the work, the more of the later blocks you fill in.

```markdown
## Context
(Why this task exists; what's broken now; relevant history.
Write it for someone walking into this repo for the first time.)

## Goal
(The one-sentence result to reach — observable, checkable.)

## Non-goals
(What is explicitly out of scope, so the agent doesn't "improve"
adjacent code on the way.)

## Likely files
- api/recommend.py        # backend endpoint
- web/src/pages/Home.tsx  # frontend entry

## Do-not-touch
- Don't edit api/migrations/ (migrations are hand-written and reviewed)
- Don't read or write .env / secrets/

## Acceptance criteria
- A new user on the home page sees a default top-list, not a blank space
- New behavior has a corresponding test (test real behavior, don't fit it
  to the implementation)

## Verify with
- make test            # required after backend changes
- pnpm -C web test     # required after frontend changes
- make typecheck

## Evidence to show
(Paste the command + output / screenshot, not just "done.")

## Risk
low / medium / high — (money, migrations, deletions, cross-service → high)

## Allowed actions
(Read-only? Write files? Run tests? Reach the network? Open a PR?)

## Needs a human decision
(List the calls the agent shouldn't make alone: tech choices, public
contract changes, data deletion...)

## Rollback
(How to undo a bad run: branch, snapshot, rollback script.)
```

A few things that make this land:

- **Acceptance must be executable, not "looks right."** A1 makes this its central point: give Claude a check it can run itself — a test, a build, a diff of output against a fixture, a screenshot against a design — and it runs the check, reads the result, and iterates until it passes [A1]. "Cover the edge case when the user is logged out" buys you far less than a concrete test case plus a `make test`.
- **Let the evidence speak.** A1's advice is to have the agent show evidence rather than assert success: the test output, the command it ran and what it returned, a screenshot of the result — reviewing evidence is faster than re-running the check yourself [A1]. The "Evidence to show" field exists to force this.
- **Risk level drives permissions and review depth.** Low-risk work (add a log line, change copy) can run loose; high-risk work (money, migrations, deletions, cross-service) needs "Needs a human decision" filled in and "Allowed actions" tightened.
- **Refined instructions live in the repo, not in every issue.** That's the R in WRAP [G3], and it leads into the next section.

## Case

**Same requirement, bad issue vs good issue.**

Bad issue (a wish):

```
Title: fix recommendations
Body: the recommendation area has problems, take a look and fix it.
```

Handed this, the agent can only guess: which recommendations? what problem? backend or frontend? what counts as fixed? It will likely pick a direction that looks reasonable to it, touch a stretch of code you never meant it to, and hand back a PR that "passes but isn't what you wanted."

Good issue (agent-ready):

```
Title: Home recommendation block — default top-list for cold-start users
Context: Newly registered users land on the home page and the recommendation
         area is blank, because with no history the collaborative filter
         returns nothing. This is a drop-off point for new users.
Goal: Users with no history see a default popular top-list in the block.
Non-goals: Don't change the collaborative-filtering algorithm itself;
           don't touch the top-list admin panel.
Likely files: api/recommend.py, web/src/pages/Home.tsx
Do-not-touch: Don't edit api/migrations/; don't read or write .env.
Acceptance: New user on home page sees the default list; new branch has
            unit-test coverage.
Verify with: make test, pnpm -C web test — both green.
Evidence: paste the output of both commands.
Risk: low. Permissions: write files, run tests, no network needed.
```

This is the spirit of G3's poor-vs-better pair: from a scope-exploding wish like "Update the entire repository to use async/await" down to "Update the authentication middleware to use the newer async/await pattern... Add unit tests" [G3]. The difference isn't word count; it's whether the agent can take a determinate action from it and judge for itself when it's done.

**GitHub's issue → PR async flow.** Assign that good issue to the Copilot coding agent on GitHub and it kicks off a full async pipeline [G2]: the agent opens a draft PR tagged `[WIP]` to track progress; it explores the code, makes changes, and runs tests and linters inside a secure, ephemeral environment powered by GitHub Actions; it pushes commits as it works and logs the key steps so you can watch in real time; when done it fills in the PR title and description and tags you for review; you leave feedback by commenting `@copilot` on the PR, and it iterates on that [G2]. The guardrails on this flow are enforced at the product layer: the agent can only push to the `copilot/*` branch it created and cannot push to the trunk; every PR requires independent human review; CI/CD workflows won't run without approval; all commits are co-authored for traceability; existing org policies and branch protections apply automatically [G2].

Put the flow and the good issue side by side and it's clear: the issue is the entry-point spec, the product-layer guardrails are the isolated room and the acceptance gate, and your read of the evidence is the final sign-off. A sloppy entry point leaves those guardrails able to stop "dangerous" but not "wrong direction" — and only the goal and acceptance in the issue can govern direction.

## Repo instruction files across the three tools — and how to converge them

The R in WRAP, on disk, is the pile of agent-instruction files in the repo. Where the three tools stand:

| Dimension | GitHub Copilot coding agent | Claude Code | Shared convention |
|---|---|---|---|
| Primary file | Reads a root-level `AGENTS.md`, and nested `AGENTS.md` files scoped to specific parts of the repo [G4] | Primarily `CLAUDE.md`, loaded at the start of every session [A1] | `AGENTS.md` is becoming a cross-vendor convention |
| Also supports | `.github/copilot-instructions.md`, `.github/instructions/**.instructions.md`, `CLAUDE.md`, `GEMINI.md` [G4] | Imports other files via `@path` syntax [A1] | — |
| Stated purpose | Guide the agent on understanding the project and on how to build, test, and validate changes [G4] | Persist commands, code style, and workflow rules — things it can't infer from code alone [A1] | — |
| Layering | Root + nested; a nested file applies only to its part of the repo [G4] | Loaded across home / project root / subdirectory levels [A1] | — |

One real problem stands out: a single GitHub agent will honor five formats at once — `AGENTS.md`, `.github/copilot-instructions.md`, `.github/instructions/**.instructions.md`, `CLAUDE.md`, and `GEMINI.md` [G4]. Compatibility is good, but five possibly-conflicting instruction files scattered through one repo is its own trap — the agent doesn't know which to follow, and you don't know which one steered it wrong.

The fix is the same as the previous chapter: **make `AGENTS.md` the single source of truth**, and either delete the rest or leave them with a one-liner pointing to AGENTS.md. A1's discipline for CLAUDE.md applies here too — include only what can't be inferred from code (commands to run, styles that differ from defaults, branch/PR conventions, environment quirks, gotchas you've hit), and cut filler like "write clean code"; if the file is too long, the agent buries half the rules and never reads them [A1].

> A note from G4 itself: the `2025-10-23` GitHub changelog URL we set out to verify is a 404 — it doesn't exist. AGENTS.md support for the coding agent actually shipped on 2025-08-28 [G4]. A vendor URL with a tidy date format, looking airtight, can be pure fiction. Whether you're writing a textbook or letting an agent cite "the official docs," click the link and check it yourself.

## Anti-patterns

- **Writing the issue as a wish list.** "Fix recommendations," "make it nicer" — no observable goal, no acceptance test. The agent guesses, and you learn it guessed wrong at review. Rewrite as action + acceptance + verification command.
- **Saying what to do, never what not to touch.** With no off-limits zone, the agent "improves" adjacent code on the way (formatting, comments, types it was never asked to change). Non-goals and a do-not-touch list cap its blast radius directly.
- **Acceptance written as adjectives.** "Clean code," "good performance" aren't executable. Swap in a concrete test case and a command that runs — A1's whole table is about this: from "implement a function that validates email addresses" to "write a validateEmail function. example test cases: user@example.com is true, invalid is false, user@.com is false. run the tests after implementing" [A1].
- **Scope blown out.** "Convert the whole repo to async/await," "rewrite 3 million lines of Java to Golang" — one issue can't hold it. Per WRAP's A, split into atomic tasks: one for authentication, one for data validation [G3].
- **Re-copying repo conventions into every issue.** Commands, style, off-limits zones — the things you keep repeating belong in AGENTS.md (WRAP's R [G3]), not pasted into every work order.
- **Five instruction files contradicting each other.** AGENTS.md, copilot-instructions.md, CLAUDE.md... multiple, possibly-conflicting files in one repo [G4]. Converge on a single source of truth.
- **Treating issue text as a security boundary.** Writing "don't push to trunk" in an issue is not a control. The real boundary is the product layer — on GitHub the agent can only push to its `copilot/*` branch, PRs require human review, and CI won't run without approval [G2]. The issue governs "right direction"; the guardrails govern "nothing blows up." Two different jobs.

## Checklist

Before you hand an issue to an agent, run through this:

- Does the issue have an **observable, checkable goal**, not just "fix it"?
- Did you write **non-goals / off-limits**? Does the agent know which files and which scope not to touch?
- Is the acceptance criterion an **executable check** (test case + command), not "looks right"?
- Did you give **verification commands** and a requirement to **show evidence**?
- Is the **risk level** marked? For high-risk work, are "Needs a human decision" and "Allowed actions" spelled out?
- Are the repo conventions you keep repeating sitting in **AGENTS.md**, or re-copied into each issue?
- Are the repo's multiple instruction files converged on a **single source of truth**?
- Is the scope **atomic** — one PR's worth, reviewable at a glance?

## Self-test

- Hand a recent issue of yours to someone who knows nothing about the project: can they tell, from that order alone, what to change, what not to touch, and what to run to verify? If they can't, the agent can't either.
- Last time you gave an agent work, did acceptance rest on "it said it's done," or on a command you can run and read the result of yourself?
- How many agent-instruction files are in your repo right now? Do they agree? If the agent went off the rails, could you say which file led it there?
