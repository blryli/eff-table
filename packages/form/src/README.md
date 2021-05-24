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

#### 基本布局

```html
<v-form>
  <v-form-line :cols="[{ title: '名字' },{ title: '年龄' }]">
    <input v-model="form.name" />
    <input v-model="form.age" />
  </v-form-line>
</v-form>
```

#### 增加图层

```html
<v-form v-model="layer">
  <v-form-line
    :cols="[{ title: '名字', path: '/name' },{ title: '年龄', path: '/age'}]">
    <input v-model="form.name" />
    <input v-model="form.age" />
  </v-form-line>
</v-form>

<v-layer>
  <v-layer-group
    :cols="[{ title: '名字', path: '/name' },{ title: '年龄', path: '/age'}]">
    <input v-model="form.name" />
    <input v-model="form.age" />
  </v-layer-group>
  <v-layer-item :col="{ title: '名字', path: '/name' }">
    <input v-model="form.name" />
  </v-layer-item>
</v-layer>
```

```js
<script>
export default {
  data () {
    return {
      form: {},
      layer: [
        {
          id: "layer-1",
          show: true,
          data: [
            {
              path: "/name",
              message: "测试message"
            },
            {
              path: "/age",
              message: "测试message"
            }
          ]
        },
      ]
    }
  }
}
</script>
```

#### 逻辑校验

```html
<v-form ref="form" :data="form" v-model="layer">
  <v-form-line
    :cols="[{path: '/error', title: '名字', validator: rules.error},
            {path: '/async', title: '年龄', validator: rules.async}]">
    <input v-model="form.error" />
    <input v-model="form.async" />
  </v-form-line>
</v-form>

<-- 如果是表格校验，结构如下 !-->
<v-form ref="form" v-model="layer" :data="data" rowledge="0">
  <el-table :data="data">
    <el-table-column title="必填校验">
      <template slot-scope="scope">
        <v-form-line :cols="[{path: `/${scope.$index}/error`, validator: rules.error}]">
            <el-input slot="reference" v-model="scope.row.error"/>
        </v-form-line>
      </template>
    </el-table-column>
    <el-table-column title="年龄">
      <template slot-scope="scope">
        <v-form-line :cols="[{path: `/${scope.$index}/age`}]">
          <el-input v-model="scope.row.age"/>
        </v-form-line>
      </template>
    </el-table-column>
  </el-table>
</v-form>

<el-button @click="validate">校验</el-button>
<el-button @click="clearValidate">清除校验</el-button>
```

```js
<script>
import { validateSuccess, validateError } from '@/utils/validate';

export default {
  data () {
    rules: {
      error:val => {
        if (!val) {
          return validateError('必填字段测试文本')
        } else {
          return validateSuccess()
        }
      },
      async:async val => {
        if (await this.getDate()) {
          return validateError('异步校验测试文本')
        } else {
          return validateSuccess()
        }
      }
    }
    return {
      form: {},
      data： [],
      layer: [],
      rules
    }
  },
  methods: {
    async getDate() {
      const timeout = () => new Promise((resolve) => setTimeout(resolve, 500))
      await timeout()
      return true
    },
    validate() {
      this.$refs['form'].validate((val, validators) => {
        console.log(JSON.stringify(validators, null, 2)) // 所有校验结果数组
        console.log(val, val ? '校验通过' : '校验不通过') 
      })
    },
    clearValidate() {
      this.$refs['form'].clearValidate()
    }
  }
}
</script>
```

@/utils/validate.js 定义全局校验结果样式

```js
export const validateSuccess = message => {
  return {
    message,
    effect: '#67c23a',
    disabled: true,
    referenceBorderColor: '#67c23a',
    referenceBgColor: '#e1f3d8'
  }
}

export const validateError = message => {
  return {
    message,
    effect: '#F56C6C',
    referenceBorderColor: '#F56C6C',
    referenceBgColor: '#fde2e2',
    stop: true
  }
}
export const validateWarn = message => {
  return {
    message,
    effect: '#E6A23C',
    referenceBorderColor: '#E6A23C',
    referenceBgColor: '#faecd8'
  }
}
```

### v-form Attributes

| 参数                    | 说明                               | 类型         | 可选值         | 默认值 |
| ----------------------- | ---------------------------------- | ------------ | -------------- | ------ |
| layer                   | 图层数组                           | array        | -              | -      |
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
| validateField | 对单个字段进行重算的方法，参数是路径，规则， 数据对象                                                    | path: string, rule: function, data：object/array |
| clearValidate | 移除表单校验结果。参数是要移除校验结果的路径数组，如不传则移除整个表单的重算结果)                        | paths: array                                     |
| focus         | path 对应节点聚焦，不传参数则聚焦第一个可聚焦节点节点                                                              | path: string                                     |
| blur          | path 对应节点失焦                                                              | path: string                                     |
| select        | path 对应节点文本选中                                                     | path: string                                     |



