#!/usr/bin/env bash
# ============================================================
# daily-update.sh —— 「帮老弟找工作」一键日常更新
#
# 流程：拉取腾讯文档 → 判断实质变化 → 生成 info.json
#       → 提交 → 推送（重试3次+脱敏）→ 远端校验
#
# 用法（Git Bash，需绕过沙箱执行网络部分）：
#   bash delivery/06-配置模板与脚本/daily-update.sh
#   bash delivery/06-配置模板与脚本/daily-update.sh --force   # 无变化也提交（刷新时间戳）
#
# 退出码：0 成功 / 1 token 缺失 / 2 拉取失败 / 3 推送失败
# ============================================================
set -uo pipefail

PROJECT="D:/帮老弟找工作项目"
PY="C:/Users/YC1039/.workbuddy/binaries/python/versions/3.13.12/python.exe"
NODE="C:/Users/YC1039/.workbuddy/binaries/node/versions/22.22.2-2/node.exe"
REPO="zhuxingshifu1992/hefei-job-help"
SITE="https://zhuxingshifu1992.github.io/hefei-job-help"
LOG="/c/Users/YC1039/AppData/Local/Temp/push_err.log"
FORCE=0
[ "${1:-}" = "--force" ] && FORCE=1

cd "$PROJECT" || { echo "[FATAL] 找不到项目目录 $PROJECT"; exit 1; }

echo "===== 1/6 拉取腾讯文档 ====="
"$PY" tools/fetch_tdoc.py || { echo "[FATAL] 拉取失败，详见错误信息"; exit 2; }

echo "===== 2/6 判断是否有实质变化 ====="
CHANGED=$("$PY" -c "
import json,hashlib,subprocess
h=lambda x: hashlib.sha256(json.dumps(x,ensure_ascii=False,sort_keys=True).encode()).hexdigest()[:16]
new=json.load(open('data/_source.json',encoding='utf-8'))['items']
try:
    old=json.loads(subprocess.run(['git','show','HEAD:data/_source.json'],
        capture_output=True,text=True,encoding='utf-8').stdout)['items']
except Exception:
    old=None
print('1' if (old is None or h(new)!=h(old)) else '0')
")
CNT=$("$PY" -c "import json;print(len(json.load(open('data/_source.json',encoding='utf-8'))['items']))")
echo "当前条数: $CNT ｜ 实质变化: $CHANGED"
if [ "$CHANGED" = "0" ] && [ "$FORCE" = "0" ]; then
  echo "[DONE] 与线上内容一致，无实质变化，跳过提交。"
  exit 0
fi

echo "===== 3/6 生成 info.json ====="
"$NODE" tools/gen-info.js || { echo "[FATAL] 生成失败"; exit 2; }

echo "===== 4/6 安全检查 ====="
if git status --porcelain | grep -qiE "gh_token|secret"; then
  echo "[FATAL] 检测到密钥文件将被提交，已中止。"; exit 1
fi
echo "OK：无密钥文件待提交"

echo "===== 5/6 提交与推送 ====="
git add data/_source.json data/info.json
git commit -m "data: 资讯更新 ${CNT} 条 ($(date +%F))" || echo "(无新提交内容)"

TOKEN=$(tr -d '[:space:]' < tools/.gh_token)
if [ -z "$TOKEN" ]; then echo "[FATAL] tools/.gh_token 为空"; exit 1; fi
URL="https://${TOKEN}@github.com/${REPO}.git"

ok=0
for i in 1 2 3; do
  if git push "$URL" main 2>"$LOG"; then echo "PUSH_OK"; ok=1; break; fi
  echo "push 第 $i 次失败，5 秒后重试…"
  "$PY" - "$LOG" <<'PY'
import sys
tok=open("tools/.gh_token",encoding="utf-8").read().strip()
txt=open(sys.argv[1],encoding="utf-8",errors="replace").read()
print(txt.replace(tok,"***REDACTED***")[-600:])
PY
  sleep 5
done
git remote set-url origin "https://github.com/${REPO}.git"
[ "$ok" = "1" ] || { echo "[FATAL] 推送三次均失败"; exit 3; }

echo "===== 6/6 远端校验 ====="
git ls-remote "$URL" main | head -1
echo "本地 HEAD: $(git rev-parse HEAD)"
echo "（等待 50 秒让 Pages 部署后，可访问 ${SITE}/data/info.json 验证 updatedAt）"
echo "[DONE] 完成。RESULT=OK"
