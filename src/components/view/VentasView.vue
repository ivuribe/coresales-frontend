<template>
  <div class="ventas">
    <!--==========================================
            ENCABEZADO
        ===========================================-->

    <div class="page-header">
      <div>
        <h1>Ventas</h1>

        <p>Administración de ventas y comprobantes.</p>
      </div>

      <button class="btn-primary" @click="nuevaVenta">
        <i class="fa-solid fa-cart-plus"></i>

        Nueva venta
      </button>
    </div>

    <!--==========================================
            RESUMEN
        ===========================================-->

    <div class="sales-summary">
      <div class="summary-card">
        <div class="summary-icon blue">
          <i class="fa-solid fa-cart-shopping"></i>
        </div>

        <div>
          <span> Ventas del mes </span>

          <strong> S/ {{ totalVentasMes.toFixed(2) }} </strong>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon green">
          <i class="fa-solid fa-file-invoice"></i>
        </div>

        <div>
          <span> Comprobantes </span>

          <strong>
            {{ ventas.length }}
          </strong>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon orange">
          <i class="fa-solid fa-clock"></i>
        </div>

        <div>
          <span> Pendientes </span>

          <strong>
            {{ ventasPendientes }}
          </strong>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon red">
          <i class="fa-solid fa-ban"></i>
        </div>

        <div>
          <span> Anuladas </span>

          <strong>
            {{ ventasAnuladas }}
          </strong>
        </div>
      </div>
    </div>

    <!--==========================================
            LISTADO
        ===========================================-->

    <section class="panel">
      <!--======================================
                TOOLBAR
            =======================================-->

      <div class="table-toolbar">
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass"></i>

          <input v-model="search" type="text" placeholder="Buscar venta..." />
        </div>

        <select v-model="filterStatus" class="filter-select">
          <option value="">Todos los estados</option>

          <option value="Completada">Completadas</option>

          <option value="Pendiente">Pendientes</option>

          <option value="Anulada">Anuladas</option>
        </select>
      </div>

      <!--======================================
                TABLA
            =======================================-->

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Comprobante</th>

              <th>Cliente</th>

              <th>Fecha</th>

              <th>Productos</th>

              <th>Total</th>

              <th>Estado</th>

              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="venta in ventasFiltradas" :key="venta.id">
              <td>
                <div class="document-info">
                  <div class="document-icon">
                    <i class="fa-solid fa-file-invoice"></i>
                  </div>

                  <div>
                    <strong> {{ venta.serie }}-{{ venta.numero }} </strong>

                    <small>
                      {{ venta.tipo }}
                    </small>
                  </div>
                </div>
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
                {{ formatearFecha(venta.fecha) }}
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

              <td>
                <div class="actions">
                  <button class="btn-icon view" title="Ver detalle" @click="verVenta(venta)">
                    <i class="fa-solid fa-eye"></i>
                  </button>

                  <button
                    v-if="venta.estado === 'Pendiente'"
                    class="btn-icon edit"
                    title="Editar"
                    @click="editarVenta(venta)"
                  >
                    <i class="fa-solid fa-pen"></i>
                  </button>

                  <button
                    v-if="venta.estado !== 'Anulada'"
                    class="btn-icon delete"
                    title="Anular"
                    @click="anularVenta(venta)"
                  >
                    <i class="fa-solid fa-ban"></i>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="ventasFiltradas.length === 0">
              <td colspan="7" class="empty">
                <i class="fa-solid fa-receipt"></i>

                <span> No se encontraron ventas. </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!--==========================================
            FORMULARIO
        ===========================================-->

    <VentaForm
      v-if="showForm"
      :venta="ventaSeleccionada"
      :clientes="clientes"
      :productos="productos"
      @guardar="guardarVenta"
      @cancelar="cerrarFormulario"
    />

    <!--==========================================
            DETALLE
        ===========================================-->

    <div v-if="showDetail" class="modal-overlay">
      <div class="modal detail-modal">
        <div class="modal-header">
          <div>
            <h2>Detalle de venta</h2>

            <p>{{ ventaDetalle.serie }}-{{ ventaDetalle.numero }}</p>
          </div>

          <button class="modal-close" @click="showDetail = false">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="detail-content">
          <div class="detail-header">
            <div>
              <span> Cliente </span>

              <strong>
                {{ ventaDetalle.cliente }}
              </strong>
            </div>

            <div>
              <span> Fecha </span>

              <strong>
                {{ formatearFecha(ventaDetalle.fecha) }}
              </strong>
            </div>
          </div>

          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Producto</th>

                  <th>Cantidad</th>

                  <th>Precio</th>

                  <th>Importe</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="detalle in ventaDetalle.detalles" :key="detalle.productoId">
                  <td>
                    {{ detalle.nombre }}
                  </td>

                  <td>
                    {{ detalle.cantidad }}
                  </td>

                  <td>S/ {{ detalle.precio.toFixed(2) }}</td>

                  <td>S/ {{ detalle.importe.toFixed(2) }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="detail-totals">
            <div>
              <span> Subtotal </span>

              <strong> S/ {{ ventaDetalle.subtotal.toFixed(2) }} </strong>
            </div>

            <div>
              <span> IGV (18%) </span>

              <strong> S/ {{ ventaDetalle.igv.toFixed(2) }} </strong>
            </div>

            <div class="total">
              <span> Total </span>

              <strong> S/ {{ ventaDetalle.total.toFixed(2) }} </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import VentaForm from '@/components/ventas/VentaForm.vue'

/*==================================================
    Variables
==================================================*/

const search = ref('')

const filterStatus = ref('')

const showForm = ref(false)

const showDetail = ref(false)

const ventaSeleccionada = ref(null)

const ventaDetalle = ref(null)

/*==================================================
    Clientes
==================================================*/

const clientes = ref([
  {
    id: 1,
    nombre: 'Juan Pérez',
    documento: 'DNI 45879632',
  },

  {
    id: 2,
    nombre: 'María García',
    documento: 'DNI 42156328',
  },

  {
    id: 3,
    nombre: 'Comercial Andina SAC',
    documento: 'RUC 20601234567',
  },

  {
    id: 4,
    nombre: 'Pedro Ramírez',
    documento: 'DNI 47256891',
  },
])

/*==================================================
    Productos
==================================================*/

const productos = ref([
  {
    id: 1,
    codigo: 'PROD-001',
    nombre: 'Laptop Lenovo ThinkPad',
    precio: 2850.0,
    stock: 12,
  },

  {
    id: 2,
    codigo: 'PROD-002',
    nombre: 'Monitor LED 24"',
    precio: 680.0,
    stock: 25,
  },

  {
    id: 3,
    codigo: 'PROD-003',
    nombre: 'Teclado inalámbrico',
    precio: 145.0,
    stock: 8,
  },

  {
    id: 4,
    codigo: 'PROD-004',
    nombre: 'Mouse inalámbrico',
    precio: 85.0,
    stock: 4,
  },

  {
    id: 5,
    codigo: 'PROD-005',
    nombre: 'Impresora multifuncional',
    precio: 920.0,
    stock: 2,
  },
])

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

    total: 5990.0,
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

    total: 680.0,
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

    total: 315.0,
  },
])

