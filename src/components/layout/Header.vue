<template>
  <header class="header">
    <!-- Botón Sidebar -->

    <button class="menu-button" @click="$emit('toggle-sidebar')">
      <i class="fa-solid fa-bars"></i>
    </button>

    <!-- Buscador -->

    <div class="search">
      <i class="fa-solid fa-magnifying-glass"></i>

      <input type="text" placeholder="Buscar..." v-model="search" />
    </div>

    <!-- Acciones -->

    <div class="header-actions">
      <button class="icon-button">
        <i class="fa-regular fa-bell"></i>
      </button>

      <button class="icon-button">
        <i class="fa-regular fa-circle-question"></i>
      </button>

      <!-- Usuario -->

      <div class="profile">
        <img src="@/assets/images/avatar.png" alt="Administrador" />

        <div class="profile-info">
          <span class="name">
            {{ user.name }}
          </span>

          <small class="role">
            {{ user.role }}
          </small>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'

defineEmits(['toggle-sidebar'])

const search = ref('')

const user = ref({
  name: 'Administrador',

  role: 'Administrador',
})
</script>

<style src="@/assets/css/layout/header.css"></style>
