<template>
  <div v-if="status >= 2" :style="toolStyle" class="tool">

    <div class="sight">
      <div class="vertical" />
      <div class="lineae" />
    </div>
    <el-button :type="copyBtnType" size="mini" class="copybtn" @click="onClickCopy">复制</el-button>
  </div>
</template>

<script>

export default {
  data() {
    return {
      textArr: {},
      textMap: {},
      status: 0,
      startPosition: { columnIndex: 0, rowIndex: 0 },
      endPosition: { columnIndex: 0, rowIndex: 0 },
      unit: {
        width: 0,
        height: 0
      },
      autoScrollIntervalId: null,
      borderStyle: 'solid',
      copyBtnType: 'primary',
      toolStyle: {}
    }
  },
  computed: {
  },
  watch: {
    'table.scrollTop'(scrollTop, oldTop) {
      this.handleRect()
      if (this.status !== 1) {
        return
      }

      this.endPosition.y += scrollTop - oldTop
    }
  },
  inject: ['table'],
  mounted() {
    this.table.$on('table-mouse-up', this.selectRangeMouseUp)
    this.table.$on('cell-mouse-down', this.selectRangeMouseDown)
    this.table.$on('cell-mouse-move', this.selectRangeMouseMove)
    this.table.$on('table-mouse-enter', this.selectRangeMouseEnter)
    this.table.$on('table-mouse-leave', this.selectRangeMouseLeave)
    this.table.$on('copy', () => {
      if (this.status !== 2) {
        return
      }
      this.borderStyle = 'dashed'
      this.handleRect()
    })

    document.addEventListener('paste', this.onPaste, false)
  },
  destroyed() {
    clearInterval(this.autoScrollIntervalId)
    document.removeEventListener('paste', this.onPaste, false)
  },
  methods: {
    onClickCopy() {
      this.copyBtnType = 'success'
      document.execCommand('copy')
    },
    changeData() {
      this.textArr = []
      const { startRow, endRow, startColumn, endColumn } = this._getReac()

      let index = 0

      for (let i = startRow; i <= endRow; i++) {
        this.textArr.push([])
        for (let j = startColumn; j <= endColumn; j++) {
          this.textArr[index].push(this.textMap[i + '-' + j])
        }
        index++
      }
    },
    sightMouseDown() {

    },
    sightMouseUp() {

    },
    sightMouseMove() {

    },
    selectRangeMouseUp(e) {
      const { endRow, endColumn } = this._getReac()
      const map = this._getColumnMap()
      const endColumnModel = map[endRow + '-' + endColumn]

      if (endColumnModel) {
        const columnEl = endColumnModel ? endColumnModel.$el : null
        const rowEl = columnEl.parentElement
        const offsetLeft = columnEl.offsetLeft + columnEl.offsetWidth
        const offsetTop = rowEl.offsetTop + columnEl.offsetHeight * 2

        this.toolStyle = { top: offsetTop - 7 + 'px', left: offsetLeft - 7 + 'px' }
        console.log(offsetLeft, offsetTop, this.toolStyle, columnEl.style.height.replace('px', ''))
      }

      if (this.status < 2) {
        this.copyBtnType = 'primary'
      }
      this.status = 2
      this.handleRect()
      this.table.$emit('select-range-data', this.textArr)
    },
    selectRangeMouseDown(e) {
      this.borderStyle = 'solid'
      this.status = 1
      const { rowIndex, columnIndex } = e

      this.endPosition = { rowIndex: rowIndex, columnIndex: columnIndex }
      this.startPosition = { rowIndex: rowIndex, columnIndex: columnIndex }

      this.textMap = {}
      this.textArr = []

      this.handleRect()
      this.changeData()
    },
    selectRangeMouseMove(e) {
      if (this.status !== 1) {
        return
      }
      const { rowIndex, columnIndex } = e
      this.endPosition = { rowIndex: rowIndex, columnIndex: columnIndex }

      this.handleRect()
      this.changeData()
    },
    _getReac() {
      const startRow = this.endPosition.rowIndex > this.startPosition.rowIndex ? this.startPosition.rowIndex : this.endPosition.rowIndex
      const endRow = this.endPosition.rowIndex < this.startPosition.rowIndex ? this.startPosition.rowIndex : this.endPosition.rowIndex

      const startColumn = this.endPosition.columnIndex > this.startPosition.columnIndex ? this.startPosition.columnIndex : this.endPosition.columnIndex
      const endColumn = this.endPosition.columnIndex < this.startPosition.columnIndex ? this.startPosition.columnIndex : this.endPosition.columnIndex

      return { startRow, endRow, startColumn, endColumn }
    },
    _getColumnMap() {
      const rows = this.table.$refs.body.$children

      const map = {}
      rows.forEach(v => {
        v.$children.forEach(vv => {
          map[vv.rowIndex + '-' + vv.columnIndex] = vv
          vv.style = {}
        })
      })

      return map
    },
    handleRect() {
      const { startRow, endRow, startColumn, endColumn } = this._getReac()

      const map = this._getColumnMap()

      for (let i = startRow; i <= endRow; i++) {
        for (let j = startColumn; j <= endColumn; j++) {
          const column = map[i + '-' + j]
          const style = {}

          if (j === startColumn) {
            style.borderLeft = `2px ${this.borderStyle} #1177e8`
          }

          if (j === endColumn) {
            style.borderRight = `2px ${this.borderStyle} #1177e8`
          }

          if (i === startRow) {
            style.borderTop = `2px ${this.borderStyle} #1177e8`
          }

          if (i === endRow) {
            style.borderBottom = `2px ${this.borderStyle} #1177e8`
          }

          if (column) {
            column.style = style
            this.textMap[i + '-' + j] = column.text
          }
        }
      }
    },
    onPaste(e) {
      if (this.status !== 2) {
        return true
      }

      const { startRow, startColumn } = this._getReac()

      let data = e.clipboardData.getData('text/plain')
      data = data.split('\n')
      data = data.map(v => {
        if (v.indexOf('\t ') !== -1) {
          return v.split('\t ')
        }

        return v.split('\t')
      })

      const postData = { startRow, startColumn, data }
      this.table.$emit('table-paste', postData)
    }
  }
}
</script>

<style lang="scss" scoped>
.tool {
  position: absolute;
  display: flex;
  .copybtn {
    margin-left: 10px;
  }
  .sight {
    width: 14px;
    height: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: crosshair;
    div {
      background-color: rgb(17, 119, 232);
      position: absolute;
      border-radius: 4px;
    }
    .vertical {
      width: 4px;
      height: 14px;
    }

    .lineae {
      width: 14px;
      height: 4px;
      margin-top: -1px;
    }
  }
}
</style>
