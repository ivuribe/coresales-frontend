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

import './assets/css/reset.css'

import './assets/css/variables.css'

//import './assets/css/global.css'

import './assets/css/login.css'

/*==========================================
    Aplicación
==========================================*/

createApp(App).use(router).mount('#app')
