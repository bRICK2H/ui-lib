<template>
  <span
    :title="title"
    :style="{ '--color': currentColor }"
    class="vpc-icon-container"
    v-on="listeners"
  >
    <svg
      :width="iconWidth"
      :height="iconHeight"
    >
      <use
        ref="use"
        :y="offsetY"
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

    center: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    offsetY: 0,
    resizeObserver: null,
  }),

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

      return this.$parent.$options._componentTag === 'el-button'
        ? 'inherit'
        : style.colorBlackLightest
    },
  },

  mounted() {
    this.setResizeObserver()
  },

  destroyed() {
    this.removeResizeObserver()
  },

  methods: {
    setOffset(ref) {
      if (!ref) {
        return
      }

      const { width, height } = ref.getBoundingClientRect()

      if (width <= height) {
        return
      }

      this.offsetY = this.center ? (width - height) / 2 : 0
    },

    removeResizeObserver() {
      if (!this.resizeObserver || !this.center) {
        return
      }

      this.resizeObserver.disconnect()
    },

    setResizeObserver() {
      const ref = this.$refs['use']

      if (!ref || !this.center) {
        return
      }

      this.resizeObserver = new ResizeObserver(() => this.setOffset(ref))
      this.resizeObserver.observe(ref)
    },
  },
}
</script>

<style lang="scss">
$color: var(--color);

.vpc-icon-container {
  display: inline-flex;

  & use {
    color: $color;
  }
}
</style>
