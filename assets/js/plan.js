/* =========================================================
 * plan.js —— 求职计划区逻辑：建计划 / 加任务 / 完成 / 删除 / 进度环
 * 依赖：store.js；预置计划由 store.js 首跑写入
 * 维护：任务字段见 store.js defaultPlan()；新增操作在事件委托里加。
 * ======================================================= */
document.addEventListener("DOMContentLoaded", function () {
  bindLoadMonth(); // 一键载入最新月度计划：先绑定，确保空数据时也能用
  var plans = Store.load("plans", []) || [];

  if (!plans.length) {
    document.getElementById("planList").innerHTML =
      '<div class="empty">还没有计划。' +
      '<div style="margin-top:12px"><button class="btn" id="loadDemo">载入 11 月计划</button></div></div>';
    document.getElementById("loadDemo").addEventListener("click", function () {
      Store.save("plans", [defaultPlan()]);
      location.reload();
    });
    bindForms();
    return;
  }

  render();
  bindForms();

  function render() {
    var box = document.getElementById("planList");
    box.innerHTML = plans.map(function (p) {
      var total = (p.tasks || []).length;
      var done = (p.tasks || []).filter(function (t) { return t.status === "done"; }).length;
      var pct = total ? Math.round(done / total * 100) : 0;
      var today = todayISO();

      var tasks = (p.tasks || []).slice().sort(function (a, b) {
        var da = a.due || "9999", db = b.due || "9999";
        return da < db ? -1 : da > db ? 1 : 0;
      }).map(function (t) {
        var overdue = t.status !== "done" && t.due && t.due < today;
        var badge = t.status === "done" ? '<span class="badge badge--done">已完成</span>'
          : overdue ? '<span class="badge badge--overdue">逾期 ' + t.due + "</span>"
          : (t.due === today ? '<span class="badge badge--today">今天</span>' : '<span class="badge">' + t.due + "</span>");
        return '<div class="card task' + (t.status === "done" ? " is-done" : "") + '">' +
          '<div class="task__check' + (t.status === "done" ? " is-done" : "") + '" data-act="toggle" data-plan="' + p.id + '" data-task="' + t.id + '">' +
          (t.status === "done" ? checkSvg() : "") + '</div>' +
          '<div class="task__body">' + badge + '<div class="task__text">' + esc(t.text) + "</div></div>" +
          '<button class="task__del" data-act="del" data-plan="' + p.id + '" data-task="' + t.id + '">×</button>' +
          "</div>";
      }).join("");

      return '<div class="card" style="padding:0;overflow:hidden">' +
        '<div style="display:flex;align-items:center;gap:12px;padding:14px;border-bottom:1px solid var(--line)">' +
          ring(pct) +
          '<div style="flex:1;min-width:0">' +
            '<div style="font-weight:700;font-size:16px">' + esc(p.title) + "</div>" +
            '<div style="font-size:12px;color:var(--text-2)">' + (p.start || "") + " ~ " + (p.end || "") +
              (p.goal ? " · " + esc(p.goal) : "") + "</div>" +
          "</div>" +
          '<button class="task__del" data-act="delplan" data-plan="' + p.id + '" title="删除计划">×</button>' +
        "</div>" +
        '<div style="padding:4px 0">' + (tasks || '<div class="empty">暂无任务</div>') + "</div>" +
        '<form class="addTask" data-plan="' + p.id + '" style="display:flex;gap:8px;padding:10px 14px 14px">' +
          '<input name="text" placeholder="加一条任务…" required>' +
          '<input name="due" type="date" style="width:140px" required>' +
          '<button class="btn btn--sm" type="submit">加</button>' +
        "</form>" +
        "</div>";
    }).join("");

    bindTaskActs();
  }

  function bindTaskActs() {
    var box = document.getElementById("planList");
    box.querySelectorAll('[data-act="toggle"]').forEach(function (el) {
      el.addEventListener("click", function () { toggle(el); });
    });
    box.querySelectorAll('[data-act="del"]').forEach(function (el) {
      el.addEventListener("click", function () { delTask(el); });
    });
    box.querySelectorAll('[data-act="delplan"]').forEach(function (el) {
      el.addEventListener("click", function () { delPlan(el); });
    });
    box.querySelectorAll("form.addTask").forEach(function (f) {
      f.addEventListener("submit", function (e) {
        e.preventDefault();
        var p = plans.find(function (x) { return x.id === f.dataset.plan; });
        if (!p) return;
        p.tasks = p.tasks || [];
        p.tasks.push({ id: uid(), text: f.text.value.trim(), due: f.due.value, status: "todo", doneDate: null });
        Store.save("plans", plans); render();
      });
    });
  }

  function toggle(el) {
    var p = plans.find(function (x) { return x.id === el.dataset.plan; });
    var t = p.tasks.find(function (x) { return x.id === el.dataset.task; });
    t.status = t.status === "done" ? "todo" : "done";
    t.doneDate = t.status === "done" ? todayISO() : null;
    Store.save("plans", plans); render();
  }
  function delTask(el) {
    var p = plans.find(function (x) { return x.id === el.dataset.plan; });
    p.tasks = p.tasks.filter(function (x) { return x.id !== el.dataset.task; });
    Store.save("plans", plans); render();
  }
  function delPlan(el) {
    if (!confirm("确定删除该计划及其所有任务？")) return;
    plans = plans.filter(function (x) { return x.id !== el.dataset.plan; });
    Store.save("plans", plans); render();
  }

  function bindForms() {
    var f = document.getElementById("newPlan");
    if (!f) return;
    f.addEventListener("submit", function (e) {
      e.preventDefault();
      plans.push({
        id: uid(),
        title: f.title.value.trim(),
        start: f.start.value, end: f.end.value, goal: f.goal.value.trim(),
        tasks: []
      });
      Store.save("plans", plans);
      f.reset();
      render();
    });

    // 清空数据（二次确认）
    var cb = document.getElementById("btnClear");
    if (cb) cb.addEventListener("click", function () {
      if (confirm("确定清空全部计划/收藏/已入驻数据？此操作不可恢复（可先导出备份）。")) {
        Store.clearAll();
        alert("已清空，即将刷新");
        location.reload();
      }
    });
  }
});

