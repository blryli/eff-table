import { renderer } from 'core/render'

export default {
  name: 'Paginator',
  inject: ['table'],
  props: [
    'pageNum',
    'pageSize',
    'total'
  ],
  watch: {
    'table.pager': {
      handler() {
        this.render()
      },
      deep: true
    }
  },
  methods: {
    onSizeChange(e) {
      this.table.pager.pageNum = e
      this.table.query(this.table.proxyConfig.request.query)
      this.table.commitProxy('query')
      this.table.$emit('table-page-num-change', { pageSize: e })
    },
    onCurrentChange(e) {
      this.table.pager.pageNum = 1
      this.table.pager.pageSize = e
      this.table.commitProxy('query')
      this.table.$emit('table-page-size-change', { pageNum: e })
    }
  },
  render(h) {
    console.log(123123123123, this.table.pager, this.table.pager.total)
    if (!this.total) {
      return ''
    }

    const render = renderer.get('default').renderDefault

    return render(h, {
      props: {
        currentPage: this.pageNum,
        pageSizes: [10, 50, 100, 200, 300, 400],
        'page-size': this.pageSize,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: this.total,
        pagerCount: 5
      },
      on: {
        'size-change': this.onSizeChange,
        'current-change': this.onCurrentChange
      },
      name: 'pagination'
    }, { table: this.table })
  }
}
