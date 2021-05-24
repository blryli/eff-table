import FormField from '../form/src/form-field'

FormField.install = (vue) => {
  vue.component(FormField.name, FormField)
}

export default FormField
