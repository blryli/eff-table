const checkedsSet = new Set()

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
      return this.selecteds.map(v => this.tableData[v])
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
      const { tableData, isSame, toggleSelection } = this
      const rowIndex = tableData.findIndex(d => isSame(d, row))
      if (rowIndex !== -1) {
        toggleSelection(rowIndex, checkedsSet.has(rowIndex), selected)
      } else {
        console.error('methods toggleRowSelection (row) is not find')
      }
    },
    toggleAllSelection() {
      this.selectionAll = !this.selectionAll
      this.allselectionChange(this.selectionAll)
    },
    rowSelectionChange(index, selected) {
      const { checkeds, tableData, toggleSelection, selectionChange } = this
      toggleSelection(index, !selected)
      this.$emit('select', checkeds, tableData[index])
      selectionChange()
    },
    allselectionChange(selected) {
      const { tableData, selectionChange } = this
      this.selectionAll = selected
      this.indeterminate = false
      selected ? tableData.forEach((d, i) => checkedsSet.add(i)) : checkedsSet.clear()
      selectionChange()
      this.$emit('select-all', this.checkeds)
    },
    isSame(obj1, obj2) {
      return JSON.stringify(obj1) === JSON.stringify(obj2)
    },
    toggleSelection(index, has, selected) {
      selected ? checkedsSet.add(index) : has ? checkedsSet.delete(index) : checkedsSet.add(index)
      this.selectionChange()
    },
    setCurrentRow(row) {
      const { tableData, isSame, selectionChange } = this
      const rowIndex = tableData.findIndex(d => isSame(d, row))
      checkedsSet.clear()
      if (rowIndex !== -1) {
        checkedsSet.add(rowIndex)
      }
      selectionChange()
    },
    selectionChange() {
      this.selecteds = [...checkedsSet]
    },
    isChecked(index) {
      return this.selecteds.includes(index)
    }
  }
}
