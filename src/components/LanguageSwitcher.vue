<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { supportedLocales, setLocale, type SupportedLocale } from '../i18n'

const { t, locale } = useI18n()
const currentLocale = ref<SupportedLocale>(locale.value as SupportedLocale)
const isOpen = ref(false)

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const selectLocale = (newLocale: SupportedLocale) => {
  if (newLocale !== currentLocale.value) {
    setLocale(newLocale)
    currentLocale.value = newLocale
  }
  isOpen.value = false
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.language-switcher')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  return () => {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<template>
  <div class="language-switcher">
    <button @click="toggleDropdown" class="language-button" :title="t('app.language')">
      <span class="language-flag">
        {{
          currentLocale === 'zh-CN' ? '🇨🇳' :
          currentLocale === 'ja' ? '🇯🇵' :
          currentLocale === 'de' ? '🇩🇪' :
          currentLocale === 'ru' ? '🇷🇺' : '🇺🇸'
        }}
      </span>
      <span class="language-code">{{ currentLocale }}</span>
      <span class="dropdown-arrow">▼</span>
    </button>

    <div v-if="isOpen" class="language-dropdown">
      <button
        v-for="[code, name] in Object.entries(supportedLocales)"
        :key="code"
        @click="selectLocale(code as SupportedLocale)"
        class="language-option"
        :class="{ active: currentLocale === code }"
      >
        <span class="option-flag">
          {{ code === 'zh-CN' ? '🇨🇳' : '🇺🇸' }}
        </span>
        <span class="option-name">{{ name }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.language-switcher {
  position: relative;
  display: inline-block;
}

.language-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.language-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.language-flag {
  font-size: 1.1rem;
}

.language-code {
  font-weight: 500;
}

.dropdown-arrow {
  font-size: 0.7rem;
  opacity: 0.7;
}

.language-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  min-width: 120px;
  z-index: 1000;
  overflow: hidden;
}

.language-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.language-option:hover {
  background: #f8f9fa;
}

.language-option.active {
  background: #e3f2fd;
  color: #1976d2;
}

.option-flag {
  font-size: 1.1rem;
}

.option-name {
  font-size: 0.9rem;
  font-weight: 500;
}

@media (max-width: 768px) {
  .language-button {
    padding: 0.375rem 0.5rem;
    font-size: 0.8rem;
  }

  .language-code {
    display: none;
  }
}
</style>
