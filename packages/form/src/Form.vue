<script>
import Validator from 'pk/form/mixins/validator'
import FocusControl from 'pk/form/mixins/focusControl'
import { renderer } from 'pk/utils/render'

export default {
  name: 'VForm',
  mixins: [Validator, FocusControl],
  props: {
    value: { type: Array, default: () => [] },
    data: { type: [Object, Array], default: () => [] },
    cols: { type: Array, default: () => [] },
    rules: { type: Array, default: () => [] },
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
      layer: [],
      initLayer: Object.freeze([]),
      isResponse: false,
      validators: [],
      inputIndex: 0,
      editIsStop: this.focusStop
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
    focusStop(val) {
      this.editIsStop = val
    },
    validators(data) {
      const layer = {
        id: '_validator',
        show: true,
        data
      }
      const index = this.layer.findIndex(d => d.id === '_validator')
      index === -1 ? this.layer.push(layer) : this.layer.splice(index, 1, layer)
      this.$emit('input', this.layer)
    }
  },
  created() {
    this.formLines = []
    this.init()
  },
  mounted() {
    // 响应式处理
    if (this.response) {
      (window.innerWidth || document.documentElement.clientWidth) <= 768 && (this.isResponse = true)
    }
  },
  methods: {
    init() {
      this.layer = this.value
      this.initLayer = Object.freeze(this.formationLayer())
    },
    formationLayer() {
      return (this.layer || []).reduce((acc, cur) => {
        const show = cur.show === undefined ? true : cur.show;
        (cur.data || []).forEach(da => {
          da.id = cur.id
          const layer = { ...cur.view, ...da, ...{ show }}
          const findIndex = acc.findIndex(l => l.path === da.path)
          if (findIndex === -1) {
            acc.push({
              path: da.path,
              layer: [layer]
            })
          } else {
            acc[findIndex].layer.push(layer)
          }
        })
        return acc
      }, [])
    },
    itemRender(col) {
      const { $createElement, table, data } = this
      const { prop, itemRender } = col
      if (typeof itemRender === 'function') {
        return itemRender($createElement, { table, form: this, data }) || ''
      } else {
        const renderOpts = Object.assign({ name: 'input' }, itemRender)
        const { name } = renderOpts
        const compConf = renderer.get(name)
        return compConf && compConf.renderEdit($createElement, renderOpts, { root: this, table, vue: this, data, column: col, prop }) || ''
      }
    },
    setEditIsStop(val) {
      this.editIsStop = val
    }
  },
  render(h) {
    console.log('this.data', JSON.stringify(this.data, null, 2))
    const { cols, formClass, isResponse, width, $slots, itemRender } = this
    return h('div', { class: formClass, style: { width: isResponse ? '' : width }}, [
      cols.map(col => {
        const { children } = col
        if (Array.isArray(children)) {
          return h('v-form-line', { props: Object.assign({}, col, { cols: children }) }, [children.map(d => itemRender(d))])
        }
        return h('v-form-line', { props: { cols: [Object.assign({}, col, { span: 24 })], span: col.span }}, [itemRender(col)])
      }),
      $slots.default
    ])
  }
}
</script>

<style lang="scss">
.v-form {
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

.v-form-line--abreast + .v-form-line--abreast {
  margin-left: -1px;
}

.v-layer{
  position: relative;
  & :only-child{
    width: 100%;
  }
}

.v-layer-item--focus, .is-validator{
  position: relative;
  z-index: 1;
}
</style>
