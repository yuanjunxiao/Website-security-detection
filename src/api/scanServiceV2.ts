import axios, { AxiosError } from 'axios'
import { getAccessToken, refreshAccessToken } from './googleAuthService'

export interface FraudRisk {
  isFraud: boolean
  fraudType: string | null
  confidence: number
  reasons?: string[]
}

export interface ScanTask {
  taskId: string
  status: 'pending' | 'scanning' | 'completed' | 'failed'
  url: string
  scanType: 'basic' | 'deep'
  createdAt?: string
  startTime?: string
  endTime?: string
  riskLevel?: 'safe' | 'low' | 'medium' | 'high' | 'critical' | 'unknown'
  riskScore?: number
  fraudRisk?: FraudRisk
  riskCount?: {
    high: number
    medium: number
    low: number
    info: number
  }
  risks?: Array<{
    id: string
    name: string
    level: 'high' | 'medium' | 'low' | 'info' | 'safe'
    description: string
    solution: string
    url: string
    category: string
    confidence?: number
  }>
  summary?: string
  urlStats?: {
    totalScans: number
    lastScanAt: string | null
  }
}

export interface ScanQuota {
  freeScansRemaining: number
  basicScansRemaining: number
  deepScansRemaining: number
}

export interface UserScanStatus {
  quota: ScanQuota
  status: {
    isFirstScan: boolean      // 是否是第一次扫描
    isPaidUser: boolean       // 是否是付费用户
    hasValidDeepQuota: boolean // 是否有有效的深度扫描配额
    canBasicScan: boolean     // 是否可以进行基础扫描
    canDeepScan: boolean      // 是否可以进行深度扫描
  }
  stats: {
    totalBasicScans: number
    totalDeepScans: number
    registeredAt: string
  }
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  data: T
  message?: string
  code?: string
  quota?: ScanQuota
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://website-security-back-production.up.railway.app'

// 创建带认证的axios实例
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/v2/scan`,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 添加认证头
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器 - 处理token过期
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      
      try {
        const newToken = await refreshAccessToken()
        if (newToken) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError)
      }
    }
    
    return Promise.reject(error)
  }
)

// 创建扫描任务（需要登录）
export const createScanTaskV2 = async (url: string, scanType: 'basic' | 'deep' = 'basic'): Promise<ScanTask> => {
  try {
    const response = await apiClient.post<ApiResponse<ScanTask>>('/', {
      url,
      scanType,
    })

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error(response.data.message || '创建扫描任务失败')
    }
  } catch (error: unknown) {
    const err = error as AxiosError<ApiResponse>
    
    if (err.response?.status === 401) {
      throw new Error('请先登录后再进行检测')
    } else if (err.response?.status === 403) {
      const data = err.response.data
      if (data?.code === 'QUOTA_EXCEEDED') {
        throw new Error(data.message || '检测次数已用完，请购买检测包')
      }
      throw new Error('没有权限执行此操作')
    } else if (err.response?.status === 400) {
      throw new Error('无效的URL地址')
    } else if (err.response?.status === 429) {
      throw new Error('请求过于频繁，请稍后再试')
    } else if (err.code === 'ERR_NETWORK') {
      throw new Error('网络连接失败，请检查网络')
    } else {
      throw new Error(`创建扫描任务失败: ${err.message}`)
    }
  }
}

// 获取扫描任务状态
export const getScanTaskStatusV2 = async (taskId: string): Promise<ScanTask> => {
  try {
    const response = await apiClient.get<ApiResponse<ScanTask>>(`/${taskId}`)

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error(response.data.message || '获取扫描状态失败')
    }
  } catch (error: unknown) {
    const err = error as AxiosError<ApiResponse>
    
    if (err.response?.status === 404) {
      throw new Error('扫描任务不存在')
    } else {
      throw new Error(`获取扫描状态失败: ${err.message}`)
    }
  }
}

// 获取用户扫描配额
export const getUserScanQuota = async (): Promise<ScanQuota> => {
  try {
    const response = await apiClient.get<ApiResponse<ScanQuota>>('/user/quota')

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error(response.data.message || '获取配额失败')
    }
  } catch (error: unknown) {
    const err = error as AxiosError<ApiResponse>
    throw new Error(`获取配额失败: ${err.message}`)
  }
}

// 获取用户扫描状态（用于扫描前检查）
export const getUserScanStatus = async (): Promise<UserScanStatus> => {
  try {
    const response = await apiClient.get<ApiResponse<UserScanStatus>>('/user/status')

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error(response.data.message || '获取用户状态失败')
    }
  } catch (error: unknown) {
    const err = error as AxiosError<ApiResponse>
    throw new Error(`获取用户状态失败: ${err.message}`)
  }
}

// 获取用户扫描历史
export const getUserScanHistory = async (limit = 20, offset = 0): Promise<{
  records: ScanTask[]
  pagination: { limit: number; offset: number; hasMore: boolean }
}> => {
  try {
    const response = await apiClient.get<ApiResponse<{
      records: ScanTask[]
      pagination: { limit: number; offset: number; hasMore: boolean }
    }>>('/user/history', {
      params: { limit, offset }
    })

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error(response.data.message || '获取扫描历史失败')
    }
  } catch (error: unknown) {
    const err = error as AxiosError<ApiResponse>
    throw new Error(`获取扫描历史失败: ${err.message}`)
  }
}

// 获取URL查询统计
export const getUrlStats = async (url: string): Promise<{
  totalScans: number
  lastRiskLevel: string | null
  lastFraudRisk: boolean | null
  firstScanAt: string | null
  lastScanAt: string | null
}> => {
  try {
    const response = await axios.get<ApiResponse<{
      totalScans: number
      lastRiskLevel: string | null
      lastFraudRisk: boolean | null
      firstScanAt: string | null
      lastScanAt: string | null
    }>>(`${API_BASE_URL}/api/v2/scan/url/stats`, {
      params: { url }
    })

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error(response.data.message || '获取URL统计失败')
    }
  } catch (error: unknown) {
    const err = error as AxiosError<ApiResponse>
    throw new Error(`获取URL统计失败: ${err.message}`)
  }
}

// 轮询扫描任务状态
export const pollScanTaskV2 = async (
  taskId: string,
  onProgress?: (task: ScanTask) => void,
  maxAttempts: number = 60,
  initialDelay: number = 1000,
  maxDelay: number = 4000,
): Promise<ScanTask> => {
  let attempts = 0
  let delay = initialDelay

  while (attempts < maxAttempts) {
    try {
      const task = await getScanTaskStatusV2(taskId)

      if (onProgress) {
        onProgress(task)
      }

      if (task.status === 'completed' || task.status === 'failed') {
        return task
      }

      if (task.status === 'scanning') {
        delay = Math.min(delay + 1000, maxDelay)
      } else {
        delay = initialDelay
      }

      await new Promise((resolve) => setTimeout(resolve, delay))
      attempts++
    } catch (error) {
      attempts++
      if (attempts >= maxAttempts) {
        throw error
      }
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw new Error('扫描任务超时')
}

// 计算风险等级颜色
export const getRiskLevelColor = (level: string): string => {
  const colors: Record<string, string> = {
    safe: '#10B981',
    low: '#3B82F6',
    medium: '#F59E0B',
    high: '#EF4444',
    critical: '#7C3AED',
    unknown: '#6B7280'
  }
  return colors[level] || colors.unknown
}

// 计算风险等级文本
export const getRiskLevelText = (level: string): string => {
  const texts: Record<string, string> = {
    safe: '安全',
    low: '低风险',
    medium: '中风险',
    high: '高风险',
    critical: '严重风险',
    unknown: '未知'
  }
  return texts[level] || texts.unknown
}

// 获取诈骗类型文本
export const getFraudTypeText = (type: string | null): string => {
  if (!type) return '未知诈骗类型'
  
  const texts: Record<string, string> = {
    phishing: '钓鱼诈骗',
    lottery_scam: '抽奖诈骗',
    gift_scam: '礼品诈骗',
    investment_scam: '投资诈骗',
    brand_impersonation: '品牌冒充'
  }
  return texts[type] || '疑似诈骗'
}
