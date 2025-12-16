@echo off
title 🔍 网络诊断工具
color 0B
echo.
echo ╔════════════════════════════════════════╗
echo ║        🔍 Photo Helix 网络诊断工具       ║
echo ╚════════════════════════════════════════╝
echo.

echo 🖥️  正在检查网络配置...
echo.

:: 检查Node.js
echo [1/6] 检查Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js未安装或不在PATH中
    echo    请从 https://nodejs.org/ 下载安装
    goto :error
)
echo ✅ Node.js已安装
node --version

:: 检查npm
echo.
echo [2/6] 检查npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm不可用
    goto :error
)
echo ✅ npm已安装
npm --version

:: 检查网络连接
echo.
echo [3/6] 检查网络连接...
ping -n 1 8.8.8.8 >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 无法连接到外网
    echo    请检查你的网络连接
) else (
    echo ✅ 外网连接正常
)

:: 获取IP地址信息
echo.
echo [4/6] 获取网络配置...
echo 📡 网络适配器信息:
ipconfig | findstr /i "IPv4\|Wireless\|Ethernet"

:: 提取本地IP
for /f "tokens=2 delims=:" %%i in ('ipconfig ^| findstr /i "IPv4"') do (
    set LOCAL_IP=%%i
    set LOCAL_IP=!LOCAL_IP: =!
    echo ✅ 局域网IP: !LOCAL_IP!
)

:: 检查端口占用
echo.
echo [5/6] 检查端口3000占用情况...
netstat -an | findstr :3000 >nul 2>&1
if %errorlevel% equ 0 (
    echo ⚠️  端口3000已被占用
    echo    当前监听的进程：
    netstat -ano | findstr :3000
    echo.
    echo 💡 解决方案：
    echo    1. 关闭占用端口的程序
    echo    2. 或修改vite.config.ts中的端口号
) else (
    echo ✅ 端口3000可用
)

:: 检查防火墙状态（简化版）
echo.
echo [6/6] 检查防火墙状态...
netsh advfirewall show allprofiles | findstr /i "State" | findstr /i "on" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Windows防火墙已启用
    echo 💡 记得在首次运行时允许Node.js访问网络
) else (
    echo ⚠️  Windows防火墙未启用
    echo    建议启用防火墙以保护系统安全
)

:: 显示访问地址
echo.
echo ╔════════════════════════════════════════╗
echo ║             🌐 访问地址                  ║
echo ╚════════════════════════════════════════╝
echo.
echo 📍 本地访问:    http://localhost:3000
if defined LOCAL_IP (
    echo 📍 局域网访问:  http://!LOCAL_IP!:3000
) else (
    echo ⚠️  无法获取局域网IP地址
)

echo.
echo 📱 其他设备访问步骤：
echo 1. 确保设备在同一WiFi网络
echo 2. 在浏览器中输入局域网地址
echo 3. 如无法访问，检查防火墙设置

echo.
echo 🛠️  故障排除：
echo - 如果外网无法访问：检查路由器设置
echo - 如果本地无法访问：检查端口占用
echo - 如果手机无法访问：确认在同一网络

goto :end

:error
echo.
echo ❌ 诊断发现问题，请根据上述提示解决
pause
exit /b 1

:end
echo.
echo ✅ 诊断完成！如果所有检查都通过，可以运行 start.cmd 启动应用
echo.
pause
