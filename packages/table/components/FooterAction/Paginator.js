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
    onSizeChange(pageSize) {
      this.table.pager.pageNum = 1
      this.table.pager.pageSize = pageSize
      this.table.commitProxy('query')
      this.table.$emit('table-page-num-change', { pageSize })
    },
    onCurrentChange(pageNum) {
      this.table.pager.pageNum = pageNum
      this.table.commitProxy('query')
      this.table.$emit('table-page-size-change', { pageNum })
    }
  },
  render(h) {
    const render = renderer.get('default').renderDefault
    const { pageNum, pageSize, total, table } = this
    const { tableFooterConfig: { pageConfig = {}} = {}} = table
    const props = Object.assign({
      pageSizes: [10, 50, 100, 200, 300, 400],
      layout: 'total,prev,pager,next,sizes,jumper',
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
