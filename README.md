## eff-table 高效表格

#### 主要功能

- 虚拟滚动

- 列控制(列拖动，列展示隐藏)

- 编辑

- 校验

#### 使用

```html
  <eff-table
    ref="table"
    edit
    v-model="columns"
    :data="data"
  />
```

```js
export default {
  data() {
    retrun {
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
          label: '编辑',
          width: 135,
          show: true,
          edit: {
            render: (h, { row, rowIndex }) => {
              return h('el-input', {
                on: {
                  input: val => row.skip = val
                }
              })
            }
          },
        },
        {
          prop: 'validator',
          label: '校验',
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
        },
        {
          prop: 'handle',
          label: '操作',
          width: 90,
          fixed: 'right',
          show: true
        }
      ]
    }
  }
}
```

### Attributes

| 参数                    | 说明                      | 类型         | 可选值         | 默认值 |
| ---------------------- | ------------------------- | ------------| -------------- | ------ |
| value   | tableColumns数组       | array        |              | -      |
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
| cell-class-name| 单元格的 className | Function({row, column, rowIndex, columnIndex})/String  |          |       |
| show-summary| 是否在表尾显示合计行		 | Boolean  |          | false      |
| sum-text| 合计行第一列的文本	 | String  |          | 合计      |
| drag                   | 是否启用列拖动             | Boolean      |             | false      |
| column-control         | 是否启用列控制             | Boolean      |            | false      |
| column-control-text| 列控制文字，如果存在则只展示文字   | String      |            |      |
| search                 | 是否启用搜索               | Boolean      |            | false      |
| edit                   | 是否启用编辑               | Boolean      |            | false      |
| edit-stop    | 是否暂停编辑，当编辑组件弹窗或下拉框时出现时应设置为true，关闭时设置为false    | Boolean      |            | false      |
| messages    | 提示消息，跟校验结果并存  | [{ prop, message, rowIndex }] |         | array      |
| show-summary  | 是否在表尾显示合计行     | Boolean      |         | 暂无数据  |
| sum-text      | 合计行第一列的文本       | String      |            | 总计      |
| summary-method       | 自定义的合计计算方法    | Function({ columns, data }) |       |       |

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
    }

    // 校验
    validator: {
      rule: ({value, row, rowIndex}) => !value && '不能为空', // 校验规则
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
      operator: false // boolean 搜索范围
      operatorDefault: 'like' // string 默认类型
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

| 方法名         | 说明                      | 参数                          |
| ------------- | ------------------------- | ----------------------------- |
| focus         | 聚焦的方法                 | index(列索引), prop(字段) |
| editTo      | 自动聚焦到下个可聚焦元素的方法 |     left|top|right|bottom          |
| validate      | 对整个表单进行校验的方法 |  Function(callback: Function(boolean, array)) |
| validateRow | 对行进行校验的方法 | rowIndex |
| validateCell | 对单元格进行校验的方法 | rowIndex, prop |
| clearValidate | 移除表单项的校验结果 | props:array | prop:string |
| sort       | 对 Table 进行排序 | prop: string, order: string|
| clearSort       | 清空排序 | -|

### Events

| 事件名称 | 说明                   | 回调参数                    |
| -------- | ---------------------- | --------------------------- |
| select | 当用户手动勾选数据行的 Checkbox 时触发的事件 | selection, row |
| select-all | 当用户手动勾选全选 Checkbox 时触发的事件 | selection |
| selection-change | 当选择项发生变化时会触发该事件 | selection |
| drag-change | 列拖动或表头宽度调整后触发 | 返回新的tableColumns数组 |
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
|sort-change|表格排序条件发生变化的时候会触发该事件|{ column, prop, order }|