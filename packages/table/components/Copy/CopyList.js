import XEUtils from 'xe-utils'
import { renderer } from 'pk/utils/render'
import { getFieldValue, isVNode } from 'pk/utils'

export default {
  name: 'CopyList',
  props: { contextual: { type: Object, default: () => {} }},
  functional: true,
  render(h, context) {
    const { props } = context
    const { table, tableData, tableColumns = [], selectRengeStore = {}, vue } = props.contextual
    const { startRow = -1, endRow = -1, startColumn = -1, endColumn = -1 } = selectRengeStore
    // console.log({ tableData, tableColumns, selectRengeStore })
    if (!tableData.length || !tableColumns.length || startRow === -1) return ''
    const cellRender = function({ row, rowIndex, column, columnIndex }) {
      const { cellRender, prop, config = {}, type, edit: { render } = {}} = column
      const renderCell = (cellRender) => {
        // 处理动态渲染器
        const dynamicConfig = {}
        if (XEUtils.isFunction(render)) {
          const renderFunc = render(h, { row, sourceRow, rowIndex, column, columnIndex, prop })
          if (!isVNode(renderFunc)) {
            Object.assign(dynamicConfig, renderFunc)
          }
        }
        const renderOpts = XEUtils.merge({}, config, dynamicConfig, cellRender)
        const { name, tag, format } = renderOpts
        const compConf = renderer.get(dynamicConfig.name || name) || tag && renderer.get('default')
        const sourceRow = table.tableSourceData[rowIndex]
        const params = { root: table, table, vue, data: row, row, sourceRow, rowIndex, column, columnIndex, prop: dynamicConfig.prop || prop, renderCell: true }
        // 处理format
        if (XEUtils.isFunction(format)) {
          return format(params)
        }
        return compConf ? compConf.renderDefault(h, renderOpts, params) : type === 'index' ? rowIndex + 1 : prop ? getFieldValue(row, prop) : ''
      }
      if (XEUtils.isFunction(cellRender)) {
        const cellRenderFunc = cellRender(h, { row, rowIndex, column, columnIndex, prop })
        return isVNode(cellRenderFunc) ? (cellRenderFunc || '') : XEUtils.isObject(cellRenderFunc) ? renderCell(cellRenderFunc) : cellRenderFunc
      } else {
        return renderCell(cellRender)
      }
    }
    const nodes = []
    const startIndex = 0
    for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
      const row = tableData[rowIndex]
      const insertIndex = rowIndex - startIndex
      if (!nodes[insertIndex]) nodes[insertIndex] = []
      for (let columnIndex = startColumn; columnIndex <= endColumn; columnIndex++) {
        const column = tableColumns[columnIndex]
        const cRender = cellRender({ row, rowIndex, column, columnIndex })
        nodes[insertIndex].push(XEUtils.isString(cRender) ? cRender : '')
      }
    }
    // console.log(nodes)
    table.$emit('select-range-data', [...nodes])

    return <div class='eff-table--copy'>
      {nodes}
    </div>
  }
}
