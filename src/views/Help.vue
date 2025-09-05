<script setup lang="ts">
import { ref } from 'vue'

const activeSection = ref('getting-started')

const sections = [
  { id: 'getting-started', title: '快速开始', icon: '🚀' },
  { id: 'scan-types', title: '扫描类型', icon: '🔍' },
  { id: 'results', title: '结果解读', icon: '📊' },
  { id: 'troubleshooting', title: '故障排除', icon: '🔧' },
  { id: 'faq', title: '常见问题', icon: '❓' },
  { id: 'api', title: 'API文档', icon: '📚' }
]

const faqItems = [
  {
    question: '扫描需要多长时间？',
    answer: '扫描时间取决于选择的检测项目和目标网站的响应速度，通常在30秒到5分钟之间。'
  },
  {
    question: '扫描是否会影响网站性能？',
    answer: '我们的扫描工具设计为轻量级，对目标网站的影响极小。扫描过程中只会发送必要的请求。'
  },
  {
    question: '可以扫描内网地址吗？',
    answer: '出于安全考虑，本工具仅支持扫描公网可访问的网站地址。'
  },
  {
    question: '扫描结果如何保存？',
    answer: '扫描结果会自动保存在浏览器本地存储中，您也可以导出为JSON格式的报告文件。'
  },
  {
    question: '如何提高网站安全评分？',
    answer: '根据扫描报告中的建议，配置SSL证书、添加安全头、修复发现的漏洞等。'
  }
]

