<template>
  <div class="modal-overlay">
    <div class="modal">
      <!--======================================
                ENCABEZADO
            =======================================-->

      <div class="modal-header">
        <div>
          <h2>
            {{ form.id ? 'Editar producto' : 'Nuevo producto' }}
          </h2>

          <p>Complete la información del producto.</p>
        </div>

        <button type="button" class="modal-close" @click="$emit('cancelar')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!--======================================
                FORMULARIO
            =======================================-->

      <form @submit.prevent="guardar">
        <div class="form-grid">
          <!-- Código -->
          <div class="form-group">
            <label> Código </label>
            <input v-model="form.codigo" type="text" placeholder="PROD-001" required />
          </div>

          <!-- Marca -->
          <div class="form-group">
            <label> Marca </label>
            <input v-model="form.marca" type="text" placeholder="Ingrese la marca" />
          </div>

          <!-- Nombre -->
          <div class="form-group full">
            <label> Nombre del producto </label>
            <input v-model="form.nombre" type="text" placeholder="Ingrese el nombre" required />
          </div>

          <!-- Descripción -->
          <div class="form-group full">
            <label> Descripción del producto </label>
            <input
              v-model="form.descripcion"
              type="text"
              placeholder="Ingrese la descripcion"
              required
            />
          </div>

          <!-- Categoría -->

          <div class="form-group">
            <label> Categoría </label>
            <select v-model="form.categoria" required>
              <option value="" disabled>Seleccione una categoría</option>
              <option
                v-for="categoria in categorias"
                :key="categoria.codigo"
                :value="categoria.codigo"
              >
                {{ categoria.nombre }}
              </option>
            </select>
          </div>

          <!-- Precio Compra-->
          <div class="form-group">
            <label> Precio de Compra </label>

            <div class="input-prefix">
              <span> S/ </span>
              <input
                v-model.number="form.precioCompra"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <!-- Precio Venta-->
          <div class="form-group">
            <label> Precio de Venta </label>
            <div class="input-prefix">
              <span> S/ </span>

              <input
                v-model.number="form.precioVenta"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <!-- Stock -->

          <div class="form-group">
            <label> Stock </label>

            <input
              v-model.number="form.stock"
              type="number"
              min="0"
              step="1"
              placeholder="0"
              required
            />
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
  producto: {
    type: Object,
    default: null,
  },
  categorias: {
    type: Array,
    default: () => [],
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
  id: props.producto?.productoId ?? null,
  codigo: props.producto?.codigo ?? '',
  nombre: props.producto?.nombre ?? '',
  descripcion: props.producto?.descripcion ?? '',
  marca: props.producto?.marcaId ?? props.producto?.marca ?? null,
  categoria: props.producto?.categoria ?? '',
  precioCompra: props.producto?.precioCompra ?? 0,
  precioVenta: props.producto?.precioVenta ?? 0,
  stock: props.producto?.stock ?? 0,
  estado: props.producto?.activo ?? props.producto?.estado ?? true,
})
/*==================================================
    Guardar
==================================================*/

const guardar = () => {
  console.log('LO QUE SE VA A GUARDAR: ', form)
  emit('guardar', {
    ...form,
  })
}
</script>
