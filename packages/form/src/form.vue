<script>
import Validator from 'pk/form/mixins/validator'
import FocusControl from 'pk/form/mixins/focusControl'
import { renderer } from 'pk/utils/render'
import VFormItem from './form-item'
import Popover from 'pk/popover'
import XEUtils from 'xe-utils'

export default {
  name: 'VForm',
  components: { VFormItem, Popover },
  mixins: [Validator, FocusControl],
  props: {
    data: { type: Object, default: () => ({}) },
    items: { type: Array, default: () => ([]) },
    direction: { type: String, default: 'row' },
    currentPath: { type: String, default: '' },
    titleWidth: { type: String, default: '' },
    titleAlign: { type: String, default: 'right' },
    lineHeight: { type: String, default: '32px' },
    itemGutter: { type: Number, default: 0 },
    rowledge: { type: String, default: '24px' },
    focusOpen: { type: Boolean, default: false },
    focusOptions: { type: Object, default: () => {} },
    width: { type: String, default: '' },
    messageType: { type: String, default: '' },
    focusStop: Boolean,
    focusPause: Boolean,
    readonly: Boolean,
    autofocus: Boolean,
    focusToSelect: Boolean // 聚焦是否全选
  },
  provide() {
    return {
      form: this,
      root: this,
      table: this
    }
  },
  inject: {
    table: { default: null }
  },
  data() {
    return {
      inputIndex: 0,
      editIsStop: this.focusStop,
      popoverOpts: {}
    }
  },
  computed: {
    formClass() {
      const { titleAlign } = this
      let formClass = 'v-form '
      titleAlign &&
        (formClass += `v-form--title-${titleAlign} `)
      return formClass
    }
  },
  watch: {
    focusStop(val) {
      this.editIsStop = val
    }
  },
  created() {
    const { focusToSelect } = this.$EFF
    Object.assign(this, {
      formFocusToSelect: this.focusToSelect || !!focusToSelect
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.autofocus && this.focus()
    })
  },
  methods: {
    itemRender(column) {
      const { $createElement, table, data, readonly } = this
      const { prop, options, label = 'label', value = 'value', format } = column
      const itemRender = XEUtils.clone(column.itemRender, true)
      if (readonly) return XEUtils.get(data, prop)
      const params = { root: this, table, row: data, form: this, vue: this, data, column, prop }
      // 处理format
      if (XEUtils.isFunction(format)) {
        return format(params)
      }
      if (typeof itemRender === 'function') {
        return itemRender($createElement, { table, form: this, data }) || ''
      } else {
        const renderOpts = Object.assign({ name: 'input', options, label, value }, itemRender)
        const { name } = renderOpts
        const compConf = renderer.get(name)
        if (compConf) {
          const render = compConf.renderEdit || compConf.renderDefault
          return render($createElement, renderOpts, params) || ''
        }
        return ''
      }
    },
    setEditStop(val) {
      this.editIsStop = val
    },
    tipShow(opts) {
      this.$refs.popover.doShow()
      this.popoverOpts = opts
    },
    tipClose() {
      this.$refs.popover.doHide()
    },
    // 清除状态
    clearStatus() {
      this.formItems.forEach(d => {
        d.slot.updateField()
      })
    },
    // 重置表单
    resetFields() {
      this.clearValidate()
      this.formItems.forEach(d => {
        d.slot.resetField()
      })
    },
    getFormData() {
      return this.data
    }
  },
  render(h) {
    const { items, titleAlign, width, $slots, itemGutter, rowledge, itemRender, data, popoverOpts, direction } = this
    return h('div', {
      class: ['v-form', titleAlign ? `v-form--title-${titleAlign}` : '', direction === 'column' ? 'is--column' : ''],
      style: {
        width: width,
        'column-gap': itemGutter + 'px',
        'row-gap': rowledge
      }
    },
    [
      $slots.form || items.map(column => {
        const props = Object.assign({}, column, { data, column })
        const { prop } = column
        const slot = $slots['item_' + prop]
        return h('v-form-item', { props }, [slot || itemRender(column)])
      }),
      $slots.default,
      h('Popover', { ref: 'popover', props: popoverOpts })
    ])
  }
}
</script>

<style lang="scss">
.v-form {
  position: relative;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  &.is--column{
    flex-direction: column;
  }

  .is--dirty::before{
    content: "";
    top: -3px;
    left: -5px;
    position: absolute;
    border-width: 5px;
    border-style: solid;
    border-color: transparent #f56c6c transparent transparent;
    transform: rotate(45deg);
    z-index: 1;
  }
}
</style>
