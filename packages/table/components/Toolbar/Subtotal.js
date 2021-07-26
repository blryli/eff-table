export default {
  name: 'Subtotal',
  inject: ['table'],
  methods: {
    clear() {
      this.table.clearSearch()
    }
  },
  render(h) {
    return h('icon', { props: { icon: 'subtotal' }, on: { click: () => console.log('click') }})
  }
}
