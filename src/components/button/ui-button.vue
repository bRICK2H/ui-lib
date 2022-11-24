<template>
  <button
    class="ui-button"
    :class="classStyleType"
    :disabled="disabled"
    v-bind="$attrs"
    v-on="listeners"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'UiButton',
  inheritAttrs: true,
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    styleType: {
      type: String,
      default: 'primary',
    },
  },
  data: () => ({
    styleTypes: ['primary', 'success', 'danger'],
  }),
  computed: {
    listeners() {
      return { ...this.$listeners }
    },
    classStyleType() {
      return this.styleTypes.includes(this.styleType)
        ? `ui-button--${this.styleType}`
        : 'ui-button--primary'
    },
  },
}
</script>

<style lang="scss">
@import 'button';
</style>
