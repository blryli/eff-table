import { validateField, validate } from 'pk/utils/validate'
import XEUtils from 'xe-utils'

export default {
  data() {
    return {
      validators: []
    }
  },
  methods: {
    validateField(prop, rule, row = this.data) {
      if (!prop) {
        console.error('需要校验的字段，必须具有 prop 属性')
      }
      const { validators, rowId, formItems } = this
      // console.log({ row, prop, value })
      const value = XEUtils.get(row, prop)
      const id = row[rowId]
      const column = formItems.find(d => d.prop === prop) || {}
      if (!rule) {
        const { rules = [] } = column
        console.log({ rules })
        if (Array.isArray(rules)) {
          rule = rules
        }
      }
      console.log(prop, row, rule)

      // 校验处理函数
      // console.log({ value, row, column, id, prop })
      return validateField(rule, { value, row, column, id, prop }).then(res => {
        const index = validators.findIndex(d => d.prop === prop)
        if (res.message) {
          index === -1 ? validators.push(res) : validators.splice(index, 1, res)
        } else {
          index > -1 && validators.splice(index, 1)
        }
        this.$emit('validate', res, validators)
        return res
      })

      // cell && cell.classList.add('is-async-validator') // 异步校验动效
    },
    validate() {
      const { data, formItems } = this
      return validate([data], formItems.map(d => ({ prop: d.prop, rules: d.rules })), this.validateField)
    },
    clearValidate(props) {
      const clear = prop => {
        const { validators } = this
        const index = validators.findIndex(d => d.prop === prop)
        index > -1 ? validators.splice(index, 1) : console.error('clearValidate: 请传入正确的参数')
      }
      if (!props) {
        this.validators = []
      } else if (Array.isArray(props)) {
        props.forEach(prop => {
          clear(prop)
        })
      } else {
        clear(props)
      }
    }
  }
}
