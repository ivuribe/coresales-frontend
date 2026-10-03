const AUTHORIZATION_SERVER = 'http://localhost:8081'
const CLIENT_ID = 'coresales-web'
const REDIRECT_URI = 'http://localhost:5173/callback'
const AUTHORIZATION_ENDPOINT = `${AUTHORIZATION_SERVER}/oauth2/authorize`
const TOKEN_ENDPOINT = `${AUTHORIZATION_SERVER}/oauth2/token`

// Generar string aleatorio
function generateRandomString(length = 64) {
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)

  return Array.from(array)
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

// Generar code_challenge
async function generateCodeChallenge(codeVerifier) {
  const data = new TextEncoder().encode(codeVerifier)
  const digest = await crypto.subtle.digest('SHA-256', data)

  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

// Iniciar login OAuth 2.0
export async function login() {
  const codeVerifier = generateRandomString()
  const codeChallenge = await generateCodeChallenge(codeVerifier)

  localStorage.setItem('code_verifier', codeVerifier)

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code_challenge: codeChallenge,
    code_challenge_method: 'S256',
  })

  window.location.href = `${AUTHORIZATION_ENDPOINT}?${params.toString()}`
}

// Procesar callback
export async function handleCallback(code) {
  const codeVerifier = localStorage.getItem('code_verifier')

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    code: code,
    code_verifier: codeVerifier,
  })

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  })

  if (!response.ok) {
    throw new Error('No se pudo obtener el Access Token')
  }

  const token = await response.json()
  localStorage.setItem('access_token', token.access_token)
  localStorage.removeItem('code_verifier')

  return token
}

// Logout
export function logout() {
  localStorage.removeItem('access_token')
  localStorage.removeItem('code_verifier')
}

// Verificar autenticación
export function isAuthenticated() {
  return !!localStorage.getItem('access_token')
}
