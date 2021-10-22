import VCheckbox from 'pk/checkbox'
import Tree from 'pk/tree'
import XEUtils from 'xe-utils'
import { on, off } from 'pk/utils/dom'

export default {
  name: 'EffTransferPanel',
  components: { VCheckbox, Tree },
  props: {
    value: { type: Array, default: () => ([]) },
    data: { type: Array, default: () => ([]) },
    ids: { type: Array, default: () => ([]) },
    defaultCheckedKeys: { type: Array, default: () => ([]) },
    title: { type: String, default: '列表' },
    props: { type: Object, default: () => ({}) },
    transferDataStore: { type: Object, default: () => ({}) }
  },
  data() {
    return {
      dataStore: {},
      selectionAll: false,
      indeterminate: false,
      bodyHeight: 0,
      startIndex: 0
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
    renderData() {
      const { data, props, ids } = this
      const { key, children } = props
      const getData = data => {
        return data.reduce((acc, cur) => {
          const id = cur[key]
          const childs = cur[children] || []
          if (ids.includes(id)) {
            if (childs.length) cur[children] = getData(childs)
            return acc.concat(cur)
          }
          return acc
        }, [])
      }
      return getData(XEUtils.clone(data, true))
    },
    renderNode() {
      const { renderData, props, transferDataStore, selecteds, isIndeterminate, rowSelectionChange, isDisabled, handleExpand } = this
      const { key, children } = props
      const h = this.$createElement
      const node = []
      const renderNode = (renderData, tier = -1) => {
        tier++
        return renderData.forEach(row => {
          const id = row[key]
          const childs = row[children] || []
          const store = transferDataStore[id]
          node.push(h('div', { key: id, class: 'eff-transfer-panel-node', style: { marginLeft: 18 * tier + 'px' }}, [
            h('icon', {
              props: { icon: store.expanded ? 'caret-bottom' : 'caret-right' },
              on: { click: () => handleExpand(store) }
            }),
            h('v-checkbox', {
              props: { value: selecteds.includes(id), label: row.label, disabled: isDisabled(row), indeterminate: isIndeterminate(id) },
              on: { change: selected => rowSelectionChange(row, selected) }
            })
          ]))
          store.expanded && childs.length ? renderNode(childs, tier) : ''
        })
      }
      renderNode(renderData)
      return node
    },
    isVirtual() {
      const { renderNode, bodyHeight } = this
      return (renderNode.length - 4) * 30 > bodyHeight
    },
    endIndex() {
      const { isVirtual, startIndex, renderNode, bodyHeight } = this
      return isVirtual ? Math.floor(bodyHeight / 30) + 2 + startIndex : renderNode.length
    },
    renderNodes() {
      const { renderNode, startIndex, endIndex } = this
      return renderNode.slice(startIndex, endIndex)
    }
  },
  watch: {
    selecteds(val, oldVal) {
      this.updateSelectionAll()
      const changeKeys = val.length > oldVal.length ? val.filter(d => oldVal.indexOf(d) === -1) : oldVal.filter(d => val.indexOf(d) === -1)
      // console.log(this.checkeds)
      this.$emit('input', this.checkeds)
      this.$emit('change', val, changeKeys)
    },
    renderData() {
      this.setDataStore()

      if (!this.loadData) {
        this.setDefaultCheck()
        this.loadData = true
      } else {
        this.clearSelection()
      }
    }
  },
  inject: ['transfer'],
  created() {
    Object.assign(this, {
      loadData: false
    })
    if (this.data.length) {
      this.loadData = true
      this.setDataStore()
      this.setDefaultCheck()
    }
    // console.log('this.dataStore', JSON.stringify(this.dataStore, null, 2))
  },
  mounted() {
    this.$nextTick(() => {
      const { transfer, $refs } = this
      const { header, body } = $refs
      this.body = body
      this.bodyHeight = transfer.panelHeight - header.clientHeight
      on(this.body, 'scroll', this.handleScroll)
    })
  },
  beforeDestroy() {
    off(this.body, 'scroll', this.handleScroll)
  },
  methods: {
    handleScroll(e) {
      const { scrollTop } = e.target
      if (scrollTop < 30) {
        this.startIndex = 0
      }
      this.startIndex = Math.floor(scrollTop / 30)
    },
    setDefaultCheck() {
      const { defaultCheckedKeys, dataStore } = this
      if (defaultCheckedKeys.length) {
        defaultCheckedKeys.forEach(id => {
          const store = dataStore[id]
          store && this.toggleSelection(store.row, null, true)
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
    updateSelectionAll() {
      const { selecteds, dataStore } = this
      const data = []
      for (const key in dataStore) {
        const row = dataStore[key]
        const { id } = row
        data.push(id)
      }
      const selectedsLength = selecteds.length
      const dataLength = data.length
      this.selectionAll = Boolean(selectedsLength && selectedsLength === dataLength)
      this.indeterminate = Boolean(selectedsLength && selectedsLength < dataLength)
    },
    setDataStore() {
      this.dataStore = {}
      const { props } = this
      const { key, children } = props
      const setStore = (renderData, parents = []) => {
        renderData.forEach(row => {
          const id = row[key]
          const childs = row[children]
          const siblings = parents.length ? renderData.reduce((acc, cur) => cur[key] === id ? acc : acc.concat(cur[key]), []) : []
          if (childs) setStore(childs, parents.concat(id))

          this.$set(this.dataStore, id, { id, row, parents, siblings, checked: false })
        })
      }
      setStore(this.renderData)
      for (const key in this.dataStore) {
        const row = this.dataStore[key]
        const childs = []
        for (const k in this.dataStore) {
          const r = this.dataStore[k]
          r.parents.includes(row.id) && childs.push(r.id)
        }
        row.childs = childs
      }
      return this.$nextTick()
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
      const { props, dataStore, setChecked } = this
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
            // console.log({ currentId, siblings, sibChecked, parentId })
            setChecked(parentId, checked && sibChecked.length === siblings.length)
          } else { // 只有一级时直接确定
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
    },
    handleExpand(store) {
      store.expanded = !store.expanded
    }
  },
  render(h) {
    const { renderNode, title, selectionAll, startIndex, renderNodes, indeterminate, dataStore, selecteds, $slots, allselectionChange } = this
    return h('div', { ref: 'panel', class: 'eff-transfer-panel' }, [
      h('div', { ref: 'header', class: 'eff-transfer-panel__header' }, [
        h('v-checkbox', { props: { value: selectionAll, label: title, indeterminate }, on: { change: allselectionChange }}),
        h('small', {}, selecteds.length + '/' + Object.keys(dataStore).length)
      ]),
      h('div', { ref: 'body', class: 'eff-transfer-panel__body' }, [
        h('div', { class: 'eff-transfer-panel__body--y-space', style: { height: renderNode.length * 30 + 'px' }}),
        h('div', { class: 'eff-transfer-panel__body-wrapper', style: { marginTop: startIndex * 30 + 'px' }}, renderNodes)
      ]),
      $slots.default ? h('div', { class: 'eff-transfer-panel__footer' }, $slots.default) : ''
    ])
  }
}
