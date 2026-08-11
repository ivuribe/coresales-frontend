<template>
  <div class="charts-grid">
    <!--======================================
            VENTAS POR DÍA
        =======================================-->

    <section class="panel chart-panel">
      <div class="panel-header">
        <div>
          <h2>Ventas por día</h2>

          <p>Evolución de las ventas del período.</p>
        </div>
      </div>

      <div class="chart-container">
        <canvas ref="salesChart"></canvas>
      </div>
    </section>

    <!--======================================
            PRODUCTOS
        =======================================-->

    <section class="panel chart-panel">
      <div class="panel-header">
        <div>
          <h2>Productos más vendidos</h2>

          <p>Unidades vendidas por producto.</p>
        </div>
      </div>

      <div class="chart-container">
        <canvas ref="productsChart"></canvas>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'

import Chart from 'chart.js/auto'

/*==================================================
    Props
==================================================*/

const props = defineProps({
  ventas: {
    type: Array,

    default: () => [],
  },

  productos: {
    type: Array,

    default: () => [],
  },
})

/*==================================================
    Referencias
==================================================*/

const salesChart = ref(null)

const productsChart = ref(null)

let salesChartInstance = null

let productsChartInstance = null

/*==================================================
    Crear gráfico de ventas
==================================================*/

const createSalesChart = () => {
  if (!salesChart.value) return

  if (salesChartInstance) {
    salesChartInstance.destroy()
  }

  const ventasPorDia = {}

  props.ventas

    .filter((venta) => venta.estado === 'Completada')

    .forEach((venta) => {
      if (!ventasPorDia[venta.fecha]) {
        ventasPorDia[venta.fecha] = 0
      }

      ventasPorDia[venta.fecha] += venta.total
    })

  const fechas = Object.keys(ventasPorDia).sort()

  const valores = fechas.map((fecha) => ventasPorDia[fecha])

  salesChartInstance = new Chart(
    salesChart.value,

    {
      type: 'line',

      data: {
        labels: fechas.map((fecha) => {
          const partes = fecha.split('-')

          return `${partes[2]}/${partes[1]}`
        }),

        datasets: [
          {
            label: 'Ventas',

            data: valores,

            tension: 0.35,

            fill: true,
          },
        ],
      },

      options: {
        responsive: true,

        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false,
          },
        },

        scales: {
          y: {
            beginAtZero: true,

            ticks: {
              callback: (value) => `S/ ${value}`,
            },
          },
        },
      },
    },
  )
}

/*==================================================
    Crear gráfico de productos
==================================================*/

const createProductsChart = () => {
  if (!productsChart.value) return

  if (productsChartInstance) {
    productsChartInstance.destroy()
  }

  const productos = props.productos.slice(0, 5)

  productsChartInstance = new Chart(
    productsChart.value,

    {
      type: 'bar',

      data: {
        labels: productos.map((producto) => producto.nombre),

        datasets: [
          {
            label: 'Unidades',

            data: productos.map((producto) => producto.cantidad),
          },
        ],
      },

      options: {
        responsive: true,

        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false,
          },
        },

        scales: {
          y: {
            beginAtZero: true,

            ticks: {
              precision: 0,
            },
          },
        },
      },
    },
  )
}

/*==================================================
    Inicialización
==================================================*/

onMounted(() => {
  createSalesChart()

  createProductsChart()
})

/*==================================================
    Actualización
==================================================*/

watch(
  () => props.ventas,

  () => {
    createSalesChart()
  },

  {
    deep: true,
  },
)

watch(
  () => props.productos,

  () => {
    createProductsChart()
  },

  {
    deep: true,
  },
)
</script>
