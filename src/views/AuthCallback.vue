<template>
  <div class="auth-callback">
    <div class="loading-container">
      <div class="spinner"></div>
      <p>正在处理登录...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { handleAuthCallback } from '../api/googleAuthService'

const router = useRouter()

onMounted(async () => {
  try {
    const urlParams = new URLSearchParams(window.location.search)
    const code = urlParams.get('code')

    if (code) {
      await handleAuthCallback(code)
      router.push('/')
    } else {
      throw new Error('No authorization code found')
    }
  } catch (error) {
    console.error('Authentication failed:', error)
    router.push('/?auth_error=true')
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
</style>
