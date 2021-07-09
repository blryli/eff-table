import { on, off } from 'pk/utils/dom'
export default {
  // 右键扩展功能
  name: 'Contextmenu',
  props: {
    list: { type: Array, default: () => ([]) },
    listMethod: { type: Function, default: () => {} }
  },
  data() {
    return {
      show: false,
      handleIndex: null,
      pos: { x: 0, y: 0 }
    }
  },
  mounted() {
    on(window, 'mousedown', this.windowMousedown)
    on(window, 'mousewheel', this.close)
  },
  beforeDestroy() {
    off(window, 'mousedown', this.windowMousedown)
    off(window, 'mousewheel', this.close)
  },
  methods: {
    windowMousedown(e) {
      if (e.which && !this.$refs.contextmenu.contains(e.target)) {
        this.close()
      }
    },
    handleMouseenter() {
      document.oncontextmenu = () => false
    },
    handleMouseleave() {
      document.oncontextmenu = null
    },
    handleMouseup(e) {
      if (e.which === 3) {
        this.handleIndex = [...this.$el.children].findIndex(d => d.contains(e.target))
        const { handleIndex, listMethod, open } = this
        const { x, y } = e
        this.pos = { x, y }
        listMethod && listMethod(handleIndex)
        open()
      }
    },
    handleClickItem(d, i, e) {
      if (d.disabled) return false
      this.$emit('item-click', this.handleIndex, d, i, e)
      this.close()
    },
    open() {
      this.show = true
    },
    close() {
      this.show = false
    }
  },
  render(h) {
    const { handleMouseenter, handleMouseleave, handleMouseup, list, handleClickItem, show, pos } = this
    return (
      <div
        class='eff-contextmenu'
        on-mouseenter={handleMouseenter}
        on-mouseleave={handleMouseleave}
        on-contextmenu={() => false}
        on-mouseup={handleMouseup}
      >
        {this.$slots.default}
        {
          <div
            ref='contextmenu'
            class='eff-contextmenu--list'
            style={{
              display: show ? 'block' : 'none',
              left: pos.x + 'px',
              top: pos.y + 'px'
            }}
          >
            {
              list.filter(d => d.show).map((d, i) => <div class={['eff-contextmenu--list-item', d.disabled ? 'is--disabled' : '']} on-click={e => handleClickItem(d, i, e)}>{d.title}</div>)
            }
          </div>
        }
      </div>
    )
  }
}
