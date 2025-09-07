# 后端API集成指南

## 需要的后端接口

### 1. Google OAuth 回调接口
**端点**: `POST /api/auth/google`

**请求体**:
```json
{
  "code": "authorization_code_from_google",
  "redirect_uri": "http://localhost:5173/auth/callback"
}
```

**响应**:
```json
{
  "id": "user_id",
  "email": "user@example.com",
  "name": "User Name",
  "picture": "https://profile_picture_url",
  "givenName": "Given",
  "familyName": "Family"
}
```

### 2. 退出登录接口
**端点**: `POST /api/auth/logout`

**功能**: 清除服务器端session

### 3. 认证状态检查接口
**端点**: `GET /api/auth/status`

**响应**: 返回当前登录用户信息或401未授权

## 实现流程

### 前端流程：
1. 用户点击登录按钮，重定向到Google授权页面
2. Google回调到 `/auth/callback?code=xxx`
3. 前端将授权码发送到后端 `/api/auth/google`
4. 后端验证授权码并返回用户信息
5. 前端保存用户状态

### 后端流程（Node.js示例）：
```javascript
// Google OAuth 配置
const { google } = require('googleapis')

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
)

// 处理Google回调
app.post('/api/auth/google', async (req, res) => {
  try {
    const { code } = req.body
    
    // 使用授权码获取tokens
    const { tokens } = await oauth2Client.getToken(code)
    oauth2Client.setCredentials(tokens)
    
    // 获取用户信息
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const userInfo = await oauth2.userinfo.get()
    
    // 创建或查找用户
    const user = await findOrCreateUser(userInfo.data)
    
    // 创建session或JWT
    req.session.userId = user.id
    
    res.json(user)
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' })
  }
})
```

## 环境变量配置

### 后端需要的环境变量：
```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
REDIRECT_URI=http://localhost:5173/auth/callback
SESSION_SECRET=your-session-secret
```

### 前端需要的环境变量：
```env
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_REDIRECT_URI=http://localhost:5173/auth/callback
VITE_API_BASE_URL=http://localhost:3000/api
```

## 安全注意事项

1. **不要在前端存储Client Secret**
2. 使用HTTPS在生产环境
3. 验证redirect_uri防止攻击
4. 使用安全的session存储
5. 实现CSRF保护