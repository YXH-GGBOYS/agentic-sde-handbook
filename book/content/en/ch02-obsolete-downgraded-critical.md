---
id: ch02
order: 2
part_zh: 第一卷 · 格局重置
part_en: Part I · The Reset
title_zh: 什么过时了，什么降级了，什么反而更重要
title_en: What's Obsolete, What's Downgraded, What Matters More
sources: [S7, S1, S4, A1]
---

When a technology drops the cost of one task, the thing that actually gets repriced isn't that task. It's the ring of skills around it. Fast typing used to be worth money; word processors ended that. But "knowing what to write" became worth more, not less, because typing fast also means producing nonsense fast.

AI has driven down the cost of one step: turning an idea into code that runs. So this chapter answers a practical question. Of the skills you used to take pride in, which ones lost their value overnight, which merely dropped in weight, and which went up? Sorting your skills into those three buckets is far more useful than announcing that "the AI era is here."

## Everyday analogy

Think about buying groceries, and how that has changed over a few decades.

At an old open-air market, two skills were worth real money: **haggling** and **picking**. The vendor opens at eighty cents, you grind him down to fifty — that's cash in your pocket. And out of a pile of tomatoes, you can spot the ripe, juicy ones and skip the ones that look glossy but are hard inside and taste like nothing — that's experience. Of the two, haggling was the showier skill. Whoever was quick-tongued, thick-skinned, and willing to push won visibly, on the spot, in front of everyone.

Then the supermarket arrived, with prices on labels. Haggling collapsed overnight. The tag says five dollars; you can argue till you're hoarse and it's still five dollars. Your bargaining power went straight to zero. At the same time, the other two skills became worth more.

The first is **picking and inspecting**. The shelf now holds seven or eight kinds of the same tomato — imported, local, organic, force-ripened — at a spread of prices, and the cheap bin is salted with hard ones, waxed ones, ripened-without-flavor ones. More choice came with more cheap traps. The money a good picker saves, and the bad buys a poor one eats, dwarf the thirty cents anyone ever haggled off. The second is **knowing what the meal is supposed to become**. Whether you're making borscht or a cold salad decides which tomato you should buy. Without a clear goal, a wall of options just makes you buy more, buy wrong, buy badly.

That's the three buckets of this chapter. Haggling went **obsolete** — fixed prices zeroed out your bargaining power. Sharp-eyed rummaging still helps, but it got **downgraded**: the legwork of comparison matters less than knowing how to pick. And picking, inspecting, and knowing what you're cooking became **worth more** — precisely because there are more options and more cheap traps. AI is to writing code what the supermarket is to groceries: it zeroes out some skills that used to win in plain sight, and it pushes the quieter judgment that actually decides the outcome to the front.

## Definition

Let me pin down the three buckets so "obsolete / downgraded / more important" doesn't degrade into a slogan.

**Obsolete** means a practice or belief that no longer holds under the new cost structure, where keeping at it now actively loses you something and should be replaced. Not "used less" — "wrong to keep using."

**Downgraded** means a skill that's still useful, sometimes still decisive, but carries less weight in your portfolio. It used to be worth heavy, dedicated practice; it's no longer worth treating as your edge. It hasn't vanished. It's just no longer where you pull ahead of the next person.

**Appreciated** (matters more) means a skill whose marginal value went up: because other steps got faster and cheaper, this one became the new bottleneck or the new scarcity. To sort any skill into a bucket, one question does the work: when turning an idea into code is nearly free, is this skill replaced by that, or made scarcer because of it?

One hinge in this frame is worth naming on its own, because it runs against instinct. **Faster generation amplifies mistakes faster.** A vague requirement, a missing acceptance check, a contract you got wrong — these used to spread slowly, bottlenecked by a human typing them in. Now an agent copies them into a dozen files and across a whole PR in minutes. So the value of the skills that hit the brakes — constraints, verification, governance — goes *up*, not down. The faster you move, the more the brakes are worth.

## Why it matters

Here are the common old beliefs, one at a time, each with why it's obsolete and what to do instead.

**"Write the spec once, then build to it."** Obsolete. It assumes you can think the requirement through completely before you start. But once building is nearly free, the better move is to have an agent stand up a rough working version first, use it as a probe to surface the edges you didn't anticipate, then go back and revise the requirement. Anthropic's own guidance for Claude Code bakes this into a workflow: explore, then plan, then code — separating research and planning from implementation, on the explicit grounds that "letting Claude jump straight to coding can produce code that solves the wrong problem" [A1] (first-party). What to do instead: treat the spec as a draft that changes as you explore, not a contract you sign once and build to the letter.

