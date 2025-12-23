import { useUserStore } from '../stores/userStore'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://website-security-back-production.up.railway.app'

// 获取 Google OAuth 授权 URL
export const getGoogleAuthUrl = async (): Promise<string> => {
  try {
    // 构建当前页面的回调URL
    const currentOrigin = window.location.origin
    const callbackPath = '/auth/callback'
    const redirectUri = encodeURIComponent(`${currentOrigin}${callbackPath}`)
    
    const response = await fetch(`${API_BASE_URL}/api/auth/google?redirect_uri=${redirectUri}`)
    if (!response.ok) {
      throw new Error('Failed to get auth URL')
    }

    const result = await response.json()
    return result.data.authUrl
  } catch (error) {
    console.error('Error getting auth URL:', error)
    throw error
  }
}

// 处理OAuth回调 - 从URL参数中提取token
export const handleOAuthTokens = async (): Promise<boolean> => {
  const userStore = useUserStore()
  const urlParams = new URLSearchParams(window.location.search)
  
  // 检查URL中是否有token（后端OAuth回调重定向带来的）
  const accessToken = urlParams.get('access_token')
  const refreshToken = urlParams.get('refresh_token')
  const error = urlParams.get('error')
  
  if (error) {
    console.error('OAuth error:', error)
    return false
  }
  
  if (accessToken && refreshToken) {
    userStore.setLoading(true)
    
    try {
      // 存储token
      localStorage.setItem('access_token', accessToken)
      localStorage.setItem('refresh_token', refreshToken)
      
      // 获取用户信息
      const userResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      if (userResponse.ok) {
        const userResult = await userResponse.json()
        if (userResult.status === 'success') {
          userStore.setUser(userResult.data)
          return true
        }
      }
      
      // 如果获取用户信息失败，清除token
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      return false
    } catch (error) {
      console.error('Error fetching user info:', error)
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      return false
    } finally {
      userStore.setLoading(false)
    }
  }
  
  return false
}

// 初始化 Google 登录 - 检查是否已登录
export const initGoogleAuth = async (): Promise<void> => {
  const userStore = useUserStore()
  
  // 如果已经认证，不需要再初始化
  if (userStore.isAuthenticated) {
    return
  }
  
  // 检查本地存储中是否有token
  const accessToken = localStorage.getItem('access_token')
  if (accessToken) {
    // 验证token是否有效
    const isValid = await checkAuthStatus()
    if (!isValid) {
      // token无效，尝试刷新
      const newToken = await refreshAccessToken()
      if (newToken) {
        await checkAuthStatus()
      }
    }
  }
}

// 触发 Google 登录
export const triggerGoogleSignIn = async (): Promise<void> => {
  try {
    const authUrl = await getGoogleAuthUrl()
    window.location.href = authUrl
  } catch (error) {
    console.error('Failed to start Google OAuth:', error)
  }
}

// 退出登录
export const signOut = async (): Promise<void> => {
  const userStore = useUserStore()
  const accessToken = localStorage.getItem('access_token')

  try {
    if (accessToken) {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
    }
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    // 清除本地存储
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    userStore.clearUser()
  }
}

// 检查用户是否已登录
export const checkAuthStatus = async (): Promise<boolean> => {
  const userStore = useUserStore()
  const accessToken = localStorage.getItem('access_token')

  if (!accessToken) {
    return false
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })

    if (response.ok) {
      const result = await response.json()
      if (result.status === 'success') {
        userStore.setUser(result.data)
        return true
      }
    }
    return false
  } catch (error) {
    console.error('Auth status check error:', error)
    return false
  }
}

// 刷新访问令牌
export const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = localStorage.getItem('refresh_token')

  if (!refreshToken) {
    return null
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    })

    if (response.ok) {
      const result = await response.json()
      if (result.status === 'success') {
        localStorage.setItem('access_token', result.data.accessToken)
        localStorage.setItem('refresh_token', result.data.refreshToken)
        return result.data.accessToken
      }
    }
    return null
  } catch (error) {
    console.error('Token refresh error:', error)
    return null
  }
}

// 获取当前用户信息
export const getCurrentUser = () => {
  const userStore = useUserStore()
  return userStore.user
}

// 获取访问令牌
export const getAccessToken = (): string | null => {
  return localStorage.getItem('access_token')
}
