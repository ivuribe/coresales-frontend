<template>
  <!--==========================================
        Gráfico de ventas
    ===========================================-->

  <div class="panel large">
    <h2>Ventas Mensuales</h2>

    <div class="chart-container">
      <canvas ref="salesChart"></canvas>
    </div>
  </div>

  <!--==========================================
        Gráfico de productos
    ===========================================-->

  <div class="panel small">
    <h2>Productos por Categoría</h2>

    <div class="chart-container">
      <canvas ref="productsChart"></canvas>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue'

import Chart from 'chart.js/auto'
/*
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
*/

/*==================================================
    Referencias
==================================================*/

const salesChart = ref(null)

const productsChart = ref(null)

/*==================================================
    Inicialización
==================================================*/

onMounted(async () => {
  await nextTick()

  createSalesChart()

  createProductsChart()
})

/*==================================================
    Gráfico de ventas
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
        backgroundColor: '#2563EB',

        borderColor: '#2563EB',

        borderWidth: 1,

        borderRadius: 6,

        hoverBackgroundColor: '#1D4ED8',
      },

      options: {
        responsive: true,

        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: true,

            labels: {
              color: '#64748B',

              font: {
                size: 12,
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: '#E2E8F0',
            },

            ticks: {
              color: '#64748B',
            },
          },

          y: {
            beginAtZero: true,

            grid: {
              color: '#E2E8F0',
            },

            ticks: {
              color: '#64748B',
            },
          },
        },
      },
    },
  )
}

/*==================================================
    Gráfico de productos
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
            data: [45, 25, 20, 10],

            backgroundColor: ['#2563EB', '#22C55E', '#F59E0B', '#EF4444'],

            borderColor: '#FFFFFF',

            borderWidth: 3,

            hoverOffset: 8,
          },
        ],
      },

      options: {
        responsive: true,

        maintainAspectRatio: false,

        cutout: '60%',

        plugins: {
          legend: {
            position: 'top',

            labels: {
              color: '#64748B',

              padding: 15,

              font: {
                size: 12,
              },
            },
          },
        },
      },
    },
  )
}
</script>
