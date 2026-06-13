---
id: ch13
order: 13
part_zh: 第三卷 · 新工程资产
part_en: Part III · The New Engineering Assets
title_zh: Tool 工程与 MCP：工具是给 agent 用的界面
title_en: Tool Engineering & MCP
sources: [A8, A18, A17, G4]
---

An API that feels good in a human's hands does not automatically feel good in an agent's. Take an endpoint that returns your entire address book and makes you scan it yourself: a person clicks past it in seconds, but an agent has to read every record token by token into a fixed context window. Same endpoint, two completely different experiences. Tool engineering is the work of treating the agent-facing side as an interface you design, instead of exposing a backend function raw.

Anthropic puts it plainly. Traditional software is a contract between deterministic systems — `getWeather("NYC")` fetches the same city's weather the same way every time. A tool is a contract between a deterministic system and a *non-deterministic agent*. Ask "should I bring an umbrella today?" and the agent might call the weather tool, answer from general knowledge, ask which city you mean first, or occasionally reach for the wrong tool entirely [A8]. So writing tools for an agent is not the same job as writing functions for another developer.

## Everyday analogy

Picture the knife wall in a kitchen.

A good one has three properties. It's **within reach**: the everyday chef's knife and paring knife hang where your hand lands first, while the specialty blades go in a drawer, so you never grab one you can't use for the task at hand. It's **labeled**: this one slices meat, that one's for bread, this one scales fish — you can tell at a glance instead of pulling each one out to check. And the **dangerous ones are locked away**: the boning knife and the razor-sharp chef's knife sit up high or in their own block, out of reach of anyone who hasn't earned them.

Now a new line cook arrives — skilled, but with no idea how your kitchen runs. You don't shove the whole wall plus the drawer of forty knives at him and say "help yourself." He'd freeze, pull each one out to study it, and then maybe grab the sharpest blade to cut a tomato. What you do instead: pick out the three or four knives this dish needs, lay them out, and say which one does what and which one not to touch.

Designing tools for an agent works the same way. Don't make the new hire improvise from a wall of knives, and don't let him grab the wrong one.

## Definition

A tool is an **interface built for an agent**. It wraps a capability — read logs, run tests, update a record — in a form the agent can understand, call correctly, and read the result of afterward. Its design target is the agent, not another backend service and not a human developer [A8].

A frequent mistake is treating a tool as a thin wrapper over an API: whatever endpoints the backend has, expose them one-for-one as tools. Anthropic calls this out directly — agents have different "affordances" from traditional software (different ways of perceiving the actions available to them), so porting an API straight across usually produces something awkward to use [A8]. You can judge a tool against six elements:

- **Name.** Verb plus object, scope made clear, so the agent knows at a glance what this knife is for — `run_unit_tests`, `search_logs`. Once you have many tools, namespace them: prefix by service or resource, like `asana_search`, `jira_search`, `asana_projects_search`, so the agent picks the right one out of dozens [A8].
- **Parameters.** Few and unambiguous; use enums where you can, give defaults where you can. Name them so there's no guessing — `user_id`, not `user` [A8]. Don't make the agent assemble a long shell string or free-form blob; that just hands it room to get the call wrong.
- **Output.** Structured, short, high-signal only. Anthropic's advice is to skip low-level identifiers like `uuid`, `256px_image_url`, `mime_type` and return fields that actually inform the next move, like `name` and `file_type`; resolving meaningless UUIDs into semantic names measurably cut Claude's hallucinations and raised retrieval precision [A8].
- **Errors.** On failure, don't hand back an opaque code or a traceback. Anthropic suggests writing error responses the way you'd write a prompt — say exactly what went wrong and how to fix it [A8]. A good error message answers three things: why it failed, whether a retry could help, and what to do next.
- **Permissions.** The boundary is checked by the tool itself, not by a line in the prompt that says "please don't drop the production database." This runs straight from the harness chapter: real guardrails live in the tool layer and the sandbox, not in the system prompt.
- **Cost.** Make it visible how much context one use of this knife spends. The tool definitions themselves, and every call's return, eat the agent's finite context. Claude Code caps a single tool response at 25,000 tokens by default and pairs that with pagination, range selection, filtering, truncation, and sensible defaults [A8] — not stinginess, but a response to context being the agent's scarcest resource.

