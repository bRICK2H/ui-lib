<template>
  <div
    class="ui-scrollbar"
    :style="styles"
  >
    <!-- Scrollbar main -->
    <main class="scrollbar-main">
      <!-- Scrollbar content -->
      <div
        ref="scrollbar-content"
        class="scrollbar-content"
        @scroll="scroll($event)"
      >
        <slot />
      </div>

      <!-- Scrollbar Y -->
      <aside
        v-if="visibleScrollBarY"
        class="scrollbar-aside-y"
        :class="{
          'scrollbar-aside-y__internal-mode': enableInternalMode,
          'scrollbar-aside-y__external-mode': !enableInternalMode,
          'scrollbar-aside-y__interval-captured':
            enableInternalMode && isCaptured && currentSide === 'Y',
        }"
      >
        <div class="scrollbar-container-y">
          <div
            ref="scrollbar-content-y"
            class="scrollbar-content-y"
          >
            <div
              class="scrollbar-slider-y"
              @mousedown="dragStart($event, 'Y')"
            ></div>
          </div>
        </div>
      </aside>
    </main>

    <!-- Scrollbar X -->
    <aside
      v-if="visibleScrollBarX"
      class="scrollbar-aside-x"
      :class="{
        'scrollbar-aside-x__internal-mode': enableInternalMode,
        'scrollbar-aside-x__external-mode': !enableInternalMode,
        'scrollbar-aside-x__interval-captured':
          enableInternalMode && isCaptured && currentSide === 'X',
      }"
    >
      <div class="scrollbar-container-x">
        <div
          ref="scrollbar-content-x"
          class="scrollbar-content-x"
        >
          <div
            class="scrollbar-slider-x"
            @mousedown="dragStart($event, 'X')"
          ></div>
        </div>
      </div>
      <div
        v-if="visibleScrollBarY"
        class="scrollbar-cross-container"
      >
        <div class="scrollbar-cross-item"></div>
      </div>
    </aside>
  </div>
</template>

<script>
const sizes = () => {
  return {
    offsetWidth: 0,
    scrollWidth: 0,
    offsetHeight: 0,
    scrollHeight: 0,
  }
}

