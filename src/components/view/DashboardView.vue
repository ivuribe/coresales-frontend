<template>
  <div class="dashboard fade-in">
    <!--==========================================
            Bienvenida
        ===========================================-->

    <WelcomeSection />

    <!--==========================================
            Indicadores KPI
        ===========================================-->

    <KPISection />

    <!--==========================================
            Contenido principal
        ===========================================-->

    <div class="dashboard-grid">
      <DashboardCharts />

      <TaskPanel />

      <AlertPanel />

      <ActivityPanel />

      <QuickAccess />
    </div>
  </div>
</template>

<script setup>
/*==================================================
    Componentes
==================================================*/

import WelcomeSection from '@/components/dashboard/WelcomeSection.vue'

import KPISection from '@/components/dashboard/KPISection.vue'

import DashboardCharts from '@/components/dashboard/DashboardCharts.vue'

import TaskPanel from '@/components/dashboard/TaskPanel.vue'

import AlertPanel from '@/components/dashboard/AlertPanel.vue'

import ActivityPanel from '@/components/dashboard/ActivityPanel.vue'

import QuickAccess from '@/components/dashboard/QuickAccess.vue'
</script>

<style src="@/assets/css/views/dashboard.css"></style>
