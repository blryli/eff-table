
export default {
  // 页面布局容器组件
  name: 'layout',
  props: ['span'],
  data() {
    return {}
  },
  methods: {
  },
  render(h) {
    const spanCss = this.span ? `span-${this.span}` : ''

    return h(
      'div',
      {
        'class': {
          'layout': true,
          [spanCss]: !!this.span
        },
        on: {
          click: (e) => {
            this.$emit('click', e)
          }
        }
      },
      this.$slots.default
    )
  }
}
