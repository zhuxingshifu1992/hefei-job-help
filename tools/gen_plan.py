# -*- coding: utf-8 -*-
"""
gen_plan.py —— 月度求职计划生成器（单一数据源 → 三处产物）

用途：改这一个文件里的 PLAN，运行后自动同步生成：
  1) plan-import.json        （弟弟在页面点「导入/一键载入」用）
  2) assets/js/store.js      （只替换 defaultPlan() 函数体，新设备首跑播种用）
  3) 求职计划.md             （人看的计划文档）

用法（项目根目录）：
  python tools/gen_plan.py

换月操作：改下面 PLAN 里的 title/start/end/goal/tasks，重新运行即可。
"""
import json
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# ============ 唯一数据源：在这里改计划 ============
PLAN = {
    "id": "p202611",
    "title": "合肥陪诊师 11 月稳定增收计划（2026-11）",
    "start": "2026-11-01",
    "end": "2026-11-30",
    "goal": "从「能接单」转为「稳定单源+提单价+攒复购」：锁定2-3个主攻平台，月接单20+，好评累计30+，私域复购起步",
    "weeks": [
        {
            "phase": "第 1 周 · 主攻平台定型（11/1-11/7）",
            "tasks": [
                ("2026-11-01", "复盘 9-10 月各平台单量/单价/好评率，圈定 2 个主攻平台（大厂优先：支付宝/美团/京东健康）"),
                ("2026-11-02", "补全主攻平台资料：资质照+服务案例图+擅长科室，提升派单优先级"),
                ("2026-11-03", "入驻支付宝「陪诊服务」（抽5%、T+3结算，大厂流量最大；需医护资质，持证优先）"),
                ("2026-11-04", "入驻美团「上门陪诊」（健康证+无犯罪记录，同城流量大，子女为父母下单多）"),
                ("2026-11-05", "入驻京东健康「陪诊专区」（结算零手续费，医护背景占92%）"),
                ("2026-11-06", "入驻京东到家/58到家陪诊频道（中高端单，客单比行业高约20%）"),
                ("2026-11-07", "把 66 个渠道筛成「主攻3 + 备选5」，其余不耗精力（渠道多不如抓重点）"),
            ],
        },
        {
            "phase": "第 2 周 · 提单价：走高端赛道（11/8-11/14）",
            "tasks": [
                ("2026-11-08", "申请安心陪诊（200+三甲合作、高端客单；注意小额可退保证金，非入驻费）"),
                ("2026-11-10", "申请金牌陪诊或快陪诊（高客单；快陪诊需医护背景，按自身条件选一个）"),
                ("2026-11-11", "梳理高端服务清单（专家号陪同/异地就医/术后陪护）并定报价，明码标价"),
                ("2026-11-12", "跑熟安医大一附院/省立医院/滨湖医院三大院区动线与科室分布"),
                ("2026-11-13", "接 1 单高端或专项陪诊（目标单价 300+），沉淀自己的服务 SOP"),
                ("2026-11-14", "周复盘：本周单量、平均单价、每单耗时、客户来源"),
            ],
        },
        {
            "phase": "第 3 周 · 私域复购 + 本地获客（11/15-11/21）",
            "tasks": [
                ("2026-11-15", "小红书发 2 篇合肥就医攻略（挂号流程/科室避坑），主页留联系方式"),
                ("2026-11-17", "抖音发 1 条陪诊日常短视频，定位合肥，主页挂服务"),
                ("2026-11-18", "58同城/闲鱼挂「合肥陪诊服务」明码标价（走平台交易，拒私下转账）"),
                ("2026-11-19", "加老客户微信做首次回访（术后/复诊提醒），争取转介绍"),
                ("2026-11-20", "与医院周边便利店/打印店谈合作（10-20%介绍费，放名片）"),
                ("2026-11-21", "周复盘：私域咨询量、成单转化率、复购意向"),
            ],
        },
        {
            "phase": "第 4 周 · 冲刺 + 月度复盘（11/22-11/30）",
            "tasks": [
                ("2026-11-22", "冲刺单量：盯大厂周末/夜间溢价单（夜间接单溢价可达1.8倍）"),
                ("2026-11-24", "累计好评冲刺 30 条（主动邀评，好评≥90% 平台给流量倾斜）"),
                ("2026-11-25", "评估医护类平台（医护到家/医助到家，需护士证；无证则评估是否值得考证）"),
                ("2026-11-26", "整理本月收入明细（各平台到账额、抽成、净收入）"),
                ("2026-11-28", "月度复盘：净收入/单量/复购率/踩过的坑，写成清单"),
                ("2026-11-30", "制定 12 月计划（目标：稳定月入、私域客占比提升）"),
            ],
        },
    ],
}


