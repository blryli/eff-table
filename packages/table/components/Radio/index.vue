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

<style lang="scss">
.eff-table__radio {
    white-space: nowrap;
    cursor: pointer;
    outline: none;
    display: inline-block;
    line-height: 1;
    position: relative;
    vertical-align: middle;
  .eff-table__radio-icon {
    display: inline-block;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: #fff;
    transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
      background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
      border-radius: 100%;
    &:after {
      width: 4px;
    height: 4px;
    border-radius: 100%;
    background-color: #fff;
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%) scale(0);
    transition: transform .15s ease-in;
    }
  }
  &.is-checked,
  &.is-indeterminate {
    .eff-table__radio-icon {
      background-color: #409eff;
      border-color: #409eff;
    }
  }
  &.is-checked {
    .eff-table__radio-icon:after {
    transform: translate(-50%,-50%) scale(1);
    }
  }
}
</style>
