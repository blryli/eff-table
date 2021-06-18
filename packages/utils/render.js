import XEUtils from 'xe-utils'
import { render, getChildren } from 'core/render'
import map from 'core/render/map'

let oldData = null

// 合并事件，如果有相同的方法，内部方法先于外部方法执行
export function getOn(on, events, params = []) {
  if (typeof on !== 'object') return events
  const ons = Object.assign({}, on, events)
  for (const key in ons) {
    ons[key] = (...ags) => {
      events[key] && events[key](...ags, params)
      on[key] && on[key](...ags, params)
    }
  }
  return ons
}

function getPropValue(data, prop, root, rowIndex) {
  if (!data || !prop) return ''
  const { rowId } = root
  return prop in data ? data[prop] : root.editProps[rowId ? prop + data[rowId] : prop] || ''
}

function getOptions(options, params) {
  return typeof options === 'function' ? options(params) : options
}

// 默认 render
function renderDefault(h, renderOpts, params) {
  return render(h, renderOpts, params).render()
}

// 默认 render
function renderCell(h, renderOpts, params) {
  const { data, prop, root } = params || {}
  return getPropValue(data, prop, root)
}
function setPropValue(root, data, prop, val) {
  const { rowId } = root
  prop in data ? this.$set(data, prop, val) : this.$set(root.editProps, rowId ? prop + data[rowId] : prop, val)
  const arr = prop.split('.')
  while (arr.length > 1) {
    data = data[arr.shift()]
  }
  // data[arr[0]] = val
  this.$set(data, arr[0], val)
}
// 双向绑定组件 v-model
function renderVModel(h, renderOpts, params) {
  const { vue, root, data, table, column, prop, searchChange, rowIndex, columnIndex } = params
  if (!data || !prop) return renderDefault(h, renderOpts, params)
  const props = {
    value: getPropValue(data, prop, root)
  }
  const { placeholder } = renderOpts.props || {}
  const attrs = {
    placeholder: placeholder || '请输入' + (column.title || '内容')
  }

  if (params.row) {
    oldData = oldData === null ? params.row[params.fieldProp] : oldData
  }
  const onParams = { oldData: oldData, row: params.row, columnIndex: params.columnIndex, rowIndex: params.rowIndex }
  const on = getOn(renderOpts.on, {
    input: val => {
      setPropValue.call(vue, root, data, prop, val)
      // console.log('data', JSON.stringify(data, null, 2))
    },
    change: val => {
      if (!table) return
      searchChange && searchChange(val)
      if (table && ['radio', 'switch', 'radio-group', 'checkbox', 'checkbox-group'].indexOf(renderOpts.name) > -1) {
        table.editField([{ rowIndex, columnIndex, content: val }])
      }
    },
    blur: v => {
      oldData = null
    }
  }, onParams)

  return render(h, renderOpts, params).mergeOpts({ props, attrs, on }).render()
}

// 文本域 textarea
function renderTextareaEdit(h, renderOpts, params) {
  const { vue, data, prop, root } = params
  const props = {
    value: getPropValue(data, prop, root) || null,
    type: 'textarea'
  }
  if (params.row) {
    oldData = oldData === null ? params.row[params.prop] : oldData
  }
  const onParams = { oldData: oldData, row: params.row, columnIndex: params.columnIndex, rowIndex: params.rowIndex }
  const on = getOn(renderOpts.on, {
    input: val => {
      setPropValue.call(vue, root, data, prop, val)
    },
    blur: v => {
      oldData = null
    }
  }, onParams)

  return render(h, renderOpts, params).setOpts('name', 'input').mergeOpts({ props, on }).render()
}

