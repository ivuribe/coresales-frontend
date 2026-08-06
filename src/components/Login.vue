<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

/*==================================================
    Variable de enrutamiento
==================================================*/

const router = useRouter()

/*==================================================
    Variables reactivas
==================================================*/

const username = ref('')

const password = ref('')

const remember = ref(false)

const loading = ref(false)

const showPassword = ref(false)

const message = ref('')

const messageType = ref('')

/*==================================================
    Inicialización
==================================================*/

onMounted(() => {
  loadRememberedUser()
})

/*==================================================
    Login
==================================================*/

const login = async () => {
  if (!validate()) return

  loading.value = true

  await delay(4000)

  /*
        Simulación

        Usuario:
        admin

        Contraseña:
        admin123
    */

  if (username.value === 'admin' && password.value === 'admin123') {
    saveRememberUser()

    showMessage(
      'Inicio de sesión correcto.',

      'success',
    )

    setTimeout(() => {
      //window.location.href = 'index.html'
      router.push('/dashboard')
    }, 3000)
  } else {
    showMessage(
      'Usuario o contraseña incorrectos.',

      'error',
    )
  }

  loading.value = false
}

/*==================================================
    Validaciones
==================================================*/

const validate = () => {
  if (username.value.trim() === '') {
    showMessage(
      'Ingrese el usuario.',

      'warning',
    )

    return false
  }

  if (password.value.trim() === '') {
    showMessage(
      'Ingrese la contraseña.',

      'warning',
    )

    return false
  }

  if (password.value.length < 6) {
    showMessage(
      'La contraseña debe tener al menos 6 caracteres.',

      'warning',
    )

    return false
  }

  return true
}

/*==================================================
    Mostrar contraseña
==================================================*/

const togglePassword = () => {
  showPassword.value = !showPassword.value
}

/*==================================================
    Recordar usuario
==================================================*/

const saveRememberUser = () => {
  if (remember.value) {
    localStorage.setItem(
      'coresales_user',

      username.value,
    )
  } else {
    localStorage.removeItem('coresales_user')
  }
}

const loadRememberedUser = () => {
  const user = localStorage.getItem('coresales_user')

  if (!user) return

  username.value = user

  remember.value = true
}

/*==================================================
    Mensajes
==================================================*/

const showMessage = (
  text,

  type,
) => {
  message.value = text

  messageType.value = type

  setTimeout(() => {
    message.value = ''

    messageType.value = ''
  }, 3500)
}

/*==================================================
    Delay
==================================================*/

const delay = (ms) => {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}
</script>

<template>
  <main class="login-page">
    <!--==========================================
            Panel izquierdo
        ===========================================-->

    <section class="welcome-panel">
      <div class="overlay"></div>

      <div class="welcome-content">
        <div class="brand">
          <i class="fa-solid fa-chart-line brand-icon"></i>

          <h1>CoreSales Modern</h1>
        </div>

        <h2>Gestiona tu negocio desde un solo lugar.</h2>

        <p>
          Plataforma empresarial diseñada para administrar clientes, ventas, inventario y reportes
          mediante una interfaz moderna, rápida y responsive.
        </p>

        <ul>
          <li>
            <i class="fa-solid fa-circle-check"></i>

            Dashboard Inteligente
          </li>

          <li>
            <i class="fa-solid fa-circle-check"></i>

            KPIs en tiempo real
          </li>

          <li>
            <i class="fa-solid fa-circle-check"></i>

            Gestión de Inventario
          </li>

          <li>
            <i class="fa-solid fa-circle-check"></i>

            Reportes dinámicos
          </li>
        </ul>
      </div>
    </section>

    <!--==========================================
            Panel derecho
        ===========================================-->

    <section class="login-panel">
      <div class="login-card">
        <!-- Logo -->

        <div class="logo">
          <img src="/src/assets/images/coresales-logo.svg" alt="CoreSales" />
        </div>

        <h2>Bienvenido</h2>

        <p>Inicia sesión para acceder al sistema.</p>

        <!--======================================
                    Mensajes
                ======================================-->

        <div v-if="message" class="login-alert" :class="messageType">
          {{ message }}
        </div>

        <!--======================================
                    Formulario
                ======================================-->

        <form @submit.prevent="login">
          <!-- Usuario -->

          <div class="input-group">
            <label> Usuario </label>

            <div class="input-icon">
              <i class="fa-solid fa-user"></i>

              <input type="text" placeholder="Ingrese su usuario" v-model.trim="username" />
            </div>
          </div>

          <!-- Password -->

          <div class="input-group">
            <label> Contraseña </label>

            <div class="input-icon">
              <i class="fa-solid fa-lock"></i>

              <input
                :type="showPassword ? 'text' : 'password'"
                placeholder="Ingrese su contraseña"
                v-model.trim="password"
              />

              <button type="button" class="show-password" @click="togglePassword">
                <i class="fa-solid" :class="showPassword ? 'fa-eye-slash' : 'fa-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Opciones -->

          <div class="options">
            <label class="remember">
              <input type="checkbox" v-model="remember" />

              Recordarme
            </label>

            <a href="#"> ¿Olvidó su contraseña? </a>
          </div>

          <!-- Botón -->

          <button class="btn-login" type="submit" :disabled="loading">
            <template v-if="loading">
              <i class="fa-solid fa-spinner fa-spin"></i>

              Ingresando...
            </template>

            <template v-else>
              <i class="fa-solid fa-right-to-bracket"></i>

              Ingresar
            </template>
          </button>
        </form>

        <!-- Footer -->

        <div class="footer">© 2026 CoreSales Modern</div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/*==================================================
  CoreSales Modern
  Login Component
===================================================*/

/*==========================================
  PÁGINA
==========================================*/

