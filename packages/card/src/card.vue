<template>
  <div
    v-show="show"
    ref="card"
    class="eff-card"
    shadow="hover"
    :style="style"
    @mousedown="handleMousedown"
    @mousemove="handleMousemove"
    @mouseleave="handleMouseleave"
  >
    <div class="eff-card__header">
      <span class="eff-card__header-title">{{ title }}</span>
      <slot name="header" />
      <i class="eff-card__header-close" type="text" @click="$emit('close')" />
    </div>
    <div ref="body" class="eff-card__body" :class="{inline: inline}">
      <slot />
    </div>
  </div>
</template>

<script>
import { onMousemove, hasClass } from 'pk/utils/dom'

export default {
  name: 'Card',
  props: {
    title: { type: String, required: true },
    width: { type: Number, default: 250 },
    height: { type: Number, default: 250 },
    minWidth: { type: Number, default: 100 },
    minHeight: { type: Number, default: 200 },
    show: Boolean,
    inline: Boolean,
    addToBody: Boolean,
    limit: { type: Number, default: 10 },
    initStyle: { type: Object, default() { return { left: 0, top: 0, width: this.width, height: this.height } } }
  },
  data() {
    return {
      isAddToBody: false,
      startRect: { left: 0, top: 0, width: 0, height: 0 },
      endRect: this.initStyle,
      // endRect: { left: 0, top: 0, width: this.width, height: this.height },
      move: { x: 0, y: 0, width: 0, height: 0 },
      cursor: null,
      isDraging: false
    }
  },
  computed: {
    style() {
      const { left, top, width, height } = this.endRect
      return {
        left: left ? left + 'px' : '',
        top: top ? top + 'px' : '',
        width: width + 'px',
        height: height + 'px'
      }
    }
  },
  watch: {
    move() {
      this.update()
    },
    cursor(val) {
      document.body.style.cursor = val.replace(/_[a-z]+/, '')
    },
    initStyle(val) {
      this.endRect = val
    }
  },
  mounted() {
    this.addToBody && this.addToBodyed()

    setTimeout(() => {
      this.startRect = this.$el.getBoundingClientRect()
      this.update()
    }, 500)
  },
  beforeDestroy() {
    this.addToBody && document.body.removeChild(this.$el)
  },
  methods: {
    update() {
      const {
        left,
        top,
        width: startWidth,
        height: startHeight
      } = this.startRect
      const { x, y, width, height } = this.move
      if (startWidth + width >= this.minWidth) {
        this.endRect.width = startWidth + width
        this.endRect.left = left + x
      }
      if (startHeight + height >= this.minHeight) {
        this.endRect.height = startHeight + height
        this.endRect.top = top + y
      }
    },
    handleMousedown() {
      this.cursor && onMousemove({
        start: this.start,
        moveing: this.moveing,
        end: this.end
      })
    },
    handleMousemove(e) {
      if (this.isDraging) return
      const { target, x, y } = e

      // header 操作
      const headers = ['eff-card__header', 'eff-card__header-title']
      if (headers.find(d => hasClass(target, d))) {
        const { left, top, right } = this.$el.getBoundingClientRect()
        if (y < top + 8) {
          // 上拉伸
          this.cursor = 'ns-resize_top'
          if (x < left + 8) {
            // 左上角
            this.cursor = 'nwse-resize_top'
          } else if (x > right - 8) {
            this.cursor = 'nesw-resize_top' // 右上角
          }
        } else {
          this.cursor = 'move' // 头部拖动
        }
      } else if (hasClass(target, 'eff-card__body')) {
        // body 操作
        const { left, bottom, right } = this.$refs.body.getBoundingClientRect()
        if (y > bottom - 8) {
          this.cursor = 'ns-resize_bottom'
          if (x < left + 8) {
            this.cursor = 'nesw-resize_bottom'
          } else if (x > right - 8) {
            this.cursor = 'nwse-resize_bottom'
          }
        } else if (x < left + 8) {
          this.cursor = 'ew-resize_left'
        } else if (x > right - 8) {
          this.cursor = 'ew-resize_right'
        } else {
          this.cursor = ''
        }
      } else {
        this.cursor = ''
      }
    },
    handleMouseleave() {
      if (this.isDraging) return
      document.body.style.cursor = ''
    },
    start() {
      this.isDraging = true
      this.startRect = this.$el.getBoundingClientRect()
    },
    moveing(x, y) {
      const { cursor } = this
      if (cursor.startsWith('ns-resize')) {
        this.move =
          cursor.indexOf('top') > -1
            ? { x: 0, y, width: 0, height: -y }
            : { x: 0, y: 0, width: 0, height: y }
      } else if (cursor.startsWith('nesw-resize')) {
        this.move =
          cursor.indexOf('top') > -1
            ? { x: 0, y, width: x, height: -y }
            : { x, y: 0, width: -x, height: y }
      } else if (cursor.startsWith('nwse-resize')) {
        this.move =
          cursor.indexOf('top') > -1
            ? { x, y, width: -x, height: -y }
            : { x: 0, y: 0, width: x, height: y }
      } else if (cursor.startsWith('ew-resize')) {
        this.move =
          cursor.indexOf('left') > -1
            ? { x, y: 0, width: -x, height: 0 }
            : { x: 0, y: 0, width: x, height: 0 }
      } else if (cursor === 'move') {
        this.move = { x, y, width: 0, height: 0 }
      }
    },
    end(x, y) {
      this.isDraging = false
      const { innerHeight } = window
      const { clientWidth } = document.body
      const { left, top, width, height } = this.endRect

      // 控制最终位置
      const right = clientWidth - width - this.limit
      const bottom = innerHeight - height - this.limit
      this.endRect.left =
        left < this.limit ? this.limit : left > right ? right : left
      this.endRect.top =
        top < this.limit ? this.limit : top > bottom ? bottom : top
    },
    addToBodyed() {
      if (this.isAddToBody) return
      this.$nextTick(() => {
        document.body.appendChild(this.$el)
        this.isAddToBody = true
      })
    }
  }
}
</script>
