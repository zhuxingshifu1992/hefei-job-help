# 「帮老弟找工作」GitHub 建设与运维 · 交付包总览

> 本交付包的目标：**换电脑、换 AI agent 时，仅凭这个文件夹就能零上下文复刻整个项目**。
> 内容聚焦「仓库建设 + 长期更新运维」，网页业务本身（页面功能、陪诊业务逻辑）只在影响运维决策处提及，不展开。
>
> 文档生成日期：2026-09-10　｜　基于项目真实状态整理，所有常量均已实测核对。

---

## 1. 项目背景与目标

| 项 | 内容 |
|---|---|
| 项目目的 | 帮助家人在**合肥**找到**陪诊师**工作，用一张静态网页聚合「可接单平台 / 本地招聘 / 求职计划」三类信息 |
| 服务对象 | 一位零基础起步的求职者（非技术用户），手机+电脑都能看 |
| 为什么用 GitHub | ① 免费静态托管（GitHub Pages）；② 有版本历史可回滚；③ 可挂自动化定时更新 |
| 运维核心目标 | **资讯能持续更新**、**计划能随时重置**、**换人换机不丢流程** |

## 2. 当前状态（2026-09-10 实测）

| 项 | 值 |
|---|---|
| 仓库地址 | `https://github.com/zhuxingshifu1992/hefei-job-help.git` |
| 线上站点 | `https://zhuxingshifu1992.github.io/hefei-job-help/` |
| 分支 | 仅 `main`（单分支，无 develop/release） |
| 提交数 | 13 次 |
| Tag | **0 个**（尚未建立版本规范，见 `02-分支提交与版本管理.md`） |
| 资讯条数 | 63 条（2026-09-10 更新） |
| 当前计划 | `p0910`「合肥陪诊师 60 天冲刺计划（2026秋·9/10起）」，9/10~11/09，23 个任务 |
| 每日自动化 | `automation-1785898412205` —— **PAUSED**（已暂停） |
| 巡检自动化 | `automation-1785980498191` —— **ACTIVE**（每两周周日，联网补新平台） |
| 部署方式 | 推 `main` 即自动部署 GitHub Pages，约 40~60 秒生效 |

## 3. 一页看懂架构

```
腾讯文档表格（人类可读镜像，FILE_ID=ZLPnsrYSgVgU）
        │  fetch_tdoc.py 拉取
        ▼
data/_source.json   ←── 本地「单一可编辑源」（唯一权威数据）
        │  edit_source.py 增删改
        │  sync_tdoc.py 写回（可选）
        ▼
tools/gen-info.js
        ▼
data/info.json  ──→  网页 fetch 轮询（5 分钟）
        │
        ▼
git push main ──→ GitHub Pages 自动部署 ──→ 求职者浏览器
```

**两条铁律**：
1. `data/_source.json` 是唯一权威源，腾讯文档只是镜像。断网时改本地完全可以，联网后再 `sync_tdoc.py` 写回。
2. 计划数据存在**每个访客自己的浏览器 localStorage**，服务端（仓库）里只有「默认计划」。老访客不会因为你推了新版就自动变，必须导入或清网站数据。

## 4. 快速上手路径（新机器 / 新 agent，约 30 分钟）

按顺序执行，每一步都可验证：

| 步骤 | 做什么 | 看哪份文档 | 验证方式 |
|---|---|---|---|
| 0 | 核对环境（Python / Node / Git 路径） | `09-环境依赖.md` | 三条 `--version` 都能出 |
| 1 | 克隆仓库、配置 remote | `05-命令清单.md` §1 | `git remote -v` 显示干净地址 |
| 2 | 放置 GitHub token | `03-权限与安全配置.md` | `test -f tools/.gh_token` 且已在 `.gitignore` |
| 3 | 跑通一次「拉数 → 生成 → 推送」 | `05-命令清单.md` §3 | 线上 `data/info.json` 的 `updatedAt` 变成今天 |
| 4 | 配置定时自动化（可选） | `04-日常更新与运维节奏.md` | 自动化面板显示 ACTIVE |
| 5 | 用 CheckList 收尾自检 | `07-操作CheckList.md` | 全部勾选 |

> ⚠️ 如果你是新 agent：**先读 `09-环境依赖.md` 和 `08-故障排查手册.md`**，本项目 90% 的坑都在这两份里（路径漂移、取票 404、沙箱拦截）。

## 5. 文档导航

| 文件 | 覆盖内容 |
|---|---|
| `01-仓库建设全流程.md` | 仓库规划与初始化、目录与命名规范、README/文档编写规范 |
| `02-分支提交与版本管理.md` | 分支策略、Commit Message 规范、Tag 与版本管理 |
| `03-权限与安全配置.md` | GitHub PAT 配置、.gitignore、密钥安全、审计方法 |
| `04-日常更新与运维节奏.md` | 每日/每两周/按需三种节奏、自动化任务、Pages 部署验证 |
| `05-命令清单.md` | 全文可照抄命令（环境/拉取/编辑/生成/推送/验证/回滚） |
| `06-配置模板与脚本/` | `.gitignore`、`.gitmessage`、`.editorconfig` 模板 + 一键脚本 |
| `07-操作CheckList.md` | 日常、每周、每月、换机四类检查清单 |
| `08-故障排查手册.md` | 9 类真实踩过的故障与解法 |
| `09-环境依赖.md` | 本机路径、版本、沙箱限制、已知路径漂移 |
| `10-迁移备份与恢复.md` | 换机迁移、备份策略、灾难恢复 |

## 6. 关键常量速查（复刻时照抄）

```
仓库根（本机）      D:\帮老弟找工作项目
远端仓库            https://github.com/zhuxingshifu1992/hefei-job-help.git
线上站点            https://zhuxingshifu1992.github.io/hefei-job-help/
主分支              main
腾讯文档 FILE_ID    ZLPnsrYSgVgU
腾讯文档 SHEET_ID   BB08J2
本地权威数据        data/_source.json
前端消费数据        data/info.json
计划导入文件        plan-import.json
Token 文件          tools/.gh_token（已被 .gitignore 忽略）
Python              C:/Users/YC1039/.workbuddy/binaries/python/versions/3.13.12/python.exe
Node                C:/Users/YC1039/.workbuddy/binaries/node/versions/22.22.2-2/node.exe
```

---

**维护约定**：任何人改动了运维流程（新增脚本、改路径、换 token 方式），必须同步更新本交付包对应文档，否则「零上下文复刻」会失效。
