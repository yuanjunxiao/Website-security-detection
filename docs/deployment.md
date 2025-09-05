# 网址安全检测平台 - 部署指南

## 1. 部署概览

本项目采用前后端分离架构：
- **前端**: 部署在 Netlify
- **后端**: 部署在 Railway
- **安全检测**: 集成腾讯云安全SDK

## 2. 前端部署 (Netlify)

### 2.1 准备工作

#### 2.1.1 环境变量配置
在项目根目录创建 `.env` 文件：
```env
VITE_API_BASE_URL=https://your-backend.railway.app
VITE_APP_NAME=网址安全检测平台
VITE_APP_VERSION=1.0.0
```

#### 2.1.2 构建配置
确保 `package.json` 中包含正确的构建脚本：
```json
{
  "scripts": {
    "build": "vue-tsc --build && vite build",
    "preview": "vite preview"
  }
}
```

### 2.2 Netlify部署步骤

#### 2.2.1 通过Git部署（推荐）

1. **连接GitHub仓库**
   - 登录 [Netlify](https://netlify.com)
   - 点击 "New site from Git"
   - 选择 GitHub 并授权
   - 选择项目仓库

2. **配置构建设置**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **设置环境变量**
   - 进入 Site settings > Environment variables
   - 添加以下变量：
     ```
     VITE_API_BASE_URL = https://your-backend.railway.app
     VITE_APP_NAME = 网址安全检测平台
     ```

4. **部署配置**
   在项目根目录创建 `netlify.toml`：
   ```toml
   [build]
     publish = "dist"
     command = "npm run build"

   [build.environment]
     NODE_VERSION = "20"

   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200

   [[headers]]
     for = "/*"
     [headers.values]
       X-Frame-Options = "DENY"
       X-XSS-Protection = "1; mode=block"
       X-Content-Type-Options = "nosniff"
       Referrer-Policy = "strict-origin-when-cross-origin"
   ```

#### 2.2.2 手动部署

1. **本地构建**
   ```bash
   npm install
   npm run build
   ```

2. **上传到Netlify**
   - 将 `dist` 文件夹拖拽到 Netlify 部署页面
   - 或使用 Netlify CLI：
     ```bash
     npm install -g netlify-cli
     netlify deploy --prod --dir=dist
     ```

### 2.3 自定义域名配置

1. **添加自定义域名**
   - 进入 Site settings > Domain management
   - 点击 "Add custom domain"
   - 输入域名（如：security-scanner.com）

2. **DNS配置**
   - 在域名提供商处添加CNAME记录：
     ```
     www.security-scanner.com -> your-site.netlify.app
     ```
   - 或添加A记录指向Netlify IP

3. **SSL证书**
   - Netlify会自动提供Let's Encrypt SSL证书
   - 确保启用 "Force HTTPS"

## 3. 后端部署 (Railway)

### 3.1 准备工作

#### 3.1.1 创建后端项目结构
```
backend/
├── src/
│   ├── controllers/
│   │   └── scanController.js
│   ├── services/
│   │   └── tencentSecurity.js
│   ├── middleware/
│   │   ├── cors.js
│   │   └── rateLimit.js
│   ├── routes/
│   │   └── scan.js
│   └── utils/
│       └── logger.js
├── package.json
├── server.js
└── railway.json
```

#### 3.1.2 创建 package.json
```json
{
  "name": "security-scanner-backend",
  "version": "1.0.0",
  "description": "网址安全检测后端API",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "express-rate-limit": "^6.8.1",
    "tencentcloud-sdk-nodejs": "^4.0.3",
    "dotenv": "^16.3.1"
  },
  "devDependencies": {
    "nodemon": "^3.0.1",
    "jest": "^29.6.1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### 3.1.3 创建主服务文件 server.js
```javascript
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')
require('dotenv').config()

const scanRoutes = require('./src/routes/scan')

const app = express()
const PORT = process.env.PORT || 3000

// 安全中间件
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-frontend.netlify.app',
  credentials: true
}))

// 限流中间件
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 15分钟内最多100个请求
  message: '请求过于频繁，请稍后再试'
})
app.use(limiter)

// 解析JSON
app.use(express.json({ limit: '1mb' }))

