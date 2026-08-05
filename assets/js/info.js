/* =========================================================
 * info.js —— 资讯分享区逻辑：fetch 加载 + 轮询自动更新
 * 依赖：store.js；资讯来自 data/info.json（由 tools/gen-info.js 生成）
 * 关键：每 5 分钟拉一次，updatedAt 变了就提示「资讯已更新」并自动重渲染
 *       这样你（哥哥）改源→重新部署后，弟弟打开的页面会自动拿到新版，无需手动刷新。
 * ======================================================= */
document.addEventListener("DOMContentLoaded", function () {
  var joined = Store.load("joined", []);
  var fav = Store.load("fav", []);
  var items = [];
  var cur = "all";
  var q = "";
  var lastUpdated = null;

  var FILTERS = [
    { key: "all", label: "全部" },
    { key: "national", label: "全国平台" },
    { key: "local", label: "本地渠道" },
    { key: "free", label: "免费流量" },
    { key: "pit", label: "避坑指南" },
    { key: "price", label: "行情参考" }
  ];

  initFilters();
  bindSearch();
  load();
  setInterval(load, 5 * 60 * 1000); // 每 5 分钟轮询

  function initFilters() {
    var box = document.getElementById("filters");
    box.innerHTML = FILTERS.map(function (f) {
      return '<button class="chip' + (f.key === cur ? " is-active" : "") + '" data-cat="' + f.key + '">' + f.label + "</button>";
    }).join("");
    box.addEventListener("click", function (e) {
      var b = e.target.closest(".chip"); if (!b) return;
      cur = b.dataset.cat;
      box.querySelectorAll(".chip").forEach(function (c) { c.classList.toggle("is-active", c.dataset.cat === cur); });
      render();
    });
  }
  function bindSearch() {
    document.getElementById("search").addEventListener("input", function (e) {
      q = e.target.value.trim().toLowerCase(); render();
    });
  }

  // 拉取资讯（带缓存击穿参数），检测 updatedAt 变化
  function load() {
    fetch("data/info.json?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        items = d.items || [];
        if (lastUpdated && d.updatedAt && d.updatedAt !== lastUpdated) toast("资讯已更新");
        lastUpdated = d.updatedAt || null;
        render();
      })
      .catch(function () { /* 部署后才有；file:// 下忽略 */ });
  }

  function visible() {
    return items.filter(function (it) {
      if (cur !== "all" && it.category !== cur) return false;
      if (q) {
        var hay = [it.name, it.title, it.background, it.condition, it.fee, it.note, it.region, it.text].join(" ").toLowerCase();
        if (hay.indexOf(q) === -1) return false;
      }
      return true;
    });
  }

  function render() {
    var list = document.getElementById("infoList");
    var data = visible();
    document.getElementById("infoCount").textContent = "（" + data.length + "）";
    if (!data.length) { list.innerHTML = '<div class="empty">没有匹配的资讯</div>'; return; }
    list.innerHTML = data.map(function (it) {
      var isFav = fav.indexOf(it.id) >= 0;
      var isJoined = joined.indexOf(it.id) >= 0;
      var title = it.name || it.title || "";
      var rows = "";
      if (it.background) rows += row("背景", it.background);
      if (it.condition) rows += row("入驻", it.condition);
      if (it.fee) rows += row("费用", it.fee);
      if (it.region) rows += row("地区", it.region);
      var stars = it.rating ? starsSvg(it.rating) : "";
      var tag = it.tag ? '<span class="badge ' + tagClass(it.tag) + '">' + esc(it.tag) + "</span>" : "";
      var body = rows || (it.text ? '<div style="margin-top:8px;font-size:14px;color:var(--text)">' + esc(it.text) + "</div>" : "");
      var note = it.note ? '<div class="info-card__note">' + esc(it.note) + (it.link ? " · " + esc(it.link) : "") + "</div>" : "";
      return '<div class="card info-card">' +
        '<div class="info-card__head"><span class="info-card__name">' + esc(title) + "</span>" + tag + stars + "</div>" +
        body + note +
        '<div class="info-card__acts">' +
          '<button class="mini-toggle' + (isJoined ? " is-on" : "") + '" data-act="joined" data-id="' + it.id + '">' + (isJoined ? "已入驻" : "标记入驻") + "</button>" +
          '<button class="mini-toggle' + (isFav ? " is-on" : "") + '" data-act="fav" data-id="' + it.id + '">' + (isFav ? "★ 已收藏" : "☆ 收藏") + "</button>" +
        "</div></div>";
    }).join("");
    bindActs();
  }

  function bindActs() {
    document.querySelectorAll('#infoList [data-act="joined"]').forEach(function (b) {
      b.addEventListener("click", function () { toggle(joined, b.dataset.id); Store.save("joined", joined); render(); });
    });
    document.querySelectorAll('#infoList [data-act="fav"]').forEach(function (b) {
      b.addEventListener("click", function () { toggle(fav, b.dataset.id); Store.save("fav", fav); render(); });
    });
  }

  function toggle(arr, id) { var i = arr.indexOf(id); if (i >= 0) arr.splice(i, 1); else arr.push(id); }
  function row(k, v) { return '<div class="info-card__row"><b>' + k + "</b><span>" + esc(v) + "</span></div>"; }
  function tagClass(t) { if (/慎签|备选|补充/.test(t)) return "badge--warn"; return ""; }
  function starsSvg(n) {
    var s = '<span class="stars">';
    for (var i = 1; i <= 5; i++) s += '<svg class="star' + (i <= n ? " star--on" : "") + '" viewBox="0 0 20 20"><path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 15.9 4.8 18.6l1-5.8L1.5 8.7l5.9-.9z"/></svg>';
    return s + "</span>";
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function toast(msg) {
    var t = document.createElement("div");
    t.textContent = msg;
    t.style.cssText = "position:fixed;left:50%;bottom:80px;transform:translateX(-50%);background:rgba(31,41,51,.92);color:#fff;padding:8px 16px;border-radius:999px;font-size:13px;z-index:99";
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 2200);
  }
});
