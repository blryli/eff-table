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
      const { edit, columns, validators, rowId, $createElement } = this
      let value = row[prop]
      const id = row[rowId]
      const column = columns.find(d => d.prop === prop) || {}
      const { edit: columnEdit, editable } = column
      const { render } = column.edit || {}
      // 动态编辑器取值
      let renderOpt = null
      if (typeof render === 'function') {
        renderOpt = render($createElement, { row, column })
      } else {
        renderOpt = render
      }
      if (renderOpt && renderOpt.prop) {
        value = row[renderOpt.prop]
      }

      // 校验规则
      if (!rule) {
        const { rules = [] } = column
        if (Array.isArray(rules)) {
          rule = rules
        } else {
          // resolve()
        }
      }
      if (!edit || editable === false || columnEdit === false) {
        rule = []
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
      const { table, tableData, columns, editStore} = this
      const { insertList, updateList, pendingList } = editStore
      let validData
      if (rows === true) {
        validData = tableData
      } else if (rows) {
        validData = Array.isArray(rows) ? rows : [rows]
      } else {
        validData = all ? tableData : insertList.concat(updateList)
      }
      // 支持表格树的校验
      const tableTreeConfig = this.tableTreeConfig || {}
      const { children } = tableTreeConfig
      if(children) {
        const getChilds = rows => {
          return rows.reduce((acc, row) => {
            return !pendingList.some(p => p === row) ? acc.concat([row, ...getChilds(row[children] || [])]) : acc
          }, [])
        }
        validData = getChilds(validData)
      }

      return validate(validData, columns, this.validateField, table)
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
