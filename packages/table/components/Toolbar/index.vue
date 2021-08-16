<script>
import Fullscreen from './Fullscreen'
import ColumnCtrlBtn from './ColumnCtrlBtn'
import columnBatchControlBtn from './ColumnBatchControlBtn'
import EditHistory from './EditHistory'
import Clear from './Clear'
import Refresh from './Refresh'
import Search from './Search'
import Subtotal from './Subtotal'
import { renderer, getOn } from 'pk/utils/render'
import ReplaceCtrlBtnVue from './ReplaceCtrlBtn.vue'
import SortCtrlBtn from './SortCtrlBtn.vue'
import ToolbarShrink from 'pk/toolbar-shrink'
import XEUtils from 'xe-utils'
import Help from 'pk/help'

export default {
  name: 'Toolbar',
  components: { Fullscreen, ColumnCtrlBtn, Clear, columnBatchControlBtn, EditHistory, Refresh, Search, SortCtrlBtn, ToolbarShrink, Subtotal },
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
    const { toolbarConfig, sortConfig, search } = table
    const { buttons = [], refresh, diySearch, columnControl, columnBatchControl, fullscreen, editHistory, showReplace, subtotal } = toolbarConfig || {}
    const { multiple } = sortConfig
    const renderHelp = (help, node) => {
      const { effect = 'dark', message, placement } = help
      return <Help effect={effect} message={message} placement={placement} >{node}</Help>
    }
    const buttonsRender = load ? buttons.reduce((acc, cur, idx) => {
      const { code, on = {}} = cur
      const event = code ? getOn(on, { click: e => this.btnClick(code, e, idx) }) : on
      const merge = XEUtils.merge({}, cur, { props: { size: 'mini' }})
      const opts = Object.assign(merge, { on: event })
      const compConf = renderer.get('default')
      return compConf ? acc.concat(compConf.renderDefault(h, opts, { root: table, table, renderHelp, vue: this, columnIndex: idx })) : acc
    }, []) : ''
    const list = buttonsRender.concat(this.$slots.default || []) || []
    return (
      <div class='eff-table__toobar'>
        <ToolbarShrink list={list} class='eff-table__toobar-left' />
        <div class='eff-table__toobar-right'>
          {
            subtotal && <Subtotal /> || ''
          }
          {
            editHistory && <EditHistory /> || ''
          }
          {
            multiple && <SortCtrlBtn /> || ''
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
    flex: 1;
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
      padding: 2px 10px 6px;
      background-color: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      user-select: none;
      &:hover{
        cursor: pointer;
        background-color: #f5f5f5;
        border-color: #ccc;
      }
    }
  }
}
.is--show{
  display: block;
}
.is--hide{
  display: none;
}
</style>
