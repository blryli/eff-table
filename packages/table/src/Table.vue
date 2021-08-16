<template>
  <div
    class="eff-table"
    :class="{
      'is--screenfull': isScreenfull,
      'is--copy': selectRange || copy
    }"
    :style="style"
    @mouseenter="rootMouseenter"
    @mouseleave="rootMouseleave"
    @mouseup="rootMouseup"
    @mousemove="rootMousemove($event)"
  >
    <!-- <VForm v-bind="formConfig" /> -->

    <Toolbar
      v-if="showToolbar"
      ref="toolbar"
    >
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
          ref="leftHeader"
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
          ref="rightHeader"
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
    <FooterAction
      v-if="$slots.footer_action || footerActionConfig && footerActionConfig.showPager"
      ref="footerAction"
    >
      <slot name="footer_action" />
    </FooterAction>
    <!-- 拖动 -->
    <drag
      v-if="drag && border || rowDrag"
      ref="drag"
      v-model="tableColumns"
      :column-control="toolbarConfig.columnControl"
      @cardClose="handleCardClose"
      @change="dargChange"
      @row-change="dragRowChange"
    />

    <column-batch-control
      v-if="border && drag"
      ref="columnBatchControl"
      :init-columns.sync="tableColumns"
      :column-batch-control="toolbarConfig.columnBatchControl"
      @cardClose="handleCardClose"
      @change="dargChange"
      @row-change="dragRowChange"
    />

    <replace v-if="replaceControl" ref="replace" :init-columns.sync="tableColumns" />
    <sort v-if="sortConfig.multiple" ref="sort" />
    <!-- 编辑 -->
    <edit v-if="edit" ref="edit" :columns="bodyColumns" />
    <!-- <p>minWidth{{ minWidth }}</p>
    <p>columnWidths{{ columnWidths }}</p>
    <p>bodyWidth{{ bodyWidth }}</p>-->
    <!-- <p>editStore -  {{ getEditStore() }}</p> -->
    <!-- <p>selectRengeStore -  {{ $refs.selectRange && $refs.selectRange.selectRengeStore }}</p> -->
    <!-- <p>rowMap -  {{ $refs.selectRange && $refs.selectRange.rowMap }}</p> -->

    <!-- 气泡 -->
    <Popovers ref="popovers" />

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
import Popovers from 'pk/table/components/Popovers'
import Drag from '../components/Drag'
import Toolbar from '../components/Toolbar'
import FooterAction from '../components/FooterAction'
import Edit from '../components/Edit'
import ScrollX from '../components/ScrollX'
import Loading from 'pk/loading'
import SelectRange from '../components/SelectRange/index'
import Copy from '../components/Copy/index'
import columnBatchControl from '../components/ColumnBatchControl/index'
import Replace from '../components/Replace/index'
import Sort from '../components/Sort/index'
import XEUtils from 'xe-utils'
import { getColumnChildrenWidth, getFieldValue, setFieldValue } from 'pk/utils'
import { getOptions } from 'pk/utils/render'

