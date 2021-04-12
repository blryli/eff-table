<template>
  <div
    class="eff-table"
    :class="{'is--screenfull': isScreenfull}"
    :style="style"
    @mouseenter="rootMouseenter"
    @mouseleave="rootMouseleave"
    @selectstart.prevent="rootSelectstart"
    @mouseup="rootMouseup"
    @mousemove="rootMousemove($event)"
  >
    <Toolbar v-if="$slots.toolbar || fullscreen || drag && columnControl" ref="toolbar">
      <slot name="toolbar" />
    </Toolbar>

    <div ref="table" :class="tableClass">
      <div class="eff-table__wrapper">
        <TableHeader
          v-if="showHeader"
          ref="header"
          :visible-columns="visibleColumns"
          :body-columns="bodyColumns"
          @dragend="handleDragend"
          @sort-change="sortChange"
        />
        <TableBody
          ref="body"
          :body-columns="bodyColumns"
          :data="tableData"
          :validators="validators"
          :messages="messages"
        />
        <TableFooter
          v-if="showSummary"
          ref="footer"
          :data="tableData"
          :columns="bodyColumns"
          :sum-text="sumText"
          :summary-method="summaryMethod"
        />
      </div>

      <!-- fixed left  -->
      <div
        v-if="leftWidth && overflowX"
        :class="['eff-table__fixed-left', scrollLeft ? 'is-scroll--start' : '']"
        :style="{width: leftWidth + 'px', height: fixedHeight}"
      >
        <TableHeader
          v-if="showHeader"
          :visible-columns="visibleColumns.filter(d => d.fixed === 'left')"
          :body-columns="bodyColumns.filter(d => d.fixed === 'left')"
          fixed="left"
          @dragend="handleDragend"
          @sort-change="sortChange"
        />
        <TableBody
          ref="leftBody"
          :body-columns="bodyColumns.filter(d => d.fixed === 'left')"
          :data="tableData"
          fixed="left"
          :validators="validators"
          :messages="messages"
        />
        <TableFooter
          v-if="showSummary"
          :data="tableData"
          :columns="bodyColumns.filter(d => d.fixed === 'left')"
          :sum-text="sumText"
          :summary-method="summaryMethod"
          fixed="left"
        />
      </div>

      <!-- fixed right  -->
      <div
        v-if="rightWidth && overflowX"
        :class="['eff-table__fixed-right', overflowX && rightWidth && isScrollRightEnd ? 'is-scroll--end' : '']"
        :style="{width: rightWidth + (overflowY ? 17 : 0) + 'px', height: fixedHeight}"
      >
        <TableHeader
          v-if="showHeader"
          :visible-columns="visibleColumns.filter(d => d.fixed ==='right')"
          :body-columns="bodyColumns.filter(d => d.fixed ==='right')"
          fixed="right"
          @dragend="handleDragend"
          @sort-change="sortChange"
        />
        <TableBody
          ref="rightBody"
          :body-columns="bodyColumns.filter(d => d.fixed ==='right')"
          :data="tableData"
          :validators="validators"
          :messages="messages"
          fixed="right"
        />
        <TableFooter
          v-if="showSummary"
          :data="tableData"
          :columns="bodyColumns.filter(d => d.fixed ==='right')"
          :sum-text="sumText"
          :summary-method="summaryMethod"
          fixed="right"
        />
      </div>

      <!-- footer存在时的 body 滚动 -->
      <ScrollX v-if="showSummary && overflowX" />
    </div>

    <!-- 拖动 -->
    <drag
      v-if="border && drag"
      ref="drag"
      v-model="columns"
      :column-control="columnControl"
      @cardClose="handleCardClose"
      @change="dargChange"
      @row-change="dragRowChange"
    />

    <!-- 编辑 -->
    <edit
      v-if="edit"
      ref="edit"
      :columns="bodyColumns"
    />
    <!-- <p>minWidth{{ minWidth }}</p>
    <p>columnWidths{{ columnWidths }}</p>
    <p>bodyWidth{{ bodyWidth }}</p> -->
    <!-- <p>currentEdit -  {{ currentEdit }}</p> -->

    <!-- 气泡 -->
    <Popover ref="popover" v-bind="popoverOpts" />
    <Popover v-if="edit" ref="editPopover" v-bind="editPopoverOpts" />

    <!-- 列宽度调整辅助线 -->
    <div v-show="lineShow" ref="line" class="eff-table-line" />

    <slot v-if="false" name="expand" />

    <Loading :visible="loading" />
    <SelectRange v-if="selectRange" />
    <copy v-if="copy" />
  </div>
