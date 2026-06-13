---
id: ch01
order: 1
part_zh: 第一卷 · 格局重置
part_en: Part I · The Reset
title_zh: 代码不再是中心产物
title_en: Code Is No Longer the Central Artifact
sources: [O1, O6, G1, G2, A2]
---

For most of the last decade, everything a software engineer delivered eventually collapsed into one thing: code. Design docs, whiteboards, chat threads were all process; the lines that merged into main were the result. Promotions looked at it, post-mortems looked at it, and when something broke, you went back and read it.

Agents broke that collapse. Code is still there, but it has dropped from "the final artifact" to "one of the artifacts." Whether a piece of work lands now depends more and more on things that sit outside the code: the instructions you hand the agent, the isolated environment it runs in, the acceptance check that decides whether it's actually done, the trace it leaves behind, and whether you can undo the run when it goes wrong. This chapter is about that shift — your central deliverable moves from a single plate of food to a whole kitchen that can serve reliably.

## Everyday analogy

Picture yourself as a cook with good hands. Before you open a place, your entire output is the plate you set down on the table. Heat, seasoning, plating — you watch all of it yourself, and whether the customer is happy maps directly onto whether you cooked that plate well. Your artifact is the plate.

Now you stop cooking the line and open a restaurant, with a few fast cooks in the back. What you deliver is no longer any one plate — it's whether the kitchen can serve reliably. That involves a long list of things you never had to think about as a line cook: a **prep sheet** that spells out how your kitchen makes a given dish (what goes in first, how hot, how it's plated — the cook shouldn't have to guess); a **mise en place** station where ingredients are portioned and laid out before the burners are lit, so nobody scrambles mid-service; a **pass** where finished plates leave the kitchen, with a clear handoff of who takes them and how they're checked; an **expediter** who tastes and eyes each plate before it goes out, rather than a plate going straight to the table because the cook said it was fine; a **schedule** so three cooks working at once don't all crowd the same burner and collide; and an **undo rule**, so an over-salted plate gets pulled and remade instead of reaching the customer.

Your own knife skills haven't gone anywhere, but they're no longer the whole of what you deliver. A restaurateur's value isn't a few extra flips of the pan over the cooks — it's designing a kitchen that serves reliably even when today's cooks aren't the same ones as last week's. You've gone from the person who makes the plate to the person who makes a whole kitchen produce good plates on its own.

That is exactly what's happening to engineers in the agent era. You still write code, but what you deliver is the system that lets a crew of agents produce reliable software.

## Definition

Start with what the old "central artifact" actually meant. On a traditional team, almost all engineering value settled into the code in version control: review checked it, CI tested it, production ran it. Docs went stale and conversations sank out of view, but code stayed the authoritative thing — the artifact that was maintained and the one you reread when something broke. That was the default.

Agents change the default. Once an agent can read a whole repo, edit several files, run commands, open a PR, wait for review, and then resume from an interruption, doing its work takes a whole set of pieces that live outside the code. Those pieces are no longer throwaway drafts of the process. They go into version control and get maintained, the same as code. Listed out, they are the real artifact set of the agent era:

- **Code and tests** — still here, but only one part of it.
- **Issues and task descriptions** — where the agent's work comes from. GitHub's coding agent starts only once you assign it an issue [G1].
- **Agent instruction files (AGENTS.md / CLAUDE.md)** — the house rules checked into the repo: which commands to use, which directories not to touch, what counts as done. Building Sora for Android, the OpenAI team had Codex create and maintain a set of AGENTS.md files across the codebase so the same guidance carried across sessions [O6].
- **A sandbox / isolated execution environment** — where the agent runs. GitHub's coding agent boots a virtual machine, clones the repo, and runs tests and linters in an ephemeral environment powered by GitHub Actions [G1][G2].
- **Evals / acceptance** — the executable standard that decides whether the agent is done. For long-running agents, Anthropic used a JSON feature list as the acceptance gate: the claude.ai clone had over 200 end-to-end features, each marked "failing" at first, and a coding agent could only flip a feature to "passing" after testing it [A2].
- **Traces / session logs** — what the agent read, what it tried, where it failed. GitHub's agent writes each step into a session log so you can trace its decisions [G1].
- **PRs and the discussion in them** — where handoff and review happen, with commits co-authored for traceability [G2].
- **Release scripts, monitoring, CI config** — in OpenAI's fully agent-generated internal product, these are all part of the artifact set: agents produce not just product code and tests but CI configuration, release tooling, documentation, evaluation harnesses, and even production dashboard definition files [O1].

