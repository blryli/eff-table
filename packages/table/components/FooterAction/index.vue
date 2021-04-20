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
    const { showPaginator } = table
    const { pageNum, pageSize, total } = table.pager
    return (
      <div class='eff-table__toobar'>
        <div class='eff-table__toobar-left'>
          { this.$slots.default }
        </div>
        <div class='eff-table__toobar-right'>
          {
            showPaginator && <Paginator pageNum={pageNum} pageSize={pageSize} total={total} /> || ''
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
