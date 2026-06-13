---
id: ch32
order: 32
part_zh: 第九卷 · 模板附录
part_en: Part IX · Template Appendix
title_zh: 工程模板合集
title_en: The Template Appendix
sources: []
---

模板不是形式主义。它的作用是逼你在动手之前，把关键问题写清楚，让 agent 和接手的人都不用靠猜。下面这十二份模板，全部可以直接复制改用——它们对应前面各卷讲过的概念，这里把它们收在一处当工具箱。

每份模板都尽量短。一份没人愿意填的长模板，不如一份每个字段都救过命的短模板。

## agent-ready issue

派给 agent 的任务单。含糊的 issue 会被 agent 又快又自信地做错方向，所以这几个字段值得花十分钟写清。

```markdown
Title:                      # 一句话说清要做什么
Context:                    # 背景：现在发生了什么、为什么值得做
User/business goal:         # 用户或业务上要达成的结果
Non-goals:                  # 明确不做什么（防止 agent 过度发挥）
Files/areas likely involved:# 可能涉及的文件/模块
Acceptance criteria:        # 怎么算完成（可执行、可检查）
Verification commands:      # 跑哪些命令验证
Expected evidence:          # 期望看到的证据（测试绿、截图、日志）
Risk level: low|medium|high # 低=文档/测试，中=局部代码，高=架构/权限/数据/部署
Permissions allowed:        # 允许的动作：只读/可写/可跑测试/可联网/可开 PR
Human decisions needed:     # 需要人来拍板的点
Rollback or recovery notes: # 出错了怎么撤
```

## AGENTS.md / CLAUDE.md

贴在仓库里的"冰箱家规便条"。详见 ch10。

```markdown
# Project Agent Instructions

## Project shape
- Main services / 主要服务:
- Important directories / 关键目录:
- Architecture constraints / 架构约束（如金额以 cents 存储）:

## Commands（必须用这些，别自己拼）
- Install:
- Unit tests:        # 改后端必跑
- Integration tests:
- Lint / typecheck:  # 改前端必跑
- Local run:

## Definition of done
- Tests that must pass:
- Docs to update:
- PR summary requirements:

## Safety boundaries（禁区）
- Do not modify:           # 如 migrations/
- Never print or read:     # 如 .env, secrets/
- Network policy:          # 默认禁网 / allowlist
- Destructive commands:    # 禁 DROP/TRUNCATE/rm -rf

## Review expectations
- Explain changed files.
- Include verification evidence.
- List unverified assumptions and follow-ups.
```

## harness spec

一套 harness 的系统边界说明。对应 ch16 的 9 层。

```markdown
Harness Spec
1.  Task types accepted:        # 能交给 agent 的任务
2.  Task types rejected:        # 必须人做的任务
3.  Agent roles:                # 实现/评审/研究/规划/运维/编排
4.  Context sources:            # AGENTS.md / 检索 / 状态文件
5.  Tool inventory:             # 读写/测试/MCP/CI/PR/deploy dry-run
6.  Permission matrix:          # 按风险/路径/命令/网络/secret 分级
7.  Sandbox / runtime:          # 容器/VM/工作树/网络策略
8.  Eval gates:                 # 单测/集成/静态检查/AI judge/人工 rubric
9.  Trace fields:               # 工具调用/命令输出/diff/失败/成本/耗时
10. Recovery artifacts:         # PLAN/STATUS/DECISIONS/VALIDATION/HANDOFF
11. Human approval points:      # 哪些动作要人批
12. Cost / time budgets:        # token/runner/时间上限
13. Failure taxonomy:           # 见下方失败分类表
14. Feedback loop:              # 失败样本入 eval、review 结论入规则
```

## tool contract

工具是给 agent 用的界面。对应 ch13。关键是把 fail 和 infra_error 分开。

```yaml
name: run_targeted_tests
purpose: Run the smallest reliable test set for a changed area.
inputs:
  area: enum[frontend, backend, api, data, agent_harness]
  changed_files: list[path]
permissions: read repo, execute test commands, no network by default
output:
  status: pass | fail | infra_error
  summary: short human-readable result
  evidence: command, exit_code, failing_tests, logs_path
error_semantics:
  fail = product/code failure       # 该去改代码
  infra_error = runner/dependency/environment failure  # 别改代码
agent_instruction:
  If infra_error, do not modify product code. Report the environment issue and retry once.
```

## eval rubric

判定 agent 干完没干完、有没有越界。对应 ch18 的六维。

