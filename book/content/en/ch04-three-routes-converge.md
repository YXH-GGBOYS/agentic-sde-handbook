---
id: ch04
order: 4
part_zh: 第一卷 · 格局重置
part_en: Part I · The Reset
title_zh: 三条路线正在汇合
title_en: Three Vendor Routes Are Converging
sources: [G1, G5, G6, O1, O2, O7, O10, O11, A1, A2, A13]
---

GitHub, OpenAI, and Anthropic are all selling the same thing today: agents that write and ship code for you. But read their blogs side by side and you find three completely different doors into that promise. One enters through the issues, PRs, and Actions you already use. One enters through the model plus its runtime. One enters through the question of how an agent finishes a task that spans several days.

This chapter has two jobs. First, to be clear about where the three vendors actually differ, so you don't mistake marketing copy for industry consensus. Second, to show what they're converging on. That direction is not "smarter models." It's pushing agents into a real delivery pipeline and then fitting them with boundaries and acceptance checks. Once you see that, you stop welding your engineering to one vendor's managed product.

## Everyday analogy

Picture the path "from your order to the package in your hands" as a cross-country delivery. For it to run smoothly, several things have to be in place: a pickup depot, a sorting line, the long-haul trucks that move freight between hubs, the courier who climbs your stairs, and a set of rules for tracing and refunding when something goes wrong.

Now imagine three delivery companies, all claiming they can get your package there, each putting its weight somewhere different.

The first company pours its money into **depots and sorting lines**. Its pitch: you already order, track, and sign for packages through us, so we'll grow "auto-sort, auto-dispatch" directly inside the flow you know. No new app. You watch the package move from one station to the next, right in front of you.

The second company doesn't talk much about depots. It talks about **how capable the courier is**, and what truck, scanner, and navigation you hand that courier. Its pitch: anyone can build depots; the hard part is a courier who can read the address, climb six flights, and leave the package safely when you're out. So it spends its effort on the person plus the gear, and you can take that gear and build your own depots if you like.

The third company watches the **long multi-leg transfers**: a parcel that changes trucks three times, passes two sorting centers, and takes three days. Every truck change is a handoff, and a handoff with nothing written down is how parcels get lost. Its pitch: anyone can do a short hop; the real test is the long order that no single person remembers end to end. So it studies the question of how the next shift knows where the last shift left off.

These three sound like they're fighting three different wars. Step back, though, and all three have to make the same chain work: from order to signed delivery, no parcel lost, and when one is lost, it can be traced and refunded. The depot-strong company will eventually sweat the long-haul handoffs. The gear-strong company will eventually have to lay down depots. The long-haul-strong company will eventually need a storefront where you place and track orders. **Different center of gravity, same finish line.** That is the chapter title: three routes converging.

## Definition

Translate each vendor's center of gravity into engineering terms, with the marketing filter off.

**The GitHub route is workflow-native — it grows inside the workflow you already have.** Its core move: put the agent into the issues, PRs, and Actions you use anyway. Assign a GitHub issue to Copilot and it spins up a dev environment in the background, clones the repo, and pushes changes as commits to a draft PR, with the whole run recorded in the session log [G1]. Its boundaries are enforced with platform primitives, not prose: the agent can only push to branches it created, the person who requested the task can't approve the agent's PR, CI workflows won't run without human approval, and network access is limited to an allowlist [G1]. That model later extended to a desktop app, a CLI, and the cloud: each agent session runs in its own git worktree, with local and cloud sandboxes [G5]. On top sits Agent HQ — GitHub positioned it at Universe 2025 as "a unified workflow to orchestrate any agent," with coding agents from Anthropic, OpenAI, Google, Cognition, and xAI reachable through a paid Copilot subscription, and OpenAI's Codex available immediately in VS Code Insiders [G6]. In one line: GitHub sells orchestrating every vendor's agent inside the pipeline you already know.

**The OpenAI route is platform and systems — the model plus a harness.** It has two layers. One is Codex the coding agent, whose reach keeps spreading: from writing code to operating your computer, an in-app browser, image generation, remembering preferences, and scheduling future work for itself to wake up and continue days later [O7]. The other is the foundation for developers: the Agents SDK ships a model-native harness that lets an agent work across files and tools, paired with native sandbox execution, standardizing primitives like MCP, skills, AGENTS.md, shell execution, and apply-patch [O2]. OpenAI named this discipline outright in one post: it defines the harness as the layer of "verification, feedback, recovery, tools, context, and human judgment" around the agent, and describes an internal experiment building a product with zero manually-written code — three engineers driving Codex at an average of 3.5 PRs per engineer per day [O1]. In one line: OpenAI sells the model plus the systems engineering that makes the model usable.

