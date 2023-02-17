<template>
  <div class="eff-table__form">
    <!-- {{ formTemplateConfig }} -->
    <v-form :items="items" :data="form" :title-width="titleWidth" :item-gutter="itemGutter" rowledge="10px">
      <div class="eff-table__form__query">
        <el-button v-if="showSearchBtn" :class="['eff-table__form__search', isSave ? 'has-save' : '']" :loading="loading" @click="query">查询</el-button>
        <el-popover v-if="isSave" ref="popover" placement="bottom-end" trigger="click">
          <small v-if="!list.length" class="text-gray-500">暂无搜索模板</small>
          <div v-for="(d, i) in list" :key="i" class="eff-table__form__dropdown">
            <div style="min-width: 100px" class="eff-table__form__dropdown-item" type="text" @click="checkForm(d)">{{ d.name }}</div>
            <el-popconfirm
              title="此操作将删除该模板, 是否继续?"
              @confirm="deleteTamplate(d)"
            >
              <el-button slot="reference" type="text">删除</el-button>
            </el-popconfirm>
          </div>
          <el-button slot="reference" icon="el-icon-arrow-down" class="eff-table__form__down" title="选择查询模板" />
        </el-popover>
      </div>
      <div v-if="isSave">
        <el-button title="保存为查询模板" @click="open">保存</el-button>
      </div>
      <el-button title="重置查询条件" @click="clear">重置</el-button>
    </v-form>
    <div v-if="tags.length" class="eff-table__form__tags">
      <div v-for="tag in tags" :key="tag.key" class="eff-table__form__tags-tag">
        <small>{{ tag.title }}：</small>
        <el-checkbox-group :key="form[getFilterProp(tag.prop)][0]" v-model="form[getFilterProp(tag.prop)]" size="mini">
          <el-checkbox-button v-for="d in tag.paths" :key="d.value" :label="d.value" @click.native="tagClick(d.value, tag.prop)">{{ d.label }}</el-checkbox-button>
          <div class="el-checkbox-button el-checkbox-button el-checkbox-button--mini">
            <div class="el-checkbox-button__inner" title="删除" @click="tagClose(tag)"><i class="el-icon-close" /></div>
          </div>
        </el-checkbox-group>
      </div>
    </div>
    <el-dialog
      title="保存查询条件"
      width="400px"
      :visible.sync="visible"
      @close="close"
    >
      <v-form :key="key" ref="form" :data="saveForm" rowledge="0">
        <v-form-item prop="title" :rules="[{ required: true }]" :span="24">
          <el-input v-model="saveForm.title" placeholder="标题" />
        </v-form-item>
      </v-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="close">取 消</el-button>
        <el-button type="primary" @click="addTamplate">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>
