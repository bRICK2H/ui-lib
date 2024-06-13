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

  model: {
    prop: 'outerScale',
  },

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

    outerScale: {
      type: Number,
      default: 1,
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
    scale() {
      this.setMovement()
    },

    outerScale(curr, prev) {
      console.error(curr, prev)
      const scaleStepDirection =
        curr > prev ? this.scaleStep : 1 / this.scaleStep

      const getScale = (scale) => {
        if (scale < this.minScale) {
          return this.minScale
        }

        console.log(scale, this.maxScale)

        if (scale > this.maxScale) {
          return this.maxScale
        }

        return scale
      }

      const outerScale = getScale(curr)

      console.log('getScale: ', getScale(curr))

      // this.scale = getScale(this.outerScale, scaleStepDirection)
      // this.translate.x = 0
      // this.translate.y = 0
      // console.error(this.scale)
      this.$emit('input', getScale(curr))
      this.offsetScaleImage({ x: 0, y: 0 }, scaleStepDirection)
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

      const decimalPoint = String(this.maxScale * 100).length
      const percentages = `${Math.round(
        this.scale.toFixed(decimalPoint) * 100
      )}%`

      this.$emit('scale', {
        percentages,
        scale: this.scale,
      })
    },

    wheelEvent(event) {
      console.log('wheelEvent')
      const image = this.$refs['image']
      const viewport = this.$refs['viewport']
      const { deltaY, clientX, clientY } = event

      // Image centering
      const offsetTop = image.offsetTop + viewport.offsetTop
      const offsetLeft = image.offsetLeft + viewport.offsetLeft
      const scaleStepDirection =
        deltaY < 0 ? this.scaleStep : 1 / this.scaleStep

      const x = clientX - offsetLeft - image.width / 2
      const y = clientY - offsetTop - image.height / 2

      this.offsetScaleImage({ x, y }, scaleStepDirection)
    },

    mouseEvent(event) {
      console.log('mouseEvent')
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

    async offsetScaleImage({ x, y }, stepDirection) {
      console.log('offsetScaleImage')
      const nextScale = this.scale * stepDirection

      if (nextScale < this.minScale) {
        this.scale = this.minScale
        this.translate.x = 0
        this.translate.y = 0

        return
      }

      const scaleStepDirection =
        nextScale > this.maxScale ? this.maxScale / this.scale : stepDirection
      this.scale = nextScale > this.maxScale ? this.maxScale : nextScale

      this.translate.x = x - (x - this.translate.x) * scaleStepDirection
      this.translate.y = y - (y - this.translate.y) * scaleStepDirection

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

      // Наверное нужно юзать обычный ресайз

      // this.resizeObserver = new ResizeObserver(() => {
      //   this.setMovement()
      //   this.offsetScaleImage({ x: 0, y: 0 }, 0)
      // })
      // this.resizeObserver.observe(viewport)
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
