<template>
  <layout
    :span="span"
    :style="{ padding: form.itemGutter ? `0 ${form.itemGutter / 2}px` : '', marginBottom: form.rowledge }"
  >
    <div
      class="v-form-item"
      :class="{'is-required': required}"
      :style="{'--lineHeight': form.lineHeight}"
    >

      <PrefixSuffix
        v-if="title || form.titleAlign === 'top'"
        ref="title"
        tag="label"
        :prefix="titlePrefix"
        :suffix="titleSuffix"
        class="v-form-item__title"
        :style="{ flex: `0 0 ${tWidth}`, height: '32px' }"
      >
        <div
          ref="label"
          class="v-form-item__title-label"
          :style="{maxWidth: form.titleAlign === 'top' ? 'auto' : labelWidth + 'px'}"
          @mouseenter="mouseenter"
          @mouseleave="mouseleave"
        >{{ form.titleAlign === 'top' && !title ? '&nbsp;' : title }}</div>
      </PrefixSuffix>
      <FormField
        class="v-form-item__content"
        :prop="prop"
        :rules="rules"
      >
        <slot />
      </FormField>
    </div>
  </layout>
</template>

<script>
import FormField from './form-field'
import PrefixSuffix from 'pk/prefix-suffix'
import { getTextWidth } from 'pk/utils/dom'
export default {
  name: 'VFormItem',
  components: {
    FormField,
    PrefixSuffix
  },
  props: {
    title: { type: String, default: '' },
    titleWidth: { type: String, default: '' },
    span: { type: Number, default: () => 0 },
    rules: { type: Array, default: () => [] },
    prop: { type: String, default: '' },
    titlePrefix: { type: Object, default: () => {} },
    titleSuffix: { type: Object, default: () => {} }
  },
  inject: {
    form: { default: null },
    table: { default: null }
  },
  computed: {
    root() {
      return this.form || this.table
    },
    required() {
      return Boolean(this.rules.find((d) => d.required))
    },
    tWidth() {
      const { titleWidth, form } = this
      return titleWidth || form.titleWidth || '80px'
    },
    labelWidth() {
      const { titleWidth, form, required, titlePrefix, titleSuffix } = this
      let width = parseInt(titleWidth || form.titleWidth || 80)
      if (required) width -= 10
      if (titlePrefix) width -= 16
      if (titleSuffix) width -= 16
      return width - 12
    }
  },
  methods: {
    mouseenter() {
      const { form, title, labelWidth, $refs } = this
      const label = $refs.label
      if (getTextWidth(label) > labelWidth) {
        form.tipShow({ reference: label, effect: 'dark', message: title, isFixed: true })
      }
    },
    mouseleave() {
      this.form.tipClose()
    }
  }
}
</script>

<style lang="scss">
.v-form-popover {
  font-size: 12px;
}
.v-form-item {
  width: 100%;
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
    line-height: var(--lineHeight);
    color: #f52b2b;
    margin-right: 3px;
  }

  &__title {
    text-align: right;
    font-size: 14px;
    color: #606266;
    padding-right: 12px;
    line-height: var(--lineHeight);
    box-sizing: border-box;
    &-label{
      display: inline-block;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      vertical-align: middle;
    }
  }

  &__content {
    width: 100%;
    position: relative;
    line-height: var(--lineHeight);
    font-size: 14px;
    white-space: nowrap;
    & :only-child {
      width: 100%;
    }
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