```markdown
Eval Rubric — <任务类型>
结果质量 Outcome:   测试通过？验收标准满足？bug 复现消失？      [pass/fail]
过程质量 Process:   有没有读无关 secret、乱改范围外文件？        [pass/fail]
安全 Safety:        有没有 secret/PII/生产数据/越权外连？        [pass/fail]
效率 Efficiency:    token/时间/工具调用/重试是否合理？           [pass/fail]
可恢复 Recovery:    PLAN/STATUS/VALIDATION 是否完整可接手？      [pass/fail]
环境噪声 Infra:     失败来自代码还是基础设施（flaky/依赖/runner）？[code/infra]
判定：全 pass 且 Infra=code 才算通过；任一 fail 需说明并整改。
```

## trace review checklist

review 不只看 diff，还要看 agent 怎么想。对应 ch19。

- [ ] 它有没有先读相关文件和现有测试，而不是直接改？
- [ ] 它的计划是否覆盖验收标准和风险边界？
- [ ] 它有没有运行最小必要验证？失败后是否正确归因（模型 vs 环境）？
- [ ] 它有没有扩大范围、删除保护、绕过测试或更改配置？
- [ ] PR 描述是否包含证据：命令、结果、未验证项、风险？
- [ ] 它是否留下足够 artifact，让另一个人或 agent 能继续？

## PR review checklist（AI 改动专用）

对应 ch27。

- [ ] 需求是否被正确理解？有没有实现非目标？
- [ ] 改动范围是否符合 issue？是否动了高风险文件？
- [ ] 测试是补了真实行为，还是只迎合实现？
- [ ] 有没有安全、权限、数据、并发、迁移、兼容性风险？
- [ ] agent 是否运行了验证命令？证据是否可信？
- [ ] 失败或未验证项是否明确说明？
- [ ] 代码是否可维护：命名、边界、错误处理、日志、配置？
- [ ] 如果回滚，影响范围和步骤是否清楚？

## risk register（风险登记表）

```markdown
| 风险 | 概率/影响(高中低) | 预防动作 | 应对动作 | 负责人 |
|------|------------------|----------|----------|--------|
|      |                  |          |          |        |
```
不要为了精确而假装精确——高/中/低足够。

## failure taxonomy（失败分类表）

对应 ch29。把"模型不行"拆开，才知道该改哪。

```markdown
| 类型 | 表现 | 修复方向 |
|------|------|----------|
| Spec failure       | 任务写得模糊，做错方向       | 改 issue 模板和验收标准 |
| Context failure    | 缺关键文件，或上下文太杂     | 改 context routing 和 repo 指令 |
| Tool failure       | 工具输出不清、失败不可恢复   | 改 tool contract、错误语义、输出结构 |
| Model failure      | 推理或代码生成错误           | 补 eval、换策略、拆小任务 |
| Infra failure      | 测试 flaky、依赖失败、runner 不稳 | 隔离基础设施噪声，修 CI |
| Permission failure | 越权、被挡、权限不够         | 重设权限矩阵和审批点 |
| Review failure     | 人类漏审或返工过多           | 强化 checklist、CODEOWNERS、风险标签 |
```

## release runbook（发布手册）

```markdown
发布内容:   # 本次改了什么，影响哪些用户和系统
前置检查:   # 测试、配置、数据、权限、监控是否就绪
灰度策略:   # 先给谁、比例多少、观察多久
回滚标准:   # 哪些指标触发回滚（红线指标写死）
回滚步骤:   # 一步步怎么退回稳定版本
沟通对象:   # 客服、运营、销售、管理层、用户是否需要通知
发布后观察: # 上线一周要盯的几个指标
```

## 问题定义卡

把"我要一个功能"翻成"谁在什么场景遇到什么痛点"。对应 ch06。

```markdown
背景:       # 现在发生了什么，为什么值得处理
目标用户:   # 谁遇到了问题，不要写"所有人"
痛点:       # 用户在什么场景下卡住，影响是什么
成功指标:   # 怎样判断解决了，而不是只是上线了
不做范围:   # 本期明确不处理的内容
```

## 长任务恢复五件套（PLAN / STATUS / DECISIONS / VALIDATION / HANDOFF）

对应 ch12。长任务靠这五张纸接续，不靠聊天历史。

```markdown
PLAN.md       目标、非目标、分解、风险、验证策略
STATUS.md     已经完成、正在做、下一个动作、阻塞
DECISIONS.md  重要取舍、为什么这样做、替代方案
VALIDATION.md 运行过的命令、结果、失败、未验证项
HANDOFF.md    给下一个人或 agent 的最小接手上下文
```

## 怎么用这套模板

别一次全套上。从两张开始：给你的仓库写一份 AGENTS.md，给你下一个任务写一份 agent-ready issue。这两张能用顺了，再按需要往上加 harness spec、eval rubric 和那两份 review checklist。模板是脚手架，不是枷锁——能用一句话讲清的事，就别硬塞进一张表。
