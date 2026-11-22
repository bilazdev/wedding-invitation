import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

createApp(App).mount('#app')
