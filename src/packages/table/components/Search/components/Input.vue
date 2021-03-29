<template>
  <input
    ref="input"
    :value="date"
    class="eff-search--input"
    placeholder="请输入"
    @input="handleInput"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
    @change="handleChange"
  >
</template>

<script>

export default {
  props: {
    modelValue: { type: [String, Number, Array], default: '' }
  },
  emits: ['input', 'focus', 'blur', 'change', 'update:modelValue'],
  data() {
    return {
      date: this.getValue(),
      form: { start: '', end: '' },
      show: false,
      style: {}
    }
  },
  watch: {
    modelValue(val) {
      this.date = this.getValue()
    }
  },
  methods: {
    getValue() {
      const { modelValue } = this
      if (!modelValue) return ''
      if (Array.isArray(modelValue)) {
        const [start, end] = modelValue
        if (!start || !end) return []
        return `${start} - ${end}`
      } else {
        return modelValue
      }
    },
    handleInput(e) {
      this.data = e.target.value
      this.$emit('update:modelValue', this.data)
    },
    handleChange(e) {
      this.data = e.target.value
      this.$emit('change', this.data)
    },
    blur() {
      this.$refs.input.blur()
    },
    focus() {
      this.$refs.input.focus()
    }
  }
}
</script>
