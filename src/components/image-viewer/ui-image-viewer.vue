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
    src: {
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
  },

  data: function () {
    return {
      scaleStep: 1.2,
      scale: this.minScale,

      isGrab: false,
      isMovementX: false,
      isMovementY: false,

      scaledImage: null,
      scaledViewport: null,
      resizeObserver: null,

      translate: { x: 0, y: 0 },
      client: { x: 0, y: 0, oldX: 0, oldY: 0 },
    }
  },

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
    scale: {
      immediate: true,
      handler: 'setMovement',
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

    async setMovement() {
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

      this.$emit('scale', {
        scale: this.scale,
        percentages: `${Math.round(this.scale) * 100}%`,
      })
    },

    wheelEvent(event) {
      const image = this.$refs['image']
      const viewport = this.$refs['viewport']
      const { deltaY, clientX, clientY } = event

      // Image centering
      const offsetTop = image.offsetTop + viewport.offsetTop
      const offsetLeft = image.offsetLeft + viewport.offsetLeft
      const offsetScale = deltaY < 0 ? this.scaleStep : 1 / this.scaleStep

      const x = clientX - offsetLeft - image.width / 2
      const y = clientY - offsetTop - image.height / 2

      this.offsetScaleImage({ x, y }, offsetScale)
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
        this.moveImage()
      }
    },

    async offsetScaleImage({ x, y }, offsetScale) {
      const nextScale = this.scale * offsetScale

      if (nextScale < this.minScale) {
        this.scale = this.minScale
        this.translate.x = 0
        this.translate.y = 0

        return
      }

      if (nextScale > this.maxScale) {
        this.scale = this.maxScale
        /**
         * 1. при maxScale нужно приравнять это же значение и сделать нужный translate
         * 2. Определить пропс outerScale и оформить внешние расчеты scale
         */
        return
      }

      this.scale = nextScale
      this.translate.x = x - (x - this.translate.x) * offsetScale
      this.translate.y = y - (y - this.translate.y) * offsetScale

      await this.$nextTick()

      const image = this.getNode('image')
      const viewport = this.getNode('viewport')

      const topDiff = image.top - viewport.top
      const leftDiff = image.left - viewport.left
      const rightDiff = image.right - viewport.right
      const bottomDiff = image.bottom - viewport.bottom

      // Vertical correction
      if (viewport.width > image.width) {
        this.translate.x = 0
      } else {
        if (leftDiff > 0) {
          this.translate.x -= leftDiff
        }

        if (rightDiff < 0) {
          this.translate.x -= rightDiff
        }
      }

      // Horizontal correction
      if (viewport.height > image.height) {
        this.translate.y = 0
      } else {
        if (topDiff > 0) {
          this.translate.y -= topDiff
        }

        if (bottomDiff < 0) {
          this.translate.y -= bottomDiff
        }
      }
    },

    moveImage() {
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

    registerEvents() {
      document.addEventListener('mouseup', this.mouseEvent)
      document.addEventListener('mousemove', this.mouseEvent)

      const viewport = this.$refs['viewport']

      if (!viewport) {
        return
      }

      this.resizeObserver = new ResizeObserver(() =>
        this.offsetScaleImage({ x: 0, y: 0 }, 0)
      )
      this.resizeObserver.observe(viewport)
    },

    destroyEvents() {
      this.resizeObserver?.disconnect()
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
