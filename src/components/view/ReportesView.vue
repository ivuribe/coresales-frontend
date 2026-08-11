<template>
  <div class="reportes">
    <!--==========================================
            ENCABEZADO
        ===========================================-->

    <div class="page-header">
      <div>
        <h1>Reportes</h1>

        <p>Consulta y análisis de la información comercial.</p>
      </div>

      <button class="btn-primary" @click="imprimirReporte">
        <i class="fa-solid fa-print"></i>

        Imprimir reporte
      </button>
    </div>

    <!--==========================================
            FILTROS
        ===========================================-->

    <ReportFilters
      :fecha-inicio="fechaInicio"
      :fecha-fin="fechaFin"
      :tipo-reporte="tipoReporte"
      @actualizar="actualizarFiltros"
    />

    <!--==========================================
            RESUMEN
        ===========================================-->

    <SalesSummary
      :total-ventas="totalVentas"
      :cantidad-ventas="cantidadVentas"
      :ticket-promedio="ticketPromedio"
      :productos-vendidos="productosVendidos"
    />

    <!--==========================================
            GRÁFICOS
        ===========================================-->

    <SalesCharts :ventas="ventasFiltradas" :productos="productosVendidosDetalle" />

    <!--==========================================
            TABLA
        ===========================================-->

    <section class="panel report-table-panel">
      <div class="panel-header">
        <div>
          <h2>Detalle de ventas</h2>

          <p>Ventas correspondientes al período seleccionado.</p>
        </div>

        <span class="report-counter"> {{ ventasFiltradas.length }} registros </span>
      </div>

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Comprobante</th>

              <th>Fecha</th>

              <th>Cliente</th>

              <th>Productos</th>

              <th>Total</th>

              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="venta in ventasFiltradas" :key="venta.id">
              <td>
                <strong> {{ venta.serie }}-{{ venta.numero }} </strong>
              </td>

              <td>
                {{ formatearFecha(venta.fecha) }}
              </td>

              <td>
                <div class="client-info">
                  <strong>
                    {{ venta.cliente }}
                  </strong>

                  <small>
                    {{ venta.documento }}
                  </small>
                </div>
              </td>

              <td>
                {{ venta.detalles.length }}
              </td>

              <td>
                <strong> S/ {{ venta.total.toFixed(2) }} </strong>
              </td>

              <td>
                <span class="status" :class="obtenerClaseEstado(venta.estado)">
                  {{ venta.estado }}
                </span>
              </td>
            </tr>

            <tr v-if="ventasFiltradas.length === 0">
              <td colspan="6" class="empty">
                <i class="fa-solid fa-chart-column"></i>

                <span> No existen ventas para el período seleccionado. </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!--==========================================
            INVENTARIO
        ===========================================-->

    <section class="panel inventory-report">
      <div class="panel-header">
        <div>
          <h2>Resumen de inventario</h2>

          <p>Productos que requieren atención.</p>
        </div>
      </div>

      <div class="inventory-alerts">
        <!-- Sin stock -->

        <div class="inventory-alert danger">
          <div class="alert-icon">
            <i class="fa-solid fa-circle-xmark"></i>
          </div>

          <div>
            <span> Sin stock </span>

            <strong>
              {{ productosSinStock }}
            </strong>
          </div>
        </div>

        <!-- Stock crítico -->

        <div class="inventory-alert warning">
          <div class="alert-icon">
            <i class="fa-solid fa-triangle-exclamation"></i>
          </div>

          <div>
            <span> Stock crítico </span>

            <strong>
              {{ productosCriticos }}
            </strong>
          </div>
        </div>

        <!-- Stock normal -->

        <div class="inventory-alert success">
          <div class="alert-icon">
            <i class="fa-solid fa-circle-check"></i>
          </div>

          <div>
            <span> Stock normal </span>

            <strong>
              {{ productosDisponibles }}
            </strong>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import ReportFilters from '@/components/reportes/ReportFilters.vue'

import SalesSummary from '@/components/reportes/SalesSummary.vue'

import SalesCharts from '@/components/reportes/SalesCharts.vue'

/*==================================================
    Filtros
==================================================*/

const fechaInicio = ref('2026-08-01')

const fechaFin = ref('2026-08-10')

const tipoReporte = ref('ventas')

/*==================================================
    Ventas
==================================================*/

const ventas = ref([
  {
    id: 1,

    tipo: 'Factura',

    serie: 'F001',

    numero: '000125',

    cliente: 'Comercial Andina SAC',

    documento: 'RUC 20601234567',

    fecha: '2026-08-08',

    estado: 'Completada',

    detalles: [
      {
        productoId: 1,
        nombre: 'Laptop Lenovo ThinkPad',
        cantidad: 2,
        precio: 2850,
        importe: 5700,
      },

      {
        productoId: 3,
        nombre: 'Teclado inalámbrico',
        cantidad: 2,
        precio: 145,
        importe: 290,
      },
    ],

    subtotal: 5076.27,

    igv: 913.73,

    total: 5990,
  },

  {
    id: 2,

    tipo: 'Boleta',

    serie: 'B001',

    numero: '000458',

    cliente: 'Juan Pérez',

    documento: 'DNI 45879632',

    fecha: '2026-08-09',

    estado: 'Completada',

    detalles: [
      {
        productoId: 2,
        nombre: 'Monitor LED 24"',
        cantidad: 1,
        precio: 680,
        importe: 680,
      },
    ],

    subtotal: 576.27,

    igv: 103.73,

    total: 680,
  },

  {
    id: 3,

    tipo: 'Boleta',

    serie: 'B001',

    numero: '000459',

    cliente: 'María García',

    documento: 'DNI 42156328',

    fecha: '2026-08-10',

    estado: 'Pendiente',

    detalles: [
      {
        productoId: 4,
        nombre: 'Mouse inalámbrico',
        cantidad: 2,
        precio: 85,
        importe: 170,
      },

      {
        productoId: 3,
        nombre: 'Teclado inalámbrico',
        cantidad: 1,
        precio: 145,
        importe: 145,
      },
    ],

    subtotal: 266.95,

    igv: 48.05,

    total: 315,
  },

  {
    id: 4,

    tipo: 'Factura',

    serie: 'F001',

    numero: '000126',

    cliente: 'Distribuciones Norte SAC',

    documento: 'RUC 20598765432',

    fecha: '2026-08-05',

    estado: 'Completada',

    detalles: [
      {
        productoId: 5,
        nombre: 'Impresora multifuncional',
        cantidad: 2,
        precio: 920,
        importe: 1840,
      },
    ],

    subtotal: 1559.32,

    igv: 280.68,

    total: 1840,
  },

  {
    id: 5,

    tipo: 'Boleta',

    serie: 'B001',

    numero: '000455',

    cliente: 'Pedro Ramírez',

    documento: 'DNI 47256891',

    fecha: '2026-08-03',

    estado: 'Completada',

    detalles: [
      {
        productoId: 4,
        nombre: 'Mouse inalámbrico',
        cantidad: 3,
        precio: 85,
        importe: 255,
      },
    ],

    subtotal: 216.1,

    igv: 38.9,

    total: 255,
  },
])

