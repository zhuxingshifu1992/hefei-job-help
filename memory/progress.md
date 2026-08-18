# 项目进度

## 已完成
- [x] 建立长期项目记忆（Harness 框架：AGENTS.md + memory/ 九件套）
- [x] 确认第一阶段交付目标：纯 HTML 工作台 + 资讯自动更新 + 实时分享给弟弟
- [x] 搭建纯 HTML 工作台 V1（index/info/plan 三页 + assets/css×3 + assets/js×5 + data×3）
- [x] 部署到 GitHub Pages（永久链接：https://zhuxingshifu1992.github.io/hefei-job-help/，首页与 info.json 均验证 200）
- [x] 对接腾讯文档作为资讯数据源（建表「陪诊师接单资讯源」+ seed 38 条 + tools/fetch_tdoc.py 拉表脚本 + gen-info.js 改为读表格源）
- [x] 打通每日自动更新链路：自动化 automation-1785898412205 改为「fetch_tdoc → gen-info → 带重试 git push」，push 已验证成功（d798cd2 main->main）
- [x] 新增 tools/edit_source.py（对 _source.json 做加/改/删，AI 编辑资讯的统一入口）
- [x] 新增 tools/sync_tdoc.py（把 _source.json 写回腾讯文档表格，AI 改完→同步文档的通道）
- [x] 确立「AI 按指令改本地源 + 同步文档 + 自动发布」工作流（decisionLog 决定 1）
- [x] sync_tdoc 真实写回腾讯文档已验证（连接器重连后 38 条同步成功，本地编辑+生成+写回三环全通）
- [x] 主动更新：联网搜新平台并首批加 9 个可靠新平台（蓝豚医陪/8号陪诊/赞多多/116健康/脉陪陪/宸仁/院小陪/陪诊无忧/单八方），已同步文档+推送上线（47 条）
- [x] 建立「陪诊平台主动巡检」每两周自动化（automation-1785980498191），定期联网搜新平台并自动加+发布
- [x] 创建项目级 skill「peizhen-proactive-scan」：把主动巡检流程固化为可复用入口，用户随时一句话触发一次完整巡检（搜索→筛选→加数据→同步腾讯文档→生成→推送），与每两周自动化 automation-1785980498191 互补；已通过 skill 格式校验
- [x] 2026-08-18 重启：暂停每日自动更新（automation-1785898412205→PAUSED）；全量重新爬取腾讯文档最新资讯（_source.json 55 条 / info.json 刷新）；制定「合肥陪诊师 60 天落地计划（2026秋）」覆盖原 30 天示例计划，产出 plan-import.json + 求职计划.md，并更新 store.js 默认计划

## 进行中
- [ ] GitHub PAT 安全复核：审计已完成（git 历史/远端/仓库均无真实 token 泄露；token 仅存本地 tools/.gh_token 且已 gitignore；scope 为最小 Fine-grained「Contents RW + Pages RW」）。是否实际轮换待用户决定。

## 待用户给真实条目后终验
- [x] 已用「主动联网搜新平台」代替手动给条目：首批加 9 个可靠新平台并推送上线（见上）；后续由每两周自动化持续更新

## 待办 / 可选增强
- [ ] 弟弟首页增加「资讯更新于 XX」状态提示
- [ ] 腾讯文档表格扩展「已入驻 / 首选」标记列
- [ ] 自动化频率由每日一次调为每小时（缩短同步延迟）
- [ ] GitHub PAT 轮换（如决定）：用户在 GitHub 撤销旧 token → 建新 token（同名最小 scope）→ 写入 tools/.gh_token，自动化自动读取，无需改代码
