<template>
  <section class="panel small">
    <!--==========================================
            Encabezado
        ===========================================-->

    <div class="panel-header">
      <h2>Accesos Rápidos</h2>
    </div>

    <!--==========================================
            Botones
        ===========================================-->

    <div class="quick-buttons">
      <button v-for="action in actions" :key="action.id" @click="execute(action)">
        <i :class="action.icon"></i>

        <span>
          {{ action.name }}
        </span>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

/*==================================================
    Accesos rápidos
==================================================*/

const actions = ref([
  {
    id: 1,

    name: 'Nueva Venta',

    icon: 'fa-solid fa-cart-shopping',
  },

  {
    id: 2,

    name: 'Nuevo Cliente',

    icon: 'fa-solid fa-user-plus',
  },

  {
    id: 3,

    name: 'Productos',

    icon: 'fa-solid fa-box',
  },

  {
    id: 4,

    name: 'Reportes',

    icon: 'fa-solid fa-chart-column',
  },
])

/*==================================================
    Acción
==================================================*/

const execute = (action) => {
  console.log(`Acceso seleccionado: ${action.name}`)
}
</script>

<style src="@/assets/css/components/panels.css"></style>
