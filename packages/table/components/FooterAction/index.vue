<script>
import Paginator from './Paginator.js'
import ToolbarShrink from 'pk/toolbar-shrink'
import { renderer, getOn } from 'pk/utils/render'
import XEUtils from 'xe-utils'

export default {
  name: 'FooterAction',
  components: { Paginator, ToolbarShrink },
  inject: ['table'],
  data() {
    return {
      load: true
    }
  },
  methods: {
    btnClick(code, e, index) {
      this.load = false
      code && this.table.commitProxy(code)
      this.$nextTick(() => {
        this.load = true
      })
    }
  },
  render(h) {
    const { table, $slots, load } = this
    const { buttons = [], showPager, showBorder, changeOver } = table.footerActionConfig
    const { pageNum, pageSize, total } = table.pager
    const buttonsRender = load ? buttons.reduce((acc, cur, idx) => {
      const { code, on = {}} = cur
      const event = code ? getOn(on, { click: e => this.btnClick(code, e, idx) }) : on
      const merge = XEUtils.merge({}, cur, { props: { size: 'mini' }})
      const opts = Object.assign(merge, { on: event })
      const compConf = renderer.get('default')
      return compConf ? acc.concat(compConf.renderDefault(h, opts, { root: table, table, vue: this, columnIndex: idx })) : acc
    }, []) : ''
    const list = buttonsRender.concat($slots.default || []) || []
    const paginator = showPager && <Paginator pageNum={pageNum} pageSize={pageSize} total={total} /> || ''

    return <div class='eff-table__action eff-table__toobar' style={{ border: showBorder ? '' : 'unset', height: table.rowHeight + 'px' }}>
      {
        changeOver ? [
          <div class='eff-table__toobar-left'>
            {paginator}
          </div>,
          <ToolbarShrink list={list} class='eff-table__toobar-right' />

        ] : [
          <ToolbarShrink list={list} class='eff-table__toobar-left' />,
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
