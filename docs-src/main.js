import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Components from '../'
import Element from 'element-ui'
import('../package.json').then(config => import(`../dist/${config.name}.css`))
import 'element-ui/lib/theme-chalk/index.css'
import "../packages/styles/layout.scss"
import "../packages/styles/panel.scss"
Vue.use(Components)
Vue.use(Element, { size: 'mini' })

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
