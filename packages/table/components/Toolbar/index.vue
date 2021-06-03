<script>
import Fullscreen from './Fullscreen'
import ColumnCtrlBtn from './ColumnCtrlBtn'
import columnBatchControlBtn from './ColumnBatchControlBtn'
import EditHistory from './EditHistory'
import Clear from './Clear'
import Refresh from './Refresh'
import Search from './Search'
import { renderer, getOn } from 'pk/utils/render'
import ReplaceCtrlBtnVue from './ReplaceCtrlBtn.vue'
import SortCtrlBtn from './SortCtrlBtn.vue'
import XEUtils from 'xe-utils'

export default {
  name: 'Toolbar',
  components: { Fullscreen, ColumnCtrlBtn, Clear, columnBatchControlBtn, EditHistory, Refresh, Search, SortCtrlBtn },
  inject: ['table'],
  data() {
    return {
      load: true
    }
  },
  methods: {
    btnChange() {
      this.table.$refs.drag.toggleCardShow()
    },
    btnEdit() {
      this.table.$refs.columnBatchControl.toggleCardShow()
    },
    btnClick(code, e, index) {
      this.load = false
      code && this.table.commitProxy(code)
      this.$nextTick(() => {
        this.load = true
      })
    }
  },
  render(h) {
    const { table, load } = this
    if (!load) return ''
    const { toolbarConfig, search, searchClear, columnControl, fullscreen, columnBatchControl, editHistory, showReplace, showSort } = table
    const { buttons = [], refresh, diySearch } = toolbarConfig || {}
    const buttonsRender = buttons.reduce((acc, cur, idx) => {
      const { code } = cur
      let { on } = cur
      if (code && getOn(on, { click: e => this.btnClick(code, e, idx) })) {
        on = getOn(on, { click: e => this.btnClick(code, e, idx) })
      }
      const opts = XEUtils.merge({}, cur, { props: { size: 'mini' }, on })
      const compConf = renderer.get(opts.name)
      return compConf ? acc.concat(compConf.renderDefault(h, opts, { root: table, vue: this, columnIndex: idx })) : acc
    }, [])

    return (
      <div class='eff-table__toobar'>
        <div class='eff-table__toobar-left'>
          { buttonsRender }
          { this.$slots.default }
        </div>
        <div class='eff-table__toobar-right'>
          {
            editHistory && <EditHistory /> || ''
          }
          {
            showSort && <SortCtrlBtn /> || ''
          }
          {
            showReplace && <ReplaceCtrlBtnVue /> || ''
          }
          {
            diySearch && <Search /> || ''
          }
          {
            refresh && <Refresh /> || ''
          }
          {
            search && searchClear && <Clear /> || ''
          }
          {
            columnBatchControl && <columnBatchControlBtn on-change={this.btnEdit} /> || ''
          }
          {
            columnControl && <ColumnCtrlBtn on-change={this.btnChange} /> || ''
          }
          {
            fullscreen && <Fullscreen /> || ''
          }
        </div>
      </div>
    )
  }
}
</script>

<style lang="scss">
.eff-table__toobar{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--rowHeight);
  padding: 0 5px;
  border: 1px solid #ddd;
  border-bottom: 0;
  background-color: #f6f7f8;
  box-sizing: border-box;
  &-left, &-right{
    display: flex;
    align-items: center;
    > * + * {
      margin-left: 10px;
    }
  }
}
</style>
