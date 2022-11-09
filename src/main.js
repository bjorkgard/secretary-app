import { createApp }             from 'vue'
import { createPinia }           from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import App                       from './App.vue'
import router                    from './router'

const pinia = createPinia(piniaPluginPersistedstate)

import './registerServiceWorker'
import './assets/tailwind.css'

createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app')
