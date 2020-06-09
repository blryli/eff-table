<template>
  <div
    class="screenfull"
    :class="{'exit-screenfull': isFullscreen}"
    title="全屏"
    @click="click"
  >
    <div
      v-for="d in 4"
      :key="d"
      :style="{transform: `rotate(${-45+(90*(d+1))}deg)`}"
      class="screenfull-item"
    >
      <div class="screenfull-arrow" />
    </div>
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'Icon',
  props: {
    iconClass: { type: String, default: '' }
  },
  data() {
    return {
      isFullscreen: false
    }
  },
  inject: ['table'],
  mounted() {
    this.init()
  },
  beforeDestroy() {
    this.destroy()
  },
  methods: {
    click() {
      if (!screenfull.isEnabled) {
        console.error('you browser can not work')
        return false
      }
      screenfull.toggle(this.table.$el)
    },
    change() {
      this.isFullscreen = screenfull.isFullscreen
      this.table.$emit('screenfullChange', this.isFullscreen)
    },
    init() {
      if (screenfull.isEnabled) {
        screenfull.on('change', this.change)
      }
    },
    destroy() {
      if (screenfull.isEnabled) {
        screenfull.off('change', this.change)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.screenfull {
  position: relative;
  width: 16px;
  height: 16px;
  cursor: pointer;
  box-sizing: border-box;
  &-item {
    position: absolute;
    width: 2px;
    height: 7px;

    &:nth-child(1) {
      left: 2px;
      top: 0;
    }
    &:nth-child(2) {
      right: 2px;
      top: 0;
    }
    &:nth-child(3) {
      right: 2px;
      bottom: 0;
    }
    &:nth-child(4) {
      left: 2px;
      bottom: 0;
    }
  }
  &-arrow{
    position: absolute;
    width: 2px;
    height: 7px;
    background-color: #888;
    &::before {
      content: "";
      position: absolute;
      top: 4px;
      left: -3px;
      border: 4px solid transparent;
      border-top-color: #888;
    }
  }
  &:hover{
    .screenfull-arrow{
      animation: identifier 1s infinite;
    }
  }
  &.exit-screenfull {
    .screenfull-arrow {
      &::before {
        transform: rotate(180deg);
      }
      &::before {
        top: -5px;
        left: -3px;
      }
    }
  }
}
@keyframes identifier {
  0%{
    transform: translateY(0);
  }
  25%{
    transform: translateY(1px);
  }
  50%{
    transform: translateY(0);
  }
  75%{
    transform: translateY(1px);
  }
  100%{
    transform: translateY(0);
  }
}
</style>
