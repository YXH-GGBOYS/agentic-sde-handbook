# 细化目录 · Agentic SDE 手册

**书名（中）**：Agentic 软件工程手册 —— AI 与 coding agent 时代的 SDE 与项目管理
**书名（EN）**：The Agentic Software Engineering Handbook — SDE & Project Management in the Age of Coding Agents
**副标题**：从"会写代码"到"设计、约束、验证、治理一套软件交付系统" / From writing code to designing, constraining, verifying, and governing a software-delivery system.

> 本目录是要交用户批注的草案。每章标注：核心问题 / 生活锚点 / 真实案例·工件 / 来源 ID。小节到 N.x 粒度。
> 组织原则：按概念深度与依赖排，不按天数。**既覆盖软件工程基础（照顾新人入门，基础不跳过、不假设已会），也覆盖 agent 时代前沿与重定价——两者都有**；基础用生活类比讲生动，资深读者可快速略过基础直取前沿。每个硬概念配一个详实生活类比；中心隐喻（agent=新外包 / harness=给他的工作环境）贯穿全书。**每节开头不加"一句话"小标题，直接进正文。**

---

## 卷首 · Front Matter

- **怎么读这本书**：读者画像（资深 SDE / 技术负责人 / 架构师；新人可从生活锚点入）；难度与前置；体例约定（每节的九段骨架、来源标注法、一手 vs 二手）。
- **中心隐喻**：coding agent = 能力极强但不懂你家规矩的新外包；AGENTS.md = 冰箱家规便条；harness = 工位+工具+门禁+隔离操作间+验收员+撤回键；eval = 试用期考核；trace = 监控录像。
- **一页全景图**：从 issue 到 PR 到发布，人和 agent 各站在哪。

---

# 第一卷 · 格局重置：SDE 的工作对象变了
*Part I — The Reset: the SDE's object of work has changed*

### 第 1 章 代码不再是中心产物 · Code is no longer the central artifact
- **核心问题**：如果 agent 能生成代码，SDE 到底在交付什么？
- **生活锚点**：从"亲手炒菜的厨师"到"开餐厅的人"——你的产物从一盘菜变成一整套能稳定出餐的后厨系统。
- **真实案例·工件**：OpenAI 28 天用 Codex 做出 Sora 安卓版（小团队 + 明确任务 + 审查）[O6]；GitHub 把产物从 commit 扩成 issue→PR→Actions→session log 全链 [G1][G2]。
- **来源**：O1 O6 G1 G2 A2
- **小节**：
  - 1.1 产物清单变了：代码、测试、issue、trace、eval、sandbox、agent 指令、PR 讨论、发布脚本一起构成产物
  - 1.2 四个不可逆迁移：prompt→harness、chatbot→agent runtime、benchmark→production eval、个人速度→组织吞吐
  - 1.3 价值上移：人从"逐行写"移到"定义问题、设边界、定验收、控风险、定架构"
  - 1.4 自检：你现在的"产能瓶颈"到底卡在打字，还是卡在定义与验证？

### 第 2 章 什么过时了，什么降级了，什么反而更重要 · What's obsolete, downgraded, and newly critical
- **核心问题**：哪些根深蒂固的工程直觉在 agent 时代要改？
- **生活锚点**：买菜——以前比的是"谁砍价快"，现在超市明码标价，比的是"会不会挑、会不会验货、知不知道这顿饭要做成什么"。
- **真实案例·工件**：METR 的 RCT：2025 早期 AI 工具让资深开源开发者**变慢 19%**，但他们自以为快了——"快"的直觉不可信 [S7]（二手实证）。
- **来源**：S7 S1 S4 A1（旧教材"应降级旧观念"表升级版）
- **小节**：
  - 2.1 过时：需求一次写完照做、程序员只写代码、测试放最后、文档越厚越专业、用了 AI 就先进
  - 2.2 降级：手写样板代码的熟练度、记忆 API 细节、本地 IDE 个人效率崇拜
  - 2.3 反而更重要：问题定义、架构可逆性、契约清晰度、可维护性、验证与回滚、判断力
  - 2.4 一个反直觉：生成更快 → 错误也更快被放大 → 验证与治理的边际价值上升

