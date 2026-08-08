<template>
  <footer class="footer">
    <div class="footer-left">
      <span>
        © {{ currentYear }}

        CoreSales Modern
      </span>

      <span class="separator"> • </span>

      <span> Todos los derechos reservados </span>
    </div>

    <div class="footer-right">
      <span class="version"> Versión {{ version }} </span>
    </div>
  </footer>
</template>

<script setup>
const currentYear = new Date().getFullYear()

const version = '1.0.0'
</script>

<style src="@/assets/css/layout/footer.css"></style>
