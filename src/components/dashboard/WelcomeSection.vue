<template>
  <section class="welcome">
    <div class="welcome-content">
      <h1>{{ greeting }}, {{ user.name }}</h1>

      <p>
        Bienvenido a CoreSales Modern. Aquí encontrarás un resumen del estado actual de tu negocio.
      </p>
    </div>

    <div class="welcome-date">
      <span class="label"> Fecha </span>

      <span class="value">
        {{ currentDate }}
      </span>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'

/*==================================================
    Usuario (Temporal)
==================================================*/

const user = ref({
  name: 'Administrador',
})

/*==================================================
    Fecha
==================================================*/

const currentDate = computed(() => {
  return new Intl.DateTimeFormat('es-PE', {
    weekday: 'long',

    day: 'numeric',

    month: 'long',

    year: 'numeric',
  }).format(new Date())
})

/*==================================================
    Saludo
==================================================*/

const greeting = computed(() => {
  const hour = new Date().getHours()

  if (hour < 12) {
    return 'Buenos días'
  }

  if (hour < 18) {
    return 'Buenas tardes'
  }

  return 'Buenas noches'
})
</script>
