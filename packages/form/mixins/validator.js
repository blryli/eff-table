import { validateField, validate } from 'pk/utils/validate'

export default {
  data() {
    return {
      validators: []
    }
  },
  methods: {
    validateField(row, prop, rule) {
      if (!prop) {
        console.error('需要校验的字段，必须具有 prop 属性')
      }
      const { cols, validators, rowId } = this
      const value = row[prop]
      const id = row[rowId]
      const column = cols.find(d => d.prop === prop) || {}
      if (!rule) {
        const { rules = [] } = column
        if (Array.isArray(rules)) {
          rule = rules
        }
      }

      // 校验处理函数
      // console.log({ value, row, column, id, prop })
      return validateField(rule, { value, row, column, id, prop }).then(res => {
        const index = validators.findIndex(d => d.prop === prop && d[rowId] === row[rowId])
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
    validate(rows, all) {
      const { tableData, cols, editStore } = this
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

      return validate(validData, cols, this.validateField)
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