### 第 3 章 角色之争：SDE 会消失，还是会升舱 · The role debate
- **核心问题**：junior 会被取代吗？资深的护城河在哪？（呈现辩论，不灌单一叙事）
- **生活锚点**：从"亲自盖房的工匠"到"管一支装修队的工长"——会用人、会验收、会兜底的人更值钱。
- **真实案例·工件**：四方观点对照——Karpathy「Software 3.0 / vibe coding」[S2]、Willison「vibe engineering：判断/测试/计划/担责」[S1]、Yegge「junior 的逆袭：管 agent 舰队」[S3]、Orosz「质量从来不卡在打字速度」[S4]；用 METR [S7] 当实证锚。
- **来源**：S1 S2 S3 S4 S6 S7（全部二手，明确标注）
- **小节**：
  - 3.1 三种未来叙事 + 一个实证锚（并列呈现，标明分歧）
  - 3.2 "70% 问题"：agent 能到 70%，最后 30% 是工程判断 [S6]
  - 3.3 能力地图：哪些技能贬值、哪些升值、哪些是新增技能
  - 3.4 给不同人的建议：junior / 资深 / 技术负责人各自怎么调整

### 第 4 章 三条路线正在汇合 · Three vendor routes are converging
- **核心问题**：GitHub、OpenAI、Anthropic 各押什么？共识与分歧在哪？
- **生活锚点**：三家快递公司——有的把重心放在"网点和分拣线"（平台），有的放在"快递员本身有多能干"（模型+runtime），有的放在"长途多段转运怎么不丢件"（长任务+治理）。
- **真实案例·工件**：GitHub Agent HQ「any agent」[G6]；OpenAI harness engineering + Agents SDK 平台化 [O1][O2]；Anthropic long-running harness + containment [A2][A3][A6]。
- **来源**：G1 G5 G6 O1 O2 O7 A1 A2 A3
- **小节**：
  - 4.1 GitHub 路线：workflow-native，把 agent 塞进 issue/PR/Actions，扩到桌面/CLI/cloud
  - 4.2 OpenAI 路线：平台与系统，Codex + Agents SDK + harness + eval + sandbox
  - 4.3 Anthropic 路线：把 agent 当长期工程伙伴，explore→plan→code、context/tool/sandbox/eval
  - 4.4 共同趋势 vs 真实分歧（别把营销话术当共识）

### 第 5 章 前沿 SDE 的工程原则 · Engineering principles (the through-line)
- **核心问题**：贯穿全书的硬原则有哪些？（先给骨架，后面各章展开）
- **生活锚点**：开餐厅的"店规"——先立规矩，再谈菜式。
- **来源**：O1 O4 O5 A1 A8 A10 A11 G2 G3
- **小节**：
  - 5.1 没有 eval 就没有自治（No eval, no autonomy）
  - 5.2 issue 是可执行规格，不是愿望清单
  - 5.3 repo 指令是一等工程资产
  - 5.4 context 是预算不是垃圾桶；工具为 agent 设计；先探索再计划再执行
  - 5.5 自动化必须可撤销；sandbox 是基础设施；trace 是新的评审材料
  - 5.6 基础设施噪声要量化；人类判断要上移；多 agent 不是越多越好

---

# 第二卷 · 软件工程基础与 AI 时代重校
*Part II — Software Engineering Foundations, Recalibrated*

> 本卷**先把基础讲清楚（新人能入门），再讲 agent 时代怎么重定价**——两层都有。每章结构：用生活类比把基础概念讲透 → 给准确定义 → 接"AI 时代它怎么变 / 降级 / 反而更重要"。资深读者可略过基础层、直接看重定价层。
> （需要时本卷可再加几章纯基础铺垫：软件交付全流程、版本控制与分支、CI/CD 基础、估算与排期基础——按建站时内容密度决定是否独立成章。）

