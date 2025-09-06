import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import zhCN from '../locales/zh-CN.json'
import ja from '../locales/ja.json'
import de from '../locales/de.json'
import ru from '../locales/ru.json'

// 支持的语言列表
export const supportedLocales = {
  en: 'English',
  'zh-CN': '简体中文',
  ja: '日本語',
  de: 'Deutsch',
  ru: 'Русский',
} as const

export type SupportedLocale = keyof typeof supportedLocales

// 获取浏览器首选语言
export function getBrowserLocale(): SupportedLocale {
  const browserLanguages = navigator.languages || [navigator.language]

  for (const lang of browserLanguages) {
    // 检查是否支持简体中文
    if (lang.startsWith('zh')) {
      return 'zh-CN'
    }
    // 检查是否支持日语
    if (lang.startsWith('ja')) {
      return 'ja'
    }
    // 检查是否支持德语
    if (lang.startsWith('de')) {
      return 'de'
    }
    // 检查是否支持俄语
    if (lang.startsWith('ru')) {
      return 'ru'
    }
    // 检查是否支持英文
    if (lang.startsWith('en')) {
      return 'en'
    }
  }

  // 默认返回英文
  return 'en'
}

// 从localStorage获取用户选择的语言
export function getStoredLocale(): SupportedLocale | null {
  const stored = localStorage.getItem('userLocale')
  return stored && stored in supportedLocales ? (stored as SupportedLocale) : null
}

// 保存用户选择的语言到localStorage
export function setStoredLocale(locale: SupportedLocale): void {
  localStorage.setItem('userLocale', locale)
}

// 获取当前语言
export function getCurrentLocale(): SupportedLocale {
  return getStoredLocale() || getBrowserLocale()
}

// 创建i18n实例
const i18n = createI18n({
  legacy: false,
  locale: getCurrentLocale(),
  fallbackLocale: 'en',
  messages: {
    en: en,
    'zh-CN': zhCN,
    ja: ja,
    de: de,
    ru: ru,
  },
})

// 切换语言函数
export function setLocale(locale: SupportedLocale): void {
  i18n.global.locale.value = locale
  setStoredLocale(locale)
  document.documentElement.lang = locale
}

// 初始化语言设置
function initLocale(): void {
  const locale = getCurrentLocale()
  setLocale(locale)
}

// 立即初始化
initLocale()

export default i18n
