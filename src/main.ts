import { createPinia } from 'pinia'
import { createApp } from 'vue'

import { engineBootstrapGame } from '@engine/index'

import App from './ui/App.vue'
import './ui/styles/main.css'

async function startApp(): Promise<void> {
  await engineBootstrapGame()
  const app = createApp(App)
  app.use(createPinia())
  app.mount('#app')
}

void startApp()
