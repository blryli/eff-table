<script>
// import XEUtils from 'xe-utils'
import TreeNode from './tree-node.vue'

export default {
  name: 'EffTree',
  components: { TreeNode },
  props: {
    data: { type: Array, default: () => ([]) },
    props: { type: Object, default: () => ({}) },
    defaultExpandedKeys: { type: Array, default: () => ([]) },
    defaultCheckedKeys: { type: Array, default: () => ([]) },
    showCheckbox: Boolean
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
      treeProps: Object.assign(this.props, { children: 'children' })
    })
    this.init()
  },
  mounted() {

  },
  methods: {
    init() {},
    handleCheckChange(row, selected) {
      this.$emit('check-change', row, selected)
    }
  },
  render(h) {
    const { data, props, showCheckbox, handleCheckChange } = this
    const { children } = props
    const renderNode = (data, tier = -1) => {
      tier++
      return data.map(row => {
        const childs = row[children] || []
        return [
          h('tree-node', { key: row[props.key], props: { row, showCheckbox, tier }, on: { change: selected => handleCheckChange(row, selected) }}), childs.length ? renderNode(childs, tier) : ''
        ]
      })
    }
    return h('div', { class: 'eff-tree' }, [renderNode(data)])
  }
}
</script>

<style lang="scss">
.eff-tree{
  &-node{
    display: flex;
    align-items: center;
    color: #666;
    >i{
      margin-right: 5px;
    }
  }
}
</style>
