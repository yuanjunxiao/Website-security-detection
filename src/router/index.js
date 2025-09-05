import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Progress from '../views/Progress.vue'
import Result from '../views/Result.vue'
import About from '../views/About.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/progress/:taskId?',
      name: 'progress',
      component: Progress,
      props: true
    },
    {
      path: '/result/:taskId',
      name: 'result',
      component: Result,
      props: true
    },
    {
      path: '/about',
      name: 'about',
      component: About
    }
  ]
})

export default router