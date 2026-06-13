---
id: ch25
order: 25
part_zh: 第六卷 · 三大 coding agent 实战对比
part_en: Part VI · Claude Code / Codex / Copilot in Practice
title_zh: 三者定位与工作流差异
title_en: Positioning & Workflow Differences
sources: [A1, O7, O12, G1, G2, G5, G6]
---

Claude Code、Codex、GitHub Copilot 这三家，常被摆在一起问"哪个最强"。这个问法本身就不太对。它们更像同一个能干外包的三种用工方式：一种让他坐在你工位边、你说一句他改一句；一种让你写张工单贴出去、他领走自己干完再回来等你验；一种让他端着一整套门禁和验收流程、把活当成一条流水线推过去。模型谁强谁弱是一回事，这三种用工方式适配的任务根本不同，选错了不是模型的问题，是你把驻场的人当长包用了。

这一章不评高下，只把三者的定位、入口和工作流差异摆清楚，给你一张选型对照表，让你下次派活之前知道该按哪个铃。

## 生活类比

同样是请一个能干的外包，你可以有三种用法。

**第一种，驻场。** 人就坐在你工位旁边，屏幕跟你并排。你指着一行说"这儿不对"，他当场改；你说"先别动那个文件"，他立刻停手。好处是反馈极快、你全程在场、随时能掉头；代价是你得一直盯着，他不会自己跑去把整个仓库翻一遍再回来——你在，他才动。这是你在 IDE 或终端里跟 agent 同步结对的样子。

**第二种，派单。** 你写一张工单贴在墙上："登录超时后会话失效，修一下。"他领走，自己开一台机器、自己读代码、自己跑测试，干完把一份成果（一个 PR）挂回来，等你验收。中间你不用盯，他也不来烦你；但你交代得不清楚，他就照着你工单上写的字面意思干，没有当场纠偏的机会。这是 issue → PR 的异步用法。

**第三种，长包。** 把一个跨好几天、要分好几段、中间还得交接的大活整包出去。他不光当场把活干了，还会记着上次干到哪、明天接着干，跨工具去拉背景、自己安排后续。这种活最省你的事，也最考验那张"家规便条"和验收流程——交代不到位，他能连着跑偏好几天你都不知道。

三家工具在这三种用法上各有侧重，没有一家三种都做到极致。看清它各自的工位长什么样，比纠结"谁的模型分高"有用得多。

## 工程定义

先把三者各自是什么、入口在哪，用大白话讲清楚。

**Claude Code** 是 Anthropic 的 agentic 编码环境。它跟"你问它答、答完等着"的聊天机器人不同——它能读你的文件、跑命令、改代码，在你看着、纠偏，或者干脆走开的时候，自主地把问题推进下去 [A1]。它推荐的实践节奏是 explore → plan → code：先进 plan mode 只读不改地探索，再让它出一份详细实现计划，然后切出 plan mode 让它照计划写、对着计划自查，最后让它带描述性 commit 信息开 PR [A1]。围绕这个循环，它给了一套自治工具：subagent（在独立上下文里跑、有自己的工具集），hooks（在工作流特定节点必然触发的脚本，是确定性的，不像 CLAUDE.md 只是建议），以及三档降打扰的权限机制——auto mode（一个独立的分类器模型审命令，只拦 scope 升级、未知基础设施、被恶意内容驱动的动作）、permission allowlist（放行你确知安全的命令）、sandbox（OS 级隔离，限制文件系统和网络访问）[A1]。入口覆盖终端、IDE 和 web（Claude Code on the web 跑在 Anthropic 托管的隔离 VM 里）[A1]。

**Codex** 是 OpenAI 的编码 agent，底层是 GPT-5.3-Codex——OpenAI 称它是"迄今为止能力最强的智能体编程模型"，把前代的编程性能与 GPT-5.2 的推理和专业知识整合在一起，运行速度提升 25% [O12]。还有一点值得记一笔：OpenAI 说它是"首个在自身创建过程中发挥了关键作用的模型"——Codex 团队用它的早期版本调试自己的训练过程、管理自己的部署、诊断测试与评估结果 [O12]。Codex 已通过 ChatGPT 付费套餐上线，覆盖应用、命令行（CLI）、IDE 扩展和网页端 [O12]；定位是覆盖整个软件开发生命周期（SDLC）的伙伴，不止写代码和审代码 [O7]。

