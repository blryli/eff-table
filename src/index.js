import Table from './lib/Table.vue'
import TableColumn from './lib/TableColumn'
import Info from './components/Info'

const components = [Table, TableColumn]

export {
  Table,
  TableColumn
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
