# -*- coding: utf-8 -*-
# fetch_tdoc.py —— 从腾讯文档表格拉取资讯，写成 data/_source.json
# 这是「自动更新」的数据源：你（或弟弟）在腾讯文档表格里增删改，
# 每日自动化先跑本脚本把表格拉下来，再跑 gen-info.js 生成 info.json 并推送。
#
# 表格结构（A~L 列，第1行表头）：
#   id | name | category | region | background | condition | fee | rating | tag | link | note | updated
# 子表约定：file_id / sheet_id 见下方常量（建表时确定，一般不用改）。
import json, csv, io, subprocess, sys, os, datetime, re, glob

PLUGIN_ROOT = r"C:\Users\YC1039\.workbuddy\plugins\cache\workbuddy-builtin\tencent-docs-plugin"


def resolve_skill_dir():
    """自动定位腾讯文档插件 tencentdocs.py 所在目录（取语义版本号最高的）。

    背景：插件随 WorkBuddy 升级会换版本目录（1.0.0 → 5.5.4 …）。旧版脚本把
    token URL 拼成 <host>/internal/tencent-docs/tokens，而当前宿主要求
    <host>/mcp/internal/tencent-docs/tokens，写死旧版本目录会 404 取不到票据
    （表现为 ERROR:no_token）。故这里按版本号取最高的可用版本，避免以后再断。
    """
    env = os.environ.get("TDOC_SKILL_DIR")
    if env and os.path.isfile(os.path.join(env, "tencentdocs.py")):
        return env
    cands = []
    for d in glob.glob(os.path.join(PLUGIN_ROOT, "*")):
        p = os.path.join(d, "skills", "tencent-docs", "tencentdocs.py")
        if os.path.isfile(p):
            m = re.match(r"(\d+)\.(\d+)\.(\d+)", os.path.basename(d))
            ver = tuple(int(x) for x in m.groups()) if m else (0, 0, 0)
            cands.append((ver, os.path.dirname(p)))
    if not cands:
        raise RuntimeError("未找到腾讯文档插件 tencentdocs.py，请检查插件是否安装")
    cands.sort(reverse=True)
    return cands[0][1]


SKILL = resolve_skill_dir()
FILE_ID = "ZLPnsrYSgVgU"          # 陪诊师接单资讯源
SHEET_ID = "BB08J2"               # 默认子表「工作表1」
PROJECT = r"D:\帮老弟找工作项目"
OUT = os.path.join(PROJECT, "data", "_source.json")
COLS = ["id", "name", "category", "region", "background", "condition",
        "fee", "rating", "tag", "link", "note", "updated"]


def call_tdoc(tool, args):
    cmd = [sys.executable, os.path.join(SKILL, "tencentdocs.py"),
           "tdoc_call", "sheet-mcp", tool, json.dumps(args, ensure_ascii=False)]
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if r.returncode != 0:
        raise RuntimeError("tdoc_call 失败: " + r.stderr[:300])
    outer = json.loads(r.stdout)
    text = outer["result"]["content"][0]["text"]
    return json.loads(text)


def main():
    print("=== 从腾讯文档拉取表格 ===")
    res = call_tdoc("get_cell_data", {
        "file_id": FILE_ID, "sheet_id": SHEET_ID,
        "start_row": 0, "start_col": 0, "end_row": 200, "end_col": 11,
        "return_csv": True,
    })
    csv_text = res.get("csv_data", "")
    if not csv_text.strip():
        raise RuntimeError("表格为空，请确认表格链接/权限")

    rows = list(csv.reader(io.StringIO(csv_text)))
    header = rows[0]
    idx = {h: i for i, h in enumerate(header)}

    items = []
    for row in rows[1:]:
        if not row or not (row[0] or "").strip():
            continue  # 跳过空行
        item = {}
        for c in COLS:
            i = idx.get(c)
            item[c] = row[i] if (i is not None and i < len(row)) else ""
        try:
            item["rating"] = int(item["rating"]) if str(item["rating"]).strip() else 0
        except ValueError:
            item["rating"] = 0
        items.append(item)

    out = {"updatedAt": datetime.datetime.now(datetime.timezone.utc).isoformat(), "items": items}
    with open(OUT, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print("=== _source.json 已生成，共 %d 条 ===" % len(items))
    if items:
        print("示例首条:", items[0]["name"], "/", items[0]["category"])


if __name__ == "__main__":
    main()