**GitHub Copilot coding agent** 是 GitHub 直接焊进 GitHub 工作流里的 SWE agent。你把一个 issue 指派给 Copilot，它就在后台启动一个由 GitHub Actions 支撑的安全开发环境，clone 仓库、跑测试、随做随把改动以 commit 推到一个 draft PR 上，全程在 session log 里留痕，干完 tag 你来 review [G1][G2]。这里要分清它的两个形态：**coding agent** 是异步的、像队友一样在 GitHub Actions 里自己干完开 PR；**agent mode** 是同步的、在 VS Code / JetBrains / Eclipse / Xcode 里实时跟你结对、当场改当场修 [G2]。

一句话收口：Claude Code 把重心放在终端/IDE 里那个反馈极快的同步循环和你自己搭的自治工具上；Codex 把重心放在一个能横跨整个 SDLC、多入口都能进的伙伴上；Copilot coding agent 把重心放在"issue → draft PR"这条异步流水线，以及焊死在 GitHub 平台里的护栏上。

## 为什么重要：AI 时代的变化

过去选 IDE 插件，差别多半在补全准不准、卡不卡。现在选 coding agent，差别在**它默认把多少决策权和执行权交到模型手里，以及护栏卡在哪一层**。这件事一旦选错，代价不是"少个功能"，是错配了用工方式。

把驻场的人当长包用，你会得到一个没人盯、又缺验收的自治 run——它读了一半上下文就开干，跑偏了你还在开会。反过来，把长包的活塞进同步驻场，你会被钉在屏幕前一句句确认，agent 一闲下来就停，本该省下的时间一点没省。三家工具默认把你推向不同的用法：Claude Code 的同步循环鼓励你在场纠偏，Copilot 的 issue→PR 鼓励你贴完工单走人，Codex 的 automations 甚至能让 agent 给自己排后续、隔几天醒来接着干一个长任务 [O7]。选型该先问的不是"谁分高"，是"这个任务我想以哪种方式用工"。

还有一层变化：护栏从 prompt 里挪到了平台里。Copilot 把几条边界硬卡进系统——agent 只能 push 到它自己建的分支，发起任务的人不能批准这个 agent 开的 PR，联网只走可定制的白名单，CI/CD 不经你批准不会跑 [G1]。这些不是写在提示词里的客套话，是工具层、权限层、流程层卡出来的。同一类边界，Claude Code 交给你用 sandbox、allowlist、hooks 自己搭 [A1]。一个把护栏内置进平台，一个把搭护栏的零件交到你手里——这正是"派单/长包"和"驻场"两种定位的分水岭。

最后，模型确实在快速变强，但跑分要看清测的是什么。GPT-5.3-Codex 在 Terminal-Bench 2.0 上拿到 77.3%，明显高于 GPT-5.2-Codex 的 64.0% 和 GPT-5.2 的 62.2% [O12]——这条基准衡量的是 Codex 这类编码 agent 需要的终端操作技能，跟"它在你这套工作流里好不好用"是两件事。基准是模型能力的体温计，不是工作流适配度的体温计。

## 实践方法

派活之前，先问一句：这个任务我想要哪种用工方式？答案基本就决定了入口。

**同一个任务，三家分别怎么用。** 拿"登录超时后会话失效，修一下"举例：

- 用 **Claude Code（驻场）**：在终端或 IDE 里，先进 plan mode 让它读 `src/auth/`、搞清 token 刷新怎么走，出一份计划；你当场看计划、改两笔；切出 plan mode 让它写一个能复现的失败测试再修，对着计划自查，最后开 PR [A1]。全程你在场，跑偏一句话就能拽回来。
- 用 **Copilot coding agent（派单）**：把这个 bug 写成 issue 指派给 Copilot，它在 GitHub Actions 的临时环境里自己读代码、跑测试、推 commit 到 draft PR，干完 tag 你 [G1][G2]。你贴完工单就能去干别的，回来 review 那个 PR。
- 用 **Codex（看你想要哪种）**：它多入口都能进——想同步就在 CLI 或 IDE 扩展里盯着干，想异步/长线就交给它，让它覆盖从写代码到调试、部署、监控的整条 SDLC [O7][O12]。

**四种入口分别什么时候用：**

