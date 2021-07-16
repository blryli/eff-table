<script>
import Paginator from './Paginator.js'
import ToolbarShrink from 'pk/toolbar-shrink'

export default {
  name: 'Toolbar',
  components: { Paginator, ToolbarShrink },
  inject: ['table'],
  methods: {
  },
  render(h) {
    const { table, $slots } = this
    const { showPager, showBorder, changeOver } = table.footerActionConfig
    const { pageNum, pageSize, total } = table.pager
    const paginator = showPager && <Paginator pageNum={pageNum} pageSize={pageSize} total={total} /> || ''

    return <div class='eff-table__action eff-table__toobar' style={showBorder ? '' : 'border: unset'}>
      {
        changeOver ? [
          <div class='eff-table__toobar-left'>
            {paginator}
          </div>,
          <ToolbarShrink list={$slots.default} class='eff-table__toobar-right'>
            { $slots.default}
          </ToolbarShrink>

        ] : [
          <ToolbarShrink list={$slots.default} class='eff-table__toobar-left'>
            {$slots.default}
          </ToolbarShrink>,
          <div class='eff-table__toobar-right'>
            { paginator}
          </div>
        ]
      }
    </div>
  }
}
</script>

<style lang="scss">
.eff-table__action.eff-table__toobar{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: var(--rowHeight);
  padding: 0 5px;
  border: 1px solid #ddd;
  border-top: 0;
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
