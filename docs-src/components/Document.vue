<template>
  <div class="document">
    <div v-if="form.props">
      <h3>Attributes</h3>
      <eff-table
        :columns="[
          {type: 'expand', width: 40},
          {title: '属性',prop: 'attribute', width: 160},
          {title: '说明', prop: 'explain'},
          {title: '类型', prop: 'type', width: 120},
          {title: '可选值', prop: 'choosable', width: 120},
          {title: '默认值', prop: 'default'}
        ]"
        :data="form.props"
      >
        <template #expand="{row}">
          <CodeSnippet class="javascript" :code="row.jsCode" />
        </template>
      </eff-table>
    </div>
    <div v-if="form.slots">
      <h3>Slot</h3>
      <eff-table
        :columns="[
          {title: 'name',prop: 'attribute', width: 160},
          {title: '说明', prop: 'explain'},
        ]"
        :data="form.slots"
      />
    </div>
    <div v-if="form.scopedSlot">
      <h3>Scoped Slot</h3>
      <eff-table
        :columns="[
          {title: 'name',prop: 'attribute', width: 160},
          {title: '说明', prop: 'explain'},
        ]"
        :data="form.scopedSlot"
      />
    </div>
    <div v-if="form.metheds">
      <h3>Methods</h3>
      <eff-table
        :columns="[
          {title: '方法名',prop: 'attribute', width: 160},
          {title: '说明', prop: 'explain'},
          {title: '参数', prop: 'default'}
        ]"
        :data="form.metheds"
      />
    </div>
    <div v-if="form.events">
      <h3>Events</h3>
      <eff-table
        :columns="[
          {title: '事件名',prop: 'attribute', width: 160},
          {title: '说明', prop: 'explain'},
          {title: '回调参数', prop: 'default'}
        ]"
        :data="form.events"
      />
    </div>
  </div>
</template>

<script>
import CodeSnippet from './CodeSnippet.vue'
export default {
  name: 'Document',
  components: { CodeSnippet },
  props: {
    form: { type: Object, default: () => ({}) }
  }
}
</script>

<style lang="scss" scoped>
.document h3 {
  margin-top: 30px;
  color: #333;
}
</style>
