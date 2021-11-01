<template>
  <div id="app">
    <div class="header">
      <h2>{{ config.name }}</h2>
      <div class="command">npm install --save {{ config.name }}</div>
      <div class="nav">
        <a :href="`https://github.com/${config.author}/${config.name}#usage`">文档</a>
      </div>
    </div>

    <div class="body">
      <div class="menu">
        <router-link class="menu-list" to="/Start">Start</router-link>
        <h3 class="menu-title">组件</h3>
        <router-link class="menu-list" to="/Panel">Panel 面板</router-link>
        <router-link class="menu-list" to="/Transfer">Transfer 穿梭框</router-link>
        <router-link class="menu-list" to="/SeniorQueryDemo">SeniorQuery 高级搜索</router-link>
        <h3 class="menu-title">表格</h3>
        <router-link class="menu-list" to="/">Base 基础表格</router-link>
        <router-link class="menu-list" to="/Drag">Drag 拖动</router-link>
        <router-link class="menu-list" to="/Edit">Edit 编辑</router-link>
        <router-link class="menu-list" to="/Search">Search 搜索</router-link>
        <router-link class="menu-list" to="/Validate">Validate 校验</router-link>
        <router-link class="menu-list" to="/Virtual">Virtual 虚拟滚动</router-link>
        <router-link class="menu-list" to="/Copy">Copy 复制</router-link>
        <router-link class="menu-list" to="/SeniorQuery">SeniorQuery 高级搜索</router-link>
        <router-link class="menu-list" to="/Replace">Replace 批量替换</router-link>
        <router-link class="menu-list" to="/Sort">Sort 排序</router-link>
        <router-link class="menu-list" to="/Subtotal">Subtotal 小计</router-link>
        <router-link class="menu-list" to="/Expand">Expand 展开行</router-link>
        <router-link class="menu-list" to="/Tree">Tree 树</router-link>
        <router-link class="menu-list" to="/SpanMethod">SpanMethod 合并行或列</router-link>
        <router-link class="menu-list" to="/FooterAction">FooterAction 底部扩展</router-link>
        <router-link class="menu-list" to="/History">History 记录</router-link>
        <router-link class="menu-list" to="/Full">Full 完整功能</router-link>
        <h3 class="menu-title">表单</h3>
        <router-link class="menu-list" to="/FormBase">FormBase 基础使用</router-link>
        <router-link class="menu-list" to="/FormValidate">FormValidate 表单校验</router-link>
        <router-link class="menu-list" to="/Form">Form 高级表单</router-link>
        <router-link class="menu-list" to="/FormEdit">FormEdit 快捷编辑</router-link>
        <h3 class="menu-title">API</h3>
        <router-link class="menu-list" to="/TableApi">Table 表格</router-link>
        <router-link class="menu-list" to="/FormApi">form 表单</router-link>
        <router-link class="menu-list" to="/TransferApi">Transfer 穿梭框</router-link>
      </div>
      <div class="container">
        <router-view />
        <!-- <keep-alive>
        </keep-alive> -->
      </div>
    </div>

  </div>
</template>

<script>
import { routes } from './router'
import { config } from './config'

export default {
  data() {
    return {
      routes: routes.filter(route => route.name),
      config
    }
  },
  created() {
    document.title = config.name + '-demo'
  }
}
</script>

<style lang="scss">
body {
  background: white;
  margin: 0;
  font-size: 14px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.header {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 60px;
  background: $primary-color;
  padding: 0 20px;
  box-sizing: border-box;
  z-index: 10;

  h2 {
    margin: 0;
    color: white;
    font-weight: normal;
    text-align: center;
  }

  .nav {
    color: white;
    box-sizing: border-box;
    a {
      color: #fff;
      text-decoration: none;
      cursor: pointer;

      &:hover {
        opacity: .8;
      }
    }
  }
}

.body{
  position: relative;
  margin-top: 60px;
}
.menu{
  position: fixed;
  left: 0;
  top: 60px;
  width: 200px;
  max-height: calc(100% - 60px);
  padding: 20px 0 20px 20px;
  overflow: auto;
  font-size: 14px;
  box-sizing: border-box;
  &-list{
    display: block;
    line-height: 36px;
  }
}
.container{
  width: 100vw;
  height: calc(100vh - 60px);
  padding-left: 150px;
  overflow: auto;
  box-sizing: border-box;
}

.page{
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  &-router{
    font-size: 14px;
    color: #40b883;
  }
}

.collapse {
  .section-content {
    padding: 12px 0 40px 0;
  }
}

h2 {
  font-weight: normal;
}
h3 {
  color: #666
}

a {
  color: #333;
  text-decoration: none;
  cursor: pointer;

  &:hover, &.router-link-exact-active {
    color: $primary-color;
  }
}

.primary{
  color: $primary-color;
}

.command {
  background: darken($primary-color, 10%);
  color: white;
  font-family: monospace;
  max-width: 500px;
  margin: 12px auto;
  border-radius: 2px;
  padding: 12px 24px;
  box-sizing: border-box;
}

.hint{
  margin-bottom: 20px;
  padding: 10px 15px;
  border-left: 4px solid $primary-color;
  line-height: 24px;
  background-color: $primary-bg-color;
}

.mr-10{
  margin-right: 10px;
}
.ml-10{
  margin-left: 10px;
}
.ml-20{
  margin-left: 20px;
}

code, kbd, pre, samp {
  font-size: 1em;
  font-family: SFMono-Regular,Consolas,Liberation Mono,Menlo,Courier,monospace;
}
code.hljs {
    padding: 3px 5px;
}
.hljs {
  display: block;
  overflow-x: auto;
  padding: .5em;
  color: #D4D4C9;
  line-height: 20px;
  background: #1E1E1E;
}
.hljs-deletion, .hljs-name, .hljs-section, .hljs-selector-tag, .hljs-subst {
  color: #569CD6;
}
.hljs-attr, .hljs-params, .hljs-selector-attr, .hljs-selector-class, .hljs-selector-pseudo, .hljs-template-variable, .hljs-type, .hljs-variable {
  color: #9CDCFE;
}
.hljs-addition, .hljs-attribute, .hljs-meta .hljs-string, .hljs-regexp, .hljs-string{
  color: #CE9178;
}
.hljs-doctag, .hljs-formula, .hljs-keyword{
  color: #C586C0;
}
.hljs-bullet, .hljs-link, .hljs-meta, .hljs-selector-id, .hljs-symbol, .hljs-title, .hljs-number{
  color: #DCDCAA;
}
.hljs-literal{
  color: #569CD6;
}
.hljs-comment, .hljs-quote {
    color: #6A9955;
    font-style: normal;
}
code + code {
  margin-top: 20px;
}

@media (max-width: 1200px) {
  .container{
    padding-left: 190px;
  }
}
</style>
