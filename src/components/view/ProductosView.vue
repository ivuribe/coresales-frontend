<template>
  <div class="productos">
    <!--==========================================
            ENCABEZADO
        ===========================================-->

    <div class="page-header">
      <div>
        <h1>Productos</h1>

        <p>Administración de productos de CoreSales.</p>
      </div>

      <button class="btn-primary" @click="nuevoProducto">
        <i class="fa-solid fa-box"></i>

        Nuevo producto
      </button>
    </div>

    <!--==========================================
            PANEL PRINCIPAL
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

        <div class="product-counter">{{ productosFiltrados.length }} productos</div>
      </div>

      <!--======================================
                TABLA
            =======================================-->

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>Código</th>

              <th>Producto</th>

              <th>Categoría</th>

              <th>Precio</th>

              <th>Stock</th>

              <th>Estado</th>

              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="producto in productosFiltrados" :key="producto.id">
              <!-- Código -->

              <td>
                <strong>
                  {{ producto.codigo }}
                </strong>
              </td>

              <!-- Producto -->

              <td>
                <div class="product-name">
                  <div class="product-icon">
                    <i class="fa-solid fa-box"></i>
                  </div>

                  <div>
                    <span class="name">
                      {{ producto.nombre }}
                    </span>

                    <small>
                      {{ producto.marca }}
                    </small>
                  </div>
                </div>
              </td>

              <!-- Categoría -->

              <td>
                {{ producto.categoria }}
              </td>

              <!-- Precio -->

              <td>
                <strong> S/ {{ producto.precio.toFixed(2) }} </strong>
              </td>

              <!-- Stock -->

              <td>
                <div class="stock-info">
                  <span>
                    {{ producto.stock }}
                  </span>

                  <small :class="obtenerClaseStock(producto.stock)">
                    {{ obtenerEstadoStock(producto.stock) }}
                  </small>
                </div>
              </td>

              <!-- Estado -->

              <td>
                <span class="status" :class="producto.estado ? 'active' : 'inactive'">
                  {{ producto.estado ? 'Activo' : 'Inactivo' }}
                </span>
              </td>

              <!-- Acciones -->

              <td>
                <div class="actions">
                  <button class="btn-icon edit" title="Editar" @click="editarProducto(producto)">
                    <i class="fa-solid fa-pen"></i>
                  </button>

                  <button
                    class="btn-icon delete"
                    title="Eliminar"
                    @click="eliminarProducto(producto)"
                  >
                    <i class="fa-solid fa-trash"></i>
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
            FORMULARIO
        ===========================================-->

    <ProductoForm
      v-if="showForm"
      :producto="productoSeleccionado"
      :categorias="categorias"
      @guardar="guardarProducto"
      @cancelar="cerrarFormulario"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

import ProductoForm from '@/components/productos/ProductoForm.vue'

/*==================================================
    Variables
==================================================*/

const search = ref('')

const showForm = ref(false)

const productoSeleccionado = ref(null)

/*==================================================
    Categorías
==================================================*/

const categorias = ref(['Electrónica', 'Accesorios', 'Oficina', 'Computación', 'Otros'])

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
    estado: true,
  },

  {
    id: 2,
    codigo: 'PROD-002',
    nombre: 'Monitor LED 24"',
    marca: 'LG',
    categoria: 'Electrónica',
    precio: 680.0,
    stock: 25,
    estado: true,
  },

  {
    id: 3,
    codigo: 'PROD-003',
    nombre: 'Teclado inalámbrico',
    marca: 'Logitech',
    categoria: 'Accesorios',
    precio: 145.0,
    stock: 8,
    estado: true,
  },

  {
    id: 4,
    codigo: 'PROD-004',
    nombre: 'Mouse inalámbrico',
    marca: 'Logitech',
    categoria: 'Accesorios',
    precio: 85.0,
    stock: 4,
    estado: true,
  },

  {
    id: 5,
    codigo: 'PROD-005',
    nombre: 'Impresora multifuncional',
    marca: 'Epson',
    categoria: 'Oficina',
    precio: 920.0,
    stock: 2,
    estado: true,
  },

  {
    id: 6,
    codigo: 'PROD-006',
    nombre: 'Disco SSD 1TB',
    marca: 'Kingston',
    categoria: 'Computación',
    precio: 380.0,
    stock: 0,
    estado: false,
  },
])

/*==================================================
    Productos filtrados
==================================================*/

const productosFiltrados = computed(() => {
  const texto = search.value.toLowerCase().trim()

  if (!texto) {
    return productos.value
  }

  return productos.value.filter(
    (producto) =>
      producto.codigo.toLowerCase().includes(texto) ||
      producto.nombre.toLowerCase().includes(texto) ||
      producto.marca.toLowerCase().includes(texto) ||
      producto.categoria.toLowerCase().includes(texto),
  )
})

/*==================================================
    Nuevo producto
==================================================*/

const nuevoProducto = () => {
  productoSeleccionado.value = null

  showForm.value = true
}

/*==================================================
    Editar producto
==================================================*/

const editarProducto = (producto) => {
  productoSeleccionado.value = {
    ...producto,
  }

  showForm.value = true
}

/*==================================================
    Guardar producto
==================================================*/

const guardarProducto = (producto) => {
  if (producto.id) {
    const index = productos.value.findIndex((item) => item.id === producto.id)

    if (index !== -1) {
      productos.value[index] = producto
    }
  } else {
    const nuevoId = productos.value.length
      ? Math.max(...productos.value.map((item) => item.id)) + 1
      : 1

    productos.value.push({
      ...producto,

      id: nuevoId,
    })
  }

  cerrarFormulario()
}

/*==================================================
    Eliminar producto
==================================================*/

const eliminarProducto = (producto) => {
  const confirmar = window.confirm(`¿Desea eliminar el producto "${producto.nombre}"?`)

  if (!confirmar) return

  productos.value = productos.value.filter((item) => item.id !== producto.id)
}

/*==================================================
    Cerrar formulario
==================================================*/

const cerrarFormulario = () => {
  showForm.value = false

  productoSeleccionado.value = null
}

/*==================================================
    Estado del stock
==================================================*/

const obtenerEstadoStock = (stock) => {
  if (stock === 0) {
    return 'Sin stock'
  }

  if (stock <= 5) {
    return 'Stock crítico'
  }

  if (stock <= 10) {
    return 'Stock bajo'
  }

  return 'Disponible'
}

/*==================================================
    Clase del stock
==================================================*/

const obtenerClaseStock = (stock) => {
  if (stock === 0) {
    return 'stock-danger'
  }

  if (stock <= 5) {
    return 'stock-warning'
  }

  if (stock <= 10) {
    return 'stock-low'
  }

  return 'stock-ok'
}
</script>

<style src="@/assets/css/views/productos.css"></style>
