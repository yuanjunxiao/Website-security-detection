import axios, { AxiosError } from 'axios'

export interface ScanTask {
  taskId: string
  status: 'pending' | 'scanning' | 'completed' | 'failed'
  url: string
  createdAt?: string
  startTime?: string
  endTime?: string
  riskLevel?: 'safe' | 'low' | 'medium' | 'high' | 'critical'
  riskCount?: {
    high: number
    medium: number
    low: number
    info: number
  }
  risks?: Array<{
    id: string
    name: string
    level: 'high' | 'medium' | 'low' | 'info'
    description: string
    solution: string
    url: string
    category: string
  }>
  summary?: string
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  data: T
  message?: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://website-security-back-production.up.railway.app'

const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 创建扫描任务
export const createScanTask = async (url: string): Promise<ScanTask> => {
  try {
    const response = await apiClient.post<ApiResponse<ScanTask>>('/scan', {
      url: url,
    })

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error(response.data.message || '创建扫描任务失败')
    }
  } catch (error: unknown) {
    const err = error as AxiosError
    if (err.response?.status === 400) {
      throw new Error('无效的URL地址')
    } else if (err.response?.status === 429) {
      throw new Error('请求过于频繁，请稍后再试')
    } else if (err.code === 'ERR_NETWORK' || err.message?.includes('CORS') || err.message?.includes('cross-origin')) {
      throw new Error('跨域访问被阻止，请联系管理员检查后端CORS配置')
    } else {
      throw new Error(`创建扫描任务失败: ${err.message}`)
    }
  }
}

// 获取扫描任务状态
export const getScanTaskStatus = async (taskId: string): Promise<ScanTask> => {
  try {
    const response = await apiClient.get<ApiResponse<ScanTask>>(`/scan/${taskId}`)

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error(response.data.message || '获取扫描状态失败')
    }
  } catch (error: unknown) {
    const err = error as AxiosError
    if (err.code === 'ERR_NETWORK' || err.message?.includes('CORS') || err.message?.includes('cross-origin')) {
      throw new Error('跨域访问被阻止，请联系管理员检查后端CORS配置')
    } else {
      throw new Error(`获取扫描状态失败: ${err.message}`)
    }
  }
}

// 轮询扫描任务状态
export const pollScanTask = async (
  taskId: string,
  onProgress?: (task: ScanTask) => void,
  maxAttempts: number = 60, // 最大尝试次数（约3-5分钟）
  initialDelay: number = 1000, // 初始延迟1秒
  maxDelay: number = 4000, // 最大延迟4秒
): Promise<ScanTask> => {
  let attempts = 0
  let delay = initialDelay

  while (attempts < maxAttempts) {
    try {
      const task = await getScanTaskStatus(taskId)

      if (onProgress) {
        onProgress(task)
      }

      if (task.status === 'completed' || task.status === 'failed') {
        return task
      }

      // 根据当前状态调整轮询间隔
      if (task.status === 'scanning') {
        delay = Math.min(delay + 1000, maxDelay) // 扫描中时逐渐增加延迟
      } else {
        delay = initialDelay // pending状态保持较短延迟
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

// 计算风险等级
export const calculateOverallRiskLevel = (riskCount: ScanTask['riskCount']): string => {
  if (!riskCount) return 'safe'

  if (riskCount.high > 0) return 'high'
  if (riskCount.medium > 0) return 'medium'
  if (riskCount.low > 0) return 'low'
  if (riskCount.info > 0) return 'info'
  return 'safe'
}