</template>

<script>
import Column from 'mixins/column'
import Selection from 'mixins/selection'
import Layout from 'mixins/layout'
import validate from 'mixins/validate'
import sort from 'mixins/sort'
import virtual from 'mixins/virtual'
import shortcutKey from 'mixins/shortcutKey'
import TableHeader from './TableHeader'
import TableBody from './TableBody'
import TableFooter from './TableFooter'
import Popover from '../components/Popover'
import Drag from '../components/Drag'
import Toolbar from '../components/Toolbar'
import Edit from '../components/Edit'
import ScrollX from '../components/ScrollX'
import Loading from '../components/Loading'
import SelectRange from '../components/SelectRange/index'
import Copy from '../components/Copy/index'

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
    ScrollX,
    Loading,
    SelectRange,
    Copy
  },
  mixins: [Column, Layout, Selection, validate, sort, virtual, shortcutKey],
  provide() {
    return {
      table: this
    }
  },
  props: {
    value: { type: Array, default: () => [] },
    data: { type: Array, default: () => [] },
    form: { type: Object, default: () => {} },
    border: Boolean,
    drag: Boolean,
    search: Boolean,
    edit: Boolean,
    editStop: Boolean,
    editLengthways: { type: Boolean, default: true },
    loading: Boolean,
    columnControl: Boolean,
    columnControlText: { type: String, default: '' },
    rowDrag: Boolean,
    fullscreen: Boolean,
    showSummary: Boolean,
    searchClear: { type: Boolean, default: true },
    searchClearText: { type: String, default: '' },
    sortConfig: { type: Object, default: () => {} },
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
    rowClassName: { type: [String, Function], default: '' },
    messages: { type: Array, default: () => [] },
    selectRange: Boolean,
    copy: Boolean
  },
  data() {
    return {
      columns: this.value.map(d => {
        return { ...{ width: d.width || 0 }, ...d }
      }),
      currentRow: null,
      lineShow: false,
      isScreenfull: false,
      tableBody: null,
      tableData: Object.freeze([...this.data]),
      rowHoverIndex: null,
      expands: [],
      expand: null,
      editIsStop: false,
      popoverOpts: {},
      editPopoverOpts: {},
      currentEdit: {
        oldColumnIndex: null,
        columnIndex: null
      }
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
          if (children.length) {
            children.forEach(d => cur.fixed && (d.fixed = cur.fixed))
            return acc.concat(plat(children))
          }
          return acc.concat(cur)
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
    },
    useExpand() {
      const { value, expand } = this
      return expand && value.find(d => d.type === 'expand')
    }
  },
  watch: {
    data(val) {
      this.tableData = Object.freeze([...val])
      this.clearSelection()
      this.scrollLeftEvent()
      this.resize()
    },
    value(val) {
      this.columns = val
    },
    editStop(val) {
      this.editIsStop = val
    }
  },
  mounted() {
    this.$nextTick(() => {
      const { $scopedSlots, $slots } = this
      const { expand } = $scopedSlots || $slots
      this.expand = expand
    })
  },
  methods: {
    rootMousemove(event) {
      this.$emit('table-mouse-move', { event })
    },
    rootMouseup(event) {
      this.$emit('table-mouse-up', { event: event })
    },
    rootSelectstart(event) {
      const a = !(this.select || this.copy)
      return a
    },
    setEditIsStop(val) {
      this.editIsStop = val
    },
    focus(rowIndex, prop) {
      this.edit && this.$refs.edit.focus(rowIndex, prop)
    },
    handleDragend(column) {
      const { columns } = this
      const index = columns.findIndex(d => column.prop === d.prop && column.title === d.title)
      if (index > -1) {
        columns[index] = column
        this.columns = [...columns]
        this.dargChange()
      }
    },
    dargChange() {
      if (this.edit) this.$refs.edit.show = false
      this.$emit('input', this.columns)
      this.$emit('drag-change', this.columns)
      this.resize()
    },
    dragRowChange(fromIndex, toIndex) {
      const data = this.data
      const from = data[fromIndex]
      const to = data[toIndex]
      data.splice(toIndex, 1, from)
      data.splice(fromIndex, 1, to)
      this.$emit('row-drag-change', fromIndex, toIndex)
    },
    handleCardClose() {
      this.$emit('drag-card-close')
    },
    tipShow(opts) {
      this.$refs.popover.doShow()
      this.popoverOpts = opts
    },
    tipClose() {
      this.$refs.popover.doHide()
    },
    editTipShow(opts) {
      this.$refs.editPopover.doShow()
      this.editPopoverOpts = opts
    },
    editTipClose() {
      this.$refs.editPopover.doHide()
    },
    expandChange(obj) {
      const { rowIndex } = obj
      const index = this.expands.findIndex(d => d.rowIndex === rowIndex)
      index > -1 ? this.expands.splice(index, 1, obj) : this.expands.push(obj)
      this.$emit('expand-change', this.expands)
    },
    clearSearch() {
      this.$emit('update:form', {})
    }
  }
}
</script>