<script>
import XEUtils from 'xe-utils'
export default {
  name: 'TableForm',
  props: {
    value: { type: Object, default: () => ({}) }, // 搜索对象
    formConfig: { type: Object, default: () => ({}) },
    loading: Boolean // 搜索按钮loading
  },
  data() {
    return {
      saveForm: { title: '' },
      visible: false,
      list: [],
      key: 0,
      height: null
    }
  },
  inject: ['table'],
  computed: {
    form: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('input', val)
      }
    },
    formTemplateConfig() {
      return this.table.formTemplateConfig
    },
    tags() {
      const tags = []
      const { form, items, getFilterProp } = this
      const getPaths = (renderOpts, arr) => {
        const { options, props } = renderOpts || {}
        const { valueKey = 'value', labelKey = 'label' } = props || {}
        const opts = XEUtils.isFunction(options) ? options() : options
        if (opts) {
          return arr.reduce((acc, cur) => {
            const obj = opts.find(d => d[valueKey] === cur) || {}
            if (obj) {
              const label = obj[labelKey]
              const value = obj[valueKey]
              acc.labels.push(label)
              acc.paths.push({ label, value })
            }
            return acc
          }, { labels: [], paths: [] })
        }
        return {}
      }
      for (const prop in form) {
        const values = form[prop]
        if (XEUtils.isArray(values) && values.length > 1) {
          if (!form[getFilterProp(prop)]) this.$set(this.form, getFilterProp(prop), [])
          const item = items.find(d => d.prop === prop) || {}
          const { title, itemRender } = item
          const paths = getPaths(itemRender, values)
          tags.push({ title, prop, values, ...paths })
        }
      }
      return tags
    }
  },
  watch: {
    height(height) {
      this.table.formHeight = height
    }
  },
  created() {
    Object.assign(this, {
      defaultValue: {}, // 默认值
      showSearchBtn: true, // 是否显示搜索按钮
      isSave: false, // 是否使用保存模板功能
      items: [], // 表单字段集合
      api: {
        query: () => Promise.reject('未传入 query 方法'),
        add: () => Promise.reject('未传入 add 方法'),
        delete: () => Promise.reject('未传入 deleted 方法')
      }, // 请求接口
      beforeClear: () => {} // 清空搜索前处理函数
    }, this.formConfig)
    this.isSave && this.queryTamplate()
  },
  updated() {
    this.$nextTick(() => {
      this.height = this.$el.offsetHeight
    })
  },
  methods: {
    getFilterProp(prop) {
      return 'filter_' + prop
    },
    query() {
      this.table.commitProxy('query')
    },
    clear(query = true) {
      const { beforeClear, field } = this
      beforeClear && beforeClear()
      this.$emit('input', Object.assign({ [field]: [] }, this.defaultValue))
      this.$emit('clear')
      query && this.query()
    },
    queryTamplate() {
      const { api } = this
      api.query().then(res => {
        this.$set(this, 'list', res)
      }).catch(e => {
        this.$message.error(e)
      })
    },
    addTamplate() {
      const { saveForm: { title }, form, close } = this
      const { api } = this
      this.$refs.form.validate().then(res => {
        api.add({ name: title, form }).then(res => {
          this.$message.success('保存成功!')
          close()
          this.queryTamplate()
        }).catch(e => {
          this.$message.error(e)
        })
      })
    },
    deleteTamplate(d) {
      const { api } = this
      api.delete(d).then(res => {
        this.queryTamplate()
        this.$message({ type: 'success', message: '删除成功!' })
      }).catch(e => {
        this.$message.error(e)
      })
    },
    open() {
      this.key++
      this.visible = true
    },
    close() {
      this.visible = false
      this.saveForm.title = ''
    },
    tagClose({ prop }) {
      this.form[prop] = []
      this.$set(this.form, this.getFilterProp(prop), [])
      this.query()
    },
    tagClick(value, prop) {
      this.$nextTick(() => {
        this.$set(this.form, this.getFilterProp(prop), [value])
        this.query()
      })
    },
    checkForm(d) {
      this.$refs.popover.doClose()
      this.$set(this, 'form', XEUtils.clone(d.value, true))
      this.query()
    }
  }
}
</script>

<style lang="scss">
.eff-table__form{
  display: flex;
  flex-direction: column;
  row-gap: 10px;
  padding: 10px 0;
  &__query{
    display: flex;
  }
  &__search{
    max-height: 32px;
    padding: 8px 10px;
    color: #333;
    &.has-save{
      border-radius: 3px 0 0 3px;
    }
  }
  &__down{
    border-left-color: transparent;
    padding:8px 5px;
    border-radius: 0 3px 3px 0;
    color: #333;
  }
  &__tags{
    width: 100%;
    display: flex;
    column-gap: 10px;
    &-tag{
      display: flex;
      align-items: center;
    }
    .el-checkbox-button__inner{
      padding: 5px 8px;
    }
    .el-checkbox-button.is-checked .el-checkbox-button__inner{
      color: #409EFF;
      background-color: rgba($color: #409EFF, $alpha: .1);
    }
    .el-icon-close{
      font-weight: bold;
    }
  }
  &__dropdown{
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0;
    padding-left: 5px;
    &-item{
      padding: 5px;
      text-align: left;
      cursor: pointer;
      &:hover{
        color: #3B82F6;
      }
    }
    &:hover{
      background-color: #EFF6FF;
    }
    .el-button {
      padding: 8px 0;
    }
  }
  &__button{
    margin-left: 5px;
    height: 30px;
    line-height: 30px;
    display: flex;
    align-items: center;
    cursor: pointer;
    color: #666;
    &:hover{
      color: #333;
    }
  }
}
</style>

<style lang="scss">
.eff-table__form{
  .el-button{
    height: 32px;
    line-height: 32px;
    padding: 0 8px;
  }
  .el-icon-arrow-down{
    font-weight: bold;
  }
}
</style>