The first four elements decide whether the agent uses the tool *correctly*; the last two decide whether it can *afford* to.

## Why it matters

The dominant cost of a tool isn't what one call spends. It's how much context the tool burns just by sitting there, before any work begins.

This problem doesn't exist when you write APIs for people. A human doesn't slow down because your SDK has 200 methods; the docs sit there and they look up whichever one they need. An agent is different: most MCP clients load *every* tool definition into context upfront. Anthropic's figure is that this alone can consume 50,000+ tokens [A18]. Make it concrete with a five-server setup — GitHub with 35 tools (~26K tokens), Slack with 11 (~21K), Sentry with 5 (~3K), Grafana with 5 (~3K), Splunk with 2 (~2K). That's 58 tools burning roughly 55K tokens [A18] — spent before the agent has read your first sentence.

Anthropic built a Tool Search Tool for exactly this: instead of loading every definition upfront, let the agent search for and load tools on demand. It brings the context spent before work begins down from about 77K tokens to about 8.7K [A18].

What's worth a senior reader's attention is that the same mechanism pays off differently across model generations. In Anthropic's internal testing, the Tool Search Tool moved tool-selection accuracy from 49% to 74% on Opus 4, and from 79.5% to 88.1% on Opus 4.5 [A18]. Two things hold at once: tool retrieval genuinely helps, and the stronger the model, the better it already picks the right tool from a pile, so the bolt-on has less headroom to add. Which means you can't take someone's tool setup, validated on one model, as settled fact — change the generation and the math may need redoing.

## In practice

**Subtract before you add retrieval.** More tools is not better. Anthropic's experience is to build a few thoughtful tools for high-value workflows and scale from there [A8]. Consolidate where you can: rather than `list_users`, `list_events`, and `create_event`, build one `schedule_event` that finds availability and books it under the hood; rather than `read_logs`, build `search_logs` that returns only the relevant lines plus context [A8]. Folding several steps into one call saves not just call count but the context those intermediate results would have occupied.

**When you genuinely have dozens or hundreds of tools, then reach for on-demand loading.** Anthropic gives concrete trigger lines: tool definitions consuming over 10K tokens, 10 or more tools available, or tool-selection accuracy already slipping — that's when to load on demand rather than all at once [A18].

**When the data is large, have the agent write code that filters in the execution environment instead of dumping raw results into context.** This is the second problem MCP's code-execution mode addresses. Direct tool calls carry a hidden cost: every intermediate result has to pass through the model. Anthropic's example is a two-hour meeting transcript — pulled from Google Drive, then written into Salesforce, the whole text flows through the model twice, potentially costing about 50,000 extra tokens [A17]. With code execution, the agent writes code that fetches, filters, and writes inside the execution environment, and the model only sees what the agent explicitly logs. Likewise, given a 10,000-row sheet, the agent can filter in code and log just the first 5 rows — the model sees 5, not 10,000 [A17].

Price this move honestly: running agent-written code needs a secure execution environment with a sandbox, resource limits, and monitoring — operational and security overhead that direct tool calls don't carry [A17]. You're trading context spend for infrastructure to maintain, and that trade has to be worth it for your case.

## Case

**A `run_targeted_tests` tool contract.** Pin the six elements to one real tool, and the part most worth getting right is error semantics. The point of the contract below is that it separates a *test failure* from *broken infrastructure* — two situations where the agent's next move is completely different:

