<template>
  <section class="panel medium">
    <!--==========================================
            Encabezado
        ===========================================-->

    <div class="panel-header">
      <h2>Actividad Reciente</h2>

      <button class="panel-action">Ver historial</button>
    </div>

    <!--==========================================
            Actividades
        ===========================================-->

    <ul class="activity-list">
      <li v-for="activity in activities" :key="activity.id">
        <div class="activity-icon" :class="activity.color">
          <i :class="activity.icon"></i>
        </div>

        <div class="activity-info">
          <span class="activity-title">
            {{ activity.title }}
          </span>

          <small class="activity-time">
            {{ activity.time }}
          </small>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref } from 'vue'

/*==================================================
    Actividades
==================================================*/

const activities = ref([
  {
    id: 1,

    title: 'Venta registrada correctamente.',

    time: 'Hace 5 minutos',

    icon: 'fa-solid fa-cart-shopping',

    color: 'primary',
  },

  {
    id: 2,

    title: 'Nuevo cliente registrado.',

    time: 'Hace 18 minutos',

    icon: 'fa-solid fa-user-plus',

    color: 'success',
  },

  {
    id: 3,

    title: 'Producto actualizado.',

    time: 'Hace 1 hora',

    icon: 'fa-solid fa-box',

    color: 'warning',
  },

  {
    id: 4,

    title: 'Inventario sincronizado.',

    time: 'Hace 2 horas',

    icon: 'fa-solid fa-arrows-rotate',

    color: 'info',
  },
])
</script>

<style src="@/assets/css/components/panels.css"></style>
