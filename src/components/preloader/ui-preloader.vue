<template>
  <transition name="preloader">
    <div
      v-if="isVisiblePreloader"
      class="vpc-preloader"
      :style="stylePreloader"
    >
      <div
        v-for="(layers, i) of groupLayer"
        :key="`layer-${i}`"
        :class="['vpc-preloader-group', `vpc-preloader-group--layer-${i}`]"
        :style="{
          width: `${size}px`,
          height: `${size}px`,
        }"
      >
        <span
          v-for="(line, j) of layers"
          :key="line.id"
          :class="[
            'vpc-preloader-group__preloader-line',
            `vpc-preloader-group__preloader-line--side-${j}`,
          ]"
          :style="{
            width: `${Math.floor(size / 4)}px`,
            height: `${Math.floor(size / 8)}px`,
            background: color,
            opacity: line.opacity,
            borderRadius: `${size}px`,
            border: `1px solid ${color}`,
          }"
        />
      </div>
    </div>
  </transition>
</template>

<script>
import style from '@/assets/styles/globally/_export.modules.scss'

export default {
  name: 'UiPreloader',
  props: {
    size: {
      type: Number,
      default: 16,
    },
    visible: {
      type: Boolean,
      default: false,
    },
    speed: {
      type: Number,
      default: 100,
    },
    position: {
      type: String,
      default: 'absolute',
    },
    direction: {
      type: String,
      default: '',
    },
    closingDelay: {
      type: Number,
      default: 0,
    },
    color: {
      type: String,
      default: style.colorSolidWhitePrimary,
    },
  },
  data: () => ({
    intervalId: 0,
    isVisiblePreloader: false,
    groupLayer: [
      [
        { id: 1, opacity: 1 },
        { id: 2, opacity: 0.45 },
      ],
      [
        { id: 3, opacity: 0.85 },
        { id: 4, opacity: 0.3 },
      ],
      [
        { id: 5, opacity: 0.75 },
        { id: 6, opacity: 0.15 },
      ],
      [
        { id: 7, opacity: 0.6 },
        { id: 8, opacity: 0 },
      ],
    ],
  }),
  computed: {
    stylePreloader() {
      const isCenter =
        this.direction === 'center' && this.position === 'absolute'

      return {
        width: `${this.size}px`,
        height: `${this.size}px`,
        position: this.position,
        top: isCenter ? '50%' : 0,
        left: isCenter ? '50%' : 0,
        transform: isCenter ? 'translate(-50%, -50%)' : 'none',
      }
    },
  },
  watch: {
    visible: {
      immediate: true,
      handler() {
        if (this.visible) {
          this.init()

          return
        }

        this.close()
      },
    },
  },
  beforeDestroy() {
    this.close()
  },
  methods: {
    init() {
      this.start()
      this.isVisiblePreloader = true
    },
    start() {
      this.intervalId = setInterval(() => {
        const lastIndex = this.groupLayer.length - 1
        const [lastGroup] = this.groupLayer.splice(lastIndex, 1)

        this.groupLayer.unshift(lastGroup.reverse())
      }, this.speed)
    },
    close() {
      clearInterval(this.intervalId)
      this.isVisiblePreloader = false
    },
  },
}
</script>

<style lang="scss">
.vpc-preloader {
  display: flex;
  z-index: 9999;
}
.vpc-preloader-group {
  background: none;
  position: absolute;

  &--layer-1 {
    transform: rotate(45deg);
  }
  &--layer-2 {
    transform: rotate(90deg);
  }
  &--layer-3 {
    transform: rotate(135deg);
  }

  &__preloader-line {
    position: absolute;

    &--side-0 {
      top: 50%;
      right: 0;
      transform: translateY(-50%);
    }

    &--side-1 {
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
  }
}
.preloader-leave-active {
  animation: preloader-leave 0.4s;

  @keyframes preloader-leave {
    100% {
      opacity: 0;
    }
  }
}
</style>
