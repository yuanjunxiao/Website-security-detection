<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { createScanTask, pollScanTask } from '../api/scanService'
import { useScanStore } from '../stores/scanStore'

const title = '你访问的网络安全吗？'
const subtitle = '网站安全扫描器，一键检测，安全上网(功能开发中，敬请期待)'

const router = useRouter()
const scanStore = useScanStore()

const targetUrl = ref('')
const urlError = ref('')
const scanOptions = ref({
  ssl: true,
  headers: true,
  ports: false,
  vulnerabilities: true,
})
const scanProgress = ref(0)
const scanStatus = ref('')
const hasScanned = ref(false)

const isScanning = ref(false)

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

const startScan = async () => {
  if (!isValidUrl.value || isScanning.value) return

  isScanning.value = true
  hasScanned.value = true
  urlError.value = ''

  try {
    const task = await createScanTask(targetUrl.value)
    // 开始轮询任务状态
    const finalTask = await pollScanTask(task.taskId, (progressTask) => {
      // 可以在这里更新进度状态
    })

    scanStore.setScanResult({
      url: targetUrl.value,
      options: scanOptions.value,
      taskId: finalTask.taskId,
      status: finalTask.status,
    })

    router.push({
      name: 'ScanResult',
      params: {
        taskId: finalTask.taskId,
      },
    })
  } catch (error: unknown) {
    const err = error as Error
    console.error('扫描失败:', err)
    urlError.value = err.message || '扫描失败，请稍后重试'
  } finally {
    isScanning.value = false
  }
}
</script>

<template>
  <div class="home-container">
    <div class="content-area">
      <div class="header-section">
        <h1 class="main-title">{{ title }}</h1>
        <p class="subtitle">{{ subtitle }}</p>
      </div>

      <div class="content-wrapper">
        <div class="scan-section">
          <div class="input-container">
            <div class="input-group">
              <input
                v-model="targetUrl"
                type="url"
                placeholder="请输入要检测的网站URL (例如: https://example.com)"
                class="url-input"
                @input="validateUrl(targetUrl)"
              />
              <button class="scan-button" @click="startScan" :disabled="!isValidUrl || isScanning">
                <span v-if="!isScanning">开始检测</span>
                <span v-else class="scanning-text">
                  <i class="loading-icon"></i>
                  检测中...
                </span>
              </button>
            </div>
            <div v-if="urlError" class="error-message">
              {{ urlError }}
            </div>
          </div>

          <div class="scan-options">
            <h3>检测选项</h3>
            <div class="options-grid">
              <label class="option-item">
                <input type="checkbox" v-model="scanOptions.ssl" />
                <span class="checkmark"></span>
                <span>SSL/TLS 安全检测</span>
              </label>
              <label class="option-item">
                <input type="checkbox" v-model="scanOptions.headers" />
                <span class="checkmark"></span>
                <span>HTTP 安全头检测</span>
              </label>
              <label class="option-item">
                <input type="checkbox" v-model="scanOptions.ports" />
                <span class="checkmark"></span>
                <span>端口扫描</span>
              </label>
              <label class="option-item">
                <input type="checkbox" v-model="scanOptions.vulnerabilities" />
                <span class="checkmark"></span>
                <span>常见漏洞检测</span>
              </label>
            </div>
          </div>
        </div>

        <div v-if="isScanning" class="progress-section">
          <div class="progress-container">
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: scanProgress + '%' }"></div>
            </div>
            <div class="progress-text">{{ scanStatus }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 页脚链接 - 固定在底部 -->
    <footer class="footer-links">
      <div class="footer-content">
        <div class="footer-text">
          使用本服务即表示您同意我们的
          <router-link to="/terms-of-service" class="footer-link">服务条款</router-link>
          和
          <router-link to="/privacy-policy" class="footer-link">隐私权政策</router-link>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.home-container {
  width: 100%;
  min-height: 100vh;
  padding: 0;
  position: relative;
  z-index: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 2rem;
  margin-top: -200px;
}

.header-section {
  text-align: center;
  padding: 4rem 2rem 3rem;
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

.content-wrapper {
  width: 100%;
  max-width: none;
  padding: 0 4rem;
}

.scan-section {
  margin: 0 auto 2rem;
  max-width: 800px;
  position: relative;
  padding: 0;
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
  padding: 1.2rem 1.8rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  font-size: 1.1rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.1);
  color: #f8fafc;
  font-weight: 600;
  backdrop-filter: blur(10px);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.url-input::placeholder {
  color: rgba(248, 250, 252, 0.9); /* 高透明度亮色 */
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  font-weight: 500;
}

.url-input:focus {
  outline: none;
  border-color: rgba(102, 126, 234, 0.8);
  box-shadow: 0 0 0 4px rgba(102, 126, 234, 0.2);
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.scan-button {
  padding: 1.25rem 2.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  border-radius: 16px;
  font-size: 1.1rem;
  font-weight: 700; /* 更粗 */
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 160px;
  box-shadow:
    0 8px 25px rgba(102, 126, 234, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2); /* 添加内边框 */
  position: relative;
  overflow: hidden;
  letter-spacing: 0.02em;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
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
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  color: #e53e3e;
  font-size: 1rem;
  margin-top: 1rem;
  text-align: center;
  font-weight: 500;
}

.scan-options h3 {
  display: none;
}

.options-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  max-width: 800px;
  margin: 1rem auto 0;
  justify-content: center;
}

.option-item {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 0.8rem;
  border-radius: 10px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  font-weight: 500;
  font-size: 0.85rem;
  color: white;
}

.option-item:hover {
  background: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.option-item input[type='checkbox'] {
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

.option-item input[type='checkbox']:checked + .checkmark {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-color: #667eea;
  box-shadow:
    0 8px 20px rgba(102, 126, 234, 0.4),
    0 0 0 4px rgba(102, 126, 234, 0.1);
  transform: scale(1.05);
}

.option-item input[type='checkbox']:checked + .checkmark::after {
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

.option-item input[type='checkbox']:checked + .checkmark + span {
  color: #93c5fd; /* 更亮的蓝色 */
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
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
  .progress-section {
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
}

.footer-links {
  padding: 1.5rem 0;
  text-align: center;
  margin-top: auto;
}

.footer-content {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.footer-text {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
  font-weight: 400;
  line-height: 1.6;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.footer-link {
  color: rgba(255, 255, 255, 0.95);
  text-decoration: underline;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.3s ease;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
}

.footer-link:hover {
  color: white;
  text-decoration-color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 0 8px rgba(255, 255, 255, 0.3);
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

  .header-section {
    padding: 3rem 1rem 2rem;
  }

  .scan-section,
  .progress-section {
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
}

@media (max-width: 480px) {
  .footer-links {
    padding: 1rem 0;
  }

  .footer-content {
    padding: 0 1rem;
  }

  .footer-text {
    font-size: 0.85rem;
    flex-direction: column;
    gap: 0.75rem;
    text-align: center;
  }

  .main-title {
    font-size: 2rem;
  }
}
</style>
