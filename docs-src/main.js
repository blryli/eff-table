import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import Components from '../src'
import router from './router'
// import('../package.json').then(config => import(`../dist/${config.name}.css`))
import 'element-plus/lib/theme-chalk/index.css'

const app = createApp(App)
app.use(ElementPlus, { size: 'mini' })
app.use(Components)
app.use(router)

app.mount('#app')
