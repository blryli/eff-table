## eff-table 高效表格

> [表单组件文档](./FORM.md)

#### 主要功能

- 虚拟滚动(只渲染可视区域dom)

- 行列拖动(行拖动、列拖动、列展示隐藏)

- 搜索(行内搜索，节省界面空间)
 
- 编辑(浮层编辑，大量减少dom)

- 校验(全局校验、行校验、单元格校验、异步校验)

- 复制粘贴(excel般操作)

- 批量替换(对数据进行批量替换操作)

#### 使用

```html
  <eff-table v-bind="tableOptions" />
```

```js
export default {
  data() {
    retrun {
      tableOptions: {
        edit: true,
        border: true,
        columns: [
          {
            show: true,
            prop: 'id',
            title: 'ID'
          },
          {
            show: true,
            prop: 'name',
            title: '名字',
            edit: true
          },
          {
            show: true,
            prop: 'sex',
            title: '性别',
            edit: true
          },
          {
            show: true,
            prop: 'phone',
            title: '手机',
            edit: true
          }
        ],
        data: [
          { id: 1, name: '张三', sex: '男', phone: '13715201314' },
          { id: 2, name: '李四', sex: '女', phone: '13715201314' },
          { id: 3, name: '王五', sex: '男', phone: '13715201314' },
          { id: 4, name: '赵六', sex: '男', phone: '13715201314' }
        ]
      }
    }
  }
}
```

### Attributes

| 参数                    | 说明                      | 类型         | 可选值         | 默认值 |
| ---------------------- | ------------------------- | ------------| -------------- | ------ |
| value   | columns数组       | array        |              | []      |
| data   | table 数据       | array        |              | []     |
| form   | 搜索数据       | Object        |              | {}      |
| rowId   | 行主键       | String        |              | _rowId      |
| height    | Table 的高度    | number      |            | -      |
| max-height    | Table 最大高度    | number      |            | -      |
| row-height    | 行高度    | number      |            | 36      |
| border    | 是否带有纵向边框    | boolean      |            | false      |
| show-header   | 是否显示表头   | Boolean    |            | true      |
| header-contextmenu   | 是否开启表头右键扩展菜单   | Boolean    |            | false      |
| empty-text   | 空数据时显示的文本内容   | String    |            |   暂无数据    |
| highlight-current-row| 是否要高亮当前行 | boolean      |        | false      |
| row-class-name| 行的 className     | Function({row, rowIndex})/String      |            |       |
| cell-class-name| 单元格的 className | Function({row, column, rowIndex, columnIndex})/String  |  |   |
| drag                   | 是否启用列拖动             | Boolean      |             | false      |
| row-drag         | 是否启用行拖动             | Boolean      |            | false      |
| search      | 是否启用搜索      | Boolean      |            | false      |
| edit                   | 是否启用编辑               | Boolean      |            | false      |
| messages    | 提示消息，跟校验结果并存  | [{ prop, message, rowIndex }] |         | array      |
| show-summary  | 是否在表尾显示合计行     | Boolean      |         | false  |
| sum-text      | 合计行第一列的文本       | String      |            | 总计      |
| summary-method       | 自定义的合计计算方法    | Function({ columns, data }) |       |       |
| selectRange       | 是否开启选择区域功能    | Boolean |       |       |
| copy       | 是否开启复制功能    | Boolean |       |       |
| edit-history       | 是否开启前进后退功能    | Boolean |       |       |
| replace       | 替换和填充功能    | Boolean |       |       |
| before-insert       | 增加插入数据前的钩子函数    | function(records) |       |       |
| column-config             | 列配置               | object      |            | {}      |
| edit-config             | 编辑配置               | object      |            | {}      |
| footerActionConfig       | 页面底部配置    | {pageConfig: 分页配置，参考eleui、showPager：是否显示分页、showBorder：是否显示边框、pageInLeft：分页是否在左边} |       |       |
| toolbar-config   | 工具栏配置   | object    |            |   {}    |
| tree-config   | 表格树配置   | object    |            |   {}    |
| expand-config   | 展开行配置   | object    |            |   {}    |

- columns

```js
value: [
  {
    show: true,// boolean 列是否显示

    type: '', // string selection/radio/index

    width: 80, // number  列宽

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
    titlePrefix: {message: '', icon: ''} //表头标题前缀
    titleSuffix: {message: '', icon: ''} //表头标题后缀

    // table单元格 (优先级 cellRender > type > prop)
    prop: '', // string
    cellRender: {}, // object/function(h, {row, rowIndex, column, columnIndex, prop})

    // 编辑
    editable: true, // boolean 控制是否开启编辑
    edit: { // object
      render: {}, // object/function(h, {row, rowIndex, column, columnIndex, prop}) 编辑元素render
      disabled: false, // boolean | function({row, rowIndex}){} 为true时禁用字段
    }

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

    // 搜索
    search: {
      render: { name: 'input' }, // object/function(h, { column, columnIndex }) 搜索元素
      rangeRender: { name: 'input' }, // object/function(h, { column, columnIndex }) 范围搜索元素
      operator: false, // boolean 范围符号
      operatorDefault: 'like', // string 默认类型
      type: '' // string 扩展字段
    }

    drag: true,// boolean 列是否可拖动

    sortable: false, // 列是否可排序

    selectable: true, // function({ row, rowIndex, rowid }) 返回值 === false 时checkbox不可勾选，仅对 type=selection 的列有效
  }
]
```

