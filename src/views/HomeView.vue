<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/counter'
import ScoreChart from '../components/ScoreChart.vue'

const router = useRouter()
const appStore = useAppStore()

const targetUrl = ref('')
const scanProgress = ref(0)
const scanStatus = ref('')
const urlError = ref('')
const hasScanned = ref(false)

const scanOptions = ref({
  ssl: true,
  headers: true,
  ports: false,
  vulnerabilities: true
})

// 使用store中的数据
const isScanning = computed(() => appStore.isScanning)
const recentScans = computed(() => appStore.scanHistory.slice(0, 5))

// 统计数据用于图表展示
const statsData = computed(() => [
  { label: '总扫描', score: appStore.totalScans },
  { label: '成功', score: appStore.completedScans, color: '#27ae60' },
  { label: '失败', score: appStore.failedScans, color: '#e74c3c' },
  { label: '平均分', score: appStore.averageScore, color: '#3498db' }
])

const isValidUrl = computed(() => {
  if (!targetUrl.value) return false
  try {
    const url = new URL(targetUrl.value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
})

const validateUrl = (url: string) => {
  urlError.value = ''
  if (!url) return

  try {
    const urlObj = new URL(url)
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      urlError.value = '请输入有效的HTTP或HTTPS地址'
    }
  } catch {
    urlError.value = '请输入有效的URL地址'
  }
}

const simulateScan = async () => {
  const steps = [
    '正在连接目标网站...',
    '检测SSL/TLS配置...',
    '分析HTTP安全头...',
    '扫描常见漏洞...',
    '生成检测报告...'
  ]

  for (let i = 0; i < steps.length; i++) {
    scanStatus.value = steps[i]
    scanProgress.value = ((i + 1) / steps.length) * 100
    await new Promise(resolve => setTimeout(resolve, 1000))
  }
}

const startScan = async () => {
  if (!isValidUrl.value || isScanning.value) return

  hasScanned.value = true

  try {
    // 使用store的扫描方法
    await appStore.startScan(targetUrl.value, scanOptions.value, (progress, status) => {
      scanProgress.value = progress
      scanStatus.value = status
    })

    router.push({
      name: 'ScanResult',
      params: {
        url: targetUrl.value,
        options: JSON.stringify(scanOptions.value)
      }
    })
  } catch (error) {
    console.error('扫描失败:', error)
    urlError.value = '扫描失败，请稍后重试'
  }
}

const loadScanResult = (scan: typeof recentScans.value[0]) => {
  router.push({
    name: 'ScanResult',
    params: {
      url: scan.url,
      options: JSON.stringify(scan.options)
    }
  })
}

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleString('zh-CN', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    completed: '已完成',
    failed: '失败',
    scanning: '扫描中'
  }
  return statusMap[status] || status
}

onMounted(() => {
  // Store会自动加载数据
  appStore.loadScanHistory()
})
</script>

<template>
  <div class="home-container">
    <!-- 头部标题区域 -->
    <div class="header-section">
      <h1 class="main-title">网站安全扫描器</h1>
      <p class="subtitle">快速检测网站安全漏洞，保护您的网站安全</p>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-wrapper">
      <!-- 检测输入区域 -->
      <div class="scan-section">
        <div class="input-container">
          <div class="input-group">
            <input
              v-model="targetUrl"
              type="url"
              placeholder="请输入要检测的网站URL (例如: https://example.com)"
              class="url-input"
              :disabled="isScanning"
              @keyup.enter="startScan"
              @input="validateUrl(targetUrl)"
            />
            <button
              @click="startScan"
              :disabled="!isValidUrl || isScanning"
              class="scan-button"
            >
              <span v-if="!isScanning">开始检测</span>
              <span v-else class="scanning-text">
                <i class="loading-icon"></i>
                检测中...
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
          <h3>检测选项</h3>
          <div class="options-grid">
            <label class="option-item">
              <input
                type="checkbox"
                v-model="scanOptions.ssl"
                :disabled="isScanning"
              />
              <span class="checkmark"></span>
              <span>SSL/TLS 安全检测</span>
            </label>
            <label class="option-item">
              <input
                type="checkbox"
                v-model="scanOptions.headers"
                :disabled="isScanning"
              />
              <span class="checkmark"></span>
              <span>HTTP 安全头检测</span>
            </label>
            <label class="option-item">
              <input
                type="checkbox"
                v-model="scanOptions.ports"
                :disabled="isScanning"
              />
              <span class="checkmark"></span>
              <span>端口扫描</span>
            </label>
            <label class="option-item">
              <input
                type="checkbox"
                v-model="scanOptions.vulnerabilities"
                :disabled="isScanning"
              />
              <span class="checkmark"></span>
              <span>常见漏洞检测</span>
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
        <h3>如何使用</h3>
        <div class="guide-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4>输入网站URL</h4>
              <p>在上方输入框中输入要检测的网站地址</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4>选择检测项目</h4>
              <p>根据需要选择要进行的安全检测项目</p>
            </div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4>开始检测</h4>
              <p>点击"开始检测"按钮，等待检测结果</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 统计图表 -->
      <div v-if="appStore.totalScans > 0" class="stats-section">
        <h3>扫描统计</h3>
        <div class="stats-grid">
          <div class="chart-container">
            <ScoreChart
              :data="statsData"
              type="bar"
              title="扫描概览"
            />
          </div>
        </div>
      </div>

      <!-- 最近检测记录 -->
      <div v-if="recentScans.length > 0" class="recent-scans">
        <h3>最近检测</h3>
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
  </div>
