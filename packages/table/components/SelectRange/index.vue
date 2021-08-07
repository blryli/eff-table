<template>
  <div v-if="status >= 2" :style="toolStyle" class="tool">

    <div v-if="status === 2" class="sight" @mousedown="sightMouseDown">
      <template v-if="selectCount == 1">
        <div class="vertical" />
        <div class="lineae" />
      </template>
    </div>
    <div class="flex flex-direction">
      <div v-if="status === 2" class="copy" :class="copyBtnType" title="复制" @click.stop="onClickCopy">
        <div class="before">
          <div />
          <div />
        </div>
        <div class="after" />
      </div>
    </div>

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
      startPosition: { columnIndex: -1, rowIndex: -1 },
      endPosition: { columnIndex: -1, rowIndex: -1 },
      sightStartPosition: { columnIndex: -1, rowIndex: -1 },
      sightEndPosition: { columnIndex: -1, rowIndex: -1 },
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
      this.$set(this.toolStyle, 'display', 'none')
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

    document.addEventListener('scroll', () => {
      this.$set(this.toolStyle, 'display', 'none')
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
      this.handleRect(true, true)
      this.handleRect(false, true)
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

      const { endRow, endColumn } = this._getReac()
      const query = `.eff-table__body-row[data-rowid="${endRow + 1}"] .eff-table__column[data-colid="${(endRow + 1) + '-' + (endColumn + 1)}"]`
      const endColumnModel = this.table.$refs.body.$el.querySelector(query)
      if (this.status === 3) {
        this.endPosition = this.sightEndPosition
        const content = endColumnModel.innerText

        const updateArr = this.handleUpdateData(content, 'sightStartPosition', 'sightEndPosition')
        this.table.$emit('edit-fields', updateArr)
      }

      this.copyBtnType = 'primary'
      this.selectCount = this.startPosition.columnIndex === this.endPosition.columnIndex && this.startPosition.rowIndex === this.endPosition.rowIndex ? 1 : 2

      if (this.status === 1) {
        if (endColumnModel) {
          const { top, left, width, height } = endColumnModel.getBoundingClientRect()
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
        const node = `.eff-table__body-row[data-rowid="${endRow + 1}"] .eff-table__column[data-colid="${(endRow + 1) + '-' + (endColumn + 1)}"]`
        const endColumnModel = this.table.$refs.body.$el.querySelector(node)
        if (endColumnModel) {
          const { top, left, width, height } = endColumnModel.getBoundingClientRect()
          this.toolStyle = { top: top + height - 7 + 'px', left: left + width - 7 + 'px' }
        }

        this.handleRect(true)
      }
    },
    handleRect(sight = false, close = false) {
      let res

      if (sight) {
        res = this._getReac('sightStartPosition', 'sightEndPosition')
      } else {
        res = this._getReac()
      }

      if (close) {
        this.startPosition = { columnIndex: -1, rowIndex: -1 }
        this.endPosition = { columnIndex: -1, rowIndex: -1 }
        this.sightStartPosition = { columnIndex: -1, rowIndex: -1 }
        this.sightEndPosition = { columnIndex: -1, rowIndex: -1 }
      }

      const { startRow, endRow, startColumn, endColumn } = res

      const map = this._getColumnMap()

      for (let i = startRow; i <= endRow; i++) {
        for (let j = startColumn; j <= endColumn; j++) {
          const column = map[i + '-' + j]

          if (column) {
            if (!sight) {
              this.textMap[i + '-' + j] = column.$el.innerText
            }
          }
        }
      }
    },
    closeReac() {

    },
    onPaste(e) {
      if (this.status !== 2) {
        return true
      }

      this.table.$refs.edit && this.table.$refs.edit.close()
      const { startRow, startColumn } = this._getReac()

      const updateArr = []
      const data = e.clipboardData.getData('text/plain').trim().split('\r\n')
      data.map((v, k) => {
        let columnList

        if (v.indexOf('\t ') !== -1) {
          columnList = v.split('\t ')
        } else {
          columnList = v.split('\t')
        }

        columnList.forEach((vv, kk) => {
          updateArr.push({ row: this.table.tableData[k + startRow], rowIndex: k + startRow, columnIndex: kk + startColumn, content: vv })
        })
      })

      this.table.$emit('edit-fields', updateArr)
    },
    handleUpdateData(content, startKey = 'startPosition', endKey = 'endPosition') {
      const updateArr = []
      const { startRow, startColumn, endRow, endColumn } = this._getReac(startKey, endKey)
      for (let rowIndex = startRow; rowIndex <= endRow; rowIndex++) {
        for (let columnIndex = startColumn; columnIndex <= endColumn; columnIndex++) {
          updateArr.push({ row: this.tableData[rowIndex], rowIndex, columnIndex, content })
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
    margin-bottom: 10px;
  }

  .pastebtn {
    margin-left: 0px;
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
      width: 2px;
      height: 10px;
      border-top: 1px solid white;
      border-bottom: 1px solid white;
    }

    .lineae {
      width: 10px;
      height: 2px;
      margin-top: -1px;
      border-left: 1px solid white;
      border-right: 1px solid white;
    }
  }

  .flex {
    margin-left: -4px;
    margin-top: -35px;
    display: flex;
    position: absolute;
    bottom: -25px;
    right: 0px;
  }

  .flex-direction {
    flex-direction: column;
  }

  .copy {
    width: 32px;
    height: 32px;
    transform: scale(0.5);

    :hover {
      cursor: pointer;
    }
    .before {
      border: 3px solid rgb(17, 119, 232);
      position: absolute;
      top: 7px;
      left: 0;
      width: 22px;
      height: 22px;
      background-color: white;
      z-index: 3;
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-direction: column;

      div {
        width: 12px;
        height: 3px;
        background-color: rgb(17, 119, 232);
      }
    }

    .after {
      position: absolute;
      border: 3px solid rgb(17, 119, 232);
      width: 20px;
      height: 24px;
      left: 10px;
      z-index: 2;
      background-color: white;
    }
  }

  .success {
    .after {
      border: 3px solid #67c23a;
    }

    .before {
      border: 3px solid #67c23a;
      position: absolute;
      top: 7px;
      left: 0;
      width: 22px;
      height: 22px;
      background-color: white;
      z-index: 3;
      display: flex;
      justify-content: space-around;
      align-items: center;
      flex-direction: column;

      div {
        width: 12px;
        height: 3px;
        background-color: #67c23a;
      }
    }
  }
}
</style>
