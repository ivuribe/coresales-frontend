import api from './api'

export const getInventory = async () => {
  const response = await api.get('/api/inventory')

  return response.data
}

export const getInventoryById = async (id) => {
  const response = await api.get(`/api/inventory/${id}`)

  return response.data
}

export const updateInventory = async (id, inventory) => {
  const response = await api.put(`/api/inventory/${id}`, inventory)

  return response.data
}
