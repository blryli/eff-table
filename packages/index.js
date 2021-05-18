import Table from './table'
import Popup from './popover/src/popup'
import Layout from './layout/src/layout'
import Panel from './panel/src/Panel'
import VRender from 'core/render/render'
import Styles from './styles/index.vue'
import Form from './form'
import FormItem from './form-item'

const directives = []
const components = [Table, Popup, Layout, VRender, Form, FormItem, Panel, Styles]

export {
  Table,
  Popup,
  Layout,
  VRender,
  Form,
  FormItem,
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