// 选择器 select
function renderselectCell(h, renderOpts, params) {
  const { props, options = [] } = renderOpts || {}
  const { data, prop, root } = params || {}
  const cellLabel = getPropValue(data, prop, root)
  const { labelKey = 'label', valueKey = 'value' } = props || {}
  const opt = getOptions(options, params).find(d => ('' + d[valueKey]) === ('' + cellLabel)) || {}
  return opt[labelKey] || cellLabel
}
function renderSelect(h, renderOpts, params, renderType) {
  const { options = [], props: oProps = {}} = renderOpts
  const { vue, data = {}, root, column, prop, searchChange } = params
  const props = {
    value: data[prop] === undefined ? null : getPropValue(data, prop, root),
    placeholder: oProps.placeholder || '请选择' + (column.title || '')
  }
  const on = {
    input: val => {
      setPropValue.call(vue, root, data, prop, val)
      searchChange && searchChange(val)
    },
    blur: v => { oldData = null }

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
        'visible-change': (isExpend, val) => {
          root.setEditIsStop(isExpend)
        }
      })
    }
  }

  if (params.row) {
    oldData = oldData === null ? params.row[params.prop] : oldData
  }
  const onParams = { oldData: oldData, row: params.row, columnIndex: params.columnIndex, rowIndex: params.rowIndex }
  const ons = getOn(renderOpts.on, on, onParams)

  const { labelKey = 'label', valueKey = 'value' } = renderOpts.props || {}
  const optionsRender = getOptions(options, params).map(item => h(map.get('option'), { key: item.value, props: { label: item[labelKey], value: item[valueKey] }}))

  return render(h, renderOpts, params).mergeOpts({ props, on: ons }).set('children', optionsRender).render()
}
function renderSelectSearch(h, renderOpts, params) {
  return renderSelect(h, renderOpts, params, 'search')
}
function renderSelectEdit(h, renderOpts, params) {
  return renderSelect(h, renderOpts, params, 'edit')
}

// 日期 datepick
function renderdateCell(h, renderOpts, params) {
  const { format } = renderOpts || {}
  const { row, prop } = params || {}
  const cellLabel = row && prop && row[prop] || ''
  if (XEUtils.isArray(cellLabel)) {
    const [start, end] = cellLabel
    return [XEUtils.toDateString(start, format), '~', XEUtils.toDateString(end, format)]
  }
  return XEUtils.toDateString(cellLabel, format)
}
function renderDatepicker(h, renderOpts, params, renderType) {
  const { vue, root, data, prop, searchChange } = params
  const props = {
    value: getPropValue(data, prop, root)
  }
  const on = {
    input: val => {
      setPropValue.call(vue, root, data, prop, val)
      searchChange && searchChange(val)
    },
    blur: v => {
      oldData = null
    }

  }
  if (renderType) {
    if (renderType === 'search') {
      Object.assign(props, {
        type: 'daterange'
      })
    } else if (renderType === 'edit') {
      Object.assign(on, {
        focus: () => root.setEditIsStop(true),
        blur: () => root.setEditIsStop(false)
      })
    }
  }

  if (params.row) {
    oldData = oldData === null ? params.row[params.prop] : oldData
  }
  const onParams = { oldData: oldData, row: params.row, columnIndex: params.columnIndex, rowIndex: params.rowIndex }
  const ons = getOn(renderOpts.on, on, onParams)

  return render(h, renderOpts, params).mergeOpts({ props, on: ons }).render()
}
function renderDatepickerEdit(h, renderOpts, params) {
  return renderDatepicker(h, renderOpts, params, 'edit')
}
function renderDatepickerSearchRange(h, renderOpts, params) {
  return renderDatepicker(h, renderOpts, params, 'search')
}

// 链接 link
function renderLink(h, renderOpts, params) {
  const { data, prop, root } = params
  const { props: oProps = {}} = renderOpts
  const props = {
    type: oProps.type || 'primary'
  }
  return render(h, renderOpts, params).mergeOpts({ props }).set('children', getPropValue(data, prop, root)).render()
}

// 图片 image
function renderImage(h, renderOpts, params) {
  const { data, prop, root } = params
  const props = {
    src: getPropValue(data, prop, root)
  }
  return render(h, renderOpts, params).mergeOpts({ props }).render()
}

// 气泡 popover
function renderPopup(h, renderOpts, params) {
  const { props: oProps = {}} = renderOpts
  const props = {
    palcement: oProps.palcement || 'top'
  }
  return render(h, renderOpts, params).mergeOpts({ props }).render()
}
function renderPopupEdit(h, renderOpts, params) {
  const props = {
    addToBody: false,
    palcement: 'bottom'
  }
  return render(h, renderOpts, params).mergeOpts({ props }).render()
}

