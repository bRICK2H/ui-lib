<template>
  <div
    class="pie-chart-wrapper"
    :style="{ '--size': `${size}px` }"
  >
    <div class="pie-char-text-container">
      <div class="pie-char-text-content">
        <slot />
        <span class="pie-char-text-percent"> {{ currentPercent }} % </span>
      </div>
    </div>

    <svg
      class="pie-chart-container"
      :width="size"
      :height="size"
    >
      <circle
        :cx="axisOffset"
        :cy="axisOffset"
        :r="radius"
        fill="none"
        stroke="#DEE8F6"
        :stroke-width="strokeWidth"
        :stroke-dasharray="0"
        :stroke-dashoffset="circleLength"
      />

      <circle
        class="pie-chart-progress"
        :cx="axisOffset"
        :cy="axisOffset"
        :r="radius"
        fill="none"
        :stroke="colorProgress"
        :stroke-width="strokeWidth"
        :stroke-dasharray="circleLength"
        :stroke-dashoffset="circleLength"
        :style="{ '--segment-offset': segmentOffset }"
      />
    </svg>
  </div>
</template>

<script>
import style from '@/assets/styles/globally/_export.modules.scss'

export default {
  name: 'UiChart',
  props: {
    size: {
      type: Number,
      required: true,
    },
    percent: {
      type: Number,
      default: 0,
      validator(value) {
        return value <= 100
      },
    },
  },

  data: () => ({
    intervalId: 0,
    strokeWidth: 8,
    currentPercent: 0,
  }),

  computed: {
    // Смещение осей
    axisOffset() {
      return this.size / 2
    },

    // Радиус круга
    radius() {
      return this.axisOffset - this.strokeWidth / 2
    },

    // Длина круга
    circleLength() {
      return Math.PI * 2 * this.radius
    },

    // Процент от длинны круга
    circlePercent() {
      return (this.percent * this.circleLength) / 100
    },

    // Смещение отрезка
    segmentOffset() {
      return this.circleLength - this.circlePercent
    },

    // Процент прогресса градусов
    circleDegrees() {
      return (this.percent * 360) / 100
    },

    colorProgress() {
      if (this.percent < 80) {
        return style.colorSolidSuccessPrimary
      }

      if (this.percent < 90) {
        return style.colorSolidCriticalPrimary
      }

      return style.colorSolidDangerPrimary
    },
  },

  created() {
    this.startPercent()
  },

  beforeDestroy() {
    clearInterval(this.intervalId)
  },

  methods: {
    startPercent() {
      this.intervalId = setInterval(() => {
        if (this.currentPercent > this.percent) {
          this.currentPercent = parseFloat(this.percent.toFixed(2))
          clearInterval(this.intervalId)
        } else {
          this.currentPercent += 1
        }
      }, 8)
    },
  },
}
</script>

<style lang="scss">
$size: var(--size);
$segment-offset: var(--segment-offset);

.pie-chart-wrapper {
  width: $size;
  height: $size;
  position: relative;

  & .pie-chart-progress {
    animation: fill-percent 0.8s ease forwards;

    @keyframes fill-percent {
      100% {
        stroke-dashoffset: $segment-offset;
      }
    }
  }

  & .pie-char-text-container {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & .pie-char-text-content {
    gap: 0.4rem;
    display: flex;
    align-items: center;
    flex-direction: column;
  }

  & .pie-char-text-percent {
    line-height: 1.96rem;
    font-size: $av-font-size-xs;
    color: $av-solid-fixed-light;
    font-weight: $av-font-weight-normal;
  }
}
</style>
