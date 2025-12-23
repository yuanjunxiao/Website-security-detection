/**
 * Stripe 支付服务
 * 支持 Google Pay, Apple Pay, 信用卡等
 */

import axios, { AxiosError } from 'axios'
import { getAccessToken, refreshAccessToken } from './googleAuthService'

export interface StripeConfig {
  publishableKey: string | null
  isConfigured: boolean
  supportedMethods: string[]
}

export interface StripePaymentParams {
  type: 'stripe'
  clientSecret: string
  paymentIntentId: string
  amount: number
  currency: string
  publishableKey: string
  error?: boolean
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

// Stripe 实例缓存
let stripeInstance: any = null
let stripePromise: Promise<any> | null = null

/**
 * 获取 Stripe 配置
 */
export const getStripeConfig = async (): Promise<StripeConfig> => {
  try {
    const response = await axios.get<ApiResponse<StripeConfig>>(`${API_BASE_URL}/api/orders/stripe/config`)
    
    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error(response.data.message || 'Failed to get Stripe config')
    }
  } catch (error: unknown) {
    const err = error as AxiosError<ApiResponse>
    console.error('Failed to get Stripe config:', err)
    return {
      publishableKey: null,
      isConfigured: false,
      supportedMethods: []
    }
  }
}

/**
 * 加载 Stripe.js
 */
export const loadStripe = async (): Promise<any> => {
  if (stripeInstance) {
    return stripeInstance
  }

  if (stripePromise) {
    return stripePromise
  }

  stripePromise = (async () => {
    // 获取配置
    const config = await getStripeConfig()
    
    if (!config.isConfigured || !config.publishableKey) {
      console.warn('Stripe is not configured')
      return null
    }

    // 动态加载 Stripe.js
    if (!window.Stripe) {
      await new Promise<void>((resolve, reject) => {
        const script = document.createElement('script')
        script.src = 'https://js.stripe.com/v3/'
        script.async = true
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('Failed to load Stripe.js'))
        document.head.appendChild(script)
      })
    }

    // 初始化 Stripe
    stripeInstance = (window as any).Stripe(config.publishableKey)
    return stripeInstance
  })()

  return stripePromise
}

/**
 * 创建 Stripe 订单
 */
export const createStripeOrder = async (productType: string): Promise<{
  order: any
  payment: StripePaymentParams
}> => {
  try {
    const response = await apiClient.post<ApiResponse<{
      order: any
      payment: StripePaymentParams
    }>>('/create', {
      productType,
      paymentMethod: 'stripe'
    })

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error(response.data.message || 'Failed to create order')
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

/**
 * 确认 Stripe 支付状态
 */
export const confirmStripePayment = async (orderId: string, paymentIntentId: string): Promise<{
  order: any
  paymentStatus: string
}> => {
  try {
    const response = await apiClient.post<ApiResponse<{
      order: any
      paymentStatus: string
    }>>(`/${orderId}/confirm-stripe`, {
      paymentIntentId
    })

    if (response.data.status === 'success') {
      return response.data.data
    } else {
      throw new Error(response.data.message || 'Failed to confirm payment')
    }
  } catch (error: unknown) {
    const err = error as AxiosError<ApiResponse>
    throw new Error(`确认支付失败: ${err.message}`)
  }
}

/**
 * 创建 Payment Element
 */
export const createPaymentElement = async (
  clientSecret: string,
  elementContainer: HTMLElement
): Promise<{ elements: any; paymentElement: any }> => {
  const stripe = await loadStripe()
  
  if (!stripe) {
    throw new Error('Stripe is not available')
  }

  const elements = stripe.elements({
    clientSecret,
    appearance: {
      theme: 'stripe',
      variables: {
        colorPrimary: '#667eea',
        colorBackground: '#ffffff',
        colorText: '#1a202c',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        borderRadius: '8px',
      },
    },
  })

  const paymentElement = elements.create('payment', {
    layout: 'tabs',
    wallets: {
      googlePay: 'auto',
      applePay: 'auto',
    },
  })

  paymentElement.mount(elementContainer)

  return { elements, paymentElement }
}

/**
 * 提交支付
 */
export const submitPayment = async (
  elements: any,
  returnUrl: string
): Promise<{ error?: any; paymentIntent?: any }> => {
  const stripe = await loadStripe()
  
  if (!stripe) {
    throw new Error('Stripe is not available')
  }

  const { error, paymentIntent } = await stripe.confirmPayment({
    elements,
    confirmParams: {
      return_url: returnUrl,
    },
    redirect: 'if_required',
  })

  return { error, paymentIntent }
}

/**
 * 格式化金额显示
 */
export const formatAmount = (amount: number, currency: string): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  })
  return formatter.format(amount / 100)
}

// 声明全局 Stripe 类型
declare global {
  interface Window {
    Stripe?: any
  }
}
