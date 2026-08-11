<template>
  <section class="report-filters">
    <div class="filter-group">
      <label> Desde </label>

      <input v-model="form.fechaInicio" type="date" @change="actualizar" />
    </div>

    <div class="filter-group">
      <label> Hasta </label>

      <input v-model="form.fechaFin" type="date" @change="actualizar" />
    </div>

    <div class="filter-group">
      <label> Reporte </label>

      <select v-model="form.tipoReporte" @change="actualizar">
        <option value="ventas">Ventas</option>

        <option value="inventario">Inventario</option>

        <option value="productos">Productos</option>
      </select>
    </div>

    <button class="btn-filter" @click="actualizar">
      <i class="fa-solid fa-filter"></i>

      Aplicar filtros
    </button>
  </section>
</template>

<script setup>
import { reactive } from 'vue'

/*==================================================
    Props
==================================================*/

const props = defineProps({
  fechaInicio: {
    type: String,

    default: '',
  },

  fechaFin: {
    type: String,

    default: '',
  },

  tipoReporte: {
    type: String,

    default: 'ventas',
  },
})

/*==================================================
    Eventos
==================================================*/

const emit = defineEmits(['actualizar'])

/*==================================================
    Formulario
==================================================*/

const form = reactive({
  fechaInicio: props.fechaInicio,

  fechaFin: props.fechaFin,

  tipoReporte: props.tipoReporte,
})

/*==================================================
    Actualizar
==================================================*/

const actualizar = () => {
  emit(
    'actualizar',

    {
      fechaInicio: form.fechaInicio,

      fechaFin: form.fechaFin,

      tipoReporte: form.tipoReporte,
    },
  )
}
</script>