### v-form Events

| 事件名称 | 说明                   | 回调参数                    |
| -------- | ---------------------- | --------------------------- |
| validate | 任一表单项被校验后触发 | {path,success,message,stop} |
| focus-prev | 聚焦上一个节点   |        path            |
| focus-next | 聚焦下一个节点   |        path            |
| last-focused-node-next | 开启聚焦模式（focus-open 为 true），并且为非循环模式（loop 不为 true）下，在最后一个可聚焦的节点（最后一个节点，或是在它之后的所有节点均不可被聚焦的节点），执行下一个节点聚焦操作时触发 | path |
| first-focused-node-prev | 开启聚焦模式（focus-open 为 true），并且为非循环模式（loop 不为 true）下，在第一个可聚焦的节点（第一个节点，或是在它之前的所有节点均不可被聚焦的节点），执行上一个节点聚焦操作时触发 | path |
| show     | 图层显示时触发         | prop                        |
| hide     | 图层隐藏时触发         | prop                        |
| focus     | 节点聚焦时触发         | path                        |
| blur     | 节点失焦时触发         | path                        |

### layer 图层

```js
  layer: [ // array
    {
      id: 'layerId', // string

      show: true, // boolean
      // 图层是否展示

      view: { // object
      // 图层全局配置

        type: 'popover', // string
        // 类型

        effect: 'dark', // string
        // 主题或背景颜色，如果传入颜色值则主题颜色为该颜色值 可选主题 light/dark/warn/error

        borderColor: '', // string
        // 图层边框颜色

        placement: 'top', // string
        // 相对参考点展示位置 可选 top/right/bottom/left

        disabled: false, // boolean
        // 是否禁用

        referenceBorderColor: '', // string
        // 边框颜色

        referenceBgColor: '', // string
        // 背景颜色

        // type 为 popover 时的样式
          trigger: 'hover',  // string hover/change/validate(执行validate方法时才调用)
          // 触发方式

          hideDelay: 200,  // number
          // 隐藏延时 

          showAlways: false,  // boolean
          // 是否总是显示 

          enterable: false,  // boolean
          // 鼠标是否可移入

          visibleArrow: true,  // boolean
          // 是否显示箭头
      },

      data: [
        {
          path: '', // string
          // 使用图层路径，如不传或找不到路径，则以下配置不会作用于任何字段

          message: '' | {} | [], // string/object/array
          // 定义图层内容,如果是 object/array 类型则需要传模板 template，通过模板展示数据，

          template: (message) => { return 模板/组件 }, // function
          // 数据展示模板

          stop: false, // boolean
          // 校验后，是否阻止校验通过，需要声明为 true，才会阻止校验通过

          // 可以添加局部图层配置，参数和 view 一致，会覆盖 view 配置
          },
        }
      ]
    }
  ]
```

### v-form-line Attributes

| 参数        | 说明                                                                     | 类型   | 默认值 |
| ----------- | ------------------------------------------------------------------------ | ------ | ------ |
| cols        | item 布局配置                                                            | array  | []     |
| title       | 子节点并排展示时使用，form-line 设置 title 后，子节点设置的 title 将失效 | string | -      |
| title-width | 表单域标签的宽度                                                         | string | -      |
| required    | 是否在 title 文字前面显示必填 * 符号                                  | boolean | false     |
| span        | form-line 在一行分成 24 份中所占的份数                                   | number | 24     |

```js
cols: [ // array
  {
    title: 'title', // string
    // 标签文本

    titleWidth: '80px', // string
    // 表单域标签的宽度 该设置会覆盖 form-line 上的定义
    
    // 标签的宽度
    span: 24, // number
    // item 在 form-line 分成 24 份中所占的份数

    path: '/path', // string
    // 字段路径，在需要校验时是必须的
    // 规则： 对象嵌套用 '/' 分割（如对象 object:{name: ''}，则 '/name'）
    //       数组用 '/'+索引 分割（如数组 array:[{name: ''},{name: ''}]，则 '/0/name'，'/1/name' ）

    validator: (value, path) => { * 对返回值进行处理 * }, // function
    // 校验函数

    trigger: 'blur', // string
    // 触发校验的方式 可选 blur/change

    required: false, // boolean/string
    // boolean 是否在 title 文字前面显示必填 * 符号
    // string 给 输入框 设置背景色标识必填  颜色值为传入的色值
  }
]
```
