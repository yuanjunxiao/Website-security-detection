# 网址安全检测平台

一个基于腾讯云安全SDK的网址安全检测平台，帮助用户识别诈骗网站、恶意网站和带有病毒的网站，保护用户免受网络安全威胁。

## 🎯 项目概述

本项目是一个前后端分离的网址安全检测系统：
- **前端**：Vue 3 + TypeScript + Vite，部署在 Netlify
- **后端**：Node.js API 服务，集成腾讯云安全SDK，部署在 Railway
- **核心功能**：用户输入网址 → 后端调用腾讯云安全检测 → 返回安全评估结果

## 🚀 技术栈

### 前端技术栈
- **框架**: Vue 3 + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **UI设计**: 现代化扁平设计
- **部署平台**: Netlify

### 后端技术栈
- **API服务**: Node.js + Express
- **安全检测**: 腾讯云安全SDK
- **部署平台**: Railway

## 📋 主要功能

### 核心功能
1. **网址安全检测**
   - 用户输入待检测网址
   - 实时安全风险评估
   - 详细的安全报告

2. **风险识别**
   - 诈骗网站检测
   - 恶意软件识别
   - 钓鱼网站预警
   - 病毒风险评估
   - 交易风险评估

3. **检测历史**
   - 历史检测记录
   - 检测结果统计
   - 风险趋势分析

### 辅助功能
- 用户设置管理
- 帮助文档
- 关于页面

## 🏗️ 项目架构

```
用户输入网址 → 前端验证 → 后端API → 腾讯云安全SDK → 检测结果 → 前端展示
```

## 🛠️ 开发环境设置

### 前端开发
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 代码检查
npm run lint
```

### 环境要求
- Node.js: ^20.19.0 || >=22.12.0
- npm: 最新版本

## 📦 部署说明

### 前端部署 (Netlify)
1. 连接 GitHub 仓库
2. 设置构建命令: `npm run build`
3. 设置发布目录: `dist`
4. 配置环境变量

### 后端部署 (Railway)
1. 连接后端代码仓库
2. 配置腾讯云安全SDK密钥
3. 设置环境变量
4. 部署API服务

## 🔧 配置说明

### 环境变量
```env
# 前端环境变量
VITE_API_BASE_URL=https://your-api.railway.app
VITE_APP_NAME=网址安全检测平台

# 后端环境变量
TENCENT_SECRET_ID=your_secret_id
TENCENT_SECRET_KEY=your_secret_key
TENCENT_REGION=ap-beijing
```

## 📚 相关文档

- [需求文档](./docs/requirements.md)
- [架构设计文档](./docs/architecture.md)
- [API接口文档](./docs/api.md)
- [部署指南](./docs/deployment.md)

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
