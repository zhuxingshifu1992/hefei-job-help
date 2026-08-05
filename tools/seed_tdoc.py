# -*- coding: utf-8 -*-
# 一次性脚本：把现有 data/info.json 的资讯迁移进腾讯文档表格（仅首次播种用）
import json, csv, io, subprocess, sys

SKILL = r"C:\Users\YC1039\.workbuddy\plugins\cache\workbuddy-builtin\tencent-docs-plugin\1.0.0\skills\tencent-docs"
FILE_ID = "ZLPnsrYSgVgU"
SHEET_ID = "BB08J2"
INFO = r"D:\帮老弟找工作项目\data\info.json"
COLS = ["id","name","category","region","background","condition","fee","rating","tag","link","note","updated"]

info = json.load(open(INFO, encoding="utf-8"))
rows = [COLS]
for it in info.get("items", []):
    rows.append([str(it.get(c, "")) for c in COLS])

buf = io.StringIO()
w = csv.writer(buf, lineterminator="\n")
for r in rows:
    w.writerow(r)
csv_data = buf.getvalue().strip()

args = {
    "file_id": FILE_ID,
    "sheet_id": SHEET_ID,
    "start_row": 0,
    "start_col": 0,
    "csv_data": csv_data,
}
cmd = [sys.executable, f"{SKILL}/tencentdocs.py", "tdoc_call", "sheet-mcp",
       "set_range_value_by_csv", json.dumps(args, ensure_ascii=False)]
print("=== 写入表格 ===")
r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
print("STDOUT:", r.stdout[:800])
print("STDERR:", r.stderr[:400])

# 就地读回前 3 行验证
args2 = {
    "file_id": FILE_ID,
    "sheet_id": SHEET_ID,
    "start_row": 0, "start_col": 0, "end_row": 2, "end_col": 11,
    "return_csv": True,
}
cmd2 = [sys.executable, f"{SKILL}/tencentdocs.py", "tdoc_call", "sheet-mcp",
        "get_cell_data", json.dumps(args2, ensure_ascii=False)]
print("=== 读回验证（前3行）===")
r2 = subprocess.run(cmd2, capture_output=True, text=True, encoding="utf-8")
print(r2.stdout[:1200])
