---
id: ch34
order: 34
part_zh: 第十卷 · 来源索引与待核查
part_en: Part X · Sources & Open Questions
title_zh: 待进一步核查的问题清单
title_en: Open Questions to Verify
sources: []
---

一本诚实的书会把自己不确定的地方摊开。这一章列出本书写作过程中已知的来源瑕疵、时效风险，以及付印前应当复核的点。把这些写出来，不是给自己留退路，而是因为：教读者"引用要自己核源"的书，自己更不能假装滴水不漏。

## 抓取失败或链接失效的来源

- **A9（stateful code sandbox with Claude Code and MCP）**：原文 URL 两轮抓取都返回 404，本地只存了一份失败说明，没有可引用的事实。相关内容（code execution、sandbox）已由 A17 承担，A9 不再出现在任何章节的引用里。需找到正确 URL 后重抓。
- **G4（AGENTS.md changelog，原标日期 2025-10-23）**：这个 URL 是一个 **404 幽灵**——格式规整、日期像模像样，却根本不存在。真实事实来自兄弟条目：AGENTS.md 对 coding agent 的支持于 **2025-08-28** 上线，custom agents 于 **2025-10-28** 在 GitHub Universe 发布。第 10 章把这件事本身写成了"连一手链接也可能是幻觉、必须自己核"的教学案例。付印前对照 live 的 2025-10-28 changelog 复核。
- **A12（Boris Cherny 的 FSI webinar）**：原页面已 404。本书改用对 Boris Cherny 的访谈（Pragmatic Engineer，记为 S8）替代，并明确标为二手。

## 部分抓取、需对照 live 复核

- **A13（effective context engineering）**：本地快照是两次抓取拼出的"忠实重建"，结构、数字、引用都保留，但散文略有压缩。引用到的 context rot、注意力的 n² 关系、1,000–2,000 token 的 sub-agent 摘要等，付印前对照官方页抽查。
- **S8（Boris Cherny 访谈）**：来源页订阅墙限制，快照只取到可见摘要。用到的引语（"好计划几乎每次一遍过""一个工程师开 5 个 Claude 实例、一天 20–30 个 PR"）来自可见部分；若拿到完整文字稿，建议核对上下文中的确切措辞。
- **A11 / A15 / A18 / G6 / G7** 等：部分为 partial 抓取。关键数字已逐条核对（A11 的 6 个百分点 / 约 6%、A18 的 55K/77K→8.7K 与 49%→74%、A17 的 150,000→2,000），但全文措辞付印前可对照 live 复核。

## 属于"本书自有框架"，不是厂商原文

- **PLAN / STATUS / DECISIONS / VALIDATION / HANDOFF 五件套**、以及各类模板（agent-ready issue、harness spec、tool contract、eval rubric、失败分类表等），是本书在各来源原则之上做的综合，不是某一篇的逐字表述。引用时按"本书框架 / 示例"理解。
- **eval 的六维**（结果/过程/安全/效率/可恢复/环境噪声）同理——各维度对应得上来源里的事实，但六分法本身是本书的组织方式。

## 已做的跨章一致性核对

为避免把不同来源的事实张冠李戴，几处容易混的地方专门核过：

- "发起任务的人不能批准 agent 自己的 PR"出自 **G8**（不是 G2）；G2 只说"所有 PR 需要独立的人来评审"。
- "Anthropic 量化基础设施噪声"的具体数字（6 个百分点等）出自 **A11**，不是 A2；A2 讲的是长任务 harness。
- A10 与 A10b 是同一篇文章的两个 URL（前者部分抓取、后者完整），已合并为 A10b。
- "每周 300 多万开发者用 Codex、覆盖完整 SDLC"出自 **O7**，是外部规模信号；"OpenAI 内部把 Codex 用于多种工作流"出自 **O1**——两者没混用。

## 时效

coding agent 领域迭代极快。本书所有事实截至**访问日期 2026-06-13**。涉及具体功能、价格、可用性、模型版本（如 GPT-5.3-Codex 在各入口的品牌、各产品的能力边界）的判断，付印或再版前都应对照官方页面复核。还需作者确认的零散点，包括：Boris Cherny 其它访谈的具体平台是否准确、各厂商功能在出版时是否仍然如本书所述。
