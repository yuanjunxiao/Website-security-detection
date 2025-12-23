<script setup lang="ts">
import { RouterView } from 'vue-router'
import AppNavigation from './components/AppNavigation.vue'
import GoogleSignInButton from './components/GoogleSignInButton.vue'
import { onMounted } from 'vue'
import { initGoogleAuth } from './api/googleAuthService'
import { useUserStore } from './stores/userStore'

const userStore = useUserStore()

onMounted(async () => {
  // 先从本地存储加载用户信息
  userStore.loadUserFromStorage()
  // 然后验证token是否有效
  await initGoogleAuth()
})
</script>

<template>
  <div id="app">
    <!-- 右上角登录区域 -->
    <div class="auth-corner">
      <GoogleSignInButton />
    </div>

    <AppNavigation />
    <main class="main-content">
      <RouterView />
    </main>
  </div>
</template>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
}

body {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  line-height: 1.6;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell',
    sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  overflow-x: hidden;
}

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  color: #1a202c;
}

.main-content {
  flex: 1;
  width: 100%;
  min-height: calc(100vh - 80px); /* 减去导航栏高度 */
  position: relative;
  overflow-x: hidden;
}

.main-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.1) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

/* 全局滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 确保内容在背景之上 */
.main-content > * {
  position: relative;
  z-index: 1;
}

/* 右上角登录区域 */
.auth-corner {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .auth-corner {
    top: 15px;
    right: 15px;
  }
}

@media (max-width: 480px) {
  .auth-corner {
    top: 10px;
    right: 10px;
  }
}
</style>
