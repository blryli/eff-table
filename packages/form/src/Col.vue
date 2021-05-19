<script>
export default {
  name: 'VCol',
  props: {
    span: {
      type: Number,
      default: 24
    },
    noFirst: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {}
  },
  inject: ['form'],
  computed: {
    style() {
      const style = {}
      const { span, noFirst, form: { isResponse }} = this

      if (span !== 24) {
        const width = Math.floor((span / 24 * 100) * 10000) / 10000 + '%'
        style.width = noFirst && !isResponse ? `calc(${width} + 1px)` : width
      }

      return style
    }
  },
  methods: {},
  render(h) {
    const { span, style, $slots } = this
    if (span === 24) return $slots.default
    return h('div', { class: 'v-col', style }, $slots.default)
  }
}
</script>

<style scoped>
.v-col {
  float: left;
  box-sizing: border-box;
}
</style>

