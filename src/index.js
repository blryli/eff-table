import Table from './lib/Table.vue'

const components = [Table]

export {
  Table
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
