@echo off
setlocal
cd /d %~dp0\..
set TOKEN_FILE=%~dp0.gh_token
if not exist "%TOKEN_FILE%" goto :no_token
set /p TOKEN=<"%TOKEN_FILE%"
git remote set-url origin https://%TOKEN%@github.com/zhuxingshifu1992/hefei-job-help.git
git add -A
git commit -m "update info" >nul 2>&1
git push
if errorlevel 1 goto :push_fail
git remote set-url origin https://github.com/zhuxingshifu1992/hefei-job-help.git
echo [done] pushed. GitHub Pages may take 1 minute.
goto :end
:push_fail
git remote set-url origin https://github.com/zhuxingshifu1992/hefei-job-help.git
echo [FAIL] git push failed. github.com unreachable from this network.
echo        Turn on VPN/proxy, or see notes about gitee mirror.
goto :end
:no_token
echo [error] token file not found: %TOKEN_FILE%
echo         Put your github_pat_... token (single line) into tools\.gh_token
goto :end
:end
pause
