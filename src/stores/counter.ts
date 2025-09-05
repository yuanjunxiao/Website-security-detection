import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

interface ScanRecord {
  id: number
  url: string
  timestamp: Date
  status: 'completed' | 'failed' | 'scanning'
  overallScore: number
  options: {
    ssl: boolean
    headers: boolean
    ports: boolean
    vulnerabilities: boolean
  }
  duration: number
  results?: any
}

interface AppSettings {
  defaultScanOptions: {
    ssl: boolean
    headers: boolean
    ports: boolean
    vulnerabilities: boolean
  }
  notifications: {
    emailAlerts: boolean
    browserNotifications: boolean
    scanComplete: boolean
    weeklyReport: boolean
  }
  advanced: {
    maxConcurrentScans: number
    scanTimeout: number
    retryAttempts: number
    saveHistory: boolean
  }
  appearance: {
    theme: 'light' | 'dark' | 'auto'
    language: 'zh-CN' | 'en-US'
  }
}

export const useAppStore = defineStore('app', () => {
  // 扫描历史
  const scanHistory = ref<ScanRecord[]>([])
  const currentScan = ref<ScanRecord | null>(null)
  const isScanning = ref(false)

  // 应用设置
  const settings = ref<AppSettings>({
    defaultScanOptions: {
      ssl: true,
      headers: true,
      ports: false,
      vulnerabilities: true
    },
    notifications: {
      emailAlerts: false,
      browserNotifications: true,
      scanComplete: true,
      weeklyReport: false
    },
    advanced: {
      maxConcurrentScans: 3,
      scanTimeout: 300,
      retryAttempts: 2,
      saveHistory: true
    },
    appearance: {
      theme: 'auto',
      language: 'zh-CN'
    }
  })

  // 统计数据
  const totalScans = computed(() => scanHistory.value.length)
  const completedScans = computed(() =>
    scanHistory.value.filter(scan => scan.status === 'completed').length
  )
  const failedScans = computed(() =>
    scanHistory.value.filter(scan => scan.status === 'failed').length
  )
  const averageScore = computed(() => {
    const completed = scanHistory.value.filter(scan => scan.status === 'completed')
    if (completed.length === 0) return 0
    return Math.round(completed.reduce((sum, scan) => sum + scan.overallScore, 0) / completed.length)
  })

  // 加载数据
  const loadData = () => {
    // 加载扫描历史
    const savedHistory = localStorage.getItem('scanHistory')
    if (savedHistory) {
      try {
        scanHistory.value = JSON.parse(savedHistory).map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp)
        }))
      } catch (error) {
        console.error('加载扫描历史失败:', error)
      }
    }

    // 加载设置
    const savedSettings = localStorage.getItem('appSettings')
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings)
        settings.value = { ...settings.value, ...parsedSettings }
      } catch (error) {
        console.error('加载设置失败:', error)
      }
    }
  }

  // 保存数据
  const saveData = () => {
    if (settings.value.advanced.saveHistory) {
      localStorage.setItem('scanHistory', JSON.stringify(scanHistory.value))
    }
    localStorage.setItem('appSettings', JSON.stringify(settings.value))
  }

  // 添加扫描记录
  const addScanRecord = (scan: ScanRecord) => {
    scanHistory.value.unshift(scan)
    if (scanHistory.value.length > 100) {
      scanHistory.value = scanHistory.value.slice(0, 100)
    }
    saveData()
  }

  // 删除扫描记录
  const deleteScanRecord = (id: number) => {
    scanHistory.value = scanHistory.value.filter(scan => scan.id !== id)
    saveData()
  }

  // 清空扫描历史
  const clearScanHistory = () => {
    scanHistory.value = []
    saveData()
  }

  // 更新设置
  const updateSettings = (newSettings: Partial<AppSettings>) => {
    settings.value = { ...settings.value, ...newSettings }
    saveData()
  }

  // 开始扫描
  const startScan = (url: string, options: any) => {
    const scan: ScanRecord = {
      id: Date.now(),
      url,
      timestamp: new Date(),
      status: 'scanning',
      overallScore: 0,
      options,
      duration: 0
    }
    currentScan.value = scan
    isScanning.value = true
    return scan
  }

  // 完成扫描
  const completeScan = (scanId: number, results: any, score: number, duration: number) => {
    if (currentScan.value && currentScan.value.id === scanId) {
      currentScan.value.status = 'completed'
      currentScan.value.overallScore = score
      currentScan.value.duration = duration
      currentScan.value.results = results

      addScanRecord(currentScan.value)
      currentScan.value = null
      isScanning.value = false
    }
  }

  // 扫描失败
  const failScan = (scanId: number, duration: number) => {
    if (currentScan.value && currentScan.value.id === scanId) {
      currentScan.value.status = 'failed'
      currentScan.value.duration = duration

      addScanRecord(currentScan.value)
      currentScan.value = null
      isScanning.value = false
    }
  }

  return {
    // 状态
    scanHistory,
    currentScan,
    isScanning,
    settings,

    // 计算属性
    totalScans,
    completedScans,
    failedScans,
    averageScore,

    // 方法
    loadData,
    saveData,
    addScanRecord,
    deleteScanRecord,
    clearScanHistory,
    updateSettings,
    startScan,
    completeScan,
    failScan
  }
})