So "code is no longer the central artifact" means something precise: **the engineering deliverable went from one thing to a set** — code plus tests, issues, instruction files, a sandbox, evals, traces, PR discussion, release scripts, and monitoring. Code still matters. It's now one node in that system rather than the single thing everything revolves around.

## Why it matters

This shift forces four moves from old practice to new, and they don't reverse easily.

**Prompt engineering gives way to harness engineering.** Early on, people assumed the trick to using AI well was tuning the prompt until the wording was just right. Build something real and the bottleneck turns out to be elsewhere: not how the sentence is worded, but how good the environment around the agent is — which tools it can run, where it executes, how it recovers from a mistake, who signs off. In OpenAI's retro, early progress was slow "not because Codex was incapable, but because the environment was underspecified"; the agent lacked tools, abstractions, and internal structure, so the engineers' main job became supplying the missing capability so the agent could make progress [O1]. The prompt is one sentence to the brain. The environment is the operating system around it.

**A chatbot gives way to an agent runtime.** A chatbot is one question, one answer: you paste code, it replies, you copy it back yourself. An agent is different. It reads the repo, edits files, runs commands, opens a PR, waits for review, and resumes from where it stopped — all of which needs a real runtime. The hardest part is continuity across context windows. Anthropic's framing is apt: a long-running agent is like an engineering team working in shifts, where each new person arrives with no memory of the previous shift [A2]. Their fix is to make each shift leave a handoff: a `claude-progress.txt` log, the git commit history, and an `init.sh` startup script that the next shift reads to pick up the thread [A2]. Those handoff items are artifacts in their own right — without them, the agent can't even resume its own last run.

**Benchmarks give way to production evals.** A benchmark tells you how strong a model is on carefully prepared problems, but real failure almost never looks like that. Real failure comes from the boundaries — model, tools, permissions, network, dependencies, environment drift: a dependency that won't install, a network hiccup, an agent without permission to touch a file, a local environment that has drifted from production. The reason GitHub limits the agent's network access to a trusted list by default, and gates CI workflows behind human approval [G1], is that those boundaries are where things actually break. Acceptance has to move into a real environment rather than a static score.

**Personal typing speed gives way to organizational throughput.** Once an agent speeds up the writing of code, how fast one person types stops being the limit. OpenAI's fully agent-driven team had three engineers driving Codex open and merge roughly 1,500 PRs — an average of 3.5 per engineer per day — and per-engineer throughput went up, not down, as the team grew to seven [O1]. The Sora team saw the same turn: their bottleneck "shifted from writing code to making decisions, giving feedback, and integrating changes" [O6]. Sustaining throughput isn't about one person typing faster. It's about getting the standards, tools, checks, and review into the repo so they apply automatically to every agent run.

Put the four together and the value moves up. People stop spending their hours typing code line by line and move to defining the problem, setting boundaries, fixing acceptance, controlling risk, and deciding architecture. OpenAI compressed it to three words: **humans steer, agents execute** [O1]. The Sora team put it more bluntly — AI-assisted development doesn't reduce the need for rigor; it increases it [O6].

## In practice

Acting on this shift, day to day, means this: stop watching only the code, and start treating the things around it as artifacts you deliver and maintain.

- **Write the instruction file before you hand off work.** Put "how our kitchen does it" into an AGENTS.md: which commands to run, which directories are off-limits, what counts as done. The Sora team even had Codex maintain these files across the codebase so the same rules carried across sessions [O6]. That's the prep sheet.
- **Start from an issue, not a chat box.** Write the task as an issue with a clear goal and constraints, then hand it to the agent, instead of tossing requirements into a conversation. GitHub's whole pipeline is built this way: issue in, PR out [G1][G2].
- **Set acceptance before you let it run.** Decide what "done" means — which tests must be green, which criterion must hold — and make it executable where you can, like Anthropic's feature list that gets checked off one item at a time [A2], rather than eyeballing the result afterward.
- **Run it in an isolated environment.** Don't let the agent work directly against your real repo and real data. GitHub gives it an ephemeral environment on Actions [G2]; at a minimum, give yours a separate worktree or container.
- **Keep the trace.** Make sure the record an agent leaves is enough for you, or the next person, to take over — what it read, what it ran, where it failed. That's what GitHub's session log is for [G1].
- **Review it like a teammate's work.** The Sora team is explicit: they reviewed Codex's output the same way they'd review a colleague's [O6]. Acceptance doesn't get skipped because an agent wrote the code.

