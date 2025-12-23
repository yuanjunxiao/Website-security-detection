import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface ScanQuota {
  freeScansRemaining: number
  basicScansRemaining: number
  deepScansRemaining: number
}

export interface UserScanStatusInfo {
  isFirstScan: boolean      // 是否是第一次扫描
  isPaidUser: boolean       // 是否是付费用户
  hasValidDeepQuota: boolean // 是否有有效的深度扫描配额
  canBasicScan: boolean     // 是否可以进行基础扫描
  canDeepScan: boolean      // 是否可以进行深度扫描
}

export interface UserScanStats {
  totalBasicScans: number
  totalDeepScans: number
  registeredAt: string
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
  const scanStatus = ref<UserScanStatusInfo | null>(null)
  const scanStats = ref<UserScanStats | null>(null)

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

  // 设置用户扫描状态
  const setScanStatus = (status: UserScanStatusInfo) => {
    scanStatus.value = status
  }

  // 设置用户扫描统计
  const setScanStats = (stats: UserScanStats) => {
    scanStats.value = stats
  }

  // 清除用户信息
  const clearUser = () => {
    user.value = null
    isAuthenticated.value = false
    scanQuota.value = null
    scanStatus.value = null
    scanStats.value = null
    localStorage.removeItem('googleUser')
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  // 设置加载状态
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  // 检查是否有可用的基础扫描次数（免费 + 付费）
  const hasBasicScans = () => {
    if (!scanQuota.value) return false
    return scanQuota.value.freeScansRemaining > 0 || scanQuota.value.basicScansRemaining > 0
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
    scanStatus,
    scanStats,
    loadUserFromStorage,
    setUser,
    setScanQuota,
    setScanStatus,
    setScanStats,
    clearUser,
    setLoading,
    hasBasicScans,
    hasDeepScans
  }
})