- toolbar-config

```js
{
  buttons: [ // 操作按钮
    { name: 'button', code: 'add', children: '新增', props: { icon: 'el-icon-plus' }}, // 数据末尾增加一行
    { name: 'button', code: 'add_focus', children: '新增', props: { icon: 'el-icon-plus' }}, // 数据末尾增加一行并聚焦
    { name: 'button', code: 'insert', children: '插入', props: { icon: 'el-icon-plus' }}, // 数据头部增加一行
    { name: 'button', code: 'insert_focus', children: '插入', props: { icon: 'el-icon-plus' }}, // 数据头部增加一行并聚焦
    { name: 'button', code: 'delete', children: '直接删除', props: { icon: 'el-icon-delete' }},
    { name: 'button', code: 'mark_cancel', children: '删除/取消', props: { icon: 'el-icon-delete' }},
    { name: 'button', code: 'save', children: '保存', props: { icon: 'el-icon-check' } }
  ], 
  columnControl: false, // 是否启用列控制功能
  columnBatchControl: false, // 是否启用列批量控制功能
  replace: false, // 是否启用列批量替换功能
  editHistory: false, // 是否启用历史操作控制功能
  seniorQuery: false, // 是否启用高级搜索功能
  refresh: false, // 是否启用刷新功能
  fullscreen: false, // 是否启用全屏功能
}
```
- edit-config

```js
{
  editLoop: true, // 是否启用行循环编辑，在最后一个单元格跳下一个及第一个单元格跳上一个时进行跨行编辑
  editStop: false, // 是否暂停编辑，当编辑组件弹窗或下拉框时出现时应设置为true，关闭时设置为false
  trigger: 'click', // 编辑功能触发方式，可选 click/dblclick
}
```

- sort-config

```js
{
   multiple: false, // 是否启用多字段排序
   sortMethod: null, // 排序的时候使用的方法 function(a, b)
   remote: false, // 服务端排序，需要监听 sort-change 事件
}
```

### Methods

| 方法名         | 说明                | 参数                |
| ------------- | ------------------------- | ----------------------------- |
| loadTableData | 加载数据，在没有设置主键的情况下会清空数据状态，返回promise |data|
| reloadData | 重载数据，会清空数据状态，返回promise |data|
| getFullData      | 不传参数时获取当前表格数据，数据具有响应性，如果有参数source则返回不带rowId的数据，数据不具有响应性 |     source          |
| getTableData      | 获取当前表格数据，数据具有响应性 |     ---          |
| getEditStore      | 获取当前表格数据状态对象 { editRow, insertList, updateList, pendingList } |     ---          |
| validate      | 对整个表单进行校验的方法 | 默认只校验临时变动的数据，第一个参数为 true 时全量校验 |
| validateField | 对单元格进行校验的方法 | prop, rules, row  |
| clearValidate | 移除表单项的校验结果 | props:array | prop:string |
| sort       | 对 Table 进行排序 | prop: string, order: string|
| clearSort       | 清空排序 | -|
| clearSearch       | 清空搜索条件 | -|
| focus         | 聚焦的方法                 | index(列索引), prop(字段) |
| getCheckRows   | 用于多选表格，获取当前选中的行数据 | -|
| getCheckColumns   | 获取当前选中的列数据 | -|
| clearSelection   | 用于多选表格，清空用户的选择 | -|
| toggleRowSelection | 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中） |row, selected|
| toggleAllSelection | 用于多选表格，切换所有行的选中状态 |-|
| doLayout | 对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法 |-|
| updateRow | 更新行数据方法，该方法会修改数据，对有变更的的字段做状态更新及校验处理 |row|
| copyFromChecked | 把选择的行数据复制到粘贴板 ||
| getInsertList | 获取新增的数据 ||
| getUpdateList | 获取更新的数据 ||
| getPendingList | 获取伪删除的数据 ||
| insert | 插入数据的方法，返回promise |records（插入数据array）, rowIndex（为空插入到顶部，为-1插入到底部，为有效索引插入到索引对应行），insertCheckRow （存在勾选行时，插入到指定行，默认为true）。|
| triggerPending | 把选中行标记为伪删除的方法，返回promise |-|
| getRemoveList |  获取表格已删除数据 |-|
| remove | 删除表格数据，返回promise |rows|
| removeCheckRow | 删除表格已选中数据，返回promise |-|
| tableEditPause | 暂停表格编辑功能，在触发编辑时如果有使用下拉框或者弹窗需要暂停表格编辑功能 |-|
| tableEditRegain | 恢复表格编辑功能，下拉框或者弹窗关闭时需要恢复表格编辑功能 |-|
| seniorQueryOpen | 打开表格高级搜索框 |-|
| destroy | 置空表格数据，减少内存占用 |-|


