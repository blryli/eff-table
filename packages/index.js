import Table from './table'
import Popup from './popover/src/popup'
import Layout from './layout/src/layout'
import Panel from './panel/src/Panel'
import VRender from 'core/render/render'
import Styles from './styles/index.vue'
import { Form, FormLine } from './form'

const directives = []
const components = [Table, Popup, Layout, VRender, Form, Panel, FormLine, Styles]

export {
  Table,
  Popup,
  Layout,
  VRender,
  Form,
  FormLine,
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
    request: opts.request
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default install
