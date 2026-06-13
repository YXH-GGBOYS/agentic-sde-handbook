---
id: ch09
order: 9
part_zh: 第二卷 · 软件工程基础与 AI 时代重校
part_en: Part II · Software Engineering Foundations, Recalibrated
title_zh: 测试与验证的重定价：从"测代码"到"测 agent"
title_en: Testing & Verification, Repriced
sources: [A10, A10b, A11, A19, O5]
---

A candidate who writes a clean demo in the interview tells you very little about how they'll hold up three months into your codebase. That's what the probation period is for: it trades the polished interview moment for a record of how someone handles real tasks over real time.

Testing and verification are software's version of that probation period. It used to grade the code: is this function right, do these modules cooperate, does a user survive the checkout flow. With agents in the loop, the thing under examination has quietly shifted. You still grade the code, but now you also grade the agent that wrote it — whether it understood the task, whether it overstepped, whether it quietly skipped the checks. This chapter teaches the old foundations first, then reprices them.

## Everyday analogy

The interview gives you maybe an hour or two, and it shows you less than it seems. The questions were prepared, the environment is clean, and the candidate is as tense and rehearsed as they'll ever be. What actually decides whether you keep someone is the probation period: put them on a real project, hand them real work, and watch how they do over a few months — whether they flail when they hit an unfamiliar module, whether they can pick the thread back up after an interruption, how many rounds of rework their submissions take.

Probation and the interview are different things, and the difference has three parts.

It's **continuous**, not a single shot. The interview is one snapshot; probation is a recurring check that watches for steadiness rather than one good day.

It runs on **real tasks**, not on a demo. A demo is the work they chose and rehearsed; a real task is the work you assigned and they hadn't seen. Someone who only knows the demo problems will still freeze on the real ones.

And it watches **both the result and the path**. Finishing the work is half of it. The other half: which route did they take? Did they cut a corner and skip a check they were supposed to run? Did they touch something they shouldn't have? A person who got the answer right by breaking the rules the whole way carries a very different risk than one who got there cleanly.

Hold onto those three parts. Everything below — unit tests, regression tests, edge cases, evals — is at bottom an answer to "how do you run that probation period well."

## Definition

Start with the basics, assuming nothing.

A **test** feeds a piece of code some input and checks that the output is what you expect. The most common way to slice tests is by how big a chunk they cover, and the picture is called the test pyramid — a pyramid because the lower layers should be the most numerous and the top the fewest.

- **Unit test.** Covers the smallest unit, usually one function. Take `calcDiscount(price, coupon)`: you feed in a price and a coupon and assert the discounted total comes out exactly right. Unit tests are fast, cheap, and precise — when one breaks, you know which function is wrong. This is the wide base of the pyramid, and it should hold the most tests.
- **Integration test.** Covers a few modules working together. Every function passing on its own doesn't mean they're correct once wired up: checkout calls the coupon module and then the inventory module, and whether the field names, units, and states line up across the three is exactly what unit tests can't see.
- **End-to-end test (E2E).** Simulates a real user walking a whole critical flow start to finish — "add to cart, enter a code, place the order, see the right amount due." It's the closest to reality and also the slowest and most brittle, so it sits at the top of the pyramid, reserved for the few flows that matter most.

Two more terms sit outside the pyramid and carry most of this chapter.

A **regression test** makes sure that the old features you finished long ago, the ones that must not break, survive a new change. "Regression" is the good thing sliding back to broken. The defining trait is that it should stay green more or less forever — the moment one goes red, the signal is unambiguous: this change broke something it had no business touching. Anthropic draws the line cleanly between this and a capability check: a capability eval asks "what can this agent do well," should start at a low pass rate, and gives the team a hill to climb; a regression eval asks "does it still handle what it used to," should sit near 100%, and a drop means something broke [A10b].

An **edge case** is everything off the normal path. Once code is flowing, the easy trap is to cover only the "all is well" path, while real-world bugs almost all hide at the edges: empty data, insufficient permissions, a network failure mid-request, a double-click that submits twice, an input that's far too long or too large. Listing these out and writing one test each is where testing skill actually shows.

