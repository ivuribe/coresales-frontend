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
          <!--====================================== 
              TIPO DOCUMENTO 
          =======================================-->
          <div class="form-group">
            <label> Tipo de documento </label>
            <select v-model="form.tipoDocumento" required>
              <option :value="null" disabled>Seleccione</option>
              <!-- 
                IMPORTANTE: 
                Estos IDs deben coincidir con 
                tu tabla TipoDocumento. 
              -->
              <option :value="1">DNI</option>
              <option :value="2">RUC</option>
              <option :value="3">CE</option>
            </select>
          </div>
          <!--====================================== 
              NÚMERO DOCUMENTO 
          =======================================-->
          <div class="form-group">
            <label> Número de documento </label>
            <input v-model="form.numeroDocumento" type="text" placeholder="DNI / RUC" required />
          </div>

          <!--====================================== 
              NOMBRES 
          =======================================-->
          <div class="form-group">
            <label> Nombres </label>
            <input v-model="form.nombres" type="text" placeholder="Ingrese los nombres" />
          </div>

          <!--====================================== 
              APELLIDOS 
          =======================================-->
          <div class="form-group">
            <label> Apellidos </label>
            <input v-model="form.apellidos" type="text" placeholder="Ingrese los apellidos" />
          </div>

          <!--====================================== 
              RAZÓN SOCIAL 
          =======================================-->
          <div class="form-group full">
            <label> Razón social </label>
            <input v-model="form.razonSocial" type="text" placeholder="Ingrese la razón social" />
          </div>

          <!--====================================== 
              TELÉFONO 
          =======================================-->
          <div class="form-group">
            <label> Teléfono </label>
            <input v-model="form.telefono" type="text" placeholder="Ingrese el teléfono" />
          </div>

          <!--====================================== 
              EMAIL 
          =======================================-->
          <div class="form-group full">
            <label> Email </label>
            <input v-model="form.email" type="email" placeholder="cliente@email.com" />
          </div>

          <!--====================================== 
              DIRECCIÓN 
          =======================================-->
          <div class="form-group full">
            <label> Dirección </label>
            <input v-model="form.direccion" type="text" placeholder="Ingrese la dirección" />
          </div>

          <!--====================================== 
              ESTADO 
          =======================================-->
          <div class="form-group">
            <label> Estado </label>
            <select v-model="form.activo">
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
  /*
   * Documento
   */
  tipoDocumento: props.cliente?.tipoDocumento ?? null,
  numeroDocumento: props.cliente?.numeroDocumento ?? props.cliente?.documento ?? '',

  /*
   * Persona natural
   */
  nombres: props.cliente?.nombres ?? '',
  apellidos: props.cliente?.apellidos ?? '',

  /*
   * Persona jurídica
   */
  razonSocial: props.cliente?.razonSocial ?? '',

  /*
   * Información de contacto
   */
  telefono: props.cliente?.telefono ?? '',
  email: props.cliente?.email ?? '',
  direccion: props.cliente?.direccion ?? '',

  /*
   * Estado
   */
  activo: props.cliente?.activo ?? props.cliente?.estado ?? true,
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