export default {
  name: 'UiScrollbar',
  props: {
    /**
     * Фиксированная ширина контента
     * ? размер указывается в пикселях
     * ? 0-я ширина подразумевает автоматическое вычисление исходя от родительской ширины
     */
    width: {
      type: Number,
      default: 0,
    },

    /**
     * Фиксированная высота контента
     * ? размер указывается в пикселях
     * ? 0-я высота подразумевает автоматическое вычисление исходя от родительской ширины
     */
    height: {
      type: Number,
      default: 0,
    },

    /**
     * Размер полосы прокрутки
     * ? размер указывается в пикселях
     */
    sliderSize: {
      type: Number,
      default: 6,
    },

    /**
     * Размер границы
     * ? размер указывается в пикселях
     */
    scrollBarBorderSize: {
      type: Number,
      default: 2,
    },

    /**
     * Радиус границы
     * ? размер указывается в пикселях
     */
    scrollBarBorderRadius: {
      type: Number,
      default: 10,
    },

    /**
     * Цвет фона слайдера
     */
    sliderColor: {
      type: String,
      default: 'rgb(36, 49, 67)',
    },

    /**
     * Цвет фона полосы прокрутки
     */
    scrollBarColor: {
      type: String,
      default: 'transparent',
    },

    /**
     * Цвет границы полосы прокрутки
     */
    scrollBarBorderColor: {
      type: String,
      default: 'transparent',
    },

    /**
     * Цвет фона для пересекающего элемента находящийся между полосами прокрутки
     */
    crossColor: {
      type: String,
      default: 'transparent',
    },

    /**
     * Скрыть горизонтальную прокрутку
     */
    hideScrollBarX: {
      type: Boolean,
      default: false,
    },

    /**
     * Скрыть вертикальную прокрутку
     */
    hideScrollBarY: {
      type: Boolean,
      default: false,
    },

    /**
     * Включить внутренний режим
     * ? полоса прокрутки абсолютна, т.е. включена в контент
     * ? в противном случае статична, т.е вне контента
     */
    enableInternalMode: {
      type: Boolean,
      default: true,
    },

    /**
     * Включить режим появления
     * ? полоса прокрутки видима только при наведении на контент
     * ? в противном случае всегда видимая
     * ! работает только с режимом enableInternalMode
     */
    enableAppearMode: {
      type: Boolean,
      default: false,
    },
  },
  data: () => ({
    ...sizes(),

    deltaY: 0,
    deltaX: 0,
    scrollTop: 0,
    scrollLeft: 0,
    scrollBarWidth: 0,
    scrollBarHeight: 0,
    startPointCaptureX: 0,
    startPointCaptureY: 0,

    el: null,
    intervalId: 0,
    currentSide: '',
    isCaptured: false,
    resizeObserver: null,
    mutationObserver: null,
  }),
  computed: {
    sliderMinSize() {
      return this.sliderSize * 3
    },
    sliderWidth() {
      const sliderWidth = Math.round(
        this.scrollBarWidth / (this.scrollWidth / this.offsetWidth)
      )

      return sliderWidth > this.sliderMinSize ? sliderWidth : this.sliderMinSize
    },

    sliderHeight() {
      const sliderHeight = Math.round(
        this.scrollBarHeight / (this.scrollHeight / this.offsetHeight)
      )

      return sliderHeight > this.sliderMinSize
        ? sliderHeight
        : this.sliderMinSize
    },

    visibleScrollBarX() {
      return !this.hideScrollBarX && this.scrollWidth > this.offsetWidth
    },

    visibleScrollBarY() {
      return !this.hideScrollBarY && this.scrollHeight > this.offsetHeight
    },

    styles() {
      const minSizeWrap = this.sliderMinSize + this.scrollBarBorderSize * 2
      const sliderSizeWithBorder =
        this.sliderSize + this.scrollBarBorderSize * 2

      return {
        '--cross-color': this.crossColor,

        '--min-size-wrap': `${minSizeWrap}px`,
        '--width-wrap': this.width > 0 ? `${this.width}px` : '100%',
        '--height-wrap': this.height > 0 ? `${this.height}px` : '100%',

        '--slider-color': this.sliderColor,
        '--slider-size': `${this.sliderSize}px`,
        '--slider-width': `${this.sliderWidth}px`,
        '--slider-height': `${this.sliderHeight}px`,

        '--scroll-top': `${this.scrollTop}px`,
        '--scroll-left': `${this.scrollLeft}px`,
        '--scroll-bar-color': this.scrollBarColor,
        '--scroll-bar-size': `${sliderSizeWithBorder}px`,
        '--scroll-bar-visibility': this.enableAppearMode ? 'hidden' : 'visible',
        '--scroll-bar-width':
          this.enableInternalMode && this.visibleScrollBarY
            ? `calc(100% - ${sliderSizeWithBorder}px)`
            : '100%',
        '--scroll-bar-height':
          this.enableInternalMode && this.visibleScrollBarX
            ? `calc(100% - ${sliderSizeWithBorder}px)`
            : '100%',
        '--scroll-bar-upper': `${
          sliderSizeWithBorder + sliderSizeWithBorder / 4
        }px`,
        '--scroll-bar-border-color': this.scrollBarBorderColor,
        '--scroll-bar-border-size': `${this.scrollBarBorderSize}px`,
        '--scroll-bar-border-radius': `${this.scrollBarBorderRadius}px`,
      }
    },
  },
  watch: {
    isCaptured(captured) {
      document.body.style.cursor = captured ? 'grabbing' : 'auto'
      document.body.style.userSelect = captured ? 'none' : 'auto'
    },
  },
  beforeDestroy() {
    clearInterval(this.intervalId)

    this.resizeObserver?.disconnect()
    this.mutationObserver?.disconnect()

    window.removeEventListener('mouseup', this.dragEnd)
    window.removeEventListener('mousemove', this.dragMove)
    window.removeEventListener('resize', this.resizeWindowListener)
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.setSizes()
      this.initEvents()

      if (this.el) {
        const content = this.$refs['scrollbar-content']

        content.append(this.el)
        this.initObserver(this.el)

        return
      }

      const scrollableContent = await this.waitScrollableContent()

      if (scrollableContent) {
        this.initObserver(scrollableContent)
      }
    },

    initEvents() {
      window.addEventListener('mouseup', this.dragEnd)
      window.addEventListener('mousemove', this.dragMove)
      window.addEventListener('resize', this.resizeWindowListener)
    },

    initObserver(content) {
      this.resizeScrollContent(content)
      this.mutateScrollContent(content)
    },

    setSizes() {
      this.setContentSizes()
      this.setScrollBarSizes()
    },

    setContentSizes() {
      const content = this.$refs['scrollbar-content']

      this.offsetWidth = content.offsetWidth
      this.scrollWidth = content.scrollWidth
      this.offsetHeight = content.offsetHeight
      this.scrollHeight = content.scrollHeight
    },

    async setScrollBarSizes() {
      await this.$nextTick()

      const scrollBarX = this.$refs['scrollbar-content-x']
      const scrollBarY = this.$refs['scrollbar-content-y']

      this.scrollBarWidth = scrollBarX?.offsetWidth ?? 0
      this.scrollBarHeight = scrollBarY?.offsetHeight ?? 0
    },

    scroll(event = {}) {
      const { type, target } = event
      const isEventScroll = type === 'scroll'

      this.deltaY = isEventScroll ? target.scrollTop : this.deltaY
      this.deltaX = isEventScroll ? target.scrollLeft : this.deltaX

      if (isEventScroll) {
        this.$emit('scroll', event)
      }

      if (this.isCaptured) {
        return
      }

      this.scrollTop = Math.round(
        (this.scrollBarHeight / this.scrollHeight) * this.deltaY
      )

      this.scrollLeft = Math.round(
        (this.scrollBarWidth / this.scrollWidth) * this.deltaX
      )

      if (this.sliderWidth <= this.sliderMinSize) {
        const scrollingPercentLeft =
          this.deltaX / (this.scrollWidth - this.scrollBarWidth)

        this.scrollLeft =
          scrollingPercentLeft * (this.scrollBarWidth - this.sliderMinSize)
      }

      if (this.sliderHeight <= this.sliderMinSize) {
        const scrollingPercentTop =
          this.deltaY / (this.scrollHeight - this.scrollBarHeight)

        this.scrollTop =
          scrollingPercentTop * (this.scrollBarHeight - this.sliderMinSize)
      }
    },

    dragStart(event, side) {
      this.isCaptured = true
      this.currentSide = side

      const client = event[`client${side}`]
      const scrollOffset = side === 'Y' ? this.scrollTop : this.scrollLeft

      this[`startPointCapture${side}`] = client - scrollOffset
    },

    dragMove(event) {
      if (!this.isCaptured) {
        return
      }

      const isSideY = this.currentSide === 'Y'
      const client = event[`client${this.currentSide}`]
      const scrollSize = isSideY ? this.scrollHeight : this.scrollWidth
      const sliderSize = isSideY ? this.sliderHeight : this.sliderWidth
      const startPointCapture = this[`startPointCapture${this.currentSide}`]
      const scrollBarSize = isSideY ? this.scrollBarHeight : this.scrollBarWidth

      let scrollOffset = client - startPointCapture

      if (scrollOffset < 0) {
        scrollOffset = 0
      }

      if (scrollOffset + sliderSize > scrollBarSize) {
        scrollOffset = scrollBarSize - sliderSize
      }

      const calcScrollBarSize =
        sliderSize <= this.sliderMinSize
          ? scrollBarSize - this.sliderMinSize
          : scrollBarSize
      const position = isSideY ? 'Top' : 'Left'
      const content = this.$refs['scrollbar-content']

      this[`scroll${position}`] = scrollOffset

      content[`scroll${position}`] = Math.round(
        (scrollSize / calcScrollBarSize) * scrollOffset
      )
    },

    dragEnd() {
      this.isCaptured = false
    },

    waitScrollableContent() {
      let count = 0
      let prevSizes = null

      const delay = 2000
      const step = delay / 10
      const { content } = this.findScrollableContent()

      if (content) {
        return Promise.resolve(content)
      }

      clearInterval(this.intervalId)
      return new Promise((resolve) => {
        this.intervalId = setInterval(() => {
          const { content, sizes } = this.findScrollableContent()
          const currSizes = JSON.stringify(sizes)
          count += step

          if ((content && prevSizes === currSizes) || count >= delay) {
            clearInterval(this.intervalId)
            resolve(content)
          }

          prevSizes = JSON.stringify(sizes)
        }, step)
      })
    },

    findScrollableContent() {
      const options = {
        content: null,
        sizes: sizes(),
      }

      if (!('default' in this.$slots)) {
        return options
      }

      return this.$slots.default.reduce((acc, { elm }) => {
        const parent = elm?.parentNode

        if (!parent) {
          return acc
        }

        for (const key in acc.sizes) {
          acc.sizes[key] = parent[key]
        }

        if (
          parent.scrollWidth > parent.offsetWidth ||
          parent.scrollHeight > parent.offsetHeight
        ) {
          acc.content = elm
        }

        return acc
      }, options)
    },

    resizeWindowListener() {
      this.setSizes()
      this.scroll()

      if ([this.mutationObserver, this.resizeObserver].includes(null)) {
        const { content } = this.findScrollableContent()

        if (content) {
          this.initObserver(content)
        }
      }
    },

    resizeScrollContent(content) {
      this.resizeObserver = new ResizeObserver(this.setSizes)
      this.resizeObserver.observe(content)
    },

    mutateScrollContent(content) {
      const config = {
        subtree: true,
        childList: true,
      }

      this.mutationObserver = new MutationObserver(this.setSizes)
      this.mutationObserver.observe(content, config)
    },
  },
}
</script>

