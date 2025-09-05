<script setup lang="ts">
import { ref } from 'vue'

const version = '1.0.0'
const buildDate = new Date().toLocaleDateString('zh-CN')

const features = [
  {
    icon: '🔒',
    title: 'SSL/TLS 检测',
    description: '全面检查SSL证书有效性、加密强度和协议配置'
  },
  {
    icon: '🛡️',
    title: 'HTTP 安全头',
    description: '分析关键安全头配置，提供详细的安全建议'
  },
  {
    icon: '🔌',
    title: '端口扫描',
    description: '检测开放端口，识别潜在的安全风险'
  },
  {
    icon: '🐛',
    title: '漏洞检测',
    description: '扫描常见Web安全漏洞，如XSS、SQL注入等'
  },
  {
    icon: '📊',
    title: '详细报告',
    description: '生成专业的安全评估报告，支持导出'
  },
  {
    icon: '📱',
    title: '响应式设计',
    description: '完美适配桌面和移动设备'
  }
]

const teamMembers = [
  {
    name: 'CodeBuddy',
    role: '首席开发工程师',
    avatar: '👨‍💻',
    description: '负责系统架构设计和核心功能开发'
  },
  {
    name: 'Security Expert',
    role: '安全专家',
    avatar: '🔐',
    description: '提供安全检测算法和漏洞识别技术'
  },
  {
    name: 'UI Designer',
    role: 'UI/UX 设计师',
    avatar: '🎨',
    description: '负责用户界面设计和用户体验优化'
  }
]

const techStack = [
  { name: 'Vue 3', description: '现代化前端框架' },
  { name: 'TypeScript', description: '类型安全的JavaScript' },
  { name: 'Pinia', description: '状态管理库' },
  { name: 'Vue Router', description: '路由管理' },
  { name: 'Vite', description: '快速构建工具' }
]

const contactEmail = 'security@example.com'
const githubUrl = 'https://github.com/example/website-security-scanner'
const documentationUrl = '/help'
</script>

