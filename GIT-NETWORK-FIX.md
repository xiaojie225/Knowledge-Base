# Git 网络连接问题解决方案

## 🔴 错误信息

```
fatal: unable to access 'https://github.com/xiaojie225/Knowledge-Base.git/': 
Failed to connect to github.com port 443 after 21119 ms: Couldn't connect to server
```

## 💡 解决方案

### 方案 1：配置 Git 代理（如果使用代理）

如果您使用了代理软件（如 Clash、V2Ray 等），需要配置 Git 使用代理。

#### HTTP 代理配置

```bash
# 设置 HTTP 代理（替换端口号为您的代理端口，通常是 7890 或 7897）
git config --global http.proxy http://127.0.0.1:7890
git config --global https.proxy https://127.0.0.1:7890

# 或使用 SOCKS5 代理
git config --global http.proxy socks5://127.0.0.1:7890
git config --global https.proxy socks5://127.0.0.1:7890
```

#### 取消代理配置

如果不需要代理：

```bash
git config --global --unset http.proxy
git config --global --unset https.proxy
```

### 方案 2：使用 SSH 代替 HTTPS

SSH 方式通常更稳定，推荐使用。

#### 步骤 1：生成 SSH 密钥（如果还没有）

```bash
# 生成 SSH 密钥
ssh-keygen -t ed25519 -C "your_email@example.com"

# 按 Enter 使用默认路径
# 可以设置密码或直接按 Enter 跳过
```

#### 步骤 2：添加 SSH 密钥到 GitHub

```bash
# 复制公钥内容
cat ~/.ssh/id_ed25519.pub
# Windows 用户使用：type %USERPROFILE%\.ssh\id_ed25519.pub
```

然后：
1. 登录 GitHub
2. 点击右上角头像 → Settings
3. 左侧菜单选择 SSH and GPG keys
4. 点击 New SSH key
5. 粘贴公钥内容，点击 Add SSH key

#### 步骤 3：修改远程仓库地址为 SSH

```bash
# 查看当前远程地址
git remote -v

# 将 HTTPS 改为 SSH
git remote set-url origin git@github.com:xiaojie225/Knowledge-Base.git

# 验证修改
git remote -v
```

现在可以正常推送了：

```bash
git push -u origin main
```

### 方案 3：修改 hosts 文件（临时方案）

如果 GitHub 被 DNS 污染，可以修改 hosts 文件。

#### Windows 系统

1. 以管理员身份打开记事本
2. 打开文件：`C:\Windows\System32\drivers\etc\hosts`
3. 添加以下内容：

```
140.82.113.4 github.com
185.199.108.153 assets-cdn.github.com
185.199.109.153 assets-cdn.github.com
185.199.110.153 assets-cdn.github.com
185.199.111.153 assets-cdn.github.com
```

4. 保存文件
5. 刷新 DNS：`ipconfig /flushdns`

#### macOS/Linux 系统

```bash
# 编辑 hosts 文件
sudo nano /etc/hosts

# 添加上述 GitHub IP
# 保存退出（Ctrl+O, Enter, Ctrl+X）

# 刷新 DNS
sudo dscacheutil -flushcache  # macOS
sudo systemd-resolve --flush-caches  # Linux
```

### 方案 4：检查防火墙和网络

1. **检查防火墙**：确保防火墙没有阻止 Git
2. **检查网络**：确认网络连接正常，可以访问其他网站
3. **尝试其他网络**：切换到手机热点测试

### 方案 5：使用 GitHub Desktop（最简单）

如果命令行方式一直有问题，可以使用 GitHub Desktop：

1. 下载 [GitHub Desktop](https://desktop.github.com/)
2. 安装并登录 GitHub 账号
3. 添加本地仓库（Add → Add Existing Repository）
4. 使用图形界面推送代码

## 🔍 诊断命令

### 测试 GitHub 连接

```bash
# 测试 HTTPS 连接
curl -v https://github.com

# 测试 SSH 连接
ssh -T git@github.com
```

### 查看 Git 配置

```bash
# 查看所有配置
git config --list

# 查看代理配置
git config --global --get http.proxy
git config --global --get https.proxy
```

## 📝 推荐方案（按优先级）

1. **首选**：使用 SSH 方式（方案 2）- 最稳定
2. **次选**：配置代理（方案 1）- 如果有代理软件
3. **备选**：使用 GitHub Desktop（方案 5）- 最简单

## ✅ 验证连接

配置完成后，测试连接：

```bash
# 测试 SSH 连接（如果使用 SSH）
ssh -T git@github.com
# 看到 "Hi username! You've successfully authenticated" 表示成功

# 或测试推送
git push
```

## 💡 常见错误

| 错误信息 | 可能原因 | 解决方案 |
|---------|---------|---------|
| Connection timed out | 网络被墙或防火墙阻止 | 使用 SSH 或配置代理 |
| Permission denied | SSH 密钥未配置 | 添加 SSH 密钥到 GitHub |
| Could not resolve host | DNS 解析失败 | 修改 hosts 文件 |

---

**建议**：优先尝试方案 2（SSH），这是最稳定的连接方式。