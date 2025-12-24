/**
 * Google Analytics 工具模块
 * 用于追踪页面浏览和自定义事件
 */

// GA Measurement ID
const GA_MEASUREMENT_ID = 'G-QRVYWNEDQ9'

// 声明 gtag 函数类型
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

/**
 * 追踪页面浏览
 * @param path - 页面路径
 * @param title - 页面标题
 */
export function trackPageView(path: string, title?: string) {
  if (typeof window.gtag !== 'function') return
  
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title || document.title
  })
}

/**
 * 追踪自定义事件
 * @param eventName - 事件名称
 * @param params - 事件参数
 */
export function trackEvent(
  eventName: string,
  params?: {
    event_category?: string
    event_label?: string
    value?: number
    [key: string]: any
  }
) {
  if (typeof window.gtag !== 'function') return
  
  window.gtag('event', eventName, params)
}

/**
 * 追踪用户登录
 * @param method - 登录方式
 */
export function trackLogin(method: string) {
  trackEvent('login', {
    method: method
  })
}

/**
 * 追踪用户注册
 * @param method - 注册方式
 */
export function trackSignUp(method: string) {
  trackEvent('sign_up', {
    method: method
  })
}

/**
 * 追踪扫描开始
 * @param scanType - 扫描类型 (basic/deep)
 * @param url - 扫描的URL
 */
export function trackScanStart(scanType: string, url: string) {
  trackEvent('scan_start', {
    event_category: 'scan',
    event_label: scanType,
    scan_type: scanType,
    target_url: url
  })
}

/**
 * 追踪扫描完成
 * @param scanType - 扫描类型
 * @param riskLevel - 风险等级
 * @param duration - 扫描耗时(秒)
 */
export function trackScanComplete(scanType: string, riskLevel: string, duration?: number) {
  trackEvent('scan_complete', {
    event_category: 'scan',
    event_label: `${scanType}_${riskLevel}`,
    scan_type: scanType,
    risk_level: riskLevel,
    value: duration
  })
}

/**
 * 追踪购买开始
 * @param productId - 产品ID
 * @param price - 价格
 */
export function trackBeginCheckout(productId: string, price: number) {
  trackEvent('begin_checkout', {
    event_category: 'ecommerce',
    event_label: productId,
    value: price,
    currency: 'USD',
    items: [{
      item_id: productId,
      price: price
    }]
  })
}

/**
 * 追踪购买完成
 * @param orderId - 订单ID
 * @param productId - 产品ID
 * @param price - 价格
 */
export function trackPurchase(orderId: string, productId: string, price: number) {
  trackEvent('purchase', {
    event_category: 'ecommerce',
    event_label: productId,
    transaction_id: orderId,
    value: price,
    currency: 'USD',
    items: [{
      item_id: productId,
      price: price
    }]
  })
}

/**
 * 追踪错误
 * @param errorMessage - 错误信息
 * @param errorType - 错误类型
 */
export function trackError(errorMessage: string, errorType?: string) {
  trackEvent('exception', {
    description: errorMessage,
    fatal: false,
    error_type: errorType
  })
}