export default {
  name: 'EffTable',
  components: {
    TableHeader,
    TableBody,
    TableFooter,
    Popovers,
    Drag,
    Toolbar,
    Edit,
    ScrollX,
    Loading,
    SelectRange,
    Copy,
    columnBatchControl,
    FooterAction,
    Replace,
    Sort
  },
  mixins: [
    Column,
    Layout,
    Selection,
    validate,
    sort,
    virtual,
    shortcutKey,
    proxy
  ],
  provide() {
    return {
      table: this,
      root: this
    }
  },
  model: {
    prop: 'columns',
    event: 'input'
  },
  props: {
    columns: { type: Array, default: () => ([]) },
    data: { type: Array, default: () => ([]) },
    form: { type: Object, default: () => ({}) },
    border: Boolean,
    stripe: Boolean,
    drag: Boolean,
    search: Boolean,
    edit: Boolean,
    editStop: Boolean,
    editLoop: { type: Boolean, default: true },
    editLengthways: { type: Boolean, default: true },
    loading: Boolean,
    columnControlText: { type: String, default: '' },
    columnBatchControlText: { type: String, default: '' },
    rowDrag: Boolean,
    showSummary: Boolean, // 合计
    searchClearText: { type: String, default: '' },
    sortConfig: { type: Object, default: () => ({}) }, // 排序配置
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
    selectRange: Boolean, // 表格区域选择
    copy: Boolean, // 复制功能
    headerContextmenu: Boolean, // 表头右键扩展菜单
    formConfig: { type: Object, default: () => {} }, // 表单配置
    proxyConfig: { type: Object, default: () => {} }, // 代理配置
    toolbarConfig: { type: Object, default: () => ({}) }, // 工具栏配置
    rowId: { type: String, default: '_rowId' }, // 行主键
    footerActionConfig: { type: Object, default: () => {} }, // 脚步配置pageConfig、showPager、showBorder、pageInLeft
    beforeInsert: { type: Function, default: () => {} }, // 插入数据前的钩子函数
    scopedSlots: { type: Object, default: () => {} } // 插槽
  },
  data() {
    return {
      tableData: [],
      tableColumns: [],
      visibleColumns: [],
      fixedColumns: [],
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
      editStore: {
        editRow: {},
        insertList: [],
        removeList: [],
        updateList: [],
        pendingList: []
      },
      pager: {
        pageNum: 1,
        pageSize: ((this.footerActionConfig || {}).pageConfig || {}).pageSize || 10
      },
      replaceControl: false,
      tableSourceData: [],
      editProps: {},
      headerCheckedColumns: [],
      loadingField: false
    }
  },
  computed: {
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
      const arr = plat(this.visibleColumns)

      return arr
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
      const { visibleColumns } = this
      return Boolean(visibleColumns.find(d => d.type === 'expand'))
    },
    useGroupColumn() {
      const { tableData } = this
      return tableData && tableData.find(d => typeof d.children !== 'undefined')
    },
    showToolbar() {
      const { drag, search, toolbarConfig = {}, sortConfig = {}, $slots } = this
      let show = false
      for (const key in toolbarConfig) {
        const item = toolbarConfig[key]
        if (key === 'buttons') {
          if (Array.isArray(item) && item.length) show = true
        } else if (key === 'columnControl') {
          if (drag && item) show = true
        } else if (['refresh', 'diySearch', 'fullscreen', 'editHistory', 'showReplace', 'columnBatchControl', 'subtotal'].indexOf(key) > -1 && item) show = true
      }
      if ($slots.toolbar || search || sortConfig.multiple) show = true
      return show
    },
    tableId() {
      return (~~(Math.random() * (1 << 30))).toString(36)
    }
  },
  watch: {
    scrollTop(val) {
      if (val > 2) {
        this.scrolling = true
        setTimeout(() => {
          this.scrolling = false
        }, 200)
      }
    },
    scrollLeft(val) {
      if (val > 2) {
        this.scrolling = true
        setTimeout(() => {
          this.scrolling = false
        }, 100)
      }
    },
    data(data, oldData) {
      if (this.scrolling) return
      this.loadTableData(data)
    },
    columns(val) {
      this.tableColumns = val
    },
    tableColumns(tableColumns) {
      const columns = tableColumns.reduce((acc, column) => {
        const { fixed = 'center' } = column
        acc[fixed] ? acc[fixed].push(column) : acc.center.push(column)
        return acc
      }, { left: [], center: [], right: [] })
      this.fixedColumns = columns
      this.visibleColumns = [...Object.values(columns).reduce((acc, cur) => acc.concat(cur.filter(d => d.show !== false)), [])]
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
    const { rowDrag, tableColumns } = this
    if (rowDrag && !tableColumns.some(d => d.type === 'row-drag')) {
      this.columns.unshift({
        show: true,
        type: 'row-drag',
        titleSuffix: { icon: 'question', message: '上下拖动排序' },
        width: 40
      })
    }
    const setColumnWidth = column => {
      const { width, children = [] } = column
      if (children.length) {
        column.width = getColumnChildrenWidth(children, this.spaceWidth)
      } else {
        if (!width) {
          column.width = 0
        }
      }
    }
    this.columns.forEach(d => {
      setColumnWidth(d)
    })
    this.tableColumns = [...this.columns]
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
    loadTableData(data = this.data) {
      const { editStore, rowId } = this
      this.tableData =
        data.map((d, i) => {
          !d[rowId] && this.$set(d, rowId, XEUtils.uniqueId('_rowId'))
          return d
        }) || []
      this.tableSourceData = XEUtils.clone(data, true)
      editStore.insertList = []
      if (rowId === '_rowId') {
        this.clearStatus()
        this.clearValidate()
      }
      this.updateCache()
      this.clearScroll()
      this.resize()
      return this.$nextTick()
    },
    reloadData(data = null) {
      this.clearStatus()
      this.clearValidate()
      this.clearSelection()
      this.expands = []
      if (!data) {
        data = this.data
      }
      this.loadTableData(data)
    },
    clearStatus() {
      this.editStore = Object.assign(
        {},
        {
          editRow: {},
          insertList: [],
          removeList: [],
          updateList: [],
          pendingList: []
        }
      )
    },
    updateRow(row) {
      const { rowId } = this
      const rowIndex = this.tableData.findIndex(d => d[rowId] === row[rowId])
      this.$set(this.tableData, rowIndex, row)
      const fields = []
      for (const prop in row) {
        const columnIndex = this.bodyColumns.findIndex(d => d.prop === prop)
        columnIndex > -1 &&
          fields.push({
            row,
            rowIndex,
            columnIndex,
            content: getFieldValue(row, prop)
          })
      }
      this.editField(fields)
    },
    editField(fileds, copy) {
      // console.log('fileds', JSON.stringify(fileds, null, 2))
      const updateArr = []
      fileds.forEach(filed => {
        const { visibleColumns, updateStatus } = this
        const { row, rowIndex, columnIndex, content } = filed
        const column = visibleColumns[columnIndex] || {}
        const { prop, rules } = column

        if (prop) {
          if (
            !filed.notUpdateTableEvent &&
            content !== getFieldValue(row, prop)
          ) {
            updateArr.push({
              rowIndex,
              columnIndex,
              newData: content,
              oldData: getFieldValue(row, prop)
            })
          }
          if (copy) {
            const { config, edit: { render = {}} = {}} = column
            const opts = XEUtils.merge({ name: 'input' }, config, render)
            if (!opts.name) opts.name = 'input'
            const { name, props } = opts
            if (name === 'input') {
              setFieldValue.call(this, this, row, prop, content)
            } else if (name === 'select') {
              const options = getOptions(opts, { root: this, table: this, vue: this, data: row, row, rowIndex, column, columnIndex, prop: render.prop || prop, edit: this })
              const { labelKey = 'label', valueKey = 'value' } = props || {}
              if (options.length) {
                const option = options.find(d => d[labelKey] === content)
                setFieldValue.call(this, this, row, prop, option ? option[valueKey] : '')
              }
            } else if (name === 'date-picker') {
              let date = content
              if (!XEUtils.isValidDate(content)) {
                const toStringDate = XEUtils.toStringDate(content)
                date = XEUtils.isValidDate(toStringDate) ? toStringDate : ''
              }
              setFieldValue.call(this, this, row, prop, date)
            } else if (name === 'cascader') {
              if (!XEUtils.isArray(content)) return setFieldValue.call(this, this, row, prop, [])
            }
          } else {
            setFieldValue.call(this, this, row, prop, content)
          }
          if (rules && rules.length) {
            this.validateField(prop, rules, row)
          }
          updateStatus(row, prop)
        }
      })

      if (updateArr.length) {
        this.$emit('table-update-data', updateArr)
      }
    },
    updateStatus(row, prop) {
      if (!prop) return

      const sourceRow = this.tableSourceData.find(
        d => d[this.rowId] === row[this.rowId]
      )
      if (!sourceRow) return

      const isInsert = this.editStore.insertList.find(
        d => d[this.rowId] === row[this.rowId]
      )
      if (isInsert) return

      const newRow = { ...row }
      newRow.$old = { ...sourceRow }
      const index = this.editStore.updateList.findIndex(
        d => d[this.rowId] === row[this.rowId]
      )
      let isSome = true
      for (const key in sourceRow) {
        if (row[key] !== sourceRow[key]) {
          isSome = false
          break
        }
      }
      if (isSome) {
        index > -1 && this.editStore.updateList.splice(index, 1)
      } else {
        index === -1
          ? this.editStore.updateList.push(newRow)
          : this.editStore.updateList.splice(index, 1, newRow)
      }
    },
    // 更新数据行map
    updateCache() {
      const { tableData, rowId } = this
      if (!this.tableDataMap) {
        Object.assign(this, {
          tableDataMap: new Map()
        })
      }
      this.tableDataMap.clear()
      tableData.forEach(d => {
        this.tableDataMap.set(d[rowId], d)
      })
    },
    rootMousemove(event) {
      this.$emit('table-mouse-move', { event })
    },
    rootMouseup(event) {
      this.$emit('table-mouse-up', { event: event })
    },
    setEditIsStop(val) {
      this.editIsStop = val
    },
    focus(rowIndex, prop) {
      this.edit && this.$refs.edit.focus(rowIndex, prop)
    },
    handleDragend(column) {
      const { tableColumns } = this
      const index = tableColumns.some(d => d === column)
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
    expandChange(obj) {
      const { rowId } = obj
      const expand = this.expands.find(d => d.rowId === rowId)
      if (expand) {
        this.$set(expand, 'expanded', !expand['expanded'])
      } else {
        obj.expanded = true
        this.expands.push(obj)
      }
      this.$nextTick(() => {
        // 设置 expand 高度
        const expand = this.expands.find(d => d.rowId === rowId)
        if (expand.expanded) {
          expand.height = document.querySelector('.expandid-' + rowId).offsetHeight
        }
        this.$emit('expand-change', this.expands)
      })
    },
    searchChange(val) {
      // console.log('search change', JSON.stringify(val, null, 2))
      this.searchForm = val
      this.$emit('search-change', val)
      if (this.proxyConfig) this.commitProxy('query')
    },
    clearSearch() {
      this.searchForm = []
      this.tableForm = []
      this.$emit('update:form', {})
    },
    getTableData() {
      return this.tableData
    },
    getFullData(source) {
      if (source) {
        const data = XEUtils.clone(this.tableData, true)
        return this.rowId === '_rowId' ? data.map(d => {
          // 如果是默认生成的主键，返回数据时去除该主键
          delete d[this.rowId]
          return d
        }) : data
      }
      return this.tableData
    },
    getEditStore() {
      const editStore = XEUtils.clone(this.editStore, true)
      editStore.insertList.map(d => {
        // 如果是默认生成的主键，返回数据时去除该主键
        delete d[this.rowId]
        return d
      })
      return editStore
    },
    // 获取选中的列
    getCheckColumns() {
      return XEUtils.clone(this.headerCheckedColumns, true)
    }
  }
}
</script>
