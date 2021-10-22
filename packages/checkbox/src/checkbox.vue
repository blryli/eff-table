<script>
export default {
  name: 'Checkbox',
  props: {
    value: Boolean,
    indeterminate: Boolean,
    disabled: Boolean,
    checked: Boolean,
    label: { type: String, default: '' }
  },
  data() {
    return {
      isChecked: this.value
    }
  },
  watch: {
    value(val) {
      this.isChecked = val
    }
  },
  methods: {
    handleChange() {
      if (this.disabled) return
      this.isChecked = !this.isChecked
      this.$emit('input', this.isChecked)
      this.$emit('change', this.isChecked)
    }
  },
  render(h) {
    const { disabled, isChecked, indeterminate, label, handleChange } = this
    return h('div', {
      class: {
        'eff-table__checkbox': true,
        'is--disabled': disabled,
        'is-checked': isChecked,
        'is-indeterminate': indeterminate
      },
      on: { click: handleChange }
    }, [
      h('span', { class: 'eff-table__checkbox-icon' }),
      label ? h('span', { class: 'eff-table__checkbox-label' }, label) : ''
    ])
  }
}
</script>
