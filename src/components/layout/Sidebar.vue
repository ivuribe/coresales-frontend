<template>
  <aside class="sidebar" :class="{ collapsed: collapsed }">
    <!-- Logo -->

    <div class="logo">
      <i class="fa-solid fa-chart-line"></i>

      <span>CoreSales</span>
    </div>

    <!-- Menú -->

    <nav>
      <ul>
        <li v-for="item in menuItems" :key="item.name">
          <RouterLink
            :to="item.route"
            class="menu-link"
            active-class="active"
            :data-title="item.name"
          >
            <i :class="item.icon"></i>

            <span>
              {{ item.name }}
            </span>
          </RouterLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  collapsed: {
    type: Boolean,

    default: false,
  },
})

const menuItems = [
  {
    name: 'Dashboard',
    icon: 'fa-solid fa-house',
    route: '/dashboard',
  },

  {
    name: 'Clientes',
    icon: 'fa-solid fa-users',
    route: '/clientes',
  },

  {
    name: 'Productos',
    icon: 'fa-solid fa-box',
    route: '/productos',
  },

  {
    name: 'Ventas',
    icon: 'fa-solid fa-cart-shopping',
    route: '/ventas',
  },

  {
    name: 'Inventario',
    icon: 'fa-solid fa-warehouse',
    route: '/inventario',
  },

  {
    name: 'Reportes',
    icon: 'fa-solid fa-chart-column',
    route: '/reportes',
  },

  {
    name: 'Usuarios',
    icon: 'fa-solid fa-user-gear',
    route: '/usuarios',
  },

  {
    name: 'Configuración',
    icon: 'fa-solid fa-gears',
    route: '/configuracion',
  },

  {
    name: 'Cerrar sesión',
    icon: 'fa-solid fa-right-from-bracket',
    route: '/',
  },
]
</script>

<style src="@/assets/css/layout/sidebar.css"></style>
