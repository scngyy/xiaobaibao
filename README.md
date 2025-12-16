<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# 运行和部署你的AI Studio应用

这里包含了运行本地应用所需的一切。

在AI Studio中查看你的应用: https://ai.studio/apps/temp/2

## 本地运行

**前置条件:** Node.js

### 🚀 快速启动 (Windows 10)

双击运行 `start.cmd` 文件，或在命令行中执行：

```cmd
npm install
npm run dev
```

### 📡 允许外部访问

要让其他设备（手机、平板、其他电脑）访问你的应用：

1. **获取你的IP地址**:
   ```cmd
   ipconfig
   ```
   找到类似 `192.168.x.x` 的地址

2. **访问地址**:
   - 本地: `http://localhost:3000`
   - 局域网: `http://你的IP地址:3000`

3. **防火墙设置**:
   - 首次启动时Windows会提示，选择"允许访问"
   - 或手动在防火墙中开放端口3000

### 📱 多设备访问

- **手机/平板**: 确保在同一WiFi网络，访问 `http://你的IP:3000`
- **其他电脑**: 同一局域网内访问 `http://你的IP:3000`

📖 **详细部署指南**: 查看 [DEPLOYMENT.md](./DEPLOYMENT.md) 获取完整的Windows 10部署说明

## 🚀 GitHub Pages 部署

### 📦 自动部署（推荐）

项目已配置GitHub Actions自动部署：

1. **推送到GitHub**
   ```cmd
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/你的用户名/zip.git
   git push -u origin main
   ```

2. **启用GitHub Pages**
   - 进入仓库Settings
   - 找到Pages选项
   - Source选择 "GitHub Actions"

3. **自动构建部署**
   - 推送代码后自动触发构建
   - 部署完成后访问: `https://你的用户名.github.io/zip/`

### ✅ 已解决的问题

- ✅ **移除Tailwind CDN** - 解决生产环境警告
- ✅ **本地化CSS** - 避免外部依赖
- ✅ **正确路径配置** - GitHub Pages路径问题
- ✅ **自动化构建** - 无需手动构建部署

### 配置API密钥（可选）

在[.env.local](.env.local)中设置`GEMINI_API_KEY`为你的Gemini API密钥（如果需要AI功能）

## 📸 本地图片支持

**🎉 全新自动图片扫描功能！**

本项目现在**自动扫描并加载** `public/photos` 文件夹中的所有图片文件，**无需任何配置**！

### ✨ 使用方法

1. 将图片放入 `public/photos` 文件夹
2. 重启应用 (`npm run dev`)
3. 完成！应用会自动检测并显示所有图片

### 🔧 支持的格式

- `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif`, `.bmp`, `.svg`

### 📁 文件夹结构

```
public/
└── photos/
    ├── 1.jpg
    ├── family.png
    ├── vacation.webp
    └── README.md (说明文件)
```

### 💡 特性

- 🚀 **零配置** - 无需修改代码
- 🔄 **自动更新** - 重启应用即可刷新图片
- 📝 **详细日志** - 控制台显示加载状态
- 🌐 **多格式支持** - 支持所有常见图片格式
- 📏 **智能排序** - 按文件名自动排序显示

### 📊 性能优化

- 图片懒加载，提升性能
- 错误处理，确保应用稳定运行
- 无图片时自动使用备用方案

现在你可以轻松展示自己的照片集合！🎨
