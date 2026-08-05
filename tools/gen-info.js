/* =========================================================
 * gen-info.js —— 资讯生成器（自动引擎的一部分）
 * 读 data/*.js 源文件 → 合并 → 写 data/info.json（带 updatedAt）
 * 用法：node tools/gen-info.js
 * 维护：以后接腾讯文档后，把这里改成「读表格 → 写 source.json → 合并」即可，
 *       下游 info.js 的 fetch/poll 逻辑不用动。
 * ======================================================= */
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");

// 源文件里是 window.X = [...]，在 Node 里用 window 兜底执行
const window = {};
function loadData(file) {
  const code = fs.readFileSync(path.join(root, "data", file), "utf8");
  eval(code); // eslint-disable-line no-eval
}

["platforms.js", "local.js", "guides.js"].forEach(loadData);

const items = []
  .concat(window.PLATFORM_DATA || [], window.LOCAL_DATA || [], window.GUIDE_DATA || []);

const out = { updatedAt: new Date().toISOString(), items: items };
fs.writeFileSync(path.join(root, "data", "info.json"), JSON.stringify(out, null, 2), "utf8");
console.log("info.json 已生成，共 " + items.length + " 条");
