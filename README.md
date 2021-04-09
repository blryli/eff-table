## eff-table 高效表格

#### 主要功能

- 虚拟滚动(只渲染可视区域dom)

- 行列拖动(行拖动、列拖动、列展示隐藏)

- 搜索(行内搜索，节省界面空间)
 
- 编辑(浮层编辑，大量减少dom)

- 校验(全局校验、行校验、单元格校验、异步校验)

#### 使用

```html
  <eff-table
    ref="table"
    v-model="columns"
    :data="data"
    edit
  />
```

```js
export default {
  data() {
    retrun {
      data: [],
      columns: [
        {
          prop: 'selection',
          type: 'selection',
          fixed: 'left',
          width: 50,
          show: true
        },
        {
          prop: 'edit',
          title: '编辑',
          width: 135,
          show: true,
          edit: {
            render: (h, { prop, row }) => {
              return <el-input value={row[prop]} on-input={val => (row[prop] = val)} />
            }
          },
        },
        {
          prop: 'search',
          title: '搜索',
          width: 135,
          show: true,
          search: true,
        },
        {
          prop: 'validator',
          title: '校验',
          width: 135,
          show: true,
          validator: {
            rule: val => {
              if (!val) {
                return '校验不能为空'
              }
              return ''
            }
          }
        }
      ]
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
| height    | Table 的高度    | number      |            | 400      |
| max-height    | Table 最大高度    | number      |            | -      |
| row-height    | 列高度    | number      |            | 36      |
| border    | 是否带有纵向边框    | boolean      |            | false      |
| show-header   | 是否显示表头   | Boolean    |            | true      |
| empty-text   | 空数据时显示的文本内容   | String    |            |       |
| fullscreen| 是否显示全屏按钮 | boolean      |        | false      |
| highlight-current-row| 是否要高亮当前行 | boolean      |        | false      |
| row-class-name| 行的 className     | Function({row, rowIndex})/String      |            | false      |
| cell-class-name| 单元格的 className | Function({row, column, rowIndex, columnIndex})/String  |  |   |
| drag                   | 是否启用列拖动             | Boolean      |             | false      |
| row-drag         | 是否启用行拖动             | Boolean      |            | false      |
| column-control         | 是否启用列控制             | Boolean      |            | false      |
| column-control-text| 列控制文字，如果存在则只展示文字   | String      |            |      |
| search      | 是否启用搜索      | Boolean      |            | false      |
| searchClear | search为true时有效，是否展示清空搜索按钮   | Boolean   |           | true      |
| searchClearText | search为true时有效，如果有值，替换清空搜索按钮   | string |     | -    |
| edit                   | 是否启用编辑               | Boolean      |            | false      |
| edit-stop| 是否暂停编辑，当编辑组件弹窗或下拉框时出现时应设置为true，关闭时设置为false| Boolean |     | false   |
| edit-Lengthways    | 是否开启纵向快捷编辑    | Boolean      |            | true      |
| messages    | 提示消息，跟校验结果并存  | [{ prop, message, rowIndex }] |         | array      |
| show-summary  | 是否在表尾显示合计行     | Boolean      |         | 暂无数据  |
| sum-text      | 合计行第一列的文本       | String      |            | 总计      |
| summary-method       | 自定义的合计计算方法    | Function({ columns, data }) |       |       |
| selectRange       | 是否开启选择区域功能    | Boolean |       |       |
| copy       | 是否开启复制功能    | Boolean |       |       |

```js
value: [
  {
    show: true,// boolean 列是否显示

    type: 'selection', // string

    width: 80, // number

    fixed: '', // string left/right

    // table标题 (优先级 titleRender > type > title)
    title: '', // string
    titleRender: (h, {title, column, columnIndex}) => {
      return // jsx
    }

    // table单元格 (优先级 cellRender > type > prop)
    prop: '', // string
    cellRender: (h, {row, rowIndex, column, columnIndex, prop}) => {
      return // jsx
    }

    // 编辑
    edit: { // object
      render: (h, {row, rowIndex, column, columnIndex, prop}) => {
        return <your-component vModel={value} on-change={this.change} />
      },
      skip: false, // boolean | function({row, rowIndex}){} 为true时跳过字段
      leaveTime: 0 // number | function({ row, rowIndex }) {return Promise} 需要延时或异步处理完值再离开时使用，为函数时返回值必须是promise
    }

    // 校验
    validator: {
      required: false, // boolean
      rule: ({value, row, rowIndex}) => !value && '不能为空', // 校验规则，返回值为字符串或promise，为promise时作异步校验处理
      field: '' // 指定校验字段( 默认为prop )
    }

    // 搜索
    search: {
      render: (h, {column, columnIndex, prop}) => {
        return <your-component vModel={value} on-change={this.change} />
      },
      rangeRender: (h, {column, columnIndex, prop}) => {
        return <your-range-component vModel={value} on-change={this.change} />
      },
      operator: false, // boolean 搜索范围
      operatorDefault: 'like', // string 默认类型
      type: '' // string 扩展字段
    }

    drag: true,// boolean 单列拖动控制，如果设置为 false ，则该列不可做拖动操作

    // 排序
    sortable: false, // 对应列是否可以排序

    sortMethod: null, // 排序的时候使用的方法 function(a, b)

    remoteSort: false, // 服务端排序，需要监听 sort-change 事件
  }
]
```

### Methods

| 方法名         | 说明                | 参数                |
| ------------- | ------------------------- | ----------------------------- |
| focus         | 聚焦的方法                 | index(列索引), prop(字段) |
| editTo      | 自动聚焦到下个可聚焦元素的方法 |     left|top|right|bottom          |
| validate      | 对整个表单进行校验的方法 | Array 需要校验的数组，不传参数校验所有 |
| validateRow | 对行进行校验的方法 | rowIndex |
| validateCell | 对单元格进行校验的方法 | rowIndex, prop |
| clearValidate | 移除表单项的校验结果 | props:array | prop:string |
| sort       | 对 Table 进行排序 | prop: string, order: string|
| clearSort       | 清空排序 | -|
| clearSelection   | 用于多选表格，清空用户的选择 | -|
| toggleRowSelection | 用于多选表格，切换某一行的选中状态，如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中） |row, selected|
| toggleAllSelection | 用于多选表格，切换所有行的选中状态 |-|
| doLayout | 对 Table 进行重新布局。当 Table 或其祖先元素由隐藏切换为显示时，可能需要调用此方法 |-|

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
| editColumnLastToNext | 在列的最后一个可聚焦元素键入跳下一个指令是触发 | { placement, rowIndex, columnIndex } |
| validate | 任一表单项被校验后触发 | val: {prop: string success: boolean, message: string}, validators: array |
|row-click|当某一行被点击时会触发该事件|{ row, column, rowIndex, event }|
|row-dblclick|当某一行被双击时会触发该事件|{ row, column, rowIndex, event }|
|cell-click|当某个单元格被点击时会触发该事件|{ row, column, rowIndex, columnIndex, cell, event }|
|cell-dblclick|当某个单元格被双击击时会触发该事件|{ row, column, rowIndex, columnIndex, cell, event }|
|cell-mouse-enter|当单元格 hover 进入时会触发该事件|{ item, column, rowIndex, columnIndex, cell, event }|
|cell-mouse-leave|当单元格 hover 退出时会触发该事件|{ item, column, rowIndex, columnIndex, cell, event }|
|header-click|当某一列的表头被点击时会触发该事件|{ column, columnIndex, cell, event }|
|sort-change|表格排序条件发生变化的时候会触发该事件|sortConfig, data|
|search-clear-filed|使用默认range范围搜索时，点击清空按钮时触发该事件|{ column, prop }|
|table-paste|当用selectRange选择一块区域时，ctrl+v粘贴，触发这个事件|{ startRow，startColumn, data }|
|select-range-data|当用selectRange选择一块区域时触发，textArr是数据二维数组{ textArr }|
|cell-mouse-move|鼠标在单元格按下触发|{ row, column, rowIndex, columnIndex, cell, event }|
|cell-mouse-down|鼠标在单元格移动触发|{ row, column, rowIndex, columnIndex, cell, event }|
|table-mouse-up|鼠标在表格松开触发|{event}|
|table-mouse-enter|鼠标滑进表格|{event}|
|table-mouse-leave|鼠标离开表格|{event}|

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