<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/counter'

const router = useRouter()
const appStore = useAppStore()

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
}

// 使用store中的数据
const scanHistory = computed(() => appStore.scanHistory)
const selectedItems = ref<number[]>([])
const searchQuery = ref('')
const sortBy = ref<'timestamp' | 'score' | 'url'>('timestamp')
const sortOrder = ref<'asc' | 'desc'>('desc')
const filterStatus = ref<'all' | 'completed' | 'failed'>('all')

const filteredHistory = computed(() => {
  let filtered = scanHistory.value

  // 搜索过滤
  if (searchQuery.value) {
    filtered = filtered.filter(item =>
      item.url.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // 状态过滤
  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(item => item.status === filterStatus.value)
  }

  // 排序
  filtered.sort((a, b) => {
    let aValue: any, bValue: any

    switch (sortBy.value) {
      case 'timestamp':
        aValue = a.timestamp.getTime()
        bValue = b.timestamp.getTime()
        break
      case 'score':
        aValue = a.overallScore
        bValue = b.overallScore
        break
      case 'url':
        aValue = a.url.toLowerCase()
        bValue = b.url.toLowerCase()
        break
    }

    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return filtered
})



const viewScanResult = (scan: ScanRecord) => {
  router.push({
    name: 'ScanResult',
    params: {
      url: scan.url,
      options: JSON.stringify(scan.options)
    }
  })
}

const deleteScan = (id: number) => {
  if (confirm('确定要删除这条扫描记录吗？')) {
    appStore.deleteScan(id)
  }
}

const deleteSelected = () => {
  if (selectedItems.value.length === 0) return

  if (confirm(`确定要删除选中的 ${selectedItems.value.length} 条记录吗？`)) {
    selectedItems.value.forEach(id => appStore.deleteScan(id))
    selectedItems.value = []
  }
}

const exportHistory = () => {
  const dataToExport = filteredHistory.value.map(item => ({
    ...item,
    timestamp: item.timestamp.toISOString()
  }))

  const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `scan-history-${new Date().getTime()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const clearAllHistory = () => {
  if (confirm('确定要清空所有扫描历史吗？此操作不可恢复！')) {
    appStore.clearScanHistory()
    selectedItems.value = []
  }
}

const toggleSelectAll = () => {
  if (selectedItems.value.length === filteredHistory.value.length) {
    selectedItems.value = []
  } else {
    selectedItems.value = filteredHistory.value.map(item => item.id)
  }
}

const formatTime = (timestamp: Date) => {
  return timestamp.toLocaleString('zh-CN')
}

const formatDuration = (seconds: number) => {
  if (seconds < 60) return `${seconds}秒`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}分${remainingSeconds}秒`
}

const getScoreColor = (score: number) => {
  if (score >= 90) return '#27ae60'
  if (score >= 70) return '#f39c12'
  if (score >= 50) return '#e67e22'
  return '#e74c3c'
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
  // Store会自动加载数据，如果需要可以调用初始化方法
  appStore.loadScanHistory()
})
</script>

<template>
  <div class="scan-history-container">
    <div class="history-header">
      <h1>扫描历史</h1>
      <p>管理和查看您的网站安全扫描记录</p>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="search-section">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="搜索URL..."
          class="search-input"
        />
      </div>

      <div class="filter-section">
        <select v-model="filterStatus" class="filter-select">
          <option value="all">所有状态</option>
          <option value="completed">已完成</option>
          <option value="failed">失败</option>
        </select>

        <select v-model="sortBy" class="filter-select">
          <option value="timestamp">按时间排序</option>
          <option value="score">按评分排序</option>
          <option value="url">按URL排序</option>
        </select>

        <button @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'" class="sort-button">
          {{ sortOrder === 'asc' ? '↑' : '↓' }}
        </button>
      </div>

      <div class="action-section">
        <button @click="exportHistory" class="action-button export">
          📤 导出
        </button>
        <button
          @click="deleteSelected"
          :disabled="selectedItems.length === 0"
          class="action-button delete"
        >
          🗑️删除选中
        </button>
        <button @click="clearAllHistory" class="action-button danger">
          🗑️ 清空全部
        </button>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="stats-section">
      <div class="stat-item">
        <div class="stat-number">{{ scanHistory.length }}</div>
        <div class="stat-label">总扫描次数</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ scanHistory.filter(s => s.status === 'completed').length }}</div>
        <div class="stat-label">成功扫描</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ scanHistory.filter(s => s.status === 'failed').length }}</div>
        <div class="stat-label">失败扫描</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">
          {{ scanHistory.length > 0 ? Math.round(scanHistory.reduce((sum, s) => sum + s.overallScore, 0) / scanHistory.length) : 0 }}
        </div>
        <div class="stat-label">平均评分</div>
      </div>
    </div>

    <!-- 历史记录表格 -->
    <div class="history-table-container">
      <div v-if="filteredHistory.length === 0" class="empty-state">
        <div class="empty-icon">📊</div>
        <h3>暂无扫描记录</h3>
        <p>开始您的第一次安全扫描吧！</p>
        <button @click="router.push('/')" class="start-scan-button">
          开始扫描
        </button>
      </div>

      <div v-else class="history-table">
        <div class="table-header">
          <label class="select-all">
            <input
              type="checkbox"
              :checked="selectedItems.length === filteredHistory.length && filteredHistory.length > 0"
              @change="toggleSelectAll"
            />
            <span class="checkmark"></span>
          </label>
          <div class="header-cell">网站URL</div>
          <div class="header-cell">扫描时间</div>
          <div class="header-cell">状态</div>
          <div class="header-cell">评分</div>
          <div class="header-cell">耗时</div>
          <div class="header-cell">操作</div>
        </div>

        <div class="table-body">
          <div
            v-for="scan in filteredHistory"
            :key="scan.id"
            class="table-row"
            :class="{ selected: selectedItems.includes(scan.id) }"
          >
            <label class="row-select">
              <input
                type="checkbox"
                :checked="selectedItems.includes(scan.id)"
                @change="(e) => {
                  if ((e.target as HTMLInputElement).checked) {
                    selectedItems.push(scan.id)
                  } else {
                    selectedItems.splice(selectedItems.indexOf(scan.id), 1)
                  }
                }"
              />
              <span class="checkmark"></span>
            </label>

            <div class="cell url-cell" @click="viewScanResult(scan)">
              <div class="url-text">{{ scan.url }}</div>
              <div class="scan-options">
                <span v-if="scan.options.ssl" class="option-tag">SSL</span>
                <span v-if="scan.options.headers" class="option-tag">Headers</span>
                <span v-if="scan.options.ports" class="option-tag">Ports</span>
                <span v-if="scan.options.vulnerabilities" class="option-tag">Vuln</span>
              </div>
            </div>

            <div class="cell">{{ formatTime(scan.timestamp) }}</div>

            <div class="cell">
              <span class="status-badge" :class="scan.status">
                {{ getStatusText(scan.status) }}
              </span>
            </div>

            <div class="cell">
              <span
                class="score-badge"
                :style="{ color: getScoreColor(scan.overallScore) }"
                v-if="scan.status === 'completed'"
              >
                {{ scan.overallScore }}/100
              </span>
              <span v-else class="score-na">-</span>
            </div>

            <div class="cell">{{ formatDuration(scan.duration) }}</div>

            <div class="cell actions-cell">
              <button @click="viewScanResult(scan)" class="action-btn view">
                👁️
              </button>
              <button @click="deleteScan(scan.id)" class="action-btn delete">
                🗑️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.scan-history-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.history-header {
  text-align: center;
  margin-bottom: 2rem;
}

