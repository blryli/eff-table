import { on, off } from 'pk/utils/dom'
import { getKeysStr } from 'pk/utils'
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
          this.clearSearch()
          this.searchChange([])
        }
      }
    },
    handleWindowClick(e) {
      const { target } = e
      if (this.edit) {
        const { edit, popovers } = this.$refs
        if (!this.$refs.body.$el.querySelector('.eff-table__body').contains(target) && !edit.$el.contains(target) && !popovers.$refs.editPopover.$el.contains(target)) {
          if (edit.show) {
            this.closeEdit()
          }
        }
      }

      if (this.selectRange || this.copy) {
        if (!this.$refs.body.$el.querySelector('.eff-table__body').contains(target)) {
          this.closeSelectRange()
        }
      }
    }
  }
}
