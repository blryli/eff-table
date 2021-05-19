<template>
  <div
    :class="{'is--message': message}"
    @mouseenter="handlerNodeMouseenter"
    @mouseleave="handlerNodeMouseleave"
  >
    <slot v-bind="$attrs" />
  </div>
</template>

<script>
import { on, off, getOneChildNode, getOneChildComponent } from 'pk/form/utils/dom'

export default {
  name: 'VFormFiled',
  props: {
    prop: { type: String, default: '' },
    data: { type: Object, default: () => {} },
    rules: { type: Array, default: () => [] },
    cascader: { type: [String, Array], default: '' },
    validatorStyle: {
      type: Object,
      default: () => ({ borderColor: '#F56C6C' })
    },
    mseeageType: { type: String, default: 'popover' }
  },
  data() {
    return {
      handlerNode: null,
      input: null,
      component: null,
      message: ''
    }
  },
  inject: {
    form: {}
  },
  mounted() {
    const { cascader } = this
    cascader && (Array.isArray(this.cascader) ? this.cascader : [this.cascader]).forEach(d => {
      this.$watch(`data.${d}`, () => {
        console.log('cascader change')
      })
    })
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeDestroy() {
    const { input, trigger, inputValidateField, component, onFocus, onBlur } = this
    if (input) {
      off(input, 'focus', onFocus)
      off(input, 'blur', onBlur)
      off(input, trigger, inputValidateField)
    }
    if (this.$children.length && component && !component.getInput) {
      component.$off('focus', () => onFocus(component))
      component.$off('blur', onBlur)
    }
  },
  methods: {
    init() {
      this.component = getOneChildComponent(this)
      const { form, prop, component, trigger, $el, onFocus, onBlur, inputValidateField } = this
      if (this.$children.length && component) {
        // 如果组件存在并且有 getInput 方法
        if (component.getInput) {
          this.handlerNode = this.input = component.getInput()
        } else {
          component.$on('focus', () => onFocus(component))
          component.$on('blur', onBlur)
          this.$on.apply(component, [trigger, inputValidateField])
          this.handlerNode = getOneChildNode(component.$el) || component.$el
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
        on(input, trigger, inputValidateField)
      }
      form.focusOpen && form.$emit('line-slot-change', { prop, slot: this, input })
    },
    onFocus(component) {
      this.form.focusOpen && this.form.$emit('on-focus', this.prop)
      // 聚焦时全选
      if (this.form.focusTextAllSelected) {
        if (this.input) {
          this.input.select && this.input.select()
        } else component && component.select && component.select()
      }
    },
    onBlur() {
      const { form, prop } = this
      form.focusOpen && form.$emit('on-blur', prop)
      this.inputValidateField()
    },
    inputValidateField() {
      const { form, data, prop, rules } = this
      rules.length && form.validateField(data, prop, rules).then(res => {
        this.message = res.message
        this.setNodeStyle()
      })
    },
    handlerNodeMouseenter(e) {
      const { mseeageType, handlerNode, message } = this
      if (mseeageType === 'popover') {
        message && this.form.tipShow({ reference: handlerNode, message: [{ type: 'error', message }] })
      }
    },
    handlerNodeMouseleave(e) {
      this.form.tipClose()
    },
    setNodeStyle() {
      const { handlerNode, message, validatorStyle } = this
      for (const key in validatorStyle) {
        const style = validatorStyle[key]
        handlerNode.style[key] = message ? style : ''
      }
    }
  }
}
</script>
