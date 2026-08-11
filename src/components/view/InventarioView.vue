<template>
  <div class="inventario">
    <!--==========================================
            ENCABEZADO
        ===========================================-->

    <div class="page-header">
      <div>
        <h1>Inventario</h1>

        <p>Control de existencias y movimientos de productos.</p>
      </div>

      <button class="btn-primary" @click="nuevoMovimiento">
        <i class="fa-solid fa-right-left"></i>

        Nuevo movimiento
      </button>
    </div>

    <!--==========================================
            RESUMEN
        ===========================================-->

    <div class="inventory-summary">
      <!-- Total productos -->

      <div class="summary-card">
        <div class="summary-icon blue">
          <i class="fa-solid fa-boxes-stacked"></i>
        </div>

        <div>
          <span> Productos </span>

          <strong>
            {{ productos.length }}
          </strong>
        </div>
      </div>

      <!-- Unidades -->

      <div class="summary-card">
        <div class="summary-icon green">
          <i class="fa-solid fa-cubes"></i>
        </div>

        <div>
          <span> Unidades en stock </span>

          <strong>
            {{ totalUnidades }}
          </strong>
        </div>
      </div>

      <!-- Stock crítico -->

      <div class="summary-card">
        <div class="summary-icon orange">
          <i class="fa-solid fa-triangle-exclamation"></i>
        </div>

        <div>
          <span> Stock crítico </span>

          <strong>
            {{ productosCriticos }}
          </strong>
        </div>
      </div>

      <!-- Sin stock -->

      <div class="summary-card">
        <div class="summary-icon red">
          <i class="fa-solid fa-circle-xmark"></i>
        </div>

        <div>
          <span> Sin stock </span>

          <strong>
            {{ productosSinStock }}
          </strong>
        </div>
      </div>
    </div>

    <!--==========================================
            PANEL DE INVENTARIO
        ===========================================-->

    <section class="panel">
      <!--======================================
                TOOLBAR
            =======================================-->

      <div class="table-toolbar">
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass"></i>

          <input v-model="search" type="text" placeholder="Buscar producto..." />
        </div>

        <select v-model="filterStock" class="filter-select">
          <option value="">Todos</option>

          <option value="available">Disponible</option>

          <option value="low">Stock bajo</option>

          <option value="critical">Stock crítico</option>

          <option value="empty">Sin stock</option>
        </select>
      </div>

      <!--======================================
                TABLA
            =======================================-->

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Producto</th>

              <th>Código</th>

              <th>Categoría</th>

              <th>Stock</th>

              <th>Stock mínimo</th>

              <th>Estado</th>

              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="producto in productosFiltrados" :key="producto.id">
              <!-- Producto -->

              <td>
                <div class="product-info">
                  <div class="product-icon">
                    <i class="fa-solid fa-box"></i>
                  </div>

                  <div>
                    <strong>
                      {{ producto.nombre }}
                    </strong>

                    <small>
                      {{ producto.marca }}
                    </small>
                  </div>
                </div>
              </td>

              <!-- Código -->

              <td>
                {{ producto.codigo }}
              </td>

              <!-- Categoría -->

              <td>
                {{ producto.categoria }}
              </td>

              <!-- Stock -->

              <td>
                <div class="stock-value">
                  <strong>
                    {{ producto.stock }}
                  </strong>

                  <span> unidades </span>
                </div>
              </td>

              <!-- Stock mínimo -->

              <td>
                {{ producto.stockMinimo }}
              </td>

              <!-- Estado -->

              <td>
                <span class="stock-status" :class="obtenerClaseStock(producto)">
                  {{ obtenerEstadoStock(producto) }}
                </span>
              </td>

              <!-- Acciones -->

              <td>
                <div class="actions">
                  <button
                    class="btn-icon entry"
                    title="Registrar entrada"
                    @click="registrarEntrada(producto)"
                  >
                    <i class="fa-solid fa-arrow-down"></i>
                  </button>

                  <button
                    class="btn-icon exit"
                    title="Registrar salida"
                    @click="registrarSalida(producto)"
                  >
                    <i class="fa-solid fa-arrow-up"></i>
                  </button>

                  <button
                    class="btn-icon history"
                    title="Ver movimientos"
                    @click="verMovimientos(producto)"
                  >
                    <i class="fa-solid fa-clock-rotate-left"></i>
                  </button>
                </div>
              </td>
            </tr>

            <!-- Sin resultados -->

            <tr v-if="productosFiltrados.length === 0">
              <td colspan="7" class="empty">
                <i class="fa-solid fa-box-open"></i>

                <span> No se encontraron productos. </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!--==========================================
            FORMULARIO DE MOVIMIENTO
        ===========================================-->

    <MovimientoForm
      v-if="showForm"
      :producto="productoSeleccionado"
      :tipo-inicial="tipoMovimiento"
      @guardar="guardarMovimiento"
      @cancelar="cerrarFormulario"
    />

    <!--==========================================
            HISTORIAL DE MOVIMIENTOS
        ===========================================-->

    <div v-if="showHistory" class="modal-overlay">
      <div class="modal history-modal">
        <div class="modal-header">
          <div>
            <h2>Historial de movimientos</h2>

            <p>
              {{ productoHistorial?.nombre }}
            </p>
          </div>

          <button class="modal-close" @click="cerrarHistorial">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="history-content">
          <div v-if="movimientosProducto.length === 0" class="empty-history">
            <i class="fa-solid fa-clock-rotate-left"></i>

            <p>No existen movimientos registrados.</p>
          </div>

          <div v-else class="movement-list">
            <div
              v-for="movimiento in movimientosProducto"
              :key="movimiento.id"
              class="movement-item"
            >
              <div class="movement-icon" :class="movimiento.tipo.toLowerCase()">
                <i
                  :class="
                    movimiento.tipo === 'Entrada'
                      ? 'fa-solid fa-arrow-down'
                      : movimiento.tipo === 'Salida'
                        ? 'fa-solid fa-arrow-up'
                        : 'fa-solid fa-sliders'
                  "
                ></i>
              </div>

              <div class="movement-info">
                <strong>
                  {{ movimiento.tipo }}
                </strong>

                <span>
                  {{ movimiento.motivo }}
                </span>

                <small>
                  {{ formatearFecha(movimiento.fecha) }}
                </small>
              </div>

              <div class="movement-quantity" :class="movimiento.tipo.toLowerCase()">
                {{ movimiento.tipo === 'Salida' ? '-' : '+' }}

                {{ movimiento.cantidad }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import MovimientoForm from '@/components/inventario/MovimientoForm.vue'

/*==================================================
    Variables
==================================================*/

const search = ref('')

const filterStock = ref('')

const showForm = ref(false)

const showHistory = ref(false)

const productoSeleccionado = ref(null)

const productoHistorial = ref(null)

const tipoMovimiento = ref('Entrada')

/*==================================================
    Productos
==================================================*/

const productos = ref([
  {
    id: 1,
    codigo: 'PROD-001',
    nombre: 'Laptop Lenovo ThinkPad',
    marca: 'Lenovo',
    categoria: 'Computación',
    precio: 2850.0,
    stock: 12,
    stockMinimo: 5,
  },

  {
    id: 2,
    codigo: 'PROD-002',
    nombre: 'Monitor LED 24"',
    marca: 'LG',
    categoria: 'Electrónica',
    precio: 680.0,
    stock: 25,
    stockMinimo: 10,
  },

  {
    id: 3,
    codigo: 'PROD-003',
    nombre: 'Teclado inalámbrico',
    marca: 'Logitech',
    categoria: 'Accesorios',
    precio: 145.0,
    stock: 8,
    stockMinimo: 10,
  },

  {
    id: 4,
    codigo: 'PROD-004',
    nombre: 'Mouse inalámbrico',
    marca: 'Logitech',
    categoria: 'Accesorios',
    precio: 85.0,
    stock: 4,
    stockMinimo: 8,
  },

  {
    id: 5,
    codigo: 'PROD-005',
    nombre: 'Impresora multifuncional',
    marca: 'Epson',
    categoria: 'Oficina',
    precio: 920.0,
    stock: 2,
    stockMinimo: 5,
  },

  {
    id: 6,
    codigo: 'PROD-006',
    nombre: 'Disco SSD 1TB',
    marca: 'Kingston',
    categoria: 'Computación',
    precio: 380.0,
    stock: 0,
    stockMinimo: 5,
  },
])

/*==================================================
    Movimientos
==================================================*/

const movimientos = ref([
  {
    id: 1,
    productoId: 1,
    tipo: 'Entrada',
    cantidad: 15,
    motivo: 'Compra a proveedor',
    fecha: '2026-08-01',
  },

  {
    id: 2,
    productoId: 1,
    tipo: 'Salida',
    cantidad: 3,
    motivo: 'Venta',
    fecha: '2026-08-08',
  },

  {
    id: 3,
    productoId: 2,
    tipo: 'Entrada',
    cantidad: 30,
    motivo: 'Compra a proveedor',
    fecha: '2026-08-03',
  },

  {
    id: 4,
    productoId: 2,
    tipo: 'Salida',
    cantidad: 5,
    motivo: 'Venta',
    fecha: '2026-08-09',
  },

  {
    id: 5,
    productoId: 3,
    tipo: 'Salida',
    cantidad: 2,
    motivo: 'Venta',
    fecha: '2026-08-10',
  },

  {
    id: 6,
    productoId: 4,
    tipo: 'Salida',
    cantidad: 3,
    motivo: 'Venta',
    fecha: '2026-08-10',
  },
])

/*==================================================
    Filtro
==================================================*/

const productosFiltrados = computed(() => {
  const texto = search.value.toLowerCase().trim()

  return productos.value.filter((producto) => {
    const coincideTexto =
      !texto ||
      producto.nombre.toLowerCase().includes(texto) ||
      producto.codigo.toLowerCase().includes(texto) ||
      producto.categoria.toLowerCase().includes(texto)

    const coincideStock = !filterStock.value || obtenerTipoStock(producto) === filterStock.value

    return coincideTexto && coincideStock
  })
})

/*==================================================
    Resumen
==================================================*/

const totalUnidades = computed(() => {
  return productos.value.reduce(
    (total, producto) => total + producto.stock,

    0,
  )
})

const productosCriticos = computed(() => {
  return productos.value.filter(
    (producto) => producto.stock > 0 && producto.stock <= producto.stockMinimo,
  ).length
})

const productosSinStock = computed(() => {
  return productos.value.filter((producto) => producto.stock === 0).length
})

/*==================================================
    Estado del stock
==================================================*/

const obtenerTipoStock = (producto) => {
  if (producto.stock === 0) {
    return 'empty'
  }

  if (producto.stock <= producto.stockMinimo) {
    return 'critical'
  }

  if (producto.stock <= producto.stockMinimo * 2) {
    return 'low'
  }

  return 'available'
}

const obtenerEstadoStock = (producto) => {
  const tipo = obtenerTipoStock(producto)

  if (tipo === 'empty') {
    return 'Sin stock'
  }

  if (tipo === 'critical') {
    return 'Stock crítico'
  }

  if (tipo === 'low') {
    return 'Stock bajo'
  }

  return 'Disponible'
}

const obtenerClaseStock = (producto) => {
  return obtenerTipoStock(producto)
}

/*==================================================
    Nuevo movimiento
==================================================*/

const nuevoMovimiento = () => {
  productoSeleccionado.value = null

  tipoMovimiento.value = 'Entrada'

  showForm.value = true
}

/*==================================================
    Entrada
==================================================*/

const registrarEntrada = (producto) => {
  productoSeleccionado.value = {
    ...producto,
  }

  tipoMovimiento.value = 'Entrada'

  showForm.value = true
}

/*==================================================
    Salida
==================================================*/

const registrarSalida = (producto) => {
  productoSeleccionado.value = {
    ...producto,
  }

  tipoMovimiento.value = 'Salida'

  showForm.value = true
}

/*==================================================
    Guardar movimiento
==================================================*/

const guardarMovimiento = (movimiento) => {
  const producto = productos.value.find((item) => item.id === movimiento.productoId)

  if (!producto) return

  /*==========================================
        Validar salida
    ==========================================*/

  if (movimiento.tipo === 'Salida' && movimiento.cantidad > producto.stock) {
    window.alert('No existe stock suficiente para realizar la salida.')

    return
  }

  /*==========================================
        Actualizar stock
    ==========================================*/

  if (movimiento.tipo === 'Entrada') {
    producto.stock += movimiento.cantidad
  }

  if (movimiento.tipo === 'Salida') {
    producto.stock -= movimiento.cantidad
  }

  if (movimiento.tipo === 'Ajuste') {
    producto.stock = movimiento.cantidad
  }

  /*==========================================
        Registrar movimiento
    ==========================================*/

  const nuevoId = movimientos.value.length
    ? Math.max(...movimientos.value.map((item) => item.id)) + 1
    : 1

  movimientos.value.push({
    ...movimiento,

    id: nuevoId,
  })

  cerrarFormulario()
}

/*==================================================
    Cerrar formulario
==================================================*/

const cerrarFormulario = () => {
  showForm.value = false

  productoSeleccionado.value = null
}

/*==================================================
    Ver movimientos
==================================================*/

const verMovimientos = (producto) => {
  productoHistorial.value = producto

  showHistory.value = true
}

/*==================================================
    Movimientos del producto
==================================================*/

const movimientosProducto = computed(() => {
  if (!productoHistorial.value) {
    return []
  }

  return movimientos.value

    .filter((movimiento) => movimiento.productoId === productoHistorial.value.id)

    .sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
})

/*==================================================
    Cerrar historial
==================================================*/

const cerrarHistorial = () => {
  showHistory.value = false

  productoHistorial.value = null
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

<style src="@/assets/css/views/inventario.css"></style>
