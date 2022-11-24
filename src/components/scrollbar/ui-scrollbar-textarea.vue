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
        @scroll="isTextareaContent ? null : scroll($event)"
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
          <div class="scrollbar-content-y">
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
        <div class="scrollbar-content-x">
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
    el: null,
    content: null,
    intervalSlotId: null,
    intervalSizeId: null,
    resizeObserver: null,
    mutationObserver: null,

    currentSide: '',
    isCaptured: false,
    isTextareaContent: false,

    deltaY: 0,
    deltaX: 0,
    scrollTop: 0,
    scrollLeft: 0,
    offsetWidth: 0,
    scrollWidth: 0,
    offsetHeight: 0,
    scrollHeight: 0,
    scrollBarWidth: 0,
    scrollBarHeight: 0,
    startPointCaptureX: 0,
    startPointCaptureY: 0,
    prevScrollHeight: 0,
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

    overallBorderSize() {
      return this.scrollBarBorderSize * 2
    },

    overallSliderSize() {
      return this.sliderSize + this.overallBorderSize
    },

    minSizeWrap() {
      return this.sliderMinSize + this.overallBorderSize
    },

    styles() {
      return {
        '--cross-color': this.crossColor,

        '--min-size-wrap': `${this.minSizeWrap}px`,
        '--max-height-wrap':
          (this.enableInternalMode && this.visibleScrollBarY) ||
          !this.visibleScrollBarX
            ? '100vh'
            : `${`calc(100vh - ${this.overallSliderSize}px)`}`,

        '--width-wrap':
          this.width > 0
            ? `${this.width}px`
            : this.isTextareaContent
            ? `${this.offsetWidth}px`
            : '100%',
        '--height-wrap':
          this.height > 0
            ? `${this.height}px`
            : this.isTextareaContent
            ? `${this.offsetHeight}px`
            : '100%',

        '--slider-color': this.sliderColor,
        '--slider-size': `${this.sliderSize}px`,
        '--slider-width': `${this.sliderWidth}px`,
        '--slider-height': `${this.sliderHeight}px`,

        '--scroll-top': `${this.scrollTop}px`,
        '--scroll-left': `${this.scrollLeft}px`,
        '--scroll-bar-color': this.scrollBarColor,
        '--scroll-bar-size': `${this.overallSliderSize}px`,
        '--scroll-bar-visibility': this.enableAppearMode ? 'hidden' : 'visible',
        '--scroll-bar-width': `${this.scrollBarWidth}px`,
        '--scroll-bar-height': `${this.scrollBarHeight}px`,
        '--scroll-bar-upper': `${
          this.overallSliderSize + this.overallSliderSize / 4
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
    clearInterval(this.intervalSizeId)

    this.resizeObserver?.disconnect()
    this.mutationObserver?.disconnect()

    window.removeEventListener('resize', this.setSizes)
    window.removeEventListener('mouseup', this.dragEnd)
    window.removeEventListener('mousemove', this.dragMove)
  },
  mounted() {
    this.init()
  },
  methods: {
    // + 1. Попробовать обработать isLoad как-то иначе (учесть несколько вложенных контентов в скроллбар)
    // 2. Проверить скролл без вложенного дива, чисто текст (ПОПРОБОВАТЬ ТОЛЬКО С WR)
    // 3. Проверить все вариации включая с директивой v-scrollbar
    // 4. Попробовать внедрить скролл в textared

    async init() {
      this.content = this.$refs['scrollbar-content']

      if (this.el) {
        this.content.append(this.el)
      }

      this.initEvents()
      this.initObserver()
    },

    initEvents() {
      window.addEventListener('resize', this.setSizes)
      window.addEventListener('mouseup', this.dragEnd)
      window.addEventListener('mousemove', this.dragMove)
    },

    async initObserver() {
      const content = await this.fetchInternalContent()

      if (content.tagName === 'TEXTAREA') {
        console.warn(content)
        this.content = content
        content.classList.add('test')
        this.isTextareaContent = true

        this.content.addEventListener('scroll', (event) => {
          this.scroll(event)
        })
      }

      this.resizeScrollContent(content)
      this.mutateScrollContent(content)
    },

    fetchInternalContent() {
      let count = 0
      const delay = 2000
      const step = delay / 10
      const slots = this.$slots.default

      if (this.el) {
        return Promise.resolve(this.el)
      }

      if (slots?.length === 1) {
        const [{ elm }] = slots
        return Promise.resolve(elm instanceof HTMLElement ? elm : this.content)
      }

      clearInterval(this.intervalSlotId)
      console.time('intervalSlotId')
      return new Promise((resolve) => {
        this.intervalSlotId = setInterval(() => {
          const slots = this.$slots.default
          count += step

          if (slots?.length > 0 || count >= delay) {
            console.timeEnd('intervalSlotId')
            clearInterval(this.intervalSlotId)
          }

          if (slots?.length === 1) {
            const [{ elm }] = slots

            resolve(elm instanceof HTMLElement ? elm : this.content)
          }

          if (slots?.length > 1) {
            resolve(this.content)
          }
        }, step)
      })
    },

    setSizes() {
      this.setContentSizes()
      this.setScrollBarSizes()
      this.scroll()

      const delay = 100

      clearInterval(this.intervalSizeId)
      console.time('intervalSizeId')
      this.intervalSizeId = setInterval(() => {
        this.setSizes()

        const { scrollHeight } = this.content

        if (scrollHeight === this.prevScrollHeight) {
          console.timeEnd('intervalSizeId')
          clearInterval(this.intervalSizeId)
        }

        this.prevScrollHeight = scrollHeight
      }, delay)
    },

    setContentSizes() {
      const { offsetWidth, offsetHeight, scrollWidth, scrollHeight } =
        this.content

      this.offsetWidth = offsetWidth
      this.scrollWidth = scrollWidth
      this.offsetHeight = offsetHeight
      this.scrollHeight = scrollHeight

      console.log({
        offsetWidth: this.offsetWidth,
        scrollWidth: this.scrollWidth,
        offsetHeight: this.offsetHeight,
        scrollHeight: this.scrollHeight,
      })
    },

    async setScrollBarSizes() {
      await this.$nextTick()

      const { offsetWidth, offsetHeight } = this.content
      const y =
        this.visibleScrollBarY && this.enableInternalMode
          ? this.overallSliderSize
          : 0

      const x =
        this.visibleScrollBarX && this.enableInternalMode
          ? this.overallSliderSize
          : 0

      this.scrollBarWidth = offsetWidth - (this.overallBorderSize + y)
      this.scrollBarHeight = offsetHeight - (this.overallBorderSize + x)
    },

    scroll(event = {}) {
      console.log('scroll', event)
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

      this[`scroll${position}`] = scrollOffset

      this.content[`scroll${position}`] = Math.round(
        (scrollSize / calcScrollBarSize) * scrollOffset
      )
    },

    dragEnd() {
      this.isCaptured = false
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
$max-height-wrap: var(--max-height-wrap);

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

body {
  overflow: hidden;
}

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
    max-height: $max-height-wrap;

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

.test {
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
</style>