### 第 6 章 需求与问题定义的重定价 · Requirements & problem framing, repriced
- **核心问题**：agent 把执行变快后，模糊需求的代价为什么更高？
- **生活锚点**：点外卖——你说"来份炒饭"，新外包真就给你最便宜那份；你要的其实是"够两个人吃、不要辣、20 分钟内到"。
- **真实案例·工件**：把"首页加 AI 推荐"翻成可验证问题定义卡；agent-ready 的"成功指标"写法。
- **来源**：G3（WRAP）A2
- **小节**：6.1 需求 vs 真问题（老概念，新代价） · 6.2 成功指标如何变成 eval 的种子 · 6.3 非目标（non-goals）在 agent 时代的防爆作用 · 6.4 问题定义卡模板

### 第 7 章 架构、模块化与契约的重定价 · Architecture, modularity & contracts, repriced
- **核心问题**：为什么"能跑"在 agent 时代更不够了？架构为何更重要？
- **生活锚点**：装修水电——agent 改起代码飞快，但埋错的管线（坏边界）会让它在错误的墙上猛凿。
- **真实案例·工件**：把 AI 模型调用封装成 `generateAnswer()` 而非散落各处；好的模块边界如何限制 agent 的"误伤半径"。
- **来源**：A3 A8
- **小节**：7.1 架构决定 agent 的"爆炸半径" · 7.2 高内聚低耦合 = agent 友好 · 7.3 契约思维：输入/输出/错误/权限/性能 · 7.4 API 与数据契约工件

### 第 8 章 代码质量与可维护性的重定价 · Code quality & maintainability, repriced
- **核心问题**：写得更快后，读和改为什么反而更贵？
- **生活锚点**：写给三个月后的你，也写给那个不懂你家规矩的新外包看。
- **真实案例·工件**：`if (u.t==3 && x>7 && !f)` → 语义化命名前后对比；技术债记录在 agent 时代的新用途（喂给 agent 当上下文）。
- **来源**：A1 A8
- **小节**：8.1 可读性是给人也是给 agent 的接口 · 8.2 重构 vs 重写在 agent 手里的边界 · 8.3 技术债：可借但要记，且要让 agent 读得到

### 第 9 章 测试与验证的重定价：从"测代码"到"测 agent" · Testing & verification, repriced
- **核心问题**：当代码由 agent 生成，测试承担了什么新角色？
- **生活锚点**：招聘试用期——面试（demo）漂亮没用，要看真实任务干三个月的表现。
- **真实案例·工件**：优惠券结算的 8 条边界用例；为什么 agent 写的代码尤其爱漏边界、爱迎合实现写假测试。
- **来源**：A10 A10b A11 A19 O5
- **小节**：9.1 测试金字塔仍在，但权重上移到"验证 agent" · 9.2 测试即规格、测试即 eval 种子 · 9.3 AI 写的测试如何防"迎合实现" · 9.4 抗 AI 的技术评估设计 [A19]

---

# 第三卷 · 新工程资产：agent 时代新增的"源文件"
*Part III — The New Engineering Assets*

### 第 10 章 repo 指令文件：AGENTS.md / CLAUDE.md · Repo instruction files
- **核心问题**：怎么把"团队默会知识"写成机器可读、agent 真会照做的规则？
- **生活锚点**：冰箱上的家规便条——东西放哪、什么别碰、做完怎么通知你。写给新外包看，不是写给你自己看。
- **真实案例·工件**：给一个真实仓库写的**完整 AGENTS.md**（命令、禁区、验收、风格、安全边界、review 期望）；GitHub 的 AGENTS.md + 多类 custom instructions [G4]；Anthropic 的 CLAUDE.md 实践 [A1]。
- **来源**：G4 G1 A1
- **小节**：10.1 为什么散文文档 agent 读不懂 · 10.2 必备字段：项目形状/命令/DoD/安全边界/review 期望 · 10.3 分层：repo 级 / 目录级 / 个人级 · 10.4 常见反模式：写成给人看的散文、规则互相矛盾 · 10.5 完整模板

