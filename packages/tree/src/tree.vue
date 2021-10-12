<template>
  <div class="eff-tree">
    <TreeNode />
  </div>
</template>

<script>
// import XEUtils from 'xe-utils'
import TreeNode from './tree-node.vue'

export default {
  name: 'EffTree',
  components: { TreeNode },
  props: {
    data: { type: Array, default: () => ([]) },
    props: { type: Object, default: () => ({}) }
  },
  data() {
    return {

    }
  },
  computed: {

  },
  watch: {
    data() {
      this.init()
    }
  },
  created() {
    // const { props } = this
    Object.assign(this, {

    })
    this.init()
  },
  mounted() {

  },
  methods: {
    init() {}
  }
}
</script>

<style lang="scss">
.eff-tree{
  display: flex;

}
</style>
