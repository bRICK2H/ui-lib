<template>
  <span
    :title="title"
    class="ui-icon-container"
    v-on="listeners"
  >
    <svg
      :width="iconWidth"
      :height="iconHeight"
    >
      <use
        :style="{ color }"
        :href="`${require(`@/assets/icons/${iconName}.svg`)}#${name}`"
      ></use>
    </svg>
  </span>
</template>

<script>
export default {
  name: 'UiIcon',
  props: {
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: '',
    },
    width: {
      type: [String, Number],
      default: 16,
    },
    height: {
      type: [String, Number],
      default: 16,
    },
    size: {
      type: [String, Number],
      default: 0,
    },
    title: {
      type: String,
      default: '',
    },
  },
  computed: {
    listeners() {
      return this.$listeners
    },

    iconName() {
      return this.size ? `${this.name}--${this.size}` : this.name
    },

    iconWidth() {
      return this.size ? this.size : this.width
    },

    iconHeight() {
      return this.size ? this.size : this.height
    },
  },
}
</script>

<style lang="scss">
.ui-icon-container {
  display: flex;
}
</style>