<style lang="scss">
.eff-table{
  position: relative;
}
.eff-table__container {
  font-size: 14px;
  position: relative;
  color: #606266;
  overflow: hidden;
  border: 1px solid #ddd;
  box-sizing: border-box;
}
.eff-table__fixed-left, .eff-table__fixed-right {
  position: absolute;
  top: 0;
  overflow: hidden;
  background-color: #fff;
}
.eff-table__fixed-left{
  left: 0;
  &.is-scroll--start{
    box-shadow: 4px 3px 4px rgba(0, 0, 0, 0.12);
  }
}
.eff-table__fixed-right {
  right: 0;
  box-shadow: -4px 3px 4px rgba(0, 0, 0, 0.12);
  &.is-scroll--end{
    border-left: 1px solid #ddd;
    box-shadow: none;
  }
}
</style>

<style lang="scss">
@import '../components/Edit/index.scss';
@import '../components/Popover/popover.scss';

.eff-table {
  .eff-cell{
    display: flex;
    align-items: center;
    box-sizing: border-box;
    overflow: hidden;
    padding: 0 5px;
    &--title, &--label{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      word-break: break-all;
    }
    &--required{
      display: inline-block;
      color: #f56c6c;
      width: 10px;
      height: 10px;
      line-height: 10px;
      font-weight: 400;
      position: relative;
      &:before {
        content: "*";
        position: absolute;
        left: 0;
        top: 4px;
      }
    }
  }

  [draggable="true"] {
    opacity: .5;
  }
}

/** header */
.eff-table__header-wrapper {
  position: relative;
  overflow-x: hidden;
  background-color: #f6f7f8;
  box-sizing: border-box;
}

.eff-table__header-group{
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  &-title{
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #ddd;
    font-weight: bold;
    box-sizing: border-box;
  }
  &-children{
    flex: 1;
    display: flex;
  }
}

