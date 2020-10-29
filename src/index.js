import Table from './lib/Table.vue'
import Info from './components/Info'

const components = [Table]

export {
  Table
}

const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
  Vue.prototype.$info = Info
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default install
