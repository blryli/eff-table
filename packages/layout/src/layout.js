
export default {
  // 页面布局容器组件
  name: 'layout',
  functional: true,
  props: ['span'],
  render(h, context) {
    const { props: { span }, data, children } = context
    const spanCss = span ? `span-${span}` : ''
    data.class = ['layout', span ? ' ' + spanCss : '', data.class, data.staticClass]

    return h('div', data, children)
  }
}
