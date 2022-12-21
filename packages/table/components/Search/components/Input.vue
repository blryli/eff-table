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
      form: { start: '', end: '' },
      show: false,
      style: {}
    }
  },
  computed: {
    date: {
      get() {
        return this.getValue()
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  methods: {
    getValue() {
      const { value } = this
      if (!value) return ''
      if (Array.isArray(value)) {
        const [start, end] = value
        if (!start || !end) return []
        return `${start} - ${end}`
      } else {
        return value
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
