<template>
  <div class="page-home page">
    <v-render :config="config" />
    <div class="flex-space" />
    <panel width="100%" title="面板标题"> 我是内容 </panel>
  </div>
</template>

<script>
export default {
  name: 'Panel',
  components: {},

  data() {
    return {
      config: {
        name: 'layout',
        props: {
          type: 'row',
          width: '100%'
        },
        children: [
          {
            name: 'panel',
            props: {
              title: '面板标题',
              type: 'row',
              width: '100%'
            },
            children: '我是内容'
          }
        ]
      }
    }
  },
  mounted() {}
}
</script>
