<script>
export default {
  name: 'UiBinder',
  data: () => ({
    id: null,
    handler: () => ({}),
  }),
  methods: {
    wait(id = null) {
      console.log('wait', id)
      if (this.isNull(this.id)) {
        // return Promise.reject(
        //   `[ui-binder][Error]: Function "wait" rejected, id = ${this.id}, specify target id`
        // )
      }

      this.id = id

      return new Promise((resolve) => (this.handler = resolve))
    },
    resolve(id = null) {
      console.log('resolve', id)
      // if (this.isNull(id)) {
      //   console.error(
      //     `[ui-binder][Error]: Function "wait" rejected, id = ${this.id}, specify target id`
      //   )

      //   return
      // }

      // if (id !== this.id) {
      //   console.error(
      //     `[ui-binder][Error]: Target id do not match, bind identifiers.`
      //   )

      //   return
      // }

      this.handler()
    },
    isNull(value) {
      return value === null
    },
  },
}
</script>
