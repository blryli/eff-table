<script>
import VCheckbox from 'pk/checkbox'
import Tree from 'pk/tree'
import XEUtils from 'xe-utils'

export default {
  name: 'EffTransferPanel',
  components: { VCheckbox, Tree },
  props: {
    value: { type: Array, default: () => ([]) },
    data: { type: Array, default: () => ([]) },
    defaultCheck: { type: Array, default: () => ([]) },
    title: { type: String, default: '列表' },
    props: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      dataStore: {},
      selectionAll: false,
      indeterminate: false
    }
  },
  computed: {
    selecteds() {
      return Object.values(this.dataStore).reduce((acc, cur) => cur.checked ? acc.concat(cur.id) : acc, [])
    },
    checkeds() {
      const { dataStore, selecteds } = this
      return selecteds.map(id => {
        const mapId = dataStore[id]
        if (!mapId) {
          console.warn(id + ' 不存在于tableData')
        }
        return mapId
      }).filter(d => d)
    },
    transferData() {
      const { data, props } = this
      return data.reduce((acc, cur) => cur[props.disabled] ? acc : acc.concat([cur]), [])
    }
  },
  watch: {
    selecteds(val, oldVal) {
      this.updateSelecteds()
      const changeKeys = val.length > oldVal.length ? val.filter(d => oldVal.indexOf(d) === -1) : oldVal.filter(d => val.indexOf(d) === -1)
      this.$emit('input', this.checkeds)
      this.$emit('change', val, changeKeys)
    },
    data() {
      this.setDataStore()
    }
  },
  created() {
    Object.assign(this, {

    })
    this.setDataStore()
    // console.log('this.dataStore', JSON.stringify(this.dataStore, null, 2))
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    init() {
      const { defaultCheck } = this
      if (defaultCheck.length) {
        defaultCheck.forEach(id => {
          this.setChecked(id, true)
        })
      }
    },
    setChecked(id, checked) {
      this.dataStore[id] && this.$set(this.dataStore[id], 'checked', checked)
    },
    isChecked(id) {
      return !!this.dataStore[id]
    },
    setAllChecked(checked) {
      const { dataStore } = this
      for (const key in dataStore) {
        const row = dataStore[key]
        row.checked = checked
      }
    },
    getAllChecked() {
      const { dataStore } = this
      const checkeds = []
      for (const key in dataStore) {
        const row = dataStore[key]
        const { id, checked } = row
        checked && checkeds.push(id)
      }
      return checkeds
    },
    clearSelection() {
      this.setAllChecked(false)
    },
    updateSelecteds() {
      const { selecteds, transferData } = this
      const selectedsLength = selecteds.length
      const dataLength = transferData.length
      this.selectionAll = Boolean(selectedsLength) && selectedsLength === dataLength
      this.indeterminate = Boolean(selectedsLength && selectedsLength < dataLength)
    },
    setDataStore() {
      this.dataStore = {}
      const { key, children } = this.props
      const setStore = (data, parents = [], childrens = []) => {
        data.forEach(row => {
          const id = row[key]
          const childs = row[children]
          const siblings = parents.length ? data.reduce((acc, cur) => cur[key] === id ? acc : acc.concat(cur[key]), []) : []
          if (childs) setStore(childs, parents.concat(id))
          this.$set(this.dataStore, id, { id, row, parents, siblings, checked: false })
        })
      }
      setStore(this.data)
      for (const key in this.dataStore) {
        const row = this.dataStore[key]
        const childs = []
        for (const k in this.dataStore) {
          const r = this.dataStore[k]
          r.parents.includes(row.id) && childs.push(r.id)
        }
        row.childs = childs
      }
    },
    toggleRowSelection(row, selected) {
      const { dataStore, props, toggleSelection, isChecked } = this
      const id = row[props.key]
      if (dataStore[id]) {
        toggleSelection(row, isChecked[id], selected)
      } else {
        console.error('methods toggleRowSelection (row) is not find')
      }
    },
    toggleAllSelection() {
      this.selectionAll = !this.selectionAll
      this.allselectionChange(this.selectionAll)
    },
    rowSelectionChange(row, selected) {
      const { checkeds, dataStore, props, toggleSelection } = this
      const id = row[props.key]
      toggleSelection(row, !selected)
      this.$emit('select', checkeds, dataStore[id])
    },
    allselectionChange(selected) {
      this.selectionAll = selected
      this.indeterminate = false
      this.setAllChecked(selected)
      this.$emit('select-all', this.checkeds)
    },
    toggleSelection(row, has, selected) {
      const { setChecked, props, dataStore } = this
      const { key } = props
      const id = row[key]

      // 处理当前节点
      const isCheck = Boolean(selected || !has)
      setChecked(id, isCheck)

      // 处理子节点
      for (const key in dataStore) {
        const { id: childid, parents = [] } = dataStore[key] || {}
        // console.log({ childid, id, parents })
        if (parents.includes(id)) {
          setChecked(childid, isCheck)
        }
      }

      // 处理父级
      const { parents } = dataStore[id]
      if (parents.length) {
        let currentId = id
        parents.reverse().forEach(parentId => {
          // 用当前层级的同级确定上级的勾选状态
          const { checked, siblings } = dataStore[currentId]
          if (siblings.length) {
            const sibChecked = siblings.filter(sibid => dataStore[sibid].checked)
            setChecked(parentId, sibChecked.length === siblings.length)
          } else { // 只有一直直接确定
            setChecked(parentId, checked)
          }
          currentId = parentId
        })
      }
    },
    setCurrentRow(row) {
      const { dataStore } = this
      const id = row[this.props.key]
      this.setAllChecked(false)
      if (dataStore[id]) {
        this.setChecked(id, true)
      }
    },
    isDisabled(row) {
      const disabled = row[this.props.disabled]
      return XEUtils.isFunction(disabled) ? disabled({ row }) : Boolean(disabled)
    },
    isIndeterminate(id) {
      const { childs } = this.dataStore[id]
      if (!childs.length) return false
      const hasChecked = childs.find(c => this.selecteds.includes(c))
      const indeterminate = !!(hasChecked && childs.find(c => !this.selecteds.includes(c)))
      if (indeterminate) this.setChecked(id, false)
      return indeterminate
    }
  },
  render(h) {
    const { data, props, title, indeterminate, selecteds, $slots, isIndeterminate, rowSelectionChange, allselectionChange, isDisabled } = this
    const { key, children } = props
    const open = false
    const renderNode = (data, tier = -1) => {
      tier++
      return data.map(row => {
        const id = row[key]
        const childs = row[children] || []
        return [
          h('div', { class: 'eff-transfer-panel-node', style: { marginLeft: 12 * tier + 'px' }}, [
            h('icon', { props: { icon: open ? 'caret-bottom' : 'caret-right' }}),
            h('v-checkbox', {
              props: { value: selecteds.includes(id), label: row.label, disabled: isDisabled(row), indeterminate: isIndeterminate(id) },
              on: { change: selected => rowSelectionChange(row, selected) }
            })
          ]),
          childs.length ? renderNode(childs, tier) : ''
        ]
      })
    }
    return h('div', { class: 'eff-transfer-panel' }, [
      h('div', { class: 'eff-transfer-panel__header' }, [
        h('v-checkbox', { props: { label: title, indeterminate }, on: { change: allselectionChange }}),
        h('small', {}, selecteds.length + '/' + data.length)
      ]),
      h('div', { class: 'eff-transfer-panel__body' }, [renderNode(data)]),
      $slots.default ? h('div', { class: 'eff-transfer-panel__footer' }) : $slots.default,
      [selecteds.map(d => d + '，')]
    ])
  }
}
</script>
