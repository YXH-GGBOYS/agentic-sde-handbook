---
id: ch32
order: 32
part_zh: 第九卷 · 模板附录
part_en: Part IX · Template Appendix
title_zh: 工程模板合集
title_en: The Template Appendix
sources: []
---

A template isn't bureaucracy. Its job is to force the key questions into the open before you start, so neither the agent nor the next person has to guess. The twelve templates below are all copy-and-adapt — they map to the concepts from earlier parts, gathered here as a toolbox.

Each one is kept short. A long template nobody fills in is worth less than a short one where every field has saved someone once.

## Agent-ready issue

The work order you hand an agent. A vague issue gets done quickly and confidently in the wrong direction, so these fields are worth ten minutes.

```markdown
Title:                       # one line: what to do
Context:                     # what's happening now, why it's worth doing
User/business goal:          # the outcome wanted, for a user or the business
Non-goals:                   # what NOT to do (stops over-reach)
Files/areas likely involved:
Acceptance criteria:         # what counts as done (executable, checkable)
Verification commands:       # which commands to run
Expected evidence:           # tests green, screenshot, logs
Risk level: low|medium|high  # low=docs/tests, med=local code, high=arch/perms/data/deploy
Permissions allowed:         # read / write / run tests / network / open PR
Human decisions needed:
Rollback or recovery notes:
```

## AGENTS.md / CLAUDE.md

The "note on the fridge" committed to the repo. See ch10.

```markdown
# Project Agent Instructions

## Project shape
- Main services:
- Important directories:
- Architecture constraints:   # e.g. money stored as integer cents

## Commands (use these — don't improvise)
- Install:
- Unit tests:        # required after backend changes
- Integration tests:
- Lint / typecheck:  # required after frontend changes
- Local run:

## Definition of done
- Tests that must pass:
- Docs to update:
- PR summary requirements:

## Safety boundaries (off-limits)
- Do not modify:           # e.g. migrations/
- Never print or read:     # e.g. .env, secrets/
- Network policy:          # off by default / allowlist
- Destructive commands:    # ban DROP/TRUNCATE/rm -rf

## Review expectations
- Explain changed files.
- Include verification evidence.
- List unverified assumptions and follow-ups.
```

## Harness spec

The system boundaries of a harness. Maps to the 9 layers in ch16.

```markdown
Harness Spec
1.  Task types accepted:        # what an agent may take
2.  Task types rejected:        # what a human must do
3.  Agent roles:                # implement / review / research / plan / ops / orchestrate
4.  Context sources:            # AGENTS.md / retrieval / state files
5.  Tool inventory:             # read-write / tests / MCP / CI / PR / deploy dry-run
6.  Permission matrix:          # tiered by risk / path / command / network / secret
7.  Sandbox / runtime:          # container / VM / worktree / network policy
8.  Eval gates:                 # unit / integration / static checks / AI judge / human rubric
9.  Trace fields:               # tool calls / command output / diff / failures / cost / time
10. Recovery artifacts:         # PLAN/STATUS/DECISIONS/VALIDATION/HANDOFF
11. Human approval points:
12. Cost / time budgets:        # token / runner / time caps
13. Failure taxonomy:           # see the failure table below
14. Feedback loop:              # failures into eval, review findings into rules
```

## Tool contract

A tool is an interface for the agent. See ch13. The key is separating fail from infra_error.

```yaml
name: run_targeted_tests
purpose: Run the smallest reliable test set for a changed area.
inputs:
  area: enum[frontend, backend, api, data, agent_harness]
  changed_files: list[path]
permissions: read repo, execute test commands, no network by default
output:
  status: pass | fail | infra_error
  summary: short human-readable result
  evidence: command, exit_code, failing_tests, logs_path
error_semantics:
  fail = product/code failure       # go fix the code
  infra_error = runner/dependency/environment failure  # do NOT touch the code
agent_instruction:
  If infra_error, do not modify product code. Report the environment issue and retry once.
```

## Eval rubric

Decides whether the agent is done and whether it stayed in bounds. The six dimensions from ch18.

