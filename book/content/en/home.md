---
id: home
order: 0
part_zh: 卷首
part_en: Front Matter
title_zh: 卷首：怎么读这本书
title_en: Front Matter — How to Read This
sources: []
---

## Who this is for

**Foundations and frontier, both.** One end is the newcomer learning to enter the field; the other is the senior SDE, tech lead, or architect pinning down what actually changed in the agent era. This book serves both ends.

The fundamentals of software engineering — requirements, architecture, contracts, quality, testing, version control, CI, project management — are taught **from the ground up, not skipped**, but never by rote: each concept opens with an **everyday analogy** (grocery shopping, food delivery, hiring a new contractor, a note on the fridge) so you enter on intuition, and once it lands, the text turns to **how that old concept shifts in the AI era — what's obsolete, what's downgraded, what matters more.** Senior readers can skim the foundation layer and go straight to the frontier. Professional and readable aren't in tension — that's what a good handbook looks like.

## The three-beat pattern

> **Everyday analogy → engineering definition → real case.**
> First make the intuition land with a concrete daily scene, then give the precise definition, then ground it in an engineering example with real numbers and real artifacts. Each chapter follows a nine-part skeleton: hook / analogy / definition / why it matters / in practice / case / anti-patterns / checklist / self-test.

## Source discipline

Every fact carries a **source ID** you can click to verify. Color marks the grade: <span style="color:#60a5fa">GitHub</span> / <span style="color:#34d399">OpenAI</span> / <span style="color:#c084fc">Anthropic</span> are **first-party** (a vendor stating facts about its own product); <span style="color:#fbbf24">S-prefixed</span> are **secondary analysis** (Willison, Karpathy, Yegge, METR, and other non-vendors). Anything with a "trend judgment" is synthesis, not any vendor's verbatim claim. As of writing (access date 2026-06-13) the products move fast, so every first-party fact was checked live on the web — including the discovery that an earlier textbook cited a **link that simply doesn't exist (404)**.

## The whole map (10 parts)

1. **The Reset** — the SDE's object of work changed: code is no longer the central artifact; what's obsolete, downgraded, newly critical; the role debate; how three vendor routes converge; frontier principles.
2. **Recalibrating the Core** — classic SE repriced for the agent era (requirements / architecture / quality / testing).
3. **The New Engineering Assets** — AGENTS.md, context engineering, state & handoff artifacts, tool/MCP engineering, Agent Skills.
4. **Harness Engineering** — definition, the 9-layer reference architecture, sandbox & security, eval, trace, maturity model.
5. **Agents Engineering** — an agent is a work unit; multi-agent patterns; managed agents & subagents; anti-patterns.
6. **Claude Code / Codex / Copilot in practice** — what each suits; writing agent-ready issues and instructions; review & rollback.
7. **Agentic Project Management** — from person-days to agent-ready work; new metrics and a failure taxonomy.
8. **Learning Path & Capstone** — learn by module; build a harness for a real repo.
9. **Template Appendix** — every engineering template, copy-and-paste.
10. **Source Index** — first-party and secondary listed separately, with dates and provenance.

> Switch **中文 / English** at the top right. All 34 chapters are written, in parallel Chinese and English; each one passed two literary-editing gates (Chinese and English) to strip AI-flavor, and every fact carries a clickable source, checked by hand against the snapshot for fabrication. The full source list is on the **Sources** page; known source defects and items to re-verify are in Chapter 34.
