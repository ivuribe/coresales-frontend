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

              <th>Costo</th>

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
                <strong> S/ {{ producto.costo.toFixed(2) }} </strong>
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

/*==================================================
    Categorías
==================================================*/
const categorias = ref(['Computación', 'Electrónica', 'Accesorios', 'Oficina'])

/*==================================================
    Marcas
==================================================*/
const marcas = ref(['Lenovo', 'LG', 'Logitech', 'HP', 'Kingston', 'Epson'])

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

    productos.value = data.map((producto) => ({
      ...producto,
      /*
       * Adaptación para la interfaz.
       */
      id: producto.productoId,
      codigo: producto.codigo || '',
      nombreProducto: producto.nombre || '',
      marca: producto.marcaId || '',
      categoria: producto.categoriaProductoId || '',
      costo: Number(producto.precioCompra ?? 0),
      precio: Number(producto.precioVenta ?? 0),
      stock: Number(producto.stockMinimo ?? 0),
      estado: producto.estado ?? producto.activo ?? true,
    }))
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
const guardarProducto = async (producto) => {
  loading.value = true
  error.value = ''

  try {
    const productoRequest = prepararProducto(producto)

    /*
     * UPDATE
     */
    if (producto.id) {
      await updateProduct(producto.id, productoRequest)

      /*
       * INSERT
       */
    } else {
      await createProduct(productoRequest)
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
    Preparar producto
==================================================*/
const prepararProducto = (producto) => {
  return {
    id: producto.id,
    codigo: producto.codigo,
    nombre: producto.nombre,
    marca: producto.marca,
    categoria: producto.categoria,
    precio: Number(producto.precio),
    stock: Number(producto.stock),
    estado: producto.estado ?? true,
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
    await deleteProduct(producto.id)
    /*
     * Recargar desde el backend.
     */
    await loadProducts()
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
</script>

<style src="@/assets/css/views/productos.css"></style>
