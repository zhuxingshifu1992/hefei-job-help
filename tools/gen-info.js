/* =========================================================
 * gen-info.js —— 资讯生成器（自动引擎的一部分）
 * 数据源（优先级）：
 *   1) data/_source.json  —— 由 tools/fetch_tdoc.py 从腾讯文档表格拉取（首选）
 *   2) data/*.js          —— 旧全局变量源（断网/未拉表时回退）
 * 输出：data/info.json（带 updatedAt）
 * 用法：node tools/gen-info.js
 * 下游 info.js 的 fetch/poll 逻辑不用动。
 * ======================================================= */
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const SRC = path.join(root, "data", "_source.json");
const OUT = path.join(root, "data", "info.json");

function loadFromSource() {
  if (!fs.existsSync(SRC)) return null;
  try {
    const raw = JSON.parse(fs.readFileSync(SRC, "utf8"));
    return raw.items || [];
  } catch (e) {
    console.warn("读取 _source.json 失败，回退到 data/*.js", e.message);
    return null;
  }
}

function loadFromJs() {
  const window = {};
  ["platforms.js", "local.js", "guides.js"].forEach((f) => {
    const code = fs.readFileSync(path.join(root, "data", f), "utf8");
    eval(code); // eslint-disable-line no-eval
  });
  return [].concat(window.PLATFORM_DATA || [], window.LOCAL_DATA || [], window.GUIDE_DATA || []);
}

let items = loadFromSource();
let srcLabel = "腾讯文档表格 (_source.json)";
if (!items || !items.length) {
  items = loadFromJs();
  srcLabel = "data/*.js (回退)";
}

const out = { updatedAt: new Date().toISOString(), items };
fs.writeFileSync(OUT, JSON.stringify(out, null, 2), "utf8");
console.log("info.json 已生成，共 " + items.length + " 条（源：" + srcLabel + "）");
