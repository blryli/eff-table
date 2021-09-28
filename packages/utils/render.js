import XEUtils from 'xe-utils'
import { render, getChildren } from 'core/render'
import map from 'core/render/map'
import { setFieldValue, getFieldValue, isNoValue } from 'pk/utils'

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

export function getOptions(renderOpts, params) {
  const { options, props = {}} = renderOpts
  const ot = options || props.options || []
  const opts = typeof ot === 'function' ? ot(params) : ot
  return Array.isArray(opts) ? opts : [opts]
}

// 带标签的 children
function getOptionsRender(h, renderOpts, params, optionName) {
  const { props = {}} = renderOpts
  const { labelKey = 'label', valueKey = 'value' } = props
  return getOptions(renderOpts, params).map(item => h(map.get(optionName), { key: item.value, props: { label: item[labelKey], value: item[valueKey], disabled: Boolean(item.disabled) }}))
}

// 默认 render
function renderDefault(h, renderOpts, params) {
  const on = getOn(renderOpts.on, {}, params)
  return render(h, renderOpts, params).mergeOpts({ on }).render()
}

// 默认 render
function renderCell(h, renderOpts, params) {
  const { data, prop } = params || {}
  return getFieldValue(data, prop)
}

// 双向绑定组件 v-model
function renderVModel(h, renderOpts, params) {
  const { vue, root, data, table, row, column, prop, searchChange, rowIndex, columnIndex } = params
  if (!data || !prop) return renderDefault(h, renderOpts, params)
  const props = {
    value: getFieldValue(data, prop)
  }
  const { placeholder } = renderOpts.props || {}
  const attrs = {
    placeholder: placeholder || '请输入' + (column.title || '内容')
  }

  if (params.row) {
    oldData = oldData === null ? params.row[params.fieldProp] : oldData
  }
  const onParams = { oldData: oldData, row, columnIndex, rowIndex }
  const on = getOn(renderOpts.on, {
    input: val => {
      setFieldValue.call(vue, root, data, prop, val)
      if (table && ['radio', 'switch', 'radio-group', 'checkbox', 'checkbox-group'].indexOf(renderOpts.name) > -1) {
        table.editField([{ row, rowIndex, columnIndex, content: val }])
      }
      // console.log('data', JSON.stringify(data, null, 2))
    },
    change: val => {
      if (!table) return
      searchChange && searchChange(val)
    },
    blur: v => {
      oldData = null
    },
    'visible-change': (isExpend, val) => {
      root.setEditStop(isExpend)
    }
  }, onParams)

  return render(h, renderOpts, params).mergeOpts({ props, attrs, on }).render()
}

// 文本域 textarea
function renderTextareaEdit(h, renderOpts, params) {
  const { vue, data, prop, root } = params
  const props = {
    value: getFieldValue(data, prop) || null,
    type: 'textarea'
  }
  if (params.row) {
    oldData = oldData === null ? params.row[params.prop] : oldData
  }
  const onParams = { oldData: oldData, row: params.row, columnIndex: params.columnIndex, rowIndex: params.rowIndex }
  const on = getOn(renderOpts.on, {
    input: val => {
      setFieldValue.call(vue, root, data, prop, val)
    },
    blur: v => {
      oldData = null
    }
  }, onParams)

  return render(h, renderOpts, params).setOpts('name', 'input').mergeOpts({ props, on }).render()
}

// 选择器 select
function renderselectCell(h, renderOpts, params) {
  try {
    const { props } = renderOpts || {}
    const { data, prop } = params || {}
    const cellLabel = getFieldValue(data, prop)
    const { labelKey = 'label', valueKey = 'value' } = props || {}
    const getLabel = value => {
      const opt = getOptions(renderOpts, params).find(d => !isNoValue(d[valueKey]) && ('' + d[valueKey]) === ('' + value)) || {}
      return opt[labelKey] || value
    }
    if (XEUtils.isArray(cellLabel)) {
      return cellLabel.reduce((acc, cur) => acc ? acc + '，' + getLabel(cur) : getLabel(cur), '')
    } else {
      return getLabel(cellLabel)
    }
  } catch (error) {
    console.error(error)
  }
}
function renderSelect(h, renderOpts, params, renderType) {
  const { props: oProps = {}} = renderOpts
  const { vue, data = {}, root, column, prop, searchChange } = params
  const props = {
    value: data[prop] === undefined ? null : getFieldValue(data, prop),
    placeholder: oProps.placeholder || '请选择' + (column.title || '')
  }
  const on = {
    input: val => {
      setFieldValue.call(vue, root, data, prop, val)
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
          root.setEditStop(isExpend)
        }
      })
    }
  }

  if (params.row) {
    oldData = oldData === null ? params.row[params.prop] : oldData
  }
  const onParams = { oldData: oldData, row: params.row, columnIndex: params.columnIndex, rowIndex: params.rowIndex }
  const ons = getOn(renderOpts.on, on, onParams)

  const optionsRender = getOptionsRender(h, renderOpts, params, 'option')

  return render(h, renderOpts, params).mergeOpts({ props, on: ons }).set('children', optionsRender).render()
}
function renderSelectSearch(h, renderOpts, params) {
  return renderSelect(h, renderOpts, params, 'search')
}
function renderSelectEdit(h, renderOpts, params) {
  return renderSelect(h, renderOpts, params, 'edit')
}

