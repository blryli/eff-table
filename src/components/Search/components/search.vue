<template>
  <span
    ref="search"
    class="table-header-search"
    :class="{'is-operator': column.operator}"
    @click="handleClick"
  >
    <!-- 时间 -->
    <VSlot v-if="column.render" ref="render" :render="column.render" :column="column" class="render" @change="slotChange" />
    <div v-else-if="column.date" class="date">
      <el-date-picker
        v-show="data.type === 'range'"
        v-model="data.value"
        value-format="yyyy/MM/dd"
        type="daterange"
        placeholder=""
        :popper-class="'popover-is-hidden'"
        size="small"
        @change="handleChange"
      />
      <el-date-picker
        v-if="data.type !== 'range'"
        v-model="data.value"
        value-format="yyyy/MM/dd"
        type="date"
        placeholder=""
        size="small"
        @change="handleChange"
      />
    </div>
    <div v-else-if="column.prop === null" />
    <!-- 普通搜索 -->
    <input v-else :value="data.value" size="small" style="display: flex;padding: 0;height:28px" @input="handleInput">

    <!-- ----------- 范围 ---------- -->
    <el-dropdown v-if="column.operator" class="search-dropdown" placement="bottom" :show-timeout="100">
      <span class="el-dropdown-link">
        <icon :icon="data.type" :operator="operator" />
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(d, i) in operator" :key="i" :class="{'is-active': data.type === d.type && d.type !== 'like'}" @click.native="typeChange(d.type)">
          <div class="dropdown-icon">{{ d.label }}</div>
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </span>
</template>

<script>
import Icon from './Icon.vue'
import { debounce } from '@/utils/dom'

export default {
  name: 'Search',
  components: {
    Icon,
    VSlot: {
      props: {
        render: { type: Function, required: true },
        column: { type: Object, default: () => {} }
      },
      data() {
        return {
          value: ''
        }
      },
      methods: {
        input(val) {
          this.value = val
        },
        change(val) {
          this.$emit('change', val)
        }
      },
      render(h) {
        const { column, value, input, change } = this
        return this.render(h, { column, value, input, change })
      }
    }
  },
  props: {
    value: { type: Object, default: () => {} },
    column: { type: Object, default: () => {} } // column是列的数据，跟列对应
  },
  data() {
    return {
      data: { prop: this.column.prop, type: this.column.operatorDefault || 'like', value: '' },
      operator: [
        {
          type: 'equals',
          label: '等于',
          icon: '='
        },
        {
          type: 'unequals',
          label: '不等于',
          icon: '='
        },
        {
          type: 'less',
          label: '小于',
          icon: '<'
        },
        {
          type: 'greater',
          label: '大于',
          icon: '>'
        },
        {
          type: 'lessthan',
          label: '小于等于',
          icon: '<'
        },
        {
          type: 'greaterthan',
          label: '大于等于',
          icon: '>'
        },
        {
          type: 'range',
          label: '之间',
          icon: '~'
        },
        {
          type: 'like',
          label: '重置'
        }
      ]
    }
  },
  inject: ['tableSearch'],
  watch: {
    value(val) {
      this.$nextTick(() => {
        this.data = val || {}
      })
    }
  },
  created() {
    this.tableSearch.$refs.tableRange.$on('range.change', debounce(this.rangeChange))
    this.debounceChange = debounce(() => {
      this.change()
    })
  },
  methods: {
    handleClick(e) {
      e.stopPropagation()
      this.data.type === 'range' && this.emitIconChange()
    },
    emitIconChange() {
      this.tableSearch.$emit('search.icon.change', { label: this.column.label, show: this.data.type === 'range' && !this.column.date, rangeRect: this.$el.getBoundingClientRect() })
    },
    handleInput(val) {
      this.data.value = this.column.operator && typeof val === 'string' ? val.replace(/[a-zA-Z]/g, '') : val
      this.debounceChange()
    },
    handleChange() {
      this.debounceChange()
    },
    typeChange(type) {
      if (type === 'like') {
        this.data.value = ''
        this.rangeReset()
      } else if (this.data.type === 'range') {
        this.data.value = ''
      } else if (type === 'range') {
        this.data.value = this.column.date ? [] : ''
        this.rangeReset()
      }
      this.data.type = type === 'like' ? this.column.operatorDefault || type : type
      this.debounceChange()
      this.emitIconChange()
    },
    rangeReset() {
      this.tableSearch.$refs.tableRange.reset()
    },
    rangeChange(val) {
      const { label, value } = val
      if (this.column.label !== label) return
      this.data.value = value.length === 2 ? value.join('-') : ''
      this.debounceChange()
    },
    slotChange(val) {
      this.data.value = val
      this.debounceChange()
    },
    change() {
      let content
      const { value, type } = this.data
      const { date } = this.column
      if (type === 'range') {
        if (value) {
          if (date) {
            const arr = value.map(d => new Date(d).getTime())
            content = arr.length ? arr : ''
          } else {
            const val = value && value.split('-') || value
            if (val && val.length > 1) {
              content = val
            } else {
              return
            }
          }
        }
      } else {
        content = this.column.date ? new Date(value).getTime() : value
      }
      this.$emit('input', this.data)
      this.tableSearch.$emit('search.change', { field: this.column.prop, operator: type.toUpperCase(), content, type: this.column.date || null })
    }
  }
}
</script>

<style lang="scss">
.table-header-search{
  display: flex;
  height: 28px;
  background-color: #fff;
}
.is-active{
  .dropdown-icon{
    color: #1177e8;
  }
}
</style>
