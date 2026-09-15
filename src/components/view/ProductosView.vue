<template>
  <div class="productos">
    <!--========================================== 
        MENSAJE DE ÉXITO 
    ===========================================-->
    <!-- Popup de éxito -->
    <div v-if="successMessage" class="success-overlay">
      <div class="success-popup">
        <div class="success-icon">
          <i class="fa-solid fa-check"></i>
        </div>
        <h3>Operación exitosa</h3>
        <p>{{ successMessage }}</p>
      </div>
    </div>
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
              <th>Costo</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            <!--====================================== 
                CARGANDO 
            =======================================-->
            <tr v-if="loading && productos.length === 0">
              <td colspan="7" class="empty">
                <i class="fa-solid fa-spinner fa-spin"></i>
                <span> Cargando productos... </span>
              </td>
            </tr>
            <!--====================================== 
                ERROR 
            =======================================-->
            <tr v-else-if="error">
              <td colspan="7" class="empty">
                <i class="fa-solid fa-circle-exclamation"></i>
                <span> {{ error }} </span>
              </td>
            </tr>
            <!--====================================== 
                PRODUCTOS 
            =======================================-->
            <tr v-for="producto in productosFiltrados" :key="producto.productoId">
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
                      {{ producto.marcaId }}
                    </small>
                  </div>
                </div>
              </td>

              <!-- Categoría -->
              <td>
                {{ producto.categoriaProducto?.nombre }}
              </td>

              <!-- PrecioCompra (Costo) -->
              <td>
                <strong> S/ {{ producto.precioCompra.toFixed(2) }} </strong>
              </td>

              <!-- PrecioVenta (Precio) -->
              <td>
                <strong> S/ {{ producto.precioVenta.toFixed(2) }} </strong>
              </td>

              <!-- Stock -->

              <td>
                <div class="stock-info">
                  <span>
                    {{ producto.stockMinimo }}
                  </span>
                  <small :class="obtenerClaseStock(producto.stockMinimo)">
                    {{ obtenerEstadoStock(producto.stockMinimo) }}
                  </small>
                </div>
              </td>

              <!-- Estado -->
              <td>
                <span class="status" :class="producto.activo ? 'active' : 'inactive'">
                  {{ producto.activo ? 'Activo' : 'Inactivo' }}
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
      :marcas="marcas"
      @guardar="guardarProducto"
      @cancelar="cerrarFormulario"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProductoForm from '@/components/productos/ProductoForm.vue'
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '@/services/productService'

/*==================================================
    Variables
==================================================*/
const search = ref('')
const showForm = ref(false)
const productoSeleccionado = ref(null)
const productos = ref([])
const loading = ref(false)
const error = ref('')
const successMessage = ref('')

/*==================================================
    Categorías
==================================================*/
const categorias = ref([
  { categoriaProductoId: 1, nombre: 'Computación' },
  { categoriaProductoId: 2, nombre: 'Electrónica' },
  { categoriaProductoId: 3, nombre: 'Accesorios' },
  { categoriaProductoId: 4, nombre: 'Oficina' },
])

/*==================================================
    Marcas
==================================================*/
const marcas = ref([
  { marcaId: 1, nombre: 'Lenovo' },
  { marcaId: 2, nombre: 'LG' },
  { marcaId: 3, nombre: 'Logitech' },
  { marcaId: 4, nombre: 'HP' },
  { marcaId: 5, nombre: 'Kingston' },
  { marcaId: 6, nombre: 'Epson' },
])

/*==================================================
    Inicialización
==================================================*/
onMounted(() => {
  loadProducts()
})

/*==================================================
    Obtener productos
==================================================*/
const loadProducts = async () => {
  loading.value = true
  error.value = ''

  try {
    const data = await getProducts()
    console.log('LISTA DE PRODUCTOS RECIBIDOS DEL MICROSERVICIO:', data)
    productos.value = data
  } catch (err) {
    console.error('Error al obtener productos:', err)
    error.value = err.response?.data?.message || 'No se pudieron cargar los productos.'
  } finally {
    loading.value = false
  }
}

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
      producto.marca?.nombre.toLowerCase().includes(texto) ||
      producto.categoriaProducto?.nombre.toLowerCase().includes(texto),
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
  console.log('PRDOUCTO SELECCIONADO: ', producto)
  productoSeleccionado.value = {
    ...producto,
  }
  console.log('PRDOUCTO SELECCIONADO 2: ', productoSeleccionado.value)
  showForm.value = true
}

/*==================================================
    Guardar producto
==================================================*/
const guardarProducto = async (producto) => {
  loading.value = true
  error.value = ''
  console.log('PRODUCTO A GUARDAR:', producto)
  try {
    /*
     * UPDATE
     */
    if (producto.productoId) {
      await updateProduct(producto.productoId, producto)
      showSuccessMessage('El producto se actualizó correctamente!')
      /*
       * INSERT
       */
    } else {
      await createProduct(producto)
      showSuccessMessage('El producto se registró exitosamente!')
    }

    /*
     * Volvemos a consultar el backend.
     *
     * De esta manera la tabla refleja
     * exactamente lo que está almacenado
     * en SQL Server.
     */
    await loadProducts()
    cerrarFormulario()
  } catch (err) {
    console.error('Error al guardar producto:', err)
    error.value = err.response?.data?.message || 'No se pudo guardar el producto.'
  } finally {
    loading.value = false
  }
}

/*==================================================
    Eliminar producto
==================================================*/
const eliminarProducto = async (producto) => {
  const confirmar = window.confirm(`¿Desea eliminar el producto "${producto.nombre}"?`)

  if (!confirmar) return (loading.value = true)
  error.value = ''

  try {
    await deleteProduct(producto.productoId)
    /*
     * Recargar desde el backend.
     */
    await loadProducts()
    showSuccessMessage('El producto se anuló exitosamente!')
  } catch (err) {
    console.error('Error al eliminar producto:', err)
    error.value = err.response?.data?.message || 'No se pudo eliminar el producto.'
  } finally {
    loading.value = false
  }
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

/*==================================================
Mensaje de éxito
==================================================*/
const showSuccessMessage = (message) => {
  successMessage.value = message
  setTimeout(() => {
    successMessage.value = ''
  }, 2500)
}
</script>

<style src="@/assets/css/views/productos.css"></style>
