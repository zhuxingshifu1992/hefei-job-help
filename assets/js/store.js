/* =========================================================
 * store.js —— localStorage 封装 + 导入导出 + 预置示例
 * 依赖：无。所有键加前缀 wb_jobsearch_ 避免冲突。
 * 暴露全局 Store：load / save / remove / exportAll / importAll / clearAll
 * 维护：新增本地数据类型 → 在这里加读写即可，页面里调用。
 * ======================================================= */
var NS = "wb_jobsearch_";

var Store = (function () {
  function load(key, fallback) {
    try {
      var v = localStorage.getItem(NS + key);
      return v ? JSON.parse(v) : (fallback === undefined ? null : fallback);
    } catch (e) { return fallback; }
  }
  function save(key, val) {
    localStorage.setItem(NS + key, JSON.stringify(val));
  }
  function remove(key) { localStorage.removeItem(NS + key); }

  /* 导出全部本项目的键 → 下载 JSON（备份） */
  function exportAll() {
    var out = {};
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf(NS) === 0) out[k] = localStorage.getItem(k);
    }
    var blob = new Blob([JSON.stringify(out, null, 2)], { type: "application/json" });
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = "jobsearch-backup-" + todayISO() + ".json";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /* 导入恢复：只认本项目前缀的键，不限条数 */
  function importAll(text) {
    var data = JSON.parse(text), n = 0;
    for (var k in data) {
      if (data.hasOwnProperty(k) && k.indexOf(NS) === 0) {
        localStorage.setItem(k, data[k]); n++;
      }
    }
    return n;
  }

  /* 清空用户数据（计划/收藏/已入驻），但保留 seeded 标记，避免自动重新生成示例 */
  function clearAll() {
    ["plans", "fav", "joined"].forEach(function (k) { localStorage.removeItem(NS + k); });
  }

  /* 首次运行：若无 seeded 标记，写入 30 天示例计划 */
  function bootstrap() {
    if (localStorage.getItem(NS + "seeded")) return;
    save("plans", [defaultPlan()]);
    save("seeded", "1");
  }

  return { load: load, save: save, remove: remove, exportAll: exportAll,
           importAll: importAll, clearAll: clearAll, bootstrap: bootstrap, NS: NS };
})();

/* ---------- 工具：日期 ---------- */
function todayISO() {
  var d = new Date(), p = function (n) { return String(n).padStart(2, "0"); };
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

/* ---------- 预置：30 天接单攒口碑计划 ----------
 * 含 1 条逾期（due 早于今天 2026-08-05）用于演示「今天要处理」 */
function defaultPlan() {
  return {
    id: "p30",
    title: "30 天接单攒口碑",
    start: "2026-08-01",
    end: "2026-08-31",
    goal: "先入驻 4 个免费平台，首月攒 10 条好评",
    tasks: [
      { id: uid(), text: "注册悦伴陪诊", due: "2026-08-03", status: "todo", doneDate: null },
      { id: uid(), text: "注册小豚陪诊（零基础首选）", due: "2026-08-03", status: "todo", doneDate: null },
      { id: uid(), text: "BOSS直聘投鲸豚健康", due: "2026-08-04", status: "done", doneDate: "2026-08-04" },
      { id: uid(), text: "BOSS直聘投涵益科技（65-70/时）", due: "2026-08-06", status: "todo", doneDate: null },
      { id: uid(), text: "安徽公共招聘网搜「陪诊」", due: "2026-08-06", status: "todo", doneDate: null },
      { id: uid(), text: "闲鱼挂「合肥陪诊服务」", due: "2026-08-08", status: "todo", doneDate: null },
      { id: uid(), text: "熟记安医大一附院楼层分布", due: "2026-08-15", status: "todo", doneDate: null },
      { id: uid(), text: "小红书发第 1 篇陪诊日记", due: "2026-08-20", status: "todo", doneDate: null }
    ]
  };
}

/* 页面加载即执行首跑播种 */
Store.bootstrap();
