export default {
  name: 'Subtotal',
  inject: ['table'],
  methods: {
    clear() {
      this.table.clearSearch()
    }
  },
  render(h) {
    return h('icon', { props: { icon: 'subtotal' }, nativeOn: { click: () => console.log('click', this.table.headerCheckedColumns) }})
  }
}
