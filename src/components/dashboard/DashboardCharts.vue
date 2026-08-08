<template>
  <!--==========================================
            Ventas
        ===========================================-->

  <div class="panel large">
    <h2>Ventas Mensuales</h2>

    <canvas ref="salesChart"></canvas>
  </div>

  <!--==========================================
            Productos
        ===========================================-->

  <div class="panel small">
    <h2>Productos por Categoría</h2>

    <canvas ref="productsChart"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

import {
  Chart,
  BarController,
  BarElement,
  DoughnutController,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js'

Chart.register(
  BarController,

  BarElement,

  DoughnutController,

  ArcElement,

  CategoryScale,

  LinearScale,

  Tooltip,

  Legend,
)

/*==================================================
    Referencias
==================================================*/

const salesChart = ref(null)

const productsChart = ref(null)

/*==================================================
    Inicialización
==================================================*/

onMounted(() => {
  createSalesChart()

  createProductsChart()
})

/*==================================================
    Ventas
==================================================*/

function createSalesChart() {
  new Chart(
    salesChart.value,

    {
      type: 'bar',

      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],

        datasets: [
          {
            label: 'Ventas',

            data: [12000, 18000, 15000, 22000, 28000, 32000],
          },
        ],
      },

      options: {
        responsive: true,

        maintainAspectRatio: false,
      },
    },
  )
}

/*==================================================
    Productos
==================================================*/

function createProductsChart() {
  new Chart(
    productsChart.value,

    {
      type: 'doughnut',

      data: {
        labels: ['Electrónica', 'Accesorios', 'Oficina', 'Otros'],

        datasets: [
          {
            data: [
              45,

              25,

              20,

              10,
            ],
          },
        ],
      },

      options: {
        responsive: true,

        maintainAspectRatio: false,
      },
    },
  )
}
</script>
