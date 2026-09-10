#!/usr/bin/env bash
# ============================================================
# health-check.sh —— 环境与健康检查（换机 / 久未维护 / 出错后第一步）
#
# 用法：bash delivery/06-配置模板与脚本/health-check.sh
# 检查项：环境 → 仓库 → token → remote → 数据 → 线上可达性 → 安全
# ============================================================
PROJECT="D:/帮老弟找工作项目"
PY="C:/Users/YC1039/.workbuddy/binaries/python/versions/3.13.12/python.exe"
NODE="C:/Users/YC1039/.workbuddy/binaries/node/versions/22.22.2-2/node.exe"
SITE="https://zhuxingshifu1992.github.io/hefei-job-help"

cd "$PROJECT" || { echo "[FATAL] 无项目目录"; exit 1; }
pass(){ echo "  [OK]   $1"; }
fail(){ echo "  [FAIL] $1"; }

echo "== 1. 运行环境 =="
"$PY"  --version >/dev/null 2>&1 && pass "Python: $("$PY" --version)" || fail "Python 路径失效（见 09-环境依赖.md）"
"$NODE" --version >/dev/null 2>&1 && pass "Node: $("$NODE" --version)"   || fail "Node 路径失效（目录名应为 22.22.2-2）"
git --version  >/dev/null 2>&1 && pass "Git: $(git --version)"            || fail "Git 不可用"

echo "== 2. 仓库状态 =="
BR=$(git rev-parse --abbrev-ref HEAD 2>/dev/null)
[ "$BR" = "main" ] && pass "当前分支 main" || fail "当前分支为 $BR（应为 main）"
DIRTY=$(git status --porcelain | wc -l)
echo "  [INFO] 未提交变更文件数: $DIRTY"
echo "  [INFO] 最近提交: $(git log --oneline -1)"
echo "  [INFO] Tag 数: $(git tag -l | wc -l)"

echo "== 3. Token =="
if [ -f tools/.gh_token ] && [ -s tools/.gh_token ]; then
  pass "tools/.gh_token 存在"
else
  fail "tools/.gh_token 缺失或为空"
fi
git check-ignore -q tools/.gh_token && pass "token 已被 .gitignore 忽略" || fail "token 未忽略！有泄露风险"

echo "== 4. remote 干净（不含 token）=="
if git remote -v | grep -qE "github_pat_|ghp_"; then
  fail "remote 中含 token，立即执行：git remote set-url origin https://github.com/zhuxingshifu1992/hefei-job-help.git"
else
  pass "remote 干净：$(git remote get-url origin 2>/dev/null)"
fi

echo "== 5. 数据完整性 =="
"$PY" -c "
import json,sys
try:
    s=json.load(open('data/_source.json',encoding='utf-8'))
    i=json.load(open('data/info.json',encoding='utf-8'))
    print('  [OK]   _source.json 条数:',len(s['items']))
    print('  [OK]   info.json    条数:',len(i['items']),'| updatedAt:',i.get('updatedAt'))
    print('  [WARN] 两者条数不一致，需重跑 gen-info.js' if len(s['items'])!=len(i['items']) else '  [OK]   两者一致')
except Exception as e:
    print('  [FAIL] 数据读取失败:',e)
"

echo "== 6. 线上可达性（需绕过沙箱）=="
for p in index info plan; do
  code=$(curl -s -o /dev/null -m 15 -w "%{http_code}" "$SITE/$p.html" 2>/dev/null)
  [ "$code" = "200" ] && pass "$p.html -> 200" || fail "$p.html -> ${code:-无响应}（检查网络/沙箱）"
done

echo "== 7. 安全审计 =="
git grep -qIE "github_pat_[A-Za-z0-9_]+|ghp_[A-Za-z0-9]+" -- . 2>/dev/null \
  && fail "仓库历史/工作区含疑似 token，立即吊销" || pass "仓库内未发现 token"
grep -rqE "github_pat_|ghp_" tools/*.py tools/*.bat tools/*.js 2>/dev/null \
  && fail "脚本内硬编码 token" || pass "脚本内无硬编码 token"

echo
echo "== 完成 =="
