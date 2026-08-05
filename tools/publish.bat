@echo off
REM =========================================================
REM publish.bat —— 把最新资讯推送到 GitHub Pages（在本机运行）
REM 用法1（推荐）：publish.bat <github_pat_token>
REM   例：tools\publish.bat github_pat_xxx
REM 用法2：已配好远程凭据（如 Windows 凭据管理器已缓存），直接 publish.bat
REM 前置：已在 GitHub 仓库开启 Pages（分支 main / 根目录）
REM 说明：data/info.json 由沙箱里的每日自动化生成（在本机同一块磁盘上），
REM       本脚本只负责把它 push 上去；弟弟的页面会每5分钟轮询自动拉取。
REM 注意：token 仅通过参数传入，不会写进本文件，也不会进仓库。
REM =========================================================
setlocal
cd /d %~dp0\..
if not "%1"=="" (
  git remote set-url origin https://%1@github.com/zhuxingshifu1992/hefei-job-help.git
)
git add -A
git commit -m "update info %date% %time%" >nul 2>&1
git push
echo [publish] 已推送，GitHub Pages 通常 1 分钟内生效。
endlocal