**The Anthropic route treats the agent as a long-term engineering partner.** Its weight is on method and on long tasks. Claude Code's spine is explore → plan → code → commit: read-only exploration in plan mode, then an implementation plan, then leave plan mode to write, then commit and open a PR [A1]. It repeats a few themes: give the agent a check it can run itself (tests, a build, a screenshot to compare), use CLAUDE.md for persistent context, draw boundaries with permissions and a sandbox, and run parallel work in worktrees [A1]. Above that is context engineering — treating context as a scarce resource to manage against "context rot" (the longer the context, the worse the model recalls), using compaction, structured note-taking, and sub-agents to carry tasks past a single context window [A13]. The hardest piece is the long-running harness: an initializer agent sets up the environment first (an `init.sh`, a feature-list JSON, a progress file, an initial git commit), then each coding agent advances one feature per session and leaves structured handoffs, so the next shift's agent picks up from the progress file and git history [A2]. In one line: Anthropic sells getting a forgetful, shift-changing agent to finish a long job by way of its handoff artifacts.

Three different pitches, all circling the same object: an agent that can read, write, and run commands, and how to get it into real delivery without causing damage. GitHub enters through the workflow, OpenAI through the model plus systems, Anthropic through method and long tasks. **Three doors into one problem.**

## Why it matters

Why spend a chapter on "the routes are converging"? Because picking the wrong frame of reference burns you in two places.

The first trap: **mistaking marketing copy for industry consensus.** Every blog says "agents in the real development flow," "humans steer, agents execute," "keep human judgment and accountability." Each line reads true on its own, but they're vendors positioning their own products, not a settled agreement. Dig into the details and the differences are concrete. GitHub runs the agent in the cloud by default and enforces boundaries with platform permissions [G1]. In OpenAI's experiment, almost all review was pushed to agent-reviewing-agent, with humans stepping in only when judgment was required [O1]. Anthropic keeps insisting on "give the agent a check it can run itself," treating human acceptance as a step you don't skip [A1]. The same phrase — "keep human judgment" — puts the human in three different places. Blur these into "everyone does it this way" and you'll build your process around an average that doesn't exist.

The second trap, and the one this chapter is really about: **don't weld your engineering to a managed abstraction.** This is where the AI era differs most from before — vendors' upper-layer products churn fast, faster than the models underneath them. The next section has a live example; here's the judgment up front. The lower-layer engineering capabilities — isolated execution, acceptance, tracing, reversibility — are durable. The higher and more "we packaged everything for you" a managed product is, the more likely it changes shape or shuts down within months. The sooner you internalize this, the less likely you are to weld your team's workflow onto one pretty visual tool.

There's a constructive reason too: seeing the convergence lets you subtract. The three doors look varied, but they resolve to one list of things you have to manage — where tasks enter, what actions the agent can take, where it runs isolated, what counts as done, how to undo a bad run, and what trace it leaves for the next person. Whether you end up on GitHub's pipeline, OpenAI's SDK, or Claude Code, that list is yours to answer. A tool helps you implement it; it can't answer it for you.

## In practice

Facing three routes, the useful question isn't "which vendor." It's getting your selection criteria straight first.

**Pick the door by where you already are, not by whose blog is louder.** If your team lives heavily on GitHub and issues and PRs are your collaboration hub, the workflow-native route has the least friction — the agent grows inside a flow you know, no tool switch [G1][G6]. If you need to embed agent capability into your own product and want visibility into and control over the harness, OpenAI's developer SDK fits better [O2]. If your pain is "a task spans several context windows and the agent keeps forgetting or declaring victory early," Anthropic's long-running harness is the design worth copying [A2].

**Separate durable engineering from a managed product that will churn.** A rough test: the closer something sits to "isolated execution / acceptance / tracing / reversibility," the more durable it is; the closer it sits to "drag a few nodes and out comes an agent," the more you want an exit. For the latter, ask before you commit: if this product shuts down in six months, how much does it cost me to move its output elsewhere?

**Measure any vendor against one cross-vendor list.** Three doors, but each must answer the same questions: where tasks enter, what actions the agent can take, where it runs isolated, what counts as done, how to undo, and what trace it leaves. Hold that list against each product and the gaps become obvious — which is exactly what the later harness chapter expands.

**Keep the portable assets in your own hands.** Repo instruction files like AGENTS.md / CLAUDE.md, your test suite, your acceptance criteria — these are cross-vendor and legible to whichever agent you put in front of them. All three treat AGENTS.md as a first-class citizen in their SDKs and posts [O1][O2][G6]. Settle your rules in the repository rather than in one vendor's visual canvas, and switching vendors costs little.

