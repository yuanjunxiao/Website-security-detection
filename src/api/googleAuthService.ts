import { useUserStore } from '../stores/userStore'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://website-security-back-production.up.railway.app'

// 获取 Google OAuth 授权 URL
export const getGoogleAuthUrl = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/google`)
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

// 处理授权码回调
export const handleAuthCallback = async (code: string): Promise<void> => {
  const userStore = useUserStore()
  userStore.setLoading(true)

  try {
    // 发送授权码到后端
    const response = await fetch(
      `${API_BASE_URL}/auth/google/callback?code=${encodeURIComponent(code)}`,
    )

    if (!response.ok) {
      throw new Error('Authentication failed')
    }

    const result = await response.json()

    if (result.status === 'success') {
      // 获取用户信息
      const userResponse = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${result.data.accessToken}`,
        },
      })

      if (userResponse.ok) {
        const userResult = await userResponse.json()
        userStore.setUser(userResult.data)

        // 存储token
        localStorage.setItem('access_token', result.data.accessToken)
        localStorage.setItem('refresh_token', result.data.refreshToken)
      }
    } else {
      throw new Error(result.message || 'Authentication failed')
    }
  } catch (error) {
    console.error('Authentication error:', error)
    throw error
  } finally {
    userStore.setLoading(false)
  }
}

// 初始化 Google 登录
export const initGoogleAuth = (): void => {
  // 检查URL中是否有授权码
  const urlParams = new URLSearchParams(window.location.search)
  const code = urlParams.get('code')

  if (code) {
    handleAuthCallback(code).then(() => {
      // 清除URL中的code参数
      const newUrl = window.location.pathname
      window.history.replaceState({}, document.title, newUrl)
    })
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
      await fetch(`${API_BASE_URL}/auth/logout`, {
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
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
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
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
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
