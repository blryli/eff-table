import { on, off, getOneChildNode, getOneChildComponent } from 'pk/form/utils/dom'

export default {
  name: 'VFormLineSlot',
  componentName: 'VFormLineSlot',
  props: {
    vNode: { type: Object, default: () => {} },
    layerRow: { type: Object, default: () => {} },
    path: { type: String, default: '' },
    validator: Function,
    trigger: {
      type: String,
      default: 'blur',
      validator(value) {
        return ['blur', 'change', 'validate'].indexOf(value) !== -1
      }
    },
    required: { type: [Boolean, String], default: '' }
  },
  data() {
    return {
      handlerNode: null,
      input: null,
      component: null
    }
  },
  inject: ['form'],
  computed: {
    getStyle() {
      const { layerRow } = this
      let referenceBorderColor, referenceBgColor;
      (layerRow && layerRow.layer || []).forEach(d => {
        referenceBorderColor = d.referenceBorderColor
        referenceBgColor = d.referenceBgColor
      })
      return { referenceBorderColor, referenceBgColor }
    },
    isValidator() {
      const { validator, trigger } = this
      return validator && trigger !== 'validate'
    }
  },
  watch: {
    layerRow(row) {
      this.$nextTick(() => {
        this.setNodeStyle()
      })
    },
    required(val) {
      this.setNodeStyle()
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeDestroy() {
    const { input, trigger, inputValidateField, component, onFocus, onBlur } = this
    if (input) {
      off(input, 'focus', onFocus)
      off(input, 'blur', onBlur)
      this.isValidator && off(input, trigger, inputValidateField)
    }
    if (this.$children.length && component && !component.getInput) {
      component.$off('focus', () => onFocus(component))
      component.$off('blur', onBlur)
    }
  },
  methods: {
    init() {
      this.component = getOneChildComponent(this)
      const { form, path, component, isValidator, trigger, $el, onFocus, onBlur, inputValidateField } = this
      if (this.$children.length && component) {
        // 如果组件存在并且有 getInput 方法
        if (component.getInput) {
          this.handlerNode = this.input = component.getInput()
        } else {
          component.$on('focus', () => onFocus(component))
          component.$on('blur', onBlur)
          isValidator && this.$on.apply(component, [trigger, inputValidateField])
          this.handlerNode = isValidator && getOneChildNode(component.$el) || component.$el
        }
      } else {
        // 如果不是组件，获取第一个 input
        this.input = getOneChildNode($el)
        this.handlerNode = this.input || $el
      }
      const { input } = this
      if (this.input) {
        // 监听 blur/change 事件，触发校验
        on(input, 'focus', () => onFocus())
        on(input, 'blur', () => onBlur())
        this.isValidator && on(input, trigger, inputValidateField)
      }
      this.setNodeStyle()
      form.focusOpen && form.$emit('line-slot-change', { path, slot: this, input })
    },
    setNodeStyle() {
      const { getStyle, required } = this
      this.handlerNode.style.border = `${getStyle.referenceBorderColor ? ' 1px solid ' + getStyle.referenceBorderColor : ''}`
      this.handlerNode.style.backgroundColor = `${getStyle.referenceBgColor || (typeof required === 'string' ? required : '')}`
    },
    onFocus(component) {
      this.form.focusOpen && this.form.$emit('on-focus', this.path)
      // 聚焦时全选
      this.$el.parentNode.classList.add('v-layer-item--focus')
      if (this.form.focusTextAllSelected) {
        if (this.input) {
          this.input.select && this.input.select()
        } else component && component.select && component.select()
      }
    },
    onBlur() {
      const { form, $el, path } = this
      form.focusOpen && form.$emit('on-blur', path)
      $el.parentNode.classList.remove('v-layer-item--focus')
    },
    inputValidateField() {
      const { validator, form, path } = this
      validator && form.validateField(path, validator)
    },
    handlerNodeMouseenter(e) {
      this.$el.parentNode.classList.add('v-layer-item--hover')
    },
    handlerNodeMouseleave(e) {
      this.$el.parentNode.classList.remove('v-layer-item--hover')
    }
  },
  render(h) {
    return this.vNode
  }
}
