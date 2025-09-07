import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import { useUserStore } from './stores/userStore'

// 创建应用
const app = createApp(App)

// 使用插件
app.use(createPinia())
app.use(router)
app.use(i18n)

// 挂载前加载用户状态
const userStore = useUserStore()
userStore.loadUserFromStorage()

// 挂载应用
app.mount('#app')
