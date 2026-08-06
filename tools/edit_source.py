# -*- coding: utf-8 -*-
# edit_source.py —— 对 data/_source.json 做 加/改/删（AI 编辑资讯的统一入口）
#
# 用法：
#   python tools/edit_source.py add --id X --name 名称 --category national \
#       --region 合肥 --background ... --condition ... --fee ... --rating 5 --tag 首选 --link https://... --note ...
#   python tools/edit_source.py update ID --fee "新费用" --rating 4
#   python tools/edit_source.py delete ID
#   python tools/edit_source.py list
#
# 说明：id 为唯一主键；updated 字段在每次改动时自动写为当前 YYYY-MM。
# 改完后由 sync_tdoc.py 同步到腾讯文档、由 gen-info.js 生成 info.json。
import json, sys, os, datetime, argparse

PROJECT = r"D:\帮老弟找工作项目"
SRC = os.path.join(PROJECT, "data", "_source.json")
COLS = ["id", "name", "category", "region", "background", "condition",
        "fee", "rating", "tag", "link", "note", "updated"]
EDITABLE = ["name", "category", "region", "background", "condition",
            "fee", "rating", "tag", "link", "note"]


def load():
    with open(SRC, encoding="utf-8") as f:
        return json.load(f)


def save(data):
    with open(SRC, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def now_month():
    return datetime.datetime.now().strftime("%Y-%m")


def cmd_add(args):
    data = load()
    items = data["items"]
    if any(it["id"] == args.id for it in items):
        print("错误：id=%s 已存在" % args.id)
        sys.exit(1)
    item = {"id": args.id}
    for c in COLS:
        if c in ("id", "updated"):
            continue
        v = getattr(args, c, None)
        if v is None:
            v = ""
        if c == "rating":
            try:
                v = int(v)
            except (TypeError, ValueError):
                v = 0
        item[c] = v
    item["updated"] = now_month()
    items.append(item)
    data["updatedAt"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    save(data)
    print("已添加：%s (%s)，当前共 %d 条" % (item["name"], item["id"], len(items)))


def cmd_update(args):
    data = load()
    items = data["items"]
    it = next((x for x in items if x["id"] == args.id), None)
    if not it:
        print("错误：找不到 id=%s" % args.id)
        sys.exit(1)
    changed = []
    for c in EDITABLE:
        v = getattr(args, c, None)
        if v is not None:
            if c == "rating":
                try:
                    v = int(v)
                except (TypeError, ValueError):
                    v = 0
            it[c] = v
            changed.append(c)
    if not changed:
        print("未指定任何要改的字段")
        return
    it["updated"] = now_month()
    data["updatedAt"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    save(data)
    print("已更新 %s：%s" % (args.id, ", ".join(changed)))


def cmd_delete(args):
    data = load()
    before = len(data["items"])
    data["items"] = [x for x in data["items"] if x["id"] != args.id]
    after = len(data["items"])
    if before == after:
        print("错误：找不到 id=%s" % args.id)
        sys.exit(1)
    data["updatedAt"] = datetime.datetime.now(datetime.timezone.utc).isoformat()
    save(data)
    print("已删除 %s，剩余 %d 条" % (args.id, after))


def cmd_list(args):
    data = load()
    for it in data["items"]:
        print("%-14s %s  [%s]" % (it["id"], it["name"], it.get("category", "")))


def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd")

    pa = sub.add_parser("add")
    pa.add_argument("--id", required=True)
    for c in EDITABLE:
        pa.add_argument("--" + c)

    pu = sub.add_parser("update")
    pu.add_argument("id")
    for c in EDITABLE:
        pu.add_argument("--" + c)

    pd = sub.add_parser("delete")
    pd.add_argument("id")

    pl = sub.add_parser("list")

    args = p.parse_args()
    if args.cmd == "add":
        cmd_add(args)
    elif args.cmd == "update":
        cmd_update(args)
    elif args.cmd == "delete":
        cmd_delete(args)
    elif args.cmd == "list":
        cmd_list(args)
    else:
        p.print_help()


if __name__ == "__main__":
    main()
