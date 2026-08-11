<template>
  <div class="modal-overlay">
    <div class="modal sale-modal">
      <!--======================================
                HEADER
            =======================================-->

      <div class="modal-header">
        <div>
          <h2>
            {{ form.id ? 'Editar venta' : 'Nueva venta' }}
          </h2>

          <p>Registre el comprobante y sus productos.</p>
        </div>

        <button type="button" class="modal-close" @click="$emit('cancelar')">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <form @submit.prevent="guardar">
        <!--==================================
                    DATOS DEL COMPROBANTE
                ===================================-->

        <div class="form-section">
          <h3>Datos de la venta</h3>

          <div class="form-grid">
            <div class="form-group">
              <label> Tipo de comprobante </label>

              <select v-model="form.tipo" required>
                <option value="Boleta">Boleta</option>

                <option value="Factura">Factura</option>
              </select>
            </div>

            <div class="form-group">
              <label> Fecha </label>

              <input v-model="form.fecha" type="date" required />
            </div>

            <div class="form-group">
              <label> Serie </label>

              <input v-model="form.serie" type="text" placeholder="B001" required />
            </div>

            <div class="form-group">
              <label> Número </label>

              <input v-model="form.numero" type="text" placeholder="000001" required />
            </div>

            <div class="form-group full">
              <label> Cliente </label>

              <select v-model="form.clienteId" required @change="actualizarCliente">
                <option :value="null" disabled>Seleccione un cliente</option>

                <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
                  {{ cliente.nombre }}
                  -
                  {{ cliente.documento }}
                </option>
              </select>
            </div>
          </div>
        </div>

        <!--==================================
                    PRODUCTOS
                ===================================-->

        <div class="form-section">
          <div class="section-title">
            <h3>Productos</h3>

            <button type="button" class="btn-secondary small" @click="agregarDetalle">
              <i class="fa-solid fa-plus"></i>

              Agregar producto
            </button>
          </div>

          <!-- PRODUCTOS -->

          <div class="sale-products">
            <div v-for="(detalle, index) in form.detalles" :key="index" class="sale-product-row">
              <!-- Producto -->

              <div class="form-group product-select">
                <label v-if="index === 0"> Producto </label>

                <select v-model="detalle.productoId" required @change="actualizarProducto(index)">
                  <option :value="null" disabled>Seleccione</option>

                  <option v-for="producto in productos" :key="producto.id" :value="producto.id">
                    {{ producto.codigo }}
                    -
                    {{ producto.nombre }}
                  </option>
                </select>
              </div>

              <!-- Cantidad -->

              <div class="form-group quantity">
                <label v-if="index === 0"> Cantidad </label>

                <input
                  v-model.number="detalle.cantidad"
                  type="number"
                  min="1"
                  required
                  @input="calcularDetalle(index)"
                />
              </div>

              <!-- Precio -->

              <div class="form-group price">
                <label v-if="index === 0"> Precio </label>

                <input
                  v-model.number="detalle.precio"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  @input="calcularDetalle(index)"
                />
              </div>

              <!-- Importe -->

              <div class="form-group amount">
                <label v-if="index === 0"> Importe </label>

                <div class="amount-value">
                  S/
                  {{ detalle.importe.toFixed(2) }}
                </div>
              </div>

              <!-- Eliminar -->

              <button
                type="button"
                class="remove-product"
                :class="{ 'with-label': index === 0 }"
                @click="eliminarDetalle(index)"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>
          </div>
        </div>

        <!--==================================
                    TOTALES
                ===================================-->

        <div class="sale-totals">
          <div>
            <span> Subtotal </span>

            <strong> S/ {{ subtotal.toFixed(2) }} </strong>
          </div>

          <div>
            <span> IGV (18%) </span>

            <strong> S/ {{ igv.toFixed(2) }} </strong>
          </div>

          <div class="grand-total">
            <span> Total </span>

            <strong> S/ {{ total.toFixed(2) }} </strong>
          </div>
        </div>

        <!--==================================
                    BOTONES
                ===================================-->

        <div class="modal-footer">
          <button type="button" class="btn-secondary" @click="$emit('cancelar')">Cancelar</button>

          <button type="submit" class="btn-primary">
            <i class="fa-solid fa-floppy-disk"></i>

            Guardar venta
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
  venta: {
    type: Object,

    default: null,
  },

  clientes: {
    type: Array,

    default: () => [],
  },

  productos: {
    type: Array,

    default: () => [],
  },
})