- **IDE / CLI（同步驻场）**：你想全程在场、随时纠偏，任务边界还没完全想清。Claude Code、Codex、Copilot agent mode 都走这条 [A1][O12][G2]。
- **issue（异步派单）**：任务能写成一张清楚的工单、你愿意贴完就走。Copilot coding agent 的主入口就是把 issue 指派给它 [G1][G2]。
- **PR（审查/收口）**：活已经成形，你要的是审查和收口。Codex 的应用支持处理 GitHub review comment、审 PR [O7]；Copilot 的 draft PR 本身就是交接物，你在 PR 上 `@copilot` 留言它会自动跟进改 [G2]。
- **cloud（长线/规模化）**：你要并行开多个、或者跑跨天的长任务、或者在任何设备上接续。Claude Code on the web 在托管 VM 里跑 [A1]；Codex 的 automations 能复用线程、给自己排后续、隔几天醒来续上 [O7]；Copilot 的云端 sandbox 是隔离的临时 Linux 环境，可远程接续 [G5]。

**选型对照表：**

| 维度 | Claude Code | Codex | Copilot coding agent |
|---|---|---|---|
| 主要用工方式 | 驻场（同步结对为主）| 多入口、横跨 SDLC | 派单（issue → PR 异步）|
| runtime / 执行处 | 本地（终端/IDE）、web 跑托管隔离 VM [A1] | 本地 CLI/IDE、应用、网页端 [O12] | GitHub Actions 临时环境 [G1][G2] |
| 入口 | 终端 / IDE / web [A1] | CLI / IDE 扩展 / 应用 / 网页端 [O12] | issue / Agents 面板 / VS Code / CLI [G1][G2] |
| 护栏在哪 | 你用 sandbox / allowlist / hooks 自己搭 [A1] | 应用与平台侧 | 平台硬卡（分支限制 / 双人批准 / 联网白名单 / CI 需批准）[G1] |
| 典型适合 | 在场纠偏的探索式开发、并行多 checkout | 跨整条 SDLC 的端到端工作、长任务 | 边界清楚、可异步交付的中低复杂度活 [G1] |

表里的"典型适合"是定位侧重，不是硬边界——三家入口都在互相靠拢，但默认把你推向的用法不同。

**多家统一编排。** 如果你不想被锁在一家：GitHub 在 GitHub Universe 2025 上发布了 Agent HQ，把多家厂商的 agent 统一编排进 GitHub。来自 Anthropic、OpenAI、Google、Cognition、xAI 的 coding agent 会陆续向 Copilot Pro+ 订阅者开放（OpenAI 的 Codex 当时已可在 VS Code Insiders 里立即使用）[G6]；配套的 Mission Control 是一个横跨 GitHub、VS Code、移动端和 CLI 的统一指挥台，用来指派、监控、管理这些 agent 任务 [G6]。也就是说，"用哪家的 agent"和"在哪个平台编排"可以拆开看。

## 真实案例

**Claude Code：一个 bug 修复的 explore→plan→code 全程。** A1 给的样例工作流是四段式 [A1]：第一段在 plan mode 里只读地探索（"read /src/auth and understand how we handle sessions and login"）；第二段让它出计划（"I want to add Google OAuth. What files need to change? Create a plan"），并可按 `Ctrl+G` 把计划拉进编辑器直接改；第三段切出 plan mode 实现（"implement the OAuth flow from your plan. write tests... run the test suite and fix any failures"）；第四段开 PR。它还明确给了 tradeoff：plan mode 有 overhead，遇到改一行就能说清的小活（typo、加日志、改名）直接让它干、别走 plan——"如果你能用一句话描述这个 diff，就跳过 plan" [A1]。这正是"驻场"的味道：每一段你都在场，能改计划、能拽回来。

**Codex：把 agent 用进自己的研发流程。** O12 给了一组很具体的内部用法 [O12]：研究团队用 Codex 监控并调试这次发布的训练 run；工程团队用它优化和调整 GPT-5.3-Codex 自己的测试框架（harness），定位上下文渲染里的 bug、找出缓存命中率低的根因；发布期间它持续帮团队动态缩放 GPU 集群以扛住流量激增。Alpha 阶段一位研究员想知道新模型每轮多干了多少活，Codex 自己构思了几个正则分类器，在大规模会话日志上跑，生成了一份带结论的报告 [O12]。这些不是 demo，是一家公司拿自己的 agent 干自己最硬的活——也是"覆盖整条 SDLC"这句话的实证。

**Copilot：护栏长在平台里的 issue→PR 流水线。** G1/G2 描述的流程是 [G1][G2]：你把 issue 指派给 Copilot，它加个 👀 反应、在后台启动 GitHub Actions 临时环境，clone 仓库、用 RAG（GitHub code search 驱动）分析代码，随做随推 commit 到一个 tag 为 [WIP] 的 draft PR，并在 session log 里留下推理和验证步骤；干完 tag 你 review，你在 PR 上 `@copilot` 留言它自动跟进改。默认护栏硬卡在系统里：只能 push 到它自己建的分支（如 `copilot/*`）、所有 PR 需独立人工 review、CI/CD 不经批准不跑、发起人不能批准自己 agent 的 PR、联网受防火墙限制 [G1][G2]。这就是"派单"落到一个真实平台里的样子——工单、临时操作间、监控录像、验收员，全是平台给你配好的。

