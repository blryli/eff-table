const status = { rowIndex: 0, columnIndex: 0 }
/**
 * 基础渲染函数
 */
class Render {
  constructor(h, renderOpts = {}, params = {}) {
    const { name } = renderOpts
    const { columnIndex } = params
    columnIndex !== undefined && (status.columnIndex = columnIndex)
    const isBaseTag = ['div', 'span', 'i'].includes(name)
    this.h = h
    this.params = params
    this.opts = Object.assign({}, renderOpts)
    this.tag = isBaseTag ? name : params.table.$EFF.uiPrefix + name
  }

  // 合并属性 外部传入属性 > 默认属性
  merge(key, value) {
    this.opts[key] = Object.assign({}, value, this.opts[key])
    return this
  }

  // 设置属性
  set(key, value) {
    this.opts[key] = value
    return this
  }

  render() {
    const { h, tag, opts } = this
    const { data = {}, prop } = this.params

    return h(tag, opts, opts.content || data[prop] || '')
  }
}

// 默认 render
function renderDefault(h, renderOpts, params) {
  return new Render(h, renderOpts, params).render()
}

// 输入框 input
function renderInputEdit(h, renderOpts, params) {
  const { data, prop } = params
  const props = {
    value: data[prop] || null
  }
  const on = {
    input: val => (data[prop] = val)
  }
  const render = new Render(h, renderOpts, params)
  return render.merge('props', props).merge('on', on).render()
}

// 文本域 textarea
function renderTextareaEdit(h, renderOpts, params) {
  const opts = Object.assign({}, renderOpts, { name: 'input' })
  const { data, prop } = params
  const props = {
    value: data[prop] || null,
    type: 'textarea'
  }
  const on = {
    input: val => (data[prop] = val)
  }
  const render = new Render(h, opts, params)
  return render.merge('props', props).merge('on', on).render()
}

// 选择器 select
function renderSelectEdit(h, renderOpts, params) {
  console.log('renderSelectEdit')
  const { options } = renderOpts
  const { table, data, prop } = params
  const props = {
    value: data[prop] || null,
    automaticDropdown: true,
    filterable: true,
    defaultFirstOption: true
  }
  const on = {
    input: val => (data[prop] = val),
    'visible-change': table.setEditIsStop
  }
  const render = new Render(h, renderOpts, params)

  // 渲染options
  const optionsRender = options.map(item => h(table.$EFF.uiPrefix + 'option', { key: item.value, props: { title: item.title, value: item.value }}))
  return render.merge('props', props).merge('on', on).set('content', optionsRender).render()
}

// 日期 datepick
function renderDatepickerEdit(h, renderOpts, params) {
  const { table, data, prop } = params
  const props = {
    value: data[prop] || null,
    type: 'date',
    valueFormat: 'timestamp'
  }
  const on = {
    input: val => (data[prop] = val),
    focus: () => table.setEditIsStop(true),
    blur: () => table.setEditIsStop(false)
  }
  const render = new Render(h, renderOpts, params)
  return render.merge('props', props).merge('on', on).render()
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
    src: data[prop],
    previewSrcList: [data[prop]]
  }
  const render = new Render(h, renderOpts, params)
  return render.merge('props', props).render()
}

// 气泡 popover
function renderPopover(h, renderOpts, params) {
  const { children } = renderOpts
  const props = {
    trigger: 'hover'
  }
  const render = new Render(h, renderOpts, params)
  const renderChildren = children.map(opts => new Render(h, opts, params).render())
  return render.merge('props', props).set('content', renderChildren).render()
}

// 弹窗 dialog
function renderDialog(h, renderOpts, params) {
  const { children, on: { open, close, save } = {}} = renderOpts
  const { table, rowIndex, column, columnIndex } = params
  const props = {
    modal: false,
    title: column.title
  }
  function opened() {
    renderOpts.props.visible = true
    table.setEditIsStop(true)
    open && open()
  }
  function submit() {
    save && save()
    closed()
  }
  function closed() {
    renderOpts.props.visible = false
    table.setEditIsStop(false)
    close && close()
  }

  const on = { close: closed }

  // 激活弹窗
  if (rowIndex !== status.rowIndex || columnIndex !== status.columnIndex) {
    opened()
    status.rowIndex = rowIndex
  }

  const render = new Render(h, renderOpts, params)
  // 渲染内容及footer
  const renderChildren = [
    children.map(opts => new Render(h, opts, params).render()),
    h('span', { slot: 'footer' }, [
      new Render(h, { name: 'button', content: '取 消', on: { click: closed }}, params).render(),
      new Render(h, { name: 'button', props: { type: 'primary' }, content: '确 定', on: { click: submit }}, params).render()
    ])
  ]
  const modal = h('div', { attrs: { class: 'eff-modal' }, style: { display: renderOpts.props.visible ? 'block' : 'none' }})

  return [render.merge('props', props).merge('on', on).set('content', renderChildren).render(), modal]
}

// 表单 form
function renderForm(h, renderOpts, params) {
  const { children } = renderOpts
  const props = {

  }
  const render = new Render(h, renderOpts, params)
  const renderChildren = children.map(opts => new Render(h, opts, params).render())
  return render.merge('props', props).set('content', renderChildren).render()
}

// 文本 text
function renderText(h, renderOpts, params) {
  const { children } = renderOpts
  const props = {
    trigger: 'hover'
  }
  const render = new Render(h, renderOpts, params)
  const renderChildren = children.map(opts => new Render(h, opts, params).render())
  return render.merge('props', props).set('content', renderChildren).render()
}

const renderMap = {
  input: {
    renderDefault: renderDefault,
    renderEdit: renderInputEdit,
    renderSearch: renderInputEdit
  },
  textarea: {
    renderDefault: renderDefault,
    renderEdit: renderTextareaEdit,
    renderSearch: renderInputEdit
  },
  select: {
    renderDefault: renderDefault,
    renderEdit: renderSelectEdit
  },
  'date-picker': {
    renderDefault: renderDefault,
    renderEdit: renderDatepickerEdit
  },
  link: {
    renderDefault: renderLink,
    renderEdit: renderDialog
  },
  button: {
    renderDefault: renderDefault
  },
  image: {
    renderDefault: renderImage
  },
  popover: {
    renderDefault: renderPopover
  },
  dialog: {
    renderDialog: renderDialog,
    renderEdit: renderDialog
  },
  text: {
    renderDefault: renderText
  },
  form: {
    renderDefault: renderForm
  }
}
export const renderer = {
  get(name) {
    return renderMap[name] || null
  }
}
