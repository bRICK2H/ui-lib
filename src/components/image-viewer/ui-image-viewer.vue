<template>
  <div class="ui-image-viewer">
    <div
      ref="viewport"
      :style="viewportSize"
      class="ui-image-viewer-viewport"
    >
      <img
        ref="image"
        :alt="alt"
        :style="[imageCursor, imageTransform]"
        src="@/assets/images/5.jpg"
        class="ui-image-viewer-control-item"
        @mousedown="mouseEvent"
        @wheel.prevent="wheelEvent"
      />
    </div>
  </div>
</template>

<script>
import throttle from 'lodash/throttle'

export default {
  name: 'UiImageViewer',

  props: {
    /**
     * Путь к графическому файлу
     */
    url: {
      type: String,
      default: '',
      // required: true,
    },

    /**
     * Альтернативный текст для изображения
     */
    alt: {
      type: String,
      default: '',
    },

    /**
     * Ширина области просмотра
     */
    width: {
      type: [Number, String],
      default: 'auto',
    },

    /**
     * Высота области просмотра
     */
    height: {
      type: [Number, String],
      default: 'auto',
    },

    /**
     * Максимальное значение масштабирования
     */
    maxScale: {
      type: Number,
      default: 10,
    },

    /**
     * Счетчик, обновляет масштаб при инкременте и декременте
     */
    scaleCount: {
      type: Number,
      default: 0,
    },

    /**
     * Процентное соотношения, обновление масштаба в конкретных процентах
     */
    scalePercentage: {
      type: Number,
      default: 100,
    },
  },

  data: () => ({
    scale: 1,
    minScale: 1,
    scaleStep: 1.2,
    originalScale: 1,
    throttleDelay: 300,
    currentScaleStep: 0,
    primaryImageOffsetX: 0,
    primaryImageOffsetY: 0,

    translate: { x: 0, y: 0 },
    client: { x: 0, y: 0, oldX: 0, oldY: 0 },

    isGrab: false,
    isWheel: false,
    isMovementX: false,
    isMovementY: false,

    scaledImage: null,
    scaledViewport: null,
    resizeObserver: null,
  }),

  computed: {
    isMovement() {
      return this.isMovementX || this.isMovementY
    },

    imageCursor() {
      if (!this.isMovement) {
        return {
          cursor: 'default',
        }
      }

      return {
        cursor: this.isGrab ? 'grabbing' : 'grab',
      }
    },

    imageTransform() {
      return {
        transform: `translate(${this.translate.x}px, ${this.translate.y}px) scale(${this.scale})`,
      }
    },

    viewportSize() {
      return {
        maxWidth:
          this.width === 'auto'
            ? null
            : typeof this.width === 'string'
            ? this.width
            : `${this.width}px`,
        maxHeight:
          this.height === 'auto'
            ? null
            : typeof this.height === 'string'
            ? this.height
            : `${this.height}px`,
      }
    },
  },

  watch: {
    scale() {
      this.setScaleMovement()
    },

    scaleCount(curr, prev) {
      this.setScale({ isZoomIn: curr > prev })

      if (!this.isWheel) {
        this.setScaleOffset({ x: 0, y: 0 })
      }
    },

    scalePercentage(percentage) {
      if (this.isWheel) {
        return
      }

      this.setScalePercentage(percentage)
      this.setScaleOffset({ x: 0, y: 0 })
    },
  },

  created() {
    this.throttleUpdateCoords = throttle(this.updateCoords, this.throttleDelay)
  },

  mounted() {
    this.registerEvents()
  },

  destroyed() {
    this.destroyEvents()
  },

  methods: {
    getNode(name) {
      const node = this.$refs[name]

      return node?.getBoundingClientRect()
    },

    getNaturalImageSize() {
      const image = this.$refs['image']

      return {
        width: image.naturalWidth,
        height: image.naturalHeight,
      }
    },

    getPercentages(scale) {
      const decimalPoint = String(
        (this.maxScale - this.originalScale) * 100
      ).length

      return Math.round(scale.toFixed(decimalPoint) * 100)
    },

    defineOriginalScale() {
      const image = this.getNaturalImageSize()
      const viewport = this.getNode('viewport')

      const originalScale = Math.min(
        viewport.width / image.width,
        viewport.height / image.height
      )

      this.originalScale =
        originalScale < this.minScale ? originalScale : this.minScale
    },

    setScalePercentage(percentage) {
      const diffPercentage = this.getPercentages(1 - this.originalScale)
      const currentPercentage = percentage + diffPercentage

      const minPercentage = this.getPercentages(this.minScale)
      const maxPercentage = this.getPercentages(this.maxScale) + diffPercentage

      if (
        currentPercentage < minPercentage ||
        currentPercentage > maxPercentage
      ) {
        return
      }

      this.setScale({ scale: currentPercentage / 100 })
    },

    async setImageOffset() {
      await this.$nextTick()

      const image = this.getNode('image')

      if (!image) {
        return
      }

      this.primaryImageOffsetX = image.x
      this.primaryImageOffsetY = image.y
    },

    async setScaleMovement() {
      await this.$nextTick()

      const image = this.getNode('image')
      const viewport = this.getNode('viewport')

      if (!image || !viewport) {
        return
      }

      this.scaledImage = image
      this.scaledViewport = viewport
      this.isMovementX = viewport.width < image.width
      this.isMovementY = viewport.height < image.height
    },

    setScale({ isZoomIn, scale } = {}) {
      const offsetMaxScale = this.maxScale + (1 - this.originalScale)

      if (scale !== undefined) {
        this.scale = scale
      } else {
        const stepDirection = isZoomIn ? this.scaleStep : 1 / this.scaleStep
        const nextScale = this.scale * stepDirection

        this.currentScaleStep =
          nextScale > offsetMaxScale
            ? offsetMaxScale / this.scale
            : stepDirection

        if (this.scale === this.minScale) {
          this.currentScaleStep = 1
        }

        if (nextScale < this.minScale) {
          this.scale = this.minScale
        } else {
          this.scale = nextScale > offsetMaxScale ? offsetMaxScale : nextScale
        }
      }

      const offsetScale = this.scale - 1 + this.originalScale

      this.$emit('scale', {
        scale: offsetScale,
        percentage: this.getPercentages(offsetScale),
        maxPercentage: this.getPercentages(this.maxScale),
        minPercentage: this.getPercentages(this.originalScale),
      })
    },

    wheelEvent(event) {
      const image = this.$refs['image']
      const { deltaY, clientX, clientY } = event

      // Image centering
      const isZoomIn = deltaY < 0
      const x = clientX - this.primaryImageOffsetX - image.width / 2
      const y = clientY - this.primaryImageOffsetY - image.height / 2

      this.isWheel = true
      this.setScale({ isZoomIn })
      this.setScaleOffset({ x, y })
    },

    mouseEvent(event) {
      event.preventDefault()

      const { type, clientX, clientY } = event

      if (type === 'mousedown') {
        this.isGrab = true
      }

      if (['mouseup', 'mouseout'].includes(type)) {
        this.isGrab = false
      }

      this.client.oldX = this.client.x
      this.client.oldY = this.client.y
      this.client.x = clientX
      this.client.y = clientY

      if (this.isGrab && this.isMovement) {
        this.setOffset()
      }
    },

    async setScaleOffset({ x, y }) {
      if (x === 0 && y === 0) {
        this.translate.x = 0
        this.translate.y = 0

        return
      }

      this.translate.x = x - (x - this.translate.x) * this.currentScaleStep
      this.translate.y = y - (y - this.translate.y) * this.currentScaleStep

      await this.$nextTick()
      this.isWheel = false

      const image = this.getNode('image')
      const viewport = this.getNode('viewport')

      const diffTop = image.top - viewport.top
      const diffLeft = image.left - viewport.left
      const diffRight = image.right - viewport.right
      const diffBottom = image.bottom - viewport.bottom

      // Vertical correction
      if (viewport.width > image.width) {
        this.translate.x = 0
      } else {
        if (diffLeft > 0) {
          this.translate.x -= diffLeft
        }

        if (diffRight < 0) {
          this.translate.x -= diffRight
        }
      }

      // Horizontal correction
      if (viewport.height > image.height) {
        this.translate.y = 0
      } else {
        if (diffTop > 0) {
          this.translate.y -= diffTop
        }

        if (diffBottom < 0) {
          this.translate.y -= diffBottom
        }
      }
    },

    setOffset() {
      const diffX = (this.scaledViewport.width - this.scaledImage.width) / 2
      const diffY = (this.scaledViewport.height - this.scaledImage.height) / 2

      // Vertical correction
      if (this.isMovementX) {
        this.translate.x += this.client.x - this.client.oldX

        if (diffX > this.translate.x) {
          this.translate.x = diffX
        }

        if (Math.abs(diffX) < this.translate.x) {
          this.translate.x = Math.abs(diffX)
        }
      }

      // Horizontal correction
      if (this.isMovementY) {
        this.translate.y += this.client.y - this.client.oldY

        if (diffY > this.translate.y) {
          this.translate.y = diffY
        }

        if (Math.abs(diffY) < this.translate.y) {
          this.translate.y = Math.abs(diffY)
        }
      }
    },

    resizeViewport() {
      const image = this.$refs['image']

      if (!image) {
        return
      }

      this.resizeObserver = new ResizeObserver(this.updateCoords)
      this.resizeObserver.observe(image)
    },

    async updateCoords() {
      await this.$nextTick()

      this.defineOriginalScale()
      this.setScale({ scale: this.minScale })
      this.setScaleOffset({ x: 0, y: 0 })
      this.setScaleMovement()
      this.setImageOffset()
    },

    registerEvents() {
      this.resizeViewport()
      document.addEventListener('mouseup', this.mouseEvent)
      document.addEventListener('mousemove', this.mouseEvent)
      window.addEventListener('resize', this.throttleUpdateCoords)
    },

    destroyEvents() {
      this.removeResizeViewport()
      document.removeEventListener('mouseup', this.mouseEvent)
      document.removeEventListener('mousemove', this.mouseEvent)
      window.removeEventListener('resize', this.throttleUpdateCoords)
    },

    removeResizeViewport() {
      this.resizeObserver.disconnect()
    },
  },
}
</script>

<style lang="scss">
.ui-image-viewer {
  overflow: hidden;
}

.ui-image-viewer,
.ui-image-viewer-viewport {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;
}

.ui-image-viewer-control-item {
  max-width: 100%;
  max-height: 100%;
}
</style>
