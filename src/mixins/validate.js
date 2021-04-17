import { getType } from 'utils'
export default {
  data() {
    return {
      validators: []
    }
  },
  methods: {
    validateCell(rowIndex, prop, rule) {
      return new Promise((resolve, reject) => {
        if (!prop) {
          console.error('需要校验的字段，必须具有 prop 属性')
          resolve()
        }
        const { tableData, columns, validators, tableBodyEl, rowId } = this
        const row = tableData[rowIndex]
        const value = row[prop]
        const id = row[rowId]
        if (!rule) {
          const { validator = {}} = columns.find(d => d.prop === prop) || {}
          if (typeof validator.rule === 'function') {
            rule = validator.rule
          } else {
            resolve()
          }
        }

        const cellIndex = columns.findIndex(d => d.prop && d.prop === prop)
        const childNodes = tableBodyEl.childNodes[rowIndex]
        const cell = childNodes ? childNodes.childNodes[cellIndex] : null

        // 校验处理函数
        const validate = params => {
          const message = typeof params === 'string' ? params : params.message || ''
          const validator = { rowIndex, rowId: id, prop, message }
          const index = validators.findIndex(d => d.prop === prop && d.rowIndex === rowIndex)
          index === -1 ? validators.push(validator) : validators.splice(index, 1, validator)
          this.$emit('validate', validator, validators)

          return validator
        }

        const result = rule({ value, row, rowIndex })
        // 异步校验
        if (getType(result) === 'Promise') {
          cell && cell.classList.add('is-async-validator')
          result.then(res => {
            cell && cell.classList.remove('is-async-validator')
            resolve(validate(res))
          }).catch(err => {
            cell && cell.classList.remove('is-async-validator')
            console.error(err)
            reject()
          })
        } else {
          resolve(validate(result))
        }
      })
    },
    validate(rows) {
      return new Promise((resolve, reject) => {
        const { tableData, validateRow } = this
        const validators = tableData.reduce((acc, cur, idx) => {
          if (Array.isArray(rows) && rows.length) {
            return rows.some(d => d === cur) ? acc.concat(validateRow(idx)) : acc
          } else {
            return acc.concat(validateRow(idx))
          }
        }, [])
        Promise.all(validators).then(data => {
          const messages = data.filter(d => d.message)
          if (!messages.length) {
            resolve(true)
          } else {
            reject(messages)
          }
        }).catch(err => {
          reject(err)
        })
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
