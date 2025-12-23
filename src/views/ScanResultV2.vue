<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getScanTaskStatusV2, getRiskLevelColor, getRiskLevelText, getFraudTypeText, type ScanTask } from '../api/scanServiceV2'

const route = useRoute()
const router = useRouter()

const isLoading = ref(true)
const error = ref('')
const scanResult = ref<ScanTask | null>(null)

// 加载扫描结果
const loadScanResult = async () => {
  const taskId = route.params.taskId as string
  
  if (!taskId) {
    error.value = '无效的任务ID'
    isLoading.value = false
    return
  }
  
  try {
    isLoading.value = true
    scanResult.value = await getScanTaskStatusV2(taskId)
  } catch (err: any) {
    error.value = err.message || '加载扫描结果失败'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadScanResult()
})

// 计算安全评分显示
const safetyScore = computed(() => {
  if (!scanResult.value?.riskScore) return 100
  return 100 - scanResult.value.riskScore
})

// 获取评分颜色
const scoreColor = computed(() => {
  const score = safetyScore.value
  if (score >= 80) return '#10B981'
  if (score >= 60) return '#F59E0B'
  if (score >= 40) return '#EF4444'
  return '#7C3AED'
})

// 获取评分等级文字
const scoreGrade = computed(() => {
  const score = safetyScore.value
  if (score >= 80) return '安全'
  if (score >= 60) return '一般'
  if (score >= 40) return '风险'
  return '危险'
})

const goBack = () => {
  router.push('/')
}