That completes the old definition: use executable assertions to pin down how the code is supposed to behave, so any change gets re-checked automatically. The next section is where the weight shifts once an agent is the one writing the code.

## Why it matters

The old testing discipline was built for humans writing code. People tire, slip, and forget an edge, so we net those mistakes with tests. Agents don't slip the same way, but they fail in new ways, and the weight of testing follows.

**Tests move from after-the-fact acceptance to up-front spec.** Tests used to be written after the code. With agents, writing down "what counts as correct" first pays off more, because that criterion is the task spec you hand the agent. Anthropic noticed a concrete payoff: two engineers reading the same initial spec can come away with different reads on how edge cases should be handled, and an eval suite resolves that ambiguity outright [A10b]. Put plainly, the act of writing edge cases forces you to make the task precise — does an expired coupon count as used, does a refund return the discount — and anything you don't put in the check, the agent is left to guess.

**An eval is a thing you design, debug, and reuse, not a one-time score.** Three words worth keeping apart. A **test** is the old engineering staple. A **benchmark** is a standardized problem set for comparing models against each other (SWE-bench Verified, say). An **eval** is the check you build for your own agent and keep alive. OpenAI lays out one run as a clean chain: a prompt → a captured run (trace plus artifacts) → a small set of checks → a score you can compare across versions [O5]. The weight is on "keep alive" and "compare across versions": a model upgrade, a prompt change, a skill iteration — you measure each against the same check to see if it got better or worse, instead of going by feel and saying "this one seems faster." Anthropic makes the same point a different way — the value of evals compounds, with the cost visible up front and the benefit accruing later [A10b].

**The weight shifts from "is the code right" to "is this agent trustworthy."** Whether the code is right is still a unit test's job. But agents bring problems beyond the code, and those are precisely what the old tests can't see: did it understand the task (or build something adjacent that isn't what you asked), did it overstep (touch a file or call a tool it shouldn't have), did it skip verification (the work looks done, but it never ran the tests). This is why OpenAI splits the grading goals into four rather than scoring the result alone: **outcome** (did the task complete), **process** (did it call the tools and follow the steps you intended), **style** (does the output follow your conventions), and **efficiency** (did it get there without thrashing — looping, re-running commands, burning tokens) [O5]. You can't sign off on an agent by looking only at the final artifact; you have to see how it got there.

**AI-written code over-covers the main path and skips the edges; AI-written tests tend to flatter the implementation.** Defend against these separately. The first: when an agent writes the implementation, it'll usually nail the happy path and miss expired, over-limit, and concurrent cases — so edge cases are not less important in the agent era, they're more something a human has to backstop by listing in full. The second is sneakier: an agent that writes both the implementation and its tests tends to write tests that pass that exact implementation — get the implementation wrong and the tests go wrong with it, both covering the bug, all green, and you've been fooled. Anthropic offers a related hard lesson: if a task passes 0% of the time across many attempts (0% pass@100), with a frontier model that usually signals a broken task or grader, not an incapable model [A10b]. The reverse holds too — all green isn't proof of correct.

**Don't read infrastructure noise as a weak model.** This is the costliest misjudgment in agent testing. An agent has to really install dependencies, really run tests, really spawn subprocesses, which makes the runtime part of the problem rather than a passive backdrop. Anthropic put numbers on it: on Terminal-Bench 2.0, infrastructure configuration alone moved scores by 6 percentage points (p < 0.01) — enough to swamp the gap between top models on the leaderboard — and under strict resource limits about 5.8% of tasks failed from infrastructure errors, not the model [A11]. They had a fitting line for it: a few-point lead "might signal a real capability gap — or it might just be a bigger VM" [A11]. For you that means a flaky test, a failed dependency install, or a hiccuping runner should not be scored as "the agent's no good." Isolate the environment noise first, then argue about whether the model was right.

## In practice

Turn the above into something you can actually run.

