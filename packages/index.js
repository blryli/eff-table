import Table from './table'
import VTable from './vTable/src/table'
import Popup from './popover/src/popup'
import Layout from './layout/src/layout'
import Panel from './panel/src/Panel'
import { render } from 'core/render'
import VRender from 'core/render/render'
import Styles from './styles/index.vue'
import Form from './form'
import FormItem from './form-item'
import FormField from './form-field'
import Icon from './icon'
import steps from './steps'
import help from './help'
import ciphertext from './ciphertext'
import Transfer from './transfer'
import SeniorQuery from './senior-query'

const directives = []
const components = [
  Table,
  Popup,
  Layout,
  VRender,
  Form,
  FormItem,
  Panel,
  Icon,
  VTable,
  Styles,
  steps,
  help,
  ciphertext,
  Transfer,
  SeniorQuery
]

export {
  Table,
  Popup,
  Layout,
  render,
  VRender,
  Form,
  FormItem,
  FormField,
  Icon,
  Panel,
  VTable,
  steps,
  help,
  ciphertext,
  Transfer,
  SeniorQuery
}

const install = function(Vue, opts = {}) {
  directives.forEach(directive => {
    Vue.directive(directive.name, directive)
  })
  components.forEach(component => {
    Vue.component(component.name, component)
  })

  Vue.prototype.$EFF = {
    request: opts.request,
    renderMap: opts.renderMap,
    toolbarHeight: opts.toolbarHeight,
    headerRowHeight: opts.headerRowHeight,
    footerActionConfig: opts.footerActionConfig
  }
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default install
