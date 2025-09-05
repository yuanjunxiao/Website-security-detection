# 网址安全检测平台 - 架构设计文档

## 1. 系统架构概览

### 1.1 整体架构
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│                 │    │                 │    │                 │
│   前端应用      │    │   后端API      │    │   腾讯云安全    │
│   (Netlify)     │◄──►│   (Railway)     │◄──►│     SDK         │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
      Vue 3 +                Node.js +              安全检测
      TypeScript             Express               服务
```

### 1.2 技术栈选择

#### 前端技术栈
- **Vue 3**: 现代化的渐进式框架，性能优异
- **TypeScript**: 类型安全，提高代码质量
- **Vite**: 快速的构建工具，开发体验好
- **Pinia**: 轻量级状态管理
- **Vue Router**: 官方路由解决方案

#### 后端技术栈
- **Node.js**: JavaScript运行时，与前端技术栈统一
- **Express.js**: 轻量级Web框架，快速开发
- **腾讯云SDK**: 官方安全检测服务
- **Cors**: 跨域请求处理
- **Helmet**: 安全头设置

## 2. 前端架构设计

### 2.1 项目结构
```
src/
├── components/          # 公共组件
│   ├── AppNavigation.vue
│   ├── ScoreChart.vue
│   └── common/
├── views/              # 页面组件
│   ├── HomeView.vue    # 首页
│   ├── ScanResult.vue  # 检测结果页
│   ├── ScanHistory.vue # 历史记录页
│   ├── Settings.vue    # 设置页
│   ├── Help.vue        # 帮助页
│   └── AboutView.vue   # 关于页
├── stores/             # 状态管理
│   ├── scan.ts         # 扫描相关状态
│   ├── history.ts      # 历史记录状态
│   └── settings.ts     # 设置状态
├── router/             # 路由配置
│   └── index.ts
├── services/           # API服务
│   ├── api.ts          # API基础配置
│   ├── scan.ts         # 扫描API
│   └── types.ts        # 类型定义
├── utils/              # 工具函数
│   ├── validation.ts   # 验证工具
│   ├── storage.ts      # 本地存储
│   └── format.ts       # 格式化工具
└── assets/             # 静态资源
    ├── styles/
    └── images/
```

### 2.2 API设计

#### 2.2.1 扫描接口
```
POST /api/scan
Content-Type: application/json

Request:
{
  "url": "https://example.com",
  "options": {
    "checkMalware": true,
    "checkPhishing": true,
    "checkFraud": true
  }
}

Response:
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "safetyLevel": "safe|suspicious|dangerous",
    "riskTypes": ["phishing", "malware"],
    "score": 85,
    "details": {
      "description": "检测结果描述",
      "recommendations": ["建议1", "建议2"]
    },
    "timestamp": "2024-01-01T00:00:00Z"
  }
}
```

### 2.3 腾讯云安全SDK集成

#### 2.3.1 SDK配置
```javascript
const tencentcloud = require("tencentcloud-sdk-nodejs")

const clientConfig = {
  credential: {
    secretId: process.env.TENCENT_SECRET_ID,
    secretKey: process.env.TENCENT_SECRET_KEY,
  },
  region: process.env.TENCENT_REGION || "ap-beijing"
}
```

## 3. 数据流设计

### 3.1 检测流程
```
1. 用户输入URL
   ↓
2. 前端验证URL格式
   ↓
3. 发送检测请求到后端
   ↓
4. 后端验证请求参数
   ↓
5. 调用腾讯云安全SDK
   ↓
6. 解析检测结果
   ↓
7. 返回结果给前端
   ↓
8. 前端展示结果
   ↓
9. 保存到本地历史记录
```

## 4. 部署架构

### 4.1 前端部署 (Netlify)
- 构建命令: `npm run build`
- 发布目录: `dist`
- 环境变量配置
- 自定义域名设置

### 4.2 后端部署 (Railway)
- Node.js运行时
- 环境变量配置
- 健康检查设置
- 自动扩缩容

## 5. 环境变量配置

### 5.1 前端环境变量
```env
VITE_API_BASE_URL=https://your-api.railway.app
VITE_APP_NAME=网址安全检测平台
```

### 5.2 后端环境变量
```env
TENCENT_SECRET_ID=your_secret_id
TENCENT_SECRET_KEY=your_secret_key
TENCENT_REGION=ap-beijing
PORT=3000