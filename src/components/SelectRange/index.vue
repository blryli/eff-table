<template> </template>

<script>
export default {
  data() {
    return {
      textArr: {},
      textMap: {},
      status: 0,
      startPosition: {columnIndex: 0, rowIndex: 0},
      endPosition: {columnIndex: 0, rowIndex: 0},
      unit: {
        width: 0,
        height: 0,
      },
      autoScrollIntervalId: null,
      borderStyle: "solid"
    }
  },
  computed: {
  },
  watch: {
    'table.scrollTop'(scrollTop, oldTop) {
      this.handleRect()
      if (this.status != 1) {
        return 
      }
      
      this.endPosition.y += scrollTop - oldTop
    },
  },
  inject: ["table"],
  methods: {
    changeData() {
      this.textArr = []
      let {startRow, endRow, startColumn, endColumn} = this._getReac()

      let index = 0

      for (let i = startRow; i <= endRow; i++) {
        this.textArr.push([])
        for (let j = startColumn; j <= endColumn; j++) {
          this.textArr[index].push(this.textMap[i+'-'+j])
        }
        index++
      }
    },
    selectRangeMouseEnter(e) {
      if (this.status != 1) {
        return 
      }
    },
    selectRangeMouseLeave(e) {
      if (this.status != 1) {
        return 
      }
    },
    selectRangeMouseUp(e) {
      this.status = 2
      this.table.$emit("select-range-data", this.textArr)
    },
    selectRangeMouseDown(e) {
      this.borderStyle = "solid"
      this.status = 1
      const {cell,rowIndex ,columnIndex} = e
      const column = cell.parentNode
      const row = column.parentNode

      this.endPosition = {rowIndex: rowIndex, columnIndex: columnIndex}
      this.startPosition = {rowIndex: rowIndex, columnIndex: columnIndex}
      
      this.textMap = {}
      this.textArr = []
      
      this.handleRect()
      this.changeData()
    },
    selectRangeMouseMove(e) {
      if (this.status != 1) {
        return 
      }
      const {cell,rowIndex ,columnIndex} = e
      this.endPosition = {rowIndex: rowIndex, columnIndex: columnIndex}
     
      this.handleRect()
      this.changeData()
    },
    _getReac() {
      let startRow = this.endPosition.rowIndex > this.startPosition.rowIndex ? this.startPosition.rowIndex : this.endPosition.rowIndex
      let endRow = this.endPosition.rowIndex < this.startPosition.rowIndex ? this.startPosition.rowIndex : this.endPosition.rowIndex

      let startColumn = this.endPosition.columnIndex > this.startPosition.columnIndex ? this.startPosition.columnIndex : this.endPosition.columnIndex
      let endColumn = this.endPosition.columnIndex < this.startPosition.columnIndex ? this.startPosition.columnIndex : this.endPosition.columnIndex

      return {startRow, endRow, startColumn, endColumn}
    },
    handleRect() {
      let {startRow, endRow, startColumn, endColumn} = this._getReac()

      let rows = this.table.$refs.body.$children
      let map = {}
      rows.forEach(v => {
        v.$children.forEach(vv => {
          map[vv.rowIndex+"-"+vv.columnIndex] = vv
          vv.style = {}
        })
      })

      for (let i = startRow; i <= endRow; i++) {
        for (let j = startColumn; j <= endColumn; j++) {
          let column = map[i+"-"+j]
          let style = {}

          if (j == startColumn) {
            style.borderLeft = `2px ${this.borderStyle} #1177e8`
          }

          if (j == endColumn) {
            style.borderRight = `2px ${this.borderStyle} #1177e8`
          }

          if (i == startRow) {
            style.borderTop = `2px ${this.borderStyle} #1177e8`
          }

          if (i == endRow) {
            style.borderBottom = `2px ${this.borderStyle} #1177e8`
          }

          if (column) {
            column.style = style
            this.textMap[i+'-'+j] = column.text
          }
        }
      }
    },
    onPaste(e) {
      if (this.status != 2) {
        return true
      }

      let {startRow, startColumn} = this._getReac()

      let data = e.clipboardData.getData('text/plain')
      data = data.split("\n")
      data = data.map(v => {
        if (v.indexOf("\t ") != -1) {
          return v.split("\t ")
        }

        return v.split("\t")
      })

      let postData = {startRow, startColumn, data}
      this.table.$emit("table-paste", postData)
    }
  },
  mounted() {
      this.table.$on("table-mouse-up", this.selectRangeMouseUp)
      this.table.$on("cell-mouse-down", this.selectRangeMouseDown)
      this.table.$on("cell-mouse-move", this.selectRangeMouseMove)
      this.table.$on("table-mouse-enter", this.selectRangeMouseEnter)
      this.table.$on("table-mouse-leave", this.selectRangeMouseLeave)
      this.table.$on("copy", () => {
        if (this.status != 2) {
          return 
        }
        this.borderStyle = "dashed"
        this.handleRect()
      })

    document.addEventListener('paste', this.onPaste, false)

  },
  destroyed() {
    clearInterval(this.autoScrollIntervalId)
    document.removeEventListener("paste", this.onPaste, false)
  }
}
</script>