.login-page {
  display: grid;

  grid-template-columns: 1fr 520px;

  min-height: 100vh;

  background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 45%, #2563eb 100%);
}

/*==========================================
  PANEL IZQUIERDO
==========================================*/

.welcome-panel {
  position: relative;

  display: flex;

  justify-content: center;

  align-items: center;

  padding: 80px;

  color: white;

  overflow: hidden;
}

.welcome-panel::before {
  content: '';

  position: absolute;

  inset: 0;

  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.15), transparent 35%),
    radial-gradient(circle at bottom right, rgba(255, 255, 255, 0.08), transparent 40%);
}

.overlay {
  position: absolute;

  inset: 0;

  background: linear-gradient(rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.7));
}

/*==========================================
  CONTENIDO
==========================================*/

.welcome-content {
  position: relative;

  z-index: 2;

  max-width: 560px;
}

.brand {
  display: flex;

  align-items: center;

  gap: 18px;

  margin-bottom: 48px;
}

.brand-icon {
  font-size: 3rem;

  color: #60a5fa;
}

.brand h1 {
  font-size: 3rem;

  font-weight: 700;
}

.welcome-content h2 {
  font-size: 2.3rem;

  margin-bottom: 24px;

  line-height: 1.3;
}

.welcome-content p {
  font-size: 1.08rem;

  line-height: 1.8;

  margin-bottom: 40px;

  opacity: 0.92;
}

.welcome-content ul {
  display: flex;

  flex-direction: column;

  gap: 18px;
}

.welcome-content li {
  display: flex;

  align-items: center;

  gap: 14px;
}

.welcome-content li i {
  color: #22c55e;
}

/*==========================================
  PANEL LOGIN
==========================================*/

.login-panel {
  display: flex;

  justify-content: center;

  align-items: center;

  background: white;

  padding: 50px;
}

/*==========================================
  TARJETA
==========================================*/

.login-card {
  width: 100%;

  max-width: 420px;

  background: white;

  border-radius: 24px;

  padding: 50px;

  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.18);

  animation: fadeCard 0.7s ease;
}

/*==========================================
  LOGO
==========================================*/

.logo {
  display: flex;

  justify-content: center;

  margin-bottom: 30px;
}

.logo img {
  width: 220px;
}

/*==========================================
  TÍTULOS
==========================================*/

.login-card h2 {
  text-align: center;

  font-size: 2rem;

  font-weight: 700;

  color: var(--text-primary);
}

.login-card > p {
  text-align: center;

  color: var(--text-secondary);

  margin: 10px 0 40px;
}

/*==========================================
  MENSAJES
==========================================*/

.login-alert {
  margin-bottom: 24px;

  padding: 14px;

  border-radius: 10px;

  text-align: center;

  font-weight: 600;
}

.success {
  background: #dcfce7;

  color: #166534;
}

.error {
  background: #fee2e2;

  color: #991b1b;
}

.warning {
  background: #fef3c7;

  color: #92400e;
}

/*==========================================
  FORMULARIO
==========================================*/

form {
  display: flex;

  flex-direction: column;

  gap: 24px;
}

.input-group label {
  display: block;

  margin-bottom: 10px;

  font-weight: 600;
}

.input-icon {
  display: flex;

  align-items: center;

  gap: 14px;

  height: 54px;

  padding: 0 18px;

  border: 1px solid var(--border-color);

  border-radius: 12px;

  transition: 0.25s;
}

.input-icon:focus-within {
  border-color: var(--primary);

  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.15);
}

.input-icon input {
  flex: 1;

  font-size: 1rem;
}

.input-icon i {
  color: var(--gray-500);
}

.show-password {
  background: none;

  border: none;

  cursor: pointer;

  color: var(--gray-500);
}

.show-password:hover {
  color: var(--primary);
}

/*==========================================
  OPCIONES
==========================================*/

.options {
  display: flex;

  justify-content: space-between;

  align-items: center;
}

.remember {
  display: flex;

  align-items: center;

  gap: 8px;
}

.options a {
  color: var(--primary);

  font-weight: 600;

  text-decoration: none;
}

.options a:hover {
  text-decoration: underline;
}

/*==========================================
  BOTÓN
==========================================*/

.btn-login {
  height: 54px;

  border: none;

  border-radius: 12px;

  display: flex;

  justify-content: center;

  align-items: center;

  gap: 12px;

  font-size: 1rem;

  font-weight: 600;

  color: white;

  cursor: pointer;

  transition: 0.25s;

  background: linear-gradient(135deg, var(--primary), var(--primary-dark));
}

.btn-login:hover {
  transform: translateY(-2px);

  box-shadow: 0 12px 28px rgba(37, 99, 235, 0.35);
}

.btn-login:disabled {
  opacity: 0.75;

  cursor: not-allowed;
}

/*==========================================
  FOOTER
==========================================*/

.footer {
  margin-top: 40px;

  text-align: center;

  font-size: 0.85rem;

  color: var(--text-secondary);
}

/*==========================================
  ANIMACIÓN
==========================================*/

@keyframes fadeCard {
  from {
    opacity: 0;

    transform: translateY(40px);
  }

  to {
    opacity: 1;

    transform: translateY(0);
  }
}

/*==========================================
  RESPONSIVE
==========================================*/

@media (max-width: 1100px) {
  .login-page {
    grid-template-columns: 1fr;
  }

  .welcome-panel {
    display: none;
  }

  .login-panel {
    background: linear-gradient(135deg, #0f172a, #2563eb);
  }
}

@media (max-width: 768px) {
  .login-panel {
    padding: 24px;
  }

  .login-card {
    padding: 36px;
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 28px;
  }

  .options {
    flex-direction: column;

    align-items: flex-start;

    gap: 14px;
  }
}
</style>
