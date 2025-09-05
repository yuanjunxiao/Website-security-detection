<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <div class="error-illustration">
        <div class="error-code">404</div>
        <div class="error-icon">🔍</div>
      </div>

      <div class="error-message">
        <h1>页面未找到</h1>
        <p>抱歉，您访问的页面不存在或已被移动。</p>
      </div>

      <div class="error-actions">
        <button @click="goHome" class="action-button primary">
          🏠 返回首页
        </button>
        <button @click="goBack" class="action-button secondary">
          ← 返回上页
        </button>
      </div>

      <div class="helpful-links">
        <h3>您可能在寻找：</h3>
        <div class="links-grid">
          <router-link to="/" class="help-link">
            <span class="link-icon">🔍</span>
            <div class="link-content">
              <div class="link-title">安全扫描</div>
              <div class="link-description">开始网站安全检测</div>
            </div>
          </router-link>

          <router-link to="/history" class="help-link">
            <span class="link-icon">📊</span>
            <div class="link-content">
              <div class="link-title">扫描历史</div>
              <div class="link-description">查看历史扫描记录</div>
            </div>
          </router-link>

          <router-link to="/help" class="help-link">
            <span class="link-icon">❓</span>
            <div class="link-content">
              <div class="link-title">帮助文档</div>
              <div class="link-description">了解如何使用</div>
            </div>
          </router-link>

          <router-link to="/settings" class="help-link">
            <span class="link-icon">⚙️</span>
            <div class="link-content">
              <div class="link-title">设置</div>
              <div class="link-description">配置扫描选项</div>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.not-found-content {
  max-width: 600px;
  text-align: center;
}

.error-illustration {
  position: relative;
  margin-bottom: 2rem;
}

.error-code {
  font-size: 8rem;
  font-weight: 900;
  color: rgba(255, 255, 255, 0.1);
  line-height: 1;
  margin-bottom: -2rem;
}

.error-icon {
  font-size: 4rem;
  position: relative;
  z-index: 1;
}

.error-message {
  margin-bottom: 3rem;
}

.error-message h1 {
  color: white;
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 1rem 0;
}

.error-message p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.action-button {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.action-button.primary {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.action-button.secondary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.action-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.action-button.primary:hover {
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
}

.helpful-links {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.helpful-links h3 {
  color: white;
  font-size: 1.25rem;
  margin: 0 0 1.5rem 0;
  font-weight: 600;
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.help-link {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.help-link:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.link-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.link-content {
  text-align: left;
  flex: 1;
}

.link-title {
  color: white;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.link-description {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .not-found-container {
    padding: 1rem;
  }

  .error-code {
    font-size: 6rem;
  }

  .error-icon {
    font-size: 3rem;
  }

  .error-message h1 {
    font-size: 2rem;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;
  }

  .action-button {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }

  .links-grid {
    grid-template-columns: 1fr;
  }

  .helpful-links {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .error-code {
    font-size: 4rem;
  }

  .error-icon {
    font-size: 2.5rem;
  }

  .error-message h1 {
    font-size: 1.75rem;
  }

  .error-message p {
    font-size: 1rem;
  }
}
</style>
