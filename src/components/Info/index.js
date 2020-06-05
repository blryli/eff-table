import Vue from 'vue'
import Main from './main.vue'
const NoticeConstructor = Vue.extend(Main)

let seed = 1

const Info = (options) => {
  const id = 'info_' + seed++
  options = options || {}
  if (typeof options === 'string') {
    options = {
      message: options
    }
  }

  const instance = new NoticeConstructor({
    data: options
  })
  instance.id = id
  instance.vm = instance.$mount()
  document.body.appendChild(instance.vm.$el)
  instance.vm.seed = seed
  instance.vm.visible = true
  return instance.vm
}

export default Info
