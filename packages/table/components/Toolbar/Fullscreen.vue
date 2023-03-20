<template>
  <div
    class="eff-table__screenfull"
    :class="{'exit-screenfull': isFullscreen}"
    :title="isFullscreen ? '退出全屏' : '全屏'"
    @click="click"
  >
    <div
      v-for="d in 4"
      :key="d"
      :style="{transform: `rotate(${-45+(90*(d+1))}deg)`}"
      class="eff-table__screenfull-item"
    >
      <div class="eff-table__screenfull-arrow" />
    </div>
  </div>
</template>

<script>
import screenfull from './screenfull'

export default {
  name: 'Icon',
  props: {
    iconClass: { type: String, default: '' }
  },
  data() {
    return {
      isFullscreen: false,
      target: null
    }
  },
  inject: ['table'],
  mounted() {
    this.init()
  },
  beforeDestroy() {
    if (screenfull.isEnabled) {
      screenfull.off('change', this.change)
    }
  },
  methods: {
    click(e) {
      if (!screenfull.isEnabled) {
        console.error('you browser can not work')
        return false
      }
      this.target = e.target
      screenfull.toggle()
    },
    change(e) {
      if (!this.table.$el.contains(this.target)) return
      this.isFullscreen = screenfull.isFullscreen
      this.table.isScreenfull = this.isFullscreen
      if (!this.isFullscreen) this.target = null
    },
    init() {
      if (screenfull.isEnabled) {
        screenfull.on('change', this.change)
      }
    }
  }
}
</script>

<style lang="scss">
.eff-table__screenfull {
  position: relative;
  width: 16px;
  height: 16px;
  cursor: pointer;
  box-sizing: border-box;
  // transform: scale(.95);
  &-item {
    position: absolute;
    width: 2px;
    height: 7px;

    &:nth-child(1) {
      left: 2px;
      top: 1px;
    }
    &:nth-child(2) {
      right: 3px;
      top: 1px;
    }
    &:nth-child(3) {
      right: 3px;
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
    .eff-table__screenfull-arrow{
      animation: effIdentifier 1s infinite;
    }
  }
  &.exit-screenfull {
    .eff-table__screenfull-arrow {
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
@keyframes effIdentifier {
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
