import { createRouter, createWebHistory } from 'vue-router'

//import LoginView from '../components/view/LoginView.vue' //Para login propio con solo la valiación de JWT
import LoginOAuthView from '../components/view/LoginOAuthView.vue'
import DashboardView from '../components/view/DashboardView.vue'
import MainLayout from '@/components/layout/MainLayout.vue'
import ClientesView from '@/components/view/ClientesView.vue'
import ProductosView from '@/components/view/ProductosView.vue'
import VentasView from '@/components/view/VentasView.vue'
import InventarioView from '@/components/view/InventarioView.vue'
import ReportesView from '@/components/view/ReportesView.vue'
import OAuthCallbackView from '@/components/view/OAuthCallbackView.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginOAuthView, //LoginView,
  },
  // OAuth 2.0 Authorization Code callback
  {
    path: '/callback',
    name: 'OAuthCallback',
    component: OAuthCallbackView,
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
