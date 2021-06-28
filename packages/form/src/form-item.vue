<template>
  <div
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
        tag="label"
        :prefix="titlePrefix"
        :suffix="titleSuffix"
        class="v-form-item__title"
        :style="{ flex: `0 0 ${tWidth}`, height: '32px' }"
      >{{ form.titleAlign === 'top' && !title ? '&nbsp;' : title }}</PrefixSuffix>
      <FormField
        class="v-form-item__content"
        :prop="prop"
        :rules="rules"
      >
        <slot />
      </FormField>
    </div>
  </div>
</template>

<script>
import FormField from './form-field'
import PrefixSuffix from 'pk/prefix-suffix'
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
    titlePrefix: { type: Object, default: () => ({}) },
    titleSuffix: { type: Object, default: () => ({}) }
  },
  data() {
    return {
    }
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

