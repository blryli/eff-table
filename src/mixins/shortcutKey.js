import { on, off } from 'utils/dom'
import { getKeysStr } from 'utils'
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
  },
  beforeDestroy() {
    off(window, 'mousedown', this.handleWindowMousedown)
    off(window, 'keyup', this.handleWindowKeyup)
  },
  methods: {
    rootMouseenter() {
      this.inRoot = true
    },
    rootMouseleave() {
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
        this.$refs.edit.handleWindowKeyup(e, keysStr)
      }
      if (this.inRoot && this.search && keysStr === 'b,control') {
        this.searchShow = !this.searchShow
        if (this.searchShow === false) {
          console.log('this.searchShow', this.searchShow)
          this.clearSearch()
          this.$emit('search-change', [])
        }
      }
    }
  }
}
