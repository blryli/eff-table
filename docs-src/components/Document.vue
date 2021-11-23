<template>
  <div class="document">
    <div class="document-title">
      <slot />
      <el-input
        v-model="searchValue"
        class="search"
        :placeholder="`${title} API 搜索`"
        size="small"
        clearable
        @input="debounceSearch"
      />
    </div>
    <div v-if="data.props && data.props.length">
      <h3>Attributes</h3>
      <eff-table
        :row-height="50"
        :columns="[
          {show: !!data.props.find(d => d.code),type: 'expand', width: 40,titleSuffix: { message: '查看详细配置', icon: 'question' }},
          {title: '属性',prop: 'attribute', width: 160},
          {title: '说明', prop: 'explain'},
          {title: '类型', prop: 'type', width: 120},
          {title: '可选值', prop: 'choosable', width: 120},
          {title: '默认值', prop: 'default', width: 120}
        ]"
        :data="data.props"
        :keyword="searchValue"
        :expand-config="{onlyField: 'code'}"
      >
        <template #expand="{row}">
          <CodeSnippet class="javascript" :code="row.code" />
        </template>
      </eff-table>
    </div>
    <div v-if="data.slots && data.slots.length">
      <h3>Slot</h3>
      <eff-table
        :row-height="50"
        :columns="[
          {title: 'name',prop: 'attribute', width: 160},
          {title: '说明', prop: 'explain'},
        ]"
        :data="data.slots"
        :keyword="searchValue"
      />
    </div>
    <div v-if="data.scopedSlot && data.scopedSlot.length">
      <h3>Scoped Slot</h3>
      <eff-table
        :row-height="50"
        :columns="[
          {title: 'name',prop: 'attribute', width: 160},
          {title: '说明', prop: 'explain'},
        ]"
        :data="data.scopedSlot"
        :keyword="searchValue"
      />
    </div>
    <div v-if="data.methods && data.methods.length">
      <h3>Methods</h3>
      <eff-table
        :row-height="50"
        :columns="[
          {show: !!data.methods.find(d => d.code),type: 'expand', width: 40,titleSuffix: { message: '查看使用示例', icon: 'question' }},
          {title: '方法名',prop: 'attribute', width: 160},
          {title: '说明', prop: 'explain'},
          {title: '参数', prop: 'default', width: 160}
        ]"
        :data="data.methods"
        :keyword="searchValue"
        :expand-config="{onlyField: 'code'}"
      >
        <template #expand="{row}">
          <CodeSnippet class="javascript" :code="row.code" />
        </template>
      </eff-table>
    </div>
    <div v-if="data.events && data.events.length">
      <h3>Events</h3>
      <eff-table
        :row-height="50"
        :columns="[
          {show: !!data.events.find(d => d.code),type: 'expand', width: 40,titleSuffix: { message: '查看回调参数说明', icon: 'question' }},
          {title: '事件名',prop: 'attribute', width: 160},
          {title: '说明', prop: 'explain'},
          {title: '回调参数', prop: 'default'}
        ]"
        :data="data.events"
        :keyword="searchValue"
        :expand-config="{onlyField: 'code'}"
      >
        <template #expand="{row}">
          <CodeSnippet class="javascript" :code="row.code" />
        </template>
      </eff-table>
    </div>
  </div>
</template>

<script>
import CodeSnippet from './CodeSnippet.vue'
import XEUtils from 'xe-utils'
export default {
  name: 'Document',
  components: { CodeSnippet },
  props: {
    title: { type: String, default: '' },
    form: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      searchValue: '',
      data: []
    }
  },
  created() {
    this.data = XEUtils.clone(this.form, true)
    this.debounceSearch = XEUtils.debounce(this.search, 200)
  },
  methods: {
    search(val) {
      const form = XEUtils.clone(this.form, true)
      if (val) {
        for (const key in form) {
          this.data[key] = form[key].filter(d => {
            return ['attribute', 'explain', 'type', 'choosable', 'default'].find(v => d[v] && d[v].indexOf(val) > -1)
          })
        }
      } else {
        this.data = form
      }
    }
  }
}
</script>

<style lang="scss">
.document {
  position: relative;
  &-title{
    display: flex;
    align-items: center;
  }
  h2{
    margin-right: 30px;
  }
  h3 {
    margin-top: 30px;
    color: #333;
  }
  .search{
    width: 300px;
    .el-input__icon{
      &:hover{
        color: #666;
      }
    }
  }
}
.keyword-lighten {
    color: #000;
    background-color: #ff0;
}
</style>
