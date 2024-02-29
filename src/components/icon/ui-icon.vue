<template>
  <span
    :title="title"
    :style="{ '--color': currentColor }"
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
import style from '@/assets/styles/globally/_export.modules.scss'

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

    currentColor() {
      if (this.color !== '') {
        return this.color
      }

      return this.$parent.$options._componentTag === 'ui-button'
        ? 'inherit'
        : style.colorBlackLightest
    },
  },
}
</script>

<style lang="scss">
$color: var(--color);

.ui-icon-container {
  display: flex;

  & use {
    color: $color;
  }
}
</style>
