let checkedsSet = new Set()

export default {
  data() {
    return {
      selecteds: [],
      selectionAll: false,
      indeterminate: false
    }
  },
  computed: {
    checkeds() {
      const { tableDataMap, selecteds } = this
      return selecteds.map(id => tableDataMap.get(id))
    }
  },
  watch: {
    selecteds() {
      const { checkeds, selecteds, tableData } = this
      this.$emit('selection-change', checkeds, selecteds)
      const selectedsLength = selecteds.length
      const tableDataLength = tableData.length
      this.selectionAll = Boolean(selectedsLength) && selectedsLength === tableDataLength
      this.indeterminate = Boolean(selectedsLength && selectedsLength < tableDataLength)
    }
  },
  methods: {
    getCheckRows() {
      return this.checkeds
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
    rowSelectionChange(row, selected) {
      const { checkeds, tableDataMap, rowId, toggleSelection, selectionChange } = this
      const id = row[rowId]
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
    },
    isChecked(row) {
      const { rowId } = this
      return checkedsSet.has(row[rowId])
    }
  }
}