**Define "correct" before the agent runs.** Write down the acceptance criteria before you hand off the task, and make them executable where you can. OpenAI's advice is plain: define success before you write the skill, list the must-pass checks across outcome / process / style / efficiency, and keep the list small and focused on what you care about most [O5]. That's your probation scorecard.

**Take "coupon checkout" and list the edges in full.** The main path is one line: valid coupon plus normal order yields the right discounted total. The value is in the edges below, each deserving a test watching it:

- **Expired coupon:** can it still be used past its validity date?
- **Reuse:** a one-time coupon applied twice in one order, or reapplied on a retry after a failed order — does it get counted twice?
- **Refund:** on a refunded order that used a coupon, how is the discount handled, and how do inventory and the coupon balance roll back?
- **Discount exceeds total:** a 50-unit coupon on a 30-unit order — does the amount due go negative?
- **Currency:** when the coupon's denomination and the order currency don't match, how is it converted? (If the platform stores money in its smallest unit, this is where a unit error sneaks in.)
- **Stacking:** can a membership discount and a coupon stack, and in what order are they applied?
- **Concurrency:** a limited coupon grabbed by several requests in the same instant — did it over-issue?

Of these seven, the ones a frontier model is likeliest to miss when writing the implementation are the later ones — refund rollback, the negative-total guard, concurrent over-issue. Listing is the part a human should own more than the agent.

**Lead with deterministic checks; add a rubric where things get fuzzy.** Use deterministic grading where you can — it's fast, cheap, reproducible, and easy to debug. OpenAI's approach: capture what the agent actually did this run as a structured event stream with `codex exec --json`, then write deterministic checks that ask "did it really run `npm install`," "did it really create `package.json`," rather than just eyeballing whether the final output looks right [O5]. For the genuinely subjective parts — code quality, whether the style matches your conventions — have a model grade against a clear rubric. Anthropic sorts graders into three you can mix: deterministic code graders (string match, unit tests, static analysis), model graders (rubric scoring, natural-language assertions), and human graders (the gold standard but the most expensive, used to calibrate the model ones) [A10b].

**Grade what it produced, not the path it took.** Anthropic makes this point repeatedly, and it's what keeps an eval from breaking: there's an instinct to check that the agent followed a specific sequence of tool calls, but that check is too rigid and too brittle — agents regularly find valid approaches the designer didn't anticipate [A10b]. So as not to punish that, grade the final output most of the time, not whether it walked your exact steps. The exception: when "oversteps" or "skips verification" is itself what you're guarding against, the path is the thing to check (for instance, "did it claim done without running the tests").

**Keep a negative control.** A detail in O5 that's easy to skip: include a case where the skill should *not* fire, to catch false positives — the over-eager agent that scaffolds a whole new project when the user only wanted a small change [O5]. Mapped to checkout: don't only test that a discount applied when it should; test that nothing got discounted when it shouldn't, or you'll tune up something that discounts everything it sees.

**Start every trial from a clean environment.** Agent behavior is already non-deterministic; add a noisy environment and the results stop being readable. Anthropic insists on starting each trial from a clean environment with no leftover files or cached shared state — they've even seen Claude gain an unfair edge by reading the git history left by a previous trial [A10b].

## Case

**A take-home that worked for roughly 18 months, retired by one model upgrade.** From late 2023, Anthropic's performance engineering team hired with a take-home: a Python problem simulating a fake accelerator (close to TPU architecture), asking candidates to optimize a parallel tree traversal using manually managed scratchpad memory, VLIW instruction packing, SIMD vectorization, and multicore parallelism. It held up for about 18 months across 1,000-plus completions, and the hires it produced included engineers who brought up the Trainium cluster and shipped every model since Claude 3 Opus [A19].

Then the models caught up. By Claude Opus 4, it outperformed most human applicants within the time limit; by Opus 4.5, it matched even top human performers inside the two-hour window [A19]. A problem that had screened over a thousand people stopped discriminating.

