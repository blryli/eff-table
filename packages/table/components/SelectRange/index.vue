<template>
  <div v-if="['copyUp', 'batchCopuDown'].some( d=> d === handleType)" :style="toolStyle" class="tool">
    <div
      v-if="handleType === 'copyUp'"
      class="sight"
      @mousedown="batchCopyMouseDown"
      @mouseup="batchCopyMouseUp"
    />
    <div class="flex flex-direction">
      <div
        v-if="handleType === 'copyUp'"
        :class="['copy', copyBtnType]"
        title="复制"
        @click.stop="onClickCopy"
      >
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
import { getFieldValue, setFieldValue } from 'pk/utils'

// eslint-disable-next-line no-extend-native
String.prototype.trim = function() {
  return this.replace(/(^\s*)|(\s*$)/g, '')
}

export default {
  data() {
    return {
      rowMap: {},
      handleType: 'none',
      startPosition: { columnIndex: -1, rowIndex: -1 },
      endPosition: { columnIndex: -1, rowIndex: -1 },
      borderStyle: 'solid',
      copyBtnType: 'primary',
      toolStyle: {},
      headerCheckedColumns: []
    }
  },
  computed: {
    selectRengeStore() {
      const { startPosition, endPosition, borderStyle } = this
      const startRow = endPosition.rowIndex > startPosition.rowIndex ? startPosition.rowIndex : endPosition.rowIndex
      const endRow = endPosition.rowIndex < startPosition.rowIndex ? startPosition.rowIndex : endPosition.rowIndex

      const startColumn = endPosition.columnIndex > startPosition.columnIndex ? startPosition.columnIndex : endPosition.columnIndex
      const endColumn = endPosition.columnIndex < startPosition.columnIndex ? startPosition.columnIndex : endPosition.columnIndex
      // console.log({ startRow, endRow, startColumn, endColumn, borderStyle: borderStyle })

      return { startRow, endRow, startColumn, endColumn, borderStyle: borderStyle }
    },
    dirBottom() {
      const { startPosition, endPosition } = this
      return endPosition.rowIndex > startPosition.rowIndex
    },
    dirRight() {
      const { startPosition, endPosition } = this
      return endPosition.columnIndex > startPosition.columnIndex
    }
  },
  watch: {
    'table.scrollTop'(scrollTop, oldTop) {
      if (this.handleType === 'copyDown') {
        this.endPosition.y += scrollTop - oldTop
      }
      this.$set(this.toolStyle, 'display', 'none')
    },
    // header批量选中
    'table.headerCheckedColumns'(columns) {
      const checkColumnIds = columns.map(d => +d.columnId)
      if (checkColumnIds.length) {
        this.borderStyle = 'solid'
        this.handleType = 'copyDown'
        this.startPosition = { rowIndex: 0, columnIndex: Math.min(...checkColumnIds) - 1 }
        this.endPosition = { rowIndex: this.table.tableData.length - 1, columnIndex: Math.max(...checkColumnIds) - 1 }
        this.$nextTick(() => {
          this.selectRangeMouseUp()
        })
      } else {
        // this.close()
      }
    },
    selectRengeStore(val) {
      const { startRow, endRow, startColumn, endColumn } = val
      this.table.selectRengeStore = { startRow, endRow, startColumn, endColumn }
    }
  },
  created() {
    this.table.selectRengeStore = { startRow: -1, endRow: -1, startColumn: -1, endColumn: -1 }
  },
  inject: ['table'],
  mounted() {
    this.table.$on('table-mouse-up', this.selectRangeMouseUp)
    this.table.$on('cell-mouse-down', this.selectRangeMouseDown)
    this.table.$on('cell-mouse-move', this.selectRangeMouseMove)
    this.table.$on('copy', () => {
      if (this.handleType === 'copyUp') {
        this.borderStyle = 'dashed'
      }
    })

    document.addEventListener('scroll', () => {
      this.$set(this.toolStyle, 'display', 'none')
    })
    document.addEventListener('paste', this.onPaste, false)
  },
  destroyed() {
    document.removeEventListener('paste', this.onPaste, false)
  },
  methods: {
    setRowMap(paramas) {
      const { rowMap } = this
      const { id } = paramas
      this.$set(rowMap, id, paramas)
    },
    deleteRowMap(id) {
      const { rowMap } = this
      if (id in rowMap) {
        delete rowMap[id]
      }
    },
    close() {
      this.handleType = 'none'
      this.startPosition = { columnIndex: -1, rowIndex: -1 }
      this.endPosition = { columnIndex: -1, rowIndex: -1 }
    },
    onClickCopy() {
      this.copyBtnType = 'success'
      document.execCommand('copy')
    },
    batchCopyMouseDown(e) {
      if (e.which === 1) {
        this.handleType = 'batchCopuDown'
      }
    },
    batchCopyMouseUp(e) {
      if (e.which === 1) {
        this.borderStyle = 'solid'
        this.handleType = 'copyDown'
      }
    },
    selectRangeMouseUp(e) {
      if (this.handleType === 'none') {
        return
      }
      const { table, dirBottom, selectRengeStore } = this

      const { startRow, endRow, startColumn, endColumn } = selectRengeStore

      // 批量复制
      if (this.handleType === 'batchCopuDown') {
        const batchCopy = (sourceRow, startRowIndex, endRowIndex) => {
          for (let index = startRowIndex; index <= endRowIndex; index++) {
            const row = table.tableData[index]
            const cols = [startColumn, endColumn].sort()
            const [startCol, endCol] = cols
            for (let i = startCol; i <= endCol; i++) {
              const col = table.bodyColumns[i]
              const { prop } = col
              if (prop) {
                setFieldValue.call(this, table, row, prop, getFieldValue(sourceRow, prop))
                table.updateRow(row)
              }
            }
          }
        }
        if (dirBottom) {
          batchCopy(table.tableData[startRow], startRow + 1, endRow)
        } else {
          batchCopy(table.tableData[endRow], startRow, endRow - 1)
        }
      }

      this.copyBtnType = 'primary'

      if (this.handleType === 'copyDown') {
        const endColumnModel = document.getElementById(`${table.tableId}_${endRow + 1}-${endColumn + 1}`)
        if (endColumnModel) {
          const { top, left, width, height } = endColumnModel.getBoundingClientRect()
          this.toolStyle = { top: top + height - 5 + 'px', left: left + width - 5 + 'px' }
        } else {
          this.toolStyle = { top: '100%', left: '100%' }
        }
      }
      this.handleType = 'copyUp'
    },
    selectRangeMouseDown(e) {
      if (e.event.which === 1) {
        const { rowIndex, columnIndex, column } = e
        if (['expand', 'selection'].indexOf(column.type) !== -1) {
          return this.close()
        }
        this.borderStyle = 'solid'
        this.handleType = 'copyDown'
        this.endPosition = { rowIndex, columnIndex }
        this.startPosition = { rowIndex, columnIndex }
        this.rowMap = {}
      }
    },
    selectRangeMouseMove(e) {
      const { rowIndex, columnIndex } = e
      const { table, handleType } = this
      if (!['copyDown', 'batchCopuDown'].some(d => d === handleType)) return
      this.endPosition = { rowIndex, columnIndex }
      // 复制按钮
      if (handleType === 'batchCopuDown') {
        this.borderStyle = 'solid'

        const { endRow, endColumn } = this.selectRengeStore
        const endColumnModel = document.getElementById(`${table.tableId}_${endRow + 1}-${endColumn + 1}`)
        if (endColumnModel) {
          const { top, left, width, height } = endColumnModel.getBoundingClientRect()
          this.toolStyle = { top: top + height - 5 + 'px', left: left + width - 5 + 'px' }
        }
      }
    },
    onPaste(e) {
      if (this.handleType !== 'copyUp') {
        return true
      }

      this.table.$refs.edit && this.table.$refs.edit.close()
      const { startRow, startColumn } = this.selectRengeStore

      const updateArr = []
      const insertRows = []
      const data = e.clipboardData.getData('text/plain').trim().split('\r\n')
      data.map((da, idx) => {
        let columnList

        if (da.indexOf('\t ') !== -1) {
          columnList = da.split('\t ')
        } else {
          columnList = da.split('\t')
        }

        const rowIndex = idx + startRow
        const row = this.table.tableData[rowIndex]

        if (!row) {
          insertRows.push({})
        }
        columnList.forEach((content, i) => {
          const columnIndex = i + startColumn
          updateArr.push({ row, rowIndex, columnIndex, content })
        })
      })

      // console.log('updateArr', JSON.stringify(updateArr, null, 2))
      insertRows.length && this.table.insert(insertRows, -1)
      this.table.$emit('edit-fields', updateArr, true)
      this.table.scrollTop && (this.table.scrollTop += 0.1)
      this.table.headerCheckedColumns = []
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
    position: relative;
    width: 5px;
    height: 5px;
    cursor: crosshair;
    background-color: #fff;
    &::before{
      position: absolute;
      left: 1px;
      top: 1px;
      content: '';
      display: inline-block;
      width: 4px;
      height: 4px;
      background-color: rgb(17, 119, 232);
    }
  }

  .flex {
    height: 20px;
    display: flex;
    position: absolute;
    bottom: -20px;
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
