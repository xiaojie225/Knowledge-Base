@echo off
chcp 65001 >nul
echo ========================================================
echo 正在启动 VitePress 实时监控与自动侧边栏更新脚本
echo 监控目录: 知识库\前端
echo 目标文件: .vitepress\config.ts
echo ========================================================

:: 检查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [错误] 未检测到 Node.js，请先安装 Node.js！
    pause
    exit /b 1
)

:: 首次运行先更新一次
node .vitepress/update-sidebar.js

echo.
echo [监听中] 正在持续监听 知识库\前端 目录变化...
echo [提示] 当有文件新增、删除、修改或重命名时，将自动更新侧边栏。
echo [提示] 按下 Ctrl+C 可停止监控。
echo ========================================================

:: 使用 Node.js 的 fs.watch 持续监控目录
node -e "const fs = require('fs'); const path = require('path'); const { exec } = require('child_process'); const targetDir = path.join(__dirname, '知识库/前端'); console.log('监听路径:', targetDir); let timer = null; fs.watch(targetDir, { recursive: true }, (eventType, filename) => { if (filename && (filename.endsWith('.md') || filename.includes('\\'))) { if (timer) clearTimeout(timer); timer = setTimeout(() => { console.log(`\n[检测到变化] 文件/目录变动: ${filename}`); exec('node .vitepress/update-sidebar.js', (err, stdout, stderr) => { if (stdout) console.log(stdout); if (stderr) console.error(stderr); }); }, 500); } });"

pause
