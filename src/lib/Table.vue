<template>
  <div class="table-wrapper" :class="{'is--screenfull': isScreenfull}" :style="style">
    <Toolbar v-if="$slots.toolbar || fullscreen || drag && columnControl" ref="toolbar">
      <slot name="toolbar" />
    </Toolbar>
    <div ref="table" :class="tableClass">
      <!-- header -->
      <TableHeader v-if="showHeader" ref="header" @dragend="handleDragend" />
      <!-- body -->
      <TableBody
        ref="TableBody"
        :data="data"
        :validators="validators"
        :messages="messages"
        :row-render-index.sync="rowRenderIndex"
      />
      <!-- footer -->
      <TableFooter v-if="$slots.footer || showSummary" ref="footer">
        <Summary
          v-if="showSummary"
          :data="data"
          :columns="bodyColumns"
          :sum-text="sumText"
          :summary-method="summaryMethod"
        />
        <slot name="footer" />
      </TableFooter>
      <!-- 左侧 fixed 投影 -->
      <div v-show="bodyOverflowX && bodyScrollLeft && leftWidth" class="eff-table__shadow-left" :style="{left: `${leftWidth - 2}px`}" />
      <!-- 右侧 fixed 投影 -->
      <div v-show="bodyOverflowX && rightWidth && !isScrollRightEnd" class="eff-table__shadow-right" :style="{right: `${rightWidth + scrollYwidth}px`}" />
    </div>
    <drag
      v-if="border && drag"
      ref="drag"
      v-model="columns"
      :column-control="columnControl"
      @cardClose="handleCardClose"
      @change="change"
    />
    <edit
      v-if="edit"
      ref="edit"
      :columns="bodyColumns"
      @validate="handleValidate"
    />
    <!-- <p>minWidth{{ minWidth }}</p>
    <p>columnsWidth{{ columnsWidth }}</p>
    <p>bodyWidth{{ bodyWidth }}</p> -->
    <!-- <p>columnsWidth{{ columnsWidth }}</p> -->
    <!-- 气泡 -->
    <Popover :show="show" :reference="reference" :message="message" />
    <div v-show="lineShow" ref="line" class="eff-table-line" />
  </div>
</template>

<script>
import Column from 'mixins/column'
import Selection from 'mixins/selection'
import Layout from 'mixins/layout'
import validate from 'mixins/validate'
import TableHeader from './TableHeader'
import TableBody from './TableBody'
import TableFooter from './TableFooter'
import Popover from '../components/Popover'
import Drag from '../components/Drag'
import Toolbar from '../components/Toolbar'
import Edit from '../components/Edit'
import Summary from '../components/Summary'

