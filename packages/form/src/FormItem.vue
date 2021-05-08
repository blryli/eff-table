<template>
  <div class="v-form-item" :class="{'is-required': required === true}" :style="{'--lineHeight': lineHeight}">
    <label v-if="label" class="v-form-item__label" :style="{flex: `0 0 ${labelWidth}`}">{{ label }}</label>
    <div ref="formItemContent" class="v-form-item__content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'VFormItem',
  props: {
    label: { type: String, default: '' },
    labelWidth: { type: String, default: '' },
    required: { type: [Boolean, String], default: '' }
  },
  data() {
    return {}
  },
  inject: ['form'],
  computed: {
    lineHeight() {
      return this.form.lineHeight
    }
  }
}
</script>

<style scoped>
.v-form-item {
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  flex-wrap: nowrap;
}

.v-form-item:before {
  display: table;
  content: "";
}

.v-form-item:after {
  display: table;
  content: "";
  clear: both;
}

.v-form-item .vue-popover-trigger {
  position: relative;
}

.v-form-item.is-required>.v-form-item__label:before {
  content: "*";
  line-height: var(--lineHeight);
  color: #f52b2b;
  margin-right: 3px;
}

.v-form-item__label {
  text-align: right;
  font-size: 14px;
  color: #606266;
  padding-right: 12px;
  line-height: var(--lineHeight);
  box-sizing: border-box;
}

.v-form-item__content {
  width: 100%;
  position: relative;
  line-height: var(--lineHeight);
  font-size: 14px;
}

.v-form-item__content::before,
.v-form-item__content::after {
  display: table;
  content: "";
}

.v-form-item__content:after {
  clear: both;
}

.v-form--label-left .v-form-item__label {
  text-align: left;
}

.v-form--label-right .v-form-item__label {
  text-align: right;
}

/* 响应式布局 */
.v-form--label-top .v-form-item, .is-response .v-form-item {
  flex-direction: column;
}

.v-form--label-top .v-form-item__label, .is-response .v-form-item__label {
  flex: 1 !important;
  text-align: left;
  padding-right: 0;
}

.is-response .v-form-line--abreast + .v-form-line--abreast {
  margin-left: 0;
}
</style>