</template>

<style scoped>
/* 主容器 */
.home-container {
  width: 100%;
  min-height: 100vh;
  padding: 0;
  position: relative;
  z-index: 1;
}

/* 头部区域 */
.header-section {
  text-align: center;
  padding: 6rem 2rem 4rem;
  margin-bottom: 0;
}

.main-title {
  font-size: 4.5rem;
  font-weight: 900;
  color: white;
  margin-bottom: 1.5rem;
  letter-spacing: -0.03em;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  line-height: 1.1;
}

.subtitle {
  font-size: 1.4rem;
  color: rgba(255, 255, 255, 0.95);
  margin: 0 auto;
  font-weight: 300;
  max-width: 700px;
  line-height: 1.7;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

/* 内容包装器 */
.content-wrapper {
  width: 100%;
  max-width: none;
  padding: 0 4rem;
}

/* 扫描区域 */
.scan-section {
  background: white;
  border-radius: 24px;
  padding: 4rem;
  box-shadow:
    0 32px 64px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  margin: 0 auto 4rem;
  max-width: 1200px;
  position: relative;
  overflow: hidden;
}

.scan-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
}

.input-container {
  margin-bottom: 3rem;
}

.input-group {
  display: flex;
  gap: 1.5rem;
  margin-bottom: 1rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.url-input {
  flex: 1;
  padding: 1.5rem 2rem;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  font-size: 1.2rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #f8fafc;
  color: #1a202c;
  font-weight: 500;
}

.url-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow:
    0 0 0 4px rgba(102, 126, 234, 0.1),
    0 8px 25px rgba(102, 126, 234, 0.15);
  background: white;
  transform: translateY(-2px);
}

.url-input:disabled {
  background-color: #f1f5f9;
  cursor: not-allowed;
  opacity: 0.6;
}

.scan-button {
  padding: 1.25rem 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 160px;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.02em;
}

.scan-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.scan-button:hover:not(:disabled)::before {
  opacity: 1;
}

.scan-button:hover:not(:disabled) {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.4);
}

.scan-button:active:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
}

.scan-button:disabled {
  background: linear-gradient(135deg, #e2e8f0, #cbd5e0);
  cursor: not-allowed;
  transform: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  opacity: 0.7;
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
  to { transform: rotate(360deg); }
}

.error-message {
  color: #e53e3e;
  font-size: 1rem;
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
}

/* 检测选项 */
.scan-options h3 {
  margin-bottom: 2rem;
  color: #1a202c;
  font-size: 1.5rem;
  font-weight: 700;
  text-align: center;
}

.options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.option-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 1.5rem 2rem;
  border-radius: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  font-weight: 600;
  font-size: 1.1rem;
  color: #4a5568;
}

.option-item:hover {
  background: #edf2f7;
  border-color: #667eea;
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.option-item input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 28px;
  height: 28px;
  border: 3px solid #cbd5e0;
  border-radius: 10px;
  margin-right: 1.5rem;
  position: relative;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  flex-shrink: 0;
}

.option-item input[type="checkbox"]:checked + .checkmark {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  box-shadow:
    0 8px 20px rgba(102, 126, 234, 0.4),
    0 0 0 4px rgba(102, 126, 234, 0.1);
  transform: scale(1.05);
}

.option-item input[type="checkbox"]:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 8px;
  top: 4px;
  width: 7px;
  height: 12px;
  border: solid white;
  border-width: 0 3px 3px 0;
  transform: rotate(45deg);
  animation: checkmark 0.3s ease-in-out;
}

.option-item input[type="checkbox"]:checked + .checkmark + span {
  color: #667eea;
}

@keyframes checkmark {
  0% {
    opacity: 0;
    transform: rotate(45deg) scale(0);
  }
  50% {
    opacity: 1;
    transform: rotate(45deg) scale(1.2);
  }
  100% {
    opacity: 1;
    transform: rotate(45deg) scale(1);
  }
}

/* 进度区域 */
.progress-section {
  background: white;
  border-radius: 24px;
  padding: 4rem;
  box-shadow:
    0 32px 64px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  margin: 0 auto 4rem;
  max-width: 1200px;
  position: relative;
  overflow: hidden;
}

