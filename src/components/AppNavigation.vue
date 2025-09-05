<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isMobileMenuOpen = ref(false)

const navigationItems = [
  // { name: '首页', path: '/' },
  { name: '扫描历史', path: '/history' },
  { name: '设置', path: '/settings' },
  { name: '帮助', path: '/help' },
  { name: '关于', path: '/about' },
]

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const navigateTo = (path: string) => {
  router.push(path)
  isMobileMenuOpen.value = false
}

const isActive = (path: string) => {
  return route.path === path
}
</script>

<template>
  <nav class="app-navigation">
    <div class="nav-container">
      <!-- Logo -->
      <div class="nav-logo" @click="navigateTo('/')">
        <div class="logo-icon"></div>
        <span class="logo-text">安全扫描器</span>
      </div>

      <!-- Desktop Navigation -->
      <div class="nav-menu desktop-menu">
        <button
          v-for="item in navigationItems"
          :key="item.path"
          @click="navigateTo(item.path)"
          class="nav-item"
          :class="{ active: isActive(item.path) }"
        >
          {{ item.name }}
        </button>
      </div>

      <!-- Mobile Menu Button -->
      <button class="mobile-menu-button" @click="toggleMobileMenu">
        <span class="hamburger" :class="{ active: isMobileMenuOpen }"></span>
      </button>
    </div>

    <!-- Mobile Navigation -->
    <div class="mobile-menu" :class="{ active: isMobileMenuOpen }">
      <button
        v-for="item in navigationItems"
        :key="item.path"
        @click="navigateTo(item.path)"
        class="mobile-nav-item"
        :class="{ active: isActive(item.path) }"
      >
        {{ item.name }}
      </button>
    </div>
  </nav>
</template>

<style scoped>
.app-navigation {
  display: none;
  width: 0;
  height: 0;
  overflow: hidden;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 80px;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.nav-logo:hover {
  transform: translateY(-2px);
}

.logo-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  position: relative;
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
}

.logo-icon::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 6px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
}

.logo-icon::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 12px;
  height: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 3px;
}

.logo-text {
  font-size: 1.4rem;
  font-weight: 800;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.desktop-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-item {
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #64748b;
  font-weight: 600;
  font-size: 0.95rem;
  position: relative;
  overflow: hidden;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px;
}

.nav-item:hover {
  color: #475569;
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.15);
}

.nav-item:hover::before {
  opacity: 0.1;
}

.nav-item.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
  transform: translateY(-2px);
}

.nav-item.active::before {
  opacity: 0;
}

.mobile-menu-button {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.75rem;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.mobile-menu-button:hover {
  background: rgba(102, 126, 234, 0.1);
}

.hamburger {
  display: block;
  width: 24px;
  height: 2px;
  background: #64748b;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background: #64748b;
  border-radius: 2px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.hamburger::before {
  top: -7px;
}

.hamburger::after {
  bottom: -7px;
}

.hamburger.active {
  background: transparent;
}

.hamburger.active::before {
  top: 0;
  transform: rotate(45deg);
  background: #667eea;
}

.hamburger.active::after {
  bottom: 0;
  transform: rotate(-45deg);
  background: #667eea;
}

.mobile-menu {
  display: none;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(102, 126, 234, 0.1);
  padding: 1.5rem 0;
}

.mobile-menu.active {
  display: block;
}

.mobile-nav-item {
  display: block;
  width: 100%;
  padding: 1rem 2rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  color: #64748b;
  font-weight: 600;
  font-size: 1rem;
  text-align: left;
  position: relative;
  overflow: hidden;
}

.mobile-nav-item::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  transform: scaleY(0);
  transition: transform 0.3s ease;
}

.mobile-nav-item:hover {
  background: rgba(102, 126, 234, 0.05);
  color: #475569;
  padding-left: 2.5rem;
}

.mobile-nav-item:hover::before {
  transform: scaleY(1);
}

.mobile-nav-item.active {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%);
  color: #667eea;
  padding-left: 2.5rem;
}

.mobile-nav-item.active::before {
  transform: scaleY(1);
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 1.5rem;
    height: 70px;
  }

  .desktop-menu {
    display: none;
  }

  .mobile-menu-button {
    display: block;
  }

  .logo-text {
    font-size: 1.2rem;
  }

  .logo-icon {
    width: 36px;
    height: 36px;
  }

  .logo-icon::before {
    width: 18px;
    height: 18px;
  }

  .logo-icon::after {
    width: 10px;
    height: 10px;
  }
}

@media (max-width: 480px) {
  .nav-container {
    height: 65px;
    padding: 0 1rem;
  }

  .logo-text {
    display: none;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
  }

  .logo-icon::before {
    width: 16px;
    height: 16px;
  }

  .logo-icon::after {
    width: 8px;
    height: 8px;
  }

  .mobile-nav-item {
    padding: 0.875rem 1.5rem;
    font-size: 0.95rem;
  }

  .mobile-nav-item:hover,
  .mobile-nav-item.active {
    padding-left: 2rem;
  }
}
</style>