export default {
  name: 'EffTable',
  components: {
    TableHeader,
    TableBody,
    TableFooter,
    Popover,
    Drag,
    Toolbar,
    Edit,
    Summary
  },
  mixins: [Column, Layout, Selection, validate],
  props: {
    value: { type: Array, default: () => [] },
    data: { type: Array, default: () => [] },
    border: Boolean,
    drag: Boolean,
    search: Boolean,
    edit: Boolean,
    editStop: Boolean,
    columnControl: Boolean,
    fullscreen: Boolean,
    showSummary: Boolean,
    summaryMethod: { type: Function, default: null },
    sumText: { type: String, default: '合计' },
    rowHeight: { type: Number, default: 36 },
    height: { type: Number, default: 0 },
    maxHeight: { type: Number, default: 0 },
    highlightCurrentRow: Boolean,
    emptyText: { type: String, default: '暂无数据' },
    showHeader: { type: Boolean, default: true },
    showOverflowTooltip: Boolean,
    cellClassName: { type: [String, Function], default: '' },
    messages: { type: Array, default: () => [] }
  },
  data() {
    return {
      columns: this.value.map(d => {
        return { ...{ width: d.width || 0 }, ...d }
      }),
      show: false,
      message: null,
      reference: null,
      currentRow: null,
      lineShow: false,
      isScreenfull: false,
      tableBody: null,
      rowRenderIndex: 0
    }
  },
  computed: {
    visibleColumns() {
      return this.columns.filter(d => d.show !== false)
    },
    bodyColumns() {
      const plat = arr => {
        return arr.reduce((acc, cur) => {
          const { children = [] } = cur
          return children.length ? acc.concat(plat(children)) : acc.concat(cur)
        }, [])
      }
      return plat(this.visibleColumns)
    },
    style() {
      const style = {}
      const { isScreenfull, height, maxHeight } = this
      const screenHeight = window.screen.height
      style['--rowHeight'] = this.rowHeight + 'px'
      if (isScreenfull) {
        style.height = screenHeight + 'px'
      } else {
        if (height) style.height = height + 'px'
        if (maxHeight) style.maxHeight = maxHeight + 'px'
        if (!height && !maxHeight) style.maxHeight = screenHeight + 'px'
      }

      return style
    }
  },
  watch: {
    data(val) {

    },
    value(val) {
      this.columns = val
    }
  },
  provide() {
    return {
      table: this
    }
  },
  created() {
    this.$on('screenfullChange', this.screenfullChange)
  },
  beforeDestroy() {
    this.$off('screenfullChange', this.screenfullChange)
  },
  methods: {
    handleRowRenderIndex(val) {
      this.rowRenderIndex = val
    },
    screenfullChange(val) {
      this.isScreenfull = val
    },
    forceUpdate() {
      this.$refs.TableBody.forceUpdate()
    },
    focus(rowIndex, prop) {
      this.edit && this.$refs.edit.focus(rowIndex, prop)
    },
    toScroll(rowIndex, cb) {
      this.$refs.TableBody.toScroll(rowIndex, cb)
    },
    handleDragend(column) {
      const { columns } = this
      const index = columns.findIndex(d => column.prop === d.prop && column.title === d.title)
      console.log(column)
      if (index > -1) {
        columns[index] = column
        this.columns = [...columns]
        this.change()
      }
    },
    change() {
      this.$emit('input', this.columns)
      this.$emit('dragChange', this.columns)
      this.resize()
    },
    handleCardClose() {
      this.$emit('dragCardClose')
    },
    handleValidate(val, validators) {
      this.$emit('validate', val, validators)
    },
    tipShow({ reference, message }) {
      this.show = true
      this.reference = reference
      this.message = message
    },
    tipClose() {
      this.show = false
    }
  }
}
</script>

<style lang="scss">
@import '../components/Edit/index.scss';

.eff-table {
  font-size: 14px;
  position: relative;
  color: #606266;
  border: 1px solid #ddd;
  box-sizing: border-box;
  overflow: hidden;
}
.eff-table__shadow-left, .eff-table__shadow-right{
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
}
.eff-table__shadow-left{
  box-shadow: 5px 0px 8px rgba(0, 0, 0, 0.5);
}
.eff-table__shadow-right{
  box-shadow: -5px 0px 8px rgba(0, 0, 0, 0.5);
}
</style>

<style lang="scss">
.eff-table {
  .eff-cell{
    box-sizing: border-box;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    word-break: break-all;
    padding: 0 5px;
  }

  [draggable="true"] {
    opacity: .5;
  }
}

/** header */
.eff-table__header-wrapper, .eff-table--summary {
  position: relative;
  overflow: hidden;
  background-color: #f6f7f8;
  box-sizing: border-box;
}

