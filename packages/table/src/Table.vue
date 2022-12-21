<template>
  <div
    ref="tableWrapper"
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
          :visible-columns="rowHeight === 'auto' ? visibleColumns : visibleColumns.filter(d => d.fixed === 'left')"
          :body-columns="rowHeight === 'auto' ? bodyColumns : bodyColumns.filter(d => d.fixed === 'left')"
          fixed="left"
          @dragend="handleDragend"
          @sort-change="sortChange"
        />
        <TableBody
          ref="leftBody"
          :body-columns="rowHeight === 'auto' ? bodyColumns : bodyColumns.filter(d => d.fixed === 'left')"
          :data="tableData"
          fixed="left"
          :validators="validators"
          :messages="messages"
        />
        <TableFooter
          v-if="showSummary"
          :data="tableData"
          :columns="rowHeight === 'auto' ? bodyColumns : bodyColumns.filter(d => d.fixed === 'left')"
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
      v-if="drag || rowDrag"
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
    <SeniorQuery v-if="isSeniorQuery" ref="seniorQuery" :data="seniorQueryList" @search="handleSeniorQuery" />
    <!-- <p>tableData -  {{ tableData }}</p> -->

    <!-- 气泡 -->
    <Popovers ref="popovers" />

    <!-- 过滤 -->
    <EffFilter v-if="useFilter" ref="filter" />

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
import expand from '../mixins/expand'
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
import SelectRange from '../components/SelectRange'
import Copy from '../components/Copy'
import columnBatchControl from '../components/ColumnBatchControl'
import Replace from '../components/Replace'
import EffFilter from '../components/Filter'
import SeniorQuery from 'pk/senior-query'
// import Sort from '../components/Sort'
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
    SeniorQuery,
    EffFilter
    // Sort
  },
  mixins: [
    Column,
    Layout,
    Selection,
    validate,
    sort,
    virtual,
    expand,
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
    data: { type: Array, default: () => ([]) }, // table 数据源
    form: { type: Object, default: () => ({}) }, // 搜索行数据
    rowId: { type: String, default: '_rowId' }, // 行主键
    height: { type: [Number, String], default: 0 }, // 表格高度
    maxHeight: { type: Number, default: 0 }, // 表格最大高度
    baseRowHeight: { type: Number, default: 36 }, // 行以外的默认高度
    rowHeight: { type: [Number, String], default: 36 }, // 行高度
    toolbarHeight: { type: [Number, String], default: 36 }, // 工具栏高度
    headerRowHeight: { type: [Number, String], default: 36 }, // header行高度
    border: Boolean, // 是否带有纵向边框
    stripe: Boolean, // 是否带有斑马线
    highlightCurrentRow: Boolean, // 是否高亮显示行
    showOverflowTooltip: Boolean, // 是否单元格文本不换行，溢出文本用提示框展示
    loading: Boolean, // 是否显示表格loading效果
    headerContextmenu: { type: Boolean, default: true }, // 表头右键扩展菜单
    rowClassName: { type: [String, Function], default: '' }, // 行的 className
    cellClassName: { type: [String, Function], default: '' }, // 单元格的 className
    emptyText: { type: String, default: '暂无数据' }, // 空数据时显示的文本内容
    showHeader: { type: Boolean, default: true }, // 是否显示表头
    showSummary: Boolean, // 合计
    sumText: { type: String, default: '合计' }, // 合计行第一列的文本
    keyword: { type: String, default: '' }, // 合计行第一列的文本
    summaryMethod: { type: Function, default: null }, // 合计方法
    messages: { type: Array, default: () => [] }, // 单元格提示信息集合
    beforeInsert: { type: Function, default: () => {} }, // 插入数据前的钩子函数
    scopedSlots: { type: Object, default: () => {} }, // 插槽
    spanMethod: { type: Function, default: () => {} }, // 行列合并方法
    drag: Boolean, // 是否开启列拖动功能
    rowDrag: Boolean, // 是否开启行拖动功能
    search: Boolean, // 是否开启搜索行功能
    edit: Boolean, // 是否开启编辑功能
    copy: Boolean, // 是否开启复制功能
    selectRange: Boolean, // 表格区域选择功能，（复制功能打开时默认开启）
    editConfig: { type: Object, default: () => {} }, // 编辑配置
    checkboxConfig: { type: Object, default: () => ({}) }, // 编辑配置
    sortConfig: { type: Object, default: () => ({}) }, // 排序配置
    formConfig: { type: Object, default: () => {} }, // 表单配置
    proxyConfig: { type: Object, default: () => {} }, // 代理配置
    toolbarConfig: { type: Object, default: () => ({}) }, // 工具栏配置
    treeConfig: { type: Object, default: () => ({}) }, // 树配置
    expandConfig: { type: Object, default: () => ({}) }, // 展开行配置
    columnConfig: { type: Object, default: () => ({}) }, // 列配置
    seniorQueryConfig: { type: Object, default: () => ({}) }, // 高级搜索配置
    footerActionConfig: { type: Object, default: () => {} } // 脚步配置pageConfig、showPager、showBorder、pageInLeft
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
      isSpanMethod: false, // 是否存在合并行或列,
      tableMaxHeight: this.maxHeight,
      useFilter: false, // 是否使用过滤功能
      filters: [] // 过滤集合
      // mergerCells: [] // 合并行或列
    }
  },
  computed: {
    bodyColumns() {
      const { tableColumnConfig, rowDrag, tableColumns, isSpanMethod } = this

      const { width } = tableColumnConfig
      const plat = arr => {
        return arr.reduce((acc, cur) => {
          const { children = [], minWidth = 30 } = cur
          if (!cur.width && width) cur.width = width
          // 设置最小宽度
          const { edit, sortable, titlePrefix, titleSuffix } = cur
          const widths = [
            { el: edit, width: 16 },
            { el: sortable, width: 20 },
            { el: titlePrefix, width: 18 },
            { el: titleSuffix, width: 18 },
            { el: cur.rules && Boolean(cur.rules.find(d => d.required)), width: 12 }
          ]
          const min_width = widths.reduce((acc, cur) => cur.el ? acc + cur.width : acc, this.isTypeColumn(cur) ? 30 : 72)
          cur.minWidth = Math.max(min_width, minWidth)
          cur.width = this.isTypeColumn(cur) ? 30 : Number(cur.width || 0) // 兼容非数字格式
          if (children.length) {
            children.forEach(d => cur.fixed && (d.fixed = cur.fixed))
            return acc.concat(plat(children))
          }
          return acc.concat(cur)
        }, [])
      }
      // 行拖动列
      if (!isSpanMethod && rowDrag && !tableColumns.find(d => d.type === 'row-drag')) {
        tableColumns.unshift({
          show: true,
          type: 'row-drag',
          titleSuffix: { icon: 'question', message: '上下拖动排序' },
          width: 40
        })
      }
      // if (sort.length) {
      //   columns = columns.sort((a, b) => sort.indexOf(a.prop))
      // }
      return plat(this.visibleColumns)
    },
    baseHeight() {
      return Math.max(this.baseRowHeight, 30)
    },
    _rowHeight() {
      const { rowHeight } = this
      return Math.max(Number(rowHeight !== 'auto' ? rowHeight : 0), 30)
    },
    style() {
      const style = {}
      const { isScreenfull, height } = this
      if (!isScreenfull) {
        if (height) style.height = height + 'px'
      }

      return style
    },
    afterData() {
      const { tableData, filters, sorts, sortConfig = {}, tableId, rowId } = this
      let data = tableData.slice(0)
      // 筛选数据
      if (filters && filters.length) {
        data = data.filter(row => {
          return filters.every(filter => {
            const { column, values } = filter
            const { filterMethod, columnId, prop } = column
            const value = XEUtils.get(row, prop)
            if (values.length) {
              if (filterMethod) {
                const cell = document.getElementById(`${tableId}-${row[rowId]}-${columnId}`)
                const cellValue = cell ? cell.innerText : value
                return values.some(value => filterMethod({ value, option: filter, cellValue, row, column, $table: this }))
              }
              return values.indexOf(value) > -1
            }
            return true
          })
        })
      }
      // 数据排序
      if (sorts && sorts.length) {
        const { sortMethod, remote } = sortConfig
        const sort = sorts.reduce((acc, column) => {
          const { prop, order } = column
          return acc.concat([XEUtils.isFunction(sortMethod) ? [sortMethod({ data, column, prop, order, $table: this })] : [prop, order]])
        }, [])
        !remote && sort.length && (data = XEUtils.sortBy(data, sort))
      }
      return data
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
    const { seniorQueryConfig } = this
    const { fieldList } = seniorQueryConfig
    this.seniorQueryList = fieldList

    this.tableColumns = getComColumns(this.columns)
    Object.assign(this, {
      loadData: false,
      tableSourceData: Object.freeze([]),
      tableDataMap: new Map(),
      tableEditConfig: Object.assign({ trigger: 'click', editStop: false, editLoop: true }, this.editConfig),
      tableColumnConfig: Object.assign({ sort: [], width: 0 }, this.columnConfig),
      tableTreeConfig: Object.assign({ lazy: false, loadMethod: ({ row }) => {}, children: 'children', defaultExpandeds: [] }, this.treeConfig),
      tableExpandConfig: Object.assign({ expandAll: false, defaultExpandeds: [], onlyField: '' }, this.expandConfig)
    })
    if ((this.data || []).length) {
      this.loadTableData(this.data)
    }
  },
  mounted() {
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
      const { editStore, rowId, loadData, useExpand } = this
      this.tableData = Object.freeze(XEUtils.mapTree(data, d => {
        !d[rowId] && this.$set(d, rowId, XEUtils.uniqueId())
        return d
      }))
      this.tableSourceData = Object.freeze(XEUtils.toTreeArray(XEUtils.clone(data, true)))
      editStore.insertList = []
      if (rowId === '_rowId') {
        this.clearStatus()
        this.clearValidate()
      }
      this.updateCache()
      opts.clearScroll && this.clearScroll()
      this.resize()
      if (!loadData) {
        useExpand && this.initExpand()
        this.loadData = true
        // this.updateRow(this.tableData[0])
      }
      return this.$nextTick()
    },
    reloadData(data = null) {
      this.clearStatus()
      this.clearValidate()
      this.clearSelection()
      this.clearRowExpand()
      this.clearTreeExpand()
      if (!data) {
        data = this.data
      }
      this.loadTableData(data)
    },
    initExpand() {
      const { tableExpandConfig } = this
      if (!tableExpandConfig) return
      const { expandAll, defaultExpandeds, onlyField } = tableExpandConfig
      const hasExpand = row => !onlyField || onlyField && row[onlyField]
      setTimeout(() => {
        if (expandAll) {
          this.tableData.forEach(row => {
            hasExpand(row) && this.toggleRowExpand(row)
          })
        } else {
          defaultExpandeds.forEach(rowId => {
            const row = this.tableDataMap.get(rowId)
            hasExpand(row) && this.toggleRowExpand(row)
          })
        }
      }, 300)
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
        setFieldValue.call(this, row, prop, content)
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
            setFieldValue.call(this, row, prop, ct)
          } else {
            setFieldValue.call(this, row, prop, getValue(content))
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
        setFieldValue.call(this, row, prop, date)
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
        return setFieldValue.call(this, row, prop, showValue)
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

        setFieldValue.call(this, row, prop, data)
      }
    },
    editField(fileds, copy) {
      // console.log('fileds', JSON.stringify(fileds, null, 2))
      const updateArr = []
      fileds.forEach(filed => {
        const { visibleColumns, updateStatus, tableData } = this
        const { rowIndex, columnIndex } = filed
        const content = XEUtils.isString(filed.content) ? filed.content.trim() : filed.content
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
            setFieldValue.call(this, row, prop, content)
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
      const rowid = row[this.rowId]

      const sourceRow = this.tableSourceData.find(
        d => d[this.rowId] === rowid
      )
      if (!sourceRow) return

      const isInsert = this.editStore.insertList.find(
        d => d[this.rowId] === rowid
      )
      if (isInsert) return

      const newRow = { ...row }
      newRow.$old = { ...sourceRow }
      const index = this.editStore.updateList.findIndex(
        d => d[this.rowId] === rowid
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
      const { tableData, rowId, tableTreeConfig: { children = 'children' } = {}} = this
      if (!this.tableDataMap) {
        Object.assign(this, {
          tableDataMap: new Map()
        })
      }
      this.tableDataMap.clear()
      const setMap = data => {
        data.forEach(d => {
          this.tableDataMap.set(d[rowId], d)
          const childs = d[children]
          if (childs && childs.length) {
            setMap(childs)
          }
        })
      }
      setMap(tableData)
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
    toX(placement) {
      this.edit && this.$refs.edit.toX(placement)
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