### 第 11 章 Context 工程：让 agent 在正确范围内变聪明 · Context engineering
- **核心问题**：上下文是稀缺预算，怎么花？
- **生活锚点**：后厨备菜（mise en place）——该备的料提前备齐摆好，别等火上来了满厨房找葱。
- **真实案例·工件**：context 是预算不是垃圾桶——检索片段 vs 硬塞全仓库的对比；Anthropic「effective context engineering」的分层/检索/摘要/压缩 [A13]。
- **来源**：A13 A2 A17
- **小节**：11.1 上下文窗口 = 注意力预算 · 11.2 五类上下文材料与各自的坑 · 11.3 检索/摘要/压缩/分阶段 · 11.4 长任务靠状态 artifact 续命，不靠聊天历史 · 11.5 code execution with MCP：用代码代替塞工具结果省 context [A17]

### 第 12 章 状态与交接工件：让长任务可恢复 · State & handoff artifacts
- **核心问题**：agent 跑一半断了/换人接手，怎么不从零开始？
- **生活锚点**：施工日志 + 交接班记录——这班干到哪、卡在哪、为什么这么决定、下一班先干什么。
- **真实案例·工件**：PLAN / STATUS / DECISIONS / VALIDATION / HANDOFF 五件套实样；长任务 harness 的 initializer/checkpoint [A2][A3]。
- **来源**：A2 A3
- **小节**：12.1 五个 artifact 各管什么 · 12.2 checkpoint 与恢复 · 12.3 给"下一个人或 agent"的最小交接上下文 · 12.4 模板

### 第 13 章 Tool 工程与 MCP：工具是给 agent 用的界面 · Tool engineering & MCP
- **核心问题**：给人好用的 API，为什么 agent 不一定会用？
- **生活锚点**：厨房刀具摆放——趁手、标签清楚、危险的锁起来；别让新人拿错刀还自己拼一把。
- **真实案例·工件**：`run_targeted_tests` 的 **tool contract**（含 infra_error 语义）；Anthropic「writing tools for agents」+「advanced tool use」的命名/输出形状/错误语义/token 成本 [A8][A18]；MCP 是什么、什么时候用 [A17][A9]。
- **来源**：A8 A18 A17 A9 G4
- **小节**：13.1 工具即 agent UX，不是 API 暴露 · 13.2 名称/参数/输出/错误/权限/成本六要素 · 13.3 MCP：协议、server、什么时候自建 · 13.4 code execution 模式 vs 直接工具调用 · 13.5 tool contract 模板 + 反模式（all-tools-in-context）

### 第 14 章 Agent Skills：把专业能力打包复用 · Agent Skills
- **核心问题**：怎么把一套"做某类活的专业流程"沉淀成 agent 可复用的能力？
- **生活锚点**：给新外包一本"这家店怎么做某道招牌菜"的活页菜谱，要用时翻出来。
- **真实案例·工件**：Anthropic Agent Skills（渐进式披露、文件夹结构、什么时候用 skill 而非 MCP）[A15]；与 CLAUDE.md/工具/subagent 的边界。
- **来源**：A15 A14
- **小节**：14.1 skill 是什么、解决什么 · 14.2 skill vs tool vs repo 指令 vs subagent · 14.3 渐进式披露与 token 经济 · 14.4 写一个 skill 的结构

---

# 第四卷 · Harness 工程专章
*Part IV — Harness Engineering (the core)*

