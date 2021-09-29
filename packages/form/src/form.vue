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
    columns: { type: Array, default: () => ([]) },
    currentPath: { type: String, default: '' },
    titleWidth: { type: String, default: '' },
    titleAlign: { type: String, default: 'right' },
    lineHeight: { type: String, default: '32px' },
    itemGutter: { type: Number, default: 0 },
    rowledge: { type: String, default: '24px' },
    focusOpen: { type: Boolean, default: true },
    focusOptions: { type: Object, default: () => {} },
    focusTextAllSelected: { type: Boolean, default: true },
    width: { type: String, default: '' },
    messageType: { type: String, default: '' },
    focusStop: Boolean,
    focusPause: Boolean,
    readonly: Boolean,
    autofocus: Boolean
  },
  provide() {
    return {
      form: this,
      root: this
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
  mounted() {
    this.autofocus && this.$nextTick(() => {
      this.focus()
    })
  },
  methods: {
    itemRender(column) {
      const { $createElement, table, data, readonly } = this
      const { prop, itemRender, format } = column
      if (readonly) return XEUtils.get(data, prop)
      const params = { root: this, table, row: data, form: this, vue: this, data, column, prop }
      // 处理format
      if (XEUtils.isFunction(format)) {
        return format(params)
      }
      if (typeof itemRender === 'function') {
        return itemRender($createElement, { table, form: this, data }) || ''
      } else {
        const renderOpts = Object.assign({ name: 'input' }, itemRender)
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
    const { columns, titleAlign, width, $slots, itemGutter, itemRender, data, popoverOpts } = this
    return h('layout', {
      class: ['v-form', titleAlign ? `v-form--title-${titleAlign}` : ''],
      style: {
        width: width,
        'margin-left': itemGutter ? `-${itemGutter / 2}px` : '',
        'margin-right': itemGutter ? `-${itemGutter / 2}px` : ''
      }
    },
    [
      columns.map(column => {
        const props = Object.assign({}, column, { data, column })
        return h('v-form-item', { props }, [itemRender(column)])
      }),
      $slots.default,
      h('Popover', { ref: 'popover', attrs: popoverOpts })
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
  &::before, &::after{
    display: table;
    content: "";
  }
  &:after{
    clear: both;
  }

  &-line{
    &:before, &:after{
      display: table;
      content: "";
    }
    &:after {
      clear: both;
    }
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
