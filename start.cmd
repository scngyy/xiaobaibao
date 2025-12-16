@echo off
title 🚀 Photo Helix - 本地服务器
color 0A
echo.
echo ╔════════════════════════════════════════╗
echo ║     🎨 Photo Helix 3D 图片展示应用      ║
echo ║           本地服务器启动工具              ║
echo ╚════════════════════════════════════════╝
echo.

echo 🔍 正在检查系统环境...

:: 检查Node.js是否安装
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：未检测到Node.js
    echo    请先安装Node.js: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js已安装

:: 检查npm是否可用
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误：npm不可用
    pause
    exit /b 1
)

echo ✅ npm已就绪

:: 获取本机IP地址
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /i "IPv4"') do (
    set LOCAL_IP=%%i
    set LOCAL_IP=!LOCAL_IP: =!
)

if defined LOCAL_IP (
    echo 📡 局域网IP地址: !LOCAL_IP!
) else (
    echo ⚠️  无法获取局域网IP地址
)

echo.
echo 🌐 访问地址：
echo    本地访问: http://localhost:3000
echo    局域网访问: http://!LOCAL_IP!:3000
echo.

echo 🔧 正在检查依赖...
if not exist "node_modules" (
    echo 📦 正在安装依赖...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ 依赖安装失败
        pause
        exit /b 1
    )
    echo ✅ 依赖安装完成
) else (
    echo ✅ 依赖已安装
)

echo.
echo 🚀 正在启动开发服务器...
echo    请稍候，服务器启动中...
echo.
echo 💡 提示：
echo    - 首次运行可能需要防火墙授权
echo    - 按Ctrl+C停止服务器
echo    - 将图片放入public/photos文件夹
echo.

:: 启动服务器
npm run dev

pause
