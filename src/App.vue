<script setup>
import { ref } from 'vue'
import { ElButton, ElInput, ElCard } from 'element-plus'

const testUrl = ref('')
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-4xl mx-auto px-4">
      <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">
        网站安全检测系统
      </h1>
      
      <el-card class="mb-6">
        <template #header>
          <div class="text-lg font-semibold">配置测试</div>
        </template>
        
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              测试URL输入：
            </label>
            <el-input 
              v-model="testUrl" 
              placeholder="请输入网站URL"
              class="w-full"
            />
          </div>
          
          <div class="flex space-x-4">
            <el-button type="primary">
              Element Plus 按钮测试
            </el-button>
            <el-button type="success">
              成功样式
            </el-button>
            <el-button type="warning">
              警告样式
            </el-button>
          </div>
        </div>
      </el-card>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold mb-3 text-blue-600">Tailwind CSS 测试</h3>
          <p class="text-gray-600">
            这个卡片使用了 Tailwind CSS 的样式类，包括响应式网格布局、阴影效果和颜色系统。
          </p>
        </div>
        
        <div class="bg-white p-6 rounded-lg shadow-md">
          <h3 class="text-lg font-semibold mb-3 text-green-600">Element Plus 测试</h3>
          <p class="text-gray-600">
            上方的输入框和按钮组件来自 Element Plus UI 库，验证组件库是否正确加载。
          </p>
        </div>
      </div>
      
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-500">
          如果您能看到样式正确的页面，说明 Vue.js 3 + Element Plus + Tailwind CSS 配置成功！
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 可以在这里添加组件特定的样式 */
</style>
