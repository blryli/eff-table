<template>
  <div
    :class="{'v-form-filed': true}"
    @mouseenter="$emit('mouseenter')"
    @mouseleave="$emit('mouseleave')"
  >
    <slot v-bind="$attrs" />
  </div>
</template>

<script>
import { on, off, getOneChildNode, getOneChildComponent } from 'pk/form/utils/dom'
import XEUtils from 'xe-utils'
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
      initValue: null
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
    root() {
      const { form, table } = this
      return form || table
    },
    trigger() {
      return (this.rules.find(d => d.trigger) || {}).trigger || 'blur'
    },
    message() {
      const { root, prop } = this
      return (root.validators.find(d => d.prop === prop) || {}).message
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
    const { data = {}, prop } = this
    const value = XEUtils.get(data, prop)
    !value && prop && initField(data, prop, this)
    // console.log('builder', this.data, JSON.stringify(this.data, null, 2))
  },
  mounted() {
    const value = XEUtils.get(this.data, this.prop)
    this.initValue = value
    this.$nextTick(() => {
      this.init()
    })
  },
  beforeDestroy() {
    this.watcher = null
    const { form, prop, rules, input, component, trigger, handleValidate, onFocus, onBlur, visibleChange } = this
    this.component = null
    this.input = null
    this.handlerNode = null
    this.initValue = null
    if (this.$children.length && component) {
      component.$off('focus', onFocus)
      component.$off('blur', onBlur)
      component.$off('visible-change', visibleChange)
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
    form.$emit('form-item-change', { prop, slot: this, input: this.input, rules, type: 'splice' })
  },
  methods: {
    init() {
      if (this.form.readonly) return
      this.component = getOneChildComponent(this)
      const { form, prop, rules, trigger, component, $el, onFocus, onBlur, handleValidate, visibleChange } = this
      if (this.$children.length && component) {
        // 如果是组件存在并且有 getInput 方法
        if (component.getInput) {
          this.handlerNode = this.input = component.getInput()
        }
        component.$on('focus', onFocus)
        component.$on('blur', onBlur)
        component.$on('visible-change', visibleChange)
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
      form.$emit('form-item-change', { prop, slot: this, input: this.input, rules, type: 'push' })
    },
    visibleChange(val) {
      if (!this.form.focusOpen) return
      this.root.editIsStop = val
    },
    onFocus() {
      const { component } = this
      this.form.focusOpen && this.form.$emit('on-focus', this.prop)
      // 聚焦时全选
      if (this.form.formFocusToSelect) {
        if (this.input) {
          this.input.select && this.input.select()
        } else {
          component && component.select && component.select()
        }
      }
    },
    onBlur() {
      const { form, prop } = this
      form.focusOpen && form.$emit('on-blur', prop)
    },
    handleValidate() {
      const { root, data, prop, rules } = this
      rules.length && root.validateField(prop, rules, data)
    },
    setNodeStyle() {
      const { handlerNode, message, validatorStyle } = this
      for (const key in validatorStyle) {
        const style = validatorStyle[key]
        handlerNode.style[key] = message ? style : ''
      }
    },
    updateField() {
      const { data, prop } = this
      this.initValue = XEUtils.get(data, prop)
    },
    resetField() {
      const { data, prop } = this
      XEUtils.set(data, prop, this.initValue)
    }
  }
}
</script>

<style lang="scss">
.v-form-filed{
  position: relative;
  display: flex;
  align-items: center;
  line-height: var(--lineHeight);
  min-height: var(--lineHeight);
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
