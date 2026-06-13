---
id: ch22
order: 22
part_zh: 第五卷 · Agents 工程专章
part_en: Part V · Agents Engineering
title_zh: 多 agent 模式
title_en: Multi-Agent Patterns
sources: [A7, A4, A2]
---

When one agent can't finish the job, the obvious move is to start a few more. But "a few more" isn't free. The agents have to divide the work, stay out of each other's way, and someone has to assemble their separate outputs into one thing you can ship. Organize it well and a handful of agents in parallel can compress a week of exploration into an afternoon. Organize it badly and they chisel into the same wall at once, overwrite each other, and you spend more time reassembling and cleaning up than one patient agent would have taken.

This chapter covers five multi-agent patterns that have earned their keep, with where each fits and what to watch. It also makes a point people skip over: multi-agent has a price, and more agents is not better.

## Everyday analogy

Picture an agent as the contractor from earlier chapters — skilled hands, no idea how your place runs. The job has grown; one person can't finish it; you need a crew.

The first question for a crew isn't "how many people." It's "how do we split the work." You can't put two masons on the same wall at once — they get in each other's way and the holes they cut don't line up. You divide the wall: one builds the east end, one builds the west, and you leave a clean seam in the middle. The second question is "who coordinates." You need a foreman: he doesn't lay brick himself, he breaks the wall into sections, hands them out, watches progress, and assembles the sections back into one wall at the end. The third question is "who checks the work." The crew can't grade itself — you need an independent inspector with a standard to hold the work against.

The counterintuitive part: more bodies don't mean better work. Add five masons to a site with nobody dividing the work and nobody coordinating, and they'll cluster on the easy section, leave the hard one, and pile their materials underfoot where they trip each other. A disorganized crew of ten can be slower and messier than a well-divided crew of three. Multi-agent is the same — the value is in the organizing, not the count.

## Definition

A multi-agent pattern is a structure that hands one task to several agent instances, each with its own context, then coordinates their outputs into one result. The load-bearing phrase is *its own context*: each agent has its own attention budget, its own tools, its own slice of the material, and they talk through explicit interfaces — task assignments, returned summaries, committed artifacts — instead of sharing one big window.

Why split into separate contexts rather than pile everything into one agent? Recall the curve from the context-engineering chapter: the longer the context, the worse the model recalls what matters. One agent carrying the full material for "explore module A, explore module B, and synthesize a judgment" will have its window crushed under three sets of details. Split them, and the agent exploring A sees only A's material and returns its conclusion as a compact summary; the lead agent's window holds conclusions, never the full raw process of three explorations. That's the most concrete engineering win here: trade one stuffed window for several clean small ones.

The five patterns below recur in practice. They aren't mutually exclusive — a real system often stacks several (an orchestrator over a set of specialist workers, each worker's output then run past an adversarial review).

| Pattern | Structure in a line | Typical use | What to watch most |
|---|---|---|---|
| orchestrator + workers | one orchestrator splits, delegates, synthesizes | breaking up large projects, complex research | the orchestrator must hold scope, budget, and final consistency |
| generator + evaluator | one proposes, one judges independently | proposal generation, code repair | the evaluator must be independent — don't let the generator's story sway it |
| parallel exploration | several lanes explore one question, then merge | architecture choice, bug root-cause | dedupe on merge, and forbid multiple lanes editing the same spot |
| adversarial reviewer | a dedicated fault-finder gates the output | security, compatibility, regression review | the reviewer needs a concrete rubric, not vague nitpicks |
| specialist agents | role-divided experts | frontend / backend / data / test / docs | trim tools and context per role; don't hand everyone the full kit |

**Orchestrator + workers.** A lead agent works out the strategy, breaks the big task into subtasks and delegates them, several workers each finish their subtask in an independent context, and the lead synthesizes the results into the final output. Anthropic's multi-agent research system is built this way: a lead agent develops an investigation strategy, delegates tasks to subagents running in parallel, and synthesizes their findings, with a separate CitationAgent dedicated to attributing sources in the final output [A7]. The orchestrator is the make-or-break piece. Before delegating it has to cut scope cleanly (so two workers' work doesn't overlap), give each worker a budget (or tokens run away — more on why below), and make sure the synthesized result is consistent rather than a forced collage of contradictory sub-conclusions.

**Generator + evaluator.** One agent generates — a proposal, a fix — and another judges it against a standard and decides whether to send it back. This shows up constantly in proposal generation and code repair. The crux is that **the evaluator must stay independent**: it judges whether the output itself is correct, not whether the generator's "I changed it this way because…" sounds convincing. Once the evaluator gets led along by the generator's narration, it degrades into a rubber stamp and you've lost the check. Let it look only at the result — did the tests pass, is the acceptance criterion met — not at the defense.