**给 issue 写一张能让 agent 照做的工单。** 异步派单成不成，全看工单写得清不清。一个能用的模板：

```markdown
## 标题
登录超时后会话失效

## 症状
用户报告：会话 timeout 之后再操作会被登出。怀疑在 token 刷新环节。

## 怀疑位置
src/auth/，尤其是 token refresh 那段。

## 完成判据（DoD）
- 先写一个能复现该问题的失败测试，再修。
- 相关测试全绿；不要 suppress 报错，要修根因。
- PR 描述里写清：改了什么、跑了哪些验证、未验证项。

## 边界
- 不要动 migrations/。
- 联网走默认白名单即可。
```

这张工单对应 A1 反复强调的一条：给 agent 一个它自己能跑的 check（测试/构建/截图），把"看起来对了"换成一个能产出 pass/fail 的信号，循环才能自己收口 [A1]。

## 常见反模式

- **拿基准分当选型依据。** 看见 GPT-5.3-Codex 在 Terminal-Bench 2.0 上 77.3% 远超对手 [O12]，就断定"所有任务都该用 Codex"。基准测的是终端操作技能这类具体能力，不是"它在你这套工作流、你这个任务类型上好不好用"。分高是必要条件，不是选型答案。
- **把用工方式和工具锁死。** 以为"驻场只能用 A、派单只能用 B"。其实 Codex 多入口都进、同步异步都行 [O12][O7]，Copilot 既有异步 coding agent 也有同步 agent mode [G2]。锁死的是任务该用哪种方式，不是哪家工具。
- **异步派单却把工单写成散文。** 给 Copilot 指派一个 issue，只写"把登录体验优化一下"。它在临时环境里没法当场问你，只能照字面跑偏。异步用法对工单清晰度的要求，比同步驻场高得多——同步还能当场拽，异步拽不回来。
- **以为护栏到处都一样。** 把 Copilot 平台硬卡的那几条边界（分支限制、双人批准、联网白名单）[G1] 当成所有 agent 的默认。换到 Claude Code，这些得你自己用 sandbox、allowlist、hooks 搭起来 [A1]；不搭，就是裸奔。
- **多入口都开着、上下文却各跑各的。** 这正是 GitHub 做 Mission Control 想解决的问题——agent 分散在多个窗口、你跟丢谁在跑、PR 落下来看不出 agent 试过什么 [G5]。入口多不等于协同好，没有一个统一的视图，并行就是混乱。

## 检查清单

- 派这个活之前，我想清楚要哪种用工方式了吗——**驻场（同步在场纠偏）、派单（异步贴工单）、还是长包（跨天交接）**？
- 我选的入口（IDE/CLI / issue / PR / cloud）跟这种用工方式**对得上**吗？
- 如果走异步派单，我的 **issue / 工单**写清了症状、怀疑位置、完成判据、边界吗？还是写成了散文？
- 这个 agent 的**护栏**是平台帮我卡好的（Copilot 那几条），还是需要我自己用 sandbox / allowlist / hooks 搭（Claude Code）？搭了吗？
- 我有没有给它一个**自己能跑的 check**（测试/构建/截图），让"完成"是个 pass/fail 信号而不是"看起来对了"？
- 我是不是只盯着**基准分**在选，而没问"它在我这个任务类型、这套工作流上合不合适"？
- 如果同时开了多个入口/多个 agent，我有没有一个**统一的视图**知道谁在跑、跑到哪？

## 自测

- 给你一个"登录超时后会话失效"的 bug，你会分别用三家中的哪一家、走哪个入口、为什么？能不能各说出一条它适配的理由和一条不适配的代价？
- 你上一次用 agent，是"驻场"用法还是"派单"用法？如果当时是派单（贴个 issue 走人），你的工单清楚到能让一个完全不懂这个项目的人照着修吗？做不到，agent 也做不到。
- GPT-5.3-Codex 在 Terminal-Bench 2.0 上 77.3% [O12]——这条分能告诉你它"在你团队这套工作流里好不好用"吗？为什么不能？说清这个差别，你才算没被跑分牵着走。
