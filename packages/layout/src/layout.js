
export default {
  // 页面布局容器组件
  name: 'layout',
  data() {
    return {}
  },
  methods: {
  },
  render(h) {
    return h(
      'div',
      {
        'class': {
          'layout': true
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
