import toDateString from 'xe-utils/toDateString'
const status = { rowIndex: 0 }
/**
 * 基础渲染函数
 */
class Render {
  constructor(h, renderOpts = {}, params = {}, key) {
    this.h = h
    this.params = params
    const { rowIndex = 0, columnIndex = 0 } = params
    this.opts = Object.assign({ key: `${rowIndex}-${columnIndex}-${renderOpts.name}${key ? '-' + key : ''}` }, renderOpts)
  }

  // 合并属性 外部传入属性 > 默认属性
  merge(key, value) {
    this.opts[key] = Object.assign({}, value, this.opts[key])
    return this
  }

  // 设置属性
  setOpts(key, value) {
    this.opts[key] = value
    return this
  }

  render() {
    const { h, opts } = this
    const { data = {}, prop } = this.params
    const { tag, name } = opts
    const cTag = tag || this.params.table.$EFF.uiPrefix + name

    return h(cTag, opts, opts.content || data[prop] || '')
  }
}

// 合并事件，如果有相同的方法，内部方法先于外部方法执行
export function getOn(on, events) {
  if (typeof on !== 'object') return events
  const ons = Object.assign({}, on, events)
  for (const key in events) {
    if (on[key]) {
      ons[key] = val => {
        events[key](val)
        on[key](val)
      }
    }
  }
  return ons
}

// 默认 render
function renderDefault(h, renderOpts, params) {
  const { tag, name, props } = renderOpts || {}
  const { row, prop } = params || {}
  const label = row && prop && row[prop] || ''
  const render = () => new Render(h, renderOpts, params).render()
  if (tag) {
    return render()
  } else if (['input', 'textarea'].includes(name)) {
    return label
  } else if (name === 'select') {
    const { labelName, options = [] } = renderOpts || []
    const { labelKey = 'label', valueKey = 'value' } = props || {}
    const opt = options.find(d => d[valueKey] === label) || {}
    return labelName ? row[labelName] : labelKey ? opt[labelKey] : label
  } else if (name === 'date-picker') {
    return toDateString(label, 'yyyy-MM-dd')
  }
  return render()
}

// 双向绑定组件 v-model
function renderVModel(h, renderOpts, params) {
  const { data, prop, searchChange } = params
  const props = {
    value: data[prop] || null
  }
  const on = getOn(renderOpts.on, {
    input: val => {
      data[prop] = val
    },
    change: val => {
      searchChange && searchChange(val)
    }
  })

  const render = new Render(h, renderOpts, params)
  return render.merge('props', props).setOpts('on', on).render()
}

// 文本域 textarea
function renderTextareaEdit(h, renderOpts, params) {
  const { data, prop } = params
  console.log('params', params)
  console.log({ data, prop })
  const props = {
    value: data[prop] || null,
    type: 'textarea'
  }
  const on = getOn(renderOpts.on, {
    input: val => {
      data[prop] = val
    }
  })
  const render = new Render(h, renderOpts, params)
  return render.setOpts('name', 'input').merge('props', props).setOpts('on', on).render()
}

// 选择器 select
function renderSelect(h, renderOpts, params, renderType) {
  const { options = [] } = renderOpts
  const { table, data, prop, searchChange } = params
  const props = {
    value: data[prop] || null,
    placeholder: '请选择'
  }
  const on = {
    input: val => {
      data[prop] = val
      searchChange && searchChange(val)
    }
  }
  if (renderType) {
    Object.assign(props, {
      filterable: true,
      clearable: true
    })
    if (renderType === 'edit') {
      Object.assign(props, {
        automaticDropdown: true,
        defaultFirstOption: true
      })
      Object.assign(on, {
        'visible-change': table.setEditIsStop
      })
    }
  }

  const ons = getOn(renderOpts.on, on)

  // 渲染options
  const { labelKey = 'label', valueKey = 'value' } = renderOpts.props || {}
  const optionsRender = options.map(item => h(table.$EFF.uiPrefix + 'option', { key: item.value, props: { label: item[labelKey], value: item[valueKey] }}))

  const render = new Render(h, renderOpts, params)
  return render.merge('props', props).merge('on', ons).setOpts('content', optionsRender).render()
}
function renderSelectSearch(h, renderOpts, params) {
  return renderSelect(h, renderOpts, params, 'search')
}
function renderSelectEdit(h, renderOpts, params) {
  return renderSelect(h, renderOpts, params, 'edit')
}

