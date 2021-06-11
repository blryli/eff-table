<template>
  <div
    :class="{'v-form-filed': true, 'is--dirty': isDirty}"
    @mouseenter="handlerNodeMouseenter"
    @mouseleave="handlerNodeMouseleave"
  >
    <slot v-bind="$attrs" />
    <div v-if="msgType === 'text' && message" class="v-form-filed--message">{{ message }}</div>
  </div>
</template>

<script>
import { on, off, getOneChildNode, getOneChildComponent } from 'pk/form/utils/dom'
import { eqCellValue } from 'pk/utils/dom'
import { initField } from 'pk/utils'
export default {
  name: 'VFormField',
  props: {
    prop: { type: String, default: '' },
    rowIndex: { type: Number, default: null },
    rules: { type: Array, default: () => ([]) },
    validatorStyle: {
      type: Object,
      default: () => ({ borderColor: '#F56C6C' })
    }
  },
  data() {
    return {
      handlerNode: null,
      input: null,
      component: null,
      initValue: null,
      isDirty: false
    }
  },
  inject: {
    form: { default: null },
    table: { default: null }
  },
  computed: {
    data() {
      return this.form && this.form.data
    },
    msgType() {
      const { form, table } = this
      return form && (form.messageType || 'text') || table && 'popover' || 'text'
    },
    root() {
      const { form, table } = this
      return form || table
    },
    message() {
      const { root, prop } = this
      return (root.validators.find(d => d.prop === prop) || {}).message
    },
    trigger() {
      return (this.rules.find(d => d.trigger) || {}).trigger || 'blur'
    }
  },
  watch: {
    message(val) {
      if (this.form) {
        this.$nextTick(() => {
          this.setNodeStyle()
        })
      }
    }
  },
  created() {
    this.root.$on('clearStatus', this.updateField)
    const { data, prop } = this
    initField(data, prop, this)
    // console.log('builder', JSON.stringify(this.data, null, 2))
  },
  mounted() {
    this.initValue = this.data[this.prop] || null
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeDestroy() {
    this.watcher = null
    const { rules, input, component, trigger, handleValidate, onFocus, onBlur } = this
    if (this.$children.length && component) {
      component.$off('focus', () => onFocus(component))
      component.$off('blur', onBlur)
      if (rules.length) {
        component.$off(trigger, handleValidate)
      }
    } else {
      if (input) {
        off(input, 'focus', onFocus)
        off(input, 'blur', onBlur)
        if (rules.length) {
          off(input, trigger, handleValidate)
        }
      }
    }
  },
  methods: {
    init() {
      this.component = getOneChildComponent(this)
      const { form, prop, rules, trigger, component, $el, onFocus, onBlur, handleValidate } = this
      if (this.$children.length && component) {
        // 如果是组件存在并且有 getInput 方法
        if (component.getInput) {
          this.handlerNode = this.input = component.getInput()
        }
        component.$on('focus', () => onFocus(component))
        component.$on('blur', onBlur)
        if (rules.length) {
          component.$on(trigger, handleValidate)
        }
        this.handlerNode = getOneChildNode(component.$el) || component.$el
      } else {
        // 如果不是组件，获取第一个 input
        this.input = getOneChildNode($el)
        this.handlerNode = this.input || $el
        // 监听 blur/change 事件，触发校验
        const { input } = this
        if (input) {
          on(input, 'focus', onFocus)
          on(input, 'blur', onBlur)
          if (rules.length) {
            on(input, trigger, handleValidate)
          }
        }
      }
      form.focusOpen && form.$emit('line-slot-change', { prop, slot: this, input: this.input, rules })
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
    },
    handleValidate() {
      const { root, data, prop, rules } = this
      rules.length && root.validateField(data, prop, rules).then(res => {
        this.updateStatus()
      })
    },
    handlerNodeMouseenter(e) {
      const { msgType, handlerNode, message } = this
      if (msgType === 'popover') {
        message && this.root.tipShow({ reference: handlerNode, message: [{ type: 'error', message }] })
      }
    },
    handlerNodeMouseleave(e) {
      if (this.msgType === 'popover') {
        this.root.tipClose()
      }
    },
    setNodeStyle() {
      const { handlerNode, message, validatorStyle } = this
      for (const key in validatorStyle) {
        const style = validatorStyle[key]
        handlerNode.style[key] = message ? style : ''
      }
    },
    updateStatus() {
      const { data = {}, prop, initValue } = this
      this.isDirty = !eqCellValue({ [prop]: initValue }, data, prop)
    },
    updateField() {
      const { data, prop } = this
      this.initValue = data[prop]
      this.updateStatus()
    }
  }
}
</script>

<style lang="scss">
.v-form-filed{
  position: relative;
  &--message {
    position: absolute;
    top: 100%;
    left: 0;
    padding-top: 4px;
    line-height: 1.2;
    color: #F56C6C;
    font-size: 12px;
  }
}
</style>
