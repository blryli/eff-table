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
    const { pageNum, pageSize, total, table } = this
    const { footerActionConfig: { pageConfig = {}} = {}} = table
    const props = Object.assign({
      pageSizes: [10, 50, 100, 200, 300, 400],
      layout: 'sizes,prev,pager,next,jumper,total',
      pagerCount: 5
    }, pageConfig, { currentPage: pageNum, pageSize, total })

    return render(h, {
      props,
      on: {
        'size-change': this.onSizeChange,
        'current-change': this.onCurrentChange
      },
      name: 'pagination'
    }, { table: this.table })
  }
}
