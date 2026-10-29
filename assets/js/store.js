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

/* ---------- 预置：合肥陪诊师 11 月稳定增收计划（2026-11-01 ~ 11-30）----------
 * 由 tools/gen_plan.py 统一生成（改计划请改该脚本，不要手改这里）
 * 基于 2026-10-29 更新的 66 条真实接单渠道制定 */
function defaultPlan() {
  return {
    id: "p202611",
    title: "合肥陪诊师 11 月稳定增收计划（2026-11）",
    start: "2026-11-01",
    end: "2026-11-30",
    goal: "从「能接单」转为「稳定单源+提单价+攒复购」：锁定2-3个主攻平台，月接单20+，好评累计30+，私域复购起步",
    tasks: [
      { id: "t1", text: "复盘 9-10 月各平台单量/单价/好评率，圈定 2 个主攻平台（大厂优先：支付宝/美团/京东健康）", due: "2026-11-01", status: "todo", doneDate: null },
      { id: "t2", text: "补全主攻平台资料：资质照+服务案例图+擅长科室，提升派单优先级", due: "2026-11-02", status: "todo", doneDate: null },
      { id: "t3", text: "入驻支付宝「陪诊服务」（抽5%、T+3结算，大厂流量最大；需医护资质，持证优先）", due: "2026-11-03", status: "todo", doneDate: null },
      { id: "t4", text: "入驻美团「上门陪诊」（健康证+无犯罪记录，同城流量大，子女为父母下单多）", due: "2026-11-04", status: "todo", doneDate: null },
      { id: "t5", text: "入驻京东健康「陪诊专区」（结算零手续费，医护背景占92%）", due: "2026-11-05", status: "todo", doneDate: null },
      { id: "t6", text: "入驻京东到家/58到家陪诊频道（中高端单，客单比行业高约20%）", due: "2026-11-06", status: "todo", doneDate: null },
      { id: "t7", text: "把 66 个渠道筛成「主攻3 + 备选5」，其余不耗精力（渠道多不如抓重点）", due: "2026-11-07", status: "todo", doneDate: null },
      { id: "t8", text: "申请安心陪诊（200+三甲合作、高端客单；注意小额可退保证金，非入驻费）", due: "2026-11-08", status: "todo", doneDate: null },
      { id: "t9", text: "申请金牌陪诊或快陪诊（高客单；快陪诊需医护背景，按自身条件选一个）", due: "2026-11-10", status: "todo", doneDate: null },
      { id: "t10", text: "梳理高端服务清单（专家号陪同/异地就医/术后陪护）并定报价，明码标价", due: "2026-11-11", status: "todo", doneDate: null },
      { id: "t11", text: "跑熟安医大一附院/省立医院/滨湖医院三大院区动线与科室分布", due: "2026-11-12", status: "todo", doneDate: null },
      { id: "t12", text: "接 1 单高端或专项陪诊（目标单价 300+），沉淀自己的服务 SOP", due: "2026-11-13", status: "todo", doneDate: null },
      { id: "t13", text: "周复盘：本周单量、平均单价、每单耗时、客户来源", due: "2026-11-14", status: "todo", doneDate: null },
      { id: "t14", text: "小红书发 2 篇合肥就医攻略（挂号流程/科室避坑），主页留联系方式", due: "2026-11-15", status: "todo", doneDate: null },
      { id: "t15", text: "抖音发 1 条陪诊日常短视频，定位合肥，主页挂服务", due: "2026-11-17", status: "todo", doneDate: null },
      { id: "t16", text: "58同城/闲鱼挂「合肥陪诊服务」明码标价（走平台交易，拒私下转账）", due: "2026-11-18", status: "todo", doneDate: null },
      { id: "t17", text: "加老客户微信做首次回访（术后/复诊提醒），争取转介绍", due: "2026-11-19", status: "todo", doneDate: null },
      { id: "t18", text: "与医院周边便利店/打印店谈合作（10-20%介绍费，放名片）", due: "2026-11-20", status: "todo", doneDate: null },
      { id: "t19", text: "周复盘：私域咨询量、成单转化率、复购意向", due: "2026-11-21", status: "todo", doneDate: null },
      { id: "t20", text: "冲刺单量：盯大厂周末/夜间溢价单（夜间接单溢价可达1.8倍）", due: "2026-11-22", status: "todo", doneDate: null },
      { id: "t21", text: "累计好评冲刺 30 条（主动邀评，好评≥90% 平台给流量倾斜）", due: "2026-11-24", status: "todo", doneDate: null },
      { id: "t22", text: "评估医护类平台（医护到家/医助到家，需护士证；无证则评估是否值得考证）", due: "2026-11-25", status: "todo", doneDate: null },
      { id: "t23", text: "整理本月收入明细（各平台到账额、抽成、净收入）", due: "2026-11-26", status: "todo", doneDate: null },
      { id: "t24", text: "月度复盘：净收入/单量/复购率/踩过的坑，写成清单", due: "2026-11-28", status: "todo", doneDate: null },
      { id: "t25", text: "制定 12 月计划（目标：稳定月入、私域客占比提升）", due: "2026-11-30", status: "todo", doneDate: null },
    ]
  };
}

/* 页面加载即执行首跑播种 */
Store.bootstrap();

/* ---------- 一次性迁移：只保留「本月计划」，清掉所有历史计划 ----------
 * 触发条件：该设备尚未针对当前计划 id 迁移过（flag = wb_jobsearch_migrated_<planId>）
 * 效果：删除除本月计划外的全部计划（含旧 60 天冲刺计划），若没有本月计划则自动补上。
 * 说明：flag 绑定计划 id，换月后 id 变化会自动再清一次，无需改代码。
 *       每台设备只执行一次，之后用户自己新建的计划不会被反复删掉。
 */
(function migratePlansToCurrentMonth() {
  try {
    var cur = defaultPlan();
    var flag = NS + "migrated_" + cur.id;
    if (localStorage.getItem(flag)) return;
    var plans = Store.load("plans", []) || [];
    var keep = plans.filter(function (p) { return p && p.id === cur.id; });
    if (!keep.length) keep = [cur];
    Store.save("plans", keep);
    localStorage.setItem(flag, "1");
  } catch (e) { /* 迁移失败不影响页面正常使用 */ }
})();
