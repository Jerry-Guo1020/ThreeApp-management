import { createApp } from 'vue'

import App from './App.vue'
import router from './router'
import { hydrateCurrentUser } from './stores/user'
import './style.css'

async function bootstrap() {
  await hydrateCurrentUser()
  createApp(App).use(router).mount('#app')
}

void bootstrap()
