import VFormItem from './FormItem'
import VFormLineSlot from './FormLineSlot'
import VLayer from './Layer'
import VCol from './Col'
export default {
  name: 'VFormLine',
  componentName: 'VFormLine',
  components: {
    VFormItem,
    VFormLineSlot,
    VLayer,
    VCol
  },
  props: {
    cols: { type: Array, default: () => [] },
    title: { type: String, default: '' },
    span: { type: Number, default: 24 },
    titleWidth: { type: String, default: '' },
    required: { type: Boolean, default: false }
  },
  inject: ['form'],
  computed: {
    slotsLen() {
      return (this.$slots.default || []).filter((d, i) => d.tag).length
    },
    lineFreeSpace() {
      let freeSpace = 24
      let freeNodeNum = this.slotsLen;
      (this.cols || []).forEach(d => {
        if (d.span) {
          freeSpace -= d.span
          freeNodeNum--
        }
      })
      return freeSpace / freeNodeNum
    },
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
    const { cols, form } = this
    const validatorCols = cols.filter(d => d.validator)
    validatorCols.length && form.$emit('form.line.add.validator', validatorCols)
  },
  beforeDestroy() {
    const { cols, form } = this
    const validatorCols = cols.filter(d => d.validator)
    validatorCols.length && form.$emit('form.line.remove.validator', validatorCols)
  },
  render(h) {
    // console.log(JSON.stringify(this.form.initLayer, null, 2))
    const slots = (this.$slots.default || []).filter((d, i) => d.tag)
    const nodes = [] // form-line 实际插入的节点
    const abreastSlots = [] // form-item 内并排节点
    const { form, cols, lineFreeSpace, isResponse, itemGutter, rowledge } = this
    slots.forEach((slot, index) => {
      // 获取节点属性
      let span, titleWidth
      const col = cols[index]
      const { title, path = `_${this.id}-${index + 1}_`, required = false, validator, trigger } =
        (cols.length && col) || {}
      if (cols.length && col) {
        span = col.span || lineFreeSpace
        titleWidth =
          col.titleWidth ||
          this.titleWidth ||
          form.titleWidth ||
          '80px'
      } else {
        span = lineFreeSpace
      }
      isResponse && (span = 24)

      // 添加图层
      const layerRow = form.initLayer.find(d => d.path === path)
      slot = h('v-form-line-slot', {
        attrs: { path, vNode: slot, layerRow, validator, trigger, required }
      })

      const layer = layerRow && layerRow.layer || []
      slot = h(
        'v-layer',
        {
          attrs: { id: path, layer, path }
        },
        [slot]
      )

      if (!this.title) {
        // form-item基本布局
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
        nodes.push(
          h(
            'v-col',
            {
              attrs: {
                span
              }
            },
            [node]
          )
        )
      }
      if (this.title) {
        // form-item并列布局
        const noFirst = !!abreastSlots.length
        abreastSlots.push([
          h(
            'v-col',
            {
              attrs: {
                span,
                noFirst
              },
              class: 'v-form-line--abreast'
            },
            [slot]
          )
        ])
      }
    })
    // 并列布局添加节点
    if (this.title) {
      const { title, titleWidth, required } = this
      nodes.push(
        h(
          'v-form-item',
          {
            attrs: {
              title,
              titleWidth: titleWidth || form.titleWidth || '80px',
              required
            }
          },
          [abreastSlots]
        )
      )
    }
    const span = isResponse ? 24 : this.span
    const style = {}
    if (itemGutter) {
      style['margin-left'] = '-' + itemGutter
      style['margin-right'] = '-' + itemGutter
    }
    return h(
      'v-col',
      {
        attrs: { span },
        style
      },
      [
        h(
          'div',
          { class: 'v-form-line', style: { padding: `0 ${itemGutter}`, marginBottom: rowledge }},
          [nodes]
        )
      ]
    )
  }
}