.eff-table__header-group{
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  .header-title{
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #ddd;
    font-weight: bold;
    box-sizing: border-box;
  }
  .header-children{
    flex: 1;
    display: flex;
  }
}
.eff-table--summary{
  .eff-table__body-row{
    .eff-table__column{
      background-color: #f6f7f8;
    }
    &:hover .eff-table__column{
      background-color: #f6f7f8;
    }
  }
}
.is-overflow--y {
  .eff-table__header-wrapper, .eff-table--summary{
    &::-webkit-scrollbar {
      border-left: 1px solid #ddd;
    }
  }
  .eff-table__header-wrapper, .eff-table--summary{
    overflow-y: scroll;
  }
}
.eff-table__header, .eff-table__search, .eff-table__body-row {
  position: relative;
  width: 100%;
  display: flex;
  align-items: stretch;
  box-sizing: border-box;
}
.eff-table__search{
  &-item{
    display: flex;
    height: 100%;
    position: absolute;
    left: -1px;
    top: -1px;
    right: 0;
    bottom: -2px;
  }
  &-dropdown{
    position: relative;
    height: var(--rowHeight);
    line-height: var(--rowHeight);
    padding: 0 5px;
    border: 1px solid transparent;
    box-sizing: border-box;
    &:hover{
      border-color: #ccc;
      z-index: 1;
    }
  }
  input, .search-item{
    height: var(--rowHeight);
    border-radius: 0;
    padding: 0 5px;
    background-color: transparent;
    border-color: transparent;
    box-sizing: border-box;
    &:hover{
      border-color: #1177E8;
      z-index: 1;
    }
    &:focus, &:active{
      border-color: #1177E8;
      z-index: 1;
    }
  }
}
.eff-table__column{
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
}
.eff-table__header{
  .eff-table__column{
    color: #666;
    font-weight: bold;
    user-select: none;
    background-color: #f6f7f8;

    &.is-draging{
      background-color: #c7daf1;
    }
    &.is-draging--warning{
      background-color: #f3caca;
    }
  }
  .header-drag-move{
    position: fixed;
    width: 8px;
    z-index: 3;
    &:hover{
      cursor: col-resize;
    }
  }
  .is--space{
    cursor: no-drop;
  }
  &.is--move{
    .header-drag-move{
      &:hover{
        cursor: default;
      }
    }
    .is--space{
      cursor: default;
    }
  }
}

.eff-table__body{
  box-sizing: border-box;

  &--x-space{
    width: 100%;
    height: 1px;
    margin-bottom: -1px;
  }
  &--y-space{
    width: 0;
    float: left;
  }
}
.eff-table__body-row{
  .eff-table__column{
    background-color: #fff;
    border-bottom: 1px solid #ddd;
    &.is--message{
      background-color: #fda1a1;
      &:hover{
        background-color: #fda1a1;
      }
    }
  }
  &:last-child{
    .eff-table__column{
      border-bottom: 1px solid transparent;
    }
  }
  &.current-row .eff-table__column {
    background-color: #e8f4ff;
  }
  &:hover .eff-table__column{
    background-color: #f1f3f5;
    &.is--message{
      background-color: #fda1a1;
    }
  }
}

.is-border {
  .eff-table__column,
  .header-title{
    border-left: 1px solid #ddd;
  }
}
.eff-table__body-row:last-child{
    .eff-table__column{
      border-bottom: 1px solid #ddd;
    }
  }
.is-overflow--y{
  .eff-table__body-row:last-child{
    .eff-table__column{
      border-bottom: none;
    }
  }
}
.is--fixed {
  position: absolute;
  top: 0;
  bottom: 0;
  z-index: 2;
}

.eff-table-line{
  position: fixed;
  left: 50px;
  top: 0;
  width: 1px;
  height: 100%;
  background-color: #ddd;
  z-index: 3;
}
.is--space{
  flex: 1;
}

.is--screenfull{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #fff;
  z-index: 999;
}

.is-async-validator{
  position: relative;
  &:after{
    content: '';
    width: 6px;
    height: 6px;
    position: absolute;
    font-size: 20px;
    left: 3px;
    top: 3px;
    border: 1px solid #666;
    border-right-color: transparent;
    border-radius: 50%;
    animation: rotate linear .5s infinite;
  }
}
@keyframes rotate {
  from{
    transform: rotate(0deg);
  }
  to{
    transform: rotate(360deg);
  }
}
</style>
