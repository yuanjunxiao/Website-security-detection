<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Props {
  data: Array<{
    label: string
    score: number
    color?: string
  }>
  type?: 'bar' | 'doughnut' | 'line'
  height?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'bar',
  height: 300
})

const chartContainer = ref<HTMLElement>()
const maxScore = computed(() => Math.max(...props.data.map(item => item.score), 100))

const getBarHeight = (score: number) => {
  return (score / maxScore.value) * 100
}

const getScoreColor = (score: number, customColor?: string) => {
  if (customColor) return customColor
  if (score >= 90) return '#27ae60'
  if (score >= 70) return '#f39c12'
  if (score >= 50) return '#e67e22'
  return '#e74c3c'
}

const getDoughnutPath = (score: number, index: number, total: number) => {
  const radius = 80
  const centerX = 120
  const centerY = 120
  const startAngle = (index / total) * 360 - 90
  const endAngle = ((index + 1) / total) * 360 - 90

  const startAngleRad = (startAngle * Math.PI) / 180
  const endAngleRad = (endAngle * Math.PI) / 180

  const x1 = centerX + radius * Math.cos(startAngleRad)
  const y1 = centerY + radius * Math.sin(startAngleRad)
  const x2 = centerX + radius * Math.cos(endAngleRad)
  const y2 = centerY + radius * Math.sin(endAngleRad)

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1'

  return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`
}

const animateChart = () => {
  if (!chartContainer.value) return

  const bars = chartContainer.value.querySelectorAll('.chart-bar')
  bars.forEach((bar, index) => {
    setTimeout(() => {
      bar.classList.add('animate')
    }, index * 100)
  })
}

onMounted(() => {
  setTimeout(animateChart, 100)
})
</script>

<template>
  <div class="chart-container" :style="{ height: height + 'px' }" ref="chartContainer">
    <!-- 柱状图 -->
    <div v-if="type === 'bar'" class="bar-chart">
      <div class="chart-grid">
        <div v-for="i in 5" :key="i" class="grid-line" :style="{ bottom: (i * 20) + '%' }">
          <span class="grid-label">{{ Math.round((i * maxScore) / 5) }}</span>
        </div>
      </div>

      <div class="bars-container">
        <div v-for="(item, index) in data" :key="index" class="bar-wrapper">
          <div
            class="chart-bar"
            :style="{
              height: getBarHeight(item.score) + '%',
              backgroundColor: getScoreColor(item.score, item.color)
            }"
          >
            <div class="bar-value">{{ item.score }}</div>
          </div>
          <div class="bar-label">{{ item.label }}</div>
        </div>
      </div>
    </div>

    <!-- 环形图 -->
    <div v-else-if="type === 'doughnut'" class="doughnut-chart">
      <svg width="240" height="240" viewBox="0 0 240 240">
        <circle
          cx="120"
          cy="120"
          r="80"
          fill="none"
          stroke="#f1f3f4"
          stroke-width="20"
        />

        <path
          v-for="(item, index) in data"
          :key="index"
          :d="getDoughnutPath(item.score, index, data.length)"
          :fill="getScoreColor(item.score, item.color)"
          class="doughnut-segment"
          :style="{ animationDelay: index * 0.1 + 's' }"
        />

        <text x="120" y="115" text-anchor="middle" class="doughnut-title">总评分</text>
        <text x="120" y="135" text-anchor="middle" class="doughnut-score">
          {{ Math.round(data.reduce((sum, item) => sum + item.score, 0) / data.length) }}
        </text>
      </svg>

      <div class="doughnut-legend">
        <div v-for="(item, index) in data" :key="index" class="legend-item">
          <div
            class="legend-color"
            :style="{ backgroundColor: getScoreColor(item.score, item.color) }"
          ></div>
          <span class="legend-label">{{ item.label }}</span>
          <span class="legend-value">{{ item.score }}</span>
        </div>
      </div>
    </div>

    <!-- 折线图 -->
    <div v-else-if="type === 'line'" class="line-chart">
      <svg :width="'100%'" :height="height" viewBox="0 0 400 300">
        <!-- 网格线 -->
        <defs>
          <pattern id="grid" width="40" height="30" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 30" fill="none" stroke="#f1f3f4" stroke-width="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        <!-- 数据线 -->
        <polyline
          :points="data.map((item, index) =>
            `${(index / (data.length - 1)) * 360 + 20},${280 - (item.score / maxScore) * 240}`
          ).join(' ')"
          fill="none"
          stroke="#3498db"
          stroke-width="3"
          class="line-path"
        />

        <!-- 数据点 -->
        <circle
          v-for="(item, index) in data"
          :key="index"
          :cx="(index / (data.length - 1)) * 360 + 20"
          :cy="280 - (item.score / maxScore) * 240"
          r="4"
          :fill="getScoreColor(item.score, item.color)"
          class="line-point"
          :style="{ animationDelay: index * 0.1 + 's' }"
        />
      </svg>

      <div class="line-labels">
        <div v-for="(item, index) in data" :key="index" class="line-label">
          {{ item.label }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.chart-container {
  position: relative;
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 柱状图样式 */
.bar-chart {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-grid {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 40px;
}

.grid-line {
  position: absolute;
  left: 0;
  right: 0;
  border-top: 1px solid #f1f3f4;
  display: flex;
  align-items: center;
}

.grid-label {
  font-size: 0.8rem;
  color: #7f8c8d;
  margin-left: 0.5rem;
}

.bars-container {
  display: flex;
  align-items: flex-end;
  height: calc(100% - 40px);
  gap: 1rem;
  padding: 0 2rem;
  margin-bottom: 40px;
}

.bar-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
}

.chart-bar {
  width: 100%;
  max-width: 60px;
  position: relative;
  border-radius: 4px 4px 0 0;
  transition: all 0.6s ease;
  transform: scaleY(0);
  transform-origin: bottom;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 0.5rem;
}

.chart-bar.animate {
  transform: scaleY(1);
}

.bar-value {
  color: white;
  font-size: 0.8rem;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.bar-label {
  margin-top: 0.5rem;
  font-size: 0.8rem;
  color: #7f8c8d;
  text-align: center;
  word-break: break-word;
}

/* 环形图样式 */
.doughnut-chart {
  display: flex;
  align-items: center;
  gap: 2rem;
  height: 100%;
}

.doughnut-segment {
  opacity: 0;
  animation: fadeInSegment 0.6s ease forwards;
}

@keyframes fadeInSegment {
  to {
    opacity: 1;
  }
}

.doughnut-title {
  font-size: 0.9rem;
  fill: #7f8c8d;
}

.doughnut-score {
  font-size: 1.5rem;
  font-weight: 700;
  fill: #2c3e50;
}

.doughnut-legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 50%;
}

.legend-label {
  flex: 1;
  font-size: 0.9rem;
  color: #2c3e50;
}

.legend-value {
  font-weight: 600;
  color: #2c3e50;
}

/* 折线图样式 */
.line-chart {
  position: relative;
  height: 100%;
}

.line-path {
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
  animation: drawLine 2s ease forwards;
}

@keyframes drawLine {
  to {
    stroke-dashoffset: 0;
  }
}

.line-point {
  opacity: 0;
  animation: fadeInPoint 0.6s ease forwards;
}

@keyframes fadeInPoint {
  to {
    opacity: 1;
  }
}

.line-labels {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 20px;
}

.line-label {
  font-size: 0.8rem;
  color: #7f8c8d;
  text-align: center;
}

@media (max-width: 768px) {
  .chart-container {
    padding: 0.75rem;
  }

  .doughnut-chart {
    flex-direction: column;
    gap: 1rem;
  }

  .bars-container {
    padding: 0 1rem;
    gap: 0.5rem;
  }

  .bar-value {
    font-size: 0.7rem;
  }

  .bar-label {
    font-size: 0.7rem;
  }
}
</style>
