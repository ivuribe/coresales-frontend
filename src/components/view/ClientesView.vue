<template>
  <div class="clientes">
    <!--==========================================
            ENCABEZADO
        ===========================================-->

    <div class="page-header">
      <div>
        <h1>Clientes</h1>

        <p>Administración de clientes de CoreSales.</p>
      </div>

      <button class="btn-primary" @click="nuevoCliente">
        <i class="fa-solid fa-user-plus"></i>

        Nuevo cliente
      </button>
    </div>

    <!--==========================================
            PANEL PRINCIPAL
        ===========================================-->

    <section class="panel">
      <!--======================================
                BÚSQUEDA
            =======================================-->

      <div class="table-toolbar">
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass"></i>

          <input v-model="search" type="text" placeholder="Buscar cliente..." />
        </div>
      </div>

      <!--======================================
                TABLA
            =======================================-->

      <div class="table-container">
        <table>
          <thead>
            <tr>
              <th>ID</th>

              <th>Cliente</th>

              <th>Documento</th>

              <th>Teléfono</th>

              <th>Email</th>

              <th>Estado</th>

              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            tbody>
            <!-- Cargando -->
            <tr v-if="loading && clientes.length === 0">
              <td colspan="7" class="empty">
                <i class="fa-solid fa-spinner fa-spin"></i>
                Cargando clientes...
              </td>
            </tr>

            <!-- Error -->
            <tr v-else-if="error">
              <td colspan="7" class="empty">
                {{ error }}
              </td>
            </tr>

            <!-- Clientes -->
            <template v-else>
              <tr v-for="cliente in clientesFiltrados" :key="cliente.id">
                <td>
                  {{ cliente.id }}
                </td>
                <td>
                  <div class="client-name">
                    <div class="client-avatar">
                      {{ obtenerIniciales(cliente.nombre) }}
                    </div>
                    <span>
                      {{ cliente.nombre }}
                    </span>
                  </div>
                </td>
                <td>
                  {{ cliente.documento }}
                </td>
                <td>
                  {{ cliente.telefono }}
                </td>
                <td>
                  {{ cliente.email }}
                </td>
                <td>
                  <span class="status" :class="cliente.estado ? 'active' : 'inactive'">
                    {{ cliente.estado ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td>
                  <div class="actions">
                    <button class="btn-icon edit" title="Editar" @click="editarCliente(cliente)">
                      <i class="fa-solid fa-pen"></i>
                    </button>
                    <button
                      class="btn-icon delete"
                      title="Eliminar"
                      @click="eliminarCliente(cliente)"
                    >
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
              <!-- Sin resultados -->
              <tr v-if="clientesFiltrados.length === 0">
                <td colspan="7" class="empty">No se encontraron clientes.</td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </section>

    <!--==========================================
            FORMULARIO
        ===========================================-->

    <ClienteForm
      v-if="showForm"
      :cliente="clienteSeleccionado"
      @guardar="guardarCliente"
      @cancelar="cerrarFormulario"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ClienteForm from '@/components/clientes/ClienteForm.vue'
import {
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from '@/services/customerService'

/*==================================================
    Variables
==================================================*/
const search = ref('')
const showForm = ref(false)
const clienteSeleccionado = ref(null)
const clientes = ref([])
const loading = ref(false)
const error = ref('')

/*================================================== 
    Inicialización 
==================================================*/
onMounted(() => {
  loadCustomers()
})

/*==================================================
    Obtener Clientes
==================================================*/
const loadCustomers = async () => {
  loading.value = true
  error.value = ''
  try {
    const data = await getCustomers()

    /*
     * El servicio devuelve response.data.
     *
     * Se transforma la respuesta del backend
     * al formato utilizado actualmente por la interfaz.
     */
    clientes.value = data.map((cliente) => ({
      id: cliente.id,
      nombre: obtenerNombre(cliente),
      documento: cliente.numeroDocumento,
      telefono: cliente.telefono || '',
      email: cliente.email || '',
      estado: cliente.activo,

      /*
       * Conservamos los datos originales.
       * Esto será útil para editar.
       */
      ...cliente,
    }))
  } catch (err) {
    console.error('Error al obtener clientes:', err)
    error.value = err.response?.data?.message || 'No se pudieron cargar los clientes.'
  } finally {
    loading.value = false
  }
}

/*================================================== 
    Construir nombre 
==================================================*/
const obtenerNombre = (cliente) => {
  /*
   * Persona natural
   */
  if (cliente.nombres || cliente.apellidos) {
    return [cliente.nombres, cliente.apellidos].filter(Boolean).join(' ')
  }

  /*
   * Persona jurídica
   */
  if (cliente.razonSocial) {
    return cliente.razonSocial
  }

  /*
   * Por compatibilidad si el backend
   * ya devuelve nombre.
   */
  return cliente.nombre || ''
}

/*==================================================
    Clientes filtrados
==================================================*/
const clientesFiltrados = computed(() => {
  const texto = search.value.toLowerCase().trim()
  if (!texto) {
    return clientes.value
  }
  return clientes.value.filter(
    (cliente) =>
      cliente.nombre.toLowerCase().includes(texto) ||
      cliente.documento.toLowerCase().includes(texto) ||
      cliente.email.toLowerCase().includes(texto),
  )
})

/*==================================================
    Nuevo cliente - Mostrar Formulario
==================================================*/
const nuevoCliente = () => {
  clienteSeleccionado.value = null
  showForm.value = true
}

/*==================================================
    Editar cliente - Mostrar Formulario
==================================================*/
const editarCliente = (cliente) => {
  clienteSeleccionado.value = { ...cliente } //...cliente esta sintaxis es una operación de propagación
  showForm.value = true
}

/*==================================================
    Guardar cliente
==================================================*/
const guardarCliente = async (cliente) => {
  loading.value = true
  error.value = ''

  try {
    /*
     * Si existe ID: UPDATE
     *
     * Si no existe: INSERT
     */

    if (cliente.id) {
      await updateCustomer(cliente.id, prepararCliente(cliente))
    } else {
      await createCustomer(prepararCliente(cliente))
    }

    /*
     * Volvemos a consultar el backend
     * para mostrar los datos realmente
     * almacenados en la base de datos.
     */
    await loadCustomers()
    cerrarFormulario()
  } catch (err) {
    console.error('Error al guardar cliente:', err)
    error.value = err.response?.data?.message || 'No se pudo guardar el cliente.'
  } finally {
    loading.value = false
  }
}

/*================================================== 
    Preparar cliente para API 
==================================================*/
const prepararCliente = (cliente) => {
  return {
    id: cliente.id,
    tipoDocumentoId: cliente.tipoDocumentoId,
    numeroDocumento: cliente.numeroDocumento || cliente.documento,
    nombres: cliente.nombres,
    apellidos: cliente.apellidos,
    razonSocial: cliente.razonSocial,
    email: cliente.email,
    telefono: cliente.telefono,
    direccion: cliente.direccion,
    activo: cliente.activo ?? cliente.estado ?? true,
  }
}

/*==================================================
    Eliminar cliente
==================================================*/
const eliminarCliente = async (cliente) => {
  const confirmar = window.confirm(`¿Desea eliminar al cliente "${cliente.nombre}"?`)
  if (!confirmar) return

  loading.value = true
  error.value = ''

  try {
    await deleteCustomer(cliente.id)

    /*
     * Recargamos la información
     * desde el backend.
     */
    await loadCustomers()
  } catch (err) {
    console.error('Error al eliminar cliente:', err)
    error.value = err.response?.data?.message || 'No se pudo eliminar el cliente.'
  } finally {
    loading.value = false
  }
}

/*==================================================
    Cerrar formulario
==================================================*/
const cerrarFormulario = () => {
  showForm.value = false
  clienteSeleccionado.value = null
}

/*==================================================
    Iniciales
==================================================*/
const obtenerIniciales = (nombre) => {
  if (!nombre) {
    return '?'
  }

  return nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((palabra) => palabra.charAt(0))
    .join('')
    .toUpperCase()
}
</script>

<style src="@/assets/css/views/clientes.css"></style>
