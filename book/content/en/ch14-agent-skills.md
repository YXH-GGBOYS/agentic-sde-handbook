---
id: ch14
order: 14
part_zh: 第三卷 · 新工程资产
part_en: Part III · The New Engineering Assets
title_zh: Agent Skills：把专业能力打包复用
title_en: Agent Skills
sources: [A15, A14]
---

You don't want to re-explain how to do a particular kind of job every time you hand it off, and you don't want that procedure permanently squatting in the agent's head either. An Agent Skill packages that procedure into a folder. Day to day it shows only a name and a short blurb; when a job of that kind actually comes up, the whole thing gets pulled out and followed. It's one more engineering asset that the agent era adds — versioned and maintained like code, like AGENTS.md.

Anthropic's own framing is plain: writing a skill is like "putting together an onboarding guide for a new hire" [A15]. The new hire is capable but doesn't know how your shop does its signature work. You don't pour every company process into his head at once — you write up the one dish and hand it over when that dish is on the order.

## Everyday analogy

Hand the new contractor a loose-leaf recipe binder.

The shop has a signature dish: a dozen-odd steps, fussy timing, and a handed-down seasoning ratio. You won't expect the new guy to know it cold, and you won't make him memorize every recipe in the place first — he can't, and there's no point. Instead you write that one dish on its own loose page, keep it in a drawer, and put a single line on the cover: "Braised pork, signature (banquet closer, start two hours ahead)."

When an order comes in, he first glances along the covers in the drawer. A customer ordered the braised pork today, so he pulls that one page and follows the dozen steps. At the seasoning step, the page has a "ratio table" tucked behind it; he flips to that sheet only when he gets there. The other recipes he never touches and never has to carry in his head.

This binder has three deliberate choices, and each maps onto how an Agent Skill is built:

1. **The cover holds one line.** It says what the dish is and when to make it, not the whole procedure. The new guy can tell at a glance whether today's order needs it, without reading the whole booklet first.
2. **The full procedure stays in the drawer, pulled on demand.** Only once he's decided it's relevant does he pull that page and follow it. Recipes he doesn't need don't compete for his attention right now.
3. **The hard step gets a fixed sheet.** For something like the seasoning ratio, where being off by a gram ruins it, he doesn't eyeball it — he copies from a pre-computed table. Exact, and one less thing to get wrong.

An Agent Skill is that binder, built for an agent. The cover is metadata, the page body is `SKILL.md`, the tucked-in sheets are extra files and scripts.

## Definition

An **Agent Skill** packages the procedure for one kind of job into something an agent can reuse. Physically it's an organized folder of instructions, scripts, and resources [A15]. At its center is a `SKILL.md` file that opens with YAML frontmatter carrying two required fields: `name` and `description` [A15].

The real design move is **progressive disclosure** — information loads in three layers instead of all landing in context at once [A15]:

1. **Metadata layer.** Just the skill's name and description, loaded into the system prompt at startup and kept resident. Its only job is to let the agent know this capability exists.
2. **Core documentation layer.** When the agent judges the skill relevant to the task at hand, it loads the full `SKILL.md` content.
3. **Additional-resources layer.** Other files and scripts that `SKILL.md` references load only when that step is actually reached [A15].

Those three layers are the binder's three choices: only the cover stays resident (name + description), the full procedure (SKILL.md) is pulled on demand, and the hard-step sheet (extra files/scripts) is flipped to only when needed. The agent gets to know which signature jobs it can take on without letting every full procedure sit in the context window the whole time [A15].

A few neighboring concepts are easy to confuse with this, so keep them apart:

- **Skill vs tool.** A tool is an action primitive (`fetchInbox`, `searchEmails`) that stays resident in context — the agent reaches for it directly when deciding the next move [A14]. A skill wraps a whole procedure; it isn't resident and expands on demand. One skill can call several tools inside it.
- **Skill vs AGENTS.md.** AGENTS.md is the repo's house rules, in force for every task (Chapter 10). A skill is the specialized method for one kind of job, loaded only when that job comes up. House rules are a note you follow daily; a recipe is a page you pull per order.
- **Skill vs subagent.** A subagent solves **context isolation** — you spin up a child agent with its own context window to sift through a pile of information and send only the relevant conclusions back to the orchestrator [A14]. A skill solves **procedure reuse**. The two are orthogonal: a subagent can use a skill while it works.

## Why it matters

The first payoff is **context economy**. An agent's context window is finite; make everything resident and nothing fits, and what's there interferes with itself. Turn a procedure into a skill that loads on demand and you've put only today's recipe on the counter, with the rest back in the drawer. Anthropic puts it plainly: progressive disclosure keeps the context window efficient by letting the agent discover information layer by layer rather than reading the whole skill in upfront [A15].

The second payoff is **deterministic work over improvisation**: don't make the model generate what code can compute. Some steps are deterministic by nature — pulling fields out of a PDF form, working out a seasoning ratio. Having the model "generate" the answer token by token is slow and can go wrong. A skill can bundle executable code, like a Python script, that the agent runs deterministically — without even reading the code itself into context [A15]. This is the layer that separates a skill from "write another prompt": a prompt makes the model better at improvising; a skill pins down the part that can be pinned down.

