<template>
  <div class="container" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
    <!--==========================================
            Sidebar
        ===========================================-->

    <Sidebar :collapsed="sidebarCollapsed" />

    <!--==========================================
            Contenido principal
        ===========================================-->

    <main class="main-content">
      <!-- Header -->

      <Header @toggle-sidebar="toggleSidebar" />

      <!-- Vista -->

      <section class="page-content fade-in">
        <RouterView />
      </section>

      <!-- Footer -->

      <Footer />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import { RouterView } from 'vue-router'

import Sidebar from '@/components/layout/Sidebar.vue'

import Header from '@/components/layout/Header.vue'

import Footer from '@/components/layout/Footer.vue'

/*==================================================
    Estado Sidebar
==================================================*/

const sidebarCollapsed = ref(false)

/*==================================================
    Métodos
==================================================*/

const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}
</script>

<style src="@/assets/css/layout/layout.css"></style>
