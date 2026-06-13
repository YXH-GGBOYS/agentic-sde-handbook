---
id: ch33
order: 33
part_zh: 第十卷 · 来源索引与待核查
part_en: Part X · Sources & Open Questions
title_zh: 来源索引与区分约定
title_en: Source Index & Provenance Conventions
sources: []
---

Every factual claim in this book carries a source ID you can click to verify. The full clickable list lives on the site's **Sources** page (reachable from the top bar); this chapter explains how to read it, and one discipline that runs through the whole book: **keep "what the vendor states as fact," "the vendor's positioning," "third-party analysis," and "our own inference" labeled separately — never blend them.**

## Four kinds of source, labeled apart

- **First-party fact**: a vendor stating a fact about its own product, feature, or measurement — "AGENTS.md is supported," "auto mode uses a classifier," "infrastructure-config differences moved scores by 6 percentage points." These carry GitHub (`G`) / OpenAI (`O`) / Anthropic (`A`) IDs.
- **Vendor framing**: the vendor's positioning, judgment, or marketing — "harness engineering is the key to agent success." In the prose this is kept distinct from fact, not treated as an objective conclusion.
- **Secondary analysis**: third-party, non-vendor analysis, carrying `S` IDs (Willison, Karpathy, Yegge, Orosz, Osmani, Fowler, METR, the Boris Cherny interview, and so on). Wherever the prose cites an `S`, it says "secondary / 二手" plainly.
- **Our inference**: an engineering inference or synthesis framework the book makes itself (the PLAN/STATUS/DECISIONS/VALIDATION/HANDOFF five-pack, the templates), never passed off as a source's own words — presented as "the book's framing / an example."

## Color and numbering

Source chips on the site are colored by vendor so the grade is visible at a glance:

- <span style="color:#60a5fa">**G** GitHub</span>, <span style="color:#34d399">**O** OpenAI</span>, <span style="color:#c084fc">**A** Anthropic</span> are first-party;
- <span style="color:#fbbf24">**S** secondary</span> is non-vendor.

The book draws on 49 sources: 41 first-party (GitHub / OpenAI / Anthropic official blogs, changelogs, docs, cookbooks) and 8 secondary analyses. Each is stored locally as a snapshot with its access date.

## Access date and shelf life

All facts are current as of **access date 2026-06-13**. This corner of software moves fast — features, pricing, availability, and model versions change constantly. Any claim tied to a specific feature or number should be re-checked against the official page before print or a new edition. Which sources already had fetch or freshness problems at writing time is the subject of the next chapter, Open Questions to Verify.
