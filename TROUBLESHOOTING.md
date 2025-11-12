# GitHub Actions 部署故障排查指南

## 🔴 当前遇到的问题

根据您的截图，GitHub Actions 显示两次部署失败，原因是构建路径配置错误。

## ✅ 解决方案

我已经修复了 `.github/workflows/deploy.yml` 文件：

**修改内容：**
```yaml
# 修改前（错误）
path: docs/.vitepress/dist

# 修改后（正确）
path: .vitepress/dist
```

## 📝 接下来的操作步骤

### 1. 提交修复后的配置文件

在项目根目录执行以下命令：

```bash
# 查看修改的文件
git status

# 添加修改的文件
git add .github/workflows/deploy.yml

# 提交更改
git commit -m "Fix: 修复 GitHub Actions 构建路径错误"

# 推送到 GitHub（会自动触发新的部署）
git push
```

### 2. 观察新的部署状态

1. 推送后，访问 GitHub 仓库
2. 点击 `Actions` 标签
3. 等待新的工作流运行
4. 查看是否成功（绿色勾号表示成功）

### 3. 如果还有其他错误

#### 错误 1：找不到 node_modules 或依赖安装失败

**原因：** `package-lock.json` 可能不存在或不一致

**解决方案：**
```bash
# 删除旧的锁定文件和依赖
rm -rf node_modules package-lock.json

# 重新安装依赖
npm install

# 提交新的 package-lock.json
git add package-lock.json
git commit -m "Update package-lock.json"
git push
```

#### 错误 2：构建失败，找不到命令

**原因：** `package.json` 中的 scripts 配置可能不正确

**解决方案：**

检查 `package.json` 中的 scripts 部分：
```json
{
  "scripts": {
    "docs:dev": "vitepress dev",
    "docs:build": "vitepress build",
    "docs:preview": "vitepress preview"
  }
}
```

注意：不是 `"vitepress dev docs"`，因为 VitePress 是在根目录初始化的。

#### 错误 3：权限错误

**原因：** GitHub Actions 没有足够的权限

**解决方案：**

1. 进入仓库 Settings → Actions → General
2. 滚动到 "Workflow permissions"
3. 选择 "Read and write permissions"
4. 保存设置
5. 重新运行失败的工作流

## 🔍 调试技巧

### 查看详细的构建日志

1. 点击失败的工作流
2. 点击 `build` 或 `deploy` 步骤
3. 展开查看详细错误信息

### 常见错误信息及解决方案

| 错误信息 | 原因 | 解决方案 |
|---------|------|----------|
| `path does not exist` | 构建输出路径错误 | 检查 deploy.yml 中的 path 配置 |
| `npm ERR! code ENOENT` | 找不到 package.json | 确保文件在根目录 |
| `Permission denied` | 权限不足 | 检查仓库 Actions 权限设置 |
| `ENOTFOUND` | 网络问题 | 重试或检查 GitHub Actions 状态 |

## ✨ 成功部署后的检查清单

- [ ] GitHub Actions 显示绿色勾号
- [ ] 可以访问网站（https://username.github.io/repo-name/）
- [ ] 页面样式正常显示
- [ ] 导航链接正常工作
- [ ] 搜索功能可用

## 💡 预防未来的问题

### 1. 本地测试构建

在推送前，先在本地测试构建：

```bash
# 构建项目
npm run docs:build

# 预览构建结果
npm run docs:preview
```

### 2. 检查 .gitignore

确保 `.gitignore` 中包含：
```
node_modules/
.vitepress/dist
.vitepress/cache
```

### 3. 使用 workflow_dispatch

已经配置了 `workflow_dispatch`，可以手动触发部署：

1. 进入 Actions 页面
2. 选择 "Deploy VitePress site to Pages"
3. 点击 "Run workflow"
4. 选择 main 分支
5. 点击 "Run workflow" 按钮

## 📞 需要更多帮助？

如果问题仍未解决：

1. 查看 [VitePress 官方文档](https://vitepress.dev/guide/deploy)
2. 查看 [GitHub Actions 文档](https://docs.github.com/actions)
3. 检查 [GitHub Pages 状态](https://www.githubstatus.com/)

---

**提示：** 每次修改配置文件后都要推送到 GitHub，才会触发新的部署。