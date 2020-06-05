## TableExtension 全局组件

- 饿了么table扩展组件
- 赋予table列拖动管理、列搜索功能

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
            render: (h, { rowIndex }) => {
              this.rowIndex = rowIndex
              return h('el-input', {
                on: {
                  input: val => this.list[rowIndex].skip = val
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
| message                | 提示消息，跟校验结果并存    | Boolean      |            | false      |

```js
value: [
  {
    show: true,// boolean 列是否显示

    // 编辑
    edit: { // object
      render(h, {rowIndex}) {
        return <your-component vModel={value} vOn:change={change} />
      },
      skip: false, // boolean | function(rowIndex){} 若为true就死也进不来
      stop: false // boolean | function(rowIndex){} 若为true进来就别想再切出去
    }

    // 校验
    validator: {
      rule: val => !val && '不能为空', // 校验规则
      field: '' // 指定校验字段( 默认为prop )
    }

    width: 80, // number

    type: 'selection', // string
    fixed: '', // string
    prop: '', // string
    label: '', // string
    sortable: '', // string
    showOverflowTooltip: true，// boolean
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
| toggleDragCardShow | 列拖动 | props:array | prop:string |

### Events

| 事件名称 | 说明                   | 回调参数                    |
| -------- | ---------------------- | --------------------------- |
| dragChange | 列拖动后触发 | 返回新的tableColumns数组 |
| searchChange | 搜索条件变化后出发 | 返回搜索条件数组集合 |
| editColumnLastToNext | 在列的最后一个可聚焦元素跳下一个 | placement: string |
| editRowLast | 在行的最后一个可聚焦元素跳下一个 | placement: string |
| validate | 任一表单项被校验后触发 | val: {prop: string success: boolean, message: string}, validators: array |