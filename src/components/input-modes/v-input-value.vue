<template>
  <input
    ref="v-input-value"
    :type="type"
    :name="name"
    :value="value"
    :checked="checked"
    :disabled="disabled"
    v-on="listeners"
  />
</template>

<script>
export default {
  name: 'VInputValue',

  props: {
    value: {
      type: [String, Number, Boolean, Object],
      required: true,
    },

    name: {
      type: String,
      default: '',
    },

    type: {
      type: String,
      default: '',
    },

    checked: {
      type: Boolean,
      default: false,
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
  },

  updated() {
    this.setValue()
  },

  mounted() {
    this.setValue()
    this.initRadioHandlers()
  },

  methods: {
    setValue() {
      const input = this.$refs['v-input-value']
      this.$emit('set-value', input?.checked ?? false)
    },

    async initRadioHandlers() {
      if (this.type === 'checkbox') {
        return
      }

      await this.$nextTick()

      const inputGroup = document.querySelectorAll(`input[name="${this.name}"]`)
      inputGroup.forEach((el) => el.addEventListener('change', this.setValue))
    },
  },
}
</script>