const scrollToSection = (sectionId: string) => {
  activeSection.value = sectionId
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <div class="help-container">
    <div class="help-header">
      <h1>帮助文档</h1>
      <p>了解如何使用网站安全扫描器</p>
    </div>

    <div class="help-content">
      <!-- 侧边导航 -->
      <div class="help-sidebar">
        <nav class="help-nav">
          <a
            v-for="section in sections"
            :key="section.id"
            @click="scrollToSection(section.id)"
            class="nav-item"
            :class="{ active: activeSection === section.id }"
          >
            <span class="nav-icon">{{ section.icon }}</span>
            <span class="nav-text">{{ section.title }}</span>
          </a>
        </nav>
      </div>

      <!-- 主要内容 -->
      <div class="help-main">
        <!-- 快速开始 -->
        <section id="getting-started" class="help-section">
          <h2>🚀 快速开始</h2>

          <div class="step-guide">
            <div class="step">
              <div class="step-number">1</div>
              <div class="step-content">
                <h3>输入网站地址</h3>
                <p>在首页输入框中输入要检测的网站URL，确保包含协议（http://或https://）。</p>
                <div class="code-example">
                  <code>https://example.com</code>
                </div>
              </div>
            </div>

            <div class="step">
              <div class="step-number">2</div>
              <div class="step-content">
                <h3>选择检测项目</h3>
                <p>根据需要选择要进行的安全检测项目：</p>
                <ul>
                  <li><strong>SSL/TLS检测</strong> - 检查证书有效性和加密配置</li>
                  <li><strong>HTTP安全头</strong> - 分析安全相关的HTTP头</li>
                  <li><strong>端口扫描</strong> - 检测开放的网络端口</li>
                  <li><strong>漏洞检测</strong> - 扫描常见的安全漏洞</li>
                </ul>
              </div>
            </div>

            <div class="step">
              <div class="step-number">3</div>
              <div class="step-content">
                <h3>开始扫描</h3>
                <p>点击"开始检测"按钮，等待扫描完成。扫描过程中会显示实时进度。</p>
              </div>
            </div>

            <div class="step">
              <div class="step-number">4</div>
              <div class="step-content">
                <h3>查看结果</h3>
                <p>扫描完成后会自动跳转到结果页面，显示详细的安全评估报告。</p>
              </div>
            </div>
          </div>
        </section>

        <!-- 扫描类型 -->
        <section id="scan-types" class="help-section">
          <h2>🔍 扫描类型详解</h2>

          <div class="scan-types">
            <div class="scan-type">
              <div class="type-header">
                <h3>🔒 SSL/TLS 安全检测</h3>
              </div>
              <div class="type-content">
                <p>检查网站的SSL/TLS配置，包括：</p>
                <ul>
                  <li>证书有效性和过期时间</li>
                  <li>支持的TLS协议版本</li>
                  <li>加密算法强度</li>
                  <li>证书链完整性</li>
                </ul>
              </div>
            </div>

            <div class="scan-type">
              <div class="type-header">
                <h3>🛡️ HTTP 安全头检测</h3>
              </div>
              <div class="type-content">
                <p>分析HTTP响应头中的安全配置：</p>
                <ul>
                  <li>Content-Security-Policy (CSP)</li>
                  <li>X-Frame-Options</li>
                  <li>X-Content-Type-Options</li>
                  <li>Strict-Transport-Security (HSTS)</li>
                  <li>X-XSS-Protection</li>
                </ul>
              </div>
            </div>

            <div class="scan-type">
              <div class="type-header">
                <h3>🔌 端口扫描</h3>
              </div>
              <div class="type-content">
                <p>检测目标服务器开放的网络端口：</p>
                <ul>
                  <li>常见服务端口（80, 443, 22, 21等）</li>
                  <li>危险端口识别</li>
                  <li>服务版本检测</li>
                  <li>端口状态分析</li>
                </ul>
              </div>
            </div>

            <div class="scan-type">
              <div class="type-header">
                <h3>🐛 漏洞检测</h3>
              </div>
              <div class="type-content">
                <p>扫描常见的Web安全漏洞：</p>
                <ul>
                  <li>SQL注入漏洞</li>
                  <li>跨站脚本攻击(XSS)</li>
                  <li>跨站请求伪造(CSRF)</li>
                  <li>目录遍历漏洞</li>
                  <li>敏感信息泄露</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- 结果解读 -->
        <section id="results" class="help-section">
          <h2>📊 结果解读</h2>

          <div class="results-guide">
            <div class="score-explanation">
              <h3>评分系统</h3>
              <div class="score-ranges">
                <div class="score-range excellent">
                  <div class="score-color"></div>
                  <div class="score-info">
                    <strong>90-100分</strong>
                    <span>优秀 - 安全配置完善</span>
                  </div>
                </div>
                <div class="score-range good">
                  <div class="score-color"></div>
                  <div class="score-info">
                    <strong>70-89分</strong>
                    <span>良好 - 基本安全要求满足</span>
                  </div>
                </div>
                <div class="score-range warning">
                  <div class="score-color"></div>
                  <div class="score-info">
                    <strong>50-69分</strong>
                    <span>警告 - 存在安全风险</span>
                  </div>
                </div>
                <div class="score-range danger">
                  <div class="score-color"></div>
                  <div class="score-info">
                    <strong>0-49分</strong>
                    <span>危险 - 严重安全问题</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="issue-types">
              <h3>问题类型</h3>
              <div class="issue-list">
                <div class="issue-type">
                  <span class="issue-icon success">✓</span>
                  <div class="issue-info">
                    <strong>成功</strong>
                    <span>配置正确，无需修改</span>
                  </div>
                </div>
                <div class="issue-type">
                  <span class="issue-icon info">ℹ</span>
                  <div class="issue-info">
                    <strong>信息</strong>
                    <span>一般性信息，可选优化</span>
                  </div>
                </div>
                <div class="issue-type">
                  <span class="issue-icon warning">⚠</span>
                  <div class="issue-info">
                    <strong>警告</strong>
                    <span>建议修复的安全问题</span>
                  </div>
                </div>
                <div class="issue-type">
                  <span class="issue-icon error">✗</span>
                  <div class="issue-info">
                    <strong>错误</strong>
                    <span>需要立即修复的严重问题</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 故障排除 -->
        <section id="troubleshooting" class="help-section">
          <h2>🔧 故障排除</h2>

          <div class="troubleshooting-list">
            <div class="trouble-item">
              <h3>扫描失败或超时</h3>
              <div class="trouble-solutions">
                <p><strong>可能原因：</strong></p>
                <ul>
                  <li>目标网站响应缓慢或不可访问</li>
                  <li>网络连接问题</li>
                  <li>防火墙阻止访问</li>
                </ul>
                <p><strong>解决方案：</strong></p>
                <ul>
                  <li>检查网站地址是否正确</li>
                  <li>确认网站可以正常访问</li>
                  <li>稍后重试扫描</li>
                </ul>
              </div>
            </div>

            <div class="trouble-item">
              <h3>部分检测项目失败</h3>
              <div class="trouble-solutions">
                <p><strong>可能原因：</strong></p>
                <ul>
                  <li>目标网站限制某些类型的请求</li>
                  <li>服务器配置特殊</li>
                </ul>
                <p><strong>解决方案：</strong></p>
                <ul>
                  <li>尝试减少检测项目</li>
                  <li>联系网站管理员确认访问权限</li>
                </ul>
              </div>
            </div>

            <div class="trouble-item">
              <h3>结果显示不准确</h3>
              <div class="trouble-solutions">
                <p><strong>可能原因：</strong></p>
                <ul>
                  <li>CDN或代理服务器影响</li>
                  <li>网站使用了特殊的安全配置</li>
                </ul>
                <p><strong>解决方案：</strong></p>
                <ul>
                  <li>尝试扫描网站的直接IP地址</li>
                  <li>参考多个安全检测工具的结果</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- 常见问题 -->
        <section id="faq" class="help-section">
          <h2>❓ 常见问题</h2>

          <div class="faq-list">
            <div v-for="(item, index) in faqItems" :key="index" class="faq-item">
              <h3 class="faq-question">{{ item.question }}</h3>
              <p class="faq-answer">{{ item.answer }}</p>
            </div>
          </div>
        </section>

        <!-- API文档 -->
        <section id="api" class="help-section">
          <h2>📚 API文档</h2>

          <div class="api-docs">
            <div class="api-section">
              <h3>扫描接口</h3>
              <div class="api-endpoint">
                <div class="method">POST</div>
                <div class="url">/api/scan</div>
              </div>
              <div class="api-description">
                <p>启动网站安全扫描</p>
                <h4>请求参数：</h4>
                <div class="code-block">
                  <pre><code>{
  "url": "https://example.com",
  "options": {
    "ssl": true,
    "headers": true,
    "ports": false,
    "vulnerabilities": true
  }
}</code></pre>
                </div>
                <h4>响应示例：</h4>
                <div class="code-block">
                  <pre><code>{
  "scanId": "12345",
  "status": "started",
  "estimatedTime": 60
}</code></pre>
                </div>
              </div>
            </div>

            <div class="api-section">
              <h3>结果查询接口</h3>
              <div class="api-endpoint">
                <div class="method">GET</div>
                <div class="url">/api/scan/{scanId}</div>
              </div>
              <div class="api-description">
                <p>查询扫描结果</p>
                <h4>响应示例：</h4>
                <div class="code-block">
                  <pre><code>{
  "scanId": "12345",
  "status": "completed",
  "overallScore": 85,
  "results": {
    "ssl": { "score": 90, "issues": [...] },
    "headers": { "score": 80, "issues": [...] }
  }
}</code></pre>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  </div>
</template>

<style scoped>
.help-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.help-header {
  text-align: center;
  margin-bottom: 3rem;
}

.help-header h1 {
  color: white;
  font-size: 2.5rem;
  margin: 0 0 0.5rem 0;
  font-weight: 700;
}

.help-header p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
  margin: 0;
}

