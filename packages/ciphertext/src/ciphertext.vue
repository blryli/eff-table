<script>
export default {
  name: 'Ciphertext',
  functional: true,
  props: {
  },
  render(h, context, data) {
    return h('div', Object.assign({ class: 'eff-table--ciphertext' }, data), '******')
  }
}
</script>
