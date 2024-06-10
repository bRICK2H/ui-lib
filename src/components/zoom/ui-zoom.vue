<template>
  <div
    ref="viewport"
    class="ui-zoom-viewport"
  >
    <img
      ref="image"
      :alt="alt"
      :style="[size, cursor, transform]"
      class="ui-zoom-image"
      src="@/assets/images/roja.png"
      @mousedown.prevent="mouseEvent"
      @wheel.prevent="mouseWheelEvent"
    />

    <!-- <canvas
      ref="canvas"
      width="500"
      height="500"
      class="canvas"
      @wheel="mouseWheelEvent"
      @mousedown.prevent="mouseEvent"
    /> -->
  </div>
</template>

<script>
import { throttle } from 'lodash'

export default {
  name: 'UiZoom',

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
  },

  data: function () {
    return {
      dirty: true,
      movement: false,
      scale: 1, // current scale
      minScale: 1, // min scale
      matrix: [1, 0, 0, 1, 0, 0], // current view transform
      pos: { x: 0, y: 0 }, // current position of origin
      mouse: { x: 0, y: 0, oldX: 0, oldY: 0, grab: false },
    }
  },

  computed: {
    size() {
      return {
        maxWidth: this.width === 'none' ? null : `${this.width}px`,
        maxHeight: this.height === 'none' ? null : `${this.height}px`,
      }
    },

    cursor() {
      if (!this.movement) {
        return {
          cursor: 'default',
        }
      }

      return {
        cursor: this.mouse.grab ? 'grabbing' : 'grab',
      }
    },

    transform() {
      return {
        transform: `matrix(
          ${this.matrix[0]},
          ${this.matrix[1]},
          ${this.matrix[2]},
          ${this.matrix[3]},
          ${this.matrix[4]},
          ${this.matrix[5]}
        )`,
      }
    },
  },

  // watch: {
  //   scale: {
  //     immediate: true,
  //     handler: 'allowMovement',
  //   },
  // },

  created() {
    // this.throttleGrabMove = throttle(this.grabMove, 10)
  },

  mounted() {
    this.registerEvents()

    // const imageUrl = new URL('@/assets/images/map.png', import.meta.url)
    // const image = new Image()

    // image.onload = () => {
    //   const canvas = this.$refs['canvas']
    //   const context = canvas.getContext('2d')

    //   canvas.width = canvas.offsetWidth
    //   canvas.height = canvas.offsetHeight

    //   context.drawImage(image, 0, 0, canvas.width, canvas.height)
    // }

    // image.src = imageUrl.href
  },

  destroyed() {
    this.destroyEvents()
  },

  methods: {
    applyTo() {
      if (!this.dirty) {
        return
      }

      this.update()
      this.allowMovement()
    },

    update() {
      this.dirty = false
      this.matrix = [this.scale, 0, 0, this.scale, this.pos.x, this.pos.y]
    },

    pan(amount) {
      if (this.dirty) {
        this.update()
      }

      this.pos.x += amount.x
      this.pos.y += amount.y
      this.dirty = true
    },

    scaleAt(at, amount) {
      // at in screen coords
      const scale = this.scale * amount

      if (this.dirty) {
        this.update()
      }

      const isMinScale = scale < this.minScale

      this.dirty = true
      this.scale = isMinScale ? 1 : scale
      this.pos.x = isMinScale ? 0 : at.x - (at.x - this.pos.x) * amount
      this.pos.y = isMinScale ? 0 : at.y - (at.y - this.pos.y) * amount
    },

    getNode(name) {
      const node = this.$refs[name]

      return node?.getBoundingClientRect()
    },

    async allowMovement() {
      await this.$nextTick()

      this.image = this.getNode('image')
      this.viewport = this.getNode('viewport')

      if (!this.image || !this.viewport) {
        return
      }

      this.movement =
        this.viewport.top > this.image.top ||
        this.viewport.left > this.image.left ||
        this.viewport.right < this.image.right ||
        this.viewport.bottom < this.image.bottom
    },

    mouseWheelEvent(event) {
      const image = this.$refs['image']
      const viewport = this.$refs['viewport']

      const offsetTop = image.offsetTop + viewport.offsetTop
      const offsetLeft = image.offsetLeft + viewport.offsetLeft

      const x = event.clientX - offsetLeft - image.width / 2
      const y = event.clientY - offsetTop - image.height / 2

      this.scaleAt({ x, y }, event.deltaY < 0 ? 1.2 : 1 / 1.2)
      this.applyTo()
    },

    mouseEvent(event) {
      if (event.type === 'mousedown') {
        this.mouse.grab = true
      }

      if (event.type === 'mouseup' || event.type === 'mouseout') {
        this.mouse.grab = false
      }

      this.mouse.oldX = this.mouse.x
      this.mouse.oldY = this.mouse.y
      this.mouse.x = event.clientX
      this.mouse.y = event.clientY

      if (this.mouse.grab && this.movement) {
        const image = this.$refs['image']
        const viewportRef = this.$refs['viewport']
        const viewport = viewportRef.getBoundingClientRect()

        this.pan({
          x: this.mouse.x - this.mouse.oldX,
          y: this.mouse.y - this.mouse.oldY,
        })
        this.applyTo()
      }

      event.preventDefault()
    },

    registerEvents() {
      document.addEventListener('mouseup', this.mouseEvent)
      document.addEventListener('mousemove', this.mouseEvent)

      // const viewport = this.$refs['viewport']

      // if (!viewport) {
      //   return
      // }

      // this.resizeObserver = new ResizeObserver(this.allowMovement)
      // this.resizeObserver.observe(viewport)
    },

    destroyEvents() {
      // this.resizeObserver?.disconnect()
      document.removeEventListener('mouseup', this.mouseEvent)
      document.removeEventListener('mousemove', this.mouseEvent)
    },
  },
}
</script>

<style lang="scss">
.ui-zoom-viewport {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;

  border: 1px solid blue;

  &:after {
    content: '';
    width: 10px;
    height: 10px;
    position: fixed;
    z-index: 10000;
    background: red;
    border-radius: 50%;
  }
}

.ui-zoom-image {
  max-width: 100%;
  max-height: 100%;
  // position: absolute;
  // top: 0;
  // left: 0;
  border: 1px solid red;
}

// .canvas {
//   width: 100%;
//   height: 100%;
//   object-fit: contain;
// }
</style>
