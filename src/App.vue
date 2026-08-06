<template>
  <router-view />
</template>

<script setup>
//import Login from './components/Login.vue'
</script>

<style>
html,
body,
#app {
  margin: 0;

  padding: 0;

  width: 100%;

  height: 100%;
}

body {
  font-family: 'Inter', sans-serif;

  background: #ffffff;
}

* {
  box-sizing: border-box;
}

a {
  text-decoration: none;
}

button {
  cursor: pointer;

  font-family: inherit;
}

input {
  outline: none;

  border: none;

  font-family: inherit;
}

ul {
  list-style: none;

  padding: 0;

  margin: 0;
}
</style>
