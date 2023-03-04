<script>
import Fullscreen from './Fullscreen'
import EditHistory from './EditHistory'
import { renderer, getOn } from 'pk/utils/render'
import Icon from 'pk/icon'
import XEUtils from 'xe-utils'

export default {
  name: 'Toolbar',
  components: { Fullscreen, EditHistory, Icon },
  inject: ['table'],
  data() {
    return {
      load: true,
      height: 0
    }
  },
  watch: {
    height(height) {
      this.table.toolbarHeight = height
    }
  },
  updated() {
    this.height = this.$el.offsetHeight
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
    const { toolbarConfig, search } = table
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
    const leftList = buttonsRender.concat(this.$slots.default || []) || []
    const replaceClick = () => (table.$refs.replace.show = !table.$refs.replace.show)
    const idRight = editHistory || subtotal || replace || seniorQuery || refresh || search || columnControl || columnBatchControl || fullscreen
    return (
      <div class='eff-table__toobar'>
        <div class='eff-table__toobar-left'>{leftList}</div>
        {idRight ? <div class='eff-table__toobar-right'>
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
        </div> : ''}
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
  column-gap: 10px;
  padding: 8px;
  border: 1px solid #ddd;
  border-bottom: 0;
  background-color: #f6f7f8;
  box-sizing: border-box;
  &-left, &-right{
    height: var(--rowHeight);
    display: flex;
    align-items: center;
    column-gap: 10px;
    row-gap: 5px;
  }
  &-left{
    flex: 1;
    flex-wrap: wrap;
    position: relative;
    overflow: hidden;
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
  .el-button+.el-button{
    margin-left: 0;
  }
}
.is--show{
  display: block;
}
.is--hide{
  display: none;
}
</style>
