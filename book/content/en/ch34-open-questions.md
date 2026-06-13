---
id: ch34
order: 34
part_zh: 第十卷 · 来源索引与待核查
part_en: Part X · Sources & Open Questions
title_zh: 待进一步核查的问题清单
title_en: Open Questions to Verify
sources: []
---

An honest book lays out where it isn't sure. This chapter lists the known source defects, the freshness risks, and the points to re-check before print. Writing them down isn't covering ourselves — it's that a book teaching readers to verify their own citations can't pretend to be airtight.

## Sources that failed to fetch, or whose links are dead

- **A9 (stateful code sandbox with Claude Code and MCP)**: the original URL returned 404 across two rounds; only a failure note is stored locally, with no usable facts. The related material (code execution, sandboxing) is carried by A17, and A9 no longer appears in any chapter's citations. It needs the correct URL and a re-fetch.
- **G4 (AGENTS.md changelog, originally dated 2025-10-23)**: this URL is a **404 ghost** — tidy format, a plausible date, and it simply doesn't exist. The real facts come from sibling entries: AGENTS.md support for the coding agent shipped on **2025-08-28**, and custom agents were announced on **2025-10-28** at GitHub Universe. Chapter 10 turns this into a teaching case — even a first-party link can be a hallucination; verify it yourself. Re-check against the live 2025-10-28 changelog before print.
- **A12 (Boris Cherny's FSI webinar)**: the original page now 404s. The book uses a Boris Cherny interview (Pragmatic Engineer, recorded as S8) instead, clearly marked secondary.

## Partial fetches to re-check against live pages

- **A13 (effective context engineering)**: the local snapshot is a "faithful reconstruction" assembled from two fetches — structure, numbers, and quotes preserved, prose lightly condensed. Spot-check the cited facts (context rot, the n² attention relationship, the 1,000–2,000-token sub-agent summaries) against the official page before print.
- **S8 (Boris Cherny interview)**: the source page is subscriber-gated; the snapshot captured only the visible summary. The quotes used ("a good plan one-shots almost every time"; "one engineer running 5 Claude instances, 20–30 PRs a day") come from the visible part; if a full transcript becomes available, confirm the exact wording in context.
- **A11 / A15 / A18 / G6 / G7** and others: some are partial fetches. The key numbers were verified one by one (A11's 6 percentage points / ~6%, A18's 55K/77K→8.7K and 49%→74%, A17's 150,000→2,000), but the full wording can be re-checked against live before print.

## What belongs to the book's own framing, not a vendor's words

- The **PLAN / STATUS / DECISIONS / VALIDATION / HANDOFF five-pack** and the templates (agent-ready issue, harness spec, tool contract, eval rubric, failure table, and so on) are the book's synthesis on top of the sources' principles, not any one article's verbatim text. Read them as "the book's framing / examples."
- The **six eval dimensions** (outcome / process / safety / efficiency / recovery / infra noise) likewise — each maps to facts in the sources, but the six-way split is the book's own organization.

## Cross-chapter consistency we did check

To avoid attributing one source's facts to another, a few easily-confused spots were checked deliberately:

- "The person who requested the task cannot approve the agent's own PR" is from **G8** (not G2); G2 only says "all PRs require independent human review."
- "Anthropic quantified infrastructure noise" with the specific numbers (6 percentage points, etc.) is from **A11**, not A2; A2 is about long-running harnesses.
- A10 and A10b are two URLs for the same article (the former a partial fetch, the latter complete), consolidated to A10b.
- "More than 3 million developers use Codex weekly, across the full SDLC" is from **O7**, an external scale signal; "OpenAI uses Codex internally across workflows" is from **O1** — the two are not blended.

## Shelf life

This corner of software iterates fast. All facts are current as of **access date 2026-06-13**. Any claim tied to a specific feature, price, availability, or model version (such as the GPT-5.3-Codex branding across entry points, or any product's capability boundary) should be re-checked against the official page before print or a new edition. Loose ends still for the author to confirm include: whether the specific venues of Boris Cherny's other interviews are accurate, and whether each vendor's features are still as described at publication time.
