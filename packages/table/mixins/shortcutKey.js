import { on, off } from 'packages/table/utils/dom'
import { getKeysStr } from 'packages/table/utils'
export default {
  data() {
    return {
      inRoot: false,
      searchShow: true
    }
  },
  mounted() {
    on(window, 'mouseleave', this.handleWindowMouseleave)
    on(window, 'keyup', this.handleWindowKeyup)
    on(window, 'click', this.handleWindowClick)
  },
  beforeDestroy() {
    off(window, 'mousedown', this.handleWindowMousedown)
    off(window, 'keyup', this.handleWindowKeyup)
    off(window, 'click', this.handleWindowClick)
  },
  methods: {
    closeEdit() {
      const { edit } = this.$refs
      edit && edit.close()
    },
    closeSelectRange() {
      const { selectRange } = this.$refs
      selectRange && selectRange.close()
    },
    rootMouseenter(event) {
      this.$emit('table-mouse-enter', { event })
      this.inRoot = true
    },
    rootMouseleave(event) {
      this.$emit('table-mouse-leave', { event })
      this.inRoot = false
    },
    handleWindowMousedown(e) {
      if (this.edit) {
        this.$refs.edit.handleWindowMousedown(e)
      }
    },
    handleWindowKeyup(e) {
      const keysStr = getKeysStr(e)
      if (this.edit) {
        // 编辑模式下，键盘组合键传入编辑组件
        this.$refs.edit.handleWindowKeyup(e, keysStr)
      }
      // 快捷键控制搜索区域显示/隐藏
      if (this.inRoot && this.search && keysStr === 'b,control') {
        this.searchShow = !this.searchShow
        if (this.searchShow === false) {
          console.log('this.searchShow', this.searchShow)
          this.clearSearch()
          this.$emit('search-change', [])
        }
      }
    },
    handleWindowClick(e) {
      if (this.edit) {
        const { target } = e
        const { edit, editPopover } = this.$refs
        // 点击编辑以外的区域时关闭编辑框
        // if (edit.show) {
        if (!this.$refs.body.$el.contains(target) && !edit.$el.contains(target) && !editPopover.$el.contains(target)) {
          if (edit.show) {
            this.closeEdit()
          }
          this.closeSelectRange()
        }
        // }
      }
    }
  }
}