<style lang="scss">
$cross-color: var(--cross-color);

$width-wrap: var(--width-wrap);
$height-wrap: var(--height-wrap);
$min-size-wrap: var(--min-size-wrap);

$slider-size: var(--slider-size);
$slider-color: var(--slider-color);
$slider-width: var(--slider-width);
$slider-height: var(--slider-height);

$scroll-top: var(--scroll-top);
$scroll-left: var(--scroll-left);
$scroll-bar-size: var(--scroll-bar-size);
$scroll-bar-color: var(--scroll-bar-color);
$scroll-bar-upper: var(--scroll-bar-upper);
$scroll-bar-width: var(--scroll-bar-width);
$scroll-bar-height: var(--scroll-bar-height);
$scroll-bar-visibility: var(--scroll-bar-visibility);
$scroll-bar-border-size: var(--scroll-bar-border-size);
$scroll-bar-border-color: var(--scroll-bar-border-color);
$scroll-bar-border-radius: var(--scroll-bar-border-radius);

.ui-scrollbar {
  width: $width-wrap;
  height: $height-wrap;
  min-width: $min-size-wrap;
  min-height: $min-size-wrap;

  display: flex;
  flex-direction: column;

  overflow: hidden;
  position: relative;

  &:hover {
    & .scrollbar-aside-x,
    & .scrollbar-aside-y {
      &__internal-mode {
        visibility: visible;
      }
    }
  }

  & .scrollbar-main {
    width: 100%;
    height: 100%;

    display: flex;
    overflow: hidden;
  }

  & .scrollbar-content {
    width: 100%;
    height: 100%;

    overflow: scroll;

    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }

  & .scrollbar-aside-x,
  & .scrollbar-aside-y {
    display: flex;

    &__internal-mode {
      position: absolute;
      visibility: $scroll-bar-visibility;

      & .scrollbar-slider-x,
      & .scrollbar-slider-y {
        opacity: 0.3;

        &:hover {
          opacity: 0.6;
        }

        &:active {
          opacity: 0.9;
        }
      }
    }

    &__interval-captured {
      visibility: visible;
    }

    &__external-mode {
      & .scrollbar-slider-x,
      & .scrollbar-slider-y {
        &:hover {
          filter: brightness(0.6);
        }

        &:active {
          filter: brightness(0.3);
        }
      }
    }
  }

  & .scrollbar-aside-x {
    width: 100%;
    min-height: $scroll-bar-size;

    &__interval-captured {
      min-height: $scroll-bar-upper;
    }

    &__internal-mode {
      bottom: 0;

      &:hover {
        transition: 0.2s;
        min-height: $scroll-bar-upper;
      }
    }
  }

  & .scrollbar-aside-y {
    height: 100%;
    min-width: $scroll-bar-size;

    &__interval-captured {
      min-width: $scroll-bar-upper;
    }
    &__internal-mode {
      right: 0;

      &:hover {
        transition: 0.2s;
        min-width: $scroll-bar-upper;
      }
    }
  }

  & .scrollbar-container-y,
  & .scrollbar-container-x {
    display: flex;
    align-items: center;

    background: $scroll-bar-color;
    border-radius: $scroll-bar-border-radius;
    border: $scroll-bar-border-size solid $scroll-bar-border-color;
  }

  & .scrollbar-container-y {
    width: 100%;
    height: $scroll-bar-height;
  }

  & .scrollbar-container-x {
    min-height: 100%;
    width: $scroll-bar-width;
  }

  & .scrollbar-content-y,
  & .scrollbar-content-x {
    width: 100%;
    height: 100%;

    display: flex;
    border-radius: $scroll-bar-border-radius;
  }

  & .scrollbar-content-y {
    justify-content: center;
  }

  & .scrollbar-content-x {
    align-items: center;
  }

  & .scrollbar-slider-y,
  & .scrollbar-slider-x {
    background: $slider-color;
    border-radius: $scroll-bar-border-radius;

    position: relative;

    &:hover {
      cursor: grab;
    }
    &:active {
      cursor: grabbing;
    }
  }

  & .scrollbar-slider-y {
    width: inherit;
    height: $slider-height;

    top: $scroll-top;
    transition: height 0.1s;
  }

  & .scrollbar-slider-x {
    height: inherit;
    width: $slider-width;

    left: $scroll-left;
    transition: width 0.1s;
  }

  & .scrollbar-cross-container {
    min-width: $scroll-bar-size;
    min-height: $scroll-bar-size;

    display: flex;
    align-items: center;
    justify-content: center;
  }

  .scrollbar-cross-item {
    width: $slider-size;
    height: $slider-size;
    background: $cross-color;
  }
}
</style>
