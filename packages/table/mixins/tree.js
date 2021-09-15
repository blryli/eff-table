import XEUtils from 'xe-utils'

export default {
  data() {
    return {
      treeIds: {}
    }
  },
  computed: {
    treeNum() {
      const { tableData, rowId, treeIds, tableTreeConfig: { children } = {}} = this

      let num = 0
      const closeIds = []
      for (const rowid in treeIds) {
        const value = treeIds[rowid]
        if (value) {
          const { item: row } = XEUtils.findTree(tableData, item => `${item[rowId]}` === `${rowid}`, children)
          if (row && !closeIds.find(d => rowid.startsWith(d)) && row[children]) {
            num += row[children].length
          }
        } else {
          closeIds.push(rowid)
        }
      }
      return num
    }
  },
  methods: {
    setTreeExpand(rowid) {
      this.$set(this.treeIds, rowid, true)
    },
    setTreeExpandAll(data, expand) {
      if (!Array.isArray(data)) {
        console.error('setTreeExpandAll方法第一个参数必须是数组')
        return
      }
      const { tableTreeConfig: { children }, treeIds, rowId } = this
      data.forEach(d => {
        const child = d[children]
        if (child && child.length) {
          this.$set(treeIds, d[rowId], expand)
          this.setTreeExpandAll(child, expand)
        }
      })
    },
    treeExpandAll() {
      this.setTreeExpandAll(this.tableData || [], true)
    },
    clearTreeExpand() {
      this.setTreeExpandAll(this.tableData || [], false)
    },
    removeTreeExpand(row) {
      const { rowId, tableData, tableTreeConfig: { children }} = this
      const rowid = row[rowId]
      const { path } = XEUtils.findTree(tableData, item => item[rowId] === rowid, children)
      const len = path.length
      const resetFirstRow = (firstRow) => {
        if (firstRow && firstRow.conditionConnector) {
          Object.assign(firstRow, { conditionConnector: '' })
        }
        this.tableData = Object.freeze(this.tableData)
      }
      if (len === 1) {
        delete this.treeIds[rowid]
        this.remove(row).then(() => {
          resetFirstRow(this.tableData[0])
        })
      } else {
        path.reduce((acc, cur, idx) => {
          if (idx === path.length - 1) {
            delete this.treeIds[rowid]
            acc.splice(cur, 1)
            resetFirstRow(acc[0])

            return acc
          }
          return acc[cur]
        }, tableData)
      }
    }
  }
}
