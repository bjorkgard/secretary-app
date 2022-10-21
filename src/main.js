import { createApp }   from 'vue'
import { createPinia } from 'pinia'
import App             from './App.vue'
import router          from './router'

const pinia = createPinia()

import './registerServiceWorker';

import './assets/tailwind.css'

createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app')
