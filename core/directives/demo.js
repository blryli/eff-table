
/**
 * 指令定义
 */
const directive = {
  name: 'directName',

  // 1.指令绑定到元素上回立刻执行bind函数，只执行一次
  // 2.每个函数中第一个参数永远是el，表示绑定指令的元素，el参数是原生js对象
  // 3.通过el.focus()是无法获取焦点的，因为只有插入DOM后才生效
  bind: function(el, bind) {

  },
  // inserted表示一个元素，插入到DOM中会执行inserted函数，只触发一次
  inserted: function(el, bind) {

  }

}
export default directive
