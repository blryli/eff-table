import { getType } from 'utils'
export default {
  data() {
    return {
      validators: []
    }
  },
  methods: {
    validateCell(rowIndex, prop, rule) {
      if (!prop) {
        console.error('需要校验的字段，必须具有 prop 属性')
        return
      }
      const { data, columns, validators, tableBody } = this
      const row = data[rowIndex]
      const value = row[prop]
      if (!rule) {
        const { validator = {}} = columns.find(d => d.prop === prop) || {}
        if (typeof validator.rule === 'function') {
          rule = validator.rule
        } else {
          return
        }
      }

      // 校验处理函数
      const validate = params => {
        const message = typeof params === 'string' ? params : params.message || ''
        const validator = { prop, success: !message, message, rowIndex }
        const index = validators.findIndex(d => d.prop === prop && d.rowIndex === rowIndex)
        index === -1 ? validators.push(validator) : validators.splice(index, 1, validator)
        this.$emit('validate', validator, validators)

        return validator
      }

      const result = rule({ value, row, rowIndex })
      // 异步校验
      if (getType(result) === 'Promise') {
        const cellIndex = columns.findIndex(d => d.prop && d.prop === prop)
        const childNodes = tableBody.childNodes[rowIndex]
        const cell = childNodes ? childNodes.childNodes[cellIndex] : null
        cell && cell.classList.add('is-async-validator')
        return result.then(res => {
          cell && cell.classList.remove('is-async-validator')
          return validate(res)
        }).catch(err => {
          cell && cell.classList.remove('is-async-validator')
          console.error(err)
        })
      }

      return validate(result)
    },
    validate(cb) {
      if (typeof cb !== 'function') {
        console.error('validate参数必须是函数')
        return
      }
      const { data, validateRow } = this
      const validators = data.reduce((acc, cur, idx) => {
        return acc.concat(validateRow(idx))
      }, [])
      Promise.all(validators).then(res => {
        cb(!res.find(re => re.message), res)
      }).catch(err => {
        console.error(err)
      })
    },
    validateRow(rowIndex) {
      const { columns, validateCell } = this
      return columns.reduce((acc, cur) => {
        const { prop } = cur
        const { rule } = cur.validator || {}
        return typeof rule === 'function' ? acc.concat(validateCell(rowIndex, prop, rule)) : acc
      }, [])
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
