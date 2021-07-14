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
import PopoverRef from 'pk/popover/src/popover-ref'

export default {
  name: 'Toolbar',
  components: { Fullscreen, ColumnCtrlBtn, Clear, columnBatchControlBtn, EditHistory, Refresh, Search, SortCtrlBtn, PopoverRef },
  inject: ['table'],
  data() {
    return {
      load: true
    }
  },
  mounted() {
    this.$nextTick(() => {
      // const { toolbarLeft, toolbarRight } = this.$refs
      // console.log({ toolbarLeft, toolbarRight })
      // const leftRect = toolbarLeft.getBoundingClientRect()
      // const rightRect = toolbarRight.getBoundingClientRect()
      // console.log({ leftRect, rightRect })
    })
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
    const { toolbarConfig, search } = table
    const { buttons = [], refresh, diySearch, columnControl, columnBatchControl, fullscreen, editHistory, showReplace, showSort } = toolbarConfig || {}
    const buttonsRender = buttons.reduce((acc, cur, idx) => {
      const { code, on = {}} = cur
      const event = code ? getOn(on, { click: e => this.btnClick(code, e, idx) }) : on
      const merge = XEUtils.merge({}, cur, { props: { size: 'mini' }})
      const opts = Object.assign(merge, { on: event })
      const compConf = renderer.get(opts.name)
      return compConf ? acc.concat(compConf.renderDefault(h, opts, { root: table, table, vue: this, columnIndex: idx })) : acc
    }, [])

    // <div class='toobar-left--more'>
    //   <PopoverRef
    //     effect='dark'
    //     message='2222'
    //   >
    //     <div class='toobar-left--more-icon'>...</div>
    //   </PopoverRef>
    // </div>
    // <div class='eff-table__toobar-gutter' ref='gutter' />
    return (
      <div class='eff-table__toobar' ref='toolbar'>
        <div class='eff-table__toobar-left' ref='toolbarLeft'>
          { buttonsRender }
          { this.$slots.default }
        </div>
        <div class='eff-table__toobar-right' ref='toolbarRight'>
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
            search && <Clear /> || ''
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
    height: var(--rowHeight);
    display: flex;
    align-items: center;
    > * + * {
      margin-left: 10px;
    }
  }
  &-left{
    position: relative;
    overflow: hidden;
    margin-right: 20px;
  }
  &-gutter{
    position: absolute;
    right: 0;
    width: 1px;
    height: var(--rowHeight);
    background-color: red;
  }
  .toobar-left--more{
    &-icon{
      padding: 10px;
      background-color: #f6f7f8;
      border: 1px solid #ddd;
    }
  }
}
</style>
