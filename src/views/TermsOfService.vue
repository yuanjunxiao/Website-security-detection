<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}

const sections = ref([
  {
    title: '服务说明',
    content: `网站安全检测平台是一个免费的在线安全检测工具，提供以下服务：
• SSL/TLS安全配置检测
• HTTP安全头分析
• 常见Web漏洞扫描
• 端口安全检测
• 安全评分和修复建议
• 扫描历史记录管理`
  },
  {
    title: '用户责任',
    content: `使用我们的服务时，您需要：
• 确保您有权对目标网站进行安全检测
• 不得使用本服务进行恶意攻击或非法活动
• 不得尝试绕过或破坏我们的安全措施
• 遵守所有适用的法律法规
• 对您的账户和密码安全负责
• 及时更新您的联系信息`
  },
  {
    title: '使用限制',
    content: `为确保服务质量，我们设置了以下限制：
• 每个IP地址每小时最多进行50次扫描
• 单次扫描超时时间为5分钟
• 禁止使用自动化工具进行批量扫描
• 禁止对同一目标进行频繁重复扫描
• 我们保留在必要时限制或暂停服务的权利`
  },
  {
    title: '免责声明',
    content: `请注意以下重要声明：
• 本服务仅供参考，不能替代专业的安全审计
• 我们不保证检测结果的完整性和准确性
• 我们不对因使用本服务而造成的任何损失负责
• 第三方网站的安全性由其所有者负责
• 我们不承担因网络中断、系统故障等原因导致的服务中断责任`
  },
  {
    title: '知识产权',
    content: `关于知识产权的说明：
• 本平台的所有内容均受知识产权法保护
• 用户不得复制、修改、分发我们的软件或内容
• 腾讯云安全SDK的使用遵循其相应的许可协议
• 用户提交的URL信息不会被我们声明所有权
• 检测报告可供用户自由使用和分享`
  },
  {
    title: '数据处理',
    content: `关于数据处理的规定：
• 我们仅在提供服务期间临时处理您的数据
• 扫描完成后，临时数据将被自动删除
• 我们不会存储或分析您的网站内容
• 统计数据可能用于改进服务质量
• 我们遵循GDPR和其他数据保护法规`
  },
  {
    title: '服务变更',
    content: `我们保留以下权利：
• 随时修改、暂停或终止服务
• 更新检测算法和评分标准
• 调整使用限制和服务条款
• 增加或删除功能特性
• 重大变更将提前通知用户`
  },
  {
    title: '争议解决',
    content: `如发生争议，将按以下方式处理：
• 优先通过友好协商解决
• 适用中华人民共和国法律
• 争议由深圳市南山区人民法院管辖
• 仲裁程序按照中国国际经济贸易仲裁委员会规则进行
• 用户可通过客服渠道寻求帮助`
  }
])

const lastUpdated = '2024年1月1日'
</script>

<template>
  <div class="terms-container">
    <div class="terms-header">
      <button @click="goBack" class="back-button">
        ← 返回
      </button>
      <div class="header-content">
        <h1>服务条款</h1>
        <p class="subtitle">使用我们的服务前请仔细阅读</p>
        <div class="last-updated">最后更新：{{ lastUpdated }}</div>
      </div>
    </div>

    <div class="terms-content">
      <div class="introduction">
        <h2>重要提示</h2>
        <div class="important-notice">
          <div class="notice-icon">⚠️</div>
          <div class="notice-text">
            <p>
              <strong>请仔细阅读本服务条款</strong>。使用网站安全检测平台即表示您同意遵守本条款的所有规定。
              如果您不同意本条款的任何部分，请不要使用我们的服务。
            </p>
          </div>
        </div>
        <p>
          本服务条款构成您与网站安全检测平台之间的法律协议。我们保留随时修改本条款的权利，
          修改后的条款将在网站上公布并立即生效。继续使用服务即表示您接受修改后的条款。
        </p>
      </div>

      <div class="terms-sections">
        <div
          v-for="(section, index) in sections"
          :key="index"
          class="terms-section"
        >
          <h3>{{ index + 1 }}. {{ section.title }}</h3>
          <div class="section-content" v-html="section.content.replace(/\n/g, '<br>')"></div>
        </div>
      </div>

      <div class="acceptance-section">
        <h3>条款接受</h3>
        <div class="acceptance-content">
          <p>
            通过访问和使用网站安全检测平台，您确认：
          </p>
          <ul class="acceptance-list">
            <li>您已仔细阅读并完全理解本服务条款</li>
            <li>您同意受本条款的约束</li>
            <li>您具有签署本协议的法律能力</li>
            <li>您将遵守所有适用的法律法规</li>
          </ul>
          <div class="signature-note">
            <strong>电子签名效力：</strong>
            您在网站上的任何操作都被视为您的电子签名，具有与手写签名同等的法律效力。
          </div>
        </div>
      </div>

      <div class="contact-section">
        <h3>联系我们</h3>
        <p>
          如果您对本服务条款有任何疑问或需要帮助，请联系我们：
        </p>
        <div class="contact-info">
          <div class="contact-item">
            <strong>客服邮箱：</strong> support@websecurity.xin
          </div>
          <div class="contact-item">
            <strong>法务邮箱：</strong> legal@websecurity.xin
          </div>
          <div class="contact-item">
            <strong>公司地址：</strong> 中国深圳市南山区腾讯大厦
          </div>
          <div class="contact-item">
            <strong>服务时间：</strong> 工作日 9:00-18:00 (GMT+8)
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.terms-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
}

