<template>
  <div class="page-home page">
    <h2>FormBase 表单基础使用</h2>

    <p class="hint">
      使用的是<span class="primary"> flex </span>布局，默认是行内排列子元素，竖直排列设置 span 属性为 24 即可<br>
    </p>
    <section class="demo">
      <div class="section-content">
        <v-form>
          <v-form-item
            title="名字"
            prop="name"
          >
            <el-input v-model="data.name" />
          </v-form-item>
          <v-form-item
            title="性别"
            prop="sex"
          >
            <el-select v-model="data.sex" clearable>
              <el-option label="11" value="11" />
              <el-option label="22" value="22" />
            </el-select>
          </v-form-item>
          <v-form-item
            title="年龄"
            prop="age"
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

    <h3>栅格布局</h3>
    <p>form 组件<span class="primary"> width </span>属性控制表单宽度，form-item 组件<span class="primary"> span </span> 属性控制子元素栅格宽度</p>
    <section class="demo">
      <div class="section-content">
        <v-form width="50%">
          <v-form-item
            title="名字"
            prop="name"
            :span="24"
          >
            <el-input v-model="data.name" />
          </v-form-item>
          <v-form-item
            title="性别"
            prop="sex"
            :span="24"
          >
            <el-select v-model="data.sex" clearable>
              <el-option label="11" value="11" />
              <el-option label="22" value="22" />
            </el-select>
          </v-form-item>
          <v-form-item
            title="年龄"
            prop="age"
            :span="24"
          >
            <el-input v-model="data.age" />
          </v-form-item>
        </v-form>
      </div>
    </section>
    <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="html" :code="htmlCode1" />
          <CodeSnippet class="javascript" :code="jsCode" />
        </div>
      </Collapse>
    </section>

    <h3>标题扩展</h3>
    <p>form-tem 组件<span class="primary"> title-prefix </span>属性可添加标题前缀，form-item 组件<span class="primary"> title-suffix </span> 属性可添加标题后缀</p>
    <section class="demo">
      <div class="section-content">
        <v-form width="50%">
          <v-form-item
            title="名字"
            prop="name"
            :span="24"
            :title-prefix=" { message: '必须是中文', icon: 'question' }"
          >
            <el-input v-model="data.name" />
          </v-form-item>
          <v-form-item
            title="性别"
            prop="sex"
            :span="24"
          >
            <el-select v-model="data.sex" clearable>
              <el-option label="11" value="11" />
              <el-option label="22" value="22" />
            </el-select>
          </v-form-item>
          <v-form-item
            title="年龄"
            prop="age"
            :span="24"
            :title-suffix=" { message: '不能小于18', icon: 'info' }"
          >
            <el-input v-model="data.age" />
          </v-form-item>
        </v-form>
      </div>
    </section>

    <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="html" :code="htmlCode2" />
          <CodeSnippet class="javascript" :code="jsCode" />
        </div>
      </Collapse>
    </section>
  </div>
</template>

<script>
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'

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
  }
}
`

const htmlCode = `
<v-form>
  <v-form-item
    title="名字"
    prop="name"
  >
    <el-input v-model="data.name" />
  </v-form-item>
  <v-form-item
    title="性别"
    prop="sex"
  >
    <el-select v-model="data.sex" clearable>
      <el-option label="11" value="11" />
      <el-option label="22" value="22" />
    </el-select>
  </v-form-item>
  <v-form-item
    title="年龄"
    prop="age"
  >
    <el-input v-model="data.age" />
  </v-form-item>
</v-form>
`
const htmlCode1 = `
<v-form :width="12>
  <v-form-item
    title="名字"
    prop="name"
    :span="24"
  >
    <el-input v-model="data.name" />
  </v-form-item>
  <v-form-item
    title="性别"
    prop="sex"
    :span="24"
  >
    <el-select v-model="data.sex" clearable>
      <el-option label="11" value="11" />
      <el-option label="22" value="22" />
    </el-select>
  </v-form-item>
  <v-form-item
    title="年龄"
    prop="age"
    :span="24"
  >
    <el-input v-model="data.age" />
  </v-form-item>
</v-form>
`
const htmlCode2 = `
<v-form width="50%">
  <v-form-item
    title="名字"
    prop="name"
    :span="24"
    :title-prefix=" { message: '必须是中文', icon: 'question' }"
  >
    <el-input v-model="data.name" />
  </v-form-item>
  <v-form-item
    title="性别"
    prop="sex"
    :span="24"
  >
    <el-select v-model="data.sex" clearable>
      <el-option label="11" value="11" />
      <el-option label="22" value="22" />
    </el-select>
  </v-form-item>
  <v-form-item
    title="年龄"
    prop="age"
    :span="24"
    :title-suffix=" { message: '不能小于18', icon: 'info' }"
  >
    <el-input v-model="data.age" />
  </v-form-item>
</v-form>
`
export default {
  name: 'FormBase',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      value: 2,
      jsCode,
      htmlCode,
      htmlCode1,
      htmlCode2,
      data: {
        name: '',
        sex: '',
        age: ''
      }
    }
  }
}
</script>
