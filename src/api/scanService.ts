import axios, { AxiosError } from 'axios'

interface ScanOptions {
  ssl: boolean
  headers: boolean
  ports: boolean
  vulnerabilities: boolean
}

interface ScanResponse {
  scanId: string
  status: string
}

const apiClient = axios.create({
  baseURL: 'http://your-api-base-url.com/api', // 待替换为实际API地址
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export const scanWebsite = async (url: string, options: ScanOptions): Promise<ScanResponse> => {
  try {
    const response = await apiClient.post('/scan', {
      targetUrl: url,
      scanOptions: options
    })
    return response.data
  } catch (error: unknown) {
    const err = error as AxiosError
    throw new Error(`扫描请求失败: ${err.message}`)
  }
}

export const getScanStatus = async (scanId: string) => {
  try {
    const response = await apiClient.get(`/scan/status/${scanId}`)
    return response.data
  } catch (error: unknown) {
    const err = error as AxiosError
    throw new Error(`获取扫描状态失败: ${err.message}`)
  }
}
