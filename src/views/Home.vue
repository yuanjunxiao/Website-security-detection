<template>
  <div class="home-container">
    <!-- 头部标题区域 -->
    <div class="header-section">
      <h1 class="main-title">{{ t('app.title') }}</h1>
      <p class="subtitle">{{ t('app.subtitle') }}</p>
    </div>

    <!-- 检测输入区域 -->
    <div class="scan-section">
      <div class="input-container">
        <div class="input-group">
          <input
            v-model="targetUrl"
            type="url"
            :placeholder="t('home.inputPlaceholder')"
            class="url-input"
            :disabled="isScanning"
            @keyup.enter="startScan"
          />
          <button @click="startScan" :disabled="!isValidUrl || isScanning" class="scan-button">
            <span v-if="!isScanning">{{ t('app.startScan') }}</span>
            <span v-else class="scanning-text">
              <i class="loading-icon"></i>
              {{ t('app.scanning') }}
            </span>
          </button>
        </div>

        <!-- URL验证提示 -->
        <div v-if="urlError" class="error-message">
          {{ urlError }}
        </div>
      </div>

      <!-- 检测选项 -->
      <div class="scan-options">
        <h3>{{ t('home.scanOptions') }}</h3>
        <div class="options-grid">
          <label class="option-item">
            <input type="checkbox" v-model="scanOptions.ssl" :disabled="isScanning" />
            <span class="checkmark"></span>
            {{ t('home.sslCheck') }}
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="scanOptions.headers" :disabled="isScanning" />
            <span class="checkmark"></span>
            {{ t('home.headersCheck') }}
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="scanOptions.ports" :disabled="isScanning" />
            <span class="checkmark"></span>
            {{ t('home.portsCheck') }}
          </label>
          <label class="option-item">
            <input type="checkbox" v-model="scanOptions.vulnerabilities" :disabled="isScanning" />
            <span class="checkmark"></span>
            {{ t('home.vulnerabilitiesCheck') }}
          </label>
        </div>
      </div>
    </div>

    <!-- 扫描进度 -->
    <div v-if="isScanning" class="progress-section">
      <div class="progress-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: scanProgress + '%' }"></div>
        </div>
        <div class="progress-text">{{ scanStatus }}</div>
      </div>
    </div>

    <!-- 快速开始指南 -->
    <div v-if="!hasScanned && !isScanning" class="guide-section">
      <h3>{{ t('home.howToUse') }}</h3>
      <div class="guide-steps">
        <div class="step">
          <div class="step-number">1</div>
          <div class="step-content">
            <h4>{{ t('home.step1') }}</h4>
            <p>{{ t('home.step1Desc') }}</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">2</div>
          <div class="step-content">
            <h4>{{ t('home.step2') }}</h4>
            <p>{{ t('home.step2Desc') }}</p>
          </div>
        </div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-content">
            <h4>{{ t('home.step3') }}</h4>
            <p>{{ t('home.step3Desc') }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近检测记录 -->
    <div v-if="recentScans.length > 0" class="recent-scans">
      <h3>{{ t('home.recentScans') }}</h3>
      <div class="scan-history">
        <div
          v-for="scan in recentScans"
          :key="scan.id"
          class="history-item"
          @click="loadScanResult(scan)"
        >
          <div class="history-url">{{ scan.url }}</div>
          <div class="history-time">{{ formatTime(scan.timestamp) }}</div>
          <div class="history-status" :class="scan.status">
            {{ getStatusText(scan.status) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useI18n } from 'vue-i18n'
import type { RouteParamValueRaw } from 'vue-router'

interface ScanRecord {
  id: number
  url: string
  timestamp: Date
  status: 'completed' | 'failed' | 'scanning'
  options: {
    ssl: boolean
    headers: boolean
    ports: boolean
    vulnerabilities: boolean
  }
}

export default {
  name: 'HomePage',
  setup() {
    const { t } = useI18n()
    return { t }
  },
  data() {
    return {
      targetUrl: '',
      isScanning: false,
      scanProgress: 0,
      scanStatus: '',
      urlError: '',
      hasScanned: false,
      scanOptions: {
        ssl: true,
        headers: true,
        ports: false,
        vulnerabilities: true,
      },
      recentScans: [] as ScanRecord[],
    }
  },
  computed: {
    isValidUrl() {
      if (!this.targetUrl) return false
      try {
        const url = new URL(this.targetUrl)
        return url.protocol === 'http:' || url.protocol === 'https:'
      } catch {
        return false
      }
    },
  },
  watch: {
    targetUrl(newVal) {
      this.validateUrl(newVal)
    },
  },
  mounted() {
    this.loadRecentScans()
  },
  methods: {
    validateUrl(url: string) {
      this.urlError = ''
      if (!url) return

      try {
        const urlObj = new URL(url)
        if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
          this.urlError = this.t('errors.invalidUrl')
        }
      } catch {
        this.urlError = this.t('errors.invalidUrl')
      }
    },

    async startScan() {
      if (!this.isValidUrl || this.isScanning) return

      this.isScanning = true
      this.scanProgress = 0
      this.hasScanned = true

      try {
        // 模拟扫描过程
        await this.simulateScan()

        // 保存扫描记录
        this.saveScanRecord()

        // 跳转到结果页面
        this.$router.push({
          name: 'ScanResult',
          params: {
            url: this.targetUrl,
            options: JSON.stringify(this.scanOptions),
          },
        })
      } catch (error) {
        console.error('扫描失败:', error)
        this.urlError = this.t('errors.scanFailed')
      } finally {
        this.isScanning = false
      }
    },

    async simulateScan() {
      // 扫描状态消息可以根据需要添加国际化
      const steps = [
        this.t('app.scanning'),
        this.t('app.scanning'),
        this.t('app.scanning'),
        this.t('app.scanning'),
        this.t('app.scanning'),
      ]

      for (let i = 0; i < steps.length; i++) {
        this.scanStatus = steps[i]
        this.scanProgress = ((i + 1) / steps.length) * 100
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    },

    saveScanRecord() {
      const scan = {
        id: Date.now(),
        url: this.targetUrl,
        timestamp: new Date(),
        status: 'completed' as const,
        options: { ...this.scanOptions },
      }

      this.recentScans.unshift(scan as ScanRecord)
      if (this.recentScans.length > 5) {
        this.recentScans.pop()
      }

      // 保存到本地存储
      localStorage.setItem('recentScans', JSON.stringify(this.recentScans))
    },

    loadRecentScans() {
      const saved = localStorage.getItem('recentScans')
      if (saved) {
        this.recentScans = JSON.parse(saved).map((scan: any) => ({
          ...scan,
          timestamp: new Date(scan.timestamp),
        }))
      }
    },

    loadScanResult(scan: ScanRecord) {
      this.$router.push({
        name: 'ScanResult',
        params: {
          url: scan.url,
          options: JSON.stringify(scan.options),
        },
      })
    },

    formatTime(timestamp: Date) {
      return timestamp.toLocaleString('zh-CN', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    getStatusText(status: 'completed' | 'failed' | 'scanning') {
      const statusMap = {
        completed: '已完成',
        failed: '失败',
        scanning: '扫描中',
      }
      return statusMap[status] || status
    },
  },
}
</script>

<style scoped>
.home-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.main-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.1rem;
  color: #7f8c8d;
  margin: 0;
}

.scan-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.input-container {
  margin-bottom: 2rem;
}

.input-group {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.url-input {
  flex: 1;
  padding: 1rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.url-input:focus {
  outline: none;
  border-color: #3498db;
}

.url-input:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
}

.scan-button {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.scan-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.scan-button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
}

.scanning-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.loading-icon {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.scan-options h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.option-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: background-color 0.2s ease;
}

.option-item:hover {
  background-color: #f8f9fa;
}

.option-item input[type='checkbox'] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  margin-right: 0.5rem;
  position: relative;
  transition: all 0.3s ease;
}

.option-item input[type='checkbox']:checked + .checkmark {
  background-color: #3498db;
  border-color: #3498db;
}

.option-item input[type='checkbox']:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.progress-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.progress-container {
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: #ecf0f1;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 1rem;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3498db, #2980b9);
  transition: width 0.3s ease;
}

.progress-text {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.guide-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.guide-section h3 {
  margin-bottom: 1.5rem;
  color: #2c3e50;
}

.guide-steps {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.step {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.step-number {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.step-content h4 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.step-content p {
  margin: 0;
  color: #7f8c8d;
  line-height: 1.5;
}

.recent-scans {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.recent-scans h3 {
  margin-bottom: 1rem;
  color: #2c3e50;
}

.scan-history {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.history-item:hover {
  background-color: #f8f9fa;
  border-color: #3498db;
}

.history-url {
  flex: 1;
  font-weight: 500;
  color: #2c3e50;
}

.history-time {
  color: #7f8c8d;
  font-size: 0.9rem;
  margin-right: 1rem;
}

.history-status {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.history-status.completed {
  background-color: #d4edda;
  color: #155724;
}

.history-status.failed {
  background-color: #f8d7da;
  color: #721c24;
}

.history-status.scanning {
  background-color: #d1ecf1;
  color: #0c5460;
}

@media (max-width: 768px) {
  .home-container {
    padding: 1rem;
  }

  .input-group {
    flex-direction: column;
  }

  .options-grid {
    grid-template-columns: 1fr;
  }

  .guide-steps {
    gap: 1rem;
  }

  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .history-time {
    margin-right: 0;
  }
}
</style>
