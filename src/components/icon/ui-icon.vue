<template>
  <span
    :title="title"
    class="vpc-icon-container"
    v-on="listeners"
  >
    <svg
      :width="width"
      :height="height"
    >
      <use
        :style="{ color }"
        :href="`${require(`@/assets/icons/${name}.svg`)}#${name}`"
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
      default: style.colorBlackLight,
    },
    title: {
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
  },
  computed: {
    listeners() {
      return this.$listeners
    },
  },
}
</script>

<style lang="scss">
.vpc-icon-container {
  display: flex;
}
</style>
