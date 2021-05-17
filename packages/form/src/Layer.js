
import VPopover from 'pk/popover'
export default {
  name: 'VLayer',
  components: {
    VPopover
  },
  props: {
    path: { type: String, default: '' },
    layer: { type: Array, default: () => [] }
  },
  provide() {
    return {
      layer: this
    }
  },
  data() {
    return {
      betraye: {
        left: [],
        right: [],
        top: [],
        bottom: []
      },
      loadLayer: false
    }
  },
  methods: {
    // 加载图层
    handleLoadLayer() {
      if (!this.loadLayer) {
        this.loadLayer = true
      }
    }
  },
  render(h) {
    const layers = []
    let layerClassStr = 'v-layer'
    const { path, handleLoadLayer } = this
    this.layer.forEach(layerItem => {
      let layer = {}
      const referenceId = path // 参考点id
      const { template, type, show, referenceBorderColor, layerClass } = layerItem
      const effect = layerItem.effect && layerItem.effect.toLowerCase() || undefined
      let { placement, message = '', disabled } = layerItem
      referenceBorderColor && (layerClassStr += ' is-validator')
      layerClass && (layerClassStr += ' ' + layerClass)
      message = typeof template === 'function' ? template(message, referenceId) : message // 展示内容
      if (message) {
        if (!type || type === 'popover') {
          !placement && (placement = 'top')
          disabled = disabled === true || show === false ? 1 : 0 // 是否禁用
          const placementId = `${path}/${placement}`

          // 图层懒加载
          if (layerItem.showAlways || this.loadLayer) {
            const { trigger, visibleArrow, borderColor, showAlways, enterable, popoverClass, hideDelay } = layerItem
            layer = h('v-popover', {
              attrs: {
                referenceId, placementId, message, placement, disabled, effect,
                trigger, visibleArrow, borderColor, showAlways, enterable, popoverClass, hideDelay,
                path
              }
            })
            layers.push(layer)
          }
        } else if (type === 'text') {
          layer = h('v-text', {
            attrs: { referenceId, message, placement, disabled, effect }
          })
          layers.push(layer)
        } else if (type === 'triangle') {
          layer = h('v-triangle', {
            attrs: { referenceId, placement, disabled, effect, message }
          })
          layers.push(layer)
        }
      }
    })
    return h(
      'div',
      {
        on: {
          mouseenter: handleLoadLayer
        },
        class: layerClassStr
      },
      [this.$slots.default[0], layers]
    )
  }
}