.terms-header {
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

.terms-content {
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

.important-notice {
  display: flex;
  gap: 1rem;
  background: linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%);
  border: 1px solid #ffc107;
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1.5rem 0;
}

.notice-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.notice-text p {
  margin: 0;
  color: #856404;
  line-height: 1.6;
}

.introduction p {
  color: #4a5568;
  line-height: 1.8;
  margin-bottom: 1rem;
  font-size: 1rem;
}

.terms-sections {
  margin-bottom: 3rem;
}

.terms-section {
  margin-bottom: 2.5rem;
  padding: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.terms-section:hover {
  border-color: #667eea;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.1);
}

.terms-section h3 {
  color: #2d3748;
  font-size: 1.4rem;
  margin: 0 0 1rem 0;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.terms-section h3::before {
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

.acceptance-section {
  background: linear-gradient(135deg, #e6fffa 0%, #b2f5ea 100%);
  padding: 2rem;
  border-radius: 12px;
  border: 1px solid #38b2ac;
  margin-bottom: 2rem;
}

.acceptance-section h3 {
  color: #234e52;
  font-size: 1.4rem;
  margin: 0 0 1rem 0;
  font-weight: 600;
}

.acceptance-content p {
  color: #2c7a7b;
  line-height: 1.7;
  margin-bottom: 1rem;
  font-weight: 500;
}

.acceptance-list {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
}

.acceptance-list li {
  color: #2c7a7b;
  padding: 0.5rem 0;
  padding-left: 1.5rem;
  position: relative;
  line-height: 1.6;
}

.acceptance-list li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #38b2ac;
  font-weight: bold;
  font-size: 1.1rem;
}

.signature-note {
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #38b2ac;
  margin-top: 1.5rem;
  color: #2c7a7b;
  font-size: 0.9rem;
  line-height: 1.6;
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
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.contact-item:last-child {
  margin-bottom: 0;
}

.contact-item strong {
  color: #2d3748;
  font-weight: 600;
  min-width: 80px;
}

@media (max-width: 768px) {
  .terms-container {
    padding: 1rem;
  }

  .terms-header {
    flex-direction: column;
    gap: 1rem;
  }

  .header-content h1 {
    font-size: 2.2rem;
  }

  .subtitle {
    font-size: 1rem;
  }

  .terms-content {
    padding: 2rem 1.5rem;
  }

  .terms-section {
    padding: 1.5rem;
  }

  .acceptance-section,
  .contact-section {
    padding: 1.5rem;
  }

  .important-notice {
    flex-direction: column;
    gap: 0.5rem;
  }
}

@media (max-width: 480px) {
  .terms-container {
    padding: 0.5rem;
  }

  .header-content h1 {
    font-size: 1.8rem;
  }

  .terms-content {
    padding: 1.5rem 1rem;
  }

  .terms-section {
    padding: 1rem;
  }

  .terms-section h3 {
    font-size: 1.2rem;
  }

  .contact-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }

  .contact-item strong {
    min-width: auto;
  }
}
</style>