## Case

**A live example: AgentKit's Agent Builder didn't last half a year.**

OpenAI launched AgentKit at DevDay on October 6, 2025. Its showpiece was **Agent Builder** — a visual canvas where you drag nodes to orchestrate multi-agent workflows, connect tools, and configure guardrails, with preview runs, inline eval configuration, and version control built in [O10]. The customer quotes in the post were striking: Ramp built a procurement agent in hours and cut its iteration cycle by 70%; LY Corporation got its first multi-agent workflow running in under two hours [O10]. This is the textbook "managed upper layer" — everything packaged, an agent a few drags away.

Now look at the dates. Launched October 6, 2025. On June 3, 2026, OpenAI notified users that Agent Builder was being deprecated, with a scheduled shutdown of November 30, 2026 [O11]. Under eight months from launch to retirement announcement. In the same batch of notices, OpenAI's own Evals platform was deprecated too [O11] — the very feature AgentKit had pitched for "measuring agent performance." The official migration path was to move to the Agents SDK or ChatGPT Workspace Agents [O11].

The value of this example isn't to mock a product. It's that it turns the previous section's judgment into a fact you can touch: **the more a managed upper layer "packages everything for you," the faster it churns.** Any team that had welded its core workflow onto Agent Builder's canvas now has to move twice in half a year — Agent Builder first, then Evals. Meanwhile the lower-layer route — the harness and sandbox primitives in the Agents SDK [O2] — is precisely where OpenAI told everyone to migrate. The capability is durable; the wrapper is what changes.

One small note, as important as the selection question itself: several vendor URLs cited in this chapter were not honest links. The GitHub post for G5 returned a flat 404 at the URL the task handed us; the body was only recovered through a different canonical URL. Several OpenAI articles returned 403 to automated fetches and had to be read from archive snapshots. **Official vendor links expire, get reorganized, and block crawlers.** When you have an agent (or yourself) cite "the official docs," click the link and check it by hand. Don't assume it's still there, or still the page you think it is.

## Anti-patterns

- **Mistaking marketing copy for industry consensus.** All three say "agents in the real flow, humans keep judgment," which sounds like a settled standard. It's three vendors positioning their own products, and the details diverge sharply (who reviews, where it runs, which step the human is pinned to) [G1][O1][A1]. Don't build your process around an average you invented.
- **Welding your engineering to a managed abstraction.** Hard-wire your core workflow onto one visual canvas or managed API, and when it shuts down in six months you're moving overnight. Agent Builder is the ready-made case [O10][O11]. Use managed products, but don't let one become the single source of truth you can't migrate off.
- **"Pick a vendor once and you're done forever."** Believing that lining up behind one vendor ends the question. But all three are reshaping fast, copying each other, and even hosting each other (Agent HQ orchestrates OpenAI, Anthropic, and Google agents directly inside GitHub) [G6]. What's stable isn't a bet on a vendor — it's the cross-vendor list and assets you keep in your own hands.
- **Watching the wrapper, never asking about the floor.** Charmed by a "drag a few nodes, get an agent" demo without asking whether there's isolated execution underneath, whether there's an acceptance check, whether you can undo, whether it leaves a trace. A good demo and something you can entrust work to are not the same thing.

## Checklist

- Am I picking a vendor because **my team is already there** (GitHub / our own product / long-task scenarios), or because its blog reads well?
- Can I tell, in what I'm using, which parts are **durable lower-layer capability** (isolated execution, acceptance, tracing, reversibility) and which are a **fast-churning managed upper layer**?
- If the managed product I lean on **shuts down in six months**, how costly is moving my output off it? Do I have an exit?
- Are my core rules settled **in the repository** (AGENTS.md, tests, acceptance criteria), or hard-wired into one vendor's **visual canvas**?
- Have I taken each blog's "agents in the real flow, humans keep judgment" as a **reached consensus** without checking which step each one actually pins the human to?
- The "official docs" link I had an agent or myself cite — did I **click and verify it by hand**?

## Self-test

- In your own words: what is the **door** for each of the three routes — GitHub, OpenAI, Anthropic? What is the **one direction** they're all converging on?
- Suppose a managed agent product you rely on heavily announces next week that it retires in six months. What do you need to move? Which parts hurt to move, and which don't at all? That answer measures how locked in you already are.
- Next time you hear "the industry is going agentic," can you immediately ask back: which vendor specifically, which step do they keep the human at, and is it durable lower-layer capability or a managed layer that will churn?
