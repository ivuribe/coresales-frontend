import { createRouter, createWebHistory } from 'vue-router'

import Login from '../components/view/LoginView.vue'
import Dashboard from '../components/view/DashboardView.vue'
import MainLayout from '@/components/layout/MainLayout.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login,
  },
  {
    path: '/',
    component: MainLayout,

    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
