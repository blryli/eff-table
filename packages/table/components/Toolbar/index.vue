<script>
import Fullscreen from './Fullscreen'
import ColumnCtrlBtn from './ColumnCtrlBtn'
import ColumnEditBtn from './ColumnEditBtn'
import EditHistory from './EditHistory'
import Clear from './Clear'
import Refresh from './Refresh'
import { renderer, getOn } from 'pk/utils/render'

export default {
  name: 'Toolbar',
  components: { Fullscreen, ColumnCtrlBtn, Clear, ColumnEditBtn, EditHistory, Refresh },
  inject: ['table'],
  methods: {
    btnChange() {
      this.table.$refs.drag.toggleCardShow()
    },
    btnEdit() {
      this.table.$refs.columnEdit.toggleCardShow()
    }
  },
  render(h) {
    const { table } = this
    const { toolbarConfig, search, searchClear, columnControl, fullscreen, columnEdit, editHistory } = table
    const { buttons = [], refresh } = toolbarConfig || {}
    const buttonsRender = buttons.reduce((acc, cur, idx) => {
      const { code, on } = cur
      const event = code && getOn(on, { click: () => this.table.commitProxy(code) })
      const opts = Object.assign({}, cur, { on: event })
      const compConf = renderer.get(opts.name)
      return compConf ? acc.concat(compConf.renderDefault(h, opts, { table, columnIndex: idx })) : acc
    }, [])

    return (
      <div class='eff-table__toobar'>
        <div class='eff-table__toobar-left'>
          { buttonsRender }
          { this.$slots.default }
        </div>
        <div class='eff-table__toobar-right'>
          {
            refresh && <Refresh /> || ''
          }
          {
            editHistory && <EditHistory /> || ''
          }
          {
            search && searchClear && <Clear /> || ''
          }
          {
            columnEdit && <ColumnEditBtn on-change={this.btnEdit} /> || ''
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
