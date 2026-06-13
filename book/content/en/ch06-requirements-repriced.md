---
id: ch06
order: 6
part_zh: 第二卷 · 软件工程基础与 AI 时代重校
part_en: Part II · Software Engineering Foundations, Recalibrated
title_zh: 需求与问题定义的重定价
title_en: Requirements & Problem Framing, Repriced
sources: [G3, A2]
---

Requirements used to be treated as a soft skill. The person who could read the boss's mind and write a clear spec got bonus points, but being vague wasn't fatal — execution was slow, so a wrong direction had time to surface and get corrected mid-flight. Once agents compressed the execution step, that buffer is gone. A vague task gets carried all the way to a wrong, confident finish. So "state the requirement clearly" graduates from a nice-to-have soft skill into a hard engineering skill that decides whether the work lands. This chapter first teaches what a requirement is and what good problem framing looks like, then explains why its price went up in the agent era.

## Everyday analogy

You're hungry and tell the place downstairs: "One fried rice."

The order goes to a new contractor who knows nothing about you, and all he hears is the literal two words. So he brings the cheapest, laziest thing on the menu — one egg, a few flecks of scallion, rice that's still a little raw, a portion that barely feeds one person, cilantro thrown on top, delivered twenty unhurried minutes later, by which point your hunger has passed.

He didn't do anything wrong. You said fried rice; he brought fried rice. What was wrong is the whole set of conditions you carried in your head and never said: enough for two people, not spicy, no cilantro, use day-old rice not raw grain, here within twenty minutes. You knew all of it — you just felt it "went without saying." But to someone who doesn't know your taste, "goes without saying" means "he has no idea." You thought you'd placed an order. You'd placed half of one.

Two layers are worth separating here. The "fried rice" you said out loud is a **solution** — one specific dish. The **requirement** in your head is "two people fed tonight, none of the few things I can't stand." One requirement has many solutions: fried rice works, rice bowls work, two bowls of noodles work. By leading with the solution, you box the contractor into the laziest version of that one solution, because everything else is invisible to him.

At a place where the owner knows you, he'd ask back: "Table for two or one? Spicy? Cilantro or no?" — filling in the conditions you didn't state. The new contractor doesn't ask back. He executes the literal text. An agent is that new contractor: possibly very capable, but if you say half, he builds half — and he builds it fast.

## Definition

Translate that intuition into engineering terms and the topic of requirements splits into a few concepts that a newcomer should learn to keep apart.

**A requirement is the problem to be solved, not the way to solve it.** It describes who, in what situation, hits what trouble, and why it has to be fixed now — without prescribing the implementation. "Two people fed tonight, none of the few things I can't stand" is a requirement; "make fried rice" is one solution. The most common confusion in engineering is that a requirement loves to show up wearing a solution's clothes. Someone bursts in with "add an AI recommendation module to the homepage." It sounds like a requirement, but it's a solution that's already been picked. The real requirement hides behind it — maybe "new users land on the homepage, don't know what to look at, and leave from the first screen." Accept the solution as the requirement and you'll precisely build something that perhaps shouldn't be built at all.

The test is plain: for any "let's do X," ask "to solve whose problem." If you can answer, a real problem stands behind X. If you can't, X is just a solution that hasn't found its owner.

