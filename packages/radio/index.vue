<template>
  <div
    class="eff-table__radio"
    :class="[
      { 'is--disabled': disabled },
      { 'is-checked': isChecked }
    ]"
    @click="handleChange"
  >
    <span class="eff-table__radio-icon" />
  </div>
</template>

<script>
export default {
  name: 'Radio',
  props: {
    value: Boolean,
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
      if (!this.isChecked) {
        this.isChecked = !this.isChecked
        this.$emit('input', this.isChecked)
        this.$emit('change', this.isChecked)
      }
    }
  }
}
</script>
