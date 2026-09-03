import api from './api'

export const getSales = async () => {
  const response = await api.get('/api/sales')

  return response.data
}

export const getSaleById = async (id) => {
  const response = await api.get(`/api/sales/${id}`)

  return response.data
}

export const createSale = async (sale) => {
  const response = await api.post('/api/sales', sale)

  return response.data
}