The third is **reuse and sharing.** Write a procedure once, package it, and many agents and projects can install it. Anthropic says skills already work across Claude.ai, Claude Code, the Claude Agent SDK, and the Claude Developer Platform, and that the next focus is the full skill lifecycle — creation, discovery, sharing, and use [A15]. In other words, a skill is designed as an asset that circulates, not a private snippet stuck inside one project.

A note on the plumbing. The agent harness behind Claude Code — the Claude Code SDK — was renamed to the **Claude Agent SDK** on September 29, 2025, since the same machinery had grown well past coding [A14]. In that SDK the agent's typical loop has four phases: gather context, take action, verify work, repeat [A14]. A skill mostly feeds the first two — letting the agent know the procedure exists while it gathers context, and handing it a ready script when it takes action.

## In practice

Anthropic's development advice doubles as a usable procedure [A15]:

1. **Start from a capability gap.** Run a set of representative real tasks and watch where the agent keeps dropping the ball — that's where a skill earns its keep. Don't imagine a pile of skills upfront that nobody needs.
2. **Write `name` and `description` from the agent's point of view.** These two fields are the only clue in the resident system prompt; the agent decides relevance entirely from them. Vague ones (say, just "document handling") make the agent skip the skill when it's needed and reach for it when it isn't. Spell out what it handles and when to use it.
3. **Split files as it grows.** Don't let SKILL.md sprawl. When content bloats, break the details into separate files that SKILL.md references on demand — which is exactly the grain of progressive disclosure.
4. **Iterate on real usage.** Don't try to design the skill to "perfect" in one shot; ship it, watch how it actually gets used, and go back to fix it.

One hard security rule, which Anthropic calls out directly: **install skills only from trusted sources**, and before deployment audit the bundled code, dependencies, and resources — especially anything that reaches out over the network [A15]. The fact that a skill can carry an executable script is its strength and its attack surface at once. Installing an unvetted skill is the same act as running an unvetted script on a production box.

## Case

**PDF form extraction: give the deterministic job to deterministic code.** Anthropic's worked example is a PDF skill that bundles a script to extract form fields, without running the whole PDF through token generation [A15].

The example is worth unpacking, because it sets two paths side by side.

The model-only path: feed the whole PDF into the model's context, have it read every word and then "understand" each field's value. The longer the document, the more tokens burn; the more fields, the more the model can cross wires and copy the wrong value — the textbook failure mode of making a model improvise a deterministic answer.

The skill-plus-script path: the agent first sees this PDF skill's cover in the drawer, judges the task relevant, loads SKILL.md, and follows its guidance to call the extraction script. The script reads the form fields deterministically, and the result comes back to the agent. Throughout, the script's own source never has to enter context [A15] — the agent just uses it, without having to understand it. Exact (deterministic extraction, not a model's guess) and cheap (no burning tokens on the full PDF text).

This is what the gap between a skill and "one more prompt" looks like in a concrete spot: pin the steps that can become code into code, and leave the model the judgment call of which recipe this job needs.

## Anti-patterns

- **Using a skill as AGENTS.md.** Writing house rules that every task should follow into some skill. House rules must be resident and apply to all tasks; buried in an on-demand skill, the agent never pulls them up on unrelated work. Resident rules go in AGENTS.md; only specialized procedures go in a skill.
- **A vague description.** The name and description are the only basis for judgment in the resident system prompt. Something like "document tool" gives the agent no way to tell when to use it — skipped when needed, grabbed when not. Spell out what it handles and when.
- **A forever-growing SKILL.md.** Cramming every detail and edge case into one ever-longer SKILL.md throws away the context savings progressive disclosure gives you. When it bloats, split files and reference them on demand.
- **A prompt where a script belongs.** Deterministic work — extracting fields, computing a ratio, converting formats — driven step by step in natural language is slow and shaky. If it can be a script that runs deterministically, don't make the model improvise it.
- **Installing an unvetted skill.** A skill can bundle executable code, so a skill from an untrusted source is a stranger's script that runs itself. Before installing, audit the code, the dependencies, and any outbound network calls [A15].

## Checklist

- Should this capability **be a skill** at all? (Is it a reusable procedure for one kind of job, not house rules every task must follow — those go in AGENTS.md.)
- Are the skill's **name and description** enough for the agent to tell at a glance whether the current task needs it?
- Is SKILL.md **short and dense**, with overflow detail split into separate files referenced on demand?
- Are there **deterministic steps** inside that should be a bundled script but are left for the model to improvise?
- Is the skill's **source trusted**? Have you audited the bundled code, dependencies, and outbound network calls before deploying?

## Self-test

- Given a job an agent keeps doing badly, can you say whether it should become a skill, go into AGENTS.md, or just needs a tool it's missing? Can you state what each of the three solves?
- The three layers of progressive disclosure — which one stays resident in the system prompt, which loads when judged relevant, which is fetched only when reached? Why does that split let the agent both know the capability exists and not hold context the whole time?
