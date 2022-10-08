<script>
import Fullscreen from './Fullscreen'
import EditHistory from './EditHistory'
import { renderer, getOn } from 'pk/utils/render'
import ToolbarShrink from 'pk/toolbar-shrink'
import Icon from 'pk/icon'
import XEUtils from 'xe-utils'

export default {
  name: 'Toolbar',
  components: { Fullscreen, EditHistory, ToolbarShrink, Icon },
  inject: ['table'],
  data() {
    return {
      load: true
    }
  },
  methods: {
    handleColumnControl() {
      this.table.$refs.drag.toggleCardShow()
    },
    handleColumnBatchControl() {
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
    const { toolbarConfig, search, heights } = table
    const { buttons = [], refresh, seniorQuery, columnControl, columnBatchControl, fullscreen, editHistory, replace, subtotal } = toolbarConfig || {}
    // const { multiple } = sortConfig
    const buttonsRender = load ? buttons.reduce((acc, cur, idx) => {
      const { code, on = {}} = cur
      const event = code ? getOn(on, { click: e => this.btnClick(code, e, idx) }) : on
      const merge = XEUtils.merge({}, cur, { props: { size: 'mini' }})
      const opts = Object.assign(merge, { on: event })
      const compConf = renderer.get('default')
      return compConf ? acc.concat(compConf.renderDefault(h, opts, { root: table, table, vue: this, columnIndex: idx })) : acc
    }, []) : ''
    const list = buttonsRender.concat(this.$slots.default || []) || []
    const replaceClick = () => (table.$refs.replace.show = !table.$refs.replace.show)
    return (
      <div class='eff-table__toobar' style={{ height: heights.toolbarHeight + 'px' }}>
        <ToolbarShrink list={list} class='eff-table__toobar-left' />
        <div class='eff-table__toobar-right'>
          {
            editHistory && <EditHistory title='编辑记录' /> || ''
          }
          {
            subtotal && <Icon icon='subtotal' title='小计' on-click={table.subtotal} /> || ''
          }
          {
            replace && <Icon icon='replace' title='批量替换' on-click={replaceClick} /> || ''
          }
          {
            seniorQuery && <Icon icon='query' title='高级搜索' on-click={table.seniorQueryOpen} /> || ''
          }
          {
            refresh && <Icon icon='refresh' class='table-refresh' title='刷新' on-click={table.refresh} /> || ''
          }
          {
            search && <Icon icon='clear-search' title='清空搜索' on-click={table.clearSearch} /> || ''
          }
          {
            columnControl && <Icon icon='column-ctrl' title='列控制' on-click={this.handleColumnControl} /> || ''
          }
          {
            columnBatchControl && <Icon icon='column-batch-ctrl' title='列批量控制' on-click={this.handleColumnBatchControl} /> || ''
          }
          {
            fullscreen && <Fullscreen title='全屏' /> || ''
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
