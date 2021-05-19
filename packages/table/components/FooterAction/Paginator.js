import { renderer } from 'pk/utils/render'

export default {
  name: 'Paginator',
  inject: ['table'],
  props: [
    'pageNum',
    'pageSize',
    'total'
  ],
  methods: {
    onSizeChange(e) {
      console.log(e)
      this.table.pager.pageNum = 1
      this.table.pager.pageSize = e
      this.table.commitProxy('query')
      this.table.$emit('table-page-num-change', { pageSize: e })
    },
    onCurrentChange(e) {
      this.table.pager.pageNum = e
      this.table.commitProxy('query')
      this.table.$emit('table-page-size-change', { pageNum: e })
    }
  },
  render(h) {
    const render = renderer.get('default').renderDefault

    return render(h, {
      props: Object.assign({}, {
        currentPage: this.pageNum,
        pageSizes: [10, 50, 100, 200, 300, 400],
        'page-size': this.pageSize,
        layout: 'total, sizes, prev, pager, next, jumper',
        total: this.total,
        pagerCount: 5
      }, this.table.footerActionConfig.pageConfig),
      on: {
        'size-change': this.onSizeChange,
        'current-change': this.onCurrentChange
      },
      name: 'pagination'
    }, { table: this.table })
  }
}
