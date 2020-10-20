<template>
  <div class="table-wrapper" :class="{'is--screenfull': isScreenfull}" :style="style">
    <Toolbar v-if="$slots.toolbar || fullscreen || drag && columnControl" ref="toolbar">
      <slot name="toolbar" />
    </Toolbar>
    <div ref="table" :class="tableClass">
      <!-- header -->
      <div>
        <TableHeader
          v-if="showHeader"
          ref="header"
          :visible-columns="visibleColumns"
          :body-columns="bodyColumns"
          @dragend="handleDragend"
          @sort-change="sortChange"
        />
        <!-- body -->
        <TableBody
          ref="TableBody"
          :body-columns="bodyColumns"
          :data="tableData"
          :validators="validators"
          :messages="messages"
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
      </div>
      <!-- bodyOverflowX &&  -->
      <div
        v-if="leftWidth && bodyOverflowX"
        :class="['eff-table__fixed-left', bodyScrollLeft ? 'is-scroll--start' : '']"
        :style="{width: leftWidth + 'px', height: fixedHeight}"
      >
        <TableHeader
          v-if="showHeader"
          :visible-columns="visibleColumns.filter(d => d.fixed === 'left')"
          :body-columns="bodyColumns.filter(d => d.fixed === 'left')"
          fixed
          @dragend="handleDragend"
          @sort-change="sortChange"
        />
        <!-- body -->
        <TableBody
          :body-columns="bodyColumns.filter(d => d.fixed === 'left')"
          :data="tableData"
          fixed
          :validators="validators"
          :messages="messages"
        />
        <!-- footer -->
        <TableFooter
          v-if="$slots.footer || showSummary"
        >
          <Summary
            v-if="showSummary"
            :data="data"
            :columns="bodyColumns.filter(d => d.fixed === 'left')"
            :sum-text="sumText"
            :summary-method="summaryMethod"
          />
          <slot name="footer" />
        </TableFooter>
      </div>
      <div
        v-if="rightWidth && bodyOverflowX"
        :class="['eff-table__fixed-right', bodyOverflowX && rightWidth && isScrollRightEnd ? 'is-scroll--end' : '']"
        :style="{width: rightWidth + (heights.bodyOverflowY ? 17 : 0) + 'px', height: fixedHeight}"
      >
        <TableHeader
          v-if="showHeader"
          :visible-columns="visibleColumns.filter(d => d.fixed ==='right')"
          :body-columns="bodyColumns.filter(d => d.fixed ==='right')"
          fixed
          @dragend="handleDragend"
          @sort-change="sortChange"
        />
        <!-- body -->
        <TableBody
          :body-columns="bodyColumns.filter(d => d.fixed ==='right')"
          :data="tableData"
          :validators="validators"
          :messages="messages"
          fixed
        />
        <!-- footer -->
        <TableFooter
          v-if="$slots.footer || showSummary"
        >
          <Summary
            v-if="showSummary"
            :data="data"
            :columns="bodyColumns.filter(d => d.fixed ==='right')"
            :sum-text="sumText"
            :summary-method="summaryMethod"
          />
          <slot name="footer" />
        </TableFooter>
      </div>
    </div>
    <drag
      v-if="border && drag"
      ref="drag"
      v-model="columns"
      :column-control="columnControl"
      @cardClose="handleCardClose"
      @change="dargChange"
      @row-change="dragRowChange"
    />
    <edit
      v-if="edit"
      ref="edit"
      :columns="bodyColumns"
    />
    <!-- <p>minWidth{{ minWidth }}</p>
    <p>columnsWidth{{ columnsWidth }}</p>
    <p>bodyWidth{{ bodyWidth }}</p> -->
    <!-- <p>validators{{ validators }}</p> -->
    <!-- <p>showSpace {{ showSpace }}</p> -->
    <!-- 气泡 -->
    <Popover ref="popover" v-model="show" :reference="reference" :message="message" />
    <div v-show="lineShow" ref="line" class="eff-table-line" />
  </div>
</template>

<script>
import Column from 'mixins/column'
import Selection from 'mixins/selection'
import Layout from 'mixins/layout'
import validate from 'mixins/validate'
import sort from 'mixins/sort'
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
  mixins: [Column, Layout, Selection, validate, sort],
  props: {
    value: { type: Array, default: () => [] },
    data: { type: Array, default: () => [] },
    form: { type: Object, default: () => {} },
    border: Boolean,
    drag: Boolean,
    search: Boolean,
    edit: Boolean,
    editStop: Boolean,
    columnControl: Boolean,
    columnControlText: { type: String, default: '' },
    rowDrag: Boolean,
    fullscreen: Boolean,
    showSummary: Boolean,
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
      tableData: [...this.data],
      rowHoverIndex: null,
      scrollIndex: 0
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
      this.tableData = [...val]
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
    screenfullChange(val) {
      this.isScreenfull = val
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
      if (index > -1) {
        columns[index] = column
        this.columns = [...columns]
        this.dargChange()
      }
    },
    dargChange() {
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
    },
    handleCardClose() {
      this.$emit('dragCardClose')
    },
    tipShow({ reference, message }) {
      this.$refs.popover.doShow()
      this.reference = reference
      this.message = message
    },
    tipClose() {
      this.$refs.popover.doHide()
    }
  }
}
</script>

<style lang="scss" scoped>

.eff-table {
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
  }

  [draggable="true"] {
    opacity: .5;
  }
}

/** header */
.eff-table__header-wrapper, .eff-table--summary {
  position: relative;
  overflow-x: hidden;
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
  .eff-table__fixed-left {
    .eff-table__header-wrapper, .eff-table--summary{
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
  input ,&-element > *{
    width: 100%;
    height: var(--rowHeight);
    border-radius: 0;
    background-color: transparent;
    border-color: transparent;
    box-sizing: border-box;
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
  position: relative;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ddd;
  box-sizing: border-box;
}
.eff-table__header{
  .eff-table__column{
    display: flex;
    align-items: center;
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

.eff-edit{
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

@keyframes rotate {
  from{
    transform: rotate(0deg);
  }
  to{
    transform: rotate(360deg);
  }
}
</style>
