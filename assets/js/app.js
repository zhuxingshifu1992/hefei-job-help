/* =========================================================
 * app.js —— 公共逻辑：底部 Tab 高亮 + 导出/导入备份按钮
 * 依赖：store.js（Store）。每个页面都引入。
 * 维护：全局交互（备份）放这里，页面专属逻辑放各自的 js。
 * ======================================================= */
(function () {
  /* 底部 Tab 高亮：根据当前文件名匹配 data-nav */
  var file = (location.pathname.split("/").pop() || "index.html");
  var map = { "index.html": "home", "info.html": "info", "plan.html": "plan" };
  var cur = map[file];
  document.querySelectorAll(".tab").forEach(function (t) {
    if (t.getAttribute("data-nav") === cur) t.classList.add("is-active");
  });

  /* 导出 / 导入（首屏可见，不藏设置） */
  document.addEventListener("click", function (e) {
    if (e.target.closest("#btnExport")) {
      Store.exportAll();
    } else if (e.target.closest("#btnImport")) {
      var fi = document.getElementById("fileImport");
      if (fi) fi.click();
    }
  });

  /* 导入文件 → 解析 → 恢复 → 刷新 */
  var fi = document.getElementById("fileImport");
  if (fi) {
    fi.addEventListener("change", function (ev) {
      var fileInput = ev.target.files[0];
      if (!fileInput) return;
      var r = new FileReader();
      r.onload = function () {
        try {
          var n = Store.importAll(r.result);
          alert("已恢复 " + n + " 条数据，即将刷新页面");
          location.reload();
        } catch (err) {
          alert("导入失败：文件格式不正确");
        }
      };
      r.readAsText(fileInput);
    });
  }
})();
