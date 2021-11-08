<template>
  <div class="page-home page">
    <h2>Copy 复制粘贴</h2>
    <p class="hint">
      <span class="primary">copy</span> 属性设置为
      <span class="primary"> true </span><br>
      <span class="primary">复制粘贴</span>：选中单元格或区域后，通过<span class="primary"> ctrl+c </span>或右下角图标复制，<span class="primary"> ctrl+v </span>粘贴。粘贴行超出表格行时会自动新增行<br>
      <span class="primary">整列复制</span>：按住<span class="primary"> ctrl </span>键，点击表头可以选中整列，进行复制<br>
      <span class="primary">批量复制</span>：选择一个单元格后，单元格的右下角有一个<span class="primary">十字标</span>，拖动即可把这个单元格的数据，复制到拖动覆盖的区域
    </p>
    <section class="demo">
      <div class="section-content">
        <eff-table
          v-bind="tableOptions"
        />
      </div>
    </section>

    <section class="snippets">
      <Collapse>
        <div class="section-content">
          <CodeSnippet class="html" :code="htmlCode" />
          <CodeSnippet class="javascript" :code="jsCode" />
        </div>
      </Collapse>
    </section>
  </div>
</template>

<script>
import CodeSnippet from '../components/CodeSnippet.vue'
import Collapse from '../components/Collapse.vue'

const htmlCode = `
  <eff-table v-model="columns" :data="data" copy /> 
  `

const jsCode = `
  export default {
    data() {
      return {
        data: [],
        columns: [
          {
            show: true,
            prop: 'name',
            title: '名字'
          },
          {
            show: true,
            prop: 'sex',
            title: '性别'
          },
          {
            show: true,
            prop: 'date',
            title: '日期',
            config: { name: 'date-picker' },
            edit: true
          },
          {
            show: true,
            prop: 'phone',
            title: '手机'
          }
        ]
      }
    }
  }
  `
