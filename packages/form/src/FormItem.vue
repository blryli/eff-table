<template>
  <div class="v-form-item" :class="{'is-required': required === true}" :style="{'--lineHeight': lineHeight}">
    <label v-if="title" class="v-form-item__title" :style="{flex: `0 0 ${titleWidth}`}">{{ title }}</label>
    <div ref="formItemContent" class="v-form-item__content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'VFormItem',
  props: {
    title: { type: String, default: '' },
    titleWidth: { type: String, default: '' },
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

.v-form-item.is-required>.v-form-item__title:before {
  content: "*";
  line-height: var(--lineHeight);
  color: #f52b2b;
  margin-right: 3px;
}

.v-form-item__title {
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

