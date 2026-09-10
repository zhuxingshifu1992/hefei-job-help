# 07 · 操作 CheckList

> 用法：按场景勾选，全部打勾才算完成。**没做的不要打勾**——这份清单的价值在于可追溯。

---

## A. 日常数据更新（每次改数据时）

```
□ 1. 拉取最新数据
     python tools/fetch_tdoc.py
     □ 输出「_source.json 已生成，共 N 条」，无报错

□ 2. 判断实质变化（避免空提交）
     □ 条数/内容有变化 → 继续
     □ 仅时间戳变化   → 记录「无实质变化」并可结束

□ 3. 生成 info.json
     node tools/gen-info.js
     □ 条数与 _source.json 一致

□ 4. 提交前安全检查
     □ git status 中不含 tools/.gh_token
     □ 无临时文件 / 日志被误加

□ 5. 提交
     □ commit message 含类型前缀 + 条数 + 日期

□ 6. 推送
     □ PUSH_OK
     □ git remote -v 已复位为干净地址

□ 7. 部署验证（等 50 秒）
     □ ls-remote SHA == 本地 HEAD
     □ 线上 data/info.json 的 updatedAt 已更新为今天
     □ index/info/plan 三个页面 HTTP 200
```

---

## B. 新增/修改资讯条目（主动巡检时）

```
□ 1. 至少 2 轮搜索（1 轮发现 + 1 轮逐个验证）
□ 2. 跑 edit_source.py list 做名称去重
     □ 确认候选不在已有列表中（按名称相似度，不只看 id）
□ 3. 每条候选过三条硬标准
     □ 有可验证主体（官网 / 小程序 / 公司名 / 百科）
     □ 无前置费用（入驻费 / 押金 / 培训费 / 会员费）
     □ 平台内透明结算
     □ 不满足的已记录「跳过原因」
□ 4. 评分（rating）符合标准：5 合规有背书 / 4 真实有加分 / 3 待本地验证 / 2 存疑 / 1 不推荐
□ 5. note 字段写清风险提示与核实要点
□ 6. 先 --dry-run 校对，再 sync_tdoc.py 写回
□ 7. 生成 + 推送 + 验证（同 A 的第 3~7 步）
□ 8. 汇报：新增了谁、跳过了谁（含原因）、当前总数
```

---

## C. 计划重置（换阶段时）

```
□ 1. 确认新计划的 id / title / start / end / goal
□ 2. 改 assets/js/store.js 的 defaultPlan()
     □ tasks 的 due 日期从今天起排，不早于今天
     □ 任务数量与阶段划分合理
□ 3. 生成 plan-import.json
     □ 格式正确：顶层 {"wb_jobsearch_plans": "<JSON字符串>"}
     □ 用 json.loads 验证能解析
□ 4. 更新 求职计划.md（人类可读版）
□ 5. 提交推送 + 部署验证
     □ 线上 store.js 里 grep 到新的计划 id
□ 6. 通知使用者
     □ 新设备/新浏览器 → 打开即生效
     □ 老设备已有旧计划 → 需「导入」plan-import.json 或清网站数据
```

---

## D. 换机 / 新 agent 接手

```
□ 1. 读 delivery/README.md（总览）
□ 2. 读 09-环境依赖.md，核对 Python / Node / Git 路径
     □ 三条 --version 都能出
□ 3. 克隆仓库，配置 user.name / user.email / core.autocrlf
□ 4. 放置 tools/.gh_token，并确认 .gitignore 已忽略
□ 5. 跑 health-check.sh，逐项确认 OK
□ 6. 跑一次完整的 daily-update.sh 验证闭环
□ 7. 读 memory/decisionLog.md 与 memory/.handoff.md 了解历史决定
□ 8. 确认自动化任务状态（哪些 ACTIVE / PAUSED）
```

---

## E. 每月维护

```
□ 安全审计（03-权限与安全配置.md §3）
     □ 工作区无密钥待提交
     □ 仓库内无 token
     □ 脚本无硬编码 token
□ 检查 PAT 是否临近过期（GitHub → Settings → Developer settings）
□ 检查工具链路径是否漂移（Python/Node 版本目录、腾讯文档插件版本）
□ 确认两份自动化的运行状态是否符合预期
□ 核对 delivery/README.md 中的「当前状态」是否仍然准确
```

---

## F. 每季度 / 重大变更后

```
□ 打一个 tag（02-分支提交与版本管理.md §3）
□ 备份一次完整仓库（10-迁移备份与恢复.md）
□ 复盘：资讯条数增长、任务完成情况、是否调整计划节奏
□ 更新 delivery/ 交付包中被流程变更影响的文档
```
