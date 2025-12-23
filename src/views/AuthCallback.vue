<template>
  <div class="auth-callback">
    <div class="loading-container">
      <div v-if="!errorMessage" class="spinner"></div>
      <p v-if="!errorMessage">正在处理登录...</p>
      <div v-else class="error-container">
        <p class="error-icon">❌</p>
        <p class="error-message">{{ errorMessage }}</p>
        <button @click="goHome" class="home-btn">返回首页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { handleOAuthTokens } from '../api/googleAuthService'

const router = useRouter()
const errorMessage = ref('')

const goHome = () => {
  router.push('/')
}

onMounted(async () => {
  try {
    // 处理URL中的token参数
    const success = await handleOAuthTokens()
    
    if (success) {
      // 登录成功，清除URL参数并跳转首页
      window.history.replaceState({}, document.title, '/auth/callback')
      router.push('/')
    } else {
      // 检查是否有错误参数
      const urlParams = new URLSearchParams(window.location.search)
      const error = urlParams.get('error')
      
      if (error) {
        errorMessage.value = `登录失败: ${error}`
      } else if (!urlParams.get('access_token')) {
        errorMessage.value = '未收到认证信息，请重试'
      } else {
        errorMessage.value = '登录验证失败，请重试'
      }
    }
  } catch (error) {
    console.error('Authentication failed:', error)
    errorMessage.value = '登录过程中发生错误，请重试'
  }
})
</script>

<style scoped>
.auth-callback {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.loading-container {
  text-align: center;
  color: white;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

p {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.9;
}

.error-container {
  background: rgba(255, 255, 255, 0.1);
  padding: 2rem;
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-message {
  color: #fecaca;
  margin-bottom: 1.5rem;
}

.home-btn {
  padding: 0.75rem 1.5rem;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.home-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}
</style>
