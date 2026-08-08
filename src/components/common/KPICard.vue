<template>
  <article class="kpi-card" :class="color">
    <!--==========================================
            Icono
        ===========================================-->

    <div class="kpi-icon">
      <i :class="icon"></i>
    </div>

    <!--==========================================
            Información
        ===========================================-->

    <div class="kpi-content">
      <span class="kpi-title">
        {{ title }}
      </span>

      <h2 class="kpi-value">
        {{ value }}
      </h2>

      <small class="kpi-subtitle">
        {{ subtitle }}
      </small>
    </div>
  </article>
</template>

<script setup>
/*==================================================
    Props
==================================================*/

defineProps({
  title: {
    type: String,

    required: true,
  },

  value: {
    type: [String, Number],

    required: true,
  },

  subtitle: {
    type: String,

    default: '',
  },

  icon: {
    type: String,

    default: 'fa-solid fa-chart-line',
  },

  color: {
    type: String,

    default: 'primary',
  },
})
</script>

<style src="@/assets/css/components/cards.css"></style>
