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

    <!-- <VForm v-bind="formConfig" /> -->

    <Toolbar v-if="$slots.toolbar || fullscreen || (drag && columnControl) || columnEdit" ref="toolbar">
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
    <FooterAction v-if="$slots.footer_action || footerActionConfig && footerActionConfig.showPager" ref="footerAction">
      <slot name="footer_action" />
    </FooterAction>
    <!-- 拖动 -->
    <drag
      v-if="border && drag"
      ref="drag"
      v-model="tableColumns"
      :column-control="columnControl"
      @cardClose="handleCardClose"
      @change="dargChange"
      @row-change="dragRowChange"
    />

    <column-edit
      v-if="border && drag"
      ref="columnEdit"
      :init-columns.sync="tableColumns"
      :column-control="columnEdit"
      @cardClose="handleCardClose"
      @change="dargChange"
      @row-change="dragRowChange"
    />

    <replace
      v-if="replaceControl"
      ref="replace"
      :init-columns.sync="tableColumns"
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
    <p>editStore -  {{ editStore }}</p>

    <!-- 气泡 -->
    <Popover ref="popover" v-bind="popoverOpts" />
    <Popover v-if="edit" ref="editPopover" v-bind="editPopoverOpts" />

    <!-- 列宽度调整辅助线 -->
    <div v-show="lineShow" ref="line" class="eff-table-line" />

    <slot v-if="false" name="expand" />

    <Loading :visible="isLoading" />
    <SelectRange v-if="selectRange || copy" ref="selectRange" />
    <copy v-if="copy" />

  </div>
</template>