**Parallel exploration.** Take one question, send several agents at it from different angles, and merge their conclusions. Evaluating different architecture options in parallel, or chasing a bug's root cause from several hypotheses at once, both fit here. It suits breadth-first problems where you want to fan out across directions. Two cautions. First, dedupe on merge — the lanes will often surface heavily overlapping conclusions, and not deduping just copies the same sentence three times into the budget. Second, the lanes may *explore* but not *edit* — let parallel lanes touch the same code at once and they'll overwrite each other, which is one of the easiest ways to wreck a multi-agent run.

**Adversarial reviewer.** Put a dedicated contrarian agent after the output. Its job isn't to praise; it's to find where this change will break — security holes, compatibility breaks, likely regressions. The whole value hinges on the rubric: give the reviewer a concrete checklist (which security items, which compatibility points, which regression surfaces) and it has something to hold onto. A reviewer with no rubric only "offers some suggestions" — it looks like a review and gates nothing.

**Specialist agents.** Divide by role: one for frontend, one for backend, one for data, one for tests, one for docs, with each agent's tools and context trimmed to its role — browser automation for the frontend agent, database access for the data agent, instead of the full kit for everyone. Anthropic lists this as an open direction in its long-running-agent work: it's still unclear whether a single general-purpose coding agent is best across the board, and specialized agents like a testing agent, a QA agent, or a code-cleanup agent could plausibly do better on their respective subtasks [A2]. Note that this is flagged as a *future direction*, not a settled result.

## Why it matters

Multi-agent isn't a new idea, but it's worth taking seriously now because there are concrete numbers behind it — behind both the upside and the cost.

Start with the upside. Anthropic reports that on its research evaluation, a multi-agent system with Claude Opus 4 as the lead and Claude Sonnet 4 as subagents outperformed a single Claude Opus 4 by 90.2% [A7]. The advantage is most pronounced on breadth-first queries — the kind that need parallel exploration across several directions at once [A7]. Parallelism also buys time directly: the team found that parallel tool calling cut research time by up to 90% on complex queries [A7].

But the cost is real money. The same write-up gives a sobering pair of numbers: a typical agent uses roughly 4× the tokens of a standard chat, and a multi-agent system uses roughly 15× the tokens of a chat [A7]. Stand up a multi-agent system and your bill isn't doubling — it's heading toward fifteen-fold. The judgment Anthropic draws from this is blunt: the approach only pays off when the task is valuable enough to justify the compute [A7]. That's not a throwaway line — 15× tokens means using multi-agent on a small task one agent could have handled is a pure loss.

One more number is worth holding onto, because it tells you where to spend. On the BrowseComp evaluation, the team's attribution analysis found that token usage by itself explains 80% of the variance in performance, with model choice and tool calls accounting for the remaining 15% [A7]. That's counterintuitive: on this class of task, how much token budget you give the system to explore decides the outcome more than which model you pick. A large part of why multi-agent is strong is that, through parallelism, it spreads more token budget effectively across more directions of exploration.

So when should you reach for multi-agent? A7 draws a clear boundary. Good fit: problems involving heavy parallelization, information that exceeds a single context window, and complex tool interactions [A7]. Bad fit, equally clear: problems where all agents must share identical context, or where subtasks are tightly interdependent, are poor matches for current multi-agent architectures [A7]. That boundary is practical. If parts of your task must always see each other's latest state — touch one and the other has to change — it shouldn't be split into separate-context agents at all; splitting it just makes them wait on and overwrite each other.

## In practice

**Ask "should this be split" before "how to split it."** Use A7's boundary as a sieve: is the task breadth-first, parallelizable, over-window, tool-heavy? If so, multi-agent has a shot. If it needs several lanes sharing one live context, or its subtasks are tightly coupled, don't split — one agent with a state file is the calmer path. The 15× token cost is only worth paying when the task's value carries it.

**Have sub-agents return summaries, not raw process.** This is the core context-saving move in multi-agent, already worked through in the context-engineering chapter: let a worker explore freely in its own clean context, but return to the orchestrator a compact conclusion, not everything it read. The orchestrator's window then holds only conclusions. This buys two things at once — room for each worker to explore, and a lead context that doesn't burst under several lanes of process.

**Give each worker a budget and a scope.** When the orchestrator delegates, pin down two things: which section this worker owns (no overlap with others) and the most it may spend (a ceiling on tokens, turns, tool calls). A7's prompt-engineering notes call for giving the lead agent an explicit delegation framework rather than vague instructions, and for embedding scaling rules that match effort to query complexity [A7] — in plain terms, don't let the orchestrator improvise how much work and budget to hand out; make it a rule.

**Evaluators and reviewers see the output, not the defense.** For generator + evaluator and for the adversarial reviewer alike, independence is the only source of their value. Let the judge work from executable criteria — did the tests pass, is each rubric item met — not from the generator's account of why it changed things. The moment the judge starts getting persuaded by the generator's narration, the gate is gone.

**Debug from traces, not transcripts.** Multi-agent systems are harder to debug than single agents because the decisions are non-deterministic — the same prompt can take two different paths on two runs. A7's approach was full production tracing to diagnose why agents failed and fix issues systematically, while monitoring patterns rather than reading conversation contents [A7]. With several agents in parallel, without traces you can't even say which lane went wrong at which step.

