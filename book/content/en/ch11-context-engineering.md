---
id: ch11
order: 11
part_zh: 第三卷 · 新工程资产
part_en: Part III · The New Engineering Assets
title_zh: Context 工程：让 agent 在正确范围内变聪明
title_en: Context Engineering
sources: [A13, A2, A17]
---

Before you hand a task to an agent, you decide what's in front of it: which code, which doc, which rule, which conclusion from the last round. That set of material in front of it is the context. The reflex is to treat it as a bin — pour in whatever might help, the window is huge. That reflex is one of the main reasons the work comes back wrong.

Context is the agent's attention budget, not a copy of your repo. The fuller the window, the easier it is to bury the few lines that actually matter. Context engineering is the work of laying out the right background before the task starts and keeping the rest out — so the same model, working in a cleaner space, comes back sharper.

## Everyday analogy

Kitchens have a phrase for this: mise en place, "everything in its place." A decent cook preps before the burner is on — scallions cut, garlic crushed, sauce measured, the order of operations rehearsed, every ingredient lined up within arm's reach in the sequence it goes into the pan.

Why prep ahead? Because once the heat is on, time is measured in seconds. That's the worst moment to realize the scallions aren't cut and you still have to dig through the fridge for the soy sauce — by the time you're back, the garlic in the pan has burned and the dish is gone. The discipline isn't fussiness. It exists because "go find it mid-service" simply doesn't fit in the time the heat allows.

But there's a second half to mise en place that gets forgotten: what doesn't belong on the station stays off it. You don't drag the whole fridge, the entire spice rack, and the ingredients for the next three dishes onto your work surface. The station is only so big; pile it high and you can't find the one thing you're reaching for. Prep means prep for this dish, not move the kitchen over.

Handing a task to an agent is the same. Lay out the background it needs, in the order it'll need it; keep out what it shouldn't have to dig through. Dump the whole repo and the whole wiki on it and you've dragged the fridge onto the station — more stuff, and the one ingredient it needs is now buried under it.

## Definition

Context engineering is the work of selecting, arranging, and maintaining the set of tokens for a given agent task. Anthropic puts it plainly: context is "the set of tokens included when sampling from a large-language model," and context engineering is "the set of strategies for curating and maintaining the optimal set of tokens (information) during LLM inference, including all the other information that may land there outside of the prompts" [A13].

It's related to prompt engineering but not the same thing. Prompt engineering asks how to word the instruction; context engineering asks the larger question — given the system instructions, tool definitions, retrieved data, and message history, what configuration of all that is most likely to produce the behavior you want [A13]. What actually enters the window in a real task is far more than the sentence you typed: the files the agent reads, the output of commands it runs, the prior turns, the values tools return. All of it is context, and all of it spends the same attention budget.

The discipline is to treat context as a precious, finite resource [A13]. A window rated for two hundred thousand tokens doesn't mean you should fill two hundred thousand. What a task should aim for is "the smallest set of high-signal tokens that maximize the likelihood of your desired outcome" [A13] — not the fullest window, the most precise one.

Here are the five kinds of context an agent actually draws on, each with its own failure. Together they're more or less the entire set of "ingredients" a task runs on.

- **Repo instructions** (AGENTS.md / CLAUDE.md and the like). The trap is writing them as prose for humans. "We care deeply about code quality" contains no rule the agent can act on; it finishes reading and still doesn't know which command to run or which directories to leave alone.
- **Task context** (what you actually want this time). The trap is "fix the bug." Which bug, how to reproduce it, what "fixed" looks like, which files are off-limits — absent all that, the agent guesses.
- **State artifacts** (how a long task resumes across many turns). The trap is expecting it to recover progress from chat history. Once history is compacted or truncated, "where the last round got to" is gone.
- **Retrieval results** (relevant material pulled from the codebase and docs). The trap is shoving in the whole repo and hoping the model finds the needle itself.
- **Historical feedback** (past comments, review threads). The trap is concatenating every comment indiscriminately — a stale gripe from three months ago carries the same weight as the one note that's relevant now, and dilutes the signal just as much.

## Why it matters

The intuition to break is "the window is big, so fill it."

Anthropic gives a name to a key effect: **context rot**. As the number of tokens in the window grows, the model's ability to accurately recall information goes down [A13]. The part that's easy to misread: it isn't a cliff at some hard limit — it's a gradual decay. The model stays capable, but its precision at retrieval and reasoning keeps dropping as the context lengthens [A13]. A performance gradient, not a cliff [A13].

The mechanism traces back to transformer attention. Every token attends to every other token, so n tokens produce n² pairwise relationships, and that web gets harder to maintain the longer the context runs [A13]. On top of that, training data skews toward shorter texts, so the model has seen relatively few very long sequences to begin with [A13]. Put the two together and the result is this: the extra hundred thousand tokens you packed in didn't just fail to help — they actively pulled attention off the few lines that mattered.

So the direction runs opposite to the intuition. A bigger window doesn't license "pour it all in" — it makes the decision of what to include and what to leave out matter more. The same model, fed a clean context aimed at the task versus fed the whole repo, can produce very different work. The gap isn't in how smart the model is; it's in whether you prepped its ingredients right.

## In practice

There are four core moves, applied roughly in order: **retrieve, summarize, compress, stage.** The goal never changes — leave only the high-signal tokens this task can use.

