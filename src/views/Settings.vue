<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Settings {
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

const settings = ref<Settings>({
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

const emailAddress = ref('')
const isModified = ref(false)
const saveStatus = ref<'idle' | 'saving' | 'saved' | 'error'>('idle')

const loadSettings = () => {
  const saved = localStorage.getItem('appSettings')
  if (saved) {
    try {
      const parsedSettings = JSON.parse(saved)
      settings.value = { ...settings.value, ...parsedSettings }
    } catch (error) {
      console.error('加载设置失败:', error)
    }
  }

  const savedEmail = localStorage.getItem('userEmail')
  if (savedEmail) {
    emailAddress.value = savedEmail
  }
}

const saveSettings = async () => {
  saveStatus.value = 'saving'

  try {
    localStorage.setItem('appSettings', JSON.stringify(settings.value))
    localStorage.setItem('userEmail', emailAddress.value)

    // 模拟保存延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

    saveStatus.value = 'saved'
    isModified.value = false

    setTimeout(() => {
      saveStatus.value = 'idle'
    }, 2000)
  } catch (error) {
    console.error('保存设置失败:', error)
    saveStatus.value = 'error'

    setTimeout(() => {
      saveStatus.value = 'idle'
    }, 3000)
  }
}

const resetSettings = () => {
  if (confirm('确定要重置所有设置为默认值吗？')) {
    settings.value = {
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
    }
    emailAddress.value = ''
    isModified.value = true
  }
}

const exportSettings = () => {
  const dataToExport = {
    settings: settings.value,
    email: emailAddress.value,
    exportDate: new Date().toISOString()
  }

  const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `security-scanner-settings-${new Date().getTime()}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

const importSettings = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target?.result as string)
      if (imported.settings) {
        settings.value = { ...settings.value, ...imported.settings }
      }
      if (imported.email) {
        emailAddress.value = imported.email
      }
      isModified.value = true
      alert('设置导入成功！')
    } catch (error) {
      alert('导入失败：文件格式不正确')
    }
  }
  reader.readAsText(file)
}

const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      settings.value.notifications.browserNotifications = true
      isModified.value = true
    }
  }
}

const testNotification = () => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('测试通知', {
      body: '这是一条测试通知消息',
      icon: '/favicon.ico'
    })
  } else {
    alert('请先启用浏览器通知权限')
  }
}

const markAsModified = () => {
  isModified.value = true
}

onMounted(() => {
  loadSettings()
})
</script>

<template>
  <div class="settings-container">
    <div class="settings-header">
      <h1>设置</h1>
      <p>配置您的安全扫描器偏好设置</p>
    </div>

    <div class="settings-content">
      <!-- 默认扫描选项 -->
      <div class="settings-section">
        <div class="section-header">
          <h2>🔍 默认扫描选项</h2>
          <p>设置新扫描时的默认检测项目</p>
        </div>

        <div class="settings-grid">
          <label class="setting-item">
            <input
              type="checkbox"
              v-model="settings.defaultScanOptions.ssl"
              @change="markAsModified"
            />
            <span class="checkmark"></span>
            <div class="setting-content">
              <div class="setting-title">SSL/TLS 安全检测</div>
              <div class="setting-description">检查SSL证书有效性和TLS配置</div>
            </div>
          </label>

          <label class="setting-item">
            <input
              type="checkbox"
              v-model="settings.defaultScanOptions.headers"
              @change="markAsModified"
            />
            <span class="checkmark"></span>
            <div class="setting-content">
              <div class="setting-title">HTTP 安全头检测</div>
              <div class="setting-description">分析HTTP安全头配置</div>
            </div>
          </label>

          <label class="setting-item">
            <input
              type="checkbox"
              v-model="settings.defaultScanOptions.ports"
              @change="markAsModified"
            />
            <span class="checkmark"></span>
            <div class="setting-content">
              <div class="setting-title">端口扫描</div>
              <div class="setting-description">检测开放端口和服务</div>
            </div>
          </label>

          <label class="setting-item">
            <input
              type="checkbox"
              v-model="settings.defaultScanOptions.vulnerabilities"
              @change="markAsModified"
            />
            <span class="checkmark"></span>
            <div class="setting-content">
              <div class="setting-title">常见漏洞检测</div>
              <div class="setting-description">扫描已知安全漏洞</div>
            </div>
          </label>
        </div>
      </div>

      <!-- 通知设置 -->
      <div class="settings-section">
        <div class="section-header">
          <h2>🔔 通知设置</h2>
          <p>管理扫描完成和报告通知</p>
        </div>

        <div class="settings-grid">
          <div class="setting-item">
            <label class="setting-label">
              <span class="setting-title">邮箱地址</span>
              <input
                type="email"
                v-model="emailAddress"
                @input="markAsModified"
                placeholder="输入您的邮箱地址"
                class="setting-input"
              />
            </label>
          </div>

          <label class="setting-item">
            <input
              type="checkbox"
              v-model="settings.notifications.emailAlerts"
              @change="markAsModified"
            />
            <span class="checkmark"></span>
            <div class="setting-content">
              <div class="setting-title">邮件提醒</div>
              <div class="setting-description">通过邮件接收扫描结果</div>
            </div>
          </label>

          <label class="setting-item">
            <input
              type="checkbox"
              v-model="settings.notifications.browserNotifications"
              @change="markAsModified"
            />
            <span class="checkmark"></span>
            <div class="setting-content">
              <div class="setting-title">浏览器通知</div>
              <div class="setting-description">在浏览器中显示通知</div>
            </div>
            <button @click="requestNotificationPermission" class="mini-button">
              启用权限
            </button>
          </label>

          <label class="setting-item">
            <input
              type="checkbox"
              v-model="settings.notifications.scanComplete"
              @change="markAsModified"
            />
            <span class="checkmark"></span>
            <div class="setting-content">
              <div class="setting-title">扫描完成通知</div>
              <div class="setting-description">扫描完成时发送通知</div>
            </div>
          </label>

          <label class="setting-item">
            <input
              type="checkbox"
              v-model="settings.notifications.weeklyReport"
              @change="markAsModified"
            />
            <span class="checkmark"></span>
            <div class="setting-content">
              <div class="setting-title">周报</div>
              <div class="setting-description">每周发送安全扫描汇总</div>
            </div>
          </label>

          <div class="setting-item">
            <button @click="testNotification" class="test-button">
              📱 测试通知
            </button>
          </div>
        </div>
      </div>

      <!-- 高级设置 -->
      <div class="settings-section">
        <div class="section-header">
          <h2>⚙️ 高级设置</h2>
          <p>配置扫描性能和行为参数</p>
        </div>

        <div class="settings-grid">
          <div class="setting-item">
            <label class="setting-label">
              <span class="setting-title">最大并发扫描数</span>
              <input
                type="number"
                v-model.number="settings.advanced.maxConcurrentScans"
                @input="markAsModified"
                min="1"
                max="10"
                class="setting-input"
              />
            </label>
            <div class="setting-description">同时进行的扫描任务数量</div>
          </div>

          <div class="setting-item">
            <label class="setting-label">
              <span class="setting-title">扫描超时时间 (秒)</span>
              <input
                type="number"
                v-model.number="settings.advanced.scanTimeout"
                @input="markAsModified"
                min="60"
                max="1800"
                class="setting-input"
              />
            </label>
            <div class="setting-description">单次扫描的最大等待时间</div>
          </div>

          <div class="setting-item">
            <label class="setting-label">
              <span class="setting-title">重试次数</span>
              <input
                type="number"
                v-model.number="settings.advanced.retryAttempts"
                @input="markAsModified"
                min="0"
                max="5"
                class="setting-input"
              />
            </label>
            <div class="setting-description">扫描失败时的重试次数</div>
          </div>

          <label class="setting-item">
            <input
              type="checkbox"
              v-model="settings.advanced.saveHistory"
              @change="markAsModified"
            />
            <span class="checkmark"></span>
            <div class="setting-content">
              <div class="setting-title">保存扫描历史</div>
              <div class="setting-description">在本地存储扫描记录</div>
            </div>
          </label>
        </div>
      </div>

      <!-- 外观设置 -->
      <div class="settings-section">
        <div class="section-header">
          <h2>🎨 外观设置</h2>
          <p>自定义界面主题和语言</p>
        </div>

        <div class="settings-grid">
          <div class="setting-item">
            <label class="setting-label">
              <span class="setting-title">主题</span>
              <select
                v-model="settings.appearance.theme"
                @change="markAsModified"
                class="setting-select"
              >
                <option value="light">浅色主题</option>
                <option value="dark">深色主题</option>
                <option value="auto">跟随系统</option>
              </select>
            </label>
          </div>

          <div class="setting-item">
            <label class="setting-label">
              <span class="setting-title">语言</span>
              <select
                v-model="settings.appearance.language"
                @change="markAsModified"
                class="setting-select"
              >
                <option value="zh-CN">简体中文</option>
                <option value="en-US">English</option>
              </select>
            </label>
          </div>
        </div>
      </div>

      <!-- 数据管理 -->
      <div class="settings-section">
        <div class="section-header">
          <h2>💾 数据管理</h2>
          <p>导入导出设置和清理数据</p>
        </div>

        <div class="data-actions">
          <button @click="exportSettings" class="action-button export">
            📤 导出设置
          </button>

          <label class="action-button import">
            📥 导入设置
            <input
              type="file"
              accept=".json"
              @change="importSettings"
              style="display: none;"
            />
          </label>

          <button @click="resetSettings" class="action-button reset">
            🔄 重置设置
          </button>
        </div>
      </div>

      <!-- 保存按钮 -->
      <div class="save-section">
        <button
          @click="saveSettings"
          :disabled="!isModified || saveStatus === 'saving'"
          class="save-button"
          :class="saveStatus"
        >
          <span v-if="saveStatus === 'idle'">💾 保存设置</span>
          <span v-else-if="saveStatus === 'saving'">⏳ 保存中...</span>
          <span v-else-if="saveStatus === 'saved'">✅ 已保存</span>
          <span v-else-if="saveStatus === 'error'">❌ 保存失败</span>
        </button>

        <div v-if="isModified" class="unsaved-notice">
          ⚠️ 您有未保存的更改
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.settings-header {
  text-align: center;
  margin-bottom: 3rem;
}

.settings-header h1 {
  color: white;
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.settings-header p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin: 0;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h2 {
  color: #2c3e50;
  font-size: 1.5rem;
  margin: 0 0 0.5rem 0;
}

.section-header p {
  color: #7f8c8d;
  margin: 0;
  font-size: 0.95rem;
}

.settings-grid {
  display: grid;
  gap: 1.5rem;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.setting-item:hover {
  border-color: #3498db;
  background: rgba(52, 152, 219, 0.05);
}

.setting-label {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  cursor: pointer;
}

.setting-content {
  flex: 1;
}

.setting-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.25rem;
}

.setting-description {
  font-size: 0.9rem;
  color: #7f8c8d;
  line-height: 1.4;
}

.setting-input,
.setting-select {
  padding: 0.75rem;
  border: 2px solid #e1e8ed;
  border-radius: 6px;
  font-size: 0.95rem;
  transition: border-color 0.3s ease;
}

.setting-input:focus,
.setting-select:focus {
  outline: none;
  border-color: #3498db;
}

.mini-button {
  padding: 0.5rem 1rem;
  background: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.mini-button:hover {
  background: #2980b9;
}

.test-button {
  padding: 0.75rem 1.5rem;
  background: #f39c12;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.test-button:hover {
  background: #e67e22;
  transform: translateY(-2px);
}

.data-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-button {
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
}

.action-button.export {
  background: #27ae60;
  color: white;
}

.action-button.import {
  background: #3498db;
  color: white;
}

.action-button.reset {
  background: #e74c3c;
  color: white;
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.save-section {
  text-align: center;
  padding: 2rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.save-button {
  padding: 1rem 3rem;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.save-button:disabled {
  background: #bdc3c7;
  cursor: not-allowed;
  transform: none;
}

.save-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.save-button.saved {
  background: #27ae60;
}

.save-button.error {
  background: #e74c3c;
}

.unsaved-notice {
  margin-top: 1rem;
  color: #f39c12;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Checkbox Styles */
input[type="checkbox"] {
  display: none;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid #ddd;
  border-radius: 4px;
  position: relative;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

input[type="checkbox"]:checked + .checkmark {
  background-color: #3498db;
  border-color: #3498db;
}

input[type="checkbox"]:checked + .checkmark::after {
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

@media (max-width: 768px) {
  .settings-container {
    padding: 1rem;
  }

  .settings-section {
    padding: 1.5rem;
  }

  .data-actions {
    flex-direction: column;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .save-button {
    width: 100%;
  }
}
</style>
