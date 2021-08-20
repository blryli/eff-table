<script>
import CopyList from './CopyList'
export default {
  name: 'Copy',
  components: { CopyList },
  data() {
    return {
      textArr: []
    }
  },
  computed: {

  },
  inject: ['table'],
  mounted() {
    this.offListener()
    this.onListener()
  },
  destroyed() {
    this.offListener()
  },
  methods: {
    onCopy(e) {
      let textArr
      if (this.table.isCopyFunc) {
        this.table.isCopyFunc = false

        const tmpArr = []
        this.table.selecteds.forEach(rowIndex => {
          const data = this.table.tableData[rowIndex]
          const arr = []
          this.table.columns.forEach(column => {
            column.prop && data[column.prop] && arr.push(data[column.prop])
          })

          tmpArr.push(arr)
        })
        textArr = tmpArr
      } else {
        textArr = this.textArr
      }
      if (!textArr.length) {
        return true
      }
      textArr = textArr.map(v => {
        return v.join('\t ')
      })

      const text = textArr.join('\r\n')

      e.clipboardData.setData('text/plain', text)
      this.table.$emit('copy')
      e.preventDefault()
    },
    onListener() {
      this.table.$on('select-range-data', (textArr) => {
        this.textArr = textArr
      })
      document.addEventListener('copy', this.onCopy, false)
    },
    offListener() {
      this.table.$off('select-range-data')
      document.removeEventListener('copy', this.onCopy, false)
    }
  },
  render() {
    const { table } = this
    const { tableData, tableColumns, selectRengeStore } = table
    return <CopyList contextual={{ table, tableData, tableColumns, selectRengeStore, vue: this }} />
  }
}

</script>

<style lang="scss">
.eff-table--copy{
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}
</style>
