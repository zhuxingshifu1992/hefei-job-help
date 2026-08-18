# 帮老弟找工作项目 · AI 工作约定

## 先做什么
每次开始工作前，先阅读 memory/projectBrief.md、memory/activeContext.md、memory/progress.md、memory/decisionLog.md 和 memory/.scope.md。

## 项目目标
帮助弟弟在合肥找到陪诊师工作

## 服务对象
老婆的弟弟

## 技术约定
纯静态站（HTML/CSS/JS，零运行时依赖）；资讯源走腾讯文档表格 + 每日自动化拉表生成推送，页面每 5 分钟轮询刷新；计划数据走浏览器本地存储（localStorage）。

## 不可违反的红线
- 暂未设置；执行高风险操作前先向业务负责人确认

## 工作纪律
- 先说明本次要完成什么，再修改文件。
- 不把“计划做”写成“已经做”；完成状态必须有可检查的证据。
- 新决定写入 memory/decisionLog.md，并说明原因和被否决的方案。
- 收尾前更新进度并生成 memory/.handoff.md。
- 不覆盖用户已有内容；不确定时先停下来询问。