/*==================================================
    Eventos
==================================================*/

const emit = defineEmits(['guardar', 'cancelar'])

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
  id: props.venta?.id ?? null,

  tipo: props.venta?.tipo ?? 'Boleta',

  serie: props.venta?.serie ?? 'B001',

  numero: props.venta?.numero ?? '000001',

  clienteId: props.venta?.clienteId ?? null,

  cliente: props.venta?.cliente ?? '',

  documento: props.venta?.documento ?? '',

  fecha: props.venta?.fecha ?? obtenerFechaActual(),

  estado: props.venta?.estado ?? 'Pendiente',

  detalles: props.venta?.detalles
    ? props.venta.detalles.map((detalle) => ({
        ...detalle,
      }))
    : [
        {
          productoId: null,

          nombre: '',

          cantidad: 1,

          precio: 0,

          importe: 0,
        },
      ],
})

/*==================================================
    Subtotal
==================================================*/

const subtotal = computed(() => {
  return (
    form.detalles.reduce(
      (total, detalle) => total + Number(detalle.importe || 0),

      0,
    ) / 1.18
  )
})

/*==================================================
    IGV
==================================================*/

const igv = computed(() => {
  return subtotal.value * 0.18
})

/*==================================================
    Total
==================================================*/

const total = computed(() => {
  return form.detalles.reduce(
    (total, detalle) => total + Number(detalle.importe || 0),

    0,
  )
})

/*==================================================
    Agregar detalle
==================================================*/

const agregarDetalle = () => {
  form.detalles.push({
    productoId: null,

    nombre: '',

    cantidad: 1,

    precio: 0,

    importe: 0,
  })
}

/*==================================================
    Eliminar detalle
==================================================*/

const eliminarDetalle = (index) => {
  if (form.detalles.length === 1) {
    return
  }

  form.detalles.splice(index, 1)
}

/*==================================================
    Actualizar producto
==================================================*/

const actualizarProducto = (index) => {
  const detalle = form.detalles[index]

  const producto = props.productos.find((item) => item.id === detalle.productoId)

  if (!producto) return

  detalle.nombre = producto.nombre

  detalle.precio = producto.precio

  detalle.cantidad = detalle.cantidad || 1

  calcularDetalle(index)
}

/*==================================================
    Calcular detalle
==================================================*/

const calcularDetalle = (index) => {
  const detalle = form.detalles[index]

  detalle.importe = Number(detalle.cantidad || 0) * Number(detalle.precio || 0)
}

/*==================================================
    Actualizar cliente
==================================================*/

const actualizarCliente = () => {
  const cliente = props.clientes.find((item) => item.id === form.clienteId)

  if (!cliente) return

  form.cliente = cliente.nombre

  form.documento = cliente.documento
}

/*==================================================
    Guardar
==================================================*/

const guardar = () => {
  if (!form.clienteId) {
    window.alert('Seleccione un cliente.')

    return
  }

  if (!form.detalles.length) {
    window.alert('Agregue al menos un producto.')

    return
  }

  const detallesValidos = form.detalles.every(
    (detalle) => detalle.productoId && detalle.cantidad > 0,
  )

  if (!detallesValidos) {
    window.alert('Complete correctamente los productos.')

    return
  }

  emit(
    'guardar',

    {
      ...form,

      subtotal: subtotal.value,

      igv: igv.value,

      total: total.value,

      estado: form.id ? form.estado : 'Pendiente',
    },
  )
}
</script>