<script>
import Column from '../mixins/column'
import Selection from '../mixins/selection'
import Layout from '../mixins/layout'
import validate from '../mixins/validate'
import sort from '../mixins/sort'
import proxy from '../mixins/proxy'
import virtual from '../mixins/virtual'
import shortcutKey from '../mixins/shortcutKey'
import TableHeader from './TableHeader'
import TableBody from './TableBody'
import TableFooter from './TableFooter'
import Popover from 'pk/popover'
import Drag from '../components/Drag'
import Toolbar from '../components/Toolbar'
import FooterAction from '../components/FooterAction'
import Edit from '../components/Edit'
import ScrollX from '../components/ScrollX'
import Loading from 'pk/loading'
import SelectRange from '../components/SelectRange/index'
import Copy from '../components/Copy/index'
import ColumnEdit from '../components/ColumnEdit/index'
import Replace from '../components/Replace/index'
import XEUtils from 'xe-utils'

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
    Copy,
    ColumnEdit,
    FooterAction,
    Replace
  },
  mixins: [Column, Layout, Selection, validate, sort, virtual, shortcutKey, proxy],
  provide() {
    return {
      table: this
    }
  },
  model: {
    prop: 'columns',
    event: 'input'
  },
  props: {
    columns: { type: Array, default: () => [] },
    data: { type: Array, default: () => [] },
    form: { type: Object, default: () => {} },
    border: Boolean,
    drag: Boolean,
    search: Boolean,
    edit: Boolean,
    editStop: Boolean,
    editLoop: { type: Boolean, default: true },
    editLengthways: { type: Boolean, default: true },
    loading: Boolean,
    columnControl: Boolean,
    columnEdit: Boolean,
    columnEditText: { type: String, default: '' },
    columnControlText: { type: String, default: '' },
    rowDrag: Boolean,
    fullscreen: Boolean,
    showSummary: Boolean, // 合计
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
    copy: Boolean,
    formConfig: { type: Object, default: () => {} }, // 表单配置
    proxyConfig: { type: Object, default: () => {} }, // 代理配置
    toolbarConfig: { type: Object, default: () => {} }, // 工具栏配置
    rowId: { type: String, default: 'id' }, // 行主键
    footerActionConfig: { type: Object, default: () => {} }, // 脚步配置pageConfig、showPager、showBorder、pageInLeft
    editHistory: { type: Boolean, default: () => false },
    showReplace: { type: Boolean, default: () => false }
  },
  data() {
    return {
      tableData: [...this.data],
      tableColumns: this.columns.map(d => {
        return { ...{ width: d.width || 0 }, ...d }
      }),
      tableForm: {},
      searchForm: [],
      currentRow: null,
      lineShow: false,
      isScreenfull: false,
      tableBodyEl: null,
      rowHoverIndex: null,
      expands: [],
      columnGroupIds: [],
      expand: null,
      editIsStop: false,
      isLoading: false,
      popoverOpts: {},
      editPopoverOpts: {},
      editStore: {
        insertList: [],
        updateList: [],
        pendingList: []
      },
      pager: {
        pageNum: 1,
        pageSize: 10
      },
      replaceControl: false
    }
  },
  computed: {
    visibleColumns() {
      return this.tableColumns.filter(d => d.show !== false)
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
      const { visibleColumns, expand } = this
      return expand && visibleColumns.find(d => d.type === 'expand')
    },
    useGroupColumn() {
      const { tableData } = this
      return tableData && tableData.find(d => typeof d.children !== 'undefined')
    }
  },
  watch: {
    data(data) {
      this.loadTableData(data)
    },
    columns(val) {
      this.tableColumns = val
    },
    loading(val) {
      this.isLoading = val
    },
    form(val) {
      this.tableForm = val
    },
    editStop(val) {
      this.editIsStop = val
    }
  },
  created() {
    Object.assign(this, {
      tableDataMap: new Map()
    })
    this.loadTableData(this.data || [])
  },
  mounted() {
    this.$nextTick(() => {
      const { $scopedSlots, $slots } = this
      const { expand } = $scopedSlots || $slots
      this.expand = expand
    })
    this.$on('edit-fields', this.editField)
  },
  beforeDestroy() {
    this.$off('edit-fields', this.editField)
  },
  methods: {
    loadTableData(data) {
      const { editStore, rowId } = this
      this.tableData = data || []
      this.tableSourceData = XEUtils.clone(data, true)
      this.updateCache()
      editStore.insertList = []
      this.clearSelection()
      this.scrollLeftEvent()
      this.resize()

      // 检测行主键在行数据中是否存在
      if (data.length && !data[0].hasOwnProperty(rowId)) {
        console.error('行数据中不存在主键[id]时，必须指定一个具有唯一性的属性 rowId 做为行主键！')
      }
      return this.$nextTick()
    },
    reloadData(data = null) {
      this.clearStatus()
      if (!data) {
        data = this.data
      }
      this.loadTableData(data)
    },
    clearStatus() {
      this.editStore = Object.assign({}, {
        insertList: [],
        updateList: [],
        pendingList: []
      })
    },
    updateRow(row) {
      const { rowId } = this
      const rowIndex = this.tableData.findIndex(d => d[rowId] === row[rowId])
      this.$set(this.tableData, rowIndex, row)
      const fields = []
      for (const prop in row) {
        const columnIndex = this.bodyColumns.findIndex(d => d.prop === prop)
        columnIndex > -1 && fields.push({
          rowIndex,
          columnIndex,
          content: row[prop]
        })
      }
      this.editField(fields)
    },
    updateStatus(row, prop) {
      if (!prop) return

      const sourceRow = this.tableSourceData.find(d => d[this.rowId] === row[this.rowId])
      if (!sourceRow) return

      const isInsert = this.editStore.insertList.find(d => d[this.rowId] === row[this.rowId])
      if (isInsert) return

      const newRow = { ...row }
      newRow.$old = { ...sourceRow }
      const index = this.editStore.updateList.findIndex(d => d[this.rowId] === row[this.rowId])
      // console.log(newRow, sourceRow[prop], row[prop], index)
      if ([sourceRow].some(d => d === row)) {
        this.editStore.updateList.splice(index, 1)
      } else {
        this.editStore.updateList.splice(index, 1, newRow)
      }

      // if (index !== -1) {
      //   if (sourceRow[prop] !== row[prop]) {
      //     this.editStore.updateList[index] = (newRow)
      //   } else {
      //     this.editStore.updateList.splice(index, 1)
      //   }
      // } else {
      //   if (sourceRow[prop] !== row[prop]) {
      //     this.editStore.updateList.push(newRow)
      //   }
      // }
    },
    // 更新数据行map
    updateCache() {
      const { tableData, rowId } = this
      tableData.forEach(d => {
        this.tableDataMap.set(d[rowId], d)
      })
    },
    editField(fileds) {
      console.log('fileds', JSON.stringify(fileds, null, 2))
      const updateArr = []
      fileds.forEach(filed => {
        const { tableData, visibleColumns, updateStatus } = this
        const { rowIndex, columnIndex, content } = filed
        const column = visibleColumns[columnIndex] || {}
        const { prop, rules } = column

        if (prop) {
          if (!filed.notUpdateTableEvent && content !== tableData[rowIndex][prop]) {
            updateArr.push({ rowIndex, columnIndex, newData: content, oldData: tableData[rowIndex][prop] })
          }
          tableData[rowIndex][prop] = content
          rules && rules.length && this.validateField(rowIndex, prop, rules)
          updateStatus(tableData[rowIndex], prop)
        }
      })

      if (updateArr.length) {
        this.$emit('table-update-data', updateArr)
      }
    },
    rootMousemove(event) {
      this.$emit('table-mouse-move', { event })
    },
    rootMouseup(event) {
      this.$emit('table-mouse-up', { event: event })
    },
    rootSelectstart(event) {
      return !(this.select || this.copy)
    },
    setEditIsStop(val) {
      this.editIsStop = val
    },
    focus(rowIndex, prop) {
      this.edit && this.$refs.edit.focus(rowIndex, prop)
    },
    handleDragend(column) {
      const { tableColumns } = this
      const index = tableColumns.findIndex(d => column.prop === d.prop && column.title === d.title)
      if (index > -1) {
        tableColumns[index] = column
        this.tableColumns = [...tableColumns]
        this.dargChange()
      }
    },
    dargChange() {
      if (this.edit) this.$refs.edit.show = false
      this.$emit('input', this.tableColumns)
      this.$emit('drag-change', this.tableColumns)
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
    searchChange(val) {
      console.log('search change', JSON.stringify(val, null, 2))
      this.searchForm = val
      this.$emit('search-change', val)
      if (this.proxyConfig) this.commitProxy('query')
    },
    clearSearch() {
      this.searchForm = []
      this.tableForm = []
      this.$emit('update:form', {})
    },
    getFullData() {
      return this.tableData
    },
    getEditStore() {
      return this.editStore.source
    }
  }
}
</script>
