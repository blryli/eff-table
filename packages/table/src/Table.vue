<template>
  <div
    :key="tableId"
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
      v-if="showFooterToolbar"
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

    <!-- 列批量控制 -->
    <column-batch-control
      v-if="border && drag && (toolbarConfig || {}).columnBatchControl"
      ref="columnBatchControl"
      v-model="tableColumns"
      @cardClose="handleCardClose"
    />

    <!-- 批量替换 -->
    <replace v-if="toolbarConfig.replace" ref="replace" :columns="bodyColumns.filter(d => !d.type)" />
    <!-- <sort v-if="sortConfig.multiple" ref="sort" /> -->
    <!-- 编辑 -->
    <edit v-if="edit" ref="edit" :columns="bodyColumns" />
    <!-- 高级查询 -->
    <SeniorQuery v-if="isSeniorQuery" ref="seniorQuery" :field-list="seniorQueryList" @change="handleSeniorQuery" />
    <!-- <p>treeIds -  {{ treeIds }}</p> -->
    <!-- <p>tableData -  {{ tableData }}</p> -->

    <!-- 气泡 -->
    <Popovers ref="popovers" />

    <!-- 列宽度调整辅助线 -->
    <div v-show="lineShow" ref="line" class="eff-table-line" />

    <!-- expand插槽 -->
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
import tree from '../mixins/tree'
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
import SeniorQuery from 'pk/senior-query'
// import Sort from '../components/Sort/index'
import XEUtils from 'xe-utils'
import { getFieldValue, setFieldValue, getSubfieldColumns, getComColumns } from 'pk/utils'
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
    SeniorQuery
    // Sort
  },
  mixins: [
    Column,
    Layout,
    Selection,
    validate,
    sort,
    virtual,
    shortcutKey,
    proxy,
    tree
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
    editConfig: { type: Object, default: () => {} },
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
    headerContextmenu: { type: Boolean, default: true }, // 表头右键扩展菜单
    showOverflowTooltip: Boolean,
    cellClassName: { type: [String, Function], default: '' },
    rowClassName: { type: [String, Function], default: '' },
    messages: { type: Array, default: () => [] },
    selectRange: Boolean, // 表格区域选择
    copy: Boolean, // 复制功能
    formConfig: { type: Object, default: () => {} }, // 表单配置
    proxyConfig: { type: Object, default: () => {} }, // 代理配置
    toolbarConfig: { type: Object, default: () => ({}) }, // 工具栏配置
    treeConfig: { type: Object, default: () => ({}) }, // 树配置
    columnConfig: { type: Object, default: () => ({}) }, // 列配置
    seniorQueryConfig: { type: Object, default: () => ({}) }, // 高级搜索配置
    rowId: { type: String, default: '_rowId' }, // 行主键
    footerActionConfig: { type: Object, default: () => {} }, // 脚步配置pageConfig、showPager、showBorder、pageInLeft
    beforeInsert: { type: Function, default: () => {} }, // 插入数据前的钩子函数
    scopedSlots: { type: Object, default: () => {} }, // 插槽
    spanMethod: { type: Function, default: () => {} } // 行列合并
  },
  data() {
    return {
      tableData: Object.freeze([]),
      tableColumns: [],
      visibleColumns: [],
      fixedColumns: [],
      tableForm: {},
      searchForm: [],
      currentRow: null,
      lineShow: false,
      isScreenfull: false,
      tableBodyEl: null,
      hoverRowid: null,
      expands: [],
      expand: null,
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
      headerCheckedColumns: [],
      selectRengeStore: [], // 复制功能选中范围
      loadingField: false,
      seniorQuery: [], // 高级搜索
      subtotalColumns: [], // 小计列
      subtotalData: [], // 小计数据
      seniorQueryList: [], // 高级查询
      $message: this.$message,
      isSpanMethod: false, // 合并列,
      tableMaxHeight: this.maxHeight
    }
  },
  computed: {
    bodyColumns() {
      const { width } = this.tableColumnConfig
      const plat = arr => {
        return arr.reduce((acc, cur) => {
          const { children = [] } = cur
          if (!cur.width && width) cur.width = width
          if (children.length) {
            children.forEach(d => cur.fixed && (d.fixed = cur.fixed))
            return acc.concat(plat(children))
          }
          return acc.concat(cur)
        }, [])
      }
      const columns = this.visibleColumns
      // if (sort.length) {
      //   columns = columns.sort((a, b) => sort.indexOf(a.prop))
      // }
      return plat(columns)
    },
    style() {
      const style = {}
      const { isScreenfull, height, tableMaxHeight } = this
      style['--rowHeight'] = this.rowHeight + 'px'
      if (!isScreenfull) {
        if (height) style.height = height + 'px'
        if (tableMaxHeight) style.maxHeight = tableMaxHeight + 'px'
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
      const { drag, search, toolbarConfig = {}, $slots } = this
      let show = false
      for (const key in toolbarConfig) {
        const item = toolbarConfig[key]
        if (key === 'buttons') {
          if (Array.isArray(item) && item.length) show = true
        } else if (key === 'columnControl') {
          if (drag && item) show = true
        } else if (['refresh', 'seniorQuery', 'fullscreen', 'editHistory', 'replace', 'columnBatchControl', 'subtotal'].indexOf(key) > -1 && item) show = true
      }
      if ($slots.toolbar || search) show = true
      return show
    },
    showFooterToolbar() {
      const { footerActionConfig = {}, $slots } = this
      const { buttons = [], showPager } = footerActionConfig
      return buttons.length || showPager || $slots.footer_action
    },
    isSeniorQuery() {
      const { toolbarConfig } = this
      const { seniorQuery } = toolbarConfig || {}
      return seniorQuery
    },
    tableId() {
      return (~~(Math.random() * (1 << 30))).toString(36)
    }
  },
  watch: {
    scrollTop(val) {
      if (val > 2) {
        this.scrolling = true
        const timer = setTimeout(() => {
          this.scrolling = false
          clearTimeout(timer)
        }, 100)
      }
    },
    scrollLeft(val) {
      if (val > 2) {
        this.scrolling = true
        const timer = setTimeout(() => {
          this.scrolling = false
          clearTimeout(timer)
        }, 100)
      }
    },
    data(data, oldData) {
      if (this.scrolling) return
      this.loadTableData(data)
    },
    columns(val) {
      this.fixedColumns = getSubfieldColumns(val)
      this.tableColumns = Object.values(this.fixedColumns).reduce((acc, cur) => acc.concat(cur), [])
    },
    tableColumns(tableColumns) {
      // 设置列长度（包含子集）
      const setColumnLen = (column, columnCopy) => {
        const { children } = column
        if ((children || []).length) {
          column.children = children.reduce((acc, cur) => {
            return cur.show !== false ? acc.concat(setColumnLen(cur, columnCopy)) : acc
          }, [])
        } else {
          columnCopy.columnLen += 1
        }
        return column
      }
      this.visibleColumns = tableColumns.reduce((acc, column) => {
        if (column.show !== false) {
          if (column.columnLen === undefined) column.columnLen = 0
          return acc.concat(!column.columnLen ? setColumnLen(column, column) : column)
        }
        return acc
      }, [])
    },
    'tableColumns.length'() {
      this.resize()
    },
    loading(val) {
      this.isLoading = val
    },
    form(val) {
      this.tableForm = val
    }
  },
  created() {
    const { rowDrag, tableColumns, seniorQueryConfig } = this
    if (rowDrag && !tableColumns.some(d => d.type === 'row-drag')) {
      this.columns.unshift({
        show: true,
        type: 'row-drag',
        titleSuffix: { icon: 'question', message: '上下拖动排序' },
        width: 40
      })
    }
    const { fieldList } = seniorQueryConfig
    this.seniorQueryList = fieldList

    this.tableColumns = getComColumns(this.columns)
    Object.assign(this, {
      tableSourceData: Object.freeze([]),
      tableDataMap: new Map(),
      tableEditConfig: Object.assign({ trigger: 'click', editStop: false, editLoop: true }, this.editConfig),
      tableColumnConfig: Object.assign({ sort: [], width: 0 }, this.columnConfig),
      tableTreeConfig: Object.assign({ children: 'children' }, this.treeConfig)
    })
    if ((this.data || []).length) {
      this.loadTableData(this.data)
    }
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
  destroyed() {
    this.destroy()
  },
  methods: {
    destroy() {
      for (const key in this.$data) {
        this.$data[key] = null
      }
    },
    loadTableData(data = this.data, opts = { clearScroll: true }) {
      const { editStore, rowId } = this
      this.tableData =
        Object.freeze(data.map((d, i) => {
          !d[rowId] && this.$set(d, rowId, XEUtils.uniqueId('_rowId'))
          return d
        }) || [])
      this.tableSourceData = Object.freeze(XEUtils.clone(data, true))
      editStore.insertList = []
      if (rowId === '_rowId') {
        this.clearStatus()
        this.clearValidate()
      }
      this.updateCache()
      opts.clearScroll && this.clearScroll()
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
      const data = XEUtils.clone(this.tableData)
      data[rowIndex] = row
      this.tableData = Object.freeze(data)
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
      return this.editField(fields)
    },
    handleCopy({ row, rowIndex, column, columnIndex, prop, content }) {
      const { config, edit: { render = {}} = {}} = column
      const opts = XEUtils.merge({ name: 'input' }, config, render)
      if (!opts.name) opts.name = 'input'
      const { name, props } = opts
      if (name === 'input') {
        setFieldValue.call(this, this, row, prop, content)
      } else if (name === 'select') { // 下拉框
        const options = getOptions(opts, { root: this, table: this, vue: this, data: row, row, rowIndex, column, columnIndex, prop: render.prop || prop, edit: this })
        const { labelKey = 'label', valueKey = 'value', mutiple } = props || {}
        const getValue = value => {
          const option = options.find(d => d[labelKey] === value || d[valueKey] === value)
          return option ? option[valueKey] : ''
        }
        // 匹配到label或value才会赋值，否则置空
        if (options.length) {
          if (mutiple && content.indexOf('，') > -1) {
            const ct = content.split('，').reduce((acc, cur) => {
              const val = getValue(cur)
              return val ? acc.concat([val]) : acc
            }, [])
            setFieldValue.call(this, this, row, prop, ct)
          } else {
            setFieldValue.call(this, this, row, prop, getValue(content))
          }
        }
      } else if (name === 'date-picker') { // 日期
        const format = props.valueFormat || props['value-format']
        let date = content
        if (!XEUtils.isValidDate(content)) {
          // 能转化成日期的才会赋值
          const toStringDate = XEUtils.toStringDate(content, format)
          date = XEUtils.isValidDate(toStringDate) ? toStringDate : ''
        }
        setFieldValue.call(this, this, row, prop, date)
      } else if (name === 'cascader') { // 级联选择器
        const options = getOptions(opts, { root: this, table: this, vue: this, data: row, row, rowIndex, column, columnIndex, prop: render.prop || prop, edit: this })
        const { label = 'label', value = 'value', children = 'children' } = props.props
        const getOpts = (options, parent = []) => {
          return options.reduce((acc, cur, idx) => {
            const l = cur[label]
            const v = cur[value]
            if (cur[children]) {
              return acc.concat(getOpts(cur[children], parent.concat([{ label: l, value: v }])))
            }
            acc.push(parent.concat([{ label: l, value: v }]))
            return acc
          }, [])
        }
        const paths = getOpts(options)
        let showValue = ''
        if (props['show-all-levels'] === false) { // 仅显示最后一级
          const path = paths.find(pa => pa.find(d => Object.values(d).indexOf(content) > -1))
          if (path) showValue = path.map(d => d[value])
        } else { // 全路径
          const getStr = path => {
            return path.reduce((acc, cur) => {
              const l = cur[label]
              const v = cur[value]
              acc.labelStr += acc.labelStr ? '/' + l : l
              acc.valueStr += acc.valueStr ? '/' + v : v
              return acc
            }, { labelStr: '', valueStr: '' })
          }
          const path = paths.find(d => Object.values(getStr(d)).indexOf(content) > -1)
          if (path) showValue = path.map(d => d[value])
        }
        return setFieldValue.call(this, this, row, prop, showValue)
      } else if (name === 'switch') { // 开关
        const { props = {}} = opts
        const activeValue = props['active-value'] || true
        const inactiveValue = props['inactive-value'] || false
        let data = content
        if (content === 'true') {
          data = activeValue
        } else if (content === 'false') {
          data = inactiveValue
        } else {
          if ([activeValue, inactiveValue, '1', '0'].indexOf(content) < 0) {
            data = '0'
          }
        }

        setFieldValue.call(this, this, row, prop, data)
      }
    },
    editField(fileds, copy) {
      // console.log('fileds', JSON.stringify(fileds, null, 2))
      const updateArr = []
      fileds.forEach(filed => {
        const { visibleColumns, updateStatus, tableData } = this
        const { rowIndex, columnIndex } = filed
        const content = filed.content.trim()
        let { row } = filed
        if (!row) row = tableData[rowIndex]
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
            this.handleCopy({ row, rowIndex, column, columnIndex, prop, content })
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
      this.dataChange()
      return this.$nextTick()
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
      return this.$nextTick()
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
    setEditStop(val) {
      this.tableEditConfig.editStop = val
    },
    tableEditPause() {
      this.tableEditConfig.editStop = true
    },
    tableEditRegain() {
      this.tableEditConfig.editStop = true
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
    dataChange() {
      const { tableData, getEditStore } = this
      const editStore = getEditStore()
      this.$emit('data-change', { tableData, editStore })
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
    },
    // 获取表格列，用于记忆功能
    getColumnsStore() {
      return this.tableColumns.map(column => {
        const { show, type, prop, fixed = '', width = 0 } = column
        return { show, type, prop, fixed, width }
      })
    },
    // 小计
    subtotal() {
      const { headerCheckedColumns, tableColumns } = this
      if (headerCheckedColumns.length) {
        const columns = [...tableColumns]
        columns.map(d => {
          if (headerCheckedColumns.some(h => h === d)) {
            d.order = 'asc'
          }
        })
        this.tableColumns = [...columns]
        this.sortChange(null, true).then(() => {
          const tableData = XEUtils.clone(this.tableData, true)
          if (tableData.length) {
            this.subtotalColumns = headerCheckedColumns.filter(column => {
              let isNumber = true
              tableData.slice(0, 2).forEach(d => {
                const { prop } = column
                if (prop && !XEUtils.toNumber(d[prop])) isNumber = false
              })
              return isNumber
            })
            const subtotalData = []
            this.subtotalColumns.forEach(column => {
              const { prop } = column
              let curNum = null
              let accumulation = 0
              tableData.forEach((d, i) => {
                const num = XEUtils.toNumber(d[prop])
                const prevNum = i > 0 ? accumulation / XEUtils.toNumber(tableData[i - 1][prop]) : 0
                const last = i === tableData.length - 1
                if (num) {
                  if (i === 0) {
                    accumulation = num
                    curNum = num
                  } else if (num !== curNum) {
                    subtotalData.push({ index: i - 1, len: prevNum, row: { [prop]: accumulation, subtotal: true }})
                    if (last) {
                      subtotalData.push({ index: i, len: 1, row: { [prop]: num, subtotal: true }})
                    }
                    accumulation = num
                    curNum = num
                  } else {
                    accumulation += num
                    if (last) {
                      subtotalData.push({ index: i, len: prevNum + 1, row: { [prop]: accumulation, subtotal: true }})
                    }
                  }
                }
              })
            })
            this.subtotalData = subtotalData
          }
          // const data = this.tableData
        })
      } else {
        this.$message.warning('请先选择列！')
      }
    },
    seniorQueryOpen() {
      const { seniorQuery } = this.$refs
      seniorQuery && seniorQuery.open()
    },
    handleSeniorQuery(seniorQuery) {
      this.seniorQuery = seniorQuery
      this.$emit('senior-query', seniorQuery)
      this.commitProxy('query')
    }
  }
}
</script>
