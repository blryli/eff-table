<template>
  <div class="page-home page">
    <Document title="table" :form="documentForm">
      <h2>Table 表格 <router-link class="page-router" to="/Full">查看示例</router-link></h2>
    </Document>
  </div>
</template>

<script>
import Document from '../../components/Document.vue'

export default {
  name: 'TableApi',
  components: {
    Document
  },
  data() {
    return {
      documentForm: {
        props: [
          {
            attribute: 'columns / v-model',
            explain: '列配置数据',
            type: 'array',
            choosable: '',
            default: '[]',
            code:
`
  [
    {
      show: true,// boolean 列是否显示

      type: '', // string selection/radio/index/expand

      width: 80, // number  列宽度

      minWidth: null, // number  列最小宽度

      fixed: '', // string left/right 固定列

      align: 'left', // string left/center/right  单元格对齐方式

      // 通用配置，会根据name指定的元素对单元格做渲染模式、编辑模式、搜索模式的默认处理，原则上只需要配置config就可以了
      config: {
        name: 'input', // 指定ui元素
        options: [], // select组件需要
        format: ({row, rowIndex, column, columnIndex, prop}) => {}, // 格式化单元格内容
        defaultValue: '', // 新增行指定默认值，非必须
      }, 

      // table标题 (优先级 titleRender > type > title)
      title: '', // string
      titleRender: {}, // object/function(h, {title, column, columnIndex})
      titlePrefix: {message: string/function, icon: ''}/function(h, { column, title, prop }) //表头标题前缀
      titleSuffix: {message: string/function, icon: ''}/function(h, { column, title, prop }) //表头标题后缀

      // table单元格 (优先级 cellRender > type > prop)
      prop: '', // string
      cellRender: {}, // object/function(h, {row, rowIndex, column, columnIndex, prop})

      // 编辑
      editable: true, // boolean 控制是否开启编辑
      edit: { // object
        render: {}, // object/function(h, {row, rowIndex, column, columnIndex, prop}) 编辑元素render
        disabled: false, // boolean | function({row, rowIndex}){} 为true时禁用字段
      }

      // 搜索
      search: {
        render: { name: 'input' }, // object/function(h, { column, columnIndex }) 搜索元素
        rangeRender: { name: 'input' }, // object/function(h, { column, columnIndex }) 范围搜索元素
        operator: false, // boolean 范围符号
        operatorDefault: 'like', // string 默认类型
        prop: '', // 搜索字段名，不填默认使用column.prop
        type: '' // string 扩展字段
      }

      drag: true,// boolean 列是否可拖动

      sortable: false, // 列是否可排序

      selectable: true, // function({ row, rowIndex, rowid }) 返回值 === false 时checkbox不可勾选，仅对 type=selection 的列有效

      filter: false,  // boolean  是否开启筛选功能
      filters: [],  // array  筛选选项集合 [{label: '', value: ''}]
      filterMethod: ({ value, option, cellValue, row, column, $table }) => {}  // function  筛选方法

       // 校验规则
      rules: [
        {
          required: true, 
          message: '', //可选，默认为 不能为空 
        }, 
        {
          min: number, // 最小长度
          message: '', //可选，默认为 长度不能小于 min
        }, 
        {
          max: number, // 最大长度 
          message: '', //可选，默认为 长度不能大于 max
        }, 
        // min,max同时存在时 message 默认为 长度必须在 min 到 max 
        {
          pattern: reg, // 正则
          message: '', //可选，默认为 校验不通过
        }, 
        {
          type: 'email', // 邮箱
          message: '', //可选，默认为 请输入正确的邮箱
        }, 
        {
          type: 'phone', // 手机号
          message: '', //可选，默认为 请输入正确的手机号
        }, 
        {
          validator: Function // 自定义校验，支持异步
        }
      ]
    }
  ]
  `
          },
          {
            attribute: 'data',
            explain: 'table 数据源',
            type: 'array',
            choosable: '',
            default: '[]'
          },
          {
            attribute: 'form',
            explain: '搜索行数据',
            type: 'object',
            choosable: '',
            default: '{}'
          },
          {
            attribute: 'rowId',
            explain: '行主键',
            type: 'string',
            choosable: '',
            default: '_rowId'
          },
          {
            attribute: 'height',
            explain: 'Table 高度',
            type: 'number',
            choosable: '',
            default: ''
          },
          {
            attribute: 'max-height',
            explain: 'Table 最大高度',
            type: 'number',
            choosable: '',
            default: ''
          },
          {
            attribute: 'row-height',
            explain: 'Table 行高度',
            type: 'number',
            choosable: '',
            default: '36'
          },
          {
            attribute: 'base-row-height',
            explain: '行以外的默认高度',
            type: 'number',
            choosable: '',
            default: '36'
          },
          {
            attribute: 'toolbar-height',
            explain: '工具栏高度',
            type: 'number',
            choosable: '',
            default: '36'
          },
          {
            attribute: 'header-row-height',
            explain: 'header行高度',
            type: 'number',
            choosable: '',
            default: '36'
          },
          {
            attribute: 'drag',
            explain: '是否开启列拖动功能',
            type: 'boolean',
            choosable: '',
            default: 'false'
          },
          {
            attribute: 'row-drag',
            explain: '是否开启行拖动功能',
            type: 'boolean',
            choosable: '',
            default: 'false'
          },
          {
            attribute: 'edit',
            explain: '是否开启编辑功能',
            type: 'boolean',
            choosable: '',
            default: 'false'
          },
          {
            attribute: 'search',
            explain: '是否开启搜索行功能',
            type: 'boolean',
            choosable: '',
            default: 'false'
          },
          {
            attribute: 'copy',
            explain: '是否开启复制功能',
            type: 'boolean',
            choosable: '',
            default: 'false'
          },
          {
            attribute: 'select-range',
            explain: '表格区域选择功能，（复制功能打开时默认开启）',
            type: 'boolean',
            choosable: '',
            default: 'false'
          },
          {
            attribute: 'border',
            explain: '是否带有纵向边框',
            type: 'boolean',
            choosable: '',
            default: 'false'
          },
          {
            attribute: 'stripe',
            explain: '是否带有斑马线',
            type: 'boolean',
            choosable: '',
            default: 'false'
          },
          {
            attribute: 'highlight-current-row',
            explain: '是否高亮显示行',
            type: 'boolean',
            choosable: '',
            default: 'false'
          },
          {
            attribute: 'show-header',
            explain: '是否显示表头',
            type: 'boolean',
            choosable: '',
            default: 'true'
          },
          {
            attribute: 'header-contextmenu',
            explain: '是否开启表头右键扩展菜单',
            type: 'boolean',
            choosable: '',
            default: 'false'
          },
          {
            attribute: 'empty-text',
            explain: '空数据时显示的文本内容',
            type: 'string',
            choosable: '',
            default: '暂无数据'
          },
          {
            attribute: 'highlight-current-row',
            explain: '是否要高亮当前行',
            type: 'boolean',
            choosable: '',
            default: 'false'
          },
          {
            attribute: 'show-overflow-tooltip',
            explain: '是否单元格文本不换行，溢出文本用提示框展示',
            type: 'boolean',
            choosable: '',
            default: 'false'
          },
          {
            attribute: 'loading',
            explain: '是否显示表格loading效果',
            type: 'boolean',
            choosable: '',
            default: 'false'
          },
          {
            attribute: 'row-class-name',
            explain: '行的 className',
            type: 'function({row, rowIndex})/string',
            choosable: '',
            default: 'fn'
          },
          {
            attribute: 'cell-class-name',
            explain: '单元格的 className',
            type: 'function({row, column, rowIndex, columnIndex})/string',
            choosable: '',
            default: ''
          },
          {
            attribute: 'show-summary',
            explain: '是否在表尾显示合计行',
            type: 'boolean',
            choosable: '',
            default: 'false'
          },
          {
            attribute: 'sum-text',
            explain: '合计行第一列的文本',
            type: 'string',
            choosable: '',
            default: '总计'
          },
          {
            attribute: 'summary-method',
            explain: '自定义的合计计算方法',
            type: 'function({ columns, data })',
            choosable: '',
            default: ''
          },
          {
            attribute: 'span-method',
            explain: '行列合并方法',
            type: 'function({row, column, rowIndex, columnIndex})',
            choosable: '',
            default: ''
          },
          {
            attribute: 'messages',
            explain: '单元格提示信息集合',
            type: 'array',
            choosable: '',
            default: '[]',
            code:
`
  {
    id: '', // 行主键
    prop: '', // 字段名
    message: '', // 提示信息
  }
  `
          },
          {
            attribute: 'edit-config',
            explain: '编辑配置',
            type: 'object',
            choosable: '',
            default: '{}',
            code:
`
  {
    trigger: 'click', // click/dblclick 编辑触发方式
    editStop: false, // 是否暂停编辑，当编辑元素是下拉框、日期、弹框等具有浮层的元素时，需要设置为true暂停表格编辑，当浮层关闭时设置为false恢复编辑
    editLoop: true // 快捷编辑时，在首尾单元格自动换行轮询编辑
  }
  `
          },
          {
            attribute: 'column-config',
            explain: '列配置',
            type: 'object',
            choosable: '',
            default: '{}',
            code:
`
  {
    width: null, // number 列默认宽度，当所有列都设置了宽度时，列为固定宽度，宽度之和小于表格宽度时不会自动撑满表格
    sort: [] // 列默认排序
  }
  `
          },
          {
            attribute: 'tree-config',
            explain: '树配置',
            type: 'object',
            choosable: '',
            default: '{}',
            code:
`
  {
    lazy: false, // 是否使用懒加载
    loadMethod: ({ row }) => {}, // 懒加载方法，使用懒加载时必须传入该函数
    children: 'children', // string tree子节点
    defaultExpandeds: [] // 默认展开行的主键
  }
  `
          },
          {
            attribute: 'expand-config',
            explain: '展开行配置',
            type: 'object',
            choosable: '',
            default: '{}',
            code:
`
  {
    children: 'children', // string tree子节点
    defaultExpandeds: [] // 默认展开行的主键
  }
  `
          },
          {
            attribute: 'sort-config',
            explain: '排序配置',
            type: 'object',
            choosable: '',
            default: '{}',
            code:
`
  {
    multiple: false, // boolean 是否开启多列排序
    remote: false, // boolean 是否统一使用远程排序
    sortMethod: null // function({ data, column, prop, order, $table }) 服务端排序，需要监听 sort-change 事件
  }
  `
          },
          {
            attribute: 'search-config',
            explain: '行内搜索配置',
            type: 'object',
            choosable: '',
            default: '{}',
            code:
`
  {
    remote: true, // boolean 是否统一使用远程排序
    searchMethod: null // function({ data, column, prop, order, $table }) 服务端排序，需要监听 search-change 事件
  }
  `
          },
          {
            attribute: 'proxy-config',
            explain: '代理配置',
            type: 'object',
            choosable: '',
            default: '{}',
            code:
`
  {
    request: null // function({ data, column, prop, order, $table }) 远程排序方法
  }
  `
          },
          {
            attribute: 'toolbar-config',
            explain: '工具栏配置',
            type: 'object',
            choosable: '',
            default: '{}',
            code:
`
  {
    columnControl: false, // boolean 是否开启列控制功能
    columnBatchControl: false, // boolean 是否开启列批量控制功能
    seniorQuery: false, // boolean 是否开启高级查询功能
    replace: false, // boolean 是否开启批量替换功能
    subtotal: false, // boolean 是否开启小计功能
    editHistory: false, // boolean 是否开启编辑记忆功能
    refresh: false, // boolean 是否开启刷新功能
    fullscreen: false, // boolean 是否开启全屏功能
    buttons: [  // array 操作按钮
      // 内置操作，组件会识别 code 字段，执行对应方法
      // add 往数据末尾添加新行
      // add_focus 往数据末尾添加新行并聚焦
      // insert 往数据开头添加新行
      // insert_focus 往数据开头添加新行并聚焦
      // delete 直接删除数据
      // mark_cancel 删除/取消数据
      { name: 'button', code: 'add_focus', children: '新增', props: { icon: 'el-icon-plus' }},
      { name: 'button', code: 'insert_focus', children: '插入', props: { icon: 'el-icon-plus' }},
      { name: 'button', code: 'delete', children: '直接删除', props: { icon: 'el-icon-delete' }},
      { name: 'button', code: 'mark_cancel', children: '删除/取消', props: { icon: 'el-icon-delete' }},
      { name: 'button', code: 'save', children: '保存', props: { icon: 'el-icon-check' }, status: 'success' }
    ],
  }
  `
          },
          {
            attribute: 'senior-query-config',
            explain: '高级查询配置',
            type: 'object',
            choosable: '',
            default: '{}',
            code:
`
  {
    fieldList: [ // array 高级查询字段集合
      {
        fieldName: '', // string 字段名
        fieldType: '', // string 字段类型
        fieldChildType: '', // string 字段子类型，如果字段类型是Object或者Array则子类型必填
        operateTypeList: ['=', 'not in'], // array 操作类型
        componentType: 'input', // string 组件类型（input，select）
        dataSourceType: 0, // number 数据源类型（0：无数据源，1：静态数据源，2：接口数据源）
        apiSource: { // object 接口数据（数据源类型为2时必填）
          fullPath: '', // string 接口全路径
          requestType: '' // string 请求类型
        },
        staticSourceList: [] // array 静态数据集合
      }
    ],
  }
  `
          },
          {
            attribute: 'footer-action-config',
            explain: '底部行配置',
            type: 'object',
            choosable: '',
            default: '{}',
            code:
`
  {
    showBorder: false // boolean 底部行是否显示边框
    showPager: false // boolean 是否显示分页
    pageInLeft: false // boolean 分页是否显示在左侧
    pageConfig: { // object 分页配置
      pageNum: 1 // 当前页码
      pageSize: 10 // 每页显示条目个数
      total: 10 // 总条数
      ... // 其余参数参照项目所使用ui库分页组件的配置
    }
  }
  `
          }
        ],
        methods: [
          {
            attribute: 'loadTableData',
            explain: '加载数据，在没有设置主键的情况下会清空数据状态，返回promise',
            default: `data, opts`,
            code:
`
  opts: { 
    clearScroll: true // 重新加载数据时是否重置滚动条位置
  }
  `
          },
          {
            attribute: 'reloadData',
            explain: '重载数据，会清空数据状态，返回promise',
            default: `data`
          },
          {
            attribute: 'getFullData',
            explain: '不传参数时获取当前表格数据，数据具有响应性，如果有参数source则返回不带rowId的数据，数据不具有响应性',
            default: `data`
          },
          {
            attribute: 'getTableData',
            explain: '获取当前表格数据，数据具有响应性',
            default: `data`
          },
          {
            attribute: 'getEditStore',
            explain: '获取当前表格数据状态对象 { editRow, insertList, updateList, pendingList }',
            default: `data`
          },
          {
            attribute: 'validate',
            explain: '对整个表单进行校验的方法,默认只校验临时变动的数据，第一个参数为 true 时全量校验',
            default: `false`,
            code:
`
  // 默认
  table.validate().then(res => {
    this.$message.success('校验通过!')
  }).catch(data => {
    this.$message.error('校验不通过!')
  })
  `
          },
          {
            attribute: 'validateField',
            explain: '对单元格进行校验的方法',
            default: `prop, rule, row`
          },
          {
            attribute: 'clearValidate',
            explain: '移除表单项的校验结果',
            default: `props`
          },
          {
            attribute: 'sort',
            explain: '对表格进行排序',
            default: `prop, order`
          },
          {
            attribute: 'clearSort',
            explain: '清空排序',
            default: ``
          },
          {
            attribute: 'clearSearch',
            explain: '清空搜索条件',
            default: ``
          },
          {
            attribute: 'focus',
            explain: '对可编辑表格进行聚焦的方法，如果元素不可见，会滚动到元素位置并聚焦',
            default: `rowIndex,prop`
          },
          {
            attribute: 'getCheckRows',
            explain: '用于多选表格，获取当前选中的行数据',
            default: ``
          },
          {
            attribute: 'getCheckColumns',
            explain: '获取当前选中的列数据',
            default: ``
          },
          {
            attribute: 'clearSelection',
            explain: '用于多选表格，清空用户的选择的列',
            default: ``
          },
          {
            attribute: 'toggleRowSelection',
            explain: '用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）',
            default: `row, selected`
          },
          {
            attribute: 'toggleAllSelection',
            explain: '用于多选表格，切换所有行的选中状态',
            default: ``
          },
          {
            attribute: 'doLayout',
            explain: '对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法',
            default: ``
          },
          {
            attribute: 'updateRow',
            explain: '更新行数据方法，该方法会修改数据，对有变更的的字段做状态更新及校验处理',
            default: `row`
          },
          {
            attribute: 'copyFromChecked',
            explain: '把选择的行数据复制到粘贴板',
            default: ``
          },
          {
            attribute: 'getInsertList',
            explain: '获取新增的数据',
            default: ``
          },
          {
            attribute: 'getUpdateList',
            explain: '获取更新的数据',
            default: ``
          },
          {
            attribute: 'getPendingList',
            explain: '获取伪删除的数据',
            default: ``
          },
          {
            attribute: 'getRemoveList',
            explain: '获取表格已删除数据',
            default: ``
          },
          {
            attribute: 'insert',
            explain: '插入数据的方法，返回promise。',
            default: `records,index,insertCheckRow`,
            code:
`
  // 参数说明
  {
    records: [] // array 插入的数据
    rowIndex: -1 // number 为空插入到顶部，为-1插入到底部，为有效索引插入到索引对应行
    insertCheckRow: true // boolean 存在勾选行时，插入最后一个勾选行的下一行，默认为true
  }
  `
          },
          {
            attribute: 'triggerPending',
            explain: '把选中行标记为伪删除的方法，返回promise',
            default: ``
          },
          {
            attribute: 'remove',
            explain: '删除表格数据，返回promise',
            default: `rows`
          },
          {
            attribute: 'removeCheckRow',
            explain: '删除表格已选中数据，返回promise',
            default: ``
          },
          {
            attribute: 'tableEditPause',
            explain: '暂停表格编辑功能，在触发编辑时如果有使用下拉框或者弹窗需要暂停表格编辑功能',
            default: ``
          },
          {
            attribute: 'tableEditRegain',
            explain: '恢复表格编辑功能，下拉框或者弹窗关闭时需要恢复表格编辑功能',
            default: ``
          },
          {
            attribute: 'seniorQueryOpen',
            explain: '打开表格高级搜索框',
            default: ``
          },
          {
            attribute: 'toggleRowExpand',
            explain: '切换展开行的状态',
            default: `row`
          },
          {
            attribute: 'getRowExpandRecords',
            explain: '获取已展开行的数据',
            default: ``
          },
          {
            attribute: 'isRowExpand',
            explain: '判断行是否为展开状态',
            default: `row`
          },
          {
            attribute: 'setRowExpand',
            explain: '设置展开行，二个参数设置这一行展开与否',
            default: `rows, checked`
          },
          {
            attribute: 'setAllRowExpand',
            explain: '设置所有行的展开状态',
            default: `checked`
          },
          {
            attribute: 'clearRowExpand',
            explain: '清空展开行状态',
            default: ``
          }
        ],
        slots: [
          {
            attribute: 'toolbar',
            explain: '工具栏区域左侧的内容'
          },
          {
            attribute: 'expand',
            explain: '展开行的内容. 参数为 { row, rowIndex }'
          }
        ],
        events: [
          {
            attribute: 'select',
            explain: '当用户手动勾选数据行的 Checkbox 时触发的事件',
            default: `selection, row`
          },
          {
            attribute: 'select-all',
            explain: '当用户手动勾选全选 Checkbox 时触发的事件',
            default: `selection`
          },
          {
            attribute: 'selection-change',
            explain: '当选择项发生变化时会触发',
            default: `selection`
          },
          {
            attribute: 'drag-change',
            explain: '列顺序变动或表头宽度调整后触发',
            default: `columns`
          },
          {
            attribute: 'drag-card-close',
            explain: '列拖动弹框被关闭后触发',
            default: ``
          },
          {
            attribute: 'search-change',
            explain: '搜索条件变化后触发',
            default: `searchData`
          },
          {
            attribute: 'validate',
            explain: '任一表单项被校验后触发',
            default: `[]`,
            code:
`
  [
    {
      id: '', // 行主键
      prop: '', // 字段名
      message: '', // 校验不通过的信息
      row: '', // 当前行数据
      column: '', // 当前列数据
    }
  ]
  `
          },
          {
            attribute: 'field-change',
            explain: '当单元格数据变更时',
            default: `{columnIndex, rowIndex, oldData, newData}`
          },
          {
            attribute: 'data-change',
            explain: '当表格发生数据变更时触发',
            default: `{tableData, editStore}`
          },
          {
            attribute: 'senior-query',
            explain: '当表格点击高级查询框的搜索按钮时触发',
            default: `seniorQueryData`
          },
          {
            attribute: 'row-click',
            explain: '当某一行被点击时会触发',
            default: `{ row, column, rowIndex, event }`
          },
          {
            attribute: 'row-dblclick',
            explain: '当某一行被双击时会触发',
            default: `{ row, column, rowIndex, event }`
          },
          {
            attribute: 'cell-click',
            explain: '当某个单元格被点击时会触发',
            default: `{row,column,rowIndex,columnIndex,cell,event}`
          },
          {
            attribute: 'cell-dblclick',
            explain: '当某个单元格被双击击时会触发',
            default: `{row,column,rowIndex,columnIndex,cell,event}`
          },
          {
            attribute: 'cell-mouse-enter',
            explain: '当鼠标移入单元格时会触发',
            default: `{row,column,rowIndex,columnIndex,cell,event}`
          },
          {
            attribute: 'cell-mouse-leave',
            explain: '当鼠标移出单元格时会触发',
            default: `{row,column,rowIndex,columnIndex,cell,event}`
          },
          {
            attribute: 'cell-mouse-move',
            explain: '当鼠标在单元格内移动时触发',
            default: `{row,column,rowIndex,columnIndex,cell,event}`
          },
          {
            attribute: 'cell-mouse-down',
            explain: '当鼠标在单元格内按下时触发',
            default: `{row,column,rowIndex,columnIndex,cell,event}`
          },
          {
            attribute: 'cell-mouse-up',
            explain: '当鼠标在单元格内抬起时触发',
            default: `{row,column,rowIndex,columnIndex,cell,event}`
          },
          {
            attribute: 'header-click',
            explain: '当某一列的表头被点击时会触发',
            default: `{ column, event }`
          },
          {
            attribute: 'sort-change',
            explain: '表格排序条件发生变化的时候会触发',
            default: `{column, prop, order, sorts}`
          },
          {
            attribute: 'search-clear-filed',
            explain: '使用默认range范围搜索时，点击清空按钮时触发',
            default: `{ column, prop }`
          },
          {
            attribute: 'table-paste',
            explain: '当用selectRange选择一块区域时，ctrl+v粘贴，触发这个事件',
            default: `{ startRow，startColumn, data }`
          },
          {
            attribute: 'select-range-data',
            explain: '当用selectRange选择一块区域时触发，textArr是数据二维数组{ textArr }',
            default: ``
          },
          {
            attribute: 'table-update-data',
            explain: '当表格编辑或复制粘贴数据变更时',
            default: `{columnIndex, rowIndex, oldData, newData}`
          },
          {
            attribute: 'page-current-change',
            explain: '分页当前页发生改变',
            default: `{pageNum}`
          },
          {
            attribute: 'page-size-change',
            explain: '分页每页大小发生改变',
            default: `{pageSize}`
          }
        ]
      }
    }
  }
}
</script>
