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
      <div
        :style="{flex: `0 0 ${tWidth}`, height: '32px'}"
        class="flex align-center justify-end"
        style=" position: relative;"
      >
        <template v-if="titlePrefix != null">
          <i
            class="v-form-item__tooltip v-form-item__ooh margin-right-xs"
            @mouseenter="messageEnter"
            @mouseleave="messageLeave"
          >{{ titlePrefix.icon == 'ooh'? '!' : '?' }}</i>
          <div v-if="showMessage" class="v-form-item__message_container">
            <div class="v-form-item__message">{{ titlePrefix.message }}</div>
          </div>

        </template>
        <label
          v-if="title || form.titleAlign === 'top'"
          class="v-form-item__title"
          :style="{flex: `0 0 ${tWidth}`}"
        >{{ form.titleAlign === 'top' && !title ? '&nbsp;' : title }}</label>
      </div>
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
export default {
  name: 'VFormItem',
  components: { FormField },
  props: {
    title: { type: String, default: '' },
    titleWidth: { type: String, default: '' },
    span: { type: Number, default: () => 0 },
    rules: { type: Array, default: () => [] },
    prop: { type: String, default: '' },
    titlePrefix: { type: Object, default: () => { return null } }
  },
  data() {
    return {
      showMessage: false
    }
  },
  inject: ['form'],
  computed: {
    required() {
      return Boolean(this.rules.find((d) => d.required))
    },
    tWidth() {
      const { titleWidth, form } = this
      return titleWidth || form.titleWidth || '80px'
    }
  },
  mounted() {
    console.log(this.titlePrefix)
  },
  methods: {
    messageEnter(e) {
      this.showMessage = true
    },
    messageLeave(e) {
      this.showMessage = false
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
  &__tooltip {
    transform: rotate(-10deg);
        width: 14px;
    height: 14px;
    border-radius: 100%;
    background-color: #666;
    color: white;
    font-size: 12px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__message_container {
    position: absolute;
    width: 2000%;
    top: 0;
    left: 0;
  }
  &__message {
left: 17px;
    top: -29px;
    background: #666;
    height: 50px;
    position: absolute;
    border-radius: 5px;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 26px;
    font-size: 12px;
    padding: 0 10px;
    &::after {
      content: "";
    /* width: 10px; */
    /* height: 10px; */
    /* background-color: #666; */
    position: absolute;
    bottom: -14px;
    z-index: 99;
    left: 4px;
    border: 7px solid transparent;
    border-top: 7px solid #666;
    }
  }

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
    &::before,
    &::after {
      display: table;
      content: "";
    }
    &::after {
      clear: both;
    }
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

