<script>
import Help from 'pk/help'
export default {
  name: 'ToolbarShrink',
  components: { Help },
  props: {
    list: { type: Array, default: () => ([]) }
  },
  data() {
    return {
      hideIndex: 0
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        const { toolbarLeft, more } = this.$refs
        const leftRect = toolbarLeft.getBoundingClientRect()
        const moreRect = more.getBoundingClientRect()
        const leftChilds = [...toolbarLeft.childNodes].filter(d => d.nodeType === 1)
        this.hideIndex = leftChilds.findIndex(d => d && d.getBoundingClientRect && d.getBoundingClientRect().right + moreRect.width + 20 > leftRect.right) - 1
      }, 500)
    })
  },
  render(h) {
    const { list, hideIndex } = this
    let showList = []
    let hideNode = {}
    const isHidden = hideIndex > 0
    if (isHidden && list) {
      showList = list.slice(0, hideIndex)
      const hideList = list.slice(hideIndex)
      hideNode = <div class='toobar-left--more-list'>{hideList.map(d => <div class='toobar-left--more-list-item' style='margin-top: 10px'>{d}</div>)}</div>
    }
    return <div class='eff-table__toobar-left' ref='toolbarLeft'>
      { isHidden > 0 ? showList : list }
      {
        <div class={['toobar-left--more', isHidden ? 'is--show' : 'is--hide']} ref='more'>
          <Help
            vslot={hideNode}
            message='1'
            placement='bottom'
            enterable={true}
          >
            <div class='toobar-left--more-icon'>...</div>
          </Help>
        </div>
      }
    </div>
  }
}
</script>
