import { createApp } from 'vue'

import { engineBootstrapGame } from '@engine/index'

import App from './ui/App.vue'
import './ui/styles/main.css'

async function startApp(): Promise<void> {
  await engineBootstrapGame()
  createApp(App).mount('#app')
}

void startApp()
