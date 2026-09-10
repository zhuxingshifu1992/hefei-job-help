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

/* ---------- 预置：合肥陪诊师 60 天冲刺计划（2026秋·9/10起）----------
 * 基于 2026-09-10 的 63 条最新资讯制定，覆盖原 8/18 起的那版计划 */
function defaultPlan() {
  return {
    id: "p0910",
    title: "合肥陪诊师 60 天冲刺计划（2026秋·9/10起）",
    start: "2026-09-10",
    end: "2026-11-09",
    goal: "9-10月快速入驻零门槛平台拿首单，同步铺开合肥本地高单价渠道，11月前形成稳定单源",
    tasks: [
      { id: "t1", text: "注册小豚陪诊（零基础首选，免费培训后抢单）", due: "2026-09-11", status: "todo", doneDate: null },
      { id: "t2", text: "注册悦伴陪诊（★5首选，实名认证+培训考核）", due: "2026-09-12", status: "todo", doneDate: null },
      { id: "t3", text: "注册赞多多陪诊（零抽成，不收入驻费/押金）", due: "2026-09-13", status: "todo", doneDate: null },
      { id: "t4", text: "注册陪医无忧（适合新手，简单培训即可上手）", due: "2026-09-14", status: "todo", doneDate: null },
      { id: "t5", text: "提交美团「上门陪诊」入驻（健康证+无犯罪记录，零基础可进）", due: "2026-09-15", status: "todo", doneDate: null },
      { id: "t6", text: "入驻8号陪诊（合规首选，审核+培训）", due: "2026-09-16", status: "todo", doneDate: null },
      { id: "t7", text: "智联招聘搜「合肥 陪诊师」投递（新渠道，京东等有直招岗）", due: "2026-09-17", status: "todo", doneDate: null },
      { id: "t8", text: "BOSS直聘投涵益科技合肥岗（65-70元/时，单价最高，重点）", due: "2026-09-18", status: "todo", doneDate: null },
      { id: "t9", text: "联系合肥云憙智能科技（招50人，经验不限，瑶海区）", due: "2026-09-20", status: "todo", doneDate: null },
      { id: "t10", text: "安徽公共招聘网搜「陪诊」并登记（官方免费★5）", due: "2026-09-22", status: "todo", doneDate: null },
      { id: "t11", text: "入驻民爱陪诊（本地稳，覆盖安医/省立/滨湖三甲）", due: "2026-09-24", status: "todo", doneDate: null },
      { id: "t12", text: "联系安医大一附院等三甲陪护项目中标服务公司（★5单最稳）", due: "2026-09-26", status: "todo", doneDate: null },
      { id: "t13", text: "入驻贴心护工（免费，实操考核，自选接单区域）", due: "2026-09-28", status: "todo", doneDate: null },
      { id: "t14", text: "完成首单陪诊，拿到第 1 条平台评价", due: "2026-10-01", status: "todo", doneDate: null },
      { id: "t15", text: "熟记安医大一附院楼层分布（陪诊基本功）", due: "2026-10-05", status: "todo", doneDate: null },
      { id: "t16", text: "小红书发第 1 篇陪诊日记（本地获客）", due: "2026-10-08", status: "todo", doneDate: null },
      { id: "t17", text: "闲鱼挂「合肥陪诊服务」（私域引流，走平台交易）", due: "2026-10-12", status: "todo", doneDate: null },
      { id: "t18", text: "累计攒满 10 条平台好评", due: "2026-10-15", status: "todo", doneDate: null },
      { id: "t19", text: "复盘各平台单量与单价，确定 2-3 个主攻平台", due: "2026-10-20", status: "todo", doneDate: null },
      { id: "t20", text: "冲刺月度稳定单（医院陪护项目/大厂定向派单）", due: "2026-10-25", status: "todo", doneDate: null },
      { id: "t21", text: "若已具备医护资质，投支付宝/京东健康（大厂★5）", due: "2026-10-30", status: "todo", doneDate: null },
      { id: "t22", text: "复盘收入结构，决定继续兼职还是转全职", due: "2026-11-05", status: "todo", doneDate: null },
      { id: "t23", text: "阶段总复盘，制定下一阶段目标", due: "2026-11-09", status: "todo", doneDate: null }
    ]
  };
}

/* 页面加载即执行首跑播种 */
Store.bootstrap();
