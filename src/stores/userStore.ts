import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ScanQuota {
  freeScansRemaining: number
  basicScansRemaining: number
  deepScansRemaining: number
}

export interface User {
  id: string
  email: string
  name: string
  picture: string
  verified_email?: boolean
  locale?: string
  provider?: string
  createdAt?: string
  lastLoginAt?: string
  freeScansRemaining?: number
  totalBasicScans?: number
  totalDeepScans?: number
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)
  const scanQuota = ref<ScanQuota | null>(null)

  // 从本地存储加载用户信息
  const loadUserFromStorage = () => {
    const savedUser = localStorage.getItem('googleUser')
    const accessToken = localStorage.getItem('access_token')
    
    if (savedUser && accessToken) {
      try {
        user.value = JSON.parse(savedUser)
        isAuthenticated.value = true
      } catch (e) {
        console.error('Failed to parse saved user:', e)
        clearUser()
      }
    }
  }

  // 设置用户信息
  const setUser = (userData: User) => {
    user.value = userData
    isAuthenticated.value = true
    localStorage.setItem('googleUser', JSON.stringify(userData))
  }

  // 设置扫描配额
  const setScanQuota = (quota: ScanQuota) => {
    scanQuota.value = quota
  }

  // 清除用户信息
  const clearUser = () => {
    user.value = null
    isAuthenticated.value = false
    scanQuota.value = null
    localStorage.removeItem('googleUser')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  // 设置加载状态
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  // 检查是否有可用的基础扫描次数
  const hasBasicScans = () => {
    if (!scanQuota.value) return false
    return scanQuota.value.basicScansRemaining > 0
  }

  // 检查是否有可用的深度扫描次数
  const hasDeepScans = () => {
    if (!scanQuota.value) return false
    return scanQuota.value.deepScansRemaining > 0
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    scanQuota,
    loadUserFromStorage,
    setUser,
    setScanQuota,
    clearUser,
    setLoading,
    hasBasicScans,
    hasDeepScans
  }
})
