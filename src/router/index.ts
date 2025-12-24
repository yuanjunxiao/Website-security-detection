import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { trackPageView } from '../utils/analytics'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/scan-result',
      name: 'ScanResult',
      component: () => import('../views/ScanResultV2.vue'),
      props: true,
    },
    {
      path: '/scan-result/:taskId',
      name: 'ScanResultWithId',
      component: () => import('../views/ScanResultV2.vue'),
      props: true,
    },
    {
      path: '/history',
      name: 'history',
      component: () => import('../views/ScanHistory.vue'),
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/Settings.vue'),
    },
    {
      path: '/help',
      name: 'help',
      component: () => import('../views/Help.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
    {
      path: '/privacy-policy',
      name: 'privacy-policy',
      component: () => import('../views/PrivacyPolicy.vue'),
    },
    {
      path: '/terms-of-service',
      name: 'terms-of-service',
      component: () => import('../views/TermsOfService.vue'),
    },
    {
      path: '/auth/callback',
      name: 'authCallback',
      component: () => import('../views/AuthCallback.vue'),
    },
    {
      path: '/pricing',
      name: 'pricing',
      component: () => import('../views/PricingView.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('../views/NotFound.vue'),
    },
  ],
})

// 路由变化时追踪页面浏览
router.afterEach((to) => {
  // 获取页面标题
  const pageTitle = to.meta.title as string || getPageTitle(to.name as string)
  trackPageView(to.fullPath, pageTitle)
})

// 根据路由名称获取页面标题
function getPageTitle(routeName: string): string {
  const titles: Record<string, string> = {
    home: '首页 - 网站安全扫描器',
    ScanResult: '扫描结果',
    ScanResultWithId: '扫描结果',
    history: '扫描历史',
    settings: '设置',
    help: '帮助中心',
    about: '关于我们',
    'privacy-policy': '隐私政策',
    'terms-of-service': '服务条款',
    authCallback: '登录中...',
    pricing: '购买套餐',
    NotFound: '页面未找到'
  }
  return titles[routeName] || '网站安全扫描器'
}

export default router
