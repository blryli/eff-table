<template>
  <div
    :class="['v-form-item', span && `span-${span}`, required && 'is-required']"
    :style="{'--lineHeight': form.lineHeight}"
  >

    <PrefixSuffix
      v-if="showTitle && (titleName || form.titleAlign === 'top')"
      ref="title"
      tag="label"
      :prefix="titlePrefix"
      :suffix="titleSuffix"
      :class="['v-form-item__title', titleBorder && 'is--title-border']"
      :style="{ flex: `0 0 ${tWidth}`, height: '32px' }"
    >
      <div
        ref="label"
        class="v-form-item__title-label"
        :style="{maxWidth: form.titleAlign === 'top' ? 'auto' : labelWidth + 'px'}"
        @mouseenter="mouseenter"
        @mouseleave="mouseleave"
      >{{ form.titleAlign === 'top' && !titleName ? '&nbsp;' : titleName }}</div>
    </PrefixSuffix>
    <div class="v-form-item__content">
      <FormField
        ref="formField"
        :prop="prop"
        :rules="rules"
        @mouseenter="handlerNodeMouseenter"
        @mouseleave="handlerNodeMouseleave"
      >
        <slot />
      </FormField>
      <div v-if="msgType === 'text' && message" class="v-form-filed--message">{{ message }}</div>
    </div>
  </div>
</template>

<script>
import FormField from './form-field'
import PrefixSuffix from 'pk/prefix-suffix'
import { getTextWidth } from 'pk/utils/dom'
import { getFormItemTitle } from 'pk/utils'
export default {
  name: 'VFormItem',
  components: {
    FormField,
    PrefixSuffix
  },
  props: {
    title: { type: [String, Function], default: '' },
    titleWidth: { type: String, default: '' },
    showTitle: { type: Boolean, default: true },
    titleBorder: Boolean,
    span: { type: Number, default: () => 0 },
    rules: { type: Array, default: () => [] },
    prop: { type: String, default: '' },
    titlePrefix: { type: [Object, Function], default: () => {} },
    titleSuffix: { type: [Object, Function], default: () => {} }
  },
  inject: {
    form: { default: null },
    table: { default: null }
  },
  computed: {
    titleName() {
      const { title } = this
      return getFormItemTitle(title, this.form.data)
    },
    root() {
      return this.form || this.table
    },
    required() {
      return Boolean(this.rules.find((d) => d.required))
    },
    tWidth() {
      const { titleWidth, form } = this
      const width = titleWidth || form.titleWidth
      if (width === 'auto') return width
      return width || '80px'
    },
    labelWidth() {
      const { required, titlePrefix, titleSuffix, tWidth } = this
      if (tWidth === 'auto') return tWidth
      let width = parseInt(tWidth)
      if (required) width -= 10
      if (titlePrefix) width -= 16
      if (titleSuffix) width -= 16
      return width - 12
    },
    msgType() {
      const { form, table } = this
      return form && (form.messageType || 'text') || table && 'popover' || 'text'
    },
    message() {
      const { root, prop } = this
      return (root.validators.find(d => d.prop === prop) || {}).message
    }
  },
  methods: {
    mouseenter() {
      if (labelWidth === 'auto') return
      const { form, titleName, labelWidth, $refs } = this
      const { label } = $refs
      if (getTextWidth(label) > labelWidth) {
        form.tipShow({ reference: label, effect: 'dark', message: titleName, isFixed: true })
      }
    },
    mouseleave() {
      this.form.tipClose()
    },
    handlerNodeMouseenter(e) {
      const { msgType, root, message, $refs } = this
      if (msgType === 'popover') {
        message && root && this.root.tipShow({ reference: $refs.formField.handlerNode, effect: 'error', message })
      }
    },
    handlerNodeMouseleave(e) {
      if (this.msgType === 'popover') {
        this.root && this.root.tipClose()
      }
    }
  }
}
</script>

<style lang="scss">
.v-form-popover {
  font-size: 12px;
}
.v-form-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: nowrap;

  .vue-popover-trigger {
    position: relative;
  }
  &.is-required .v-form-item__title:before {
    content: "*";
    display: inline-block;
    color: #f52b2b;
    margin-right: 3px;
  }

  &__title {
    text-align: right;
    font-size: 14px;
    color: #606266;
    padding-right: 12px;
    line-height: calc(var(--lineHeight) - 4px);
      border: 1px solid transparent;
    box-sizing: border-box;
    &-label{
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      vertical-align: middle;
    }
    &.is--title-border{
      border-color: #ddd;
      padding-left: 8px;
      border-radius: 4px 0 0 4px;
      &+.v-form-item__content{
        .el-input__inner{
          margin-left: -1px;
          border-radius: 0 4px 4px 0;
        }
      }
    }
  }

  &__content {
    width: 100%;
    position: relative;
  }
}

.v-form--title-left .v-form-item__title {
  text-align: left;
}

.v-form--title-right .v-form-item__title {
  text-align: right;
}

/* 响应式布局 */
.v-form--title-top .v-form-item,
.is-response .v-form-item {
  flex-direction: column;
}

.v-form--title-top .v-form-item__title,
.is-response .v-form-item__title {
  flex: 1 !important;
  text-align: left;
  padding-right: 0;
}
</style>

