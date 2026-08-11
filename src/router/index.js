import { createRouter, createWebHistory } from 'vue-router'

import LoginView from '../components/view/LoginView.vue'
import DashboardView from '../components/view/DashboardView.vue'
import MainLayout from '@/components/layout/MainLayout.vue'
import ClientesView from '@/components/view/ClientesView.vue'
import ProductosView from '@/components/view/ProductosView.vue'
import VentasView from '@/components/view/VentasView.vue'
import InventarioView from '@/components/view/InventarioView.vue'
import ReportesView from '@/components/view/ReportesView.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/',
    component: MainLayout,

    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: DashboardView,
      },
      {
        path: 'clientes',
        name: 'Clientes',
        component: ClientesView,
      },
      {
        path: 'productos',
        name: 'Productos',
        component: ProductosView,
      },
      {
        path: 'ventas',
        name: 'Ventas',
        component: VentasView,
      },
      {
        path: 'inventario',
        name: 'Inventario',
        component: InventarioView,
      },
      {
        path: 'reportes',
        name: 'Reportes',
        component: ReportesView,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
