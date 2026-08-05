/* =========================================================
 * home.js —— 首页仪表盘逻辑
 * 渲染「今天要处理」（逾期+今日任务置顶）+ 统计卡 + 快捷入口
 * 依赖：store.js
 * ======================================================= */
document.addEventListener("DOMContentLoaded", function () {
  var plans = Store.load("plans", []) || [];
  renderToday(plans);
  renderStats(plans);
});

/* 收集所有未完成任务中 due<=今天 的项；逾期排前 */
function collectDue(plans) {
  var today = todayISO(), items = [];
  plans.forEach(function (p) {
    (p.tasks || []).forEach(function (t) {
      if (t.status !== "done" && t.due && t.due <= today) {
        items.push({ plan: p, task: t, overdue: t.due < today });
      }
    });
  });
  items.sort(function (a, b) { return (a.overdue === b.overdue) ? 0 : (a.overdue ? -1 : 1); });
  return items;
}

function renderToday(plans) {
  var box = document.getElementById("todayList");
  var items = collectDue(plans);
  if (!items.length) {
    box.innerHTML = '<div class="empty">今天没有待处理，棒！🎉 去计划页加点任务吧</div>';
    return;
  }
  box.innerHTML = items.map(function (it) {
    var badge = it.overdue
      ? '<span class="badge badge--overdue">逾期 ' + it.task.due + '</span>'
      : '<span class="badge badge--today">今天 ' + it.task.due + '</span>';
    return '<div class="card today-item">' +
      '<div class="task__check" data-act="done" data-plan="' + it.plan.id + '" data-task="' + it.task.id + '"></div>' +
      '<div class="task__body">' + badge +
        '<div class="task__text">' + esc(it.task.text) + '</div>' +
        '<div class="today-item__plan">来自计划：' + esc(it.plan.title) + '</div>' +
      '</div></div>';
  }).join("");

  box.querySelectorAll('[data-act="done"]').forEach(function (el) {
    el.addEventListener("click", function () { completeTask(el); });
  });
}

function completeTask(el) {
  var plans = Store.load("plans", []);
  var p = plans.find(function (x) { return x.id === el.dataset.plan; });
  if (!p) return;
  var t = p.tasks.find(function (x) { return x.id === el.dataset.task; });
  if (!t) return;
  t.status = "done"; t.doneDate = todayISO();
  Store.save("plans", plans);
  renderToday(plans); renderStats(plans);
}

function renderStats(plans) {
  var joined = Store.load("joined", []) || [];
  var active = plans.filter(function (p) { return !(p.tasks || []).every(function (t) { return t.status === "done"; }); }).length;
  var weekStart = mondayISO();
  var weekDone = 0;
  plans.forEach(function (p) {
    (p.tasks || []).forEach(function (t) {
      if (t.status === "done" && t.doneDate && t.doneDate >= weekStart) weekDone++;
    });
  });
  document.getElementById("statJoined").textContent = joined.length;
  document.getElementById("statActive").textContent = active;
  document.getElementById("statWeek").textContent = weekDone;
}

/* 本周一日期（用于「本周完成数」统计） */
function mondayISO() {
  var d = new Date(); d.setHours(0, 0, 0, 0);
  var day = (d.getDay() + 6) % 7; // 周一=0
  d.setDate(d.getDate() - day);
  var p = function (n) { return String(n).padStart(2, "0"); };
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
  });
}
