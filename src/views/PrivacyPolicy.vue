<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const sections = ref([
  {
    title: '信息收集',
    content: `我们收集的信息类型包括：
• 您主动提供的信息：包括您输入的网站URL、扫描选项等
• 自动收集的信息：包括IP地址、浏览器类型、访问时间等技术信息
• Google登录信息：如您选择使用Google登录，我们会收集您的基本资料信息`
  },
  {
    title: '信息使用',
    content: `我们使用收集的信息用于：
• 提供网站安全检测服务
• 改进和优化我们的服务质量
• 进行安全分析和威胁检测
• 提供技术支持和客户服务
• 遵守法律法规要求`
  },
  {
    title: '信息保护',
    content: `我们采取以下措施保护您的信息：
• 使用HTTPS加密传输所有数据
• 实施严格的访问控制和权限管理
• 定期进行安全审计和漏洞扫描
• 不会将您的个人信息出售给第三方
• 扫描历史仅存储在您的本地浏览器中`
  },
  {
    title: '数据存储',
    content: `关于数据存储的说明：
• 扫描历史记录仅存储在您的本地浏览器中
• 我们不会在服务器端永久存储您的扫描记录
• 临时处理数据会在扫描完成后自动删除
• 您可以随时清除本地存储的数据`
  },
  {
    title: '第三方服务',
    content: `我们使用的第三方服务包括：
• 腾讯云安全SDK：用于网站安全检测
• Google Analytics：用于网站访问统计分析
• Google OAuth：用于用户身份验证
• 这些服务都有各自的隐私政策，请查阅相关条款`
  },
  {
    title: '用户权利',
    content: `您享有以下权利：
• 访问权：您可以要求查看我们收集的关于您的信息
• 更正权：您可以要求更正不准确的个人信息
• 删除权：您可以要求删除您的个人信息
• 限制处理权：您可以要求限制对您信息的处理
• 数据可携权：您可以要求获取您的数据副本`
  },
  {
    title: 'Cookie使用',
    content: `我们使用Cookie和类似技术：
• 必要Cookie：确保网站正常运行
• 功能Cookie：记住您的偏好设置
• 分析Cookie：帮助我们了解网站使用情况
• 您可以通过浏览器设置管理Cookie偏好`
  },
  {
    title: '政策更新',
    content: `我们可能会不时更新本隐私政策：
• 重大变更会通过网站公告通知用户
• 建议您定期查看本政策的最新版本
• 继续使用我们的服务即表示您同意更新后的政策`
  }
])

const lastUpdated = '2024年1月1日'
</script>

<template>
  <div class="privacy-policy-container">
    <div class="policy-header">
      <button @click="goBack" class="back-button">
        ← 返回
      </button>
      <div class="header-content">
        <h1>隐私权政策</h1>
        <p class="subtitle">我们重视并保护您的隐私权</p>
        <div class="last-updated">最后更新：{{ lastUpdated }}</div>
      </div>
    </div>

    <div class="policy-content">
      <div class="introduction">
        <h2>引言</h2>
        <p>
          欢迎使用网站安全检测平台。我们深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。
          我们致力于维持您对我们的信任，恪守以下原则，保护您的个人信息：权责一致原则、目的明确原则、
          选择同意原则、最少够用原则、确保安全原则、主体参与原则、公开透明原则等。
        </p>
        <p>
          本隐私政策适用于您通过网站安全检测平台网站、移动应用程序等方式访问和使用我们的产品与/或服务。
        </p>
      </div>

      <div class="policy-sections">
        <div
          v-for="(section, index) in sections"
          :key="index"
          class="policy-section"
        >
          <h3>{{ index + 1 }}. {{ section.title }}</h3>
          <div class="section-content" v-html="section.content.replace(/\n/g, '<br>')"></div>
        </div>
      </div>

      <div class="contact-section">
        <h3>联系我们</h3>
        <p>
          如果您对本隐私政策有任何疑问、意见或建议，请通过以下方式与我们联系：
        </p>
        <div class="contact-info">
          <div class="contact-item">
            <strong>邮箱：</strong> privacy@websecurity.xin
          </div>
          <div class="contact-item">
            <strong>地址：</strong> 中国深圳市南山区腾讯大厦
          </div>
        </div>
        <p class="contact-note">
          我们将在收到您的反馈后尽快回复并处理您的请求。
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.privacy-policy-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}

.policy-header {
  display: flex;
  align-items: flex-start;
  gap: 2rem;
  margin-bottom: 3rem;
}

.back-button {
  padding: 0.75rem 1.5rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  font-weight: 500;
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.header-content {
  flex: 1;
}

.header-content h1 {
  color: white;
  font-size: 3rem;
  margin: 0 0 1rem 0;
  font-weight: 700;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  margin: 0 0 1rem 0;
  font-weight: 300;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.last-updated {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  display: inline-block;
}

.policy-content {
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.introduction {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #f1f5f9;
}

.introduction h2 {
  color: #1a202c;
  font-size: 1.8rem;
  margin: 0 0 1.5rem 0;
  font-weight: 600;
}

.introduction p {
  color: #4a5568;
  line-height: 1.8;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.policy-sections {
  margin-bottom: 3rem;
}

.policy-section {
  margin-bottom: 2.5rem;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.policy-section:hover {
  border-color: #667eea;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.1);
}

.policy-section h3 {
  color: #2d3748;
  font-size: 1.4rem;
  margin: 0 0 1rem 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.policy-section h3::before {
  content: '';
  width: 4px;
  height: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 2px;
}

.section-content {
  color: #4a5568;
  line-height: 1.7;
  font-size: 0.95rem;
}

.contact-section {
  background: linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.contact-section h3 {
  color: #2d3748;
  font-size: 1.4rem;
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.contact-section p {
  color: #4a5568;
  line-height: 1.7;
  margin-bottom: 1.5rem;
}

.contact-info {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  border: 1px solid #e2e8f0;
}

.contact-item {
  color: #4a5568;
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
}

.contact-item:last-child {
  margin-bottom: 0;
}

.contact-item strong {
  color: #2d3748;
  font-weight: 600;
}

.contact-note {
  font-size: 0.9rem;
  color: #718096;
  font-style: italic;
  margin-bottom: 0;
}

@media (max-width: 768px) {
  .privacy-policy-container {
    padding: 1rem;
  }

  .policy-header {
    flex-direction: column;
    gap: 1rem;
  }

  .header-content h1 {
    font-size: 2.2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .policy-content {
    padding: 2rem 1.5rem;
  }

  .policy-section {
    padding: 1.5rem;
  }

  .contact-section {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .privacy-policy-container {
    padding: 0.5rem;
  }

  .header-content h1 {
    font-size: 1.8rem;
  }

  .policy-content {
    padding: 1.5rem 1rem;
  }

  .policy-section {
    padding: 1rem;
  }

  .policy-section h3 {
    font-size: 1.2rem;
  }
}
</style>