.history-header h1 {
  color: white;
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.history-header p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin: 0;
}

.toolbar {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.search-section {
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
}

.filter-section {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.filter-select {
  padding: 0.75rem;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  background: white;
  cursor: pointer;
}

.sort-button {
  padding: 0.75rem;
  background: #f8f9fa;
  border: 2px solid #e1e8ed;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.3s ease;
}

.sort-button:hover {
  background: #e9ecef;
}

.action-section {
  display: flex;
  gap: 0.5rem;
}

.action-button {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.action-button.export {
  background: #27ae60;
  color: white;
}

.action-button.delete {
  background: #f39c12;
  color: white;
}

.action-button.danger {
  background: #e74c3c;
  color: white;
}

.action-button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
}

.action-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.stats-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-item {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: #3498db;
  margin-bottom: 0.5rem;
}

.stat-label {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.history-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.start-scan-button {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.start-scan-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.history-table {
  width: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 40px 1fr 150px 100px 100px 80px 100px;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e1e8ed;
  font-weight: 600;
  color: #2c3e50;
}

.select-all {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.header-cell {
  display: flex;
  align-items: center;
}

.table-body {
  max-height: 600px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 40px 1fr 150px 100px 100px 80px 100px;
  gap: 1rem;
  padding: 1rem;
  border-bottom: 1px solid #f1f3f4;
  transition: all 0.3s ease;
}

.table-row:hover {
  background: #f8f9fa;
}

.table-row.selected {
  background: rgba(52, 152, 219, 0.1);
}

.row-select {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.cell {
  display: flex;
  align-items: center;
  font-size: 0.9rem;
}

.url-cell {
  flex-direction: column;
  align-items: flex-start;
  cursor: pointer;
}

.url-text {
  font-weight: 500;
  color: #2c3e50;
  margin-bottom: 0.25rem;
  word-break: break-all;
}

.scan-options {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.option-tag {
  background: #e9ecef;
  color: #6c757d;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.status-badge.completed {
  background: #d4edda;
  color: #155724;
}

.status-badge.failed {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.scanning {
  background: #d1ecf1;
  color: #0c5460;
}

.score-badge {
  font-weight: 600;
}

.score-na {
  color: #bdc3c7;
}

.actions-cell {
  gap: 0.5rem;
}

.action-btn {
  padding: 0.25rem 0.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: all 0.3s ease;
}

.action-btn.view {
  background: #3498db;
  color: white;
}

.action-btn.delete {
  background: #e74c3c;
  color: white;
}

.action-btn:hover {
  transform: scale(1.1);
}

/* Checkbox Styles */
input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 18px;
  height: 18px;
  border: 2px solid #ddd;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
}

input[type="checkbox"]:checked + .checkmark {
  background-color: #3498db;
  border-color: #3498db;
}

input[type="checkbox"]:checked + .checkmark::after {
  content: '';
  position: absolute;
  left: 5px;
  top: 1px;
  width: 4px;
  height: 8px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

@media (max-width: 768px) {
  .scan-history-container {
    padding: 1rem;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-section,
  .action-section {
    justify-content: center;
  }

  .stats-section {
    grid-template-columns: repeat(2, 1fr);
  }

  .table-header,
  .table-row {
    grid-template-columns: 30px 1fr 80px 60px;
    font-size: 0.8rem;
  }

  .table-header .header-cell:nth-child(n+5),
  .table-row .cell:nth-child(n+5) {
    display: none;
  }
}
</style>
