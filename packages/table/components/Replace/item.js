import Icon from 'pk/icon'
import Popover from 'packages/popover'
import { renderer } from 'pk/utils/render'

export default {
  name: 'ReplaceItem',
  components: {
  },
  props: {
    column: { type: Object, default: () => ({}) },
    options: { type: Array, default: () => [] }
  },
  data() {
    return {
      form: { [this.column.prop]: '', type: '' },
      show: false,
      reference: null,
      obj: { replaceValue: '', selectValue: '' }
    }
  },
  inject: ['table'],
  computed: {

  },
  mounted() {

  },
  beforeDestroy() {
  },
  methods: {
    setEditIsStop() { }
  },
  render(h) {
    const ExSelect = renderer.get('select').renderEdit(h, { name: 'select', options: this.options, placeholder: '', class: 'full-width' }, { vue: this, data: this.obj, prop: 'selectValue', root: this, column: { title: '要被替换的内容' }})
    const Input = renderer.get('input').renderEdit(h, { name: 'input', placeholder: '' }, { vue: this, data: this.obj, prop: 'replaceValue', root: this, column: { title: '替换内容' }})
    console.log(ExSelect, 123)
    return (
      <div class='flex full-width'>
        <div class='flex-sub flex align-center justify-center'>{this.column.title}</div>
        <div class='flex-twice margin-left-sm'>{ExSelect}</div>
        <div class='flex-twice margin-left-sm'>{Input}</div>
      </div>
    )
  }
}
