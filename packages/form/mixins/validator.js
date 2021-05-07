export default {
  data() {
    return {
      validators: [],
      formLines: []
    }
  },
  created() {
    this.$on('form.line.add.validator', (cols) => {
      this.formLines = this.formLines.concat(cols)
    })
    this.$on('form.line.remove.validator', (cols) => {
      cols.forEach(d => {
        const index = this.formLines.findIndex(line => line.path === d.path)
        const idx = this.validators.findIndex(line => line.path === d.path)
        index > -1 && this.formLines.splice(index, 1)
        idx > -1 && this.validators.splice(idx, 1)
      })
    })
  },
  methods: {
    validateField(path, rule, data = this.data) {
      if (!path) {
        console.error('需要校验的字段，必须具有 path 属性')
        return {}
      }
      if (typeof rule !== 'function') {
        console.error(`校验rule [${rule}]，必须是函数`)
        return {}
      }
      if (!data) {
        console.error('使用校验时，必须传入源数据 data')
        return {}
      }
      const value = this.getPathValue(data, path)
      const result = rule(value, path)
      const type = params => Object.prototype.toString.call(params).match(/ (\w+)]/)[1]
      const validate = params => {
        const validator = { path, ...params }
        const { message, stop = false } = validator
        const index = this.validators.findIndex(d => d.path === path)
        index === -1 ? this.validators.push(validator) : this.validators.splice(index, 1, validator)
        this.$emit('validate', { path, success: !message, message, stop })
        return { path, success: !message, message, stop }
      }
      return type(result) === 'Promise' ? result.then(res => validate(res)) : validate(result)
    },
    validate(cb) {
      if (typeof cb !== 'function') {
        console.error('validate参数必须是函数')
        return
      }
      Promise.all(this.formLines.map(d => this.validateField(d.path, d.validator))).then(validators => {
        cb(!validators.find(rule => rule.stop && rule.message), validators)
      })
    },
    clearValidate(paths) {
      if (!paths) {
        this.validators = []
      } else if (Array.isArray(paths)) {
        paths.forEach(path => {
          const index = this.validators.findIndex(d => d.path === path)
          this.validators.splice(index, 1)
        })
      } else console.error('clearValidate参数必须是数组')
    },
    getPathValue(data, path) {
      return path.split('/').filter(d => d).reduce((acc, cur) => acc[cur], data)
    }
  }
}
