<template>
  <div class="report-summary">
    <!-- Ventas -->

    <div class="report-card">
      <div class="report-card-icon blue">
        <i class="fa-solid fa-sack-dollar"></i>
      </div>

      <div>
        <span> Ventas </span>

        <strong> S/ {{ totalVentas.toFixed(2) }} </strong>
      </div>
    </div>

    <!-- Operaciones -->

    <div class="report-card">
      <div class="report-card-icon green">
        <i class="fa-solid fa-receipt"></i>
      </div>

      <div>
        <span> Operaciones </span>

        <strong>
          {{ cantidadVentas }}
        </strong>
      </div>
    </div>

    <!-- Ticket -->

    <div class="report-card">
      <div class="report-card-icon orange">
        <i class="fa-solid fa-chart-line"></i>
      </div>

      <div>
        <span> Ticket promedio </span>

        <strong> S/ {{ ticketPromedio.toFixed(2) }} </strong>
      </div>
    </div>

    <!-- Productos -->

    <div class="report-card">
      <div class="report-card-icon purple">
        <i class="fa-solid fa-box"></i>
      </div>

      <div>
        <span> Unidades vendidas </span>

        <strong>
          {{ productosVendidos }}
        </strong>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  totalVentas: {
    type: Number,

    default: 0,
  },

  cantidadVentas: {
    type: Number,

    default: 0,
  },

  ticketPromedio: {
    type: Number,

    default: 0,
  },

  productosVendidos: {
    type: Number,

    default: 0,
  },
})
</script>