<template>
  <div class="about-container">
    <!-- 头部介绍 -->
    <div class="about-header">
      <div class="logo-section">
        <div class="app-logo">🔒</div>
        <h1>网站安全扫描器</h1>
        <p class="version">版本 {{ version }}</p>
      </div>

      <div class="intro-text">
        <p>
          一个专业的网站安全检测工具，帮助您快速识别和评估网站的安全风险。
          通过多维度的安全检测，为您的网站安全保驾护航。
        </p>
      </div>
    </div>

    <!-- 功能特性 -->
    <div class="features-section">
      <h2>🚀 核心功能</h2>
      <div class="features-grid">
        <div v-for="feature in features" :key="feature.title" class="feature-card">
          <div class="feature-icon">{{ feature.icon }}</div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </div>

    <!-- 技术栈 -->
    <div class="tech-section">
      <h2>⚡ 技术栈</h2>
      <div class="tech-grid">
        <div v-for="tech in techStack" :key="tech.name" class="tech-item">
          <div class="tech-name">{{ tech.name }}</div>
          <div class="tech-description">{{ tech.description }}</div>
        </div>
      </div>
    </div>

    <!-- 开发团队 -->
    <div class="team-section">
      <h2>👥 开发团队</h2>
      <div class="team-grid">
        <div v-for="member in teamMembers" :key="member.name" class="team-card">
          <div class="member-avatar">{{ member.avatar }}</div>
          <h3>{{ member.name }}</h3>
          <div class="member-role">{{ member.role }}</div>
          <p>{{ member.description }}</p>
        </div>
      </div>
    </div>

    <!-- 项目信息 -->
    <div class="project-info">
      <h2>📋 项目信息</h2>
      <div class="info-grid">
        <div class="info-item">
          <div class="info-label">版本号</div>
          <div class="info-value">{{ version }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">构建日期</div>
          <div class="info-value">{{ buildDate }}</div>
        </div>
        <div class="info-item">
          <div class="info-label">开发框架</div>
          <div class="info-value">Vue 3 + TypeScript</div>
        </div>
        <div class="info-item">
          <div class="info-label">许可证</div>
          <div class="info-value">MIT License</div>
        </div>
      </div>
    </div>

    <!-- 联系方式 -->
    <div class="contact-section">
      <h2>📞 联系我们</h2>
      <div class="contact-content">
        <p>如果您有任何问题、建议或需要技术支持，请随时联系我们：</p>

        <div class="contact-methods">
          <a :href="`mailto:${contactEmail}`" class="contact-item">
            <span class="contact-icon">📧</span>
            <div class="contact-info">
              <div class="contact-title">邮箱联系</div>
              <div class="contact-detail">{{ contactEmail }}</div>
            </div>
          </a>

          <a :href="githubUrl" target="_blank" class="contact-item">
            <span class="contact-icon">🐙</span>
            <div class="contact-info">
              <div class="contact-title">GitHub</div>
              <div class="contact-detail">查看源代码</div>
            </div>
          </a>

          <router-link :to="documentationUrl" class="contact-item">
            <span class="contact-icon">📚</span>
            <div class="contact-info">
              <div class="contact-title">帮助文档</div>
              <div class="contact-detail">使用指南</div>
            </div>
          </router-link>
        </div>
      </div>
    </div>

    <!-- 免责声明 -->
    <div class="disclaimer-section">
      <h2>⚠️ 免责声明</h2>
      <div class="disclaimer-content">
        <p>
          本工具仅用于合法的安全检测目的。使用本工具时，请确保：
        </p>
        <ul>
          <li>仅对您拥有或已获得授权的网站进行扫描</li>
          <li>遵守相关法律法规和网站的使用条款</li>
          <li>不将扫描结果用于恶意攻击或非法用途</li>
          <li>理解扫描结果仅供参考，不保证100%准确</li>
        </ul>
        <p>
          开发团队不对因使用本工具而产生的任何直接或间接损失承担责任。
        </p>
      </div>
    </div>

    <!-- 版权信息 -->
    <div class="copyright-section">
      <p>&copy; 2024 网站安全扫描器. All rights reserved.</p>
      <p>Built with ❤️ using Vue 3 and TypeScript</p>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.about-header {
  text-align: center;
  margin-bottom: 4rem;
}

.logo-section {
  margin-bottom: 2rem;
}

.app-logo {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.about-header h1 {
  color: white;
  font-size: 3rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.version {
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  margin: 0;
}

.intro-text {
  max-width: 600px;
  margin: 0 auto;
}

.intro-text p {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  line-height: 1.6;
  margin: 0;
}

.features-section,
.tech-section,
.team-section,
.project-info,
.contact-section,
.disclaimer-section {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.features-section h2,
.tech-section h2,
.team-section h2,
.project-info h2,
.contact-section h2,
.disclaimer-section h2 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin: 0 0 2rem 0;
  font-weight: 700;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  padding: 1.5rem;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  border-color: #3498db;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(52, 152, 219, 0.15);
}

.feature-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  color: #2c3e50;
  font-size: 1.25rem;
  margin: 0 0 1rem 0;
}

.feature-card p {
  color: #7f8c8d;
  line-height: 1.5;
  margin: 0;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.tech-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.tech-name {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.tech-description {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.team-card {
  text-align: center;
  padding: 1.5rem;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.team-card:hover {
  border-color: #3498db;
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(52, 152, 219, 0.15);
}

.member-avatar {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.team-card h3 {
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.member-role {
  color: #3498db;
  font-weight: 600;
  margin-bottom: 1rem;
}

.team-card p {
  color: #7f8c8d;
  line-height: 1.5;
  margin: 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.info-item {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  color: #7f8c8d;
  font-weight: 500;
}

.info-value {
  color: #2c3e50;
  font-weight: 600;
}

.contact-content p {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.contact-methods {
  display: grid;
  gap: 1rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.contact-item:hover {
  border-color: #3498db;
  background: rgba(52, 152, 219, 0.05);
}

.contact-icon {
  font-size: 1.5rem;
}

.contact-title {
  color: #2c3e50;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.contact-detail {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.disclaimer-content p {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.disclaimer-content ul {
  color: #7f8c8d;
  line-height: 1.6;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.disclaimer-content li {
  margin-bottom: 0.5rem;
}

.copyright-section {
  text-align: center;
  padding: 2rem;
  color: rgba(255, 255, 255, 0.7);
}

.copyright-section p {
  margin: 0.5rem 0;
}

@media (max-width: 768px) {
  .about-container {
    padding: 1rem;
  }

  .about-header h1 {
    font-size: 2.5rem;
  }

  .app-logo {
    font-size: 3rem;
  }

  .intro-text p {
    font-size: 1.1rem;
  }

  .features-section,
  .tech-section,
  .team-section,
  .project-info,
  .contact-section,
  .disclaimer-section {
    padding: 1.5rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .team-grid {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .info-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style>
