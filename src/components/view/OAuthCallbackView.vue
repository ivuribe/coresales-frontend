<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { handleCallback } from '@/services/oAuthService'

const route = useRoute()
const router = useRouter()

onMounted(async () => {
  try {
    const code = route.query.code

    if (!code) {
      throw new Error('No se recibió authorization code')
    }

    await handleCallback(code)
    router.push('/dashboard')
  } catch (error) {
    console.error('Error OAuth2:', error)
    router.push('/')
  }
})
</script>
<template>
  <div class="callback">
    <h2>Autenticando...</h2>

    <p>Obteniendo token de acceso.</p>
  </div>
</template>
