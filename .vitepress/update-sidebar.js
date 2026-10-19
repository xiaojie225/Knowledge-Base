/**
 * 自动扫描 知识库/前端 目录并更新 .vitepress/config.ts 中的 sidebar 配置
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FRONTEND_DIR = path.join(__dirname, '../知识库/前端');
const CONFIG_PATH = path.join(__dirname, 'config.ts');

// 递归读取目录生成 VitePress sidebar items 结构
function generateSidebarItems(dir, baseRoute = '/知识库/前端') {
    if (!fs.existsSync(dir)) return [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    let items = [];

    // 优先处理文件夹，按名称排序；然后处理文件
    entries.sort((a, b) => {
        if (a.isDirectory() && !b.isDirectory()) return -1;
        if (!a.isDirectory() && b.isDirectory()) return 1;
        return a.name.localeCompare(b.name, 'zh-CN');
    });

    for (const entry of entries) {
        // 忽略隐藏文件或特殊文件
        if (entry.name.startsWith('.') || entry.name === 'index.md') continue;

        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            const subItems = generateSidebarItems(fullPath, `${baseRoute}/${entry.name}`);
            if (subItems.length > 0) {
                items.push({
                    text: entry.name,
                    collapsed: true,
                    items: subItems
                });
            }
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
            const nameWithoutExt = entry.name.replace(/\.md$/, '');
            items.push({
                text: nameWithoutExt,
                link: `${baseRoute}/${nameWithoutExt}`
            });
        }
    }

    return items;
}

function updateConfig() {
    try {
        console.log('正在扫描目录:', FRONTEND_DIR);
        const frontendItems = generateSidebarItems(FRONTEND_DIR);

        const rootEntries = fs.readdirSync(FRONTEND_DIR, { withFileTypes: true });
        let topLevelItems = [];

        const apiFile = rootEntries.find(e => e.isFile() && e.name === 'API接口网站.md');
        if (apiFile) {
            topLevelItems.push({
                text: 'API接口网站',
                link: '/知识库/前端/API接口网站'
            });
        }

        topLevelItems.push(...frontendItems);

        const sidebarConfig = {
            text: '前端知识库',
            collapsed: false,
            items: topLevelItems
        };

        let configContent = fs.readFileSync(CONFIG_PATH, 'utf-8');

        const startMarker = "'/知识库/前端/': [";
        const startIndex = configContent.indexOf(startMarker);

        if (startIndex === -1) {
            console.error('[错误] 在 config.ts 中未找到 \'/知识库/前端/\' 配置项！');
            return;
        }

        let braceCount = 0;
        let endIndex = -1;
        let started = false;

        for (let i = startIndex; i < configContent.length; i++) {
            if (configContent[i] === '[') {
                braceCount++;
                started = true;
            } else if (configContent[i] === ']') {
                braceCount--;
            }
            if (started && braceCount === 0) {
                endIndex = i + 1;
                break;
            }
        }

        if (endIndex === -1) {
            console.error('[错误] 无法正确解析 \'/知识库/前端/\' 数组的闭合边界！');
            return;
        }

        let formattedJs = JSON.stringify([sidebarConfig], null, 4)
            .replace(/"([^(-\s\d")]+)":/g, '$1:')
            .replace(/"/g, "'");

        const replacement = `'/知识库/前端/': ${formattedJs}`;

        configContent = configContent.substring(0, startIndex) + replacement + configContent.substring(endIndex);

        fs.writeFileSync(CONFIG_PATH, configContent, 'utf-8');
        console.log('[成功] .vitepress/config.ts 中的前端侧边栏已自动更新！');

    } catch (err) {
        console.error('[错误] 更新侧边栏失败:', err);
    }
}

updateConfig();
