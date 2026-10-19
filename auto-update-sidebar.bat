@echo off
chcp 65001 >nul
echo ========================================================
echo 正在启动 VitePress 自动侧边栏更新脚本 (Node.js 驱动)
echo 监控目录: 知识库\前端
echo 目标文件: .vitepress\config.ts
echo ========================================================

:: 检查 Node.js 是否安装
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js 环境！
    pause
    exit /b 1
)

:: 执行 Node 脚本来生成侧边栏并更新 config.ts
node .vitepress/update-sidebar.js

echo.
echo [提示] 侧边栏更新完成！
pause