.is-overflow--y {
  .eff-table__wrapper, .eff-table__fixed-right{
    .eff-table__header-wrapper, .eff-table__summary, .eff-table__footer{
      overflow-y: scroll;
      &::-webkit-scrollbar {
        border-left: 1px solid #ddd;
      }
    }
  }
  .eff-table__fixed-left {
    .eff-table__header-wrapper, .eff-table__summary{
      overflow-y: hidden;
    }
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
  .eff-table__column{
    overflow: visible;
  }
  &-item{
    display: flex;
    position: absolute;
    overflow: hidden;
    left: -1px;
    top: -1px;
    right: 0;
    bottom: -2px;
    height: var(--rowHeight);
  }
  &-dropdown{
    flex: 0 0 26px;
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
  &-element{
    flex: 1;
  }
  &-empty{
    width: 100%;
    height: var(--rowHeight);
    background-color: #f5f6f7;
    border-top: 1px solid #ddd;
    box-sizing: border-box;
  }
  input , textarea, &-element > *{
    width: 100%;
    height: var(--rowHeight);
    border-radius: 0;
    background-color: transparent;
    border-color: transparent;
    box-sizing: border-box;
  }
  input, textarea, .el-input__inner{
    height: var(--rowHeight)!important;
  }
  .eff-search--input{
    padding: 0 5px;
    outline: 0;
    border: 1px solid transparent;
    color: #606266;
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    &:hover{
      border-color: #c0c4cc;
      z-index: 1;
    }
    &:focus, &:active{
      border-color: #1177E8;
      z-index: 1;
    }
    &::-webkit-input-placeholder{
      color: #b8bdc5;
    }
    &::-moz-input-placeholder {
      color: #b8bdc5;
    }
    &::-ms-input-placeholder {
      color: #b8bdc5;
    }
  }
}
.eff-table__column{
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
  border-bottom: 1px solid #ddd;
  overflow: hidden;
}
.eff-table__header{
  .eff-table__column{
    color: #666;
    font-weight: bold;
    user-select: none;
    background-color: #f6f7f8;
  }
  &-group, .eff-table__column{
    &.is-draging{
      background-color: #c7daf1;
    }
    &.is-draging--warning{
      background-color: #f3caca;
    }
  }
  .is-draging, .is-draging--warning{
    .eff-table__column{
      background-color: transparent;
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
  &:last-child{
    .eff-table__column{
      border-bottom: 1px solid transparent;
    }
  }
  &.is--hover{
    .eff-table__column {
      background-color: #f1f3f5;
    }
  }
  &.current-row .eff-table__column {
    background-color: #e8f4ff;
  }
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
}

.is-border {
  .eff-table__column,
  .eff-table__search-empty,
  .eff-table__header-group-title{
    border-left: 1px solid #ddd;
  }
  .is-first-right-fixed {
    .eff-table__search-empty{
      border-left-color: transparent;
    }
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
.eff-table__body-wrapper{
  overflow-x: hidden;
  overflow-y: hidden;
}
.is-overflow--x{
  .eff-table__body-wrapper{
    overflow-x: scroll;
  }
}
.is-overflow--y{
  .eff-table__body-wrapper{
    overflow-y: auto;
  }
}

.eff-table__fixed-left{
  .eff-table__body-wrapper{
    &::-webkit-scrollbar { width: 0 !important }
  }
}

.eff-empty-text{
  display: flex;
  justify-content: center;
  align-items: center;
  color: #888;
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

.col-edit::before{
  content: '';
  position: absolute;
  left: -5px;
  top: -5px;
  display: inline-block;
  width: 0;
  height: 0;
  border: 5px solid;
  border-color: transparent #ddd transparent transparent;
  transform: rotate(45deg);
}

.eff-cell--sort{
  position: relative;
  min-width: 20px;
  height: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  [class*=eff-cell--sort-]{
    width: 0;
    height: 0;
    border: 6px solid transparent;
    position: absolute;
    left: 5px;
    cursor: pointer;
  }
  .eff-cell--sort-asc{
    border-bottom-color: #c0c4cc;
    top: -3.5px;
    &:hover{
      border-bottom-color: #a0a1a5;
    }
    &.is--active{
      border-bottom-color: #409eff;
    }
  }
  .eff-cell--sort-desc{
    border-top-color: #c0c4cc;
    bottom: -3.5px;
    &:hover{
      border-top-color: #a0a1a5;
    }
    &.is--active{
      border-top-color: #409eff;
    }
  }
}

.eff-toobar--text{
  font-size: 12px;
  padding: 2px 4px;
  border: 1px solid #ddd;
  color: #666;
  &:hover{
    cursor: pointer;
    color: #333;
    border-color: #bbb;
  }
}

.eff-icon--close{
  position: relative;
  width: 14px;
  height: 14px;
  color: #bbb;
  border: 1px solid currentColor;
  border-radius: 50%;
  box-sizing: border-box;
  &:hover{
    cursor: pointer;
    color: #888;
  }
  &::before{
    content: '';
    position: absolute;
    left: 5px;
    top: 2px;
    width: 1px;
    height: 8px;
    background-color: currentColor;
    transform: rotate(-45deg);
  }
  &::after{
    content: '';
    position: absolute;
    left: 5px;
    top: 2px;
    width: 1px;
    height: 8px;
    background-color: currentColor;
    transform: rotate(45deg);
  }
}

.eff-search__range{
  .eff-icon--close{
    display: none;
    position: absolute;
    top: 50%;
    right: 5px;
    transform: translateY(-50%);
  }
  &:hover{
    .eff-icon--close{
      display: block;
    }
  }
}

.eff-table__expanded{
  display: inline-block;
  width: 100%;
  padding: 20px;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
}

.eff-icon-expand{
  display: inline-block;
  position: relative;
  width: 16px;
  height: 16px;
  transition: all .2s;
  &:hover{
    cursor: pointer;
  }
  &::before{
    content: '';
    position: absolute;
    left: 4px;
    top: 5px;
    width: 5px;
    height: 5px;
    border-right: 1px solid #666;
    border-bottom: 1px solid #666;
    transform: rotate(-45deg);
  }
  &.is-expanded{
    transform: rotate(90deg);
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
