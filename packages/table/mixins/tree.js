import { getTreeRow } from 'pk/utils'
export default {
  data() {
    return {
      treeIds: {}
    }
  },
  computed: {
    treeNum() {
      // console.log()
      const { tableData, rowId, treeIds, treeConfig } = this
      const { children = 'children' } = treeConfig

      let num = 0
      const closeIds = []
      for (const key in treeIds) {
        const value = treeIds[key]
        if (value) {
          const { row, childRow } = getTreeRow(key, children, tableData, rowId)
          if (!closeIds.find(d => key.startsWith(d))) {
            if (childRow) {
              num += childRow[children].length
            } else {
              num += row[children].length
            }
          }
        } else {
          closeIds.push(key)
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
      const { treeConfig, treeIds, rowId } = this
      const { children = 'children' } = treeConfig
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
    }
  }
}
