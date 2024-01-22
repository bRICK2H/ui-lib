import Vue from 'vue'

export default new Vue({
  data: () => ({
    value: 20,
  }),

  computed: {
    newValue() {
      return this.value
    },
  },

  watch: {
    value() {
      console.log(this.value)
    },
  },

  methods: {
    count() {
      this.value++
    },
  },
})