What's instructive is how the author, Tristan Hume, built the next version: he used the very AI under test to find its own weak spots — running Claude Opus 4 on the problem, watching where it struggled, and making that struggle the starting point for the new one [A19]. That route wasn't a permanent fix either. His "data transposition" problem, drawn from real kernel optimization work, met an unanticipated solution from Opus 4.5 — it transposed the computation rather than the data — and it kept finding new solutions even after he patched [A19]. The lesson isn't "AI is too strong to write problems for." It's that when the examiner and the examinee are the same AI, writing the exam becomes a continuous, adversarial loop.

**Designing an eval for an agent is harder than it looks — two cases of a wrong verdict.** First: on a flight-booking benchmark (τ2-bench), Opus 4.5 solved a booking problem by exploiting a loophole in the policy, and its solution was actually better for the user — but against the grading as written, it "failed" [A10b]. The model wasn't wrong; the problem didn't anticipate a better answer. The second is subtler: Opus 4.5 initially scored 42% on CORE-Bench, and an Anthropic researcher who dug in found the grading itself was at fault — rigid checking that marked `96.12` wrong (the answer was `96.124991…`, and the model had it right), plus some ambiguous task specs and some tasks too stochastic to reproduce exactly; after the bugs were fixed and a less constrained scaffold was used, the score jumped to 95% [A10b].

Together these two are one warning: when the score won't climb, don't assume the agent is the problem — your task or grader may be broken. Anthropic made it a rule: don't take an eval score at face value until someone digs into the details and reads a few transcripts [A10b]. Reading transcripts isn't optional; it's the core skill of the craft.

## Anti-patterns

- **Treating a benchmark as production acceptance.** A model climbing from 40% to over 80% on SWE-bench Verified [A10b] is good news, but that's a standardized set for comparing models, not acceptance under your dependencies, permissions, network, and business rules. Real failures almost all come from those edges, not the standard set.
- **Letting the agent write both implementation and tests, then taking it on faith.** It'll write tests that flatter its own implementation; get the implementation wrong and the tests go wrong with it, both burying the bug. Edge cases and key assertions need a human's hand on them, or at minimum a human's review.
- **Testing only the main path.** Coupon checkout tested only for "valid coupon, normal order," with expired, over-limit, refund, and concurrency all untested. AI-written implementations especially love to skip these, and a green main path doesn't mean you're safe.
- **Scoring infrastructure noise as a weak model.** A flaky test, a failed dependency install, a hiccuping runner — and you conclude "this model's no good." Isolate the infrastructure noise first; that small leaderboard gap might just be a bigger VM [A11].
- **Locking the tool-call order.** Writing the eval as "must follow these steps," so the agent that found a better valid path gets marked wrong [A10b]. Grade the output most of the time, not the path — unless oversteps and skipped checks are exactly what you're guarding against.
- **Writing the eval once and walking away.** Treating it as a one-time asset instead of adding cases as real failures come in. It should be a living list — every pothole you hit in production becomes a new row [O5][A10b].

## Checklist

- Before handing off, did I write "what counts as correct" as an executable criterion, instead of eyeballing it afterward?
- Are my edge cases listed in full? (Empty data, insufficient permissions, network failure, double submit, extreme input — for checkout: expired, reuse, refund, over-limit, currency, stacking, concurrency?)
- Beyond the outcome, does my eval watch the process (oversteps? skipped checks?) and efficiency (thrashing, re-running commands)?
- For tests the agent wrote, have I reviewed the key assertions and edge cases, or did it write and grade its own work while I took delivery?
- For this failure, did I tell apart a wrong model from infrastructure noise — flaky test, dependency, runner?
- Does each trial start from a clean environment, with no leftover state quietly helping or sinking it?
- When the score won't climb, did I actually read a few transcripts to confirm it's the agent and not the grader?

## Self-test

- Last time you ran an agent, did you write "what counts as correct" before letting it go, or did you improvise "is this done?" only after it finished?
- Hand someone the "coupon checkout" scenario — can they list seven or eight edge cases on the spot? Which ones is an AI implementation likeliest to skip?
- The last time you said "this model's no good," had you actually read the transcripts to confirm it, or could you have just hit a smaller VM and a flaky test?
