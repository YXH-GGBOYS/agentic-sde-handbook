---
id: ch33
order: 33
part_zh: 第十卷 · 来源索引与待核查
part_en: Part X · Sources & Open Questions
title_zh: 来源索引与区分约定
title_en: Source Index & Provenance Conventions
sources: []
---

这本书里的每一条事实判断，都挂着一个来源 ID，可以点开查证。完整的可点击清单在站点的 **Sources / 来源索引** 页（顶栏可达）；这一章讲清楚怎么读它，以及一条贯穿全书的纪律：**把"厂商说的事实""厂商的立场""第三方分析""我们的推断"分开标，不混为一谈。**

## 四类来源，分开标

- **一手事实（first-party fact）**：厂商对自家产品、功能或测量结果的事实陈述。例如"AGENTS.md 受支持""auto mode 用一个分类器""基础设施配置差异让分数差 6 个百分点"。这类挂 GitHub（`G`）/ OpenAI（`O`）/ Anthropic（`A`）的 ID。
- **厂商立场（vendor framing）**：厂商的定位、判断、营销话术。例如"harness engineering 是 agent 成功的关键"。这类在正文里会和事实区分开，不当客观结论。
- **二手分析（secondary）**：非厂商的第三方分析，挂 `S` 开头的 ID（Willison、Karpathy、Yegge、Orosz、Osmani、Fowler、METR、Boris Cherny 访谈等）。正文里凡引用 `S`，都明确写"二手 / secondary"。
- **我们的推断（our inference）**：本书自己做的工程推断或综合框架（如 PLAN/STATUS/DECISIONS/VALIDATION/HANDOFF 五件套、各类模板），不冒充任何来源的原文，按"本书框架 / 示例"呈现。

## 颜色与编号

站点里来源芯片按厂商上色，一眼能区分级别：

- <span style="color:#60a5fa">**G** GitHub</span>、<span style="color:#34d399">**O** OpenAI</span>、<span style="color:#c084fc">**A** Anthropic</span> 是一手；
- <span style="color:#fbbf24">**S** 二手分析</span>是非厂商。

本书用到的来源共 49 条：41 条一手（GitHub / OpenAI / Anthropic 官方博客、changelog、文档、cookbook），8 条二手分析。每条在本地都存了一份带访问日期的快照。

## 访问日期与时效

所有事实截至**访问日期 2026-06-13**。coding agent 这一领域产品迭代极快——功能、价格、可用性、模型版本随时在变。凡涉及具体功能或数字的判断，付印或再版前都应对照官方页面复核。哪些来源在写作时就已经有抓取或时效问题，见下一章《待进一步核查的问题清单》。
