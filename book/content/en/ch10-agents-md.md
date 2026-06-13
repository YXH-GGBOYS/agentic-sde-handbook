---
id: ch10
order: 10
part_zh: 第三卷 · 新工程资产
part_en: Part III · The New Engineering Assets
title_zh: repo 指令文件：AGENTS.md / CLAUDE.md
title_en: Repo Instruction Files — AGENTS.md / CLAUDE.md
sources: [G4, A1, A15]
---

If your team's rules live only in senior engineers' heads, a new contractor will trip over every one of them. AGENTS.md writes those rules down in a form a machine can read and an agent will actually follow. Treat it as a source file for the agent era: it belongs in version control, and it needs maintaining like any other code.

## Everyday analogy

You've hired a house cleaner. First visit, knows none of your house rules. You can't shadow them all day, so you **stick a note on the fridge**.

A good note reads: dishes go in the **left** cabinet (not wherever); the bag on the balcony is **cat food, don't feed it to the kids**; the cast-iron pan gets **wiped dry, never soaked**, or it rusts; **text me** when you're done.

Three things about that note carry straight over to AGENTS.md:

1. **It's written for someone who doesn't know your house**, not as a memo to yourself. You know not to soak the pan; you write it down *because they don't*.
2. **It's specific to an action.** Not "please respect the kitchenware" (which says nothing) but "wipe the pan dry, don't soak it."
3. **It includes "don't touch this" and "here's how to hand it back."** Saying what to do isn't enough; you mark the off-limits zones and the handoff.

AGENTS.md is that fridge note, written for an agent. Anthropic reaches for nearly the same image with Agent Skills: writing a skill is "like putting together an onboarding guide for a new hire" [A15]. The point is the same. You aren't writing documentation; you're briefing a capable newcomer who doesn't know the rules yet.

## Definition

**AGENTS.md / CLAUDE.md** are repo-level, machine-readable agent instruction files that live in the codebase and are versioned and reviewed alongside the code.

It isn't one vendor's private format. GitHub's coding agent reads a root-level AGENTS.md and **also nested** AGENTS.md files that apply only to their part of the tree; it also accepts `.github/copilot-instructions.md`, `.github/instructions/**.instructions.md`, `CLAUDE.md`, and `GEMINI.md` [G4]. Claude Code reads CLAUDE.md the same way [A1]. AGENTS.md is on its way to becoming a cross-vendor convention.

## Why it matters

A human newcomer reads the room. They watch how others work, and someone pulls them back before they step in a hole. An agent doesn't get any of that. It only reads what you hand it explicitly. A rule that lives only as team folklore ("we never edit migration files by hand," "e2e must pass before release") effectively doesn't exist for the agent, and each one is a hole it walks straight into.

So repo instruction files are a first-class engineering asset, not shelf decoration [A1]. Their quality sets the ceiling on what the agent can produce: with the same model, a well-written AGENTS.md noticeably cuts the agent's out-of-scope changes.

The counterintuitive part is that the prose you'd write for a human is exactly the part the agent can't use. A paragraph about how "we deeply value code quality and craftsmanship" carries zero executable rules. What the agent needs is action plus command plus off-limits: which command to test with, which directories not to touch, what the PR description must contain.

## In practice

A workable AGENTS.md covers at least five blocks: project shape, commands, definition of done, safety boundaries, and review expectations. Here's one to copy and adapt, for a Python-backend, TypeScript-frontend web app:

```markdown
# AGENTS.md — Acme Orders

## Project shape
- Backend: FastAPI (`api/`), Postgres, SQLAlchemy.
- Frontend: React + TypeScript (`web/`), Vite.
- Money is stored as integer **cents**; the frontend divides by 100 to display.
  Never hard-code an exchange rate.

## Commands (use these — don't improvise)
- Install:     `make install`
- Unit tests:  `make test`          # required after any backend change
- Web tests:   `pnpm -C web test`
- Typecheck:   `make typecheck`      # required after any frontend change
- Run locally: `make dev`

## Definition of done
- Relevant tests green; new behavior has tests (test real behavior, don't fit the impl).
- Changed the API shape -> update `web/src/api/types.ts` too.
- PR description must include: what changed, which verification commands you ran,
  what you did NOT verify, and risks.

## Safety boundaries (off-limits)
- Do not modify `api/migrations/` (migrations are hand-written and reviewed).
- Never print or read `.env`, `secrets/`, or any production connection string.
- Network is off by default; justify any new dependency (source + reason) in the PR.
- Never run destructive commands: `DROP`, `TRUNCATE`, `rm -rf`.

## Review expectations
- Explain why each changed file changed.
- Attach verification evidence (commands + results).
- List unverified assumptions and follow-ups ("I did not verify / I'm unsure").
```

The move that pays off is layering. Global rules go at the root; a touchy subsystem like payments can carry its own nested AGENTS.md that applies only there. GitHub's agent supports exactly this nesting [G4].

## Case

**Even a first-party URL can be a hallucination.** While writing this handbook we set out to verify a GitHub changelog cited by two earlier textbooks: a URL shaped like `2025-10-23-...agents-md...`, supposedly the official AGENTS.md announcement. Two rounds of fetching, two 404s. The link simply doesn't exist. What actually happened is that AGENTS.md support for the coding agent shipped on 2025-08-28, and custom agents were announced on 2025-10-28 at GitHub Universe [G4]. A vendor URL can look exactly right, down to the tidy date format, and still be fiction. Same lesson whether you're writing a textbook or asking an agent to cite "the official docs": click the link and check the source yourself. Agents, and people, will hand you a flawless-looking citation with total confidence.

**Instruction files sprawl.** A single GitHub agent will honor five formats at once: AGENTS.md, `.github/copilot-instructions.md`, `.github/instructions/**.instructions.md`, CLAUDE.md, GEMINI.md [G4]. The compatibility is convenient, but five possibly-conflicting instruction files in one repo is a fresh hole to fall into. The fix is mechanical: make AGENTS.md the single source of truth, then either delete the rest or shrink each to one line ("see AGENTS.md"), so the agent isn't choosing among five contradictory notes.

## Anti-patterns

- **Writing prose.** A pretty paragraph about "craftsmanship" with no executable rule. Convert to action, command, off-limits.
- **Piling in README detail.** Long architecture essays bury the rules that matter. AGENTS.md should be short, dense, executable.
- **Listing only "what to do," never "what not to touch."** The off-limits section matters more than the to-do list; it's what bounds the agent's blast radius.
- **Five files saying different things.** See above. Collapse to a single source of truth.

## Checklist

- For every line in my AGENTS.md, can the agent **take a concrete action** from it (not absorb a sentiment)?
- Are the **commands** complete (test, typecheck, run locally) so the agent never guesses how to verify?
- Are the **off-limits** spelled out (which files, what not to read, network policy, banned commands)?
- Are the **definition of done** and **PR/review expectations** written?
- Across multiple instruction files, is there a **single source of truth**?

## Self-test

- Hand your AGENTS.md to someone who's never seen the project. Working only from that note, can they run the tests and know what not to touch? If they can't, neither can the agent.
- The last time you had an agent cite "the official docs," did you click the link and check it yourself?
