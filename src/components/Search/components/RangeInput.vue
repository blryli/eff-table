<template>
  <!-- 范围选择 -->
  <div class="eff-search__range">
    <EffInput
      ref="input"
      v-model="curValue"
      placeholder="开始"
      @focus="handleFocus"
    />
    <div v-show="show" ref="range" :style="style" class="eff-search__range-wrapper">
      <EffInput
        ref="start"
        v-model="form.start"
        placeholder="开始"
        @change="change"
      />
      <EffInput
        v-model="form.end"
        placeholder="结束"
        @change="change"
      />
    </div>
    <i
      v-if="form.start && form.end"
      class="eff-icon--close"
      @click="clear"
    />
  </div>
</template>

<script>
import { on, off } from 'utils/dom'
import EffInput from './Input'

export default {
  components: {
    EffInput
  },
  props: {
    value: { type: [Array, String], default: () => [] },
    column: { type: Object, default: () => {} }
  },
  data() {
    return {
      curValue: this.value,
      form: { start: '', end: '' },
      show: false,
      style: {}
    }
  },
  watch: {
    show(val) {
      this.$emit(val ? 'show' : 'close', this.column)
    },
    value(val) {
      this.curValue = val
    }
  },
  inject: ['table'],
  mounted() {
    on(window, 'mousedown', this.windowHandleMousedown)
  },
  beforeDestroy() {
    off(window, 'mousedown', this.windowHandleMousedown)
  },
  methods: {
    handleFocus() {
      const { input, start } = this.$refs
      const { left, top, width } = input.$el.getBoundingClientRect()
      this.style = { left: left + 'px', top: top + 'px', width: width + 'px' }
      this.show = true
      start.focus()
    },
    change() {
      let { start, end } = this.form
      start && (start = start.replace(/[a-zA-Z]/, ''))
      end && (end = end.replace(/[a-zA-Z]/, ''))
      this.curValue = start && end ? [start, end] : []
      this.$emit('change', this.curValue)
    },
    windowHandleMousedown(e) {
      if (!this.$el.contains(e.target)) {
        this.show = false
        this.$refs.input.blur()
      }
    },
    reset() {
      this.form = { start: '', end: '' }
      this.change()
    },
    clear() {
      const { column, prop, table, reset } = this
      table.$emit('search-clear-filed', { column, prop })
      reset()
    }
  }
}
</script>

<style lang="scss">
.eff-search__range{
  height: auto;
  &-wrapper{
    position: fixed;
    display: flex;
    flex-direction: column;
    z-index: 100;
    .eff-search--input{
      background-color: #fff;
      border-color: #ddd;
      &:hover{
        border-color: #c0c4cc;
        z-index: 1;
      }
      &:focus, &:active{
        border-color: #1177E8;
        z-index: 1;
      }
    }
  }
}
</style>
