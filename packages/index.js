import Table from './table/src/Table.vue'
import Popup from './popover/src/popup'
import VRender from 'core/render/render'

const components = [Table, Popup, VRender]

export {
  Table,
  Popup,
  VRender
}

const install = function(Vue, opts = {}) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })

  Vue.prototype.$EFF = {
    uiPrefix: opts.uiPrefix || 'el-',
    request: opts.request
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default install
