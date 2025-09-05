# 网址安全检测平台 - API接口文档

## 1. 接口概览

### 1.1 基础信息
- **Base URL**: `https://your-api.railway.app`
- **协议**: HTTPS
- **数据格式**: JSON
- **字符编码**: UTF-8

### 1.2 通用响应格式
```json
{
  "success": true,
  "data": {},
  "message": "操作成功",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 1.3 错误响应格式
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "错误描述",
    "details": "详细错误信息"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 2. 核心接口

### 2.1 网址安全检测

#### 接口信息
- **URL**: `/api/scan`
- **方法**: POST
- **描述**: 检测指定网址的安全性

#### 请求参数
```json
{
  "url": "https://example.com",
  "options": {
    "checkMalware": true,
    "checkPhishing": true,
    "checkFraud": true,
    "checkVirus": true
  }
}
```

#### 参数说明
| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| url | string | 是 | 待检测的网址，必须包含协议 |
| options | object | 否 | 检测选项配置 |
| options.checkMalware | boolean | 否 | 是否检测恶意软件，默认true |
| options.checkPhishing | boolean | 否 | 是否检测钓鱼网站，默认true |
| options.checkFraud | boolean | 否 | 是否检测诈骗网站，默认true |
| options.checkVirus | boolean | 否 | 是否检测病毒，默认true |

#### 成功响应
```json
{
  "success": true,
  "data": {
    "url": "https://example.com",
    "safetyLevel": "safe",
    "riskScore": 15,
    "riskTypes": [],
    "details": {
      "malware": {
        "detected": false,
        "confidence": 0.95,
        "description": "未检测到恶意软件"
      },
      "phishing": {
        "detected": false,
        "confidence": 0.92,
        "description": "未检测到钓鱼行为"
      },
      "fraud": {
        "detected": false,
        "confidence": 0.88,
        "description": "未检测到诈骗风险"
      },
      "virus": {
        "detected": false,
        "confidence": 0.90,
        "description": "未检测到病毒"
      }
    },
    "recommendations": [
      "网站安全性良好，可以正常访问"
    ],
    "scanId": "scan_123456789",
    "timestamp": "2024-01-01T00:00:00Z"
  },
  "message": "检测完成",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### 危险网站响应示例
```json
{
  "success": true,
  "data": {
    "url": "https://dangerous-site.com",
    "safetyLevel": "dangerous",
    "riskScore": 85,
    "riskTypes": ["phishing", "fraud"],
    "details": {
      "malware": {
        "detected": false,
        "confidence": 0.95,
        "description": "未检测到恶意软件"
      },
      "phishing": {
        "detected": true,
        "confidence": 0.88,
        "description": "检测到钓鱼网站特征"
      },
      "fraud": {
        "detected": true,
        "confidence": 0.92,
        "description": "检测到诈骗风险"
      },
      "virus": {
        "detected": false,
        "confidence": 0.90,
        "description": "未检测到病毒"
      }
    },
    "recommendations": [
      "强烈建议不要访问此网站",
      "该网站可能存在钓鱼和诈骗风险",
      "请勿在此网站输入个人信息或进行交易"
    ],
    "scanId": "scan_123456790",
    "timestamp": "2024-01-01T00:00:00Z"
  },
  "message": "检测完成",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

#### 安全等级说明
| 等级 | 风险分数 | 描述 |
|------|----------|------|
| safe | 0-30 | 安全，可以正常访问 |
| suspicious | 31-60 | 可疑，建议谨慎访问 |
| dangerous | 61-100 | 危险，强烈建议不要访问 |

#### 错误响应
```json
{
  "success": false,
  "error": {
    "code": "INVALID_URL",
    "message": "无效的URL格式",
    "details": "URL必须包含有效的协议(http或https)"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 2.2 获取检测结果

#### 接口信息
- **URL**: `/api/scan/{scanId}`
- **方法**: GET
- **描述**: 根据扫描ID获取检测结果

#### 路径参数
| 参数 | 类型 | 必填 | 描述 |
|------|------|------|------|
| scanId | string | 是 | 扫描任务ID |

#### 成功响应
```json
{
  "success": true,
  "data": {
    "scanId": "scan_123456789",
    "status": "completed",
    "result": {
      // 与检测接口相同的结果格式
    }
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 3. 辅助接口

### 3.1 健康检查

#### 接口信息
- **URL**: `/api/health`
- **方法**: GET
- **描述**: 检查API服务状态

#### 成功响应
```json
{
  "success": true,
  "data": {
    "status": "healthy",
    "version": "1.0.0",
    "uptime": 3600,
    "services": {
      "tencentCloud": "connected",
      "database": "connected"
    }
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 3.2 获取支持的检测类型

#### 接口信息
- **URL**: `/api/scan/types`
- **方法**: GET
- **描述**: 获取支持的检测类型列表

#### 成功响应
```json
{
  "success": true,
  "data": {
    "types": [
      {
        "key": "malware",
        "name": "恶意软件检测",
        "description": "检测网站是否包含恶意软件"
      },
      {
        "key": "phishing",
        "name": "钓鱼网站检测",
        "description": "检测网站是否为钓鱼网站"
      },
      {
        "key": "fraud",
        "name": "诈骗网站检测",
        "description": "检测网站是否存在诈骗风险"
      },
      {
        "key": "virus",
        "name": "病毒检测",
        "description": "检测网站是否包含病毒"
      }
    ]
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 4. 错误码说明

### 4.1 客户端错误 (4xx)
| 错误码 | HTTP状态码 | 描述 |
|--------|------------|------|
| INVALID_URL | 400 | 无效的URL格式 |
| MISSING_PARAMETER | 400 | 缺少必需参数 |
| INVALID_PARAMETER | 400 | 参数格式错误 |
| RATE_LIMIT_EXCEEDED | 429 | 请求频率超限 |

### 4.2 服务端错误 (5xx)
| 错误码 | HTTP状态码 | 描述 |
|--------|------------|------|
| INTERNAL_ERROR | 500 | 服务器内部错误 |
| SERVICE_UNAVAILABLE | 503 | 服务暂时不可用 |
| TENCENT_API_ERROR | 502 | 腾讯云API调用失败 |
| TIMEOUT | 504 | 请求超时 |

## 5. 请求限制

### 5.1 频率限制
- **每分钟**: 最多60次请求
- **每小时**: 最多1000次请求
- **每天**: 最多10000次请求

### 5.2 请求大小限制
- **请求体大小**: 最大1MB
- **URL长度**: 最大2048字符

### 5.3 超时设置
- **连接超时**: 10秒
- **读取超时**: 30秒
- **总超时**: 60秒

## 6. 安全说明

### 6.1 HTTPS要求
- 所有API请求必须使用HTTPS协议
- 不支持HTTP协议访问

### 6.2 请求头要求
```
Content-Type: application/json
User-Agent: YourApp/1.0.0
```

### 6.3 CORS设置
- 支持跨域请求
- 允许的方法: GET, POST, OPTIONS
- 允许的头部: Content-Type, Authorization

## 7. SDK示例

### 7.1 JavaScript/TypeScript
```typescript
interface ScanOptions {
  checkMalware?: boolean
  checkPhishing?: boolean
  checkFraud?: boolean
  checkVirus?: boolean
}

interface ScanResult {
  url: string
  safetyLevel: 'safe' | 'suspicious' | 'dangerous'
  riskScore: number
  riskTypes: string[]
  details: Record<string, any>
  recommendations: string[]
  scanId: string
  timestamp: string
}

class SecurityScannerAPI {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  async scanUrl(url: string, options?: ScanOptions): Promise<ScanResult> {
    const response = await fetch(`${this.baseURL}/api/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url, options })
    })

    const result = await response.json()
    
    if (!result.success) {
      throw new Error(result.error.message)
    }

    return result.data
  }

  async getHealth(): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/health`)
    const result = await response.json()
    return result.data
  }
}

// 使用示例
const api = new SecurityScannerAPI('https://your-api.railway.app')

try {
  const result = await api.scanUrl('https://example.com', {
    checkMalware: true,
    checkPhishing: true,
    checkFraud: true,
    checkVirus: true
  })
  
  console.log('检测结果:', result)
} catch (error) {
  console.error('检测失败:', error.message)
}
```

## 8. 测试用例

### 8.1 正常检测
```bash
curl -X POST https://your-api.railway.app/api/scan \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://www.google.com",
    "options": {
      "checkMalware": true,
      "checkPhishing": true,
      "checkFraud": true,
      "checkVirus": true
    }
  }'
```

### 8.2 健康检查
```bash
curl https://your-api.railway.app/api/health
```

### 8.3 获取检测类型
```bash
curl https://your-api.railway.app/api/scan/types