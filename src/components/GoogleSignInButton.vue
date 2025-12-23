<template>
  <div class="google-auth-container">
    <!-- 登录状态 -->
    <div v-if="userStore.isAuthenticated" class="user-profile">
      <img :src="userStore.user?.picture" :alt="userStore.user?.name" class="user-avatar" />
      <div class="user-info">
        <span class="user-name">{{ userStore.user?.name }}</span>
        <button @click="handleSignOut" class="sign-out-btn">退出</button>
      </div>
    </div>

    <!-- 未登录状态 -->
    <div v-else class="sign-in-section">
      <button
        @click="handleSignIn"
        :disabled="userStore.isLoading"
        class="google-sign-in-btn"
      >
        <span v-if="userStore.isLoading" class="loading-spinner"></span>
        <span v-else>使用 Google 登录</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '../stores/userStore'
import { triggerGoogleSignIn, signOut } from '../api/googleAuthService'

const userStore = useUserStore()

const handleSignIn = () => {
  triggerGoogleSignIn()
}

const handleSignOut = () => {
  signOut()
}
</script>

<style scoped>
.google-auth-container {
  display: flex;
  align-items: center;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.user-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.user-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: #1f2937;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sign-out-btn {
  font-size: 0.75rem;
  color: #6b7280;
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  padding: 0;
}

.sign-out-btn:hover {
  color: #374151;
}

.sign-in-section {
  display: flex;
  align-items: center;
}

.google-sign-in-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: #4285f4;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(66, 133, 244, 0.3);
}

.google-sign-in-btn:hover:not(:disabled) {
  background: #3367d6;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(66, 133, 244, 0.4);
}

.google-sign-in-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
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

@media (max-width: 768px) {
  .user-profile {
    padding: 0.5rem;
  }

  .user-name {
    max-width: 80px;
    font-size: 0.75rem;
  }

  .google-sign-in-btn {
    padding: 0.5rem 1rem;
    font-size: 0.75rem;
  }
}
</style>
