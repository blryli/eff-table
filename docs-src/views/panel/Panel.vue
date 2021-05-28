<template>
  <div class="page-home page">
    <v-render :config="config" />
    <div class="flex-space" />
    <panel width="100%" title="面板标题" :icon2front="true"> 我是内容 </panel>
    <div class="flex-row">
      <div v-drag.cnt class="flex-row" style="width:400px;height:200px;border:1px solid red">
        <div v-drag="'bug'" class="item">item1</div>
        <div v-drag="'default'" class="item">item2</div>
        <div v-drag class="item">item3</div>
        <div v-drag class="item">item4</div>
      </div>
      <div class="flex-space" />
      <div v-drag.cnt class="flex-row" style="width:400px;height:200px;border:1px solid blue" />
    </div>
    <div v-drag.cnt="'bug'" class="flex-row" style="width:400px;height:200px;border:1px solid red" />
  </div>
</template>
<style scoped>
.item{
  border:1px solid #eee;
  padding:20px;
  height:30px;
  margin:0 10px;
}

</style>
<script>

export default {
  name: 'Panel',
  components: {},

  data() {
    return {
      bool: true,
      config: {
        name: 'layout',
        props: {
          type: 'col',
          width: '100%'
        },
        children: [
          {
            name: 'panel',
            props: {
              title: '面板标题',
              type: 'row',
              collapsed: false,
              width: '300px',
              deraction: 'horizontal'
            },
            children: '我是内容'
          },
          {
            name: 'panel',
            props: {
              title: '面板标题',
              type: 'row',
              deraction: 'horizontal',
              collapsed: false
            },
            children: '我是内容'
          },
          {
            name: 'panel',
            props: {
              title: '面板标题',
              type: 'row',
              width: '300px',
              flexibility: false,
              collapsed: false,
              headerTools: {
                name: 'layout',
                props: {
                  type: 'col',
                  flexibility: false,
                  justifyContent: 'flex-end'
                },
                children: [
                  {
                    name: 'button',
                    props: {
                      type: 'primary',
                      content: 'dd'
                    },
                    childdren: 'button'
                  }
                ]
              }
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
