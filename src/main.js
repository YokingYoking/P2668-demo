import { createApp } from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import './styles.scss'
import installElementPlus from './plugins/element'

Vue.use(ElementUI)

const app = createApp(App)
installElementPlus(app)
app.mount('#app')