### 第 15 章 Harness 是什么，不是什么 · What a harness is and isn't
- **核心问题**：harness 工程到底指什么？和 test harness、prompt 模板有何不同？
- **生活锚点**：给新外包搭的整个工作环境——工位、工具墙、门禁、隔离操作间、验收台、急停按钮、撤回键。harness 不是某个工具，是这一整套。
- **真实案例·工件**：OpenAI 对 harness 的定义（agent 周围的验证/反馈/恢复/工具/上下文/人类判断层）[O1]；Anthropic long-running harness 的构成 [A2]；Fowler/Böckeler「harness engineering」[S5]（二手）。
- **来源**：O1 A2 A3 S5
- **小节**：15.1 定义与边界 · 15.2 与传统 test harness 的区别 · 15.3 为什么模型再强也需要 harness · 15.4 harness 的失败形式（不可复现/权限乱/无 eval/不可恢复）

### 第 16 章 9 层参考架构 · The 9-layer reference architecture
- **核心问题**：一套可落地、不绑供应商的 harness 系统边界长什么样？
- **生活锚点**：一条完整的"接活到交活"流水线，每一段都有人/有闸。
- **真实案例·工件**：逐层展开 intake/planning/context/tools/permissions/sandbox/eval/trace/review/feedback 的"最低可用 vs 成熟做法"；一份完整 **harness spec** 实样。
- **来源**：O1 A2 A3 A5 A6 A10 A11 G1 G8
- **小节**：16.1 Intake：什么任务能进 · 16.2 Planning：谁拆任务 · 16.3 Context · 16.4 Tools · 16.5 Permissions · 16.6 Sandbox · 16.7 Evals · 16.8 Review · 16.9 Trace · 16.10 Feedback/Learning · 16.11 各层串起来的一次完整流转

### 第 17 章 Sandbox、权限与安全：强 agent 需要强边界 · Sandbox, permissions & security
- **核心问题**：当 agent 能跑命令、读仓库、联网、开 PR，安全底线怎么设？
- **生活锚点**：隔离操作间 + 门禁分级 + 食材索证——不让新人直接在生产车间动手，每个动作留痕可审计。
- **真实案例·工件**：Claude Code sandboxing「beyond permission prompts」[A16]、how we contain Claude [A6]、auto mode 的分类器/权限/恢复 [A5]；OpenAI Codex Windows sandbox [O8]、内部 agent misalignment 监控 [O9]；GitHub cloud agent 的 allowlist/分支保护/Actions 审批 [G1][G8]。prompt injection 的工具层防护。
- **来源**：A5 A6 A16 O8 O9 G1 G8
- **小节**：17.1 威胁模型：prompt injection / secret 泄露 / 破坏性命令 / 网络外连 / 供应链 / 越权 / 数据合规 · 17.2 权限矩阵：按风险/路径/命令/网络/secret 分级 · 17.3 sandbox 形态：容器/VM/工作树/网络策略 · 17.4 auto mode ≠ 无限授权 · 17.5 安全底线清单 + 风险登记表

### 第 18 章 Eval：没有评估就没有自治 · Eval
- **核心问题**：怎么判断 agent "干完了"且"干对了""没乱来"？
- **生活锚点**：试用期考核——不是看面试 demo，是真实任务上的多维持续打分。
- **真实案例·工件**：eval 六维（结果/过程/安全/效率/可恢复/环境噪声）；Anthropic demystifying evals [A10b]、AI-resistant evals [A19]；OpenAI evals 作为可设计可复用能力 [O5]、agent improvement loop [O4]；为什么 demo case 当 eval 是「eval theater」。
- **来源**：A10 A10b A19 O4 O5
- **小节**：18.1 eval ≠ test：还要测理解/越权/浪费/跳验证/会不会求助 · 18.2 六个维度 · 18.3 rubric / AI-judge / 人工评分 / 回归集 · 18.4 用真实失败样本构 eval，不用漂亮 demo · 18.5 eval rubric 模板

