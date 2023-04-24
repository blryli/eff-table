import XEUtils from 'xe-utils'

export default {
  data() {
    return {
      treeIds: {}
    }
  },
  computed: {
    treeNum() {
      const {tableTreeConfig} = this
      if(!tableTreeConfig) return 0
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
      if(!this.tableTreeConfig) return
      if (!Array.isArray(data)) {
        console.error('setTreeExpandAll方法第一个参数必须是数组')
        return
      }
      const { tableTreeConfig: { children }, treeIds, rowId } = this
      data.forEach(d => {
        const child = d[children]
        this.$set(treeIds, d[rowId], expand)
        if (child && child.length) {
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
      if(!tableTreeConfig) return
      const { rowId, tableData, tableTreeConfig: { children }} = this
      const rowid = row[rowId]
      const getTree = XEUtils.findTree(tableData, item => item[rowId] === rowid, children)
      if (!getTree) return
      const { path } = getTree
      const len = path.length
      const resetFirstRow = (firstRow) => {
        if (firstRow && firstRow.conditionConnector) {
          Object.assign(firstRow, { conditionConnector: '' })
        }
        this.tableData = Object.freeze(this.tableData)
        this.$emit('data-change', { tableData: this.tableData })
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
