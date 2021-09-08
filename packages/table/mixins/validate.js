import { validateField, validate } from 'pk/utils/validate'

export default {
  data() {
    return {
      validators: []
    }
  },
  methods: {
    validateField(prop, rule, row) {
      if (!prop) {
        console.warn('需要校验的字段，必须具有 prop 属性')
        return Promise.resolve({})
        // resolve()
      }
      const { columns, validators, rowId } = this
      const value = row[prop]
      const id = row[rowId]
      const column = columns.find(d => d.prop === prop) || {}
      if (!rule) {
        const { rules = [] } = column
        if (Array.isArray(rules)) {
          rule = rules
        } else {
          // resolve()
        }
      }

      // 校验处理函数
      // console.log({ value, row, column, id, prop })
      return validateField(rule, { value, row, column, rowid: id, id, prop }).then(res => {
        const index = validators.findIndex(d => d.prop === prop && d.id === row[rowId])
        if (res.message) {
          index === -1 ? validators.push(res) : validators.splice(index, 1, res)
        } else {
          index > -1 && validators.splice(index, 1)
        }
        this.$emit('validate', res, validators)
        return res
      })
    },
    validate(rows, all) {
      const { tableData, columns, editStore } = this
      const { insertList, updateList, pendingList } = editStore
      let validData
      if (rows === true) {
        validData = tableData
      } else if (rows) {
        validData = Array.isArray(rows) ? rows : [rows]
      } else {
        validData = all ? tableData : insertList.concat(updateList)
      }
      validData = validData.filter(d => !pendingList.some(p => p === d))

      return validate(validData, columns, this.validateField)
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
