import { defineStore } from 'pinia'
import { ref } from 'vue'

interface ScanResult {
  url: string
  options: {
    ssl: boolean
    headers: boolean
    ports: boolean
    vulnerabilities: boolean
  }
  scanId: string
}

export const useScanStore = defineStore('scan', () => {
  const scanResult = ref<ScanResult | null>(null)

  const setScanResult = (result: ScanResult) => {
    scanResult.value = result
  }

  return {
    scanResult,
    setScanResult
  }
})