// 日期 datepick
function renderDatepicker(h, renderOpts, params, renderType) {
  const { table, data, prop, searchChange } = params
  const props = {
    value: data[prop] || null,
    valueFormat: 'timestamp' // 时间格式默认用时间戳
  }
  const on = {
    input: val => {
      data[prop] = val
      searchChange && searchChange(val)
    }
  }
  if (renderType) {
    if (renderType === 'search') {
      Object.assign(props, {
        type: 'daterange'
      })
    } else if (renderType === 'edit') {
      Object.assign(on, {
        focus: () => table.setEditIsStop(true),
        blur: () => table.setEditIsStop(false)
      })
    }
  }

  const ons = getOn(renderOpts.on, on)

  const render = new Render(h, renderOpts, params)
  return render.merge('props', props).merge('on', ons).render()
}
function renderDatepickerEdit(h, renderOpts, params) {
  return renderDatepicker(h, renderOpts, params, 'edit')
}
function renderDatepickerSearchRange(h, renderOpts, params) {
  return renderDatepicker(h, renderOpts, params, 'search')
}

// 链接 link
function renderLink(h, renderOpts, params) {
  const props = {
    type: 'primary'
  }
  const render = new Render(h, renderOpts, params)
  return render.merge('props', props).render()
}

// 图片 image
function renderImage(h, renderOpts, params) {
  const { data, prop } = params
  const props = {
    src: data[prop]
  }
  const render = new Render(h, renderOpts, params)
  return render.merge('props', props).render()
}

// 气泡 popover
function renderPopup(h, renderOpts, params) {
  const { children = [] } = renderOpts
  const props = {
    palcement: 'top'
  }
  const render = new Render(h, renderOpts, params)
  const renderChildren = children.map((opts, idx) => new Render(h, opts, params, idx).render())
  return render.setOpts('tag', 'popup').merge('props', props).setOpts('content', renderChildren).render()
}
function renderPopupEdit(h, renderOpts, params) {
  const { children = [] } = renderOpts
  const props = {
    addToBody: false,
    palcement: 'bottom'
  }
  const render = new Render(h, renderOpts, params)
  const renderChildren = children.map((opts, idx) => new Render(h, opts, params, idx).render())
  return render.setOpts('tag', 'popup').merge('props', props).setOpts('content', renderChildren).render()
}

// 弹窗 dialog
function renderDialog(h, renderOpts, params) {
  const { children, on: { save } = {}} = renderOpts
  const { table, rowIndex, column, columnIndex } = params
  const props = {
    modal: false,
    title: column.title
  }
  function opened() {
    if (!renderOpts.props) renderOpts.props = {}
    renderOpts.props.visible = true
    table.setEditIsStop(true)
  }
  function submit() {
    save && save()
    closed()
  }
  function closed() {
    renderOpts.props.visible = false
    table.setEditIsStop(false)
  }

  const on = getOn(renderOpts.on, {
    close: closed
  })

  // 激活弹窗
  // console.log(rowIndex, status.rowIndex, columnIndex, status.columnIndex)
  if (rowIndex !== status.rowIndex || columnIndex !== table.editStore.oldColumnIndex) {
    opened()
    status.rowIndex = rowIndex
    table.editStore.oldColumnIndex = columnIndex
  }

  const render = new Render(h, renderOpts, params)
  // 渲染内容及footer
  const renderChildren = [
    children.map((opts, idx) => new Render(h, opts, params, idx).render()),
    h('span', { slot: 'footer' }, [
      new Render(h, { name: 'button', key: 'cancel', content: '取 消', on: { click: closed }}, params).render(),
      new Render(h, { name: 'button', key: 'submit', props: { type: 'primary' }, content: '确 定', on: { click: submit }}, params).render()
    ])
  ]
  const modal = h('div', { attrs: { class: 'eff-modal' }, style: { display: renderOpts.props.visible ? 'block' : 'none' }})
  const { data, prop } = params

  return [h('input', { attrs: { value: data[prop], class: 'eff-table__popup', type: 'button' }}), render.merge('props', props).setOpts('on', on).setOpts('content', renderChildren).render(), modal]
}

