import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface User {
  id: string
  email: string
  name: string
  picture: string
  givenName: string
  familyName: string
}

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = ref(false)
  const isLoading = ref(false)

  // 从本地存储加载用户信息
  const loadUserFromStorage = () => {
    const savedUser = localStorage.getItem('googleUser')
    if (savedUser) {
      user.value = JSON.parse(savedUser)
      isAuthenticated.value = true
    }
  }

  // 设置用户信息
  const setUser = (userData: User) => {
    user.value = userData
    isAuthenticated.value = true
    localStorage.setItem('googleUser', JSON.stringify(userData))
  }

  // 清除用户信息
  const clearUser = () => {
    user.value = null
    isAuthenticated.value = false
    localStorage.removeItem('googleUser')
  }

  // 设置加载状态
  const setLoading = (loading: boolean) => {
    isLoading.value = loading
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    loadUserFromStorage,
    setUser,
    clearUser,
    setLoading
  }
})
