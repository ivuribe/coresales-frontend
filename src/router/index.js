import { createRouter, createWebHistory } from 'vue-router'
import { isAuthenticated } from '@/services/oAuthService.js'
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
  // Ruta pública: inicio de sesión
  {
    path: '/',
    name: 'Login',
    component: LoginOAuthView, //LoginView,
  },
  // Ruta pública: retorno del servidor OAuth 2.0
  {
    path: '/callback',
    name: 'OAuthCallback',
    component: OAuthCallbackView,
  },
  // Todas las vistas internas requieren autenticación
  {
    path: '/',
    component: MainLayout,
    meta: { requiresAuth: true },
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

// Guardia global de navegación
router.beforeEach((to) => {
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth)

  // Las rutas públicas, como Login y Callback, continúan
  if (!requiresAuth) {
    return true
  }

  // Permitir acceso solo con una sesión válida
  if (isAuthenticated()) {
    return true
  }

  // Si no está autenticado, volver al login
  return {
    name: 'Login',
    query: { redirect: to.fullPath },
  }
})

export default router
