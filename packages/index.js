import Table from './table/src/Table.vue'
import Popup from './popover/src/popup'
import Layout from './layout/src/layout'
import Panel from './Panel/src/Panel'
import VRender from 'core/render/render'
import Styles from './styles/index.vue'

const components = [Table, Popup, Layout, Panel, VRender, Styles]
const directives = []

export {
  Table,
  Popup,
  Layout,
  VRender,
  Panel
}

const install = function(Vue, opts = {}) {
  directives.forEach(directive => {
    Vue.directive(directive.name, directive)
  })
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
