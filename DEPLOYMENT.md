# GitHub Pages 部署指南

本文档详细说明如何将 VitePress 项目部署到 GitHub Pages。

## 📋 部署前准备

### 1. 确保项目文件完整

确认以下文件存在：
- ✅ `package.json`
- ✅ `.vitepress/config.ts`
- ✅ `.github/workflows/deploy.yml`
- ✅ `.gitignore`

## 🚀 部署步骤

### 步骤 1：创建 GitHub 仓库

1. 登录 [GitHub](https://github.com)
2. 点击右上角的 `+` 号，选择 `New repository`
3. 填写仓库信息：
   - **Repository name**: `my-notes`（或其他名称）
   - **Description**: 个人技术学习笔记
   - **Public/Private**: 选择 Public（GitHub Pages 免费版需要公开仓库）
   - ❌ **不要**勾选 "Initialize this repository with a README"
4. 点击 `Create repository`

### 步骤 2：初始化 Git 仓库（本地）

在项目根目录打开终端，执行以下命令：

```bash
# 初始化 Git 仓库
git init

# 添加所有文件到暂存区
git add .

# 提交更改
git commit -m "Initial commit: VitePress 项目初始化"

# 设置主分支名称为 main
git branch -M main

# 添加远程仓库（替换 yourusername 为你的 GitHub 用户名）
git remote add origin https://github.com/yourusername/my-notes.git

# 推送到远程仓库
git push -u origin main
```

> 💡 **注意**：将 `yourusername` 替换为你的 GitHub 用户名，`my-notes` 替换为你的仓库名

### 步骤 3：配置 GitHub Pages

1. 进入 GitHub 仓库页面
2. 点击 `Settings`（设置）
3. 在左侧菜单找到 `Pages`
4. 在 `Source` 部分：
   - 选择 **GitHub Actions**
   - 保存设置

![GitHub Pages 设置](https://docs.github.com/assets/cb-153864/images/help/pages/publishing-source-actions.png)

### 步骤 4：配置 base 路径（重要）

根据你的部署方式，需要修改 `.vitepress/config.ts` 中的 `base` 配置：

#### 情况 1：部署到根域名（https://username.github.io/）

如果你的仓库名称是 `username.github.io`，则保持：

```typescript
export default defineConfig({
  base: '/',  // 根路径
  // ...
})
```

#### 情况 2：部署到子路径（https://username.github.io/my-notes/）

如果你的仓库名称是 `my-notes`，则需要修改为：

```typescript
export default defineConfig({
  base: '/my-notes/',  // 仓库名称
  // ...
})
```

修改后记得提交并推送：

```bash
git add .vitepress/config.ts
git commit -m "Update base path for GitHub Pages"
git push
```

### 步骤 5：触发自动部署

推送代码到 `main` 分支会自动触发 GitHub Actions 部署：

```bash
# 推送任何更改都会触发部署
git push
```

### 步骤 6：查看部署状态

1. 进入 GitHub 仓库页面
2. 点击 `Actions` 标签
3. 查看最新的工作流运行状态：
   - 🟢 绿色 = 部署成功
   - 🔴 红色 = 部署失败（点击查看错误日志）
   - 🟡 黄色 = 正在部署中

![GitHub Actions](https://docs.github.com/assets/cb-66192/images/help/repository/actions-tab.png)

### 步骤 7：访问网站

部署成功后，访问你的网站：

- **根域名部署**: `https://username.github.io/`
- **子路径部署**: `https://username.github.io/my-notes/`

> 💡 **提示**：首次部署可能需要等待 1-3 分钟

## 🔧 常见问题

### Q1: 推送代码后没有触发部署？

**解决方法：**
1. 检查 `.github/workflows/deploy.yml` 文件是否存在
2. 确认推送到了 `main` 分支
3. 检查 GitHub Actions 是否被启用（仓库 Settings → Actions → General）

### Q2: 部署成功但页面显示 404？

**可能原因：**
- `base` 路径配置错误

**解决方法：**
1. 检查 `.vitepress/config.ts` 中的 `base` 配置
2. 根路径：`base: '/'`
3. 子路径：`base: '/仓库名/'`（注意前后都有斜杠）

### Q3: 样式或资源加载失败？

**可能原因：**
- `base` 路径配置错误导致资源路径不正确

**解决方法：**
- 确保 `base` 配置正确
- 重新构建并部署

### Q4: 如何查看详细的部署日志？

1. 进入仓库的 `Actions` 页面
2. 点击失败的工作流
3. 展开 `build` 或 `deploy` 步骤查看详细日志

## 🔄 更新网站内容

后续更新网站内容的流程：

```bash
# 1. 编辑 Markdown 文件或修改配置

# 2. 本地预览（可选）
npm run docs:dev

# 3. 提交更改
git add .
git commit -m "Update: 添加新笔记"

# 4. 推送到 GitHub（自动触发部署）
git push
```

## 📝 自定义域名（可选）

如果你有自定义域名，可以：

1. 在仓库根目录创建 `public/CNAME` 文件
2. 文件内容为你的域名（如：`notes.example.com`）
3. 在域名 DNS 设置中添加 CNAME 记录指向 `username.github.io`

```bash
# 创建 CNAME 文件
echo "notes.example.com" > public/CNAME

# 提交并推送
git add public/CNAME
git commit -m "Add custom domain"
git push
```

## 🎉 部署完成

现在你的 VitePress 网站已经成功部署到 GitHub Pages！

每次推送代码到 `main` 分支，GitHub Actions 会自动：
1. 安装依赖
2. 构建网站
3. 部署到 GitHub Pages

---

**需要帮助？** 查看 [GitHub Pages 官方文档](https://docs.github.com/pages) 或 [VitePress 部署文档](https://vitepress.dev/guide/deploy#github-pages)