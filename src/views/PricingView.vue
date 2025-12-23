<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/userStore'
import { getProducts, createOrder, simulatePayment, type Product } from '../api/orderService'
import { triggerGoogleSignIn } from '../api/googleAuthService'
import { getUserScanQuota } from '../api/scanServiceV2'

const router = useRouter()
const userStore = useUserStore()

const products = ref<Product[]>([])
const isLoading = ref(true)
const selectedProduct = ref<string | null>(null)
const selectedPayment = ref<'wechat' | 'alipay'>('wechat')
const showPaymentModal = ref(false)
const showLoginPrompt = ref(false)
const isProcessing = ref(false)
const orderInfo = ref<any>(null)
const errorMessage = ref('')

// 加载产品列表
const loadProducts = async () => {
  try {
    isLoading.value = true
    products.value = await getProducts()
  } catch (error) {
    console.error('Failed to load products:', error)
  } finally {
    isLoading.value = false
  }
}

// 加载用户配额
const loadQuota = async () => {
  if (userStore.isAuthenticated) {
    try {
      const quota = await getUserScanQuota()
      userStore.setScanQuota(quota)
    } catch (error) {
      console.error('Failed to load quota:', error)
    }
  }
}

onMounted(() => {
  loadProducts()
  loadQuota()
})

// 选择产品
const selectProduct = (productId: string) => {
  if (!userStore.isAuthenticated) {
    showLoginPrompt.value = true
    return
  }
  
  selectedProduct.value = productId
  showPaymentModal.value = true
  errorMessage.value = ''
}

// 处理登录
const handleLogin = () => {
  showLoginPrompt.value = false
  triggerGoogleSignIn()
}

// 创建订单
const handleCreateOrder = async () => {
  if (!selectedProduct.value) return
  
  isProcessing.value = true
  errorMessage.value = ''
  
  try {
    const result = await createOrder(selectedProduct.value, selectedPayment.value)
    orderInfo.value = result
    
    // 如果是开发环境，显示模拟支付按钮
    if (import.meta.env.DEV) {
      // 开发环境下可以模拟支付
    }
  } catch (error: any) {
    errorMessage.value = error.message || '创建订单失败'
  } finally {
    isProcessing.value = false
  }
}

// 模拟支付（开发环境）
const handleSimulatePayment = async () => {
  if (!orderInfo.value?.order?.orderId) return
  
  isProcessing.value = true
  errorMessage.value = ''
  
  try {
    await simulatePayment(orderInfo.value.order.orderId)
    
    // 刷新配额
    await loadQuota()
    
    // 关闭弹窗并显示成功
    showPaymentModal.value = false
    orderInfo.value = null
    selectedProduct.value = null
    
    alert('支付成功！检测次数已添加到您的账户')
  } catch (error: any) {
    errorMessage.value = error.message || '支付失败'
  } finally {
    isProcessing.value = false
  }
}

// 关闭支付弹窗
const closePaymentModal = () => {
  showPaymentModal.value = false
  orderInfo.value = null
  selectedProduct.value = null
  errorMessage.value = ''
}

// 获取产品图标
const getProductIcon = (productId: string) => {
  const icons: Record<string, string> = {
    basic_pack: '📦',
    deep_single: '🔬',
    deep_pack: '💎'
  }
  return icons[productId] || '📦'
}

// 获取产品推荐标签
const getProductTag = (productId: string) => {
  const tags: Record<string, string> = {
    basic_pack: '最受欢迎',
    deep_pack: '最划算'
  }
  return tags[productId] || ''
}
</script>