.progress-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #f093fb 0%, #f5576c 100%);
}

.progress-container {
  text-align: center;
}

.progress-bar {
  width: 100%;
  height: 16px;
  background-color: #f1f5f9;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.5s ease;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
  border-radius: 12px;
}

.progress-text {
  color: #1a202c;
  font-size: 1.2rem;
  font-weight: 600;
}

/* 指南区域 */
.guide-section {
  background: white;
  border-radius: 24px;
  padding: 4rem;
  box-shadow:
    0 32px 64px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  margin: 0 auto 4rem;
  max-width: 1200px;
  position: relative;
  overflow: hidden;
}

.guide-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
}

.guide-section h3 {
  margin-bottom: 3rem;
  color: #1a202c;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}

.guide-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 20px;
  border: 2px solid #e2e8f0;
  transition: all 0.3s ease;
}

.step:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.step-number {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 12px 24px rgba(102, 126, 234, 0.4);
}

.step-content h4 {
  margin: 0 0 1rem 0;
  color: #1a202c;
  font-size: 1.3rem;
  font-weight: 700;
}

.step-content p {
  margin: 0;
  color: #4a5568;
  line-height: 1.6;
  font-size: 1rem;
}

/* 统计区域 */
.stats-section {
  background: white;
  border-radius: 24px;
  padding: 4rem;
  box-shadow:
    0 32px 64px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  margin: 0 auto 4rem;
  max-width: 1200px;
  position: relative;
  overflow: hidden;
}

.stats-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #43e97b 0%, #38f9d7 100%);
}

.stats-section h3 {
  margin-bottom: 2rem;
  color: #1a202c;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

.chart-container {
  min-height: 300px;
  background: #f8fafc;
  border-radius: 16px;
  padding: 2rem;
  border: 2px solid #e2e8f0;
}

/* 历史记录区域 */
.recent-scans {
  background: white;
  border-radius: 24px;
  padding: 4rem;
  box-shadow:
    0 32px 64px rgba(0, 0, 0, 0.12),
    0 0 0 1px rgba(255, 255, 255, 0.05);
  margin-bottom: 4rem;
  position: relative;
  overflow: hidden;
}

.recent-scans::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #fa709a 0%, #fee140 100%);
}

.recent-scans h3 {
  margin-bottom: 2rem;
  color: #1a202c;
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
}

.scan-history {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.history-item {
  display: flex;
  align-items: center;
  padding: 2rem;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.history-item:hover {
  background: white;
  border-color: #667eea;
  transform: translateY(-3px);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.15);
}

.history-url {
  flex: 1;
  font-weight: 700;
  color: #1a202c;
  font-size: 1.1rem;
}

.history-time {
  color: #4a5568;
  font-size: 1rem;
  margin-right: 2rem;
  font-weight: 600;
}

.history-status {
  padding: 0.75rem 1.5rem;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.history-status.completed {
  background: linear-gradient(135deg, #48bb78, #38a169);
  color: white;
  box-shadow: 0 6px 15px rgba(72, 187, 120, 0.4);
}

.history-status.failed {
  background: linear-gradient(135deg, #f56565, #e53e3e);
  color: white;
  box-shadow: 0 6px 15px rgba(245, 101, 101, 0.4);
}

.history-status.scanning {
  background: linear-gradient(135deg, #4299e1, #3182ce);
  color: white;
  box-shadow: 0 6px 15px rgba(66, 153, 225, 0.4);
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-title {
    font-size: 3.5rem;
  }

  .scan-section,
  .progress-section,
  .guide-section,
  .stats-section,
  .recent-scans {
    padding: 3rem;
  }
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 0 1rem;
  }

  .main-title {
    font-size: 2.5rem;
  }

  .subtitle {
    font-size: 1.1rem;
  }

  .scan-section,
  .progress-section,
  .guide-section,
  .stats-section,
  .recent-scans {
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .input-group {
    flex-direction: column;
    gap: 1rem;
  }

  .scan-button {
    width: 100%;
    padding: 1rem;
  }

  .options-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .guide-steps {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .step {
    padding: 1.5rem;
  }

  .step-number {
    width: 48px;
    height: 48px;
    font-size: 1.2rem;
  }

  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    padding: 1.5rem;
  }

  .history-time {
    margin-right: 0;
  }

  .history-status {
    align-self: flex-start;
  }
}

@media (max-width: 480px) {
  .main-title {
    font-size: 2rem;
  }

  .scan-section,
  .progress-section,
  .guide-section,
  .stats-section,
  .recent-scans {
    padding: 1.5rem;
  }

  .url-input {
    font-size: 1rem;
    padding: 1rem;
  }

  .scan-button {
    font-size: 1rem;
    padding: 1rem;
  }
}
</style>
