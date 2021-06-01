## v-form-layer

- 快速实现复杂布局
- 轻松实现逻辑校验，多种展示效果
- 支持多图层展示

### 演示

[github pages](https://blryli.github.io/v-form-layer/)

#### npm 安装

```js
npm i -S v-form-layer
```

#### 使用

```js
import VFormLayer from 'v-form-layer'
import 'v-form-layer/dist/v-form-layer.css'

Vue.use(VFormLayer)

// 或者直接使用script导入
<link rel="stylesheet" href="https://unpkg.com/v-form-layer/dist/v-form-layer.css"></link>

<script src="https://unpkg.com/v-form-layer/dist/v-form-layer.min.js"></script>
```

#### 基础

```html
<v-form>
  <v-form-item title="名字">
    <el-input v-model="form.name" />
  </v-form-item>
  <v-form-item title="年龄" >
    <el-input v-model="form.age" />
  </v-form-item>
</v-form>
```

```js
<script>
export default {
  data () {
    return {
      form: {name: '', age: ''}
    }
  }
}
</script>
```

#### 校验

```html
<v-form :data="form">
  <v-form-item title="名字" prop="name" :rules="[{required: true}]">
    <el-input v-model="form.name" />
  </v-form-item>
  <v-form-item title="性别" prop="age" :rules="[{required: true}]">
    <el-select v-model="form.age" />
  </v-form-item>
</v-form>
```

```js
<script>
export default {
  data () {
    return {
      form: {name: '', age: ''}
    }
  }
}
</script>
```

#### 高级配置模式

```html
<v-form ref="form" v-bind="formOptions">
```
```js
<script>
export default {
  data () {
    return {
      formOptions: {
        columns: [
          {
            title: '名字',
            prop: 'name',
            itemRender: { name: 'input' },
            rules: [
              { required: true }
            ]
          },
          {
            title: '年龄',
            prop: 'age',
            itemRender: { name: 'input' },
            rules: [
              { required: true }
            ]
          }
        ]
      }
    }
  }
}
</script>
```



### v-form Attributes

| 参数                    | 说明                               | 类型         | 可选值         | 默认值 |
| ----------------------- | ---------------------------------- | ------------ | -------------- | ------ |
| data                    | 数据对象，用于校验时获取字段的值   | object/array | -              | -      |
| title-width             | 表单域标签的宽度                   | string       | -              | -      |
| title-align           | title 的位置                       | string       | left/right/top | right  |
| line-height             | form-item 内 title 及 content 行高 | string       | -              | '32px' |
| rowledge                | form-item 行距                     | string       | -              | '24px' |
| item-gutter             | form-item 之间的间隔               | number       | -              | 0      |
| response                | 表单响应式，只在手机端生效         | boolean      | -              | true   |
| focus-open                   | 是否开启聚焦模式                   | boolean      | -              | false  |
| focus-stop            | 停止聚焦处理                       | boolean       | -              | false |
| focus-pause            | 暂停聚焦处理，会抛出focus-prev/focus-next事件 | boolean       | -              | false |
| focus-options            | 聚焦模式参数                       | object       | -              | 看下面 |
| focus-text-all-selected | 聚焦文本全选                       | boolean      | -              | false   |

```js
focusOptions: { // object
  // 聚焦模式参数

  prevKeys: 'shift+enter', // string
  // 上一个聚焦快捷键设置

  nextKeys: 'enter', // string
  // 下一个聚焦快捷键设置

  skips: ['/node2'], // string
  // 跳过聚焦的字段集合

  loop: false // boolean
  // 聚焦循环
}
```

### v-form Methods

| 方法名        | 说明                                                                                                     | 参数                                             |
| ------------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| validate      | 对整个表单进行重算的方法，参数是一个回调函数(第一个参数是校验是否通过，第二个参数是所有校验结果集合数组) | Function(boolean, array)                         |
| validateField | 对单个字段进行重算的方法，参数是字段，规则， 数据对象                                                    | prop: string, rule: function, data：object/array |
| clearValidate | 移除表单校验结果。参数是要移除校验结果的字段数组，如不传则移除整个表单的重算结果)                        | props: array                                     |
| focus         | prop 对应节点聚焦，不传参数则聚焦第一个可聚焦节点节点                                                              | prop: string                                     |
| blur          | prop 对应节点失焦                                                              | prop: string                                     |
| select        | prop 对应节点文本选中                                                     | prop: string                                     |



### v-form Events

| 事件名称 | 说明                   | 回调参数                    |
| -------- | ---------------------- | --------------------------- |
| validate | 任一表单项被校验后触发 | {path,success,message,stop} |
| focus-prev | 聚焦上一个节点   |        path            |
| focus-next | 聚焦下一个节点   |        path            |
| last-focused-node-next | 开启聚焦模式（focus-open 为 true），并且为非循环模式（loop 不为 true）下，在最后一个可聚焦的节点（最后一个节点，或是在它之后的所有节点均不可被聚焦的节点），执行下一个节点聚焦操作时触发 | path |
| first-focused-node-prev | 开启聚焦模式（focus-open 为 true），并且为非循环模式（loop 不为 true）下，在第一个可聚焦的节点（第一个节点，或是在它之前的所有节点均不可被聚焦的节点），执行上一个节点聚焦操作时触发 | path |
| focus     | 节点聚焦时触发         | path                        |
| blur     | 节点失焦时触发         | path                        |

### v-form-item Attributes

| 参数        | 说明                                                                     | 类型   | 默认值 |
| ----------- | ------------------------------------------------------------------------ | ------ | ------ |
| title       | 标签 | string | -      |
| title-width | 标签宽度                                                         | string | -      |
| span        | item栅格宽度                                   | number | 24     |
| rules        | item校验规则                                   | array | -     |
| prop        | item标识，用于取值、校验、快捷编辑                                   | array | -     |

```js
columns: [ // arra
  {
    title: 'title', // string
    // 标签文本

    titleWidth: '80px', // string
    // 表单域标签的宽度 该设置会覆盖 form-line 上的定义
    
    // 标签的宽度
    span: 24, // number
    // item 在 form-line 分成 24 份中所占的份数

    prop: '', // string
    // 字段路径
    // 规则： 对象嵌套用 '/' 分割（如对象 object:{name: ''}，则 '/name'）
    //       数组用 '/'+索引 分割（如数组 array:[{name: ''},{name: ''}]，则 '/0/name'，'/1/name' ）
    rules: [ // 校验规则
      {
        required: true, 
        message: '', //可选，默认为 不能为空 
        trigger: '' // 可选，默认为 blur，对于select组件必须声明为 change
      }, 
      {
        min: number, // 或 minmax 
        message: '', //可选，默认为 长度不能小于 min
      }, 
      {
        max: number, // 或 minmax 
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
    ]
  }
]
```
