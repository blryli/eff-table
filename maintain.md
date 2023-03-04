## packages目录

- 放公共组件

## table目录

- components 放独立组件，如果有table以外的组件共同用到的组件，应该提取到公共组件目录

- mixins 放独立的功能：expand、sort、tree、validate、virtual等，后续有类似的独立功能也应该放在混入目录，避免增加组件的复杂度

- src 放table核心结构相关的组件，其他组件不应该往这里放

## render目录

- index.js 把配置对象转换成VNode，一般不需要修改

- map.js 配置对象中使用组件的映射，默认对应到element组件库和内置组件，要支持其他组件时要先在这里做好映射，然后在utils>render.js文件下配置renderer的三种渲染模式： 基本模式、编辑模式、搜索模式

- render.js 直接支持配置对象的组件

## table组件维护注意点

- 维护checkbox勾选、校验等功能时应该考虑到对表格树结构的支持

- 样式维护，主要在styles目录，scss文件的修改不会实时响应，可以在该目录下的index.vue文件做修改，改完之后再放到对应的scss文件

