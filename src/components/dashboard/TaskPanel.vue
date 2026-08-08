<template>
  <section class="panel medium">
    <!--==========================================
            Encabezado
        ===========================================-->

    <div class="panel-header">
      <h2>Tareas Pendientes</h2>

      <button class="panel-action">Ver todas</button>
    </div>

    <!--==========================================
            Lista
        ===========================================-->

    <ul class="task-list">
      <li v-for="task in tasks" :key="task.id">
        <div class="task-icon">
          <i :class="task.icon"></i>
        </div>

        <div class="task-info">
          <span class="task-title">
            {{ task.title }}
          </span>

          <small class="task-date">
            {{ task.date }}
          </small>
        </div>

        <span class="task-status" :class="task.statusClass">
          {{ task.status }}
        </span>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref } from 'vue'

/*==================================================
    Tareas
==================================================*/

const tasks = ref([
  {
    id: 1,

    title: 'Aprobar pedido #1025',

    date: 'Hoy - 09:30',

    status: 'Pendiente',

    statusClass: 'warning',

    icon: 'fa-solid fa-cart-shopping',
  },

  {
    id: 2,

    title: 'Actualizar inventario',

    date: 'Hoy - 11:00',

    status: 'En proceso',

    statusClass: 'info',

    icon: 'fa-solid fa-boxes-stacked',
  },

  {
    id: 3,

    title: 'Revisar cuentas por cobrar',

    date: 'Hoy - 15:00',

    status: 'Urgente',

    statusClass: 'danger',

    icon: 'fa-solid fa-file-invoice-dollar',
  },

  {
    id: 4,

    title: 'Programar reunión comercial',

    date: 'Mañana',

    status: 'Programada',

    statusClass: 'success',

    icon: 'fa-solid fa-calendar-days',
  },
])
</script>

<style src="@/assets/css/components/panels.css"></style>
