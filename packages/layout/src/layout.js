
export default {
  // 页面布局容器组件
  name: 'layout',
  props: {
    // 布局类型
    mode: { type: String, default: 'flex' },

    // 布局方式  [row: 行布局 | col: 列布局 ]
    type: { type: String, default: 'row' },

    // 是否支持换行
    warp: { type: Boolean, default: false },

    // 可伸缩性  [row: 行布局 | col: 列布局]
    flexibility: { type: Boolean, default: false },

    // 宽度
    width: String,

    // 高度
    height: String,

    // 主轴上的对齐方式  flex-start | flex-end | center | space-between | space-around
    justifyContent: { type: String, default: 'flex-start' },

    // 是否可被挤压缩小
    supportShrink: { type: Boolean, default: false }

    // //子元素
    // children:{
    //   type:Array,
    //   default(){
    //     return []
    //   }
    // },
  },
  data() {
    return {
      visible: false
    }
  },
  methods: {

  },
  render(h) {
    const width = this.width
    const height = this.height
    const jc = this.justifyContent
    const jcStr = jc === 'flex-start' ? '' : `justify-content:${jc}`
    const style = `${width ? 'width:' + width : ''} ${height ? ';height:' + height : ''};${jcStr}`
    return h(
      'div',
      {
        'class': {
          'layout': true,
          'flex-row': this.type === 'col',
          'flex-col': this.type === 'row',
          'flex-grow': this.flexibility,
          'flex-warp': this.warp,
          'no-shrink': !this.supportShrink
        },
        style,
        on: {
          click: (e) => {
            this.$emit('click', e)
          }
        }
        // ,directives: [
        //   {
        //     name: 'drag',
        //     modifiers: {
        //       cnt: true
        //     }
        //   }
        // ]
      },
      this.$slots.default
    )
  }
}
