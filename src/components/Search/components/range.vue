<template>
  <!-- 范围选择 -->
  <div v-show="show" ref="range" class="table-search-range" :style="style">
    <input
      ref="first"
      v-model="form.start"
      placeholder="开始"
      style="display: flex;padding: 0;height:28px"
    >
    <input
      v-model="form.end"
      placeholder="结束"
      style="display: flex;padding: 0;height:28px"
    >
  </div>
</template>

<script>
import { on, off } from '@/utils/dom'

export default {
  props: {
    range: { type: Object, default: () => {} }
  },
  data() {
    return {
      label: '',
      form: { start: '', end: '' },
      show: false,
      style: {}
    }
  },
  watch: {
    range(val) {
      const { label, show, rangeRect = {}} = this.range
      this.show = show
      this.label = label
      if (this.show) {
        setTimeout(() => {
          this.$refs.first.focus()
        }, 0)
      }
      const { left = 0, top = 0, width = 0 } = rangeRect
      this.style = {
        left: left + 'px',
        top: top + 'px',
        width: width + 'px'
      }
    },
    show(val) {
      const { label } = this.range
      this.$emit(val ? 'show' : 'close', { label })
    },
    form: {
      handler(val) {
        let { start, end } = val
        start && (start = start.replace(/[a-zA-Z]/, ''))
        end && (end = end.replace(/[a-zA-Z]/, ''))
        const emitVal = start && end ? [start, end] : []
        this.$emit('range.change', {
          label: this.label,
          value: emitVal
        })
      },
      deep: true
    }
  },
  mounted() {
    on(window, 'mousedown', this.windowHandleMousedown)
  },
  beforeDestroy() {
    off(window, 'mousedown', this.windowHandleMousedown)
  },
  methods: {
    windowHandleMousedown(e) {
      !this.$el.contains(e.target) && (this.show = false)
    },
    reset() {
      this.form = { start: '', end: '' }
    }
  }
}
</script>

<style lang="scss">
.table-search-range {
  position: fixed;
  display: flex;
  flex-direction: column;
  z-index: 100;
  .el-date-editor{
    &.el-input {
      width: 100%;
    }
  }
  .el-input__inner {
    height: 28px;
    line-height: 28px;
    border-color: #ddd;
    border-radius: 0;
    padding: 5px;
  }
  .el-input__prefix {
    left: 0;
    .el-input__icon{
      line-height: 28px;
    }
  }
  .el-input__suffix {
    right: 0;
    .el-input__icon{
      line-height: 28px;
    }
  }
  .el-input--prefix {
    .el-input__inner {
      padding-left: 25px;
    }
  }
}
</style>