**"A programmer just writes code."** Obsolete. When the writing step is nearly free, value moves to what surrounds it — defining the problem, choosing the architecture, writing the spec, setting acceptance criteria, doing QA, reviewing the diff. Simon Willison listed what senior engineers actually do all day when they're getting real work out of agents: researching approaches, deciding high-level architecture, writing specifications, defining success criteria, designing agentic loops, planning QA, and "spending so much time on code review" [S1] (secondary). His point: almost all of these were already the marks of a senior engineer. What to do instead: redefine your job as the person accountable for the output, not the person at the keyboard.

**"Test last."** Obsolete, and now more expensive. Without tests, an agent will cheerfully claim it verified something it never ran, and one change can quietly break an unrelated feature without you noticing. Willison puts automated testing at the top of the practices agents benefit from, and notes that test-first development is especially effective with an agent that iterates in a loop [S1]. Anthropic is blunter: give Claude a check it can run itself — tests, a build, a screenshot comparison — and the loop closes on its own; it does the work, runs the check, reads the result, and iterates until it passes [A1]. What to do instead: make an executable acceptance check a precondition for handing off work, not a closing chore.

**"Thicker docs mean more professionalism."** Downgraded, with a twist. A pretty paragraph written for humans — "we hold code quality in the highest regard" — does almost nothing for an agent, which needs concrete rules it can act on directly. But concise, accurate, machine-readable documentation became worth *more*: Willison notes that feeding the model the right documentation lets it use APIs from elsewhere without reading the source first, and that with good docs the model can sometimes build a matching implementation from that input alone [S1]. What to do instead: not thicker, but more precise, shorter, and more executable.

**"We use AI, so we're ahead."** An obsolete self-comfort. The tool isn't the outcome. The S4 piece describes a repeatedly observed "two steps back" pattern: fixing one bug with AI often spawns several new ones [S4] (secondary). It also names the "demo-quality trap" — the happy path looks great in a demo and falls apart under real use [S4]. Using AI is a starting point; whether the work is good is a separate question. What to do instead: judge by results — is production steadier, is maintenance cheaper — not by the fact that you adopted an agent.

Next, the **downgraded** bucket — still useful, but stop investing in it as your edge:

- **Fluency at hand-writing boilerplate.** Banging out a CRUD layer, a set of form validations, a block of scaffolding with your eyes closed used to signal skill. That's exactly the part an agent does best, and does first. Useless now? No — you still have to read and review it. But the return on "I hand-write it faster than the next person" has dropped.
- **Memorizing API details.** Holding a library's dozens of function signatures, argument orders, and counterintuitive defaults in your head used to save you trips to the docs and made you look fluent. An agent recalls all of it instantly. The memory does no harm, but it's no longer where you separate from the pack.
- **The local-IDE personal-productivity cult.** Tuning autocomplete, shortcuts, and snippets to the limit, chasing more lines typed per minute — that "personal hand speed" story is losing weight. The bottleneck is moving from "how fast can one of me type" to "how many agents can I delegate to and accept work from in parallel, and answer for their output."

Finally, the **appreciated** bucket — these became the new bottlenecks because the steps around them got faster and cheaper: problem definition, the reversibility of architecture, the clarity of contracts, maintainability, verification and rollback, and judgment. The next section is how to practice them.

## In practice

Turn the frame above into a few concrete moves:

1. **Write the acceptance check before you hand off, not the tests after.** Make "what counts as done" a check the agent can run itself — a test suite, a build exit code, a script that diffs output against a baseline. Anthropic's wording: give Claude something that produces a pass or fail, and the loop closes on its own [A1].
2. **Explore, then plan, then code.** When you're unsure of the approach, the change touches several files, or you don't know the code, have the agent read-only investigate first, then make a plan you review, then let it write [A1]. If you could describe the diff in one sentence, skip the plan [A1].
3. **Externalize constraints; don't cram them into the prompt.** When speed goes up, the brakes have to be hard. Which directories are off-limits, which commands are banned, which domains are allowlisted — push these into the tool layer, the permission layer, and CI gates, not into polite requests in a prompt.
4. **Keep an undo path.** Heavy automation needs reversibility. Claude Code snapshots files before each change so you can rewind to any checkpoint, or just tell it to undo the last step [A1] — but the docs are explicit that checkpoints only track Claude's own changes and aren't a replacement for git [A1].
5. **Practice picking, not haggling.** Spend the time you saved on judging options: Is this approach reversible? Is this contract clear? Will this still be maintainable in six months? That's the supermarket-era skill of picking and inspecting.

## Case

