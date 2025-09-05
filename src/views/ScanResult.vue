<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const scanUrl = ref('')
const scanOptions = ref({})
const scanResults = ref({
  ssl: {
    score: 85,
    status: 'good',
    issues: [
      { type: 'warning', message: 'SSL证书将在30天内过期' },
      { type: 'info', message: '支持TLS 1.3协议' }
    ]
  },
  headers: {
    score: 70,
    status: 'warning',
    issues: [
      { type: 'error', message: '缺少Content-Security-Policy头' },
      { type: 'warning', message: 'X-Frame-Options设置不够严格' },
      { type: 'success', message: '已设置Strict-Transport-Security' }
    ]
  },
  vulnerabilities: {
    score: 90,
    status: 'good',
    issues: [
      { type: 'success', message: '未发现SQL注入漏洞' },
      { type: 'success', message: '未发现XSS漏洞' },
      { type: 'info', message: '服务器版本信息已隐藏' }
    ]
  },
  ports: {
    score: 95,
    status: 'excellent',
    issues: [
      { type: 'success', message: '仅开放必要端口' },
      { type: 'success', message: '未发现危险端口开放' }
    ]
  }
})

const overallScore = ref(0)

const getScoreColor = (score: number) => {
  if (score >= 90) return '#27ae60'
  if (score >= 70) return '#f39c12'
  if (score >= 50) return '#e67e22'
  return '#e74c3c'
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    excellent: '优秀',
    good: '良好',
    warning: '警告',
    danger: '危险'
  }
  return statusMap[status] || status
}

const getIssueIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    success: '✓',
    warning: '⚠',
    error: '✗',
    info: 'ℹ'
  }
  return iconMap[type] || '•'
}

const calculateOverallScore = () => {
  const scores = Object.values(scanResults.value).map(result => result.score)
  overallScore.value = Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length)
}

const goBack = () => {
  router.push('/')
}

