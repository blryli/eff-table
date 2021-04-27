<template>
  <div
    class="eff-table__checkbox"
    :class="[
      { 'is--disabled': disabled },
      { 'is-checked': isChecked },
      { 'is-indeterminate': indeterminate }
    ]"
    @click="handleChange"
  >
    <span class="eff-table__checkbox-icon" />
  </div>
</template>

<script>
export default {
  name: 'Checkbox',
  props: {
    value: Boolean,
    indeterminate: Boolean,
    disabled: Boolean,
    checked: Boolean
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
  }
}
</script>
