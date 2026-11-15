import { createApp } from 'vue'
import '@fontsource/anton/latin-400.css'
import '@fontsource-variable/space-grotesk/wght.css'
import 'lenis/dist/lenis.css'
import './styles/global.scss'
import App from './App.vue'
import { vMagnetic } from './composables/useMagnetic'

createApp(App).directive('magnetic', vMagnetic).mount('#app')