// 路由
app.use('/api', scanRoutes)

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    }
  })
})

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: '接口不存在'
    }
  })
})

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: '服务器内部错误'
    }
  })
})

app.listen(PORT, () => {
  console.log(`服务器运行在端口 ${PORT}`)
})
```

### 3.2 Railway部署步骤

#### 3.2.1 通过Git部署（推荐）

1. **创建Railway项目**
   - 登录 [Railway](https://railway.app)
   - 点击 "New Project"
   - 选择 "Deploy from GitHub repo"
   - 选择后端代码仓库

2. **配置环境变量**
   在Railway项目设置中添加：
   ```
   TENCENT_SECRET_ID=your_secret_id
   TENCENT_SECRET_KEY=your_secret_key
   TENCENT_REGION=ap-beijing
   FRONTEND_URL=https://your-frontend.netlify.app
   NODE_ENV=production
   ```

3. **配置构建设置**
   创建 `railway.json`：
   ```json
   {
     "$schema": "https://railway.app/railway.schema.json",
     "build": {
       "builder": "NIXPACKS"
     },
     "deploy": {
       "startCommand": "npm start",
       "healthcheckPath": "/api/health",
       "healthcheckTimeout": 100,
       "restartPolicyType": "ON_FAILURE",
       "restartPolicyMaxRetries": 10
     }
   }
   ```

#### 3.2.2 CLI部署

1. **安装Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **登录并部署**
   ```bash
   railway login
   railway init
   railway up
   ```

### 3.3 自定义域名配置

1. **添加自定义域名**
   - 在Railway项目设置中点击 "Domains"
   - 点击 "Custom Domain"
   - 输入域名（如：api.security-scanner.com）

2. **DNS配置**
   - 添加CNAME记录：
     ```
     api.security-scanner.com -> your-project.railway.app
     ```

## 4. 腾讯云安全SDK配置

### 4.1 获取API密钥

1. **登录腾讯云控制台**
   - 访问 [腾讯云控制台](https://console.cloud.tencent.com)
   - 进入 "访问管理" > "API密钥管理"

2. **创建密钥**
   - 点击 "新建密钥"
   - 记录 SecretId 和 SecretKey

### 4.2 开通相关服务

1. **内容安全服务**
   - 进入 "内容安全" 控制台
   - 开通相关检测服务
   - 配置检测策略

2. **网站安全检测**
   - 开通网站安全检测服务
   - 配置检测规则

### 4.3 SDK集成示例

创建 `src/services/tencentSecurity.js`：
```javascript
const tencentcloud = require("tencentcloud-sdk-nodejs")

class TencentSecurityService {
  constructor() {
    const TmsClient = tencentcloud.tms.v20201229.Client

    const clientConfig = {
      credential: {
        secretId: process.env.TENCENT_SECRET_ID,
        secretKey: process.env.TENCENT_SECRET_KEY,
      },
      region: process.env.TENCENT_REGION || "ap-beijing",
      profile: {
        httpProfile: {
          endpoint: "tms.tencentcloudapi.com",
        },
      },
    }

    this.client = new TmsClient(clientConfig)
  }

  async scanUrl(url, options = {}) {
    try {
      const params = {
        Content: url,
        BizType: "website_security",
        DataId: this.generateDataId(),
        User: {
          UserId: "anonymous",
          AccountType: "1"
        }
      }

      const result = await this.client.TextModeration(params)
      return this.parseResult(result, url)
    } catch (error) {
      throw new Error(`安全检测失败: ${error.message}`)
    }
  }

  parseResult(result, url) {
    // 解析腾讯云返回结果
    const suggestion = result.Suggestion
    const label = result.Label
    const score = result.Score || 0

    let safetyLevel = 'safe'
    let riskTypes = []

    if (suggestion === 'Block') {
      safetyLevel = 'dangerous'
      riskTypes = [label]
    } else if (suggestion === 'Review') {
      safetyLevel = 'suspicious'
      riskTypes = [label]
    }

    return {
      url,
      safetyLevel,
      riskScore: score,
      riskTypes,
      details: {
        suggestion,
        label,
        score
      },
      recommendations: this.generateRecommendations(safetyLevel),
      scanId: this.generateScanId(),
      timestamp: new Date().toISOString()
    }
  }