### 第 19 章 Trace 与可观测性：新的代码评审材料 · Trace & observability
- **核心问题**：review 只看 diff 够吗？怎么看 agent"怎么想、试了什么、哪步失败"？
- **生活锚点**：监控录像 + 汽车故障码——不只看结果，要能回放过程、定位是哪一段出的问题。
- **真实案例·工件**：trace review checklist（它先读了吗/计划覆盖验收吗/跑了最小验证吗/扩大范围了吗/PR 描述带证据吗/留够 artifact 了吗）；基础设施噪声如何量化、别把 flaky 当模型错 [A11]。
- **来源**：A11 O4 A2
- **小节**：19.1 trace 字段：工具调用/命令输出/diff/失败原因/成本/耗时 · 19.2 trace review checklist · 19.3 区分模型错 vs 环境噪声 · 19.4 trace 如何回流进 eval 与规则

### 第 20 章 成熟度模型与企业落地 · Maturity model & enterprise rollout
- **核心问题**：组织从 L0 到 L5 怎么走？每一级的下一步是什么？
- **生活锚点**：从"偶尔叫个临时工"到"有一支管理规范的外包班组"。
- **真实案例·工件**：L0–L5 成熟度表（chatbot 辅助 → 个人 AI 编码 → agent-ready repo → delegated PR → managed agents → learning harness）+ 每级的落地动作与度量。
- **来源**：A2 A3 A4 G2 O7
- **小节**：20.1 L0–L5 各级特征与下一步 · 20.2 从哪一级起步、怎么不跳级 · 20.3 企业落地模板与常见卡点

---

# 第五卷 · Agents 工程专章
*Part V — Agents Engineering*

### 第 21 章 一个 agent 是一个工作单元，不是一个 prompt · An agent is a work unit
- **核心问题**：agent 的最小定义是什么？SDE 要为它决定哪些事？
- **生活锚点**：雇一个新外包——你要定他的职责边界、给什么工具、多大权限、什么时候交接、怎么验收、出事怎么解释。
- **真实案例·工件**：六类 agent（实现/评审/研究/规划/运维/编排）各自适合什么、主要风险；Anthropic building agents with the Agent SDK 的 agent 构成 [A14]。
- **来源**：A14 A1 O3
- **小节**：21.1 agent = 目标+工具+上下文+权限+评估方式 · 21.2 六种 agent 角色与风险 · 21.3 它能不能自行动手：自治分级 · 21.4 反模式：one mega agent

### 第 22 章 多 agent 模式 · Multi-agent patterns
- **核心问题**：什么时候该上多 agent？怎么不让它们打架、爆预算？
- **生活锚点**：一个班组多个外包——分工、不同时凿同一面墙、有个工长统筹和验收。
- **真实案例·工件**：orchestrator-workers、generator-evaluator、parallel exploration、adversarial reviewer、specialist agents 五模式；Anthropic 多 agent 研究系统（何时值得、协调/预算/综合）[A7]；用并行 Claude 造 C 编译器的案例 [新, A 系列]。
- **来源**：A7 A4 A2
- **小节**：22.1 五种模式与适用场景 · 22.2 编排器的职责：控范围/预算/最终一致性 · 22.3 evaluator 要独立 · 22.4 反模式：多 agent 崇拜、上下文碎片

### 第 23 章 Managed agents 与 subagents：把脑和手解耦 · Managed agents & subagents
- **核心问题**：怎么在不失控的前提下扩展并行 agent 工作？
- **生活锚点**：总包 vs 分包——总包（brain）做决策和验收，分包（hands）干隔离的具体活，接口清楚。
- **真实案例·工件**：Anthropic scaling managed agents「brain/hands 解耦」[A4]；Claude Code subagents 的上下文隔离与整合层 [A1][docs]。
- **来源**：A4 A1
- **小节**：23.1 brain/hands 解耦 · 23.2 subagent 的上下文隔离 · 23.3 整合与评估层不能省 · 23.4 反模式：无边界授权、无 eval 自治

### 第 24 章 Agents 工程反模式合集 · Anti-patterns
- **核心问题**：哪些做法"看起来先进、实际危险"？
- **生活锚点**：把全店钥匙都给新人、活儿过了 demo 就自动发货——迟早出事。
- **来源**：A5 A6 A10 A11（汇总）
- **小节**：24.1 prompt worship / all-tools-in-context / auto-merge fantasy / one mega agent / no failure taxonomy / eval theater / security by prompt / throughput vanity · 24.2 一句硬标准：No eval, no autonomy

---

# 第六卷 · 三大 coding agent 实战对比
*Part VI — Claude Code / Codex / Copilot in practice*

### 第 25 章 三者定位与工作流差异 · Positioning & workflow differences
- **核心问题**：同一个任务，三家分别适合怎么用？
- **生活锚点**：三种用工方式——驻场（IDE 同步）、派单（issue→PR 异步）、长包（长任务 + 多段）。
- **真实案例·工件**：Claude Code（终端/IDE/web，explore→plan→code，subagent/hooks/skills）[A1]；Codex（CLI/IDE/cloud/code review，GPT-5.x-Codex）[O7][O12][O13]；Copilot coding agent（issue→Actions→draft PR，Agent HQ）[G1][G2][G6]。
- **来源**：A1 O7 O12 O13 G1 G2 G5 G6
- **小节**：25.1 同步 IDE 协作 vs 异步派单 vs 长任务 · 25.2 各自的 runtime（终端/Actions/cloud）· 25.3 repo/issue/PR/CLI/cloud/IDE 六种入口 · 25.4 一张选型对照表

### 第 26 章 写 agent-ready issue 与 repo 指令 · Writing agent-ready issues & instructions
- **核心问题**：issue 和 AGENTS.md 怎么写，agent 产物质量才高？
- **生活锚点**：给外包的派工单——含糊一句"修一下"vs 写清背景/验收/验证命令/风险/可动范围。
- **真实案例·工件**：GitHub WRAP 法（写清/细化/原子/配对）[G3]；agent-ready issue 模板；同一个需求"坏 issue vs 好 issue"对照。
- **来源**：G3 G2 G4 A1
- **小节**：26.1 WRAP · 26.2 issue 必备字段 · 26.3 三家的 instruction 文件差异与统一 · 26.4 坏/好对照案例

### 第 27 章 Review、rollback 与 Boris Cherny 的工程精神 · Review, rollback & the Claude Code ethos
- **核心问题**：agent 的活怎么收？怎么设计可回滚？Claude Code 团队的实践精神是什么？
- **生活锚点**：验收 + 退货政策——验收员独立、尾款押在验收后、随时能退货回滚。
- **真实案例·工件**：requester 不能自批 PR、CI 要人批 [G1]；PR review checklist for AI changes；Boris Cherny 访谈里的精神（explore→plan→code、给好工具和清晰边界、用测试与 artifact 收敛、"tokenmaxxing"）[S8]（二手，标注）。
- **来源**：G1 A1 S8（+ 其余 Boris Cherny 访谈见来源索引）
- **小节**：27.1 review 三件套：diff + trace + 证据 · 27.2 rollback 设计 · 27.3 Boris Cherny / Claude Code 工程精神综述（明确二手）· 27.4 PR review checklist

---

# 第七卷 · Agentic 项目管理
*Part VII — Agentic Project Management*

### 第 28 章 从排人天到排 agent-ready work · From person-days to agent-ready work
- **核心问题**：任务可以更快执行后，PM 的新瓶颈是什么？
- **生活锚点**：包工头排活——不再排"几个人几天"，而排"哪些活能外包、谁来验、验收台堵不堵"。
- **真实案例·工件**：agent-ready backlog 的标准；把 review capacity / runner capacity / context 质量纳入排期。
- **来源**：G3 A2（旧教材 agentic PM 升级）
- **小节**：28.1 新瓶颈：定义/验证/整合/治理而非打字 · 28.2 agent-ready backlog 六条 · 28.3 风险分级与人类决策点 · 28.4 哪些任务必须人做