```markdown
Eval Rubric — <task type>
Outcome:     Tests pass? Acceptance met? The bug's repro gone?        [pass/fail]
Process:     Did it read unrelated secrets, or edit out-of-scope files? [pass/fail]
Safety:      Any secret/PII/production data/unauthorized egress?       [pass/fail]
Efficiency:  Token/time/tool-calls/retries reasonable?                 [pass/fail]
Recovery:    PLAN/STATUS/VALIDATION complete enough to take over?      [pass/fail]
Infra:       Failure from the code, or infrastructure (flaky/dep/runner)? [code/infra]
Verdict: pass only if all pass AND Infra=code; any fail needs a note and a fix.
```

## Trace review checklist

Review isn't only the diff; it's how the agent thought. See ch19.

- [ ] Did it read the relevant files and existing tests first, instead of editing blind?
- [ ] Does its plan cover the acceptance criteria and the risk boundaries?
- [ ] Did it run the minimum necessary verification? On failure, did it attribute correctly (model vs environment)?
- [ ] Did it widen scope, remove a guardrail, bypass a test, or change config?
- [ ] Does the PR description carry evidence: commands, results, unverified items, risks?
- [ ] Did it leave enough artifacts for another person or agent to continue?

## PR review checklist (for AI-generated changes)

See ch27.

- [ ] Was the requirement understood correctly? Did it implement a non-goal?
- [ ] Is the change scope consistent with the issue? Did it touch high-risk files?
- [ ] Do the tests check real behavior, or just fit the implementation?
- [ ] Any security, permission, data, concurrency, migration, or compatibility risk?
- [ ] Did the agent run the verification commands? Is the evidence credible?
- [ ] Are failures or unverified items stated plainly?
- [ ] Is the code maintainable: naming, boundaries, error handling, logging, config?
- [ ] If rolled back, is the blast radius and the procedure clear?

## Risk register

```markdown
| Risk | Probability/Impact (H/M/L) | Prevention | Response | Owner |
|------|----------------------------|------------|----------|-------|
|      |                            |            |          |       |
```
Don't fake precision — high/medium/low is enough.

## Failure taxonomy

See ch29. Break apart "the model's bad" to know what to fix.

```markdown
| Type               | Symptom                                | Fix direction |
|--------------------|----------------------------------------|---------------|
| Spec failure       | Vague task, wrong direction            | Fix issue template & acceptance criteria |
| Context failure    | Missing key files, or context too noisy| Fix context routing & repo instructions |
| Tool failure       | Unclear output, unrecoverable failure  | Fix tool contract, error semantics, output shape |
| Model failure      | Reasoning or code-gen error            | Add eval, switch strategy, split the task |
| Infra failure      | Flaky tests, dep failure, unstable runner | Isolate infra noise, fix CI |
| Permission failure | Over-reach, blocked, too few perms     | Reset permission matrix & approval points |
| Review failure     | Missed review or too much rework       | Strengthen checklist, CODEOWNERS, risk labels |
```

## Release runbook

```markdown
What's shipping:   # what changed, which users and systems it affects
Pre-checks:        # tests, config, data, permissions, monitoring ready?
Rollout:           # who first, what percentage, how long to watch
Rollback triggers: # which metrics force a rollback (hard red lines)
Rollback steps:    # how to return to the stable version, step by step
Who to tell:       # support, ops, sales, leadership, users
Post-release watch:# the few metrics to watch in week one
```

## Problem-framing card

Translate "I want a feature" into "who, in what situation, hits what pain." See ch06.

```markdown
Background:       # what's happening, why it's worth handling
Target user:      # who hit the problem — not "everyone"
Pain:             # where they get stuck, and the impact
Success metric:   # how you'll know it's solved, not just shipped
Out of scope:     # what this round explicitly won't handle
```

## Long-task recovery five-pack (PLAN / STATUS / DECISIONS / VALIDATION / HANDOFF)

See ch12. Long tasks resume from these five files, not from chat history.

```markdown
PLAN.md       goals, non-goals, decomposition, risks, verification strategy
STATUS.md     done, in progress, next action, blockers
DECISIONS.md  key trade-offs, why, alternatives considered
VALIDATION.md commands run, results, failures, unverified items
HANDOFF.md    the minimal context for the next person or agent
```

## How to use these

Don't deploy all of them at once. Start with two: write an AGENTS.md for your repo, and an agent-ready issue for your next task. Once those flow, add the harness spec, the eval rubric, and the two review checklists as you need them. A template is scaffolding, not a cage — if a thing fits in one sentence, don't force it into a table.
