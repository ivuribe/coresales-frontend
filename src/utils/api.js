import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

//OAuth2 (ejemplo)
const AUTH_URL = import.meta.env.VITE_AUTH_URL || 'http://localhost:8081/oauth2/authorize'
const TOKEN_URL = import.meta.env.VITE_TOKEN_URL || 'http://localhost:8081/oauth2/token'
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || 'http://localhost:5173/callback'

// ==================================================
// INTERCEPTOR DE REQUEST
// ==================================================
api.interceptors.request.use(
  (config) => {
    console.log('URL del llamado: ' + config.url)
    if (config.url === '/api/auth/login') return config

    //const token = localStorage.getItem('coresales_token') //este es el token con el flujo de login con JWT manual
    const token = localStorage.getItem('access_token') //este es el token con el flujo del login con OAuth

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