### Events
| 事件名称 | 说明                   | 回调参数                    |
| -------- | ---------------------- | --------------------------- |
| select | 当用户手动勾选数据行的 Checkbox 时触发的事件 | selection, row |
| select-all | 当用户手动勾选全选 Checkbox 时触发的事件 | selection |
| selection-change | 当选择项发生变化时会触发该事件 | selection |
| drag-change | 列拖动或表头宽度调整后触发 | 返回新的tableColumns数组 |
| row-drag-change | 行拖动后触发 | fromIndex, toIndex |
| drag-card-close | 列拖动弹框被关闭后触发 |- |
| search-change | 搜索条件变化后出发 | 返回搜索条件数组集合 |
| validate | 任一表单项被校验后触发 | val: {prop: string success: boolean, message: string}, validators: array |
|row-click|当某一行被点击时会触发该事件|{ row, column, rowIndex, event }|
|row-dblclick|当某一行被双击时会触发该事件|{ row, column, rowIndex, event }|
|cell-click|当某个单元格被点击时会触发该事件|{ row, column, rowIndex, columnIndex, cell, event }|
|cell-dblclick|当某个单元格被双击击时会触发该事件|{ row, column, rowIndex, columnIndex, cell, event }|
|cell-mouse-enter|当单元格 hover 进入时会触发该事件|{ item, column, rowIndex, columnIndex, cell, event }|
|cell-mouse-leave|当单元格 hover 退出时会触发该事件|{ item, column, rowIndex, columnIndex, cell, event }|
|header-click|当某一列的表头被点击时会触发该事件|{ column, event }|
|sort-change|表格排序条件发生变化的时候会触发该事件|sortConfig, data|
|search-clear-filed|使用默认range范围搜索时，点击清空按钮时触发该事件|{ column, prop }|
|table-paste|当用selectRange选择一块区域时，ctrl+v粘贴，触发这个事件|{ startRow，startColumn, data }|
|select-range-data|当用selectRange选择一块区域时触发，textArr是数据二维数组{ textArr }|
|cell-mouse-move|鼠标在单元格按下触发|{ row, column, rowIndex, columnIndex, cell, event }|
|cell-mouse-down|鼠标在单元格移动触发|{ row, column, rowIndex, columnIndex, cell, event }|
|table-mouse-up|鼠标在表格松开触发|{event}|
|table-mouse-enter|鼠标滑进表格|{event}|
|table-mouse-leave|鼠标离开表格|{event}|
|page-current-change|分页当前页发生改变|{pageNum}|
|page-size-change|分页每页大小发生改变|{pageSize}|
|table-update-data|当表格编辑或复制粘贴数据变更时|{columnIndex, rowIndex, oldData, newData}|
|field-change|当单元格数据变更时|{columnIndex, rowIndex, oldData, newData}|
|data-change|当表格发生数据变更时触发|{tableData, editStore}|
|senior-query|当表格点击高级查询框的搜索按钮时触发|seniorQuery|

### Slot

| name | 说明                   | 
| -------- | ------------------- | 
| toolbar | 工具栏区域左侧的内容 | 
| expand | 展开行的内容. 参数为 { row, rowIndex } |
### 操作快捷键

| keys | 说明                   | 
| -------- | ------------------- | 
| enter         | 编辑模式下聚焦右侧可聚焦单元格 | 
| shift + enter | 编辑模式下聚焦左侧可聚焦单元格 | 
| arrowdown     | 编辑模式下聚焦下方单元格 | 
| arrowup       | 编辑模式下聚焦上方单元格 | 
| control + b   | 搜索模式下切换搜索行隐藏/展示，默认会清空搜索条件 | 

### 更新日志

#### 2021-5

-  editStore 方法增加 editRow 对象

-  增加更新行数据的方法 updateRow

-  增加插入数据前的钩子函数 beforeInsert

-  edit配置增加 disabled 动态禁用单元格编辑

#### 2021-6

-  增加 getInsertList 方法，获取新增的数据

-  增加 getUpdateList 方法，获取更新的数据

-  增加 getPendingList 方法，获取伪删除的数据

-  增加 remove 方法，删除表格数据

-  增加 removeCheckRow 方法，删除表格已勾选数据

-  增加 getRemoveList 方法，获取表格已删除数据

-  column 增加 titlePrefix 属性，表头标题前缀

-  column 增加 titleSuffix 属性，表头标题后缀

-  column 增加 editable 属性，控制是否开启编辑
#### 2021-7

- 1.1.11 toolbar-config 操作功能整合

- 解决表格滚动后，离开页面，再重新激活页面会出现空白区域的问题

- 解决表格全选时会把之前的数据也选上的问题

- table增加 field-change 回调事件

- table增加 getTableData 方法获取表格数据

- 增加表头多选及多表头拖动功能

- 增加 getCheckColumns 方法获取选中的列

#### 2021-8

###### 1.1.51 
- renderCell支持format函数

- refresh方法，重置时初始化分页数据  

- 列长度变化后，剩余列重新计算宽度（已设置固定宽度的列不会重新计算）