.help-content {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 2rem;
  align-items: start;
}

.help-sidebar {
  position: sticky;
  top: 2rem;
}

.help-nav {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  color: #7f8c8d;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.nav-item:hover {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
}

.nav-item.active {
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
}

.nav-icon {
  font-size: 1.1rem;
}

.nav-text {
  font-size: 0.9rem;
}

.help-main {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.help-section {
  padding: 2rem;
  border-bottom: 1px solid #f1f3f4;
}

.help-section:last-child {
  border-bottom: none;
}

.help-section h2 {
  color: #2c3e50;
  font-size: 1.8rem;
  margin: 0 0 2rem 0;
  font-weight: 700;
}

.step-guide {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.step {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
}

.step-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3498db, #2980b9);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-content h3 {
  color: #2c3e50;
  margin: 0 0 0.75rem 0;
  font-size: 1.25rem;
}

.step-content p {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.step-content ul {
  color: #7f8c8d;
  line-height: 1.6;
  padding-left: 1.5rem;
}

.step-content li {
  margin-bottom: 0.5rem;
}

.code-example {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 1rem;
  font-family: 'Monaco', 'Consolas', monospace;
}

.code-example code {
  color: #e74c3c;
  font-weight: 600;
}

.scan-types {
  display: grid;
  gap: 1.5rem;
}

.scan-type {
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  overflow: hidden;
}

.type-header {
  background: #f8f9fa;
  padding: 1rem;
  border-bottom: 1px solid #e1e8ed;
}

.type-header h3 {
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
}

.type-content {
  padding: 1rem;
}

.type-content p {
  color: #7f8c8d;
  margin-bottom: 1rem;
}

.type-content ul {
  color: #7f8c8d;
  line-height: 1.6;
  padding-left: 1.5rem;
  margin: 0;
}

.type-content li {
  margin-bottom: 0.5rem;
}

.results-guide {
  display: grid;
  gap: 2rem;
}

.score-explanation h3,
.issue-types h3 {
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1.25rem;
}

.score-ranges {
  display: grid;
  gap: 1rem;
}

.score-range {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: #f8f9fa;
}

.score-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

.score-range.excellent .score-color {
  background: #27ae60;
}

.score-range.good .score-color {
  background: #f39c12;
}

.score-range.warning .score-color {
  background: #e67e22;
}

.score-range.danger .score-color {
  background: #e74c3c;
}

.score-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.score-info strong {
  color: #2c3e50;
}

.score-info span {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.issue-list {
  display: grid;
  gap: 1rem;
}

.issue-type {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  border-radius: 8px;
  background: #f8f9fa;
}

.issue-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 0.9rem;
}

.issue-icon.success {
  background: #d4edda;
  color: #155724;
}

.issue-icon.info {
  background: #d1ecf1;
  color: #0c5460;
}

.issue-icon.warning {
  background: #fff3cd;
  color: #856404;
}

.issue-icon.error {
  background: #f8d7da;
  color: #721c24;
}

.issue-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.issue-info strong {
  color: #2c3e50;
}

.issue-info span {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.troubleshooting-list {
  display: grid;
  gap: 2rem;
}

.trouble-item {
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  padding: 1.5rem;
}

.trouble-item h3 {
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.trouble-solutions p {
  color: #7f8c8d;
  margin-bottom: 0.75rem;
}

.trouble-solutions strong {
  color: #2c3e50;
}

.trouble-solutions ul {
  color: #7f8c8d;
  line-height: 1.6;
  padding-left: 1.5rem;
  margin-bottom: 1rem;
}

.trouble-solutions li {
  margin-bottom: 0.5rem;
}

.faq-list {
  display: grid;
  gap: 1.5rem;
}

.faq-item {
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  padding: 1.5rem;
}

.faq-question {
  color: #2c3e50;
  margin: 0 0 1rem 0;
  font-size: 1.1rem;
}

.faq-answer {
  color: #7f8c8d;
  line-height: 1.6;
  margin: 0;
}

.api-docs {
  display: grid;
  gap: 2rem;
}

.api-section {
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  overflow: hidden;
}

.api-section h3 {
  background: #f8f9fa;
  padding: 1rem;
  margin: 0;
  color: #2c3e50;
  font-size: 1.1rem;
  border-bottom: 1px solid #e1e8ed;
}

.api-endpoint {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e1e8ed;
}

.method {
  background: #27ae60;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-weight: 600;
  font-size: 0.8rem;
}

.url {
  font-family: 'Monaco', 'Consolas', monospace;
  color: #2c3e50;
  font-weight: 600;
}

.api-description {
  padding: 1rem;
}

.api-description p {
  color: #7f8c8d;
  margin-bottom: 1rem;
}

.api-description h4 {
  color: #2c3e50;
  margin: 1.5rem 0 0.75rem 0;
  font-size: 1rem;
}

.code-block {
  background: #2c3e50;
  border-radius: 6px;
  padding: 1rem;
  margin-bottom: 1rem;
  overflow-x: auto;
}

.code-block pre {
  margin: 0;
  color: #ecf0f1;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 0.9rem;
  line-height: 1.4;
}

@media (max-width: 768px) {
  .help-container {
    padding: 1rem;
  }

  .help-content {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .help-sidebar {
    position: static;
  }

  .help-nav {
    display: flex;
    overflow-x: auto;
    gap: 0.5rem;
    padding: 1rem;
  }

  .nav-item {
    white-space: nowrap;
    margin-bottom: 0;
  }

  .help-section {
    padding: 1.5rem;
  }

  .step {
    flex-direction: column;
    gap: 1rem;
  }

  .score-ranges,
  .issue-list {
    gap: 0.75rem;
  }

  .score-range,
  .issue-type {
    padding: 0.75rem;
  }
}
</style>