**Good problem framing states that real problem in a way that can be checked.** It answers at least four things: who is affected (which kind of user), in what situation they hit it (a specific real action), where it hurts (an observable symptom, not a feeling-word like "bad experience"), and why now (what happens if it's left alone). With those four in place, the problem turns from a fog of dissatisfaction into something a stranger could pick up and act on.

**A success metric is an observable, quantifiable signal, agreed on in advance.** It answers "how do we know it worked." Note the word observable: conversion from 3% to 5%, a drop in first-screen bounce, a category of support tickets dropping from ten minutes to three minutes of handling time — these can be checked independently by an outsider. "Users are happier" and "the experience is smoother" are not success metrics, because no one can stand up and say whether that bar was cleared. Fixing the metric up front is, in effect, agreeing on the measuring stick before anyone starts.

**Acceptance criteria are that metric brought down to this specific delivery as checkable items.** The metric may be a long-horizon goal (lift conversion), but when this PR comes back, you need a set of items you can tick off right now: the new module renders correctly both logged-in and logged-out, the call has a fallback on timeout, first-screen load time after adding it stays under some bound. The closer a criterion gets to "one command, one glance, true or false," the more useful it is.

These four — requirement, problem framing, success metric, acceptance criteria — form a chain: from "who hurts how," to "what counts as solved," to "how this version gets checked." Wherever the chain breaks, everything downstream starts running on guesses.

## Why it matters

A vague requirement always cost something. What changed is the size of the cost and the speed at which it lands.

Before agents, execution was slow, and that slowness was a buffer. Hand a colleague a fuzzy task and he gets stuck, comes back to ask, realizes one afternoon that "this part feels off," and checks with you. A vague requirement gets plenty of chances to be corrected during execution. Stating it badly mostly cost a few extra laps.

Agents flatten the execution step. An agent doesn't get stuck, doesn't hesitate, and mostly doesn't turn around to ask. It takes the half-sentence you gave it and confidently completes it into a full, self-consistent, and quite possibly wrong direction — then finishes in one go. It won't wake up one afternoon thinking "this part is off," because it never sensed anything off to begin with: what you said is all it knows. By the time you see the result, the wrong direction has already been laid into several files. The cost of a vague requirement moves from "a few extra laps" to "fast and thorough work in the wrong direction."

That is what repricing means here: as execution gets cheap, stating the requirement clearly gets relatively expensive. In a world where execution is the bottleneck, a rough requirement is survivable — implementation is slow, there's time to fix it. In a world where execution is nearly free, the bottleneck moves entirely upstream — onto what you actually want and what counts as done. A vague issue is no longer a few minutes saved. It's a full round of work done confidently in the wrong direction.

So clear requirements move from soft skill to hard engineering skill. It's no longer "good communicators get bonus points"; it's "if you can't state it, the agent amplifies your mistake for you." GitHub's method for writing tasks for a coding agent opens with exactly this: write the issue as if "writing for someone brand new to the codebase" [G3]. The weight of that line comes from the agent being literally that newcomer — one who won't stop and ask you just because you wrote something muddy.

There's a second-order payoff. Once you're forced to write success metrics as observable, quantifiable things, those metrics stop being prose in a doc — they can grow straight into acceptance. While building a long-running agent, Anthropic had it first decompose a web app into more than 200 end-to-end feature requirements, each written as something concrete and executable like "a user can open a new chat, type in a query, press enter, and see an AI response," all initially marked "failing," with the agent allowed to flip the status to "passing" only after it actually tested the feature [A2]. That list isn't an acceptance doc written after the fact — it is the requirement, written concretely enough that it doubles as acceptance. The end state of stating a requirement clearly is a requirement you can execute.

## In practice

Stating a requirement clearly doesn't run on inspiration. It runs on asking a few things in order and writing the answers down.

**Turn the solution back into a problem first.** When a requirement shows up in solution's clothes ("add an X," "tweak a Y"), don't accept it yet. Ask "to solve whose problem." Keep asking until you reach a specific person, a specific situation, an observable pain point. If you can't get there, this isn't ready to build — what's ready is figuring out the problem.

**Write an agent-ready issue.** A task card you could hand straight to an agent (or to a stranger on the team) should fill in these fields:

- **Background**: what this is, what it looks like today, why someone asked for it. GitHub's standard is to write it for "someone brand new to the codebase" and supply the context a newcomer would need [G3].
- **Goal**: what this round achieves — in the language of the problem, not the solution.
- **Non-goals**: what this round explicitly does not do. This field gets its own treatment below; it's the cure for an agent over-reaching.
- **Acceptance criteria**: what counts as done, written as observable, tickable items wherever possible.
- **Verification commands**: what to run to get a result (which test, which script, which page to open and look at what).
- **Expected evidence**: what you should see when it's done (which test green, what the screenshot should contain, what should appear in the logs).
- **Risks**: which boundaries this change might touch, where it's easy to go wrong.

Not every task needs all seven fields, but background, goal, non-goals, and acceptance are the four where a blur invites the agent to treat that field as an opening for improvisation.

**For writing agent tasks, keep GitHub's four-step WRAP in mind [G3]:**

- **W — Write effective issues.** The title should say where the work happens; the body should fill in the context a newcomer needs; ideally attach an example of the implementation you want. GitHub's own contrast is blunt — don't write "Update the entire repository to use async/await"; write "Update the authentication middleware to use the newer async/await pattern... Add unit tests for verification" [G3]. The first is an unbounded imperative; the second draws the boundary and supplies the check.
- **R — Refine your instructions.** Settle repo-level and org-level preferences and patterns into standing instructions instead of re-explaining them out loud each time [G3].
- **A — Atomic tasks.** Break a big problem into small, independent tasks instead of throwing one massive scope over the wall. GitHub's example: don't write "Rewrite 3 million lines from Java to Golang"; open a separate issue for each module, like authentication or data validation [G3]. The more atomic the task, the easier the acceptance criteria are to pin down, and the less room the agent has to wander.
- **P — Pair with the coding agent.** Play to each side's strengths. Humans are good at understanding context, handling ambiguity, and thinking across systems; the agent is good at tireless execution, repetitive work, and trying several approaches [G3]. Defining the requirement and judging the direction belong to the human side; the agent doesn't take that over — it takes over implementation once the problem is defined.

**Use non-goals to fence the agent in.** "Non-goals" exists to stop one specific behavior: an agent sees a fuzzy goal and helpfully does extra on its own initiative. You say "add a recommendation module," and it helpfully reworks your ranking logic, moves the homepage layout, pulls in a new dependency — each looks like a favor on its own, but together it's a large change you never asked for. Write "this round does not touch the ranking algorithm, does not move other homepage modules, does not add new dependencies" plainly into non-goals, and you've drawn the walls of its work room. With walls up, the over-reach has nowhere to go.

**Let success metrics grow into acceptance.** When you set a metric, think half a step further: can this metric be written as a check you could run right now and judge true or false? If yes, write it as a verification command and expected evidence — like Anthropic's feature list that gets ticked off one entry at a time [A2]. Write a requirement to that level of specificity and acceptance doesn't need a separate effort — the requirement itself is the seed of the eval.

## Case

**Translating "add an AI recommendation module to the homepage" into a problem-framing card.**

Someone bursts in: "Add an AI recommendation module to the homepage." That's a sentence in solution's clothes. Apply the method above and fill it in, field by field:

- **Background**: Newly registered users land on the homepage, face a full screen of products, don't know where to start, and many leave without clicking into a single product.
- **Target users**: First-time visitors with no browsing or purchase history yet.
- **Pain point**: The homepage is a cold start for new users — with no history, the existing "recommended for you" is empty or random for them, so the first screen turns them away.
- **Success metric**: First-screen bounce for new users goes down; the share of new users who click from the homepage into at least one product detail page goes up. (The specific targets are a business call, but the form has to be observable and quantifiable like this.)
- **Non-goals**: This round does not change recommendation logic for existing users, does not move the layout of other homepage modules, does not introduce a new recommendation-algorithm service — first validate the direction with existing capabilities.

Notice what happened after the translation: the original "add an AI recommendation module" became one candidate among several solutions, and not obviously the best. Maybe the real problem of "cold-start new users" can be solved by a trending list, a newcomer section, or a simple onboarding flow, with no AI involved at all. The biggest payoff of framing the problem clearly is often not building the solution better — it's seeing whether that solution should be built at all.

**Bad issue vs. good issue (agent-ready).**

The bad issue is a one-line title: "Fix recommendations." The body is empty, or just "recommendations aren't great, optimize them." Hand it to an agent and you've handed "one fried rice" to the new contractor: it doesn't know who finds them off, which page's recommendations, what "good" means, or how much change counts as done. So it invents its own definition of "off," picks a direction it finds reasonable, and confidently touches a wide swath of code — maybe ranking weights, maybe the retrieval logic, maybe it refactors a function it didn't like the look of. You get a PR that runs, that you have no way to judge, and no way to verify.

The good issue looks like this:

> **Title**: New-user homepage recommendation cold start — add a recommendation slot for users with no history on the first screen
>
> **Background**: Newly registered users with no browse/purchase history land on the homepage; the existing "recommended for you" is empty for them, and first-screen bounce is high (see non-goals — this round does not change existing-user logic). Relevant code is in the `home/recommend/` module.
>
> **Goal**: Show 6 relevant recommendation slots on the first screen for new users with no history (example figure — set by the business), to lower their first-screen bounce and raise the rate of clicking into a product detail page.
>
> **Non-goals**: Do not change recommendation logic for existing (with-history) users; do not adjust the layout of other homepage modules; do not introduce a new external recommendation service.
>
> **Acceptance criteria**: (1) When a no-history user visits the homepage, the recommendation slot renders a non-empty result; (2) homepage behavior for with-history users is entirely unchanged; (3) when the recommendation call times out or fails, the first screen shows fallback content — no blank, no error; (4) first-screen load time after adding this module is no more than current + 200ms.
>
> **Verification commands**: Run the test suite under `home/recommend/`; visit the homepage in a fresh session (no cookie, no history) and confirm the slot is non-empty; visit with a with-history account and confirm behavior is unchanged; simulate a recommendation-call timeout and confirm the fallback kicks in.
>
> **Expected evidence**: All tests green; a first-screen screenshot for each of the two session types; a screenshot of a normal first screen under the timeout scenario.
>
> **Risks**: The recommendation call may slow the first screen under high latency — acceptance criteria (3) and (4) watch for exactly this; be careful not to let the new logic accidentally hit the with-history branch.

Feed the two issues to the same agent and the same model, and what comes out is worlds apart — the difference isn't the model, it's the card you handed over. The bad issue pushes the "define the problem" step onto the agent, which is exactly the step it should not do for you and the one it most confidently gets wrong. The good issue nails the problem down itself and leaves only "implement within a defined boundary" to the agent. That's the WRAP division of labor — humans handle ambiguity, the agent handles execution — landing on a single card [G3].

## Anti-patterns

- **Filing the solution as the requirement.** "Add an X," "ship a Y" goes straight into an issue, and nobody asks "to solve whose problem." The result is a precise implementation of something that perhaps shouldn't exist. The cure is to turn every "let's do X" back into a problem first.
- **Success metrics written as feeling-words.** "Nicer to use," "smoother," "better experience" — nobody can independently judge whether that bar was met, so it can neither be accepted against nor grown into an eval. Metrics must be observable and quantifiable.
- **Skipping non-goals.** Writing only "what to do" and not "what explicitly not to do." The agent reads that blank as permission to improvise and helpfully makes a pile of changes you didn't ask for. Non-goals aren't politeness; they're walls.
- **Writing the issue for a knowledgeable version of yourself, not a stranger.** Assuming the agent (or the next person) knows the background that "goes without saying." It doesn't — say half, get half. GitHub's standard is to write for a "brand new" newcomer [G3].
- **One massive scope per task.** "Rewrite the whole module," "move the whole site to a new framework." The bigger the scope, the harder acceptance is to write, and the more likely the agent wanders mid-way while believing it's done. One failure Anthropic observed was exactly the agent trying to one-shot a whole app and breaking it [A2]. Split into atomic tasks [G3].
- **Starting the run with no acceptance defined.** Dispatching the work without a clear "done" test, then eyeballing "looks right" when it comes back. Another failure Anthropic recorded was the agent marking features "done" without proper end-to-end testing [A2]. Acceptance is agreed in advance, and made executable where possible.

## Checklist

- The requirement in front of me — is it a **problem**, or a **solution** that's already been picked? Can I state "whose pain point" behind it?
- Is the problem framing complete: **who, in what situation, where it hurts, why now**?
- Are the success metrics **observable and quantifiable**, not feeling-words like "nicer to use"?
- Did I write **non-goals**? Which directions could the agent over-reach in, and did I block them?
- Is this issue written to the standard of "**writing for someone brand new to the codebase**" [G3]?
- Can the acceptance criteria carry **verification commands** and **expected evidence**, so "done" is executable and tickable?
- Is this task **atomic**, or a massive scope that will make the agent wander [G3]?

## Self-test

- Take the last task you handed to an agent (or a colleague) and ask: did I hand over a problem, or a solution I'd already picked? If it was a solution, what's the real problem behind it — and was that solution even the thing most worth building?
- Write the "done" for that task as one sentence. Could another person read it and independently judge true or false? If not, what you're missing isn't a stronger agent — it's an acceptance criterion you can state.
