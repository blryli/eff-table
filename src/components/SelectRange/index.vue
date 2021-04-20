<template>
  <div v-if="status >= 2" :style="toolStyle" class="tool">

    <div v-if="status === 2" class="sight" @mousedown="sightMouseDown">
      <template v-if="selectCount == 1">
        <div class="vertical" />
        <div class="lineae" />
      </template>
    </div>
    <el-button v-if="status === 2" :type="copyBtnType" size="mini" class="copybtn" @click="onClickCopy">复制</el-button>
  </div>
</template>

<script>

// eslint-disable-next-line no-extend-native
String.prototype.trim = function() {
  return this.replace(/(^\s*)|(\s*$)/g, '')
}

export default {
  data() {
    return {
      textArr: {},
      textMap: {},
      status: 0,
      startPosition: { columnIndex: 0, rowIndex: 0 },
      endPosition: { columnIndex: 0, rowIndex: 0 },
      sightStartPosition: { columnIndex: 0, rowIndex: 0 },
      sightEndPosition: { columnIndex: 0, rowIndex: 0 },
      unit: {
        width: 0,
        height: 0
      },
      autoScrollIntervalId: null,
      borderStyle: 'solid',
      copyBtnType: 'primary',
      toolStyle: {},
      selectCount: 0
    }
  },
  computed: {
  },
  watch: {
    'table.scrollTop'(scrollTop, oldTop) {
      if (this.status === 1) {
        this.endPosition.y += scrollTop - oldTop
      }
      this.handleRect()
    }
  },
  inject: ['table'],
  mounted() {
    this.table.$on('table-mouse-up', this.selectRangeMouseUp)
    this.table.$on('cell-mouse-down', this.selectRangeMouseDown)
    this.table.$on('cell-mouse-move', this.selectRangeMouseMove)
    this.table.$on('copy', () => {
      if (this.status === 2) {
        this.borderStyle = 'dashed'
        this.handleRect()
      }
    })

    document.addEventListener('paste', this.onPaste, false)
  },
  destroyed() {
    clearInterval(this.autoScrollIntervalId)
    document.removeEventListener('paste', this.onPaste, false)
  },
  methods: {
    close() {
      this.status = 0
      this.handleSightRect()
    },
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
      if (this.selectCount !== 1) {
        return
      }
      this.status = 3
      this.sightStartPosition = { rowIndex: this.startPosition.rowIndex, columnIndex: this.startPosition.columnIndex }
      this.sightEndPosition = { rowIndex: this.startPosition.rowIndex, columnIndex: this.startPosition.columnIndex }
    },
    selectRangeMouseUp(e) {
      if (this.status === 0) {
        return
      }

      const map = this._getColumnMap()

      if (this.status === 3) {
        this.endPosition = this.sightEndPosition
        const content = map[this.sightStartPosition.rowIndex + '-' + this.sightStartPosition.columnIndex].$el.innerText

        const updateArr = this.handleUpdateData(content, 'sightStartPosition', 'sightEndPosition')
        this.table.$emit('edit-fileds', updateArr)
      }

      this.copyBtnType = 'primary'
      this.selectCount = this.startPosition.columnIndex === this.endPosition.columnIndex && this.startPosition.rowIndex === this.endPosition.rowIndex ? 1 : 2

      if (this.status === 1) {
        const { endRow, endColumn } = this._getReac()
        const endColumnModel = map[endRow + '-' + endColumn]
        if (endColumnModel) {
          const width = endColumnModel.$el.offsetWidth
          const height = endColumnModel.$el.offsetHeight
          const { top, left } = endColumnModel.$el.getBoundingClientRect()
          this.toolStyle = { top: top + height - 7 + 'px', left: left + width - 7 + 'px' }
        }

        this.status = 2
        this.table.$emit('select-range-data', this.textArr)
      }
      this.handleRect()

      this.status = 2
    },
    selectRangeMouseDown(e) {
      const { rowIndex, columnIndex, column } = e
      if (['expand', 'selection'].indexOf(column.type) !== -1) {
        return this.close()
      }
      this.borderStyle = 'solid'
      this.status = 1
      this.endPosition = { rowIndex: rowIndex, columnIndex: columnIndex }
      this.startPosition = { rowIndex: rowIndex, columnIndex: columnIndex }

      this.textMap = {}
      this.textArr = []

      this.handleRect()
      this.changeData()
    },
    selectRangeMouseMove(e) {
      const { rowIndex, columnIndex } = e
      if (this.status === 1) {
        this.endPosition = { rowIndex: rowIndex, columnIndex: columnIndex }

        this.handleRect()
        this.changeData()
      }

      if (this.status === 3) {
        this.sightEndPosition = { rowIndex: rowIndex, columnIndex: columnIndex }

        const { endRow, endColumn } = this._getReac('sightStartPosition', 'sightEndPosition')
        const map = this._getColumnMap()
        const endColumnModel = map[endRow + '-' + endColumn]

        if (endColumnModel) {
          const width = endColumnModel.$el.offsetWidth
          const height = endColumnModel.$el.offsetHeight
          const { top, left } = endColumnModel.$el.getBoundingClientRect()
          this.toolStyle = { top: top + height - 7 + 'px', left: left + width - 7 + 'px' }
        }

        this.handleSightRect()
      }
    },
    handleSightRect() {
      const { startRow, endRow, startColumn, endColumn } = this._getReac('sightStartPosition', 'sightEndPosition')

      const map = this._getColumnMap()

      for (let i = startRow; i <= endRow; i++) {
        for (let j = startColumn; j <= endColumn; j++) {
          const column = map[i + '-' + j]
          const style = {}

          if (j === startColumn) {
            style.borderLeft = this.status === 0 ? `unset` : `2px ${this.borderStyle} rgb(17 210 232)`
          }

          if (j === endColumn) {
            style.borderRight = this.status === 0 ? `unset` : `2px ${this.borderStyle} rgb(17 210 232)`
          }

          if (i === startRow) {
            style.borderRight = this.status === 0 ? `unset` : `2px ${this.borderStyle} rgb(17 210 232)`
          }

          if (i === endRow) {
            style.borderBottom = this.status === 0 ? `unset` : `2px ${this.borderStyle} rgb(17 210 232)`
          }

          if (column) {
            column.style = style
            // this.textMap[i + '-' + j] = column.text
          }
        }
      }
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
            this.textMap[i + '-' + j] = column.$el.innerText
          }
        }
      }
    },
    onPaste(e) {
      if (this.status !== 2) {
        return true
      }

      const { startRow, startColumn, endRow, endColumn } = this._getReac()

      let data = e.clipboardData.getData('text/plain')

      const updateArr = []
      data = data.trim().split('\r\n')
      data = data.map((v, k) => {
        let columnList

        if (v.indexOf('\t ') !== -1) {
          columnList = v.split('\t ')
        } else {
          columnList = v.split('\t')
        }

        columnList.forEach((vv, kk) => {
          updateArr.push({ rowIndex: k + startRow, columnIndex: kk + startColumn, content: vv })
        })
      })

      this.table.$emit('edit-fileds', updateArr)
    },
    handleUpdateData(content, startKey = 'startPosition', endKey = 'endPosition') {
      const updateArr = []
      const { startRow, startColumn, endRow, endColumn } = this._getReac(startKey, endKey)
      for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
        for (let columnIndex = startColumn; columnIndex <= endColumn; columnIndex++) {
          updateArr.push({ rowIndex, columnIndex, content })
        }
      }

      return updateArr
    },
    _getReac(startKey = 'startPosition', endKey = 'endPosition') {
      const startRow = this[endKey].rowIndex > this[startKey].rowIndex ? this[startKey].rowIndex : this[endKey].rowIndex
      const endRow = this[endKey].rowIndex < this[startKey].rowIndex ? this[startKey].rowIndex : this[endKey].rowIndex

      const startColumn = this[endKey].columnIndex > this[startKey].columnIndex ? this[startKey].columnIndex : this[endKey].columnIndex
      const endColumn = this[endKey].columnIndex < this[startKey].columnIndex ? this[startKey].columnIndex : this[endKey].columnIndex

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
    }
  }
}
</script>

<style lang="scss" scoped>
.tool {
  position: fixed;
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
