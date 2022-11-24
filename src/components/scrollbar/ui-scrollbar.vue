<template>
  <div
    ref="ui-scrollbar"
    class="ui-scrollbar"
    :class="{ 'ui-scrollbar--textarea': hasTextareaContent }"
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
            enableInternalMode && isCapturedSlider && currentSide === 'Y',
        }"
      >
        <div class="scrollbar-container-y">
          <div
            ref="scrollbar-content-y"
            class="scrollbar-content-y"
          >
            <div
              class="scrollbar-slider-y"
              @mousedown="dragScrollStart($event, 'Y')"
            ></div>
          </div>
        </div>

        <div
          v-if="hasTextareaContent && areaDragRule !== 'none'"
          class="scrollbar-resize-container"
        >
          <div
            class="scrollbar-resize-item"
            @mousedown="dragTextareaResizeStart"
          >
            <ui-icon
              name="area-drag"
              :color="sliderColor"
              :width="overallSliderSize"
              :height="overallSliderSize"
            />
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
          enableInternalMode && isCapturedSlider && currentSide === 'X',
      }"
    >
      <div class="scrollbar-container-x">
        <div
          ref="scrollbar-content-x"
          class="scrollbar-content-x"
        >
          <div
            class="scrollbar-slider-x"
            @mousedown="dragScrollStart($event, 'X')"
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
const colorValidator = (value) => {
  const rgba = value.split(',')

  return value === '' || [3, 4].includes(rgba.length)
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
     * Цвет фона слайдера (только в формате RGB/RGBA)
     */
    sliderColor: {
      type: String,
      default: '36, 49, 67',
      validator: colorValidator,
    },

    /**
     * Цвет фона полосы прокрутки (только в формате RGB/RGBA)
     */
    scrollBarColor: {
      type: String,
      default: '',
      validator: colorValidator,
    },

    /**
     * Цвет границы полосы прокрутки (только в формате RGB/RGBA)
     */
    scrollBarBorderColor: {
      type: String,
      default: '',
      validator: colorValidator,
    },

    /**
     * Цвет фона для пересекающего элемента находящийся между полосами прокрутки (только в формате RGB/RGBA)
     */
    crossColor: {
      type: String,
      default: '',
      validator: colorValidator,
    },

    /**
     * Правило ресайза (работает только для вложенного элемента textarea)
     */
    areaDragRule: {
      type: String,
      default: 'both',
      validator: (value) => {
        return ['none', 'both', 'horizontal', 'vertical'].includes(value)
      },
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
    isCapturedSlider: false,
    isCapturedTextareaResize: false,
    hasTextareaContent: false,

    deltaY: 0,
    deltaX: 0,
    offsetTop: 0,
    offsetLeft: 0,
    scrollTop: 0,
    scrollLeft: 0,
    offsetWidth: 0,
    scrollWidth: 0,
    offsetHeight: 0,
    scrollHeight: 0,
    scrollBarWidth: 0,
    scrollBarHeight: 0,
    prevScrollHeight: 0,
    startPointCaptureSliderX: 0,
    startPointCaptureSliderY: 0,
    startPointCaptureTextareaX: 0,
    startPointCaptureTextareaY: 0,
  }),
  computed: {
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

    scrollPercentageFromTop() {
      const percentTop = this.deltaY / (this.scrollHeight - this.offsetHeight)

      return isNaN(percentTop) ? 0 : percentTop
    },

    scrollPercentageFromLeft() {
      const percentLeft = this.deltaX / (this.scrollWidth - this.offsetWidth)

      return isNaN(percentLeft) ? 0 : percentLeft
    },

    sliderMinSize() {
      return this.sliderSize * 2
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
        '--cross-color': this.crossColor
          ? `rgba(${this.crossColor}`
          : 'transparent',
        '--textarea-cursor': this.textareaCursor,

        '--min-size-wrap': `${this.minSizeWrap}px`,
        '--max-height-wrap':
          (this.enableInternalMode && this.visibleScrollBarY) ||
          !this.visibleScrollBarX
            ? '100vh'
            : `calc(100vh - ${this.overallSliderSize}px)`,

        '--width-wrap':
          this.width > 0
            ? `${this.width}px`
            : this.hasTextareaContent
            ? `${this.offsetWidth}px`
            : '100%',
        '--height-wrap':
          this.height > 0
            ? `${this.height}px`
            : this.hasTextareaContent
            ? `${this.offsetHeight}px`
            : '100%',

        '--slider-size': `${this.sliderSize}px`,
        '--slider-width': `${this.sliderWidth}px`,
        '--slider-height': `${this.sliderHeight}px`,
        '--slider-color': `rgba(${this.sliderColor})`,
        '--slider-size-up': `${this.sliderSize + this.sliderSize / 3}px`,
        '--slider-width-textarea':
          this.hasTextareaContent &&
          !this.enableInternalMode &&
          this.visibleScrollBarY
            ? `${this.overallSliderSize}px`
            : 0,

        '--scroll-top': `${this.scrollTop}px`,
        '--scroll-left': `${this.scrollLeft}px`,
        '--scroll-bar-color': this.scrollBarColor
          ? `rgba(${this.scrollBarColor}, ${this.enableInternalMode ? 0.3 : 1})`
          : 'transparent',
        '--scroll-bar-size': `${this.overallSliderSize}px`,
        '--scroll-bar-visibility': this.enableAppearMode ? 'hidden' : 'visible',
        '--scroll-bar-width':
          this.enableInternalMode && this.visibleScrollBarY
            ? `calc(100% - ${this.overallSliderSize}px)`
            : '100%',
        '--scroll-bar-height':
          this.enableInternalMode && this.visibleScrollBarX
            ? `calc(100% - ${this.overallSliderSize}px)`
            : '100%',
        '--scroll-bar-border-color': this.scrollBarBorderColor
          ? `rgba(${this.scrollBarBorderColor}, ${
              this.enableInternalMode ? 0.3 : 1
            })`
          : 'transparent',
        '--scroll-bar-border-size': `${this.scrollBarBorderSize}px`,
        '--scroll-bar-border-radius': `${this.scrollBarBorderRadius}px`,
      }
    },

    textareaCursor() {
      const mapCursor = {
        none: 'none',
        both: 'nw-resize',
        vertical: 'n-resize',
        horizontal: 'w-resize',
      }

      return mapCursor[this.areaDragRule]
    },
  },
  watch: {
    isCapturedSlider(captured) {
      document.body.style.userSelect = captured ? 'none' : 'auto'
      document.body.style.cursor = captured ? 'grabbing' : 'auto'
    },
    isCapturedTextareaResize(captured) {
      document.body.style.userSelect = captured ? 'none' : 'auto'
      document.body.style.cursor = captured ? this.textareaCursor : 'auto'
    },
  },
  beforeDestroy() {
    clearInterval(this.intervalSizeId)

    this.resizeObserver?.disconnect()
    this.mutationObserver?.disconnect()

    window.removeEventListener('resize', this.resize)
    window.removeEventListener('mouseup', this.dragScrollEnd)
    window.removeEventListener('mousemove', this.dragScrollMove)

    if (this.hasTextareaContent) {
      this.content.removeEventListener('scroll', this.scroll)
      this.content.removeEventListener('input', this.setSizes)
      window.addEventListener('mouseup', this.dragTextareaResizeEnd)
      window.removeEventListener('mousemove', this.dragTextareaResizeMove)
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    async init() {
      this.content = this.$refs['scrollbar-content']

      if (this.el) {
        this.content.append(this.el)
      }

      const elTagName = this.el?.tagName
      const contentTagName = this.content.firstElementChild?.tagName

      if ([elTagName, contentTagName].includes('TEXTAREA')) {
        this.hasTextareaContent = true
        this.content = this.el ?? this.content.firstElementChild
        this.content.classList.add('scrollbar--textarea-hidden')

        this.content.addEventListener('scroll', this.scroll)
        this.content.addEventListener('input', this.setSizes)
        window.addEventListener('mouseup', this.dragTextareaResizeEnd)
        window.addEventListener('mousemove', this.dragTextareaResizeMove)
      }

      this.initEvents()
      this.initObserver()
    },

    initEvents() {
      window.addEventListener('resize', this.resize)
      window.addEventListener('mouseup', this.dragScrollEnd)
      window.addEventListener('mousemove', this.dragScrollMove)
    },

    async initObserver() {
      const content = await this.fetchInternalContent()

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
      return new Promise((resolve) => {
        this.intervalSlotId = setInterval(() => {
          const slots = this.$slots.default
          count += step

          if (slots?.length > 0 || count >= delay) {
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

      const delay = 100

      clearInterval(this.intervalSizeId)
      this.intervalSizeId = setInterval(() => {
        this.resize()
        const { scrollHeight } = this.content

        if (scrollHeight === this.prevScrollHeight) {
          this.prevScrollHeight = 0
          clearInterval(this.intervalSizeId)
        } else {
          this.prevScrollHeight = scrollHeight
        }
      }, delay)
    },

    setContentSizes() {
      const { offsetLeft, offsetTop } = this.$refs['ui-scrollbar']
      const { offsetWidth, offsetHeight, scrollWidth, scrollHeight } =
        this.content

      this.offsetTop = offsetTop
      this.offsetLeft = offsetLeft
      this.offsetWidth = offsetWidth
      this.scrollWidth = scrollWidth
      this.offsetHeight = offsetHeight
      this.scrollHeight = scrollHeight
    },

    async setScrollBarSizes() {
      await this.$nextTick()

      const scrollbarContentX = this.$refs['scrollbar-content-x']
      const scrollbarContentY = this.$refs['scrollbar-content-y']

      this.scrollBarWidth = scrollbarContentX?.offsetWidth ?? 0
      this.scrollBarHeight = scrollbarContentY?.offsetHeight ?? 0
    },

    scroll(event) {
      const { target } = event
      this.$emit('scroll', event)

      this.deltaY = target.scrollTop
      this.deltaX = target.scrollLeft

      this.scrollTop = Math.round(
        this.scrollPercentageFromTop *
          (this.scrollBarHeight - this.sliderHeight)
      )

      this.scrollLeft = Math.round(
        this.scrollPercentageFromLeft * (this.scrollBarWidth - this.sliderWidth)
      )
    },

    async resize() {
      this.setSizes()
      await this.$nextTick()

      this.scrollTop = Math.round(
        (this.scrollBarHeight / this.scrollHeight) * this.deltaY
      )

      this.scrollLeft = Math.round(
        (this.scrollBarWidth / this.scrollWidth) * this.deltaX
      )
    },

    dragScrollStart(event, side) {
      this.isCapturedSlider = true
      this.currentSide = side

      const client = event[`client${side}`]
      const scrollOffset = side === 'Y' ? this.scrollTop : this.scrollLeft

      this[`startPointCaptureSlider${side}`] = client - scrollOffset
    },

    dragScrollMove(event) {
      if (!this.isCapturedSlider) {
        return
      }

      const isSideY = this.currentSide === 'Y'
      const client = event[`client${this.currentSide}`]
      const scrollSize = isSideY ? this.scrollHeight : this.scrollWidth
      const offsetSize = isSideY ? this.offsetHeight : this.offsetWidth
      const sliderSize = isSideY ? this.sliderHeight : this.sliderWidth
      const startPointCaptureSlider =
        this[`startPointCaptureSlider${this.currentSide}`]
      const scrollBarSize = isSideY ? this.scrollBarHeight : this.scrollBarWidth

      let scrollOffset = client - startPointCaptureSlider

      if (scrollOffset < 0) {
        scrollOffset = 0
      }

      if (scrollOffset + sliderSize > scrollBarSize) {
        scrollOffset = scrollBarSize - sliderSize
      }

      const position = isSideY ? 'Top' : 'Left'

      this[`scroll${position}`] = scrollOffset
      this.content[`scroll${position}`] =
        scrollOffset *
        ((scrollSize - offsetSize) / (scrollBarSize - sliderSize))
    },

    dragScrollEnd() {
      this.isCapturedSlider = false
    },

    dragTextareaResizeStart(event) {
      const { offsetX, offsetY } = event

      this.isCapturedTextareaResize = true
      this.startPointCaptureTextareaX = this.overallSliderSize - offsetX
      this.startPointCaptureTextareaY = this.overallSliderSize - offsetY
    },

    dragTextareaResizeMove(event) {
      if (!this.isCapturedTextareaResize) {
        return
      }

      const { clientX, clientY } = event
      const _width =
        this.startPointCaptureTextareaX + (clientX - this.offsetLeft)
      const _height =
        this.startPointCaptureTextareaY + (clientY - this.offsetTop)

      if (['both', 'horizontal'].includes(this.areaDragRule)) {
        this.content.style.width = `${_width}px`
      }

      if (['both', 'vertical'].includes(this.areaDragRule)) {
        this.content.style.height = `${_height}px`
      }

      this.resize()
    },

    dragTextareaResizeEnd() {
      this.isCapturedTextareaResize = false
    },

    resizeScrollContent(content) {
      this.resizeObserver = new ResizeObserver(this.setSizes)
      this.resizeObserver.observe(content)
    },

    mutateScrollContent(content) {
      const config = {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true,
      }

      this.mutationObserver = new MutationObserver(this.setSizes)
      this.mutationObserver.observe(content, config)
    },
  },
}
</script>

<style lang="scss">
$cross-color: var(--cross-color);
$textarea-cursor: var(--textarea-cursor);

$width-wrap: var(--width-wrap);
$height-wrap: var(--height-wrap);
$min-size-wrap: var(--min-size-wrap);
$max-height-wrap: var(--max-height-wrap);

$slider-size: var(--slider-size);
$slider-color: var(--slider-color);
$slider-width: var(--slider-width);
$slider-height: var(--slider-height);
$slider-size-up: var(--slider-size-up);
$slider-width-textarea: var(--slider-width-textarea);

$scroll-top: var(--scroll-top);
$scroll-left: var(--scroll-left);
$scroll-bar-size: var(--scroll-bar-size);
$scroll-bar-color: var(--scroll-bar-color);
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

  &--textarea {
    border: 1px solid;
    border-radius: 3px;
    box-sizing: content-box;
  }

  & .scrollbar--textarea-hidden {
    -ms-overflow-style: none;
    scrollbar-width: none;

    resize: none;
    border: none;
    padding: 2px;
    position: absolute;

    &::-webkit-scrollbar {
      height: 0;
      width: $slider-width-textarea;
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

      & .scrollbar-cross-container,
      & .scrollbar-resize-container {
        opacity: 0.3;
      }

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
      .scrollbar-slider-x {
        height: $slider-size-up;
      }
    }

    &__internal-mode {
      bottom: 0;

      .scrollbar-slider-x:hover {
        height: $slider-size-up;
      }
    }
  }

  & .scrollbar-aside-y {
    min-width: $scroll-bar-size;
    flex-direction: column;
    z-index: 1;

    &__interval-captured {
      .scrollbar-slider-y {
        width: $slider-size-up;
      }
    }

    &__internal-mode {
      height: 100%;
      right: 0;

      .scrollbar-slider-y:hover {
        width: $slider-size-up;
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

    overflow: hidden;
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
    transition: height 0.1s;

    top: $scroll-top;
  }

  & .scrollbar-slider-x {
    height: inherit;
    width: $slider-width;
    transition: width 0.1s;

    left: $scroll-left;
  }

  & .scrollbar-cross-container,
  & .scrollbar-resize-container {
    min-width: $scroll-bar-size;
    max-width: $scroll-bar-size;
    min-height: $scroll-bar-size;
    max-height: $scroll-bar-size;

    display: flex;
    align-items: center;
    justify-content: center;
    align-self: flex-end;
  }

  & .scrollbar-cross-item {
    width: $slider-size;
    height: $slider-size;
    background: $cross-color;
  }

  & .scrollbar-resize-item {
    width: 100%;
    height: 100%;
    cursor: $textarea-cursor;
  }
}
</style>
