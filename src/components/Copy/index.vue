<template>
  <div />
</template>

<script>

export default {
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
      if (!this.textArr.length) {
        return true
      }

      const textArr = this.textArr.map(v => {
        return v.join('\t ')
      })

      const text = textArr.join('\r\n')

      console.log(e, 1111)
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
  }
}

</script>
