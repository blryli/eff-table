import XEUtils from 'xe-utils'
export default {
  name: 'Subtotal',
  functional: true,
  inject: ['table'],
  render(h, context) {
    const { injections: { table }} = context
    const subtotal = function() {
      const { headerCheckedColumns, tableColumns } = table
      if (headerCheckedColumns.length) {
        const columns = [...tableColumns]
        columns.map(d => {
          if (headerCheckedColumns.some(h => h === d)) {
            d.order = 'asc'
          }
        })
        table.tableColumns = [...columns]
        table.sortChange(null, true).then(() => {
          const tableData = XEUtils.clone(table.tableData, true)
          if (tableData.length) {
            table.subtotalColumns = headerCheckedColumns.filter(column => {
              let isNumber = true
              tableData.slice(0, 2).forEach(d => {
                const { prop } = column
                if (prop && !XEUtils.toNumber(d[prop])) isNumber = false
              })
              return isNumber
            })
            const subtotalData = []
            table.subtotalColumns.forEach(column => {
              const { prop } = column
              let curNum = null
              let accumulation = 0
              tableData.forEach((d, i) => {
                const num = XEUtils.toNumber(d[prop])
                const prevNum = i > 0 ? accumulation / XEUtils.toNumber(tableData[i - 1][prop]) : 0
                const last = i === tableData.length - 1
                if (num) {
                  if (i === 0) {
                    accumulation = num
                    curNum = num
                  } else if (num !== curNum) {
                    subtotalData.push({ index: i - 1, len: prevNum, row: { [prop]: accumulation, subtotal: true }})
                    if (last) {
                      subtotalData.push({ index: i, len: 1, row: { [prop]: num, subtotal: true }})
                    }
                    accumulation = num
                    curNum = num
                  } else {
                    accumulation += num
                    if (last) {
                      subtotalData.push({ index: i, len: prevNum + 1, row: { [prop]: accumulation, subtotal: true }})
                    }
                  }
                }
              })
            })
            table.subtotalData = subtotalData
          }
          // const data = table.tableData
        })
      } else {
        table.$message.warning('请先选择列！')
      }
    }
    return h('icon', { props: { icon: 'subtotal' }, on: { click: subtotal }})
  }
}
