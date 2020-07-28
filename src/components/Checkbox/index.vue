<template>
  <div
    class="checkbox"
    :class="[
      { 'is-disabled': disabled },
      { 'is-checked': isChecked },
      { 'is-indeterminate': indeterminate }
    ]"
    @click="handleChange"
  >
    <span class="checkbox__icon" />
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
      this.isChecked = !this.isChecked
      this.$emit('input', this.isChecked)
      this.$emit('change', this.isChecked)
    }
  }
}
</script>

<style lang="scss" scoped>
.checkbox {
  color: #606266;
  font-weight: 500;
  font-size: 14px;
  position: relative;
  cursor: pointer;
  display: inline-block;
  white-space: nowrap;
  user-select: none;
  .checkbox__icon {
    display: inline-block;
    position: relative;
    border: 1px solid #dcdfe6;
    border-radius: 2px;
    box-sizing: border-box;
    width: 14px;
    height: 14px;
    background-color: #fff;
    z-index: 1;
    transition: border-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46),
      background-color 0.25s cubic-bezier(0.71, -0.46, 0.29, 1.46);
    &:after {
      box-sizing: content-box;
      content: "";
      border: 1px solid #fff;
      border-left: 0;
      border-top: 0;
      height: 7px;
      left: 4px;
      position: absolute;
      top: 1px;
      transform: rotate(45deg) scaleY(0);
      width: 3px;
      transition: transform 0.15s ease-in 0.05s;
      transform-origin: center;
    }
  }
  &.is-checked,
  &.is-indeterminate {
    .checkbox__icon {
      background-color: #409eff;
      border-color: #409eff;
    }
  }
  &.is-checked {
    .checkbox__icon:after {
      transform: rotate(45deg) scaleY(1);
    }
  }
  &.is-indeterminate {
    .checkbox__icon:before {
      content: "";
      position: absolute;
      display: block;
      background-color: #fff;
      height: 2px;
      transform: scale(0.5);
      left: 0;
      right: 0;
      top: 5px;
    }
  }
}
</style>
