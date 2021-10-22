<template>
  <eff-table
    :columns="[
      {title: '属性',prop: 'attribute'},
      {title: '说明', prop: 'explain'},
      {title: '类型/返回类型', prop: 'type'},
      {title: '可选值', prop: 'choosable'},
      {title: '默认值/参数', prop: 'default'}
    ]"
    :data="data"
  />
</template>

<script>

export default {
  name: 'Document',
  props: {
    form: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      data: []
    }
  },
  created() {
    [
      {
        attribute: 'Props',
        explain: '参数'
      },
      {
        attribute: 'Slots',
        explain: '插槽'
      },
      {
        attribute: 'Events',
        explain: '事件'
      },
      {
        attribute: 'Methods',
        explain: '方法'
      }
    ]
    const data = []
    const { props, slots, events, methods } = this.form
    props && data.push({ attribute: 'Props', explain: '参数', children: props })
    slots && data.push({ attribute: 'Slots', explain: '插槽', children: slots })
    events && data.push({ attribute: 'Events', explain: '事件', children: events })
    methods && data.push({ attribute: 'Methods', explain: '方法', children: methods })
    this.data = data
    console.log(data)
  }
}
</script>

<style lang="scss" scoped>
.eff-table{
  font-size: 12px !important;
}
</style>
