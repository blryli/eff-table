import XEUtils from 'xe-utils'
let checkedsSet = new Set()

export default {
  data() {
    return {
      selecteds: [],
      selectionAll: false,
      indeterminate: false,
      isCopyFunc: false
    }
  },
  computed: {
    checkeds() {
      const { tableDataMap, selecteds } = this
      return selecteds.map(id => {
        const mapId = tableDataMap.get(id)
        if (!mapId) {
          console.warn(id + ' 不存在于tableData')
        }
        return mapId
      }).filter(d => d)
    }
  },
  watch: {
    selecteds() {
      const { checkeds, selecteds } = this
      this.updateSelecteds()
      this.$emit('selection-change', checkeds, selecteds)
    },
    tableData() {
      this.updateSelecteds()
      this.dataChange()
    }
  },
  methods: {
    updateSelecteds() {
      const { selecteds, tableData } = this
      const selectedsLength = selecteds.length
      const tableDataLength = tableData.length
      this.selectionAll = Boolean(selectedsLength) && selectedsLength === tableDataLength
      this.indeterminate = Boolean(selectedsLength && selectedsLength < tableDataLength)
    },
    copyFromChecked() {
      this.isCopyFunc = true
      document.execCommand('copy')
    },
    getCheckRows() {
      return XEUtils.clone(this.checkeds, true)
    },
    clearSelection() {
      checkedsSet.clear()
      this.selectionChange()
    },
    toggleRowSelection(row, selected) {
      const { tableDataMap, rowId, toggleSelection } = this
      const id = row[rowId]
      if (tableDataMap.has(id)) {
        toggleSelection(row, checkedsSet.has(id), selected)
      } else {
        console.error('methods toggleRowSelection (row) is not find')
      }
    },
    toggleAllSelection() {
      this.selectionAll = !this.selectionAll
      this.allselectionChange(this.selectionAll)
    },
    rowSelectionChange(row, selected, isRadio = false) {
      const { checkeds, tableDataMap, rowId, toggleSelection, selectionChange } = this
      const id = row[rowId]
      if (isRadio) {
        checkedsSet.clear()
      }
      toggleSelection(row, !selected)
      this.$emit('select', checkeds, tableDataMap.get(id))
      selectionChange()
    },
    allselectionChange(selected) {
      const { tableDataMap, selectionChange } = this
      this.selectionAll = selected
      this.indeterminate = false
      selected ? checkedsSet = new Set([...tableDataMap.keys()]) : checkedsSet.clear()
      selectionChange()
      this.$emit('select-all', this.checkeds)
    },
    toggleSelection(row, has, selected) {
      const id = row[this.rowId]
      selected ? checkedsSet.add(id) : has ? checkedsSet.delete(id) : checkedsSet.add(id)

      this.selectionChange()
    },
    setCurrentRow(row) {
      const { tableDataMap, rowId, selectionChange } = this
      const id = row[rowId]
      checkedsSet.clear()
      if (tableDataMap.has(id)) {
        checkedsSet.add(id)
      }

      selectionChange()
    },
    selectionChange() {
      this.selecteds = [...checkedsSet]
      this.$forceUpdate()
    },
    isChecked(row) {
      const { selecteds, rowId } = this
      return selecteds.includes(row[rowId])
    }
  }
}