Retrieve on demand instead of preloading. Rather than flooding the window with all relevant data upfront, let the agent hold lightweight identifiers — file paths, URLs, stored queries — and pull the data at runtime with tools [A13]. This mirrors how people work: we don't memorize whole corpuses, we know where to look [A13]. Claude Code does exactly this — it writes targeted queries and uses commands like `head`, `tail`, and `grep` to work through large files and databases without reading whole objects into context [A13].

Have a sub-agent compress exploration into a summary. This is the move worth remembering. Let a sub-agent loose on a sub-problem in its own clean context — reading many files, running many commands — but have it return to the main coordinating agent not all the raw material it dug through, but a compressed summary, typically on the order of 1,000–2,000 tokens [A13]. The main agent's window then holds the conclusion, not the trail of how the conclusion was found. A pile of exploration stays out of the main context, and the attention budget is reserved for what actually needs coordinating.

Resume long tasks from a state file, not from chat history. Anthropic tested this directly on long-running agents: even a frontier model, looping across many context windows to build a production-quality web app, won't get there on compaction alone — compaction doesn't always pass clean handoff instructions to the next round [A2]. Their answer is to put progress in files outside the context: an `init.sh` to bring the environment up, a `claude-progress.txt` logging what each round did, alongside the git commit history [A2]. Each new agent session starts by reading the progress file and the git log to get its bearings, rather than digging through chat history that may already be compacted away [A2].

## Case

**150,000 to 2,000: keeping tools and data out of the window.** Anthropic gives a concrete example: transcribing a Google Drive document — the notes from a meeting — into a Salesforce lead record [A17].

The naive way is to call tools directly. Two things go wrong. First, most MCP clients load every tool definition into context up front; with dozens of servers and hundreds or thousands of tools connected, the model has to swallow hundreds of thousands of tokens of tool descriptions before it even reads your request [A17]. Second, intermediate results pass through the model twice: `getDocument` reads the full transcript into context, and writing it to Salesforce makes the model write the entire transcript out again — for a two-hour meeting, that round trip alone can burn an extra 50,000 tokens [A17].

Switch to "call tools by writing code" and both problems go at once. Present the tools as a code API on a filesystem; the agent lists the directory to discover which servers exist, reads only the two tool files it actually needs, and loads them on demand [A17]. The data is handled in the execution environment: the transcript goes from Google Drive straight into Salesforce without ever passing through the model's context [A17]. Same task, token usage drops from 150,000 to 2,000 — a 98.7% saving [A17].

**Ten thousand rows, see only five.** The same piece has a blunter example. To process a 10,000-row spreadsheet, the naive way returns all 10,000 rows into context and lets the model filter them itself [A17]. With code execution, the filtering happens in the execution environment and only the first five rows are printed for the model to review — the model sees five rows, not ten thousand [A17]. Aggregations, joins across sources, extracting specific fields — all of it can be compressed this way before the data enters the window [A17]. This is the forgotten half of mise en place: what doesn't belong on the station gets handled below it first.

**200-plus features, held up by one state file.** Back to the long-task work. To clone claude.ai, the initializer agent first writes a thorough feature list, expanding the user's one vague sentence into concrete items — over 200 of them in this case, each marked "failing" to start [A2]. The list lives in a JSON file (in testing the model edits JSON more carefully than Markdown, and is less likely to delete things wholesale), outside the context [A2]. Each later coding agent picks a single unfinished feature, flips its `passes` field once done, then commits to git and updates the progress file [A2]. The project's "where it got to" is carried in files from start to finish, not in a chat history that could never hold two hundred features anyway.

## Anti-patterns

- **Shoving the whole repo into the window.** "The window's big, give it everything to be safe" — it's the opposite. The extra material actively dilutes the signal and feeds context rot [A13]. Retrieve on demand and let the agent hold identifiers instead [A13].
- **Repo instructions written as prose.** A paragraph about "our culture of engineering excellence" yields no rule the agent can act on. Replace it with actions, commands, and off-limits zones.
- **A task that says only "fix the bug."** Without reproduction steps, a definition of done, and a no-touch zone, the agent guesses, and you pay for the wrong guesses.
- **Long tasks resuming from chat history.** History gets compacted and truncated; "where the last round got to" can vanish at any point. Put the state in a file [A2].
- **Concatenating all historical feedback.** A stale gripe from three months ago gets the same weight as the relevant note, spends the same budget, dilutes the same signal. Filter it.

## Checklist

- For this task, am I feeding the window "the part that's useful" or "everything I could find"?
- Can the agent **take a concrete action** from each line of the repo instructions, or only "absorb a spirit"?
- Does the task brief have **reproduction steps, a definition of done, and a no-touch zone**, or just "fix the bug"?
- Is heavy exploration handed to a **sub-agent that returns a summary** (around 1,000–2,000 tokens), instead of dumping the raw trail back into the main context?
- Is a large dataset filtered or aggregated **before it enters the window**, or poured in whole for the model to sift?
- Does the long task's state live in **files** (a progress file plus git), or is it betting it can recover from chat history?

## Self-test

- The last time you handed a task to an agent, what fraction of the context you fed it was actually useful for that task? The rest — was it helping the agent, or diluting it?
- If you wiped this task's chat history right now and kept only what you committed to files, could the next agent (or the next person) pick it up? If not, your state is living somewhere that disappears.
