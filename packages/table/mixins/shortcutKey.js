import { on, off, hasClass } from 'pk/utils/dom'
import { getKeysStr } from 'pk/utils'
export default {
  data() {
    return {
      inRoot: false,
      searchShow: true
    }
  },
  mounted() {
    on(window, 'mousedown', this.handleWindowMousedown)
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
      // 关闭编辑框
      if (this.edit) {
        this.$refs.edit.handleWindowMousedown(e)
      }
      // 取消header列选中
      if (this.headerCheckedColumns.length) {
        const { header, leftHeader, rightHeader } = this.$refs
        const headers = [header, leftHeader, rightHeader]
        headers.forEach(d => {
          d && d.handleWindowMousedown(e)
        })
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
        const { edit, popovers, body, leftBody, rightBody } = this.$refs
        if (![body, leftBody, rightBody].find(d => d && d.$el.querySelector('.eff-table__body').contains(target)) && !edit.$el.contains(target) && !popovers.$refs.editPopover.$el.contains(target)) {
          if (edit.show) {
            this.closeEdit()
          }
        }
      }

      if (this.selectRange || this.copy) {
        if (document.contains(target) && !this.$refs.body.$el.querySelector('.eff-table__body').contains(target) && (!this.$refs.header.$el.querySelector('.eff-table__header').contains(target) || this.$refs.header.$el.querySelector('.eff-table__header').contains(target) && !this.headerCheckedColumns.length)) {
          this.closeSelectRange()
        }
      }
      // 过滤
      const filter = document.getElementById(this.tableId + 'filter')
      if (this.useFilter && !filter.contains(target) && !hasClass(target, 'eff-icon-filter')) {
        this.$refs.filter.filterTipClose()
      }
    }
  }
}
