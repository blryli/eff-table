import Table from './lib/Table.vue'
import Popup from './components/popover/popup'

const components = [Table, Popup]

export {
  Table,
  Popup
}

const install = function(Vue, opts) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })

  Vue.prototype.$EFF = {
    uiPrefix: opts || 'el-'
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default install