// 日期 datepick
function renderDateCell(h, renderOpts = {}, params = {}) {
  const { props: { format = 'yyyy-MM-dd' } = {}} = renderOpts
  const { row, prop } = params
  const cellLabel = row && prop && row[prop] || ''
  if (XEUtils.isArray(cellLabel)) {
    const [start, end] = cellLabel
    return [XEUtils.toDateString(start, format), '~', XEUtils.toDateString(end, format)]
  }
  return XEUtils.toDateString(cellLabel, format)
}
function renderDatepicker(h, renderOpts, params, renderType) {
  const { vue, root, data, prop, searchChange } = params
  const { props: sourceProps = {}} = renderOpts
  const valueFormat = sourceProps['value-format'] || sourceProps['valueFormat'] || 'yyyy-MM-dd'

  const props = {
    value: XEUtils.toDateString(getFieldValue(data, prop), valueFormat)
  }
  const on = {
    input: val => {
      setFieldValue.call(vue, root, data, prop, val)
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
        focus: () => root.setEditStop(true),
        blur: () => root.setEditStop(false)
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
  const { data, prop } = params
  const { props: oProps = {}} = renderOpts
  const props = {
    type: oProps.type || 'primary'
  }
  return render(h, renderOpts, params).mergeOpts({ props }).set('children', getFieldValue(data, prop)).render()
}

// 图片 image
function renderImage(h, renderOpts, params) {
  const { data, prop } = params
  const props = {
    src: getFieldValue(data, prop)
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
    title: column.title,
    addendToBody: true
  }

  if (edit.dialogVisible) root.setEditStop(true)
  function submit() {
    save && save()
    closed()
  }
  function closed() {
    edit.dialogVisible = false
    root.setEditStop(false)
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
    h('div', { attrs: { class: 'eff-table__popup' }}, getFieldValue(data, prop)),
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
  const { vue, table, row, rowIndex, columnIndex, data, prop, root } = params
  const isBoolean = typeof getFieldValue(data, prop) === 'boolean'
  const props = {
    value: isBoolean ? getFieldValue(data, prop) : '' + getFieldValue(data, prop),
    activeValue: isBoolean ? true : '1',
    inactiveValue: isBoolean ? false : '0'
  }
  if (params.row) {
    oldData = oldData === null ? params.row[params.prop] : oldData
  }
  const onParams = { oldData: oldData, row, columnIndex, rowIndex }
  const on = getOn(renderOpts.on, {
    input: val => {
      setFieldValue.call(vue, root, data, prop, isBoolean ? val : '' + val)
    },
    change: val => {
      if (table && ['radio', 'switch', 'radio-group', 'checkbox', 'checkbox-group'].indexOf(renderOpts.name) > -1) {
        table.editField([{ row, rowIndex, columnIndex, content: val }])
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
    value: getFieldValue(data, prop) || []
  }
  if (params.row) {
    oldData = oldData === null ? params.row[params.prop] : oldData
  }
  const onParams = { oldData: oldData, row: params.row, columnIndex: params.columnIndex, rowIndex: params.rowIndex }
  const on = getOn(renderOpts.on, {
    input: val => {
      setFieldValue.call(vue, root, data, prop, val)
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
  try {
    const { labelKey = 'label' } = renderOpts
    const { data, prop } = params || {}
    const value = getFieldValue(data, prop)
    if (!value) return ''
    return (XEUtils.isArray(value) ? value : [value]).map(d => {
      const label = (getOptions(renderOpts, params).find(o => !isNoValue(o[labelKey]) && ('' + o[labelKey] === '' + d)) || {})[labelKey]
      return render(h, renderOpts, params).set('children', label).render()
    })
  } catch (error) {
    console.error(error)
  }
}

// 级联选择器 cascader
function renderCascader(h, renderOpts, params) {
  try {
    const { data, prop } = params || {}
    const { props = {}} = renderOpts
    const cascaderProps = props.props || {}
    const { label = 'label', value = 'value', children = 'children' } = cascaderProps
    const cascaderValue = getFieldValue(data, prop) || []
    if (!XEUtils.isArray(cascaderValue)) return []
    let opts = getOptions(renderOpts, params)
    return cascaderValue.reduce((acc, cur, index) => {
      const op = opts.find(d => d[value] === cur)
      if (op) {
        opts = op[children]
        if (props['show-all-levels'] === false) {
          if (index === cascaderValue.length - 1) return acc.concat([op[label]])
          return acc
        } else {
          return acc.concat([op[label]])
        }
      }
      return acc
    }, []).join('/')
  } catch (error) {
    console.error(error)
    return []
  }
}
function renderCascaderEdit(h, renderOpts, params) {
  renderOpts.props.options = getOptions(renderOpts, params)
  return renderVModel(h, renderOpts, params)
}
const vModelMap = ['radio', 'radio-group', 'checkbox']
const defMap = ['default', 'button', 'tooltip', 'layout', 'dropdown', 'help', 'ciphertext']
const renderMap = Object.assign({
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
    renderDefault: renderDateCell,
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
  form: {
    renderDefault: renderForm
  },
  switch: {
    renderDefault: renderSwitch,
    renderEdit: renderSwitchEdit,
    renderSearch: renderSwitchSearch
  },
  'checkbox-group': {
    renderDefault: renderCheckboxGroup
  },
  cascader: {
    renderDefault: renderCascader,
    renderEdit: renderCascaderEdit
  }
}, defMap.reduce((acc, cur) => {
  acc[cur] = { renderDefault }
  return acc
}, {}), vModelMap.reduce((acc, cur) => {
  acc[cur] = { renderDefault: renderVModel }
  return acc
}, {}))
export const renderer = {
  get(name) {
    return renderMap[name] || null
  }
}