// 表单 form
function renderForm(h, renderOpts, params) {
  const { children = [] } = renderOpts
  const props = {

  }
  const render = new Render(h, renderOpts, params)
  const renderChildren = children.map((opts, idx) => new Render(h, opts, params, idx).render())
  return render.merge('props', props).setOpts('content', renderChildren).render()
}

// 开关 switch
function renderSwitch(h, renderOpts, params) {
  const { data, prop } = params
  const props = {
    value: Boolean(+data[prop])
  }
  const on = getOn(renderOpts.on, {
    input: val => {
      data[prop] = val
    }
  })
  const render = new Render(h, renderOpts, params)
  return render.merge('props', props).setOpts('on', on).render()
}

function renderSwitchEdit(h, renderOpts, params) {
  const opts = Object.assign({ options: [{ value: '1', label: '开' }, { value: '0', label: '关' }] }, renderOpts, { name: 'select' })
  return renderSelectEdit(h, opts, params)
}
function renderSwitchSearch(h, renderOpts, params) {
  const opts = Object.assign({ options: [{ value: '1', label: '开' }, { value: '0', label: '关' }] }, renderOpts, { name: 'select' })
  return renderSelectSearch(h, opts, params)
}

// 多选框组 checkbox-group
function renderCheckboxGroup(h, renderOpts, params) {
  const { children = [] } = renderOpts
  const { data, prop } = params
  const props = {
    value: data[prop] || []
  }
  const on = getOn(renderOpts.on, {
    input: val => {
      data[prop] = val
    }
  })
  const render = new Render(h, renderOpts, params)
  const renderChildren = children.map((opts, idx) => {
    const { label } = opts.props || {}
    const childrenOpts = Object.assign({}, { content: label }, opts)
    return new Render(h, childrenOpts, params, idx).render()
  })
  return render.merge('props', props).setOpts('on', on).setOpts('content', renderChildren).render()
}

// 文本 text
function renderText(h, renderOpts, params) {
  const { children = [] } = renderOpts
  const props = {
    trigger: 'hover'
  }
  const render = new Render(h, renderOpts, params)
  const renderChildren = children.map((opts, idx) => new Render(h, opts, params, idx).render())
  return render.merge('props', props).setOpts('content', renderChildren).render()
}

const renderMap = {
  renderDefault: renderDefault,
  input: {
    renderDefault: renderDefault,
    renderEdit: renderVModel,
    renderSearch: renderVModel
  },
  textarea: {
    renderDefault: renderDefault,
    renderEdit: renderTextareaEdit,
    renderSearch: renderVModel
  },
  select: {
    renderDefault: renderDefault,
    renderEdit: renderSelectEdit,
    renderSearch: renderSelectSearch
  },
  'date-picker': {
    renderDefault: renderDefault,
    renderEdit: renderDatepickerEdit,
    renderSearch: renderDatepicker,
    renderSearchRange: renderDatepickerSearchRange
  },
  link: {
    renderDefault: renderLink,
    renderEdit: renderDefault
  },
  button: {
    renderDefault: renderDefault
  },
  image: {
    renderDefault: renderImage,
    renderEdit: renderDialog
  },
  popup: {
    renderDefault: renderPopup,
    renderEdit: renderPopupEdit
  },
  dialog: {
    renderDefault: renderDialog,
    renderEdit: renderDialog
  },
  text: {
    renderDefault: renderText
  },
  form: {
    renderDefault: renderForm
  },
  switch: {
    renderDefault: renderSwitch,
    renderEdit: renderSwitchEdit,
    renderSearch: renderSwitchSearch
  },
  checkbox: {
    renderDefault: renderVModel
  },
  'checkbox-group': {
    renderDefault: renderCheckboxGroup
  }
}
export const renderer = {
  get(name) {
    return renderMap[name] || null
  }
}