```json
{
  "name": "run_targeted_tests",
  "description": "Run the named test targets in an isolated worktree. Returns only failing test names, file:line, and an assertion summary — not full logs.",
  "input_schema": {
    "type": "object",
    "properties": {
      "targets": {
        "type": "array",
        "items": {"type": "string"},
        "description": "Test node IDs, e.g. 'tests/test_orders.py::test_refund'. Empty = run tests affected by the change."
      },
      "verbosity": {
        "type": "string",
        "enum": ["summary", "full"],
        "default": "summary"
      }
    }
  }
}
```

The return splits success, assertion failure, and infrastructure error into three `status` values:

```json
{
  "status": "fail",          // pass | fail | infra_error
  "failed": [
    {
      "test": "tests/test_orders.py::test_refund",
      "location": "tests/test_orders.py:88",
      "assertion": "expected refund_status 'done', got 'pending'",
      "retryable": false
    }
  ],
  "next_step": "Assertion failure — a logic bug. Fix the implementation and rerun this one test."
}
```

Why `fail` and `infra_error` must be distinct: `fail` is work the agent should pick up — edit the code, rerun. `infra_error` (a dependency that won't install, a container that won't start, a network hiccup) is not something a few lines of code will fix; the agent should stop and report rather than retry against an error that has nothing to do with its change. The `retryable` and `next_step` fields are A8's "write the error response as a prompt" in practice — tell the agent why it failed, whether a retry helps, and what to do next [A8].

**GitHub exposes an agent as a tool to another agent.** GitHub's custom agents are a worthwhile artifact to study. You define a set of agent personas, each with its own prompt, tool selection, and MCP servers, configured under `.github/agents` in the repo. The key part: these custom agents are *exposed as tools to Copilot*, and when one is needed, the model invokes the relevant custom agent, which starts a new agentic loop of its own [G4]. So the "tool" interface need not wrap an API — it can wrap a whole agent. From the caller's side it's just one more knife on the wall; behind the knife is an entire loop that reads, edits, and runs on its own.

## Anti-patterns

- **All-tools-in-context.** Loading dozens or hundreds of tool definitions plus their docs into context at once. This is exactly the 58-tools-for-55K-tokens scene above [A18] — the agent's context is packed with knives it won't use this task before it has even read your request.
- **Exposing the API raw as tools.** Whatever endpoints the backend has, open them as tools, one-for-one. This is the mistake A8 names — agents' affordances differ from traditional software, and a `list_contacts` that returns every contact for the agent to read line by line just wastes its context [A8]. The right move is `search_contacts`.
- **Permissions by prompt.** Writing "don't drop the production database" in the system prompt and calling it a control. The boundary has to be checked by the tool itself; the harness chapter covers this in full.
- **Errors as tracebacks.** Returning a raw stack or an opaque code on failure, which the agent can't read and can only flail against. Replace it with the cause, whether a retry helps, and a suggested next step [A8].
- **No split between fail and infra_error.** Routing a test failure and a broken environment through the same exit, so the agent can't tell whether to fix code or stop and report — and ends up rerunning against an infrastructure error it had no part in.

## Checklist

- For each tool, does the **name** tell the agent at a glance what it does and how wide its scope is (verb + object + scope)?
- Are the **parameters** few and unambiguous, enumerated and defaulted where they should be, with no need for the agent to assemble a complex shell string?
- Is the **output** structured, short, and carrying path / line / status — rather than dumping raw identifiers and full logs back?
- Do **errors** state the cause, whether a retry helps, and a suggested next step, instead of a traceback?
- Is the **permission** boundary checked by the tool itself, or only written in the prompt?
- Have I counted how much context **all the tool definitions together** spend? Past 10K tokens / 10 tools? Do I need on-demand loading?
- For large-data tools, does the agent filter in the execution environment first, instead of dumping raw results into context?

## Self-test

- Print the toolbar you hand the agent: how many knives does this kind of task **never use**, yet they sit in context the whole time?
- The last time a tool call failed, did the agent get "assertion failure, fix this line and rerun" — something that guides the next move — or a traceback it can only flail against?
- If you moved the same tool setup from one model to the next generation, what makes you sure the payoff holds? Have you re-measured it on your own tasks?
