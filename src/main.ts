import { createApp } from 'vue'

import { engineInitializeGame } from '@engine/index'

import App from './ui/App.vue'
import './ui/styles/main.css'

createApp(App).mount('#app')

engineInitializeGame()
