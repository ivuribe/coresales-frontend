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

            <tr v-if="clientesFiltrados.length === 0">
              <td colspan="7" class="empty">No se encontraron clientes.</td>
            </tr>
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
import { ref, computed } from 'vue'

import ClienteForm from '@/components/clientes/ClienteForm.vue'

/*==================================================
    Variables
==================================================*/

const search = ref('')

const showForm = ref(false)

const clienteSeleccionado = ref(null)

/*==================================================
    Clientes
==================================================*/

const clientes = ref([
  {
    id: 1,
    nombre: 'Juan Pérez',
    documento: 'DNI 45879632',
    telefono: '987 654 321',
    email: 'juan.perez@email.com',
    estado: true,
  },

  {
    id: 2,
    nombre: 'María García',
    documento: 'DNI 42156328',
    telefono: '986 321 654',
    email: 'maria.garcia@email.com',
    estado: true,
  },

  {
    id: 3,
    nombre: 'Comercial Andina SAC',
    documento: 'RUC 20601234567',
    telefono: '01 456 7890',
    email: 'contacto@andina.com',
    estado: true,
  },

  {
    id: 4,
    nombre: 'Pedro Ramírez',
    documento: 'DNI 47256891',
    telefono: '985 741 236',
    email: 'pedro.ramirez@email.com',
    estado: false,
  },
])

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
    Nuevo cliente
==================================================*/

const nuevoCliente = () => {
  clienteSeleccionado.value = null

  showForm.value = true
}

/*==================================================
    Editar cliente
==================================================*/

const editarCliente = (cliente) => {
  clienteSeleccionado.value = {
    ...cliente,
  }

  showForm.value = true
}

/*==================================================
    Guardar cliente
==================================================*/

const guardarCliente = (cliente) => {
  if (cliente.id) {
    const index = clientes.value.findIndex((item) => item.id === cliente.id)

    if (index !== -1) {
      clientes.value[index] = cliente
    }
  } else {
    const nuevoId = clientes.value.length
      ? Math.max(...clientes.value.map((item) => item.id)) + 1
      : 1

    clientes.value.push({
      ...cliente,

      id: nuevoId,
    })
  }

  cerrarFormulario()
}

/*==================================================
    Eliminar cliente
==================================================*/

const eliminarCliente = (cliente) => {
  const confirmar = window.confirm(`¿Desea eliminar al cliente "${cliente.nombre}"?`)

  if (!confirmar) return

  clientes.value = clientes.value.filter((item) => item.id !== cliente.id)
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
  return nombre

    .split(' ')

    .slice(0, 2)

    .map((palabra) => palabra.charAt(0))

    .join('')

    .toUpperCase()
}
</script>

<style src="@/assets/css/views/clientes.css"></style>
