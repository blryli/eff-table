const map = {
  // element
  'input': 'el-input',
  'textarea': 'el-textarea',
  'select': 'el-select',
  'option': 'el-option',
  'date-picker': 'el-date-picker',
  'button': 'el-button',
  'link': 'el-link',
  'tag': 'el-tag',
  'image': 'el-image',
  'popover': 'el-popover',
  'tooltip': 'el-tooltip',
  'dialog': 'el-dialog',
  'form': 'el-form',
  'form-item': 'el-form-item',
  'switch': 'el-switch',
  'checkbox-group': 'el-checkbox-group',
  'checkbox': 'el-checkbox',
  'pagination': 'el-pagination',

  // 内置组件
  'popup': 'popup',
  'layout': 'layout',
  'panel': 'panel'
}

export default {
  get(name) {
    const mapName = map[name]
    if (!mapName) console.warn(`[${name}] 该组件没有在映射表注册`)
    return mapName || name
  }
}
