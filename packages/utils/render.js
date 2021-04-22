import toDateString from 'xe-utils/toDateString'
import isObject from 'xe-utils/isObject'
import isArray from 'xe-utils/isArray'
import { render } from 'core/render'

const status = { rowIndex: 0 }

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
  const { name, props, cellPath } = renderOpts || {}
  const { row, prop } = params || {}
  let cellLabel = row && prop && row[prop] || ''
  const renderFn = () => render(h, renderOpts, params).render()
  if (isObject(cellLabel)) {
    cellLabel = cellLabel[cellPath]
  }
  if (isArray(cellLabel)) {
    cellLabel.map(() => renderFn())
  }
  if (['input', 'textarea'].includes(name)) {
    return cellLabel
  } else if (name === 'date-picker') {
    return toDateString(cellLabel, 'yyyy-MM-dd')
  } else if (name === 'select') {
    const { labelName, options = [] } = renderOpts || []
    const { labelKey = 'label', valueKey = 'value' } = props || {}
    const opt = options.find(d => d[valueKey] === cellLabel) || {}
    return labelName ? row[labelName] : labelKey ? opt[labelKey] : cellLabel
  }
  return renderFn()
}

// 双向绑定组件 v-model
function renderVModel(h, renderOpts, params) {
  const { data, prop, searchChange } = params
  if (!data || !prop) return renderDefault(h, renderOpts, params)
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

  return render(h, renderOpts, params).merge('props', props).setOpts('on', on).render()
}

// 文本域 textarea
function renderTextareaEdit(h, renderOpts, params) {
  const { data, prop } = params
  const props = {
    value: data[prop] || null,
    type: 'textarea'
  }
  const on = getOn(renderOpts.on, {
    input: val => {
      data[prop] = val
    }
  })
  return render(h, renderOpts, params).setOpts('name', 'input').merge('props', props).setOpts('on', on).render()
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

  return render(h, renderOpts, params).merge('props', props).merge('on', ons).setOpts('children', optionsRender).render()
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

  return render(h, renderOpts, params).merge('props', props).merge('on', ons).render()
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
  return render(h, renderOpts, params).merge('props', props).render()
}

// 图片 image
function renderImage(h, renderOpts, params) {
  const { data, prop } = params
  const props = {
    src: data[prop]
  }
  return render(h, renderOpts, params).merge('props', props).render()
}

// 气泡 popover
function renderPopup(h, renderOpts, params) {
  const props = {
    palcement: 'top'
  }
  return render(h, renderOpts, params).merge('props', props).render()
}
function renderPopupEdit(h, renderOpts, params) {
  const props = {
    addToBody: false,
    palcement: 'bottom'
  }
  return render(h, renderOpts, params).merge('props', props).render()
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

  // 渲染内容及footer
  const renderChildren = [
    children.map((opts, idx) => render(h, opts, params, idx).render()),
    h('span', { slot: 'footer' }, [
      render(h, { name: 'button', key: 'cancel', children: '取 消', on: { click: closed }}, params).render(),
      render(h, { name: 'button', key: 'submit', props: { type: 'primary' }, children: '确 定', on: { click: submit }}, params).render()
    ])
  ]
  const modal = h('div', { attrs: { class: 'eff-modal' }, style: { display: renderOpts.props.visible ? 'block' : 'none' }})
  const { data, prop } = params

  return [h('input', { attrs: { value: data[prop], class: 'eff-table__popup', type: 'button' }}), render(h, renderOpts, params).merge('props', props).setOpts('on', on).setOpts('children', renderChildren).render(), modal]
}

// 表单 form
function renderForm(h, renderOpts, params) {
  const props = {

  }
  return render(h, renderOpts, params).merge('props', props).render()
}

// 开关 switch
function renderSwitch(h, renderOpts, params) {
  const { data, prop } = params
  const isBoolean = typeof data[prop] === 'boolean'
  const props = {
    value: data[prop],
    activeValue: isBoolean ? true : '1',
    inactiveValue: isBoolean ? false : '0'
  }
  const on = getOn(renderOpts.on, {
    input: val => {
      data[prop] = val
    }
  })
  return render(h, renderOpts, params).merge('props', props).setOpts('on', on).render()
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
      console.log(val)
      data[prop] = val
    }
  })
  const renderChildren = children.map((opts, idx) => {
    const { label } = opts.props || {}
    const childrenOpts = Object.assign({}, { children: label }, opts)
    return render(h, childrenOpts, params).render()
  })
  return render(h, renderOpts, params).merge('props', props).setOpts('on', on).setOpts('children', renderChildren).render()
}

// 标签 tag
function renderTag(h, renderOpts, params) {
  const props = {
    trigger: 'hover'
  }
  return render(h, renderOpts, params).merge('props', props).render()
}

// 文本 text
function renderText(h, renderOpts, params) {
  const props = {
    trigger: 'hover'
  }
  return render(h, renderOpts, params).merge('props', props).render()
}

const renderMap = {
  default: {
    renderDefault: renderDefault
  },
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
  tag: {
    renderDefault: renderTag,
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