/* ---------- 小组件 ---------- */
function ring(pct) {
  var r = 18, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
  return '<svg class="ring" viewBox="0 0 44 44">' +
    '<circle class="ring__bg" cx="22" cy="22" r="' + r + '"/>' +
    '<circle class="ring__fg" cx="22" cy="22" r="' + r + '" stroke-dasharray="' + c + '" stroke-dashoffset="' + off + '" transform="rotate(-90 22 22)"/>' +
    '<text class="ring__txt" x="22" y="26">' + pct + "%</text></svg>";
}
function checkSvg() {
  return '<svg viewBox="0 0 24 24" width="14" height="14"><path d="M5 13l4 4L19 7" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
}
function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}

/* ---------- 一键载入最新月度计划 ----------
 * 从站点拉取 plan-import.json，把里面的月度计划追加进来（按 id 去重）。
 * 注意：只追加、不覆盖，保留用户已有计划与打勾记录；完成后整页刷新一次。
 */
function bindLoadMonth() {
  var btn = document.getElementById("btnLoadMonth");
  if (!btn) return;
  var msg = document.getElementById("loadMonthMsg");
  function say(t) { if (msg) msg.textContent = t || ""; }

  btn.addEventListener("click", function () {
    btn.disabled = true;
    say("正在获取最新计划…");
    fetch("plan-import.json", { cache: "no-store" })
      .then(function (r) {
        if (!r.ok) throw new Error("HTTP " + r.status);
        return r.json();
      })
      .then(function (payload) {
        var raw = payload && payload.wb_jobsearch_plans;
        if (!raw) throw new Error("文件格式不对");
        var incoming = JSON.parse(raw);
        if (!incoming || !incoming.length) throw new Error("计划内容为空");
        var target = incoming[0];
        var plans = Store.load("plans", []) || [];
        var exists = plans.some(function (p) { return p.id === target.id; });
        if (exists) {
          say("这份计划已经在你手机里了：" + target.title);
          btn.disabled = false;
          return;
        }
        if (!confirm("载入「" + target.title + "」？\n共 " + (target.tasks || []).length +
                     " 个任务，不会删除你已有的计划。")) {
          say("已取消。");
          btn.disabled = false;
          return;
        }
        plans.push(target);
        Store.save("plans", plans);
        say("已载入，正在刷新…");
        location.reload();
      })
      .catch(function (e) {
        say("载入失败：" + e.message + "。可改用右上角「导入」选择 plan-import.json。");
        btn.disabled = false;
      });
  });
}
