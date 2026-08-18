@echo off
REM Publish helper: push generated info.json to GitHub Pages.
REM Usage: tools\publish.bat <github_pat_token>
REM        (token is passed as argument, never stored in this file)
setlocal
cd /d %~dp0\..
if not "%1"=="" (
  git remote set-url origin https://%1@github.com/zhuxingshifu1992/hefei-job-help.git
)
git add -A
git commit -m "update info %date% %time%" >nul 2>&1
git push
echo [publish] pushed. GitHub Pages may take 1 minute.
endlocal
