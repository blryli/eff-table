<script>
import Paginator from './Paginator.js'

export default {
  name: 'Toolbar',
  components: { Paginator },
  inject: ['table'],
  methods: {
  },
  render(h) {
    const { table } = this
    const { showPager, showBorder, pageInLeft } = table.footerActionConfig
    const { pageNum, pageSize, total } = table.pager

    let slot
    if (pageInLeft) {
      slot = (
        <div class='eff-table__toobar' style={showBorder ? '' : 'border: unset'}>
          <div class='eff-table__toobar-right'>
            {
              showPager && <Paginator pageNum={pageNum} pageSize={pageSize} total={total} /> || ''
            }
          </div>
          <div class='eff-table__toobar-left'>
            { this.$slots.default }
          </div>
        </div>
      )
    } else {
      slot =
      <div class='eff-table__toobar' style={showBorder ? '' : 'border: unset'}>
        <div class='eff-table__toobar-left'>
          { this.$slots.default }
        </div>
        <div class='eff-table__toobar-right'>
          {
            showPager && <Paginator pageNum={pageNum} pageSize={pageSize} total={total} /> || ''
          }
        </div>
      </div>
    }

    return slot
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