**METR's randomized controlled trial: perception and measurement disagreed.** This is the first-party measurement most worth taking seriously on whether AI actually speeds up or slows down experienced developers, run by METR (we're relaying it secondhand). The design is solid: 16 experienced open-source developers working real issues — bug fixes, features, refactors — in mature repos they'd contributed to for years, averaging 22k-plus stars and over a million lines of code; 246 issues in all, each task averaging about two hours; every issue randomly assigned to allow or disallow AI, with screens recorded throughout [S7]. The tools were primarily Cursor Pro with Claude 3.5/3.7 Sonnet — frontier models at the time [S7].

The result was counterintuitive: when allowed to use AI, the developers took **19% longer** to finish their issues [S7]. The more telling part is the gap between perception and reality. Beforehand, the developers expected AI to speed them up by about **24%**. After living through the slowdown, they **still estimated** AI had sped them up by about **20%** [S7]. Slowed down, and sure they'd been sped up.

This case carries two lessons for the chapter. First, "generates faster" is not "ships faster." With expert developers, on code they know deeply, in complex repos, the back-and-forth of checking, correcting, and dealing with unreliable output can eat the typing time you saved. That's exactly the point that faster generation raises the value of verification and constraints. Second, **your gut is not trustworthy; you have to measure** — which is itself one more reason the verification skills gained value.

Read the result's boundaries carefully, and don't over-extrapolate. METR says so plainly: this is "a snapshot of early-2025 AI capabilities," with experienced developers on mature codebases they know deeply. The authors explicitly do *not* claim those developers or repos represent the majority of software work, nor that the finding generalizes to less experienced developers, unfamiliar codebases, or domains outside software development [S7]. The page later carries an update noting that in February 2026 they published new data on late-2025 tools [S7]. So the right reading is: this evidence is a sharp reminder that "faster" is a hypothesis you have to verify — *not* a verdict that "AI always makes people slower." Treating one early snapshot of a specific group as a law is the same error in the opposite direction.

**A mild but pointed counterweight.** In the S4 piece, Gergely Orosz cites a very old figure for contrast: Fred Brooks, in 1975, estimated software time as roughly one-third planning, one-sixth coding, one-quarter component testing, one-quarter system testing; Orosz's own modern estimate is about 20% planning, 40% coding and tests, 20% code review, 20% production readiness [S4] (secondary). Half a century apart, coding itself was never more than a slice. As the article puts it: software quality was never primarily limited by coding speed [S4]. That's the undertone of this whole chapter — AI compressed the slice that was already small, so the relative weight of the others went up.

## Anti-patterns

- **Mistaking generation speed for productivity.** You see the agent lay down a few hundred lines in minutes and assume you came out ahead. The S4 "two steps back" pattern is the warning: fixing one bug with AI often spawns several more [S4]. Count speed in net terms, not lines.
- **Reading "obsolete" as "useless," or "downgraded" as "throw it out."** A downgrade isn't a reset to zero. Boilerplate fluency carries less weight, but you still have to read and review the scaffolding an agent writes — and you can't accept what you can't understand. Letting the fundamentals rot is exactly how you lose the base that picking and inspecting rest on.
- **Treating "we adopted AI" as an accomplishment.** The tool isn't the outcome. "We use it, so we're ahead" is an obsolete self-comfort; the real test is whether production is steadier and maintenance is cheaper.
- **Treating one early snapshot as a permanent law.** The opposite trap is just as real: quoting METR's 19% everywhere to claim "AI makes people slower," ignoring its stated boundaries — early-2025, expert developers, codebases they know well [S7]. Over-extrapolation in either direction is the mistake.
- **Speed went up, the brakes didn't.** Generating faster without correspondingly stronger acceptance, constraints, and rollback is flooring the accelerator with the old brakes — exactly the configuration in which mistakes amplify fastest.

## Checklist

- Can I sort my own skills into the three buckets (obsolete / downgraded / appreciated)? Where has most of my recent time gone — which bucket?
- When I hand off work, is "done" a check the agent can run itself, rather than "looks right"?
- Are my constraints (off-limits paths, banned commands, network allowlists) enforced in the tool/permission layer, or only requested politely in a prompt?
- When something breaks, do I have an executable undo path (branch, snapshot, rollback)?
- Do I judge whether an AI use is working by results (steadier, cheaper to maintain), or by the self-comfort of "we adopted an agent"?
- When I quote an "AI slows/speeds people up" finding, do I state its boundaries — which tools, which population, which codebase?

## Self-test

- List your three strongest skills. For each, ask: when turning an idea into code is nearly free, is this one replaced, downgraded, or scarcer? Answer that, and you know where to put your time next.
- The last time AI let you finish something "fast," did you go back and measure the net gain — counting the checking, the rework, the traps? If you never measured, your read on your own speed may be sitting right inside the METR perception gap.
