<template>
  <input
    ref="input"
    v-model="date"
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
    value: { type: [String, Number, Array], default: '' }
  },
  data() {
    return {
      date: this.getValue(),
      form: { start: '', end: '' },
      show: false,
      style: {}
    }
  },
  watch: {
    value(val) {
      this.date = this.getValue()
    }
  },
  methods: {
    getValue() {
      if (!this.value) return ''
      if (Array.isArray(this.value)) {
        const [start, end] = this.value
        if (!start || !end) return []
        return `${start} - ${end}`
      } else {
        return this.value
      }
    },
    handleInput(e) {
      this.data = e.target.value
      this.$emit('input', this.data)
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
