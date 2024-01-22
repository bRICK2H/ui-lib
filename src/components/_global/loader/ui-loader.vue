<template>
  <transition name="loader">
    <div
      v-if="visible"
      :style="{ '--background-mask': background }"
      :class="['ui-loader-container', { mask, center }]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        :width="size"
        :height="size"
        viewBox="0 0 100 100"
      >
        <g
          v-for="(_, i) of figures"
          :key="i"
          :class="['group-rect', `group-rect-${i}`]"
        >
          <rect
            :x="offsetX"
            :y="offsetY"
            :rx="radius"
            :ry="radius"
            :fill="color"
            :width="width"
            :height="height"
            class="rect"
          />
        </g>
      </svg>
    </div>
  </transition>
</template>

<script>
import style from '@/assets/styles/globally/_export.modules.scss'

export default {
  name: 'UiLoader',

  props: {
    size: {
      type: Number,
      default: 50,
    },

    mask: {
      type: Boolean,
      default: false,
    },

    center: {
      type: Boolean,
      default: true,
    },

    visible: {
      type: Boolean,
      default: false,
    },

    color: {
      type: String,
      default: style.colorBluePrimary,
    },

    background: {
      type: String,
      default: style.colorFixedSecondary,
    },
  },

  data: () => ({
    radius: 6,
    width: 12,
    height: 25,
    offsetY: 1,
    offsetX: 44,
    figures: 8,
  }),
}
</script>

<style lang="scss">
$backgroundMask: var(--background-mask);

@keyframes opacity {
  0% {
    opacity: 0;
  }
}

@mixin animate($rotate, $begin) {
  transform: rotate($rotate);

  & .rect {
    animation: opacity 1s $begin infinite;
  }
}

.ui-loader-container {
  position: relative;
  z-index: 99999;

  &.center {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;

    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }

  &.mask {
    width: 100%;
    height: 100%;

    top: 0;
    left: 0;
    transform: none;
    background: $backgroundMask;
  }
}

.group-rect {
  transform-origin: center;
}

.group-rect-0 {
  @include animate(0deg, -0.825s);
}

.group-rect-1 {
  @include animate(45deg, -0.75s);
}

.group-rect-2 {
  @include animate(90deg, -0.625s);
}

.group-rect-3 {
  @include animate(135deg, -0.5s);
}

.group-rect-4 {
  @include animate(180deg, -0.375s);
}

.group-rect-5 {
  @include animate(225deg, -0.25s);
}

.group-rect-6 {
  @include animate(270deg, -0.125s);
}

.group-rect-7 {
  @include animate(315deg, 0s);
}

.loader-enter-active {
  animation: opacity 0.2s;
}

.loader-leave-active {
  animation: opacity 0.2s;
}
</style>
