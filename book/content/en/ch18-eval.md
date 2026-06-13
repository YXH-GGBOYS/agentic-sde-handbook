---
id: ch18
order: 18
part_zh: 第四卷 · Harness 工程专章
part_en: Part IV · Harness Engineering
title_zh: Eval：没有评估就没有自治
title_en: Eval: No Eval, No Autonomy
sources: [A10b, A19, O4, O5]
---

You'll let an agent edit its own files, run its own commands, and open its own PRs only if you trust it. Where does that trust come from? Not from one polished demo it showed you, but from a mechanism that keeps telling you how it's actually doing on real work. That mechanism is the eval. Without it, autonomy is flooring the gas with your eyes shut.

An eval is not a test. A traditional test asks one question: did the code work as expected? An agent eval asks several more: did it actually understand the task, did it overstep, did it burn the whole budget, did it skip the verification it was supposed to run, did it stop and ask for help when it was unsure? No eval, no autonomy.

## Everyday analogy

When you hire someone, the last thing you should trust is the performance they put on during the interview. Everyone brings their best self to an interview — rehearsed problems, memorized answers, temper deliberately tucked away. What actually tells you whether the person is reliable is the trial period: hand them a stack of real tasks, let them work for three months, and watch a few things the interview can never show you.

Did the work come out right — is what they hand back actually usable, or does it just look the part and fall over the moment it ships?

Did they overstep — when you asked them to change the front-desk pricing, did they also reach into the back-end customer database? When they should have asked, did they?

Did they waste anything — for the same job, did they finish by lunch, or did they thrash back and forth and burn a week's budget on something that should have taken an hour?

Do they ask for help when unsure — when stuck, do they stop and ask, or guess a direction, run with it head-down, and hand back a pile of wrong work?

A trial-period review is not a pass/fail box. It's a multi-column table. A person can do the work right but be expensive; another can be fast and cheap but touch things they shouldn't have. Scoring those columns separately is the only way to know whether you should hand this person bigger jobs and more access next time. An eval is that review table, designed for an agent. What you're scoring is never just "did it get this one right" — it's whether its overall behavior on real work earns it more autonomy.

## Definition

An evaluation is a test for an AI system: give it an input, then apply grading logic to its output to measure success [A10b]. That's the plain definition, and agents stretch it.

Single-turn evals are simple — a prompt, a response, some grading logic — and that was enough for earlier language models [A10b]. Agents aren't single-turn. They call tools across many turns, modify state in the environment, and adapt as they go, which means mistakes can propagate and compound [A10b]. So an agent eval grades not just the final response but the whole trajectory plus the final state.

