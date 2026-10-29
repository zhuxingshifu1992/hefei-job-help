@echo off
setlocal
cd /d %~dp0\..
set TOKEN_FILE=%~dp0.gh_token
set PROXY_FILE=%~dp0.proxy
if not exist "%TOKEN_FILE%" goto :no_token
set /p TOKEN=<"%TOKEN_FILE%"
git remote set-url origin https://%TOKEN%@github.com/zhuxingshifu1992/hefei-job-help.git
git add -A
git commit -m "update info" >nul 2>&1
set PROXY=
if exist "%PROXY_FILE%" set /p PROXY=<"%PROXY_FILE%"
if not "%PROXY%"=="" goto :do_push
echo [info] detecting local VPN proxy port...
for %%P in (7890 7891 10809 10808 1080 8889 8080 8888 20171) do call :try_port %%P
:do_push
if "%PROXY%"=="" goto :direct
echo [info] using proxy %PROXY%
git -c http.proxy=http://%PROXY% -c https.proxy=http://%PROXY% push
goto :after_push
:direct
echo [info] no proxy found, trying direct...
git push
:after_push
if errorlevel 1 goto :push_fail
git remote set-url origin https://github.com/zhuxingshifu1992/hefei-job-help.git
echo [done] pushed. GitHub Pages may take 1 minute.
goto :end
:push_fail
git remote set-url origin https://github.com/zhuxingshifu1992/hefei-job-help.git
echo [FAIL] push failed. Turn on VPN and run again.
echo        If it still fails, put your VPN local proxy port into
echo        tools\.proxy as a single line, e.g.  127.0.0.1:7890
goto :end
:no_token
echo [error] token file not found: %TOKEN_FILE%
echo        Put github_pat_... token (one line) into tools\.gh_token
goto :end
:try_port
if not "%PROXY%"=="" goto :eof
curl -x http://127.0.0.1:%1 -s -o nul --max-time 5 https://github.com >nul 2>&1
if errorlevel 1 goto :eof
set PROXY=127.0.0.1:%1
goto :eof
:end
pause
