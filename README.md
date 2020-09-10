## eff-table 高效表格

#### 主要功能

- 虚拟滚动

- 列管理(列拖动，列展示隐藏)

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
| value                  | tableColumns数组           | array        |              | -      |
| drag                   | 是否启用列拖动             | Boolean      |             | false      |
| column-control         | 是否启用列管理             | Boolean      |            | false      |
| search                 | 是否启用搜索               | Boolean      |            | false      |
| edit                   | 是否启用编辑               | Boolean      |            | false      |
| editStop               | 是否暂停编辑               | Boolean      |            | false      |
| messages    | 提示消息，跟校验结果并存  | [{ prop, message, rowIndex }] |         | array      |
| show-summary            | 是否在表尾显示合计行       | Boolean      |            | false      |
| sum-text            | 合计行第一列的文本       | String      |            | 总计      |
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
    titleRender: (h, {column, columnIndex}) => {
      return // jsx
    }

    // table单元格 (优先级 cellRender > type > prop)
    prop: '', // string
    cellRender: (h, {row, rowIndex}) => {
      return // jsx
    }

    // 编辑
    edit: { // object
      render(h, {row, rowIndex}) {
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
      render(h, {row, rowIndex}) {
        return <your-component vModel={value} on-change={this.change} />
      },
      operator: false // boolean 搜索范围
    }

    drag: true,// boolean 单列拖动控制，如果设置为 false ，则该列不可做拖动操作

    // 未开发
    sortable: false, // 对应列是否可以排序

    sortMethod: false, // 排序的时候使用的方法

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
| dragChange | 列拖动或表头宽度调整后触发 | 返回新的tableColumns数组 |
| searchChange | 搜索条件变化后出发 | 返回搜索条件数组集合 |
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