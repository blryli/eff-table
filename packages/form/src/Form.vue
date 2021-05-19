<script>
import Validator from 'pk/form/mixins/validator'
import FocusControl from 'pk/form/mixins/focusControl'
import { renderer } from 'pk/utils/render'
import VFormItem from './form-item'
import Popover from 'pk/popover'

export default {
  name: 'VForm',
  components: { VFormItem, Popover },
  mixins: [Validator, FocusControl],
  props: {
    value: { type: Array, default: () => [] },
    data: { type: Object, default: () => {} },
    cols: { type: Array, default: () => [] },
    currentPath: { type: String, default: '' },
    titleWidth: { type: String, default: '' },
    titleAlign: { type: String, default: '' },
    lineHeight: { type: String, default: '32px' },
    itemGutter: { type: Number, default: 0 },
    response: { type: Boolean, default: true },
    rowledge: { type: String, default: '24px' },
    focusOpen: { type: Boolean, default: true },
    focusOptions: { type: Object, default: () => {} },
    focusTextAllSelected: { type: Boolean, default: true },
    width: { type: String, default: '' },
    focusStop: Boolean,
    focusPause: Boolean
  },
  provide() {
    return {
      form: this
    }
  },
  inject: {
    table: { default: null }
  },
  data() {
    return {
      form: this.data || {},
      isResponse: false,
      inputIndex: 0,
      editIsStop: this.focusStop,
      popoverOpts: {}
    }
  },
  computed: {
    formClass() {
      const { response, isResponse, titleAlign } = this
      let formClass = 'v-form '
      if (response && isResponse) {
        formClass += 'is-response'
      } else {
        titleAlign &&
        (formClass += `v-form--title-${titleAlign} `)
      }
      return formClass
    }
  },
  watch: {
    value() {
      this.init()
    },
    data(val) {
      this.form = val || {}
    },
    focusStop(val) {
      this.editIsStop = val
    }
  },
  created() {
    this.formLines = []
  },
  mounted() {
    // 响应式处理
    if (this.response) {
      (window.innerWidth || document.documentElement.clientWidth) <= 768 && (this.isResponse = true)
    }
  },
  methods: {
    itemRender(col) {
      const { $createElement, table, form } = this
      const { prop, itemRender } = col
      if (typeof itemRender === 'function') {
        return itemRender($createElement, { table, form: this, data: form }) || ''
      } else {
        const renderOpts = Object.assign({ name: 'input' }, itemRender)
        const { name } = renderOpts
        const compConf = renderer.get(name)
        return compConf && compConf.renderEdit($createElement, renderOpts, { root: this, table, vue: this, data: form, column: col, prop }) || ''
      }
    },
    setEditIsStop(val) {
      this.editIsStop = val
    },
    tipShow(opts) {
      this.$refs.popover.doShow()
      this.popoverOpts = opts
    },
    tipClose() {
      this.$refs.popover.doHide()
    },
    resetField() {}
  },
  render(h) {
    const { cols, formClass, isResponse, width, $slots, itemGutter, rowledge, itemRender, form, popoverOpts } = this
    return h('div', { class: formClass, style: { width: isResponse ? '' : width }}, [
      cols.map(col => {
        const props = Object.assign({}, col, { titleWidth: this.titleWidth || '80px', data: form })
        return h('v-form-item', {
          props,
          class: 'v-form-item',
          style: { padding: `0 ${itemGutter}`, marginBottom: rowledge }
        }, [itemRender(col)])
      }),
      $slots.default,
      h('Popover', { ref: 'popover', attrs: popoverOpts })
    ])
  }
}
</script>

<style lang="scss">
.v-form {
  position: relative;
  &::before, &::after{
    display: table;
    content: "";
  }
  &:after{
    clear: both;
  }

  &-line{
    &:before, &:after{
      display: table;
      content: "";
    }
    &:after {
      clear: both;
    }
  }
}
</style>
