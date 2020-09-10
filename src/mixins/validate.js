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
      const row = this.data[rowIndex]
      const value = row[prop]
      if (!rule) {
        const { validator = {}} = this.columns.find(d => d.prop === prop) || {}
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
        const index = this.validators.findIndex(d => d.prop === prop)
        index === -1 ? this.validators.push(validator) : this.validators.splice(index, 1, validator)
        this.$emit('validate', validator, this.validators)

        return validator
      }

      const result = rule({ value, row, rowIndex })
      // 异步校验
      if (this.getType(result) === 'Promise') {
        const cellIndex = this.columns.findIndex(d => d.prop && d.prop === prop)
        const childNodes = this.tableBody.childNodes[rowIndex]
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
      const validators = this.data.reduce((acc, cur, idx) => {
        return acc.concat(this.validateRow(idx))
      }, [])
      Promise.all(validators).then(res => {
        cb(!res.find(re => re.message), res)
      }).catch(err => {
        console.error(err)
      })
    },
    validateRow(rowIndex) {
      return this.columns.reduce((acc, cur) => {
        const { prop } = cur
        const { rule } = cur.validator || {}
        return typeof rule === 'function' ? acc.concat(this.validateCell(rowIndex, prop, rule)) : acc
      }, [])
    },
    clearValidate(props) {
      const clear = prop => {
        const index = this.validators.findIndex(d => d.prop === prop)
        index > -1 ? this.validators.splice(index, 1) : console.error('clearValidate: 请传入正确的参数')
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
    },
    getType(params) {
      return Object.prototype.toString.call(params).match(/ (\w+)]/)[1]
    }
  }
}
