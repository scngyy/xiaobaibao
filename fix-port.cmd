@echo off
title 🔧 端口管理工具
color 0E
echo.
echo ╔════════════════════════════════════════╗
echo ║        🔧 端口3000管理工具              ║
echo ╚════════════════════════════════════════╝
echo.

:menu
echo 请选择操作：
echo.
echo [1] 检查端口3000占用情况
echo [2] 强制关闭占用端口3000的进程
echo [3] 尝试启动项目
echo [4] 更改端口号到3001
echo [5] 退出
echo.
set /p choice=请输入选项 (1-5): 

if "%choice%"=="1" goto :check
if "%choice%"=="2" goto :kill
if "%choice%"=="3" goto :start
if "%choice%"=="4" goto :changeport
if "%choice%"=="5" goto :exit
echo 无效选项，请重试
goto :menu

:check
echo.
echo 🔍 正在检查端口3000占用情况...
echo.
netstat -ano | findstr :3000
echo.
if %errorlevel% equ 0 (
    echo ⚠️  端口3000被占用
    
    echo.
    echo 📋 占用进程详情：
    for /f "tokens=5" %%i in ('netstat -ano ^| findstr ":3000.*LISTENING"') do (
        echo 进程ID: %%i
        tasklist | findstr %%i
    )
) else (
    echo ✅ 端口3000可用
)
echo.
pause
goto :menu

:kill
echo.
echo 🛠️  正在查找占用端口3000的进程...
echo.

for /f "tokens=5" %%i in ('netstat -ano ^| findstr ":3000.*LISTENING" 2^>nul') do (
    set PID=%%i
    goto :found
)

echo ✅ 没有找到占用端口3000的进程
goto :menu

:found
echo 📋 发现占用进程 PID: %PID%!
echo.

:: 尝试查看进程详情
tasklist | findstr %PID% >nul 2>&1
if %errorlevel% equ 0 (
    echo 📋 进程详情：
    tasklist | findstr %PID%
    echo.
    set /p confirm=确定要关闭这个进程吗？ (y/n): 
    if /i "%confirm%"=="y" (
        echo 🔄 正在关闭进程...
        taskkill /PID %PID% /F
        if !errorlevel! equ 0 (
            echo ✅ 成功关闭进程
        ) else (
            echo ❌ 关闭进程失败，可能需要管理员权限
        )
    )
) else (
    echo ⚠️  进程可能已经结束
)
echo.
pause
goto :menu

:start
echo.
echo 🚀 尝试启动项目...
echo.
if exist "node_modules" (
    echo 📦 依赖已安装，启动服务器...
    npm run dev
) else (
    echo 📦 正在安装依赖...
    npm install
    echo.
    echo 🚀 启动服务器...
    npm run dev
)
goto :menu

:changeport
echo.
echo 🔧 正在更改端口号到3001...
echo.

:: 备份原配置
if exist "vite.config.ts" (
    copy vite.config.ts vite.config.ts.backup >nul 2>&1
    echo ✅ 已备份原配置到 vite.config.ts.backup
)

:: 修改配置文件
echo import path from 'path'; > temp_config.ts
echo import { defineConfig, loadEnv } from 'vite'; >> temp_config.ts
echo import react from '@vitejs/plugin-react'; >> temp_config.ts
echo. >> temp_config.ts
echo export default defineConfig(({ mode }) => { >> temp_config.ts
echo     const env = loadEnv(mode, '.', ''); >> temp_config.ts
echo     return { >> temp_config.ts
echo       server: { >> temp_config.ts
echo         port: 3001, >> temp_config.ts
echo         host: '0.0.0.0', // 允许外部访问 >> temp_config.ts
echo         strictPort: true, // 如果端口被占用则失败，不尝试其他端口 >> temp_config.ts
echo         open: false, // 不自动打开浏览器 >> temp_config.ts
echo         cors: true, // 启用CORS >> temp_config.ts
echo       }, >> temp_config.ts
echo       plugins: [react()], >> temp_config.ts
echo       define: { >> temp_config.ts
echo         'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY), >> temp_config.ts
echo         'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY) >> temp_config.ts
echo       }, >> temp_config.ts
echo       resolve: { >> temp_config.ts
echo         alias: { >> temp_config.ts
echo           '@': path.resolve(__dirname, '.'), >> temp_config.ts
echo         } >> temp_config.ts
echo       } >> temp_config.ts
echo     }; >> temp_config.ts
echo }); >> temp_config.ts

move /Y temp_config.ts vite.config.ts >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ 端口已更改为3001
    echo.
    echo 🌐 新的访问地址：
    echo    本地: http://localhost:3001
    echo    局域网: http://你的IP:3001
    echo.
    echo 💡 要恢复原端口，请删除vite.config.ts，重命名vite.config.ts.backup为vite.config.ts
) else (
    echo ❌ 修改配置失败
)
echo.
pause
goto :menu

:exit
echo.
echo 👋 退出端口管理工具
echo.
pause