/*==================================================
    Productos
==================================================*/

const productos = ref([
  {
    id: 1,
    nombre: 'Laptop Lenovo ThinkPad',
    categoria: 'Computación',
    stock: 12,
    stockMinimo: 5,
  },

  {
    id: 2,
    nombre: 'Monitor LED 24"',
    categoria: 'Electrónica',
    stock: 25,
    stockMinimo: 10,
  },

  {
    id: 3,
    nombre: 'Teclado inalámbrico',
    categoria: 'Accesorios',
    stock: 8,
    stockMinimo: 10,
  },

  {
    id: 4,
    nombre: 'Mouse inalámbrico',
    categoria: 'Accesorios',
    stock: 4,
    stockMinimo: 8,
  },

  {
    id: 5,
    nombre: 'Impresora multifuncional',
    categoria: 'Oficina',
    stock: 2,
    stockMinimo: 5,
  },

  {
    id: 6,
    nombre: 'Disco SSD 1TB',
    categoria: 'Computación',
    stock: 0,
    stockMinimo: 5,
  },
])

/*==================================================
    Actualizar filtros
==================================================*/

const actualizarFiltros = (filtros) => {
  fechaInicio.value = filtros.fechaInicio

  fechaFin.value = filtros.fechaFin

  tipoReporte.value = filtros.tipoReporte
}

/*==================================================
    Ventas filtradas
==================================================*/

const ventasFiltradas = computed(() => {
  return ventas.value.filter((venta) => {
    return venta.fecha >= fechaInicio.value && venta.fecha <= fechaFin.value
  })
})

/*==================================================
    Total de ventas
==================================================*/

const totalVentas = computed(() => {
  return ventasFiltradas.value

    .filter((venta) => venta.estado === 'Completada')

    .reduce(
      (total, venta) => total + venta.total,

      0,
    )
})

/*==================================================
    Cantidad de ventas
==================================================*/

const cantidadVentas = computed(() => {
  return ventasFiltradas.value.filter((venta) => venta.estado === 'Completada').length
})

/*==================================================
    Ticket promedio
==================================================*/

const ticketPromedio = computed(() => {
  if (cantidadVentas.value === 0) {
    return 0
  }

  return totalVentas.value / cantidadVentas.value
})

/*==================================================
    Productos vendidos
==================================================*/

const productosVendidosDetalle = computed(() => {
  const acumulado = {}

  ventasFiltradas.value

    .filter((venta) => venta.estado === 'Completada')

    .forEach((venta) => {
      venta.detalles.forEach((detalle) => {
        if (!acumulado[detalle.productoId]) {
          acumulado[detalle.productoId] = {
            id: detalle.productoId,

            nombre: detalle.nombre,

            cantidad: 0,

            importe: 0,
          }
        }

        acumulado[detalle.productoId].cantidad += detalle.cantidad

        acumulado[detalle.productoId].importe += detalle.importe
      })
    })

  return Object.values(acumulado)

    .sort((a, b) => b.cantidad - a.cantidad)
})

const productosVendidos = computed(() => {
  return productosVendidosDetalle.value.reduce(
    (total, producto) => total + producto.cantidad,

    0,
  )
})

/*==================================================
    Inventario
==================================================*/

const productosSinStock = computed(() => {
  return productos.value.filter((producto) => producto.stock === 0).length
})

const productosCriticos = computed(() => {
  return productos.value.filter(
    (producto) => producto.stock > 0 && producto.stock <= producto.stockMinimo,
  ).length
})

const productosDisponibles = computed(() => {
  return productos.value.filter((producto) => producto.stock > producto.stockMinimo).length
})

/*==================================================
    Estado
==================================================*/

const obtenerClaseEstado = (estado) => {
  if (estado === 'Completada') {
    return 'completed'
  }

  if (estado === 'Pendiente') {
    return 'pending'
  }

  return 'cancelled'
}

/*==================================================
    Fecha
==================================================*/

const formatearFecha = (fecha) => {
  return new Intl.DateTimeFormat(
    'es-PE',

    {
      day: '2-digit',

      month: '2-digit',

      year: 'numeric',
    },
  ).format(new Date(fecha + 'T00:00:00'))
}

/*==================================================
    Imprimir
==================================================*/

const imprimirReporte = () => {
  window.print()
}
</script>

<style src="@/assets/css/views/reportes.css"></style>
