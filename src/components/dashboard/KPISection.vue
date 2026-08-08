<template>
  <section class="kpis">
    <KPICard
      v-for="item in kpis"
      :key="item.id"
      :title="item.title"
      :value="item.value"
      :subtitle="item.subtitle"
      :icon="item.icon"
      :color="item.color"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue'

import KPICard from '@/components/common/KPICard.vue'

/*==================================================
    KPIs
==================================================*/

const kpis = ref([
  {
    id: 1,
    title: 'Ventas del día',
    value: 'S/ 18,540',
    subtitle: '+12% respecto a ayer',
    icon: 'fa-solid fa-chart-line',
    color: 'primary',
  },

  {
    id: 2,
    title: 'Pedidos',
    value: '126',
    subtitle: '8 pendientes',
    icon: 'fa-solid fa-cart-shopping',
    color: 'success',
  },

  {
    id: 3,
    title: 'Clientes',
    value: '842',
    subtitle: '15 nuevos este mes',
    icon: 'fa-solid fa-users',
    color: 'warning',
  },

  {
    id: 4,
    title: 'Productos',
    value: '412',
    subtitle: '5 con stock crítico',
    icon: 'fa-solid fa-box',
    color: 'danger',
  },
])
</script>
