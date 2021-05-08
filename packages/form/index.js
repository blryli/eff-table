import Form from './src/Form.vue'
import FormLine from './src/FormLine'

Form.install = (vue) => {
  vue.component(Form.name, Form)
}
FormLine.install = (vue) => {
  vue.component(FormLine.name, FormLine)
}

export { Form, FormLine }
