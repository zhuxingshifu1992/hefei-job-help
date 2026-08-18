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

/* ---------- 预置：合肥陪诊师 60 天落地计划（2026秋）----------
 * 基于 2026-08-18 重新爬取的最新资讯制定，覆盖原 30 天示例计划 */
function defaultPlan() {
  return {
    id: "p60",
    title: "合肥陪诊师 60 天落地计划（2026秋）",
    start: "2026-08-18",
    end: "2026-10-16",
    goal: "先入驻 4 个零门槛/本地平台攒首单与好评，同步准备资质冲击大厂与医院稳定单",
    tasks: [
      { id: "t1", text: "注册小豚陪诊（零基础首选，免费培训抢单）", due: "2026-08-20", status: "todo", doneDate: null },
      { id: "t2", text: "注册悦伴陪诊（行业头部，实名+培训，持证优先）", due: "2026-08-21", status: "todo", doneDate: null },
      { id: "t3", text: "注册赞多多陪诊（零抽成，实名+健康证，不收押金）", due: "2026-08-22", status: "todo", doneDate: null },
      { id: "t4", text: "美团「上门陪诊」提交入驻（健康证+无犯罪记录+统一培训）", due: "2026-08-25", status: "todo", doneDate: null },
      { id: "t5", text: "BOSS直聘投合肥导医/陪诊兼职（鲸豚健康、沈阳涵益合肥岗65-70元/时）", due: "2026-08-26", status: "todo", doneDate: null },
      { id: "t6", text: "安徽公共招聘网搜「陪诊」并登记（政府背景免费）", due: "2026-08-28", status: "todo", doneDate: null },
      { id: "t7", text: "入驻民爱陪诊（本地稳，覆盖安医大一附院/省立/滨湖三甲）", due: "2026-09-03", status: "todo", doneDate: null },
      { id: "t8", text: "完成首单陪诊（小豚/悦伴抢单），积累第1条评价", due: "2026-09-05", status: "todo", doneDate: null },
      { id: "t9", text: "熟记安医大一附院楼层分布（陪诊基本功）", due: "2026-09-08", status: "todo", doneDate: null },
      { id: "t10", text: "关注安医大一附院等三甲陪护项目中标服务公司，主动联系入职（单最稳）", due: "2026-09-10", status: "todo", doneDate: null },
      { id: "t11", text: "支付宝/京东健康入驻（若具备医护资质：护士证/护理员证）", due: "2026-09-12", status: "todo", doneDate: null },
      { id: "t12", text: "小红书发第1篇陪诊日记（本地获客）", due: "2026-09-20", status: "todo", doneDate: null },
      { id: "t13", text: "闲鱼挂「合肥陪诊服务」（私域引流）", due: "2026-09-22", status: "todo", doneDate: null },
      { id: "t14", text: "首月（9月）攒满 10 条平台好评", due: "2026-10-01", status: "todo", doneDate: null },
      { id: "t15", text: "复盘周单量与收入，确定 2-3 个主攻平台", due: "2026-10-10", status: "todo", doneDate: null },
      { id: "t16", text: "冲刺月度稳定单（医院陪护项目/大厂定向派单）", due: "2026-10-16", status: "todo", doneDate: null }
    ]
  };
}

/* 页面加载即执行首跑播种 */
Store.bootstrap();
