<template>
  <div class="modal-overlay">
    <div class="modal movement-modal">
      <!--======================================
                HEADER
            =======================================-->

      <div class="modal-header">
        <div>
          <h2>Nuevo movimiento</h2>

          <p>Registre un movimiento de inventario.</p>
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
          <!-- Producto -->

          <div class="form-group full">
            <label> Producto </label>

            <select v-model="form.productoId" required :disabled="producto !== null">
              <option :value="null" disabled>Seleccione un producto</option>

              <option v-for="item in productos" :key="item.id" :value="item.id">
                {{ item.codigo }}
                -
                {{ item.nombre }}
              </option>
            </select>
          </div>

          <!-- Tipo -->

          <div class="form-group">
            <label> Tipo de movimiento </label>

            <select v-model="form.tipo" required>
              <option value="Entrada">Entrada</option>

              <option value="Salida">Salida</option>

              <option value="Ajuste">Ajuste</option>
            </select>
          </div>

          <!-- Cantidad -->

          <div class="form-group">
            <label>
              {{ form.tipo === 'Ajuste' ? 'Nuevo stock' : 'Cantidad' }}
            </label>

            <input v-model.number="form.cantidad" type="number" min="0" required />
          </div>

          <!-- Motivo -->

          <div class="form-group full">
            <label> Motivo </label>

            <select v-model="form.motivo" required>
              <option value="" disabled>Seleccione un motivo</option>

              <option v-if="form.tipo === 'Entrada'" value="Compra a proveedor">
                Compra a proveedor
              </option>

              <option v-if="form.tipo === 'Entrada'" value="Devolución de cliente">
                Devolución de cliente
              </option>

              <option v-if="form.tipo === 'Entrada'" value="Ingreso por ajuste">
                Ingreso por ajuste
              </option>

              <option v-if="form.tipo === 'Salida'" value="Venta">Venta</option>

              <option v-if="form.tipo === 'Salida'" value="Devolución a proveedor">
                Devolución a proveedor
              </option>

              <option v-if="form.tipo === 'Salida'" value="Salida por ajuste">
                Salida por ajuste
              </option>

              <option v-if="form.tipo === 'Ajuste'" value="Inventario físico">
                Inventario físico
              </option>

              <option v-if="form.tipo === 'Ajuste'" value="Corrección de inventario">
                Corrección de inventario
              </option>
            </select>
          </div>

          <!-- Fecha -->

          <div class="form-group">
            <label> Fecha </label>

            <input v-model="form.fecha" type="date" required />
          </div>

          <!-- Stock actual -->

          <div v-if="productoActual" class="stock-preview">
            <span> Stock actual </span>

            <strong>
              {{ productoActual.stock }}
            </strong>
          </div>
        </div>

        <!--======================================
                    INFORMACIÓN
                =======================================-->

        <div v-if="productoActual" class="movement-preview">
          <div>
            <span> Stock actual </span>

            <strong>
              {{ productoActual.stock }}
            </strong>
          </div>

          <i class="fa-solid fa-arrow-right"></i>

          <div>
            <span> Stock resultante </span>

            <strong :class="claseStockResultante">
              {{ stockResultante }}
            </strong>
          </div>
        </div>

        <!--======================================
                    FOOTER
                =======================================-->

        <div class="modal-footer">
          <button type="button" class="btn-secondary" @click="$emit('cancelar')">Cancelar</button>

          <button type="submit" class="btn-primary">
            <i class="fa-solid fa-floppy-disk"></i>

            Registrar movimiento
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'

/*==================================================
    Props
==================================================*/

const props = defineProps({
  producto: {
    type: Object,

    default: null,
  },

  tipoInicial: {
    type: String,

    default: 'Entrada',
  },
})

/*==================================================
    Eventos
==================================================*/

const emit = defineEmits(['guardar', 'cancelar'])

/*==================================================
    Productos
==================================================*/

const productos = [
  {
    id: 1,
    codigo: 'PROD-001',
    nombre: 'Laptop Lenovo ThinkPad',
    stock: 12,
  },

  {
    id: 2,
    codigo: 'PROD-002',
    nombre: 'Monitor LED 24"',
    stock: 25,
  },

  {
    id: 3,
    codigo: 'PROD-003',
    nombre: 'Teclado inalámbrico',
    stock: 8,
  },

  {
    id: 4,
    codigo: 'PROD-004',
    nombre: 'Mouse inalámbrico',
    stock: 4,
  },

  {
    id: 5,
    codigo: 'PROD-005',
    nombre: 'Impresora multifuncional',
    stock: 2,
  },

  {
    id: 6,
    codigo: 'PROD-006',
    nombre: 'Disco SSD 1TB',
    stock: 0,
  },
]

/*==================================================
    Fecha actual
==================================================*/

const obtenerFechaActual = () => {
  return new Date()

    .toISOString()

    .substring(0, 10)
}

/*==================================================
    Formulario
==================================================*/

const form = reactive({
  productoId: props.producto?.id ?? null,

  tipo: props.tipoInicial,

  cantidad: 1,

  motivo: '',

  fecha: obtenerFechaActual(),
})

/*==================================================
    Producto actual
==================================================*/

const productoActual = computed(() => {
  return productos.find((producto) => producto.id === form.productoId)
})

/*==================================================
    Stock resultante
==================================================*/

const stockResultante = computed(() => {
  if (!productoActual.value) {
    return 0
  }

  const stock = productoActual.value.stock

  const cantidad = Number(form.cantidad || 0)

  if (form.tipo === 'Entrada') {
    return stock + cantidad
  }

  if (form.tipo === 'Salida') {
    return stock - cantidad
  }

  return cantidad
})

/*==================================================
    Clase stock resultante
==================================================*/

const claseStockResultante = computed(() => {
  if (stockResultante.value < 0) {
    return 'danger'
  }

  if (productoActual.value && stockResultante.value === 0) {
    return 'danger'
  }

  return 'success'
})

/*==================================================
    Guardar
==================================================*/

const guardar = () => {
  if (!form.productoId) {
    window.alert('Seleccione un producto.')

    return
  }

  if (form.cantidad < 0) {
    window.alert('La cantidad no puede ser negativa.')

    return
  }

  if (
    form.tipo === 'Salida' &&
    productoActual.value &&
    form.cantidad > productoActual.value.stock
  ) {
    window.alert('No existe stock suficiente para realizar la salida.')

    return
  }

  emit(
    'guardar',

    {
      ...form,

      cantidad: Number(form.cantidad),
    },
  )
}
</script>