**Keep long-task state outside the context.** A7 also notes that agent systems maintain state over extended periods, which makes error handling critical; the team used checkpoint-based recovery so an agent could resume from a failure point instead of restarting from scratch [A7]. Same lesson as the state file from the long-running-agent chapter: state lives in files and logs, not in a transcript that gets compacted and lost.

## Case

**Decoupling the brain from the hands to make parallel work scalable.** Anthropic's Managed Agents splits an agent into three independently replaceable pieces: a session (an append-only log of everything that happened), a harness (the loop that calls Claude and routes tool calls), and a sandbox (an isolated environment for running code and file operations) [A4]. The key move is decoupling the "brain" (Claude and its harness) from the "hands" (sandboxes and tools) and the session log [A4].

That decoupling serves scalable parallelism directly. The harness moves outside the container and calls the container as a tool, with the signature `execute(name, input) → string`; if a container fails, the harness treats it as a tool-call error and Claude can retry with a freshly provisioned environment [A4]. As a result, brains can scale independently through stateless harnesses, while hands are provisioned on demand [A4] — to run ten lanes in parallel, you don't pre-allocate ten heavy containers sitting idle; you open a hand only when one is needed. The decoupling also improved startup latency: p50 time-to-first-token dropped roughly 60% and p95 dropped over 90%, because inference no longer waits for a container to come up [A4].

There's a security gain here that matters especially for multi-agent. Before the split, untrusted code generated by Claude ran in the same container as credentials, a real injection risk; after the split, tokens never reach the sandbox where Claude's generated code runs [A4]. When you're running many agents in parallel, each writing and executing its own code, that "no keys in hand" isolation is a baseline requirement, not a nicety.

**Splitting planning, generation, and evaluation across roles.** In A2's long-running-agent work, setup and progress are two split roles: an initializer agent sets up the environment on the first run (writes `init.sh`, creates a progress file, makes an initial git commit), and every subsequent session a coding agent takes the baton, picks one unfinished feature to push forward, and leaves structured handoff notes [A2]. In the claude.ai clone example, the initializer first expands the user's high-level prompt into a feature list of over 200 items, each marked "failing" to start, stored as a JSON file (the model is, in practice, less prone to mangling JSON than Markdown) [A2].

The article itself leaves "should this be split further into multiple agents" as an explicit open question: it's still unclear whether a single general-purpose coding agent is best across contexts, and specialized agents — a testing agent, a QA agent, a code-cleanup agent — might do better on their respective subtasks [A2]. That's an honest stance: splitting planning/generation/evaluation across roles is directionally reasonable, but "finer is better" isn't proven, so don't lift it as settled fact.

## Anti-patterns

- **Multi-agent worship.** Believing that enough agents guarantees good work. A7's 15× token figure sits right there — using multi-agent on a task one agent could handle is just burning money [A7]. Ask "should this be split" first; when the answer is no, one agent with a state file is the cheapest finish.
- **Splitting a tightly-coupled task.** A7 says it plainly: problems where all agents must share identical context, or whose subtasks are tightly interdependent, are poor fits for current multi-agent architectures [A7]. Force that work into separate contexts and the lanes only wait on and overwrite each other.
- **Context fragmentation.** Splitting a task across agents without designing how they exchange information, so each agent sees only its own slice, nobody holds the whole, and the synthesized result contradicts itself. Splitting context presumes you've worked out who needs to see what and how conclusions come back.
- **Budget blowout.** Leaving workers with no token/turn ceiling, so the orchestrator delegates and digs without limit. Lose control on top of a 15× base and the bill turns ugly fast. Every worker needs a hard budget boundary.
- **Multiple lanes editing the same spot.** The worst mistake in parallel exploration: parallel agents touching the same code at once will overwrite each other, and what you get back is a tangle nobody can explain. Use parallelism only to explore; editing should converge to one lane or be serialized by the orchestrator.

## Checklist

- Is this task breadth-first, parallelizable, over-window, tool-heavy? Or are its parts tightly coupled and forced to share context — in which case, don't split?
- Have I priced the token cost? Is the task's value enough to carry roughly 15× the tokens of an ordinary chat?
- Does each worker have a clear **scope** (no overlap with others) and a **budget** (a ceiling on tokens / turns / tool calls)?
- Does the sub-agent return a **compact summary** to the lead, or everything it read?
- Are the evaluator / reviewer judging the output **independently**, or getting led by the generator's explanation? Does the reviewer have a concrete rubric?
- Are the parallel lanes explore-only, never editing? Could two lanes touch the same spot at once?
- Are the multi-agent state and traces in **files / logs**, enough to locate later which lane and which step went wrong?

## Self-test

- Last time you thought "let me start a few more agents," was it because the task was genuinely breadth-first and parallelizable, or just because "more can't hurt"? If the latter, how do you explain the 15× token spend to yourself?
- If two of your parallel lanes both edited the same file right now, what would your system do? Could you tell from the traces which two collided? If you can't answer, your multi-agent setup is still at "more bodies," not "well organized."
