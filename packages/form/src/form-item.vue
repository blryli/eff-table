<template>
  <v-col :span="form.isResponse ? 24 : span" :style="{'margin-left': '-' + form.itemGutter, 'margin-right': '-' + form.itemGutter}">
    <div class="v-form-item" :class="{'is-required': required}" :style="{'--lineHeight': lineHeight}">
      <label v-if="title" class="v-form-item__title" :style="{flex: `0 0 ${titleWidth}`}">{{ title }}</label>
      <div ref="formItemContent" class="v-form-item__content">
        <slot />
      </div>
    </div>
  </v-col>
</template>

<script>
import VCol from './col'

export default {
  name: 'VFormItem',
  components: { VCol },
  props: {
    prop: { type: String, default: '' },
    title: { type: String, default: '' },
    titleWidth: { type: String, default: '' },
    span: { type: Number, default: 24 },
    rules: { type: Array, default: () => [] }
  },
  data() {
    return {}
  },
  inject: ['form'],
  computed: {
    required() {
      return Boolean(this.rules.find(d => d.required))
    },
    lineHeight() {
      return this.form.lineHeight
    }
  }
}
</script>

<style lang="scss">
.v-form-item {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: nowrap;
  &::before {
    display: table;
    content: "";
  }
  &:after {
    display: table;
    content: "";
    clear: both;
  }
  .vue-popover-trigger {
    position: relative;
  }
  &.is-required>.v-form-item__title:before {
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
    &::before, &::after{
      display: table;
      content: "";
    }
    &::after{
      clear: both;
    }
    & :only-child{
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
.v-form--title-top .v-form-item, .is-response .v-form-item {
  flex-direction: column;
}

.v-form--title-top .v-form-item__title, .is-response .v-form-item__title {
  flex: 1 !important;
  text-align: left;
  padding-right: 0;
}

.is-response .v-form-line--abreast + .v-form-line--abreast {
  margin-left: 0;
}
</style>

