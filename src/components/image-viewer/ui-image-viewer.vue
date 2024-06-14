<template>
  <div
    ref="viewport"
    class="ui-image-viewer-viewport"
  >
    <img
      ref="image"
      :alt="alt"
      :style="[size, cursor, transform]"
      class="ui-image-viewer-control-item"
      src="@/assets/images/map.png"
      @mousedown="mouseEvent"
      @wheel.prevent="wheelEvent"
    />
  </div>
</template>

<script>
export default {
  name: 'UiImageViewer',

  props: {
    url: {
      type: String,
      default: '',
    },

    alt: {
      type: String,
      default: '',
    },

    width: {
      type: [Number, String],
      default: 'none',
    },

    height: {
      type: [Number, String],
      default: 'none',
    },

    minScale: {
      type: Number,
      default: 1,
    },

    maxScale: {
      type: Number,
      default: 20,
    },

    scaleCount: {
      type: Number,
      default: 0,
    },

    scalePercentage: {
      type: [Number, String],
      default: 100,
    },
  },

  data: () => ({
    scale: 1,
    scaleStep: 1.2,
    currentScaleStep: 0,

    isGrab: false,
    isMovementX: false,
    isMovementY: false,

    scaledImage: null,
    scaledViewport: null,
    resizeObserver: null,

    translate: { x: 0, y: 0 },
    client: { x: 0, y: 0, oldX: 0, oldY: 0 },
  }),

  computed: {
    isMovement() {
      return this.isMovementX || this.isMovementY
    },

    size() {
      return {
        maxWidth: this.width === 'none' ? null : `${this.width}px`,
        maxHeight: this.height === 'none' ? null : `${this.height}px`,
      }
    },

    cursor() {
      if (!this.isMovement) {
        return {
          cursor: 'default',
        }
      }

      return {
        cursor: this.isGrab ? 'grabbing' : 'grab',
      }
    },

    transform() {
      return {
        transform: `translate(${this.translate.x}px, ${this.translate.y}px) scale(${this.scale})`,
      }
    },
  },

  watch: {
    scale() {
      this.setScaleMovement()
    },

    scaleCount(curr, prev) {
      const isZoomIn = curr > prev

      this.setScale({ isZoomIn })
      this.setScaleOffset({ x: 0, y: 0 })
    },

    scalePercentage(percentage) {
      this.setScalePercentage(percentage)
    },
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

    setScalePercentage(percentage) {
      if (
        percentage < this.minScale * 100 ||
        percentage > this.maxScale * 100
      ) {
        return
      }

      this.scale = percentage / 100
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
      if (scale !== undefined) {
        this.scale = scale
      } else {
        const stepDirection = isZoomIn ? this.scaleStep : 1 / this.scaleStep
        const nextScale = this.scale * stepDirection

        this.currentScaleStep =
          nextScale > this.maxScale ? this.maxScale / this.scale : stepDirection

        if (this.scale === this.minScale) {
          this.currentScaleStep = 1
        }

        if (nextScale < this.minScale) {
          this.scale = this.minScale
        } else {
          this.scale = nextScale > this.maxScale ? this.maxScale : nextScale
        }
      }

      const decimalPoint = String(this.maxScale * 100).length
      const percentages = Math.round(this.scale.toFixed(decimalPoint) * 100)

      this.$emit('scale', {
        percentages,
        scale: this.scale,
      })
    },

    wheelEvent(event) {
      const image = this.$refs['image']
      const viewport = this.$refs['viewport']
      const { deltaY, clientX, clientY } = event

      // Image centering
      const offsetTop = image.offsetTop + viewport.offsetTop
      const offsetLeft = image.offsetLeft + viewport.offsetLeft

      const isZoomIn = deltaY < 0
      const x = clientX - offsetLeft - image.width / 2
      const y = clientY - offsetTop - image.height / 2

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
      this.translate.x = x - (x - this.translate.x) * this.currentScaleStep
      this.translate.y = y - (y - this.translate.y) * this.currentScaleStep

      await this.$nextTick()

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
      const viewport = this.$refs['viewport']

      if (!viewport) {
        return
      }

      this.resizeObserver = new ResizeObserver(() => {
        this.setScale({ scale: this.minScale })
        this.setScaleOffset({ x: 0, y: 0 })
        this.setScaleMovement()
      })

      this.resizeObserver.observe(viewport)
    },

    removeResizeViewport() {
      this.resizeObserver?.disconnect()
    },

    registerEvents() {
      this.resizeViewport()
      document.addEventListener('mouseup', this.mouseEvent)
      document.addEventListener('mousemove', this.mouseEvent)
    },

    destroyEvents() {
      this.removeResizeViewport()
      document.removeEventListener('mouseup', this.mouseEvent)
      document.removeEventListener('mousemove', this.mouseEvent)
    },
  },
}
</script>

<style lang="scss">
.ui-image-viewer-viewport {
  width: 100%;
  height: 100%;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;
  position: relative;
}

.ui-image-viewer-control-item {
  max-width: 100%;
  max-height: 100%;
}
</style>