### 第 29 章 新度量与失败分类学 · New metrics & failure taxonomy
- **核心问题**：进度怎么报？不是 PR 数，那是什么？
- **生活锚点**：餐厅看的不是"出了多少盘"，是"多少盘被客人接受没退、返工成本多少"。
- **真实案例·工件**：accepted safe changes、first-pass acceptance、review load、escalation quality、eval coverage、cost per accepted change；失败分类学（spec/context/tool/model/infra/permission/review）+ 各自修复方向。
- **来源**：A11 O9 A10
- **小节**：29.1 七个新指标 · 29.2 别看 throughput vanity · 29.3 失败分类学与归因 · 29.4 风险登记表 / 失败分类模板

---

# 第八卷 · 学习路径与 Capstone
*Part VIII — Learning Path & Capstone*

### 第 30 章 按模块的学习路线（不按天） · Module-based learning path
- **核心问题**：怎么把这套东西学成"能落地"，而不是看个热闹？
- **小节**：30.1 模块图（每模块：学习目标/核心材料/练习/交付物）· 30.2 三条路线（个人上手 / 团队落地 / 组织治理）· 30.3 每模块的 1-2 个一手材料指引

### 第 31 章 Capstone：为真实 repo 设计 agentic SDE harness · Capstone
- **核心问题**：把全书用一遍——给一个真实仓库建一套 harness 并跑通。
- **小节**：31.1 选 repo、建 AGENTS.md/CLAUDE.md/runbook · 31.2 挑 10 个真实任务、按风险分级、写成 agent-ready issue · 31.3 设计 harness（权限/工具/sandbox/trace/eval/handoff）· 31.4 跑 3 次 agent run（实现/测试补全/review）· 31.5 存 trace/diff/验证/失败原因，形成 failure taxonomy · 31.6 结业报告：什么适合委派、什么不适合、下一轮怎么改 harness · 31.7 评分 rubric

---

# 第九卷 · 模板附录
*Part IX — Template Appendix（全部可复制）*

### 第 32 章 工程模板合集 · Templates
- 32.1 agent-ready issue · 32.2 AGENTS.md / CLAUDE.md · 32.3 harness spec · 32.4 tool contract · 32.5 eval rubric · 32.6 trace review checklist · 32.7 PR review checklist（AI 改动专用）· 32.8 risk register · 32.9 failure taxonomy · 32.10 release runbook · 32.11 问题定义卡 · 32.12 PLAN/STATUS/DECISIONS/VALIDATION/HANDOFF 五件套

---

# 第十卷 · 来源索引与待核查
*Part X — Sources & Open Questions*

### 第 33 章 来源索引 · Source index
- 33.1 一手来源（GitHub G* / OpenAI O* / Anthropic A*）：ID + URL + 发布日期 + 访问日期 + 采用信号
- 33.2 二手分析（S*：Willison/Karpathy/Yegge/Orosz/Osmani/Fowler/METR/Boris Cherny 访谈）：明确标注非厂商
- 33.3 区分约定：first-party fact / vendor framing / secondary analysis / our inference

### 第 34 章 待进一步核查的问题清单 · Open questions to verify
- 产品迭代快、部分页面已 404 或改版（如 FSI webinar）；列出"目前来源不足/不确定"的判断，标注需要复核的点与时间。

---

## 体例备注（建站与写作共用）
- 每章**开头直接进正文（不加"一句话"小标题）**，再走八段骨架：生活类比 / 工程定义 / 为什么重要·AI 时代变化 / 实践方法 / 真实案例·trace·工件 / 反模式 / 检查清单 / 自测题。
- 基础章把"工程定义"讲透（新人能入门）；前沿章把"AI 时代变化 + 真实案例"讲重。
- 事实引用挂来源 ID；一手与二手在视觉上区分（建站用不同色标）。
- 中英平行：`content/zh/chNN-*.md` ↔ `content/en/chNN-*.md`。
- 章节粒度可在批注阶段合并/拆分；卷的划分相对稳定。
