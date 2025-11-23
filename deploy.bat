@echo off
REM PSYCHLAB Professional Assessment - GitHub Pages Deployment Script (Windows)
REM Version 2.0.1
REM Author: PSYCHLAB Professional Team

title PSYCHLAB Professional Assessment - Deployment Script

REM 设置颜色代码
set "RED=[91m"
set "GREEN=[92m"
set "YELLOW=[93m"
set "BLUE=[94m"
set "PURPLE=[95m"
set "CYAN=[96m"
set "NC=[0m"

REM 显示Logo
echo %PURPLE%
echo   ____  _ _   _     _   _               ____              _    _
echo  ^| __ _^(_) ^|_^| ^|__ ^| ^|_^(_^) ___  ^| _ \  ___  _ __ ^| ^|_^| ^|__   ___ _ __
echo  ^|  _^`^| ^| __^| '_ \^| __^| ^|/ _ \^| '_ \^| ^| ^| ^|^|/ _ \^| '_ \^| __^|^| '_ \ / _ \ '__^|
echo  ^| ^| ^| ^| ^| ^|_^| ^| ^| ^| ^|_^| ^| (_) ^| ^| ^| ^|^| ^|_^| ^| (_) ^| ^| ^| ^| ^|_^| ^| ^| ^| ^|  __/ ^|
echo  ^|_^| ^|_^|_^_^_^|_^_^|_^|_^|\__^|_^|\___/^|^|_^|_^|^|____/ \___/^|^|_^|_^|_^|\__^|^|_^|_^|_^|\___^|_^|
echo %NC%
echo %CYAN%Professional Psychology Assessment System v2.0.1%NC%
echo %CYAN%GitHub Pages Deployment Script (Windows)%NC%
echo.

REM 检查Node.js
echo %BLUE%[1/7]%NC% 检查部署环境...
node --version >nul 2>&1
if errorlevel 1 (
    echo %RED%错误: Node.js 未安装。请先安装 Node.js 16.0 或更高版本。%NC%
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo %GREEN%✓ Node.js 版本: %NODE_VERSION%%NC%

REM 检查npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo %RED%错误: npm 未安装。%NC%
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo %GREEN%✓ npm 版本: %NPM_VERSION%%NC%

REM 检查package.json
if not exist "package.json" (
    echo %RED%错误: 未找到 package.json 文件。请确保在项目根目录运行此脚本。%NC%
    pause
    exit /b 1
)

echo %GREEN%✓ 找到 package.json%NC%

REM 安装依赖
echo %BLUE%[2/7]%NC% 安装项目依赖...
call npm install
if errorlevel 1 (
    echo %RED%错误: 依赖安装失败。%NC%
    pause
    exit /b 1
)
echo %GREEN%✓ 依赖安装完成%NC%

REM 检查gh-pages
npm list gh-pages >nul 2>&1
if errorlevel 1 (
    echo %YELLOW%gh-pages 未安装，正在安装...%NC%
    call npm install --save-dev gh-pages
    if errorlevel 1 (
        echo %RED%错误: gh-pages 安装失败。%NC%
        pause
        exit /b 1
    )
    echo %GREEN%✓ gh-pages 安装完成%NC%
)

REM 检查Git仓库
echo %BLUE%[3/7]%NC% 检查 Git 仓库状态...
git rev-parse --git-dir >nul 2>&1
if errorlevel 1 (
    echo %RED%错误: 当前目录不是 Git 仓库。%NC%
    pause
    exit /b 1
)

REM 获取当前分支
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
echo %GREEN%✓ 当前分支: %CURRENT_BRANCH%%NC%

REM 检查远程仓库
git remote get-url origin >nul 2>&1
if errorlevel 1 (
    echo %RED%错误: 未找到 Git 远程仓库 'origin'。%NC%
    echo %YELLOW%请先设置远程仓库：%NC%
    echo git remote add origin https://github.com/你的用户名/仓库名.git
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('git remote get-url origin') do set REMOTE_URL=%%i
echo %GREEN%✓ 远程仓库: %REMOTE_URL%%NC%

REM 构建项目
echo %BLUE%[4/7]%NC% 构建生产版本...
call npm run build
if errorlevel 1 (
    echo %RED%错误: 构建失败。%NC%
    pause
    exit /b 1
)

if not exist "build" (
    echo %RED%错误: 构建失败，未找到 build 目录。%NC%
    pause
    exit /b 1
)

if not exist "build\index.html" (
    echo %RED%错误: 构建结果不完整，缺少 index.html。%NC%
    pause
    exit /b 1
)

echo %GREEN%✓ 构建完成%NC%
echo %GREEN%✓ 构建文件验证通过%NC%

REM 部署到GitHub Pages
echo %BLUE%[5/7]%NC% 部署到 GitHub Pages...
call npm run deploy
if errorlevel 1 (
    echo %RED%错误: 部署失败。%NC%
    pause
    exit /b 1
)

echo %GREEN%✓ 部署成功%NC%

REM 提取用户名和仓库名
echo %BLUE%[6/7]%NC% 获取部署信息...
echo %REMOTE_URL% | findstr /C:"github.com" >nul
if not errorlevel 1 (
    for /f "tokens=3,4 delims=/:." %%a in ("%REMOTE_URL%") do (
        set USERNAME=%%a
        set REPO_NAME=%%b
    )
    set DEPLOY_URL=https://%USERNAME%.github.io/%REPO_NAME%
    echo %GREEN%✓ 部署信息:%NC%
    echo   用户名: %USERNAME%
    echo   仓库名: %REPO_NAME%
    echo   部署地址: %DEPLOY_URL%
) else (
    echo %YELLOW%无法自动提取部署地址，请手动检查 GitHub Pages 设置。%NC%
)

REM 完成部署
echo %BLUE%[7/7]%NC% 完成部署...

REM 询问是否清理构建文件
set /p "CLEAN_BUILD=是否删除构建文件 (build 目录)？(y/N): "
if /i "%CLEAN_BUILD%"=="y" (
    if exist "build" rmdir /s /q build
    echo %GREEN%✓ 构建文件已清理%NC%
)

REM 完成信息
echo.
echo %GREEN%🎉 部署完成！%NC%
echo.
echo %CYAN%=== 部署总结 ===%NC%
echo 项目: PSYCHLAB Professional Assessment v2.0.1
echo 分支: %CURRENT_BRANCH%
echo 远程: %REMOTE_URL%
if defined DEPLOY_URL (
    echo 部署地址: %DEPLOY_URL%
)
echo.

echo %BLUE%下一步操作:%NC%
echo 1. 访问 GitHub 仓库的 Settings 页面
echo 2. 进入 Pages 选项卡
echo 3. 确保 Source 设置为 'Deploy from a branch'
echo 4. Branch 选择 'gh-pages' 和 '/ (root)'
echo 5. 等待几分钟让 GitHub 处理部署
echo.

if defined DEPLOY_URL (
    echo %YELLOW%🌐 网站将在几分钟后可通过以下地址访问:%NC%
    echo %CYAN%%DEPLOY_URL%%NC%
    echo.
)

echo %GREEN%感谢使用 PSYCHLAB Professional Assessment System!%NC%
echo %PURPLE%🧠 专业的心理测评，科学的自我认知%NC%

pause