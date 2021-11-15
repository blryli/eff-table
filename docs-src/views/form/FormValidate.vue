<template>
  <div class="page-home page">
    <h2>FormValidate 表单校验 <router-link class="page-router" to="/FormApi">查看api</router-link></h2>

    <p class="hint">
      form-item 组件<span class="primary"> rules </span>属性指定校验规则，按rules数组顺序依次校验<br>
      form 组件<span class="primary"> validate </span>方法进行全量校验<br>
      form 组件<span class="primary"> validateField </span>方法进行 item 校验<br>
      form 组件<span class="primary"> clearValidate </span>方法默认清空校验，如果传入参数 props ，则会清除 prop 对应字段的校验结果<br>
    </p>
    <section class="demo">
      <p>
        <el-button type="primary" @click="validate">校 验</el-button>
        <el-button type="primary" @click="validateField">校验名字字段</el-button>
        <el-button type="primary" @click="clearValidate">清除校验</el-button>
        <el-button type="primary" @click="resetFields">重置表单</el-button>
      </p>
      <div class="section-content">
        <v-form ref="form" :data="data">
          <v-form-item
            title="名字"
            prop="name"
            :span="8"
            :rules=" [
              { required: true },
              { min: 3 }
            ]"
          >
            <el-input v-model="data.name" />
          </v-form-item>
          <v-form-item
            title="性别"
            prop="sex"
            :span="8"
            :rules=" [
              { required: true, trigger: 'change' }
            ]"
          >
            <el-select v-model="data.sex" automatic-dropdown clearable>
              <el-option label="11" value="11" />
              <el-option label="22" value="22" />
            </el-select>
          </v-form-item>
          <v-form-item
            title="年龄"
            prop="age"
            :span="8"
            :rules=" [
              { min: 1, max: 3 }
            ]"
          >
            <el-input v-model="data.age" />
          </v-form-item>
        </v-form>
      </div>
    </section>

    <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="html" :code="htmlCode" />
          <CodeSnippet class="javascript" :code="jsCode" />
        </div>
      </Collapse>
    </section>

    <h3>校验规则</h3>
    <CodeSnippet class="javascript" :code="rules" />
  </div>
</template>

<script>
import CodeSnippet from '../../components/CodeSnippet.vue'
import Collapse from '../../components/Collapse.vue'

const jsCode = `
  export default {
    data() {
      return {
        data: {
          name: '',
          sex: '',
          age: ''
        }
      }
    },
    methods: {
      validate() {
        this.$refs.form.validate().catch(e => console.log(e))
      },
      validateField() {
        this.$refs.form.validateField('name').catch(e => console.log(e))
      },
      clearValidate() {
        this.$refs.form.clearValidate()
      }
    }
  }
`

const htmlCode = `
  <p>
    <el-button type="primary" @click="validate">校 验</el-button>
    <el-button type="primary" @click="validateField">校验名字字段</el-button>
    <el-button type="primary" @click="clearValidate">清除校验</el-button>
  </p>
  <v-form ref="form" :data="data">
    <v-form-item
      title="名字"
      prop="name"
      :span="8"
      :rules=" [
        { required: true },
        { min: 3 }
      ]"
    >
      <el-input v-model="data.name" />
    </v-form-item>
    <v-form-item
      title="性别"
      prop="sex"
      :span="8"
      :rules=" [
        { required: true, trigger: 'change' }
      ]"
    >
      <el-select v-model="data.sex" clearable>
        <el-option label="11" value="11" />
        <el-option label="22" value="22" />
      </el-select>
    </v-form-item>
    <v-form-item
      title="年龄"
      prop="age"
      :span="8"
      :rules=" [
        { min: 1, max: 3 }
      ]"
    >
      <el-input v-model="data.name" />
    </v-form-item>
  </v-form>
  `
const rules = `
  rules: [
    {
      required: true, 
      message: '', //可选，默认为 不能为空 
      trigger: '' // 可选，默认为 blur，对于select组件必须声明为 change
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
      validator: Function ({value, row, column, id, prop}) // 自定义校验，支持异步
    }
  ]
  `
export default {
  name: 'FormValidate',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      rules,
      jsCode,
      htmlCode,
      data: {
        name: '',
        sex: '',
        age: ''
      }
    }
  },
  methods: {
    validate() {
      this.$refs.form.validate().catch(e => console.log(e))
    },
    validateField() {
      this.$refs.form.validateField('name').catch(e => console.log(e))
    },
    clearValidate() {
      this.$refs.form.clearValidate()
    },
    resetFields() {
      this.$refs.form.resetFields()
    }
  }
}
</script>
