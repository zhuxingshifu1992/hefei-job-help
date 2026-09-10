# -*- coding: utf-8 -*-
# sync_tdoc.py —— 把 data/_source.json 写回腾讯文档表格（AI 编辑后的同步通道）
#
# 用法：
#   python tools/sync_tdoc.py            # 实际写回腾讯文档
#   python tools/sync_tdoc.py --dry-run  # 只打印将要写入的 CSV，不连文档（用于校验数据准备）
#
# 依赖：腾讯文档连接器已连接（首次需在 WorkBuddy UI 里连一次）。
# 表格结构（A~L 列，第 1 行表头）：
#   id | name | category | region | background | condition | fee | rating | tag | link | note | updated
import json, csv, io, subprocess, sys, os

# 复用 fetch_tdoc 的插件版本自动发现：硬编码版本目录会因 token URL 拼法变化而 404
# 取不到票据（见 decisionLog 决定 3），新增版本时无需改这里。
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from fetch_tdoc import resolve_skill_dir

SKILL = resolve_skill_dir()
FILE_ID = "ZLPnsrYSgVgU"          # 陪诊师接单资讯源
SHEET_ID = "BB08J2"               # 默认子表「工作表1」
PROJECT = r"D:\帮老弟找工作项目"
SRC = os.path.join(PROJECT, "data", "_source.json")
COLS = ["id", "name", "category", "region", "background", "condition",
        "fee", "rating", "tag", "link", "note", "updated"]


def call_tdoc(tool, args):
    cmd = [sys.executable, os.path.join(SKILL, "tencentdocs.py"),
           "tdoc_call", "sheet-mcp", tool, json.dumps(args, ensure_ascii=False)]
    r = subprocess.run(cmd, capture_output=True, text=True, encoding="utf-8")
    if r.returncode != 0:
        raise RuntimeError("tdoc_call 失败: " + (r.stderr or r.stdout)[:400])
    outer = json.loads(r.stdout)
    text = outer["result"]["content"][0]["text"]
    return json.loads(text)


def build_csv(items):
    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(COLS)
    for it in items:
        w.writerow([it.get(c, "") for c in COLS])
    return buf.getvalue()


def main():
    dry = "--dry-run" in sys.argv
    with open(SRC, encoding="utf-8") as f:
        data = json.load(f)
    items = data.get("items", [])
    csv_text = build_csv(items)

    if dry:
        print("=== dry-run：将写入 %d 条 ===" % len(items))
        print(csv_text)
        return

    print("=== 写回腾讯文档 ===")
    call_tdoc("set_range_value_by_csv", {
        "file_id": FILE_ID,
        "sheet_id": SHEET_ID,
        "start_row": 0,
        "start_col": 0,
        "csv_data": csv_text,
    })
    print("=== 已同步 %d 条到腾讯文档 ===" % len(items))


if __name__ == "__main__":
    main()
