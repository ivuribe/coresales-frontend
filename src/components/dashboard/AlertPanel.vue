<template>
  <section class="panel small">
    <!--==========================================
            Encabezado
        ===========================================-->

    <div class="panel-header">
      <h2>Alertas</h2>

      <button class="panel-action">Ver todas</button>
    </div>

    <!--==========================================
            Lista
        ===========================================-->

    <ul class="alert-list">
      <li v-for="alert in alerts" :key="alert.id" :class="alert.type">
        <div class="alert-icon">
          <i :class="alert.icon"></i>
        </div>

        <div class="alert-content">
          <span class="alert-title">
            {{ alert.title }}
          </span>

          <small class="alert-description">
            {{ alert.description }}
          </small>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup>
import { ref } from 'vue'

/*==================================================
    Alertas
==================================================*/

const alerts = ref([
  {
    id: 1,

    title: 'Stock crítico',

    description: '5 productos requieren reposición.',

    icon: 'fa-solid fa-triangle-exclamation',

    type: 'warning',
  },

  {
    id: 2,

    title: 'Facturas pendientes',

    description: '12 comprobantes aún no emitidos.',

    icon: 'fa-solid fa-file-invoice',

    type: 'danger',
  },

  {
    id: 3,

    title: 'Nuevo cliente',

    description: 'Se registró un nuevo cliente corporativo.',

    icon: 'fa-solid fa-user-plus',

    type: 'success',
  },

  {
    id: 4,

    title: 'Respaldo completado',

    description: 'La copia de seguridad finalizó correctamente.',

    icon: 'fa-solid fa-circle-check',

    type: 'info',
  },
])
</script>

<style src="@/assets/css/components/panels.css"></style>
