/*==================================================
    CoreSales Modern
    main.js
====================================================*/

import { createApp } from 'vue'

import App from './App.vue'

import router from './router'

/*==========================================
    Estilos Globales
==========================================*/

import './assets/css/base/reset.css'

import './assets/css/base/variables.css'

//import './assets/css/views/login.css'

/*==========================================
    Aplicación
==========================================*/

createApp(App).use(router).mount('#app')