## Case

**OpenAI built Sora for Android in 28 days with Codex.** From October 8 to November 5, 2025, a four-engineer team working alongside Codex took Sora for Android from prototype to global launch: an internal build in 18 days, public launch 10 days later [O6]. On launch day it hit #1 in the Play Store, users generated more than a million videos in the first 24 hours, the crash-free rate held at 99.9%, and the team estimates Codex wrote about 85% of the code [O6].

The interesting part is how that 85% came about. The team did **not** hand Codex a "build the Android app from the iOS code, go" — they actually tried that path and abandoned it fast, because the single-shot code was unreliable and the product experience was sub-par [O6]. What worked was the reverse: humans laid the foundation by hand. The structural calls — architecture, modularization, dependency injection, navigation — were the team's own, and they implemented authentication and the base networking flows themselves; they also wrote a few representative features end-to-end to set the rules the rest of the codebase would follow [O6]. On that foundation, Codex filled in large amounts of code inside well-bounded scopes. Humans set the structure and the invariants; the agent worked within them. Code was 85% of the output, but what decided whether the project succeeded was the architecture, acceptance, and release-quality judgment in the other 15%. That is the value moving up: the team spent its attention on architecture, user experience, systemic changes, and final quality, and left "filling in code inside known patterns" to Codex [O6].

**GitHub built its coding agent into the whole path, from issue to monitoring.** It isn't a chat box; it's a workflow embedded in GitHub. You assign it an issue, and in the background it boots a virtual machine, clones the repo, analyzes the code with RAG, and pushes commits to a draft PR as it works, writing each step into a session log you can trace [G1]. The whole thing runs on GitHub Actions, where the agent runs tests and linters [G2]. The guardrails are enforced in the system, not asked for in a prompt: the agent can only push to branches it created, network access is limited to a trusted list, CI workflows require human approval, and the person who requested the task cannot approve the agent's PR [G1]. That full chain — issue to branch to PR to Actions to session log — is the artifact set above, made concrete. Code is just one of the things flowing through it.

## Anti-patterns

- **Treating code as the only artifact and improvising the rest.** Instructions, acceptance, isolation, and the undo path never get committed to the repo; you re-explain them by mouth every time. That's running a restaurant with no prep sheet and no expediter, betting the cook is in a good mood today.
- **Cramming every constraint into the prompt.** Believing a sufficiently magic prompt can stand in for tests, permissions, and an isolated environment. Constraints belong in the tool layer and the sandbox, not painted on the agent's forehead. That puts the harness inside the prompt, which has it the wrong way around.
- **Using a benchmark score as production acceptance.** A model that looks great on a benchmark isn't necessarily one that won't break against your dependencies, permissions, network, and environment — and real failure almost always comes from those boundaries, not the test set.
- **Using agents to go faster without touching the organizational layer.** Leaving standards, checks, and review in one person's head or a chat thread, and just letting the agent run fast. Throughput quickly slams back into the human bottleneck — which is exactly how the Sora team's bottleneck moved from writing code to decisions and integration [O6].
- **Skipping review because an agent wrote it.** Acceptance doesn't get waived because the producer is an agent. The Sora team reviewed Codex with the same standard they'd apply to a colleague [O6].

## Checklist

- Is code the only thing I deliver? Are the instruction file, acceptance criteria, isolated environment, trace, and undo path also treated as artifacts I maintain?
- Does my task start from an **issue** with a clear goal and constraints, rather than requirements tossed into a chat box?
- Is "**done**" an executable acceptance criterion, not "looks right" eyeballed afterward?
- Does the agent run in an **isolated environment**, or directly against my real repo and real data?
- Is the **trace** it leaves enough for someone else to take over?
- Have I gotten the standards, checks, and review **into the repo** so they apply automatically to every agent run — instead of living only in one person's head?

## Self-test

- If you listed your team's full set of engineering artifacts right now, where would code rank, and how large a share would it be? How would you have listed it two years ago?
- The last time you ran an agent: did the constraints and acceptance get written into the repo to apply automatically next run, or did they evaporate once you'd explained them this once?
- Before the plate goes to the table — who took that taste? If the answer is "nobody, the tests passed so it went straight out," what you're missing is an expediter, not a better cook.