  generateDataId() {
    return `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  generateScanId() {
    return `scan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  generateRecommendations(safetyLevel) {
    const recommendations = {
      safe: ['网站安全性良好，可以正常访问'],
      suspicious: ['建议谨慎访问此网站', '请注意保护个人信息'],
      dangerous: ['强烈建议不要访问此网站', '该网站存在安全风险', '请勿在此网站输入个人信息']
    }
    return recommendations[safetyLevel] || []
  }
}

module.exports = TencentSecurityService
```

## 5. 环境变量管理

### 5.1 前端环境变量

#### 开发环境 (.env.development)
```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_NAME=网址安全检测平台(开发)
VITE_APP_VERSION=1.0.0-dev
```

#### 生产环境 (.env.production)
```env
VITE_API_BASE_URL=https://your-backend.railway.app
VITE_APP_NAME=网址安全检测平台
VITE_APP_VERSION=1.0.0
```

### 5.2 后端环境变量

#### 开发环境 (.env.development)
```env
NODE_ENV=development
PORT=3000
TENCENT_SECRET_ID=your_dev_secret_id
TENCENT_SECRET_KEY=your_dev_secret_key
TENCENT_REGION=ap-beijing
FRONTEND_URL=http://localhost:5173
```

#### 生产环境 (Railway配置)
```env
NODE_ENV=production
TENCENT_SECRET_ID=your_prod_secret_id
TENCENT_SECRET_KEY=your_prod_secret_key
TENCENT_REGION=ap-beijing
FRONTEND_URL=https://your-frontend.netlify.app
```

## 6. CI/CD配置

### 6.1 GitHub Actions

创建 `.github/workflows/deploy.yml`：
```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
      
      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v2.0
        with:
          publish-dir: './dist'
          production-branch: main
          github-token: ${{ secrets.GITHUB_TOKEN }}
          deploy-message: "Deploy from GitHub Actions"
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@v1.2.0
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: ${{ secrets.RAILWAY_SERVICE }}
```

## 7. 监控和日志

### 7.1 前端监控

#### Netlify Analytics
- 在Netlify控制台启用Analytics
- 监控页面访问量和性能

#### 错误监控
集成Sentry进行错误监控：
```javascript
import * as Sentry from "@sentry/vue"

Sentry.init({
  app,
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
})
```

### 7.2 后端监控

#### Railway监控
- Railway提供内置的CPU、内存监控
- 查看部署日志和错误信息

#### 日志管理
```javascript
const winston = require('winston')

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
})

module.exports = logger
```

## 8. 故障排除

### 8.1 常见问题

#### 前端部署问题
1. **构建失败**
   - 检查Node.js版本
   - 确认依赖安装完整
   - 检查环境变量配置

2. **路由404错误**
   - 确保配置了重定向规则
   - 检查`netlify.toml`配置

#### 后端部署问题
1. **服务启动失败**
   - 检查端口配置
   - 确认环境变量设置
   - 查看Railway部署日志

2. **API调用失败**
   - 检查CORS配置
   - 确认腾讯云密钥有效
   - 检查网络连接

### 8.2 性能优化

#### 前端优化
- 启用Gzip压缩
- 配置CDN缓存
- 优化图片资源

#### 后端优化
- 实现响应缓存
- 优化数据库查询
- 配置负载均衡

## 9. 安全配置

### 9.1 HTTPS配置
- 前端和后端都必须使用HTTPS
- 配置HSTS头部
- 使用安全的Cookie设置

### 9.2 API安全
- 实现请求限流
- 添加输入验证
- 配置CORS策略
- 使用安全头部

### 9.3 密钥管理
- 使用环境变量存储敏感信息
- 定期轮换API密钥
- 限制密钥权限范围

## 10. 备份和恢复

### 10.1 代码备份
- 使用Git版本控制
- 定期推送到远程仓库
- 创建发布标签

### 10.2 配置备份
- 导出环境变量配置
- 备份部署配置文件
- 记录域名和DNS设置

### 10.3 恢复流程
1. 从Git仓库恢复代码
2. 重新配置环境变量
3. 重新部署应用
4. 验证功能正常