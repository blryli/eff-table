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
  'switch': 'el-switch',
  'checkbox': 'el-checkbox',
  'checkbox-group': 'el-checkbox-group',
  'pagination': 'el-pagination',
  'radio': 'el-radio',
  'radio-group': 'el-radio-group',

  // 内置组件
  'popup': 'popup',
  'layout': 'layout',
  'panel': 'panel',
  'form': 'v-form',
  'form-item': 'v-form-item'
}

export default {
  get(name) {
    const mapName = map[name]
    if (!mapName) console.warn(`[${name}] 该组件没有在映射表注册`)
    return mapName || name
  }
}
