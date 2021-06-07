import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Components from '../'
import Element from 'element-ui'
import('../package.json').then(config => import(`../dist/${config.name}.css`))
import 'element-ui/lib/theme-chalk/index.css'
import "../packages/styles/layout.scss"
import "../packages/styles/panel.scss"
<<<<<<< HEAD
Vue.use(Components, {renderMap: {'input': 'el-input'}})
=======
Vue.use(Components)
>>>>>>> ec97a06245dc28e244f2b67d60f7b76c6d734c21
Vue.use(Element, { size: 'mini' })

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
