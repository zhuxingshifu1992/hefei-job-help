@echo off
setlocal
cd /d %~dp0\..
set TOKEN_FILE=%~dp0.gh_token
if exist "%TOKEN_FILE%" goto :have_token
echo [error] token file not found: %TOKEN_FILE%
echo Please put your github_pat_... token (single line) into tools\.gh_token
echo Or run: tools\publish.bat ^<your_token^>
pause
exit /b 1
:have_token
set /p TOKEN=<"%TOKEN_FILE%"
git remote set-url origin https://%TOKEN%@github.com/zhuxingshifu1992/hefei-job-help.git
git add -A
git commit -m "update info" >nul 2>&1
git push
git remote set-url origin https://github.com/zhuxingshifu1992/hefei-job-help.git
echo [done] pushed. GitHub Pages may take 1 minute.
endlocal
pause
