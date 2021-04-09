<template>

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
  inject: ["table"],
  methods: {
    onCopy(e) {
      if (!this.textArr.length) {
        return true
      }

      let textArr = this.textArr.map(v => {
        return v.join("\t ")
      })
      
      let text = textArr.join("\r\n")
      e.clipboardData.setData('text/plain', text);
      this.table.$emit('copy')
      e.preventDefault();
    },
    onPaste(e) {
      console.log(e.clipboardData.getData("text/plain"), 333)
    },
    onListener() {
      this.table.$on("select-range-data", (textArr) => {
        this.textArr = textArr
      })
      document.addEventListener('copy', this.onCopy, false)
      document.addEventListener('paste', this.onPaste, false)
    },
    offListener() {
      this.table.$off("select-range-data")
     document.removeEventListener("copy", this.onCopy, false)
     document.removeEventListener("paste", this.onPaste, false)
    }
  },
  mounted() {
    this.offListener()
    this.onListener()
  },
  destroyed() {
    this.offListener()
  }
}

    </script>