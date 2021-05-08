import VFormItem from './FormItem'
import VFormLineSlot from './FormLineSlot'
import VLayer from './Layer'
import VCol from './Col'
export default {
  name: 'VLayerItem',
  componentName: 'VLayerItem',
  components: {
    VFormItem,
    VFormLineSlot,
    VLayer,
    VCol
  },
  props: {
    title: { type: String, default: '' },
    span: { type: Number, default: 24 },
    titleWidth: { type: String, default: '80px' },
    required: { type: Boolean, default: false },
    trigger: { type: String, default: 'blur' },
    validator: Function
  },
  inject: ['form'],
  computed: {
    // 间距
    itemGutter() {
      return this.form.itemGutter / 2 + 'px'
    },
    // 响应式
    isResponse() {
      return this.form.isResponse
    },
    // 行距
    rowledge() {
      return this.form.rowledge
    },
    id(length = 6) {
      return Number(Math.random().toString().substr(3, length) + Date.now()).toString(36)
    }
  },
  created() {
    this.validator && this.form.$emit('form.line.cols.this.', [this.validator])
  },
  render(h) {
    // console.log(JSON.stringify(this.form.initLayer, null, 2))
    let slot = this.$slots.default[0]
    let span
    const { form, title, path = `_${this.id}_`, required = false, validator, trigger, itemGutter, rowledge } = this
    const titleWidth = this.titleWidth || form.titleWidth || '80px'
    this.isResponse && (this.span = 24)

    // 添加图层
    const layerRow = form.initLayer.find(d => d.path === path)
    slot = h('v-form-line-slot', {
      attrs: { id: path, path, vNode: slot, layerRow, validator, trigger, required }
    })

    const layer = layerRow && layerRow.layer || []
    slot = h(
      'v-layer',
      {
        attrs: { layer, path }
      },
      [slot]
    )

    const node = title
      ? h(
        'v-form-item',
        {
          attrs: {
            title,
            titleWidth,
            required
          }
        },
        [slot]
      )
      : slot
    const style = {}
    if (itemGutter) {
      style['margin-left'] = '-' + itemGutter
      style['margin-right'] = '-' + itemGutter
    }
    return h(
      'v-col',
      {
        attrs: { span: span },
        style: { padding: `0 ${itemGutter}`, marginBottom: rowledge }
      },
      [
        h(
          'div',
          { class: 'v-layer-item', style },
          [node]
        )
      ]
    )
  }
}
