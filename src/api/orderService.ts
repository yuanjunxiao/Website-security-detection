import axios, { AxiosError } from 'axios'
import { getAccessToken, refreshAccessToken } from './googleAuthService'

export interface Product {
  id: string
  name: string
  description: string
  price: number
  scanCount: number
  scanType: 'basic' | 'deep'
}

export interface Order {
  orderId: string
  orderNo: string
  userId: string
  productType: string
  productName: string
  amount: number
  scanCount: number
  paymentMethod: 'wechat' | 'alipay' | null
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'cancelled'
  transactionId: string | null
  paidAt: string | null
  expiredAt: string | null
  createdAt: string
  updatedAt: string
}

export interface PaymentParams {
  codeUrl?: string | null
  prepayId?: string | null
  payUrl?: string | null
  message?: string
}

export interface ApiResponse<T = any> {
  status: 'success' | 'error'
  data: T
  message?: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://website-security-back-production.up.railway.app'

// 创建带认证的axios实例
const apiClient = axios.create({
  baseURL: `${API_BASE_URL}/api/orders`,
  timeout: 30000,
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

// 获取产品列表（公开接口）
export const getProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<ApiResponse<Product[]>>(`${API_BASE_URL}/api/orders/products`)

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error(response.data.message || '获取产品列表失败')
    }
  } catch (error: unknown) {
    const err = error as AxiosError<ApiResponse>
    throw new Error(`获取产品列表失败: ${err.message}`)
  }
}

// 创建订单
export const createOrder = async (
  productType: string,
  paymentMethod: 'wechat' | 'alipay'
): Promise<{ order: Order; payment: PaymentParams }> => {
  try {
    const response = await apiClient.post<ApiResponse<{ order: Order; payment: PaymentParams }>>('/create', {
      productType,
      paymentMethod,
    })

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error(response.data.message || '创建订单失败')
    }
  } catch (error: unknown) {
    const err = error as AxiosError<ApiResponse>
    
    if (err.response?.status === 401) {
      throw new Error('请先登录后再购买')
    } else if (err.response?.status === 400) {
      throw new Error(err.response.data?.message || '参数错误')
    } else {
      throw new Error(`创建订单失败: ${err.message}`)
    }
  }
}

// 获取订单详情
export const getOrder = async (orderId: string): Promise<Order> => {
  try {
    const response = await apiClient.get<ApiResponse<Order>>(`/${orderId}`)

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error(response.data.message || '获取订单详情失败')
    }
  } catch (error: unknown) {
    const err = error as AxiosError<ApiResponse>
    
    if (err.response?.status === 404) {
      throw new Error('订单不存在')
    } else {
      throw new Error(`获取订单详情失败: ${err.message}`)
    }
  }
}

// 获取用户订单列表
export const getUserOrders = async (limit = 20, offset = 0): Promise<{
  orders: Order[]
  pagination: { limit: number; offset: number; hasMore: boolean }
}> => {
  try {
    const response = await apiClient.get<ApiResponse<{
      orders: Order[]
      pagination: { limit: number; offset: number; hasMore: boolean }
    }>>('/user/list', {
      params: { limit, offset }
    })

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error(response.data.message || '获取订单列表失败')
    }
  } catch (error: unknown) {
    const err = error as AxiosError<ApiResponse>
    throw new Error(`获取订单列表失败: ${err.message}`)
  }
}

// 取消订单
export const cancelOrder = async (orderId: string): Promise<boolean> => {
  try {
    const response = await apiClient.post<ApiResponse<null>>(`/${orderId}/cancel`)

    if (response.data.status === 'success') {
      return true
    } else {
      throw new Error(response.data.message || '取消订单失败')
    }
  } catch (error: unknown) {
    const err = error as AxiosError<ApiResponse>
    
    if (err.response?.status === 400) {
      throw new Error('订单无法取消')
    } else {
      throw new Error(`取消订单失败: ${err.message}`)
    }
  }
}

// 模拟支付（仅开发环境）
export const simulatePayment = async (orderId: string): Promise<Order> => {
  try {
    const response = await apiClient.post<ApiResponse<Order>>(`/${orderId}/simulate-pay`)

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error(response.data.message || '模拟支付失败')
    }
  } catch (error: unknown) {
    const err = error as AxiosError<ApiResponse>
    
    if (err.response?.status === 403) {
      throw new Error('此功能仅在开发环境可用')
    } else {
      throw new Error(`模拟支付失败: ${err.message}`)
    }
  }
}

// 获取支付状态文本
export const getPaymentStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    pending: '待支付',
    paid: '已支付',
    failed: '支付失败',
    refunded: '已退款',
    cancelled: '已取消'
  }
  return texts[status] || '未知状态'
}

// 获取支付状态颜色
export const getPaymentStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: '#F59E0B',
    paid: '#10B981',
    failed: '#EF4444',
    refunded: '#6B7280',
    cancelled: '#6B7280'
  }
  return colors[status] || '#6B7280'
}
