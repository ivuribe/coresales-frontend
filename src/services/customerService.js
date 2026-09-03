import api from './api'

// ==================================================
// LISTAR
// ==================================================

export const getCustomers = async () => {
  const response = await api.get('/api/customers')

  return response.data
}

// ==================================================
// BUSCAR POR ID
// ==================================================
export const getCustomerById = async (id) => {
  const response = await api.get(`/api/customers/${id}`)

  return response.data
}

// ==================================================
// INSERTAR
// ==================================================
export const createCustomer = async (customer) => {
  const response = await api.post('/api/customers', customer)
  return response.data
}

// ==================================================
// ACTUALIZAR
// ==================================================
export const updateCustomer = async (id, customer) => {
  const response = await api.put(`/api/customers/${id}`, customer)
  return response.data
}

// ==================================================
// ELIMINAR
// ==================================================
export const deleteCustomer = async (id) => {
  const response = await api.delete(`/api/customers/${id}`)
  return response.data
}