// 弹窗 dialog
function renderDialog(h, renderOpts, params) {
  const { children, on: { save } = {}} = renderOpts
  const { root, column, edit } = params
  const props = {
    visible: edit.dialogVisible,
    modal: false,
    title: column.title
  }

  if (edit.dialogVisible) root.setEditIsStop(true)
  function submit() {
    save && save()
    closed()
  }
  function closed() {
    edit.dialogVisible = false
    root.setEditIsStop(false)
  }

  const on = getOn(renderOpts.on, {
    close: closed
  })

  // 渲染内容及footer
  const renderChildren = [
    getChildren(h, children, params),
    h('span', { slot: 'footer' }, [
      render(h, { name: 'button', key: 'cancel', children: '取 消', on: { click: closed }}, params).render(),
      render(h, { name: 'button', key: 'submit', props: { type: 'primary' }, children: '确 定', on: { click: submit }}, params).render()
    ])
  ]
  const modal = h('div', { attrs: { class: 'eff-modal' }, style: { display: edit.dialogVisible ? 'block' : 'none' }})
  const { data, prop } = params

  return [
    h('div', { attrs: { class: 'eff-table__popup' }}, getPropValue(data, prop, root)),
    render(h, renderOpts, params).mergeOpts({ props, on }).set('children', renderChildren).render(),
    modal
  ]
}

// 表单 form
function renderForm(h, renderOpts, params) {
  const props = {

  }
  return render(h, renderOpts, params).mergeOpts({ props }).render()
}

// 开关 switch
function renderSwitch(h, renderOpts, params) {
  const { vue, table, rowIndex, columnIndex, data, prop, root } = params
  const isBoolean = typeof getPropValue(data, prop, root) === 'boolean'
  const props = {
    value: isBoolean ? getPropValue(data, prop, root) : '' + getPropValue(data, prop, root),
    activeValue: isBoolean ? true : '1',
    inactiveValue: isBoolean ? false : '0'
  }
  if (params.row) {
    oldData = oldData === null ? params.row[params.prop] : oldData
  }
  const onParams = { oldData: oldData, row: params.row, columnIndex: params.columnIndex, rowIndex: params.rowIndex }
  const on = getOn(renderOpts.on, {
    input: val => {
      setPropValue.call(vue, root, data, prop, isBoolean ? val : '' + val)
    },
    change: val => {
      if (table && ['radio', 'switch', 'radio-group', 'checkbox', 'checkbox-group'].indexOf(renderOpts.name) > -1) {
        table.editField([{ rowIndex, columnIndex, content: val }])
      }
    },
    blur: v => {
      oldData = null
    }
  }, onParams)
  return render(h, renderOpts, params).mergeOpts({ props }).setOpts('on', on).render()
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
  const { data, vue, prop, root } = params
  const props = {
    value: getPropValue(data, prop, root) || []
  }
  if (params.row) {
    oldData = oldData === null ? params.row[params.prop] : oldData
  }
  const onParams = { oldData: oldData, row: params.row, columnIndex: params.columnIndex, rowIndex: params.rowIndex }
  const on = getOn(renderOpts.on, {
    input: val => {
      setPropValue.call(vue, root, data, prop, val)
    },
    blur: v => {
      oldData = null
    }
  }, onParams)
  const renderChildren = children.map((opts, idx) => {
    const { label } = opts.props || {}
    const childrenOpts = Object.assign({}, { children: label }, opts)
    return render(h, childrenOpts, params).render()
  })
  return render(h, renderOpts, params).mergeOpts({ props, on }).set('children', renderChildren).render()
}

// 标签 tag
function renderTag(h, renderOpts, params) {
  const { options, labelKey = 'label', valueKey = 'value' } = renderOpts
  const { data, prop, root } = params || {}
  const value = getPropValue(data, prop, root)
  if (!value) return ''
  return (XEUtils.isArray(value) ? value : [value]).map(d => {
    const label = (getOptions(options, params).find(o => o[valueKey] === d) || {})[labelKey]
    return render(h, renderOpts, params).set('children', label).render()
  })
}

// 文本 text
function renderText(h, renderOpts, params) {
  const props = {
    trigger: 'hover'
  }
  return render(h, renderOpts, params).mergeOpts({ props }).render()
}

const renderMap = {
  default: {
    renderDefault: renderDefault
  },
  input: {
    renderDefault: renderCell,
    renderEdit: renderVModel,
    renderSearch: renderVModel
  },
  textarea: {
    renderDefault: renderCell,
    renderEdit: renderTextareaEdit,
    renderSearch: renderVModel
  },
  select: {
    renderDefault: renderselectCell,
    renderEdit: renderSelectEdit,
    renderSearch: renderSelectSearch
  },
  'date-picker': {
    renderDefault: renderdateCell,
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
    renderEdit: renderSelectEdit
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
  radio: {
    renderDefault: renderVModel
  },
  'radio-group': {
    renderDefault: renderVModel
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
