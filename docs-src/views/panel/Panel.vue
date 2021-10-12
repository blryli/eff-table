<template>
  <div class="page-home page">
    <h2>Panel 面板</h2>
    <v-render :config="config" />
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