const downloadReport = () => {
  if (!scanResult.value) return
  
  const report = {
    url: scanResult.value.url,
    scanType: scanResult.value.scanType,
    timestamp: scanResult.value.createdAt,
    safetyScore: safetyScore.value,
    riskLevel: scanResult.value.riskLevel,
    fraudRisk: scanResult.value.fraudRisk,
    risks: scanResult.value.risks,
    summary: scanResult.value.summary
  }
  
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `security-scan-${scanResult.value.taskId}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const scanAgain = () => {
  router.push('/')
}
</script>

<template>
  <div class="scan-result-container">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载扫描结果...</p>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">❌</div>
      <h2>加载失败</h2>
      <p>{{ error }}</p>
      <button @click="goBack" class="btn-primary">返回首页</button>
    </div>

    <!-- 扫描结果 -->
    <template v-else-if="scanResult">
      <!-- 头部信息 -->
      <div class="result-header">
        <button @click="goBack" class="back-button">
          ← 返回首页
        </button>
        <div class="scan-info">
          <h1>安全扫描报告</h1>
          <div class="scan-url">{{ scanResult.url }}</div>
          <div class="scan-meta">
            <span class="scan-type">{{ scanResult.scanType === 'basic' ? '基础检测' : '深度检测' }}</span>
            <span class="scan-time">{{ new Date(scanResult.createdAt || '').toLocaleString('zh-CN') }}</span>
          </div>
        </div>
      </div>

      <!-- 总体评分 -->
      <div class="overall-score">
        <div class="score-circle" :style="{ borderColor: scoreColor }">
          <div class="score-number" :style="{ color: scoreColor }">
            {{ safetyScore }}
          </div>
          <div class="score-label">安全评分</div>
        </div>
        <div class="score-description">
          <h3 :style="{ color: scoreColor }">{{ scoreGrade }}</h3>
          <p>{{ scanResult.summary }}</p>
        </div>
      </div>

      <!-- 诈骗风险警告 -->
      <div v-if="scanResult.fraudRisk?.isFraud" class="fraud-warning">
        <div class="fraud-icon">⚠️</div>
        <div class="fraud-content">
          <h3>检测到诈骗风险</h3>
          <p class="fraud-type">类型：{{ getFraudTypeText(scanResult.fraudRisk.fraudType) }}</p>
          <p class="fraud-confidence">置信度：{{ scanResult.fraudRisk.confidence }}%</p>
          <ul v-if="scanResult.fraudRisk.reasons?.length" class="fraud-reasons">
            <li v-for="(reason, index) in scanResult.fraudRisk.reasons" :key="index">
              {{ reason }}
            </li>
          </ul>
        </div>
      </div>

      <!-- URL查询统计 -->
      <div v-if="scanResult.urlStats" class="url-stats">
        <div class="stat-item">
          <span class="stat-label">该URL被查询次数</span>
          <span class="stat-value">{{ scanResult.urlStats.totalScans }}</span>
        </div>
        <div v-if="scanResult.urlStats.lastScanAt" class="stat-item">
          <span class="stat-label">上次检测时间</span>
          <span class="stat-value">{{ new Date(scanResult.urlStats.lastScanAt).toLocaleString('zh-CN') }}</span>
        </div>
      </div>

      <!-- 风险统计 -->
      <div class="risk-summary">
        <h3>风险统计</h3>
        <div class="risk-counts">
          <div class="risk-count high">
            <span class="count">{{ scanResult.riskCount?.high || 0 }}</span>
            <span class="label">高风险</span>
          </div>
          <div class="risk-count medium">
            <span class="count">{{ scanResult.riskCount?.medium || 0 }}</span>
            <span class="label">中风险</span>
          </div>
          <div class="risk-count low">
            <span class="count">{{ scanResult.riskCount?.low || 0 }}</span>
            <span class="label">低风险</span>
          </div>
          <div class="risk-count info">
            <span class="count">{{ scanResult.riskCount?.info || 0 }}</span>
            <span class="label">信息</span>
          </div>
        </div>
      </div>

      <!-- 详细风险列表 -->
      <div class="risks-list">
        <h3>检测详情</h3>
        <div 
          v-for="risk in scanResult.risks" 
          :key="risk.id"
          :class="['risk-item', risk.level]"
        >
          <div class="risk-header">
            <span class="risk-level-badge" :style="{ backgroundColor: getRiskLevelColor(risk.level) }">
              {{ getRiskLevelText(risk.level) }}
            </span>
            <span class="risk-name">{{ risk.name }}</span>
          </div>
          <p class="risk-description">{{ risk.description }}</p>
          <div class="risk-solution">
            <strong>建议：</strong>{{ risk.solution }}
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button @click="downloadReport" class="btn-secondary">
          📄 下载报告
        </button>
        <button @click="scanAgain" class="btn-primary">
          🔍 再次检测
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
.scan-result-container {
  min-height: 100vh;
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.loading-state,
.error-state {
  text-align: center;
  padding: 4rem 2rem;
  color: white;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-state h2 {
  margin-bottom: 0.5rem;
}

.error-state p {
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 1.5rem;
}

.result-header {
  margin-bottom: 2rem;
}

.back-button {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: background 0.3s ease;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.scan-info h1 {
  color: white;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.scan-url {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  word-break: break-all;
  margin-bottom: 0.5rem;
}

.scan-meta {
  display: flex;
  gap: 1rem;
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.scan-type {
  background: rgba(102, 126, 234, 0.3);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

.overall-score {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.score-circle {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  border: 6px solid;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.score-number {
  font-size: 2.5rem;
  font-weight: 700;
}

.score-label {
  font-size: 0.8rem;
  color: #64748b;
}

.score-description h3 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.score-description p {
  color: #64748b;
  line-height: 1.6;
}

.fraud-warning {
  background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
  border: 2px solid #F59E0B;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.fraud-icon {
  font-size: 2.5rem;
}

.fraud-content h3 {
  color: #92400E;
  margin-bottom: 0.5rem;
}

.fraud-type,
.fraud-confidence {
  color: #B45309;
  margin: 0.25rem 0;
}

.fraud-reasons {
  margin-top: 0.5rem;
  padding-left: 1.5rem;
  color: #92400E;
}

.fraud-reasons li {
  margin: 0.25rem 0;
}

.url-stats {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  backdrop-filter: blur(10px);
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
}

.stat-value {
  color: white;
  font-size: 1.2rem;
  font-weight: 600;
}

.risk-summary {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.risk-summary h3 {
  color: #1a202c;
  margin-bottom: 1rem;
}

.risk-counts {
  display: flex;
  gap: 1rem;
}

.risk-count {
  flex: 1;
  text-align: center;
  padding: 1rem;
  border-radius: 12px;
}

.risk-count.high {
  background: #FEE2E2;
}

.risk-count.medium {
  background: #FEF3C7;
}

.risk-count.low {
  background: #DBEAFE;
}

.risk-count.info {
  background: #F3F4F6;
}

.risk-count .count {
  display: block;
  font-size: 2rem;
  font-weight: 700;
}

.risk-count.high .count { color: #EF4444; }
.risk-count.medium .count { color: #F59E0B; }
.risk-count.low .count { color: #3B82F6; }
.risk-count.info .count { color: #6B7280; }

.risk-count .label {
  font-size: 0.85rem;
  color: #64748b;
}

.risks-list {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.risks-list h3 {
  color: #1a202c;
  margin-bottom: 1rem;
}

.risk-item {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
}

.risk-item:last-child {
  margin-bottom: 0;
}

.risk-item.high {
  border-left: 4px solid #EF4444;
}

.risk-item.medium {
  border-left: 4px solid #F59E0B;
}

.risk-item.low {
  border-left: 4px solid #3B82F6;
}

.risk-item.safe {
  border-left: 4px solid #10B981;
}

.risk-item.info {
  border-left: 4px solid #6B7280;
}

.risk-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.risk-level-badge {
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.risk-name {
  font-weight: 600;
  color: #1a202c;
}

.risk-description {
  color: #64748b;
  margin-bottom: 0.5rem;
  line-height: 1.5;
}

.risk-solution {
  background: #f8fafc;
  padding: 0.75rem;
  border-radius: 8px;
  font-size: 0.9rem;
  color: #475569;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: white;
  color: #667eea;
}

.btn-secondary:hover {
  background: #f8fafc;
}

@media (max-width: 768px) {
  .overall-score {
    flex-direction: column;
    text-align: center;
  }
  
  .risk-counts {
    flex-wrap: wrap;
  }
  
  .risk-count {
    flex: 1 1 45%;
  }
  
  .url-stats {
    flex-direction: column;
    gap: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
  }
}
</style>