A few terms first, so the rest reads cleanly (all in this Anthropic article's sense [A10b]):

- A **task** is a single test with defined inputs and success criteria; also called a problem or test case.
- A **trial** is one attempt at a task. Because outputs vary run to run, you run multiple trials to get a stable result.
- A **grader** is the logic that scores one aspect of the agent's performance. A task can carry several graders, each holding multiple assertions (checks).
- A **transcript** is the complete record of a trial — outputs, tool calls, reasoning, intermediate results. Also called a trace or trajectory; in this book's terms, the security-camera footage.
- The **outcome** is the final state of the environment when the trial ends. A booking agent might say "Your flight has been booked" at the end of the transcript, but the outcome is whether a reservation actually exists in the environment's database [A10b]. Those two can disagree — it claims success, the database is empty, that's still a failure.
- An **evaluation harness** is the infrastructure that runs evals end to end: hands out instructions and tools, runs tasks concurrently, records every step, grades, and aggregates. Note it's a different layer from the agent harness — the scaffold that lets a model act as an agent. When you evaluate "an agent," you're evaluating the harness and the model together [A10b].

The line that's easiest to miss: a traditional test mostly checks whether the outcome is right; an agent eval also reads the transcript — how it got there. Because for something that acts on its own, "got there correctly" and "happened to luck into the right answer" are two different things, and the second one will eventually blow up on the run you weren't watching.

## Why it matters

When teams first start building agents, a mix of manual testing, dogfooding, and intuition gets them surprisingly far [A10b]. At that stage, building proper evals can even look like overhead that slows shipping [A10b]. It breaks down once the prototype phase is over, the agent is in production, and it starts to scale [A10b].

The breaking point usually looks like this: users start reporting the agent "feels worse since the last change," and the team is flying blind, with no way to verify except guess and check [A10b]. Without evals, debugging is reactive — wait for complaints, reproduce by hand, fix the bug, and hope nothing else regressed [A10b]. The team can't tell a real regression from noise, can't run hundreds of scenarios automatically before shipping, and can't measure any improvement [A10b].

It also throttles how fast you can adopt a new model. When a stronger model drops, a team with no evals faces weeks of testing; a competitor with evals can quickly learn the model's strengths and weaknesses, tune their prompts, and upgrade in days [A10b].

The intuition most worth dropping is that "agent work is like code — right is right, wrong is wrong." Frontier models find creative solutions that exceed the limits of a static eval [A10b]. Anthropic gives a sharp example: on a τ2-bench flight-booking task, Opus 4.5 solved it by discovering a loophole in the policy — by the eval as written it "failed," but it actually came up with a better solution for the user [A10b]. This is exactly what makes agent evals harder than traditional tests: when the thing under evaluation is smarter than your criteria, "marked as a failure" and "actually wrong" stop being the same thing.

For that reason, an eval shouldn't be a one-off score. It's a capability you can design, debug, and reuse [O5]. OpenAI puts it concretely: an eval, unpacked, is "a prompt → a captured run (trace + artifacts) → a small set of checks → a score you can compare over time" [O5]. Trade "does it feel better?" for "the score went from 71 to 78 and the regression set didn't drop," and now you have something you can act on.

## In practice

Putting the trial-period review into engineering terms gives you six dimensions. Not every agent needs all of them, but you should hold the table in your head and know which columns you're scoring and which you're skipping.

| Dimension | What it scores | Typical graders |
|---|---|---|
| Outcome quality | Is the artifact correct and usable | Unit tests, outcome state check |
| Process quality | Any dangerous actions, any skipped steps | Transcript analysis, tool-call check |
| Safety | Overreach, touching data it shouldn't | Permission/overreach checks, artifact review |
| Efficiency | Is the cost reasonable, any thrashing | Token usage, turn count, command count |
| Recoverability | After a failure, can a person/agent take over | Trace completeness, state persisted to disk |
| Environment noise | Did this fail from the code or from flaky infra | Environment isolation, cross-trial independence |

That last column deserves a sentence on its own. Each trial should start from a clean environment and be isolated from the others [A10b]. Shared state left between runs — leftover files, cached data, resource exhaustion — produces correlated failures from infrastructure flakiness that have nothing to do with the agent's capability [A10b]. Shared state can also inflate scores the other way: in internal evals, Anthropic observed Claude gaining an unfair advantage on some tasks by reading the git history left by previous trials [A10b]. If you don't control this column, the scores in the other five are dirty.

For the graders themselves, three kinds each earn their keep, and you combine them [A10b]:

- **Code-based graders** (fast, cheap, objective, reproducible, easy to debug): string matching, binary pass/fail tests, static analysis, outcome verification [A10b]. Their weakness is brittleness — a valid variation that doesn't match your expected pattern gets wrongly failed [A10b].
- **Model-based graders** (flexible, scalable, good at nuance): rubric scoring, natural-language assertions, pairwise comparison [A10b]. The cost: non-deterministic, more expensive than code, and only trustworthy once calibrated against human grading [A10b].
- **Human graders** (gold standard, but slow and expensive): SME review, spot-check sampling, A/B testing [A10b]. Their main job is to calibrate that model-based grader [A10b].

One counterintuitive but important grader lesson: don't fixate on whether the agent followed a specific sequence of steps. Anthropic found that "tools must be called in this order" checks are too rigid and yield brittle tests — agents regularly find valid approaches the eval designer didn't anticipate [A10b]. Grade what the agent produced, not the path it took [A10b]. That matches the trial-period instinct: you accept the work, not whether they used the wrench you'd have used.

Build the task set to cover both sides: test that a behavior fires when it should, and that it doesn't fire when it shouldn't [A10b]. Test only one side and your optimization goes one-sided too — reward "search when you should" alone and you end up with an agent that searches for almost everything [A10b].

And split capability evals from regression evals [A10b]:

- A **capability eval** asks "what can this agent do well?" It should start at a low pass rate, aimed at tasks the agent struggles with, giving the team a hill to climb [A10b].
- A **regression eval** asks "does it still handle what it used to?" Its pass rate should be near 100%, and a drop signals something broke [A10b]. Once a capability eval is optimized to a high pass rate, it can "graduate" into the regression suite and run continuously to guard against backsliding [A10b].

Finally, an eval doesn't live alone. OpenAI describes a closed loop: traces show what happened, human and model feedback explains what mattered, evals make those expectations reusable, and then Codex (or whatever execution agent) actually makes the change [O4]. Trace plus human-in-the-loop plus eval, wired into a circle, is the flywheel that keeps an agent improving — a trace alone is footage no one watches, an eval alone is a stale exam no one maintains.

## Case

**A loophole that helped the user, scored as a failure.** The τ2-bench flight-booking task is worth reopening. Opus 4.5 found a hole in the policy and used it to solve the task — a better result for the real user, but by the eval as written, a "failure" [A10b]. That's not the agent's fault; it's the eval's criteria failing to keep up with a subject smarter than the criteria are. So a rule falls out of it: don't take a score at face value. Someone has to climb inside the eval and read a few transcripts to confirm the failure is fair — that it's clear what the agent got wrong and why [A10b].

**96.12 marked wrong, when the expected answer was 96.124991…** The same article has a sharper one. Opus 4.5 initially scored 42% on CORE-Bench, until an Anthropic researcher dug in and found a pile of problems: grading rigid enough to mark "96.12" wrong because it expected "96.124991…," plus ambiguous task specs and stochastic tasks that were impossible to reproduce [A10b]. After fixing those bugs and using a less constrained scaffold, Opus 4.5's score jumped from 42% to 95% [A10b]. Same model, a 53-point swing, all of it in the eval itself. Which is why you don't trust an eval score at face value until someone has dug into the details and read some transcripts [A10b].

**From roughly 30–40% to over 80% in a year, nearing saturation.** SWE-bench Verified hands an agent a batch of GitHub issues and grades by running the test suite — a solution passes only if it fixes the failing tests without breaking the existing ones [A10b]. Over the past year, frontier models went from around 30% to nearing saturation above 80% on it (the same article elsewhere frames the same climb as "40% to >80% in one year") [A10b]. The closer to saturation, the slower progress looks, because only the hardest tasks are left [A10b]. There's a trap hidden here: near saturation, a large capability gain shows up as a small bump in the score [A10b]. The code-review company Qodo was initially unimpressed by Opus 4.5 precisely because their one-shot coding evals couldn't capture its gains on longer, more complex tasks; they then built an agentic eval framework that gave a much clearer picture of progress [A10b].

**A problem that ran for ~18 months and screened 1,000+ candidates, retired by one model upgrade.** Starting in late 2023, Anthropic's performance team designed a take-home: a Python simulator for a fake accelerator resembling TPU architecture, asking candidates to optimize a parallel tree traversal, given 4 hours at first and later cut to 2 [A19]. The problem worked well for about 18 months, was completed by over 1,000 people, and the engineers hired through it carried a good deal of Anthropic's infrastructure [A19]. Then the models caught up: by Opus 4, it outperformed most human applicants within the time limit; by Opus 4.5, it matched even top human performers in the 2-hour window [A19]. A good problem, validated by a thousand candidates over a year and a half, was punched straight through by a single Opus 4 → 4.5 upgrade [A19]. The lesson for anyone building evals: capability keeps climbing, your exam expires faster than you think, and an eval is a living asset to maintain, not a one-time purchase.

## Anti-patterns

- **Eval theater.** Wheeling out a few good-looking, hand-picked demo cases as the "eval," and declaring the agent fine once they pass. A real eval is built from real failure samples, edge cases, and regression cases [A10b]: turn user-reported failures from your bug tracker and support queue into test cases [A10b], and test both directions (should-trigger / should-not) [A10b], instead of staging a show with problems you already know it'll pass.
- **Taking scores at face value.** Seeing a number and believing it, without reading the transcript. The 96.12 and flight-booking examples show a low score can be a bug in the eval, not the agent's fault. The rule: don't trust a score until someone has dug into the details and read some trajectories [A10b].
- **Grading outcome only, never process.** Checking whether the artifact is right but not how it got there. For something that acts on its own, "lucked into right" and "actually right" look the same in the score, but the first one fails on the run you weren't watching. Grade the transcript: which tools it touched, whether it skipped verification, whether it overstepped.
- **Graders that fixate on steps.** Demanding a fixed tool-call order, then watching the tests shatter at a touch — agents keep finding valid paths you didn't anticipate [A10b]. Grade the output, not the path [A10b].
- **A one-off demo treated as a permanent verdict.** An eval that passes today doesn't mean it passes on the next model, or six months from now. Capability climbs, exams expire [A19]. An eval is a living asset that needs an owner and ongoing maintenance [A10b].
- **Autonomy with no eval.** Letting an agent write files, run commands, and open PRs with no acceptance or regression check. The line this book keeps hitting: no eval, no autonomy.

## Checklist

- Is my eval built from real failure / edge / regression samples, or a few good-looking cases I know it'll pass?
- Am I scoring only "is the outcome right," or also the process (overreach, skipped verification, thrashing)? Which of the six columns am I missing?
- Does the grader score **what the agent produced**, or fixate on **the path it took**?
- Are capability and regression evals split? Is the regression suite near-100% pass, alarming on any drop?
- Have I isolated the environment — each trial from a clean start — so a failure can be pinned on code versus infra?
- When I see a score, do I take it at face value, or dig in and read a few transcripts to confirm the failure is fair?
- Are trace, feedback, and eval wired into a loop that keeps improving the agent, or are the three sitting apart?

## Self-test

- Last time you said "this agent does well," was that based on a few demos it ran for you, or an eval you can re-run and score against last time?
- If someone challenges whether a given agent failure was "the model's fault or the environment's," can you settle it from the trace on the spot? If not, your eval's environment isolation isn't done.
- Does the autonomy you've granted the agent match the eval coverage you have on it? If its permissions far exceed what you can actually verify, that surplus autonomy is gas you're flooring with your eyes shut.
