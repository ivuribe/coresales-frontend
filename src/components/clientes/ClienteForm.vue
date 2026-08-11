<template>
  <div class="modal-overlay">
    <div class="modal">
      <!--======================================
                ENCABEZADO
            =======================================-->

      <div class="modal-header">
        <div>
          <h2>
            {{ form.id ? 'Editar cliente' : 'Nuevo cliente' }}
          </h2>

          <p>Complete la información del cliente.</p>
        </div>

        <button class="modal-close" @click="$emit('cancelar')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!--======================================
                FORMULARIO
            =======================================-->

      <form @submit.prevent="guardar">
        <div class="form-grid">
          <!-- Nombre -->

          <div class="form-group full">
            <label> Nombre / Razón social </label>

            <input v-model="form.nombre" type="text" placeholder="Ingrese el nombre" required />
          </div>

          <!-- Documento -->

          <div class="form-group">
            <label> Documento </label>

            <input v-model="form.documento" type="text" placeholder="DNI / RUC" required />
          </div>

          <!-- Teléfono -->

          <div class="form-group">
            <label> Teléfono </label>

            <input v-model="form.telefono" type="text" placeholder="Ingrese el teléfono" />
          </div>

          <!-- Email -->

          <div class="form-group full">
            <label> Email </label>

            <input v-model="form.email" type="email" placeholder="cliente@email.com" />
          </div>

          <!-- Estado -->

          <div class="form-group">
            <label> Estado </label>

            <select v-model="form.estado">
              <option :value="true">Activo</option>

              <option :value="false">Inactivo</option>
            </select>
          </div>
        </div>

        <!--======================================
                    BOTONES
                =======================================-->

        <div class="modal-footer">
          <button type="button" class="btn-secondary" @click="$emit('cancelar')">Cancelar</button>

          <button type="submit" class="btn-primary">
            <i class="fa-solid fa-floppy-disk"></i>

            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

/*==================================================
    Props
==================================================*/

const props = defineProps({
  cliente: {
    type: Object,

    default: null,
  },
})

/*==================================================
    Eventos
==================================================*/

const emit = defineEmits(['guardar', 'cancelar'])

/*==================================================
    Formulario
==================================================*/

const form = reactive({
  id: props.cliente?.id ?? null,

  nombre: props.cliente?.nombre ?? '',

  documento: props.cliente?.documento ?? '',

  telefono: props.cliente?.telefono ?? '',

  email: props.cliente?.email ?? '',

  estado: props.cliente?.estado ?? true,
})

/*==================================================
    Guardar
==================================================*/

const guardar = () => {
  emit(
    'guardar',

    {
      ...form,
    },
  )
}
</script>