/*==================================================
    Filtro
==================================================*/

const ventasFiltradas = computed(() => {
  const texto = search.value.toLowerCase().trim()

  return ventas.value.filter((venta) => {
    const coincideTexto =
      !texto ||
      venta.serie.toLowerCase().includes(texto) ||
      venta.numero.toLowerCase().includes(texto) ||
      venta.cliente.toLowerCase().includes(texto) ||
      venta.documento.toLowerCase().includes(texto)

    const coincideEstado = !filterStatus.value || venta.estado === filterStatus.value

    return coincideTexto && coincideEstado
  })
})

/*==================================================
    Resumen
==================================================*/

const totalVentasMes = computed(() => {
  return ventas.value

    .filter((venta) => venta.estado === 'Completada')

    .reduce(
      (total, venta) => total + venta.total,

      0,
    )
})

const ventasPendientes = computed(() => {
  return ventas.value.filter((venta) => venta.estado === 'Pendiente').length
})

const ventasAnuladas = computed(() => {
  return ventas.value.filter((venta) => venta.estado === 'Anulada').length
})

/*==================================================
    Nueva venta
==================================================*/

const nuevaVenta = () => {
  ventaSeleccionada.value = null

  showForm.value = true
}

/*==================================================
    Editar
==================================================*/

const editarVenta = (venta) => {
  ventaSeleccionada.value = {
    ...venta,

    detalles: venta.detalles.map((detalle) => ({ ...detalle })),
  }

  showForm.value = true
}

/*==================================================
    Guardar
==================================================*/

const guardarVenta = (venta) => {
  if (venta.id) {
    const index = ventas.value.findIndex((item) => item.id === venta.id)

    if (index !== -1) {
      ventas.value[index] = venta
    }
  } else {
    const nuevoId = ventas.value.length ? Math.max(...ventas.value.map((item) => item.id)) + 1 : 1

    ventas.value.push({
      ...venta,

      id: nuevoId,
    })
  }

  cerrarFormulario()
}

/*==================================================
    Anular
==================================================*/

const anularVenta = (venta) => {
  const confirmar = window.confirm(`¿Desea anular la venta ${venta.serie}-${venta.numero}?`)

  if (!confirmar) return

  venta.estado = 'Anulada'
}

/*==================================================
    Ver detalle
==================================================*/

const verVenta = (venta) => {
  ventaDetalle.value = venta

  showDetail.value = true
}

/*==================================================
    Cerrar formulario
==================================================*/

const cerrarFormulario = () => {
  showForm.value = false

  ventaSeleccionada.value = null
}

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
</script>

<style src="@/assets/css/views/ventas.css"></style>