const downloadReport = () => {
  const report = {
    url: scanUrl.value,
    timestamp: new Date().toISOString(),
    overallScore: overallScore.value,
    results: scanResults.value
  }
  
  const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `security-scan-${new Date().getTime()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

onMounted(() => {
  scanUrl.value = route.params.url as string || ''
  if (route.params.options) {
    try {
      scanOptions.value = JSON.parse(route.params.options as string)
    } catch (e) {
      console.error('解析扫描选项失败:', e)
    }
  }
  calculateOverallScore()
})
</script>

<template>
  <div class="scan-result-container">
    <!-- 头部信息 -->
    <div class="result-header">
      <button @click="goBack" class="back-button">
        ← 返回首页
      </button>
      <div class="scan-info">
        <h1>安全扫描报告</h1>
        <div class="scan-url">{{ scanUrl }}</div>
        <div class="scan-time">扫描时间: {{ new Date().toLocaleString('zh-CN') }}</div>
      </div>
    </div>

    <!-- 总体评分 -->
    <div class="overall-score">
      <div class="score-circle" :style="{ borderColor: getScoreColor(overallScore) }">
        <div class="score-number" :style="{ color: getScoreColor(overallScore) }">
          {{ overallScore }}
        </div>
        <div class="score-label">总体评分</div>
      </div>
      <div class="score-description">
        <h3>安全状况: {{ getStatusText(overallScore >= 90 ? 'excellent' : overallScore >= 70 ? 'good' : overallScore >= 50 ? 'warning' : 'danger') }}</h3>
        <p>您的网站安全性处于{{ overallScore >= 70 ? '良好' : '需要改进的' }}水平，建议关注以下检测结果。</p>
      </div>
    </div>

    <!-- 详细结果 -->
    <div class="detailed-results">
      <div class="result-section" v-for="(result, key) in scanResults" :key="key">
        <div class="section-header">
          <div class="section-title">
            <span class="section-icon">🔒</span>
            <h3>{{ key === 'ssl' ? 'SSL/TLS 安全' : key === 'headers' ? 'HTTP 安全头' : key === 'vulnerabilities' ? '漏洞检测' : '端口扫描' }}</h3>
          </div>
          <div class="section-score" :style="{ color: getScoreColor(result.score) }">
            {{ result.score }}/100
          </div>
        </div>
        
        <div class="section-content">
          <div class="status-badge" :class="result.status">
            {{ getStatusText(result.status) }}
          </div>
          
          <div class="issues-list">
            <div 
              v-for="(issue, index) in result.issues" 
              :key="index"
              class="issue-item"
              :class="issue.type"
            >
              <span class="issue-icon">{{ getIssueIcon(issue.type) }}</span>
              <span class="issue-message">{{ issue.message }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 建议和操作 -->
    <div class="recommendations">
      <h3>安全建议</h3>
      <div class="recommendation-list">
        <div class="recommendation-item">
          <h4>🔐 加强SSL/TLS配置</h4>
          <p>建议更新SSL证书，启用HSTS，禁用不安全的协议版本。</p>
        </div>
        <div class="recommendation-item">
          <h4>🛡️ 完善安全头设置</h4>
          <p>添加Content-Security-Policy、X-Frame-Options等安全头。</p>
        </div>
        <div class="recommendation-item">
          <h4>🔍 定期安全检测</h4>
          <p>建议每月进行一次全面的安全扫描，及时发现潜在风险。</p>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <button @click="downloadReport" class="download-button">
        📄 下载报告
      </button>
      <button @click="goBack" class="rescan-button">
        🔄 重新扫描
      </button>
    </div>
  </div>
</template>

<style scoped>
.scan-result-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}

.result-header {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 3rem;
}

.back-button {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
}

.scan-info {
  flex: 1;
}

.scan-info h1 {
  color: white;
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.scan-url {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin-bottom: 0.5rem;
  word-break: break-all;
}

.scan-time {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
}

.overall-score {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 2rem;
}

.score-circle {
  width: 120px;
  height: 120px;
  border: 8px solid;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.score-number {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
}

.score-label {
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-top: 0.25rem;
}

.score-description {
  flex: 1;
}

.score-description h3 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.score-description p {
  margin: 0;
  color: #7f8c8d;
  line-height: 1.6;
}

.detailed-results {
  display: grid;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.result-section {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-icon {
  font-size: 1.5rem;
}

.section-title h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.25rem;
}

.section-score {
  font-size: 1.25rem;
  font-weight: 700;
}

.section-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.status-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  width: fit-content;
}

.status-badge.excellent {
  background: #d4edda;
  color: #155724;
}

.status-badge.good {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.warning {
  background: #fff3cd;
  color: #856404;
}

.status-badge.danger {
  background: #f8d7da;
  color: #721c24;
}

.issues-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.issue-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  border-left: 4px solid;
}

.issue-item.success {
  background: #f8fff9;
  border-color: #27ae60;
}

.issue-item.warning {
  background: #fffbf0;
  border-color: #f39c12;
}

.issue-item.error {
  background: #fef5f5;
  border-color: #e74c3c;
}

.issue-item.info {
  background: #f0f8ff;
  border-color: #3498db;
}

.issue-icon {
  font-weight: bold;
  font-size: 1.1rem;
}

.issue-item.success .issue-icon {
  color: #27ae60;
}

.issue-item.warning .issue-icon {
  color: #f39c12;
}

.issue-item.error .issue-icon {
  color: #e74c3c;
}

.issue-item.info .issue-icon {
  color: #3498db;
}

.issue-message {
  flex: 1;
  color: #2c3e50;
  line-height: 1.4;
}

.recommendations {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.recommendations h3 {
  margin: 0 0 1.5rem 0;
  color: #2c3e50;
  font-size: 1.5rem;
}

.recommendation-list {
  display: grid;
  gap: 1.5rem;
}

.recommendation-item {
  padding: 1.5rem;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.recommendation-item:hover {
  border-color: #3498db;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.1);
}

.recommendation-item h4 {
  margin: 0 0 0.75rem 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.recommendation-item p {
  margin: 0;
  color: #7f8c8d;
  line-height: 1.5;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.download-button,
.rescan-button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.download-button {
  background: linear-gradient(135deg, #27ae60, #2ecc71);
  color: white;
}

.download-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.3);
}

.rescan-button {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.rescan-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

@media (max-width: 768px) {
  .scan-result-container {
    padding: 1rem;
  }
  
  .result-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .overall-score {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .scan-info h1 {
    font-size: 2rem;
  }
}
</style>