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
      toolStyle: {}
    }
  },
  computed: {
    selectRengeStore() {
      const { startPosition, endPosition, borderStyle } = this
      const startRow = endPosition.rowIndex > startPosition.rowIndex ? startPosition.rowIndex : endPosition.rowIndex
      const endRow = endPosition.rowIndex < startPosition.rowIndex ? startPosition.rowIndex : endPosition.rowIndex

      const startColumn = endPosition.columnIndex > startPosition.columnIndex ? startPosition.columnIndex : endPosition.columnIndex
      const endColumn = endPosition.columnIndex < startPosition.columnIndex ? startPosition.columnIndex : endPosition.columnIndex

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
    }
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
      rowMap[id] = paramas
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
        const query = `.eff-table__body-row[data-rowid="${endRow + 1}"] .eff-table__column[data-colid="${(endRow + 1) + '-' + (endColumn + 1)}"]`
        const endColumnModel = table.$refs.body.$el.querySelector(query)
        if (endColumnModel) {
          const { top, left, width, height } = endColumnModel.getBoundingClientRect()
          this.toolStyle = { top: top + height - 5 + 'px', left: left + width - 5 + 'px' }
        }

        this.handleType = 'copyUp'

        let startIndex = 0
        const rowArr = Object.values(this.rowMap).reduce((acc, cur, index) => {
          const { row, prop, rowIndex } = cur
          if (index === 0) {
            startIndex = rowIndex
          }
          const insertIndex = rowIndex - startIndex
          if (!acc[insertIndex]) acc[insertIndex] = []
          const text = document.getElementById(cur.id).innerText || getFieldValue(row, prop)
          acc[insertIndex].push(text)
          return acc
        }, [])
        table.$emit('select-range-data', rowArr)
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
      const { handleType } = this
      if (!['copyDown', 'batchCopuDown'].some(d => d === handleType)) return
      this.endPosition = { rowIndex, columnIndex }
      // 复制按钮
      if (handleType === 'batchCopuDown') {
        this.borderStyle = 'solid'

        const { endRow, endColumn } = this.selectRengeStore
        const node = `.eff-table__body-row[data-rowid="${endRow + 1}"] .eff-table__column[data-colid="${(endRow + 1) + '-' + (endColumn + 1)}"]`
        const endColumnModel = this.table.$refs.body.$el.querySelector(node)
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
      const data = e.clipboardData.getData('text/plain').trim().split('\r\n')
      data.map((v, k) => {
        let columnList

        if (v.indexOf('\t ') !== -1) {
          columnList = v.split('\t ')
        } else {
          columnList = v.split('\t')
        }

        columnList.forEach((vv, kk) => {
          if (!this.table.tableData[k + startRow]) {
            this.table.add()
          }
          updateArr.push({ row: this.table.tableData[k + startRow], rowIndex: k + startRow, columnIndex: kk + startColumn, content: vv })
        })
      })

      this.table.$emit('edit-fields', updateArr, true)
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