def flatten():
    """把分周结构摊平成 task 列表"""
    tasks, i = [], 1
    for wk in PLAN["weeks"]:
        for due, text in wk["tasks"]:
            tasks.append({"id": "t%d" % i, "text": text, "due": due,
                          "status": "todo", "doneDate": None})
            i += 1
    return tasks


def build_plan_obj():
    return {
        "id": PLAN["id"], "title": PLAN["title"],
        "start": PLAN["start"], "end": PLAN["end"], "goal": PLAN["goal"],
        "tasks": flatten(),
    }


# ---------- 1) plan-import.json ----------
def write_import():
    obj = build_plan_obj()
    # 与 Store.exportAll 的格式保持一致：值是「JSON 字符串」
    payload = {"wb_jobsearch_plans": json.dumps([obj], ensure_ascii=False)}
    p = os.path.join(ROOT, "plan-import.json")
    with open(p, "w", encoding="utf-8") as f:
        json.dump(payload, f, ensure_ascii=False, indent=2)
    return p, len(obj["tasks"])


# ---------- 2) store.js 的 defaultPlan() ----------
def js_literal(obj):
    q = lambda s: json.dumps(s, ensure_ascii=False)
    lines = []
    lines.append("function defaultPlan() {")
    lines.append("  return {")
    lines.append("    id: %s," % q(obj["id"]))
    lines.append("    title: %s," % q(obj["title"]))
    lines.append("    start: %s," % q(obj["start"]))
    lines.append("    end: %s," % q(obj["end"]))
    lines.append("    goal: %s," % q(obj["goal"]))
    lines.append("    tasks: [")
    for t in obj["tasks"]:
        lines.append("      { id: %s, text: %s, due: %s, status: \"todo\", doneDate: null },"
                     % (q(t["id"]), q(t["text"]), q(t["due"])))
    lines.append("    ]")
    lines.append("  };")
    lines.append("}")
    return "\n".join(lines)


def write_store():
    p = os.path.join(ROOT, "assets", "js", "store.js")
    with open(p, "r", encoding="utf-8") as f:
        src = f.read()
    start = src.find("function defaultPlan() {")
    if start < 0:
        raise SystemExit("ERROR: defaultPlan() not found in store.js")
    end = src.find("\n}\n", start)
    if end < 0:
        raise SystemExit("ERROR: end of defaultPlan() not found in store.js")
    end += 3  # include "\n}\n"
    new_src = src[:start] + js_literal(build_plan_obj()) + "\n" + src[end:]
    with open(p, "w", encoding="utf-8", newline="\n") as f:
        f.write(new_src)
    return p


# ---------- 3) 求职计划.md ----------
def write_md():
    obj = build_plan_obj()
    out = []
    out.append("# 帮老弟找工作 · 11 月求职计划\n")
    out.append("> 本版本由 `tools/gen_plan.py` 统一生成，覆盖上一版 60 天冲刺计划（9/10-11/9）。"
               "资讯依据：66 个真实接单渠道（2026-10-29 更新）。\n")
    out.append("## 总体目标")
    out.append("- **计划**：%s" % obj["title"])
    out.append("- **周期**：%s ~ %s（30 天）" % (obj["start"], obj["end"]))
    out.append("- **目标**：%s\n" % obj["goal"])
    for wk in PLAN["weeks"]:
        out.append("## %s\n" % wk["phase"])
        for due, text in wk["tasks"]:
            out.append("- [ ] **%s**  %s" % (due, text))
        out.append("")
    out.append("## 优先级提示")
    out.append("- **流量最大**：支付宝 / 美团 / 京东健康（大厂，官方售后兜底）")
    out.append("- **单价最高**：安心陪诊、金牌陪诊（高端 300-1000/单）；涵益科技合肥岗 65-70 元/时")
    out.append("- **单最稳**：医院陪护项目中标服务公司（安医大一附院等三甲）")
    out.append("- **零抽成**：赞多多陪诊（平台不抽成，接单拿全款）")
    out.append("- **私域复购**：小红书 / 抖音 / 闲鱼 / 58同城（零抽成，客户沉淀下来能复购）")
    out.append("- **务必避开**：要求交入驻费/押金/年费的；要求私下转账的；无主体的野平台\n")
    out.append("## 怎么载入这份计划")
    out.append("1. 手机打开网站 → 底部「计划」页")
    out.append("2. 点页面顶部「一键载入 11 月计划」按钮（不会删掉你已有的旧计划和打勾记录）")
    out.append("3. 如按钮不可用，退回旧方式：点右上角「导入」→ 选 `plan-import.json`\n")
    p = os.path.join(ROOT, "求职计划.md")
    with open(p, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(out))
    return p


if __name__ == "__main__":
    pi, n = write_import()
    ps = write_store()
    pm = write_md()
    print("[ok] plan-import.json  ->", pi, "(%d tasks)" % n)
    print("[ok] store.js         ->", ps)
    print("[ok] 求职计划.md       ->", pm)
