# Google OAuth 登录配置指南

## 1. 后端API配置

### 需要的后端接口：

#### 获取Google OAuth授权URL
```
GET /api/auth/google
```
返回授权URL用于前端重定向

#### 处理Google回调
```
GET /api/auth/google/callback?code={authorization_code}
```
处理Google返回的授权码，交换access token

#### 获取用户信息  
```
GET /api/auth/me
```
需要Authorization头: `Bearer {access_token}`

#### 退出登录
```
POST /api/auth/logout
```
需要Authorization头: `Bearer {access_token}`

#### 刷新访问令牌
```
POST /api/auth/refresh
```
请求体: `{"refresh_token": "token"}`

## 2. 前端环境变量配置

复制 `.env.example` 文件为 `.env`：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置API基础URL：

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

## 3. 登录流程

### 完整OAuth 2.0授权码流程：

1. **前端** → 调用 `/api/auth/google` 获取授权URL
2. **用户** → 重定向到Google授权页面进行登录授权
3. **Google** → 授权后回调到前端 `/auth/callback?code=xxx`
4. **前端** → 发送授权码到 `/api/auth/google/callback?code=xxx`
5. **后端** → 使用授权码向Google交换access token和refresh token
6. **后端** → 返回tokens给前端
7. **前端** → 使用access token调用 `/api/auth/me` 获取用户信息
8. **前端** → 存储token和用户信息到localStorage和状态管理

### 前端功能特性：
- ✅ 标准的OAuth 2.0授权码流程
- ✅ 安全的token管理（access token + refresh token）
- ✅ 自动token刷新机制
- ✅ 用户头像和名称显示
- ✅ 退出登录功能
- ✅ 登录状态持久化
- ✅ 响应式设计

## 4. 界面位置

- 登录按钮位于浏览器窗口右上角（固定位置）
- 支持桌面和移动端自适应显示
- 登录状态实时更新

## 5. 开发测试

启动开发服务器：

```bash
npm run dev
```

访问 `http://localhost:5173` 测试登录功能。

## 6. 生产部署

1. 配置生产环境API地址
2. 确保后端服务正常运行
3. 构建生产版本：

```bash
npm run build
```

## 7. 故障排除

### 常见问题：

1. **授权失败错误**
   - 检查后端服务是否正常运行
   - 确认Google OAuth客户端配置正确

2. **Token验证失败**
   - 检查access token格式是否正确
   - 确认Authorization头正确设置

3. **用户信息获取失败**
   - 检查网络请求是否被拦截
   - 查看浏览器控制台错误信息

### 调试技巧：

- 打开浏览器开发者工具查看网络请求
- 检查Console标签页的错误信息
- 确认环境变量 `VITE_API_BASE_URL` 已正确设置
- 使用浏览器Application面板检查localStorage中的token

## 8. 安全注意事项

- Access token存储在浏览器localStorage中
- 使用HTTPS在生产环境确保传输安全
- 实现自动token刷新机制
- 定期检查token有效期
- 退出登录时清除所有本地存储的token