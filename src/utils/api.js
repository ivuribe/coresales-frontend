import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ==================================================
// INTERCEPTOR DE REQUEST
// ==================================================
api.interceptors.request.use(
  (config) => {
    console.log('URL del llamado: ' + config.url)
    if (config.url === '/api/auth/login') return config

    const token = localStorage.getItem('coresales_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },

  (error) => {
    return Promise.reject(error)
  },
)

export default api
