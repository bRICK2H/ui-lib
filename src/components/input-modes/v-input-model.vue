<template>
  <input
    ref="v-input-model"
    v-model="model"
    :type="type"
    :name="name"
    :value="value"
    :disabled="disabled"
    v-on="listeners"
  />
</template>

<script>
export default {
  name: 'VInputModel',

  props: {
    value: {
      type: [String, Number, Object],
      default: '',
    },

    modelValue: {
      type: [String, Number, Object, Array, Boolean],
      required: true,
    },

    type: {
      type: String,
      default: '',
    },

    name: {
      type: String,
      default: '',
    },

    disabled: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    listeners() {
      return this.$listeners
    },

    model: {
      get() {
        return this.modelValue
      },

      set(value) {
        this.$emit('input-value', value)
      },
    },
  },

  watch: {
    model: {
      immediate: true,
      async handler() {
        await this.$nextTick()

        this.setValue()
      },
    },
  },

  methods: {
    setValue() {
      const input = this.$refs['v-input-model']
      this.$emit('set-value', input?.checked ?? false)
    },
  },
}
</script>
