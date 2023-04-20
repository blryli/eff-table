const pkg = require('../package.json')
import Table from './table'
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

import AutoWidth from './directives/auto-width'

const directives = [AutoWidth]
const components = [
  Table,
  Popup,
  Layout,
  VRender,
  Form,
  FormItem,
  Panel,
  Icon,
  Styles,
  steps,
  help,
  ciphertext,
  Transfer,
  SeniorQuery
]

const install = function(Vue, opts = {}) {
  directives.forEach(directive => {
    Vue.directive(directive.name, directive)
  })
  components.forEach(component => {
    Vue.component(component.name, component)
  })

  Vue.prototype.$EFF = opts
}

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  version: pkg.version,
  install,
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
  steps,
  help,
  ciphertext,
  Transfer,
  SeniorQuery
}