export default {
  name: 'Copy',
  components: {
    CodeSnippet,
    Collapse
  },

  data() {
    return {
      htmlCode,
      jsCode,
      tableOptions: {
        maxHeight: 400,
        border: true,
        copy: true,
        edit: true,
        columns: [
          {
            show: true,
            prop: 'name',
            title: '名字',
            edit: true
          },
          {
            show: true,
            prop: 'sex',
            title: '性别(下拉框)',
            config: { name: 'select', options: [{ label: '男', value: '1' }, { label: '女', value: '2' }] },
            edit: true
          },
          {
            show: true,
            prop: 'date',
            title: '日期',
            config: { name: 'date-picker', props: { format: 'yyyy-MM-dd', valueFormat: 'yyyy-MM-dd' }},
            edit: true
          },
          // {
          //   show: true,
          //   prop: 'switch',
          //   title: '开关',
          //   width: 150,
          //   config: { name: 'switch' }
          //   // edit: true
          // },
          {
            show: true,
            prop: 'phone',
            title: '手机',
            edit: true
          },
          {
            show: true,
            prop: 'hobby',
            title: '爱好(多选框)',
            config: { name: 'select', props: { mutiple: true }, options: [{ label: '游泳', value: '1' }, { label: 'K歌', value: '2' }] },
            edit: true
          },
          {
            show: true,
            prop: 'address',
            title: '住址(级联选择器)',
            width: 200,
            config: { name: 'cascader',
              props: {
                'show-all-levels': false,
                props: {
                  label: 'label',
                  value: 'value',
                  children: 'children'
                }
              },
              options: () => [
                {
                  value: 'gd',
                  label: '广东省',
                  children: [{
                    value: 'szs',
                    label: '深圳市',
                    children: [{
                      value: 'baoan',
                      label: '宝安区'
                    }, {
                      value: 'nanshan',
                      label: '南山区'
                    }, {
                      value: 'longhua',
                      label: '龙华区'
                    }, {
                      value: 'futian',
                      label: '福田区'
                    }]
                  }]
                },
                {
                  value: 'hn',
                  label: '湖南省',
                  children: [{
                    value: 'cz',
                    label: '郴州市'
                    // children: [{
                    //   value: 'baoan',
                    //   label: '宝安区'
                    // }, {
                    //   value: 'nanshan',
                    //   label: '南山区'
                    // }, {
                    //   value: 'longhua',
                    //   label: '龙华区'
                    // }, {
                    //   value: 'futian',
                    //   label: '福田区'
                    // }]
                  }]
                }
              ]
            },
            edit: true
          }
        ],
        data: [
          { name: '张三', sex: '1', date: '2021-09-17', phone: '13715201314', hobby: ['1', '2'], address: ['gd', 'szs', 'baoan'] },
          { name: '李四', sex: '2', date: '2021-09-20', phone: '13715201314', hobby: ['1', '2'], address: '' },
          { name: '张三', sex: '1', date: '2021-09-22', phone: '13715201314', hobby: [], address: ['gd', 'szs', 'longhua'] },
          { name: '李四', sex: '1', date: '', phone: '13715201314', hobby: ['1', '2'], address: '' },
          { name: '张三', sex: '1', date: '2021-09-20', phone: '13715201314', hobby: ['1'], address: '' },
          { name: '李四', sex: '2', date: '2021-09-20', phone: '13715201314', hobby: ['1', '2'], address: '' },
          { name: '张三', sex: '2', date: '', phone: '13715201314', hobby: ['1', '2'], address: '' },
          { name: '李四', sex: '2', date: '2021-09-20', phone: '13715201314', hobby: ['1'], address: '' },
          { name: '张三', sex: '1', date: '2021-08-12', phone: '13715201314', hobby: ['1', '2'], address: '' },
          { name: '李四', sex: '1', date: '2021-09-20', phone: '13715201314', hobby: ['1', '2'], address: '' },
          { name: '张三', sex: '1', date: '2021-09-20', phone: '13715201314', hobby: ['1', '2'], address: '' },
          { name: '李四', sex: '2', date: '2021-09-20', phone: '13715201314', hobby: ['2'], address: '' },
          { name: '张三', sex: '2', date: '2021-09-20', phone: '13715201314', hobby: ['1', '2'], address: '' },
          { name: '李四', sex: '2', date: '2021-09-20', phone: '13715201314', hobby: ['2'], address: '' },
          { name: '张三', sex: '1', date: '2021-09-20', phone: '13715201314', hobby: ['1', '2'], address: '' },
          { name: '李四', sex: '1', date: '2021-09-20', phone: '13715201314', hobby: ['1', '2'], address: '' },
          { name: '张三', sex: '1', date: '2021-09-20', phone: '13715201314', hobby: ['1', '2'], address: '' },
          { name: '李四', sex: '2', date: '2021-09-20', phone: '13715201314', hobby: ['1', '2'], address: '' },
          { name: '张三', sex: '2', date: '2021-09-20', phone: '13715201314', hobby: ['1', '2'], address: '' },
          { name: '李四', sex: '2', date: '2021-09-20', phone: '13715201314', hobby: ['1', '2'], address: '' },
          { name: '张三', sex: '1', date: '2021-09-20', phone: '13715201314', hobby: ['1', '2'], address: '' },
          { name: '李四', sex: '1', date: '2021-09-20', phone: '13715201314', hobby: ['1', '2'], address: '' },
          { name: '张三', sex: '2', date: '2021-09-20', phone: '13715201314', hobby: ['1', '2'], address: '' },
          { name: '李四', sex: '2', date: '2021-09-20', phone: '13715201314', hobby: ['1', '2'], address: '' }
        ]
      }
    }
  }
}
</script>

<style lang="scss">
.eff-table .cell .el-radio__label{
  display: none;
}
.table-toobar__left{
  button{
    padding: 5px 10px;
    border: 1px solid #ddd;
    background-color: #fff;
    cursor: pointer;
    &:hover, &:focus{
      border-color: #ccc;
      background-color: #f5f5f5;
    }
    &:active{
      border-color: #aaa;
      background-color: #f5f5f5;
    }
  }
}
</style>