<template>
  <div class="pricing-container">
    <div class="pricing-header">
      <h1>选择检测套餐</h1>
      <p>灵活的定价方案，满足您的安全检测需求</p>
    </div>

    <!-- 当前配额显示 -->
    <div v-if="userStore.isAuthenticated && userStore.scanQuota" class="current-quota">
      <div class="quota-card">
        <span class="quota-label">基础检测剩余</span>
        <span class="quota-value">{{ userStore.scanQuota.basicScansRemaining }}</span>
        <span class="quota-unit">次</span>
      </div>
      <div class="quota-card">
        <span class="quota-label">深度检测剩余</span>
        <span class="quota-value">{{ userStore.scanQuota.deepScansRemaining }}</span>
        <span class="quota-unit">次</span>
      </div>
    </div>

    <!-- 产品列表 -->
    <div v-if="isLoading" class="loading">
      <div class="loading-spinner"></div>
      <p>加载中...</p>
    </div>

    <div v-else class="products-grid">
      <div 
        v-for="product in products" 
        :key="product.id"
        :class="['product-card', { featured: getProductTag(product.id) }]"
      >
        <div v-if="getProductTag(product.id)" class="product-tag">
          {{ getProductTag(product.id) }}
        </div>
        
        <div class="product-icon">{{ getProductIcon(product.id) }}</div>
        <h3 class="product-name">{{ product.name }}</h3>
        <p class="product-desc">{{ product.description }}</p>
        
        <div class="product-price">
          <span class="price-currency">¥</span>
          <span class="price-amount">{{ product.price.toFixed(2) }}</span>
        </div>
        
        <ul class="product-features">
          <li>
            <span class="check-icon">✓</span>
            {{ product.scanCount }}次{{ product.scanType === 'basic' ? '基础' : '深度' }}检测
          </li>
          <li>
            <span class="check-icon">✓</span>
            诈骗风险检测
          </li>
          <li>
            <span class="check-icon">✓</span>
            安全评分报告
          </li>
          <li v-if="product.scanType === 'deep'">
            <span class="check-icon">✓</span>
            深度漏洞分析
          </li>
        </ul>
        
        <button class="buy-btn" @click="selectProduct(product.id)">
          立即购买
        </button>
      </div>
    </div>

    <!-- 返回首页 -->
    <div class="back-home">
      <router-link to="/" class="back-link">← 返回首页</router-link>
    </div>

    <!-- 登录提示弹窗 -->
    <div v-if="showLoginPrompt" class="modal-overlay" @click="showLoginPrompt = false">
      <div class="modal-content" @click.stop>
        <div class="modal-icon">🔐</div>
        <h3>请先登录</h3>
        <p>登录后即可购买检测套餐</p>
        <div class="modal-actions">
          <button class="btn-secondary" @click="showLoginPrompt = false">取消</button>
          <button class="btn-primary" @click="handleLogin">Google 登录</button>
        </div>
      </div>
    </div>

    <!-- 支付弹窗 -->
    <div v-if="showPaymentModal" class="modal-overlay" @click="closePaymentModal">
      <div class="modal-content payment-modal" @click.stop>
        <button class="close-btn" @click="closePaymentModal">×</button>
        
        <template v-if="!orderInfo">
          <h3>选择支付方式</h3>
          
          <div class="payment-methods">
            <label :class="['payment-option', { active: selectedPayment === 'wechat' }]">
              <input type="radio" v-model="selectedPayment" value="wechat" />
              <span class="payment-icon">💚</span>
              <span>微信支付</span>
            </label>
            <label :class="['payment-option', { active: selectedPayment === 'alipay' }]">
              <input type="radio" v-model="selectedPayment" value="alipay" />
              <span class="payment-icon">💙</span>
              <span>支付宝</span>
            </label>
          </div>
          
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          
          <button 
            class="btn-primary full-width" 
            @click="handleCreateOrder"
            :disabled="isProcessing"
          >
            {{ isProcessing ? '处理中...' : '确认支付' }}
          </button>
        </template>
        
        <template v-else>
          <h3>订单已创建</h3>
          
          <div class="order-info">
            <p><strong>订单号：</strong>{{ orderInfo.order.orderNo }}</p>
            <p><strong>产品：</strong>{{ orderInfo.order.productName }}</p>
            <p><strong>金额：</strong>¥{{ orderInfo.order.amount.toFixed(2) }}</p>
          </div>
          
          <div v-if="orderInfo.payment?.message" class="payment-notice">
            {{ orderInfo.payment.message }}
          </div>
          
          <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
          
          <!-- 开发环境显示模拟支付按钮 -->
          <button 
            v-if="true"
            class="btn-primary full-width" 
            @click="handleSimulatePayment"
            :disabled="isProcessing"
          >
            {{ isProcessing ? '处理中...' : '模拟支付成功（测试）' }}
          </button>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.pricing-container {
  min-height: 100vh;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.pricing-header {
  text-align: center;
  margin-bottom: 3rem;
  padding-top: 2rem;
}

.pricing-header h1 {
  font-size: 2.5rem;
  color: white;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.pricing-header p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.1rem;
}

.current-quota {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 3rem;
}

.quota-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  backdrop-filter: blur(10px);
}

.quota-label {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.quota-value {
  color: #10B981;
  font-size: 1.5rem;
  font-weight: 700;
}

.quota-unit {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: white;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.product-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  position: relative;
  transition: all 0.3s ease;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

.product-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.product-card.featured {
  border: 2px solid #667eea;
}

.product-tag {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 0.25rem 1rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.product-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.product-name {
  font-size: 1.5rem;
  color: #1a202c;
  margin-bottom: 0.5rem;
}

.product-desc {
  color: #64748b;
  margin-bottom: 1.5rem;
}

.product-price {
  margin-bottom: 1.5rem;
}

.price-currency {
  font-size: 1.2rem;
  color: #667eea;
  vertical-align: top;
}

.price-amount {
  font-size: 3rem;
  font-weight: 700;
  color: #667eea;
}

.product-features {
  list-style: none;
  padding: 0;
  margin-bottom: 1.5rem;
  text-align: left;
}

.product-features li {
  padding: 0.5rem 0;
  color: #64748b;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.check-icon {
  color: #10B981;
  font-weight: bold;
}

.buy-btn {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.buy-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.back-home {
  text-align: center;
  margin-top: 2rem;
}

.back-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  font-size: 1rem;
  transition: color 0.3s ease;
}

.back-link:hover {
  color: white;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  border-radius: 20px;
  padding: 2rem;
  max-width: 400px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
}

.modal-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.modal-content h3 {
  color: #1a202c;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.modal-content p {
  color: #64748b;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.close-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #64748b;
  cursor: pointer;
}

.payment-methods {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.payment-option {
  flex: 1;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.payment-option input {
  display: none;
}

.payment-option.active {
  border-color: #667eea;
  background: rgba(102, 126, 234, 0.1);
}

.payment-icon {
  font-size: 2rem;
}

.order-info {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 1rem;
  text-align: left;
}

.order-info p {
  margin: 0.5rem 0;
  color: #1a202c;
}

.payment-notice {
  background: #FEF3C7;
  color: #92400E;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.error-message {
  color: #EF4444;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.btn-primary {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary.full-width {
  width: 100%;
}

.btn-secondary {
  padding: 0.75rem 1.5rem;
  background: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

@media (max-width: 768px) {
  .pricing-header h1 {
    font-size: 2rem;
  }
  
  .current-quota {
    flex-direction: column;
    align-items: center;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .payment-methods {
    flex-direction: column;
  }
}
</style>
