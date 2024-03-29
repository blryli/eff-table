const map = {
  // element
  'input': 'el-input',
  'input-number': 'el-input-number',
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
  'dropdown': 'el-dropdown',
  'dialog': 'el-dialog',
  'switch': 'el-switch',
  'checkbox': 'el-checkbox',
  'checkbox-group': 'el-checkbox-group',
  'pagination': 'el-pagination',
  'radio': 'el-radio',
  'radio-group': 'el-radio-group',
  'cascader': 'el-cascader',

  // 内置组件
  'popup': 'popup',
  'help': 'help',
  'layout': 'layout',
  'panel': 'panel',
  'form': 'v-form',
  'form-item': 'v-form-item',
  'ciphertext': 'ciphertext' // 加密组件
}

export default {
  get(name) {
    const mapName = map[name]
    if (!mapName) console.warn(`[${name}] 该组件没有在映射表注册`)
    return mapName || name
  }
}
