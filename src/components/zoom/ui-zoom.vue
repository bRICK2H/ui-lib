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
      src="@/assets/images/map.png"
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
      matrix: [1, 0, 0, 1, 0, 0], // current view transform
      // matrix: {
      //   0: 1,
      //   1: 0,
      //   2: 0,
      //   3: 1,
      //   4: 0,
      //   5: 0,
      // },
      scale: 1, // current scale
      pos: { x: 0, y: 0 }, // current position of origin
      dirty: true,
      mouse: { x: 0, y: 0, oldX: 0, oldY: 0, button: false },
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
      if (this.dirty) {
        this.update()
      }

      this.scale *= amount
      this.pos.x = at.x - (at.x - this.pos.x) * amount
      this.pos.y = at.y - (at.y - this.pos.y) * amount
      this.dirty = true
    },

    //     getNode(name) {
    //   const node = this.$refs[name]

    //   return node?.getBoundingClientRect()
    // },

    // async allowMovement() {
    //   await this.$nextTick()

    //   this.image = this.getNode('image')
    //   this.viewport = this.getNode('viewport')

    //   if (!this.image || !this.viewport) {
    //     return
    //   }

    //   this.isMovement =
    //     this.viewport.top > this.image.top ||
    //     this.viewport.left > this.image.left ||
    //     this.viewport.right < this.image.right ||
    //     this.viewport.bottom < this.image.bottom
    // },

    mouseWheelEvent(event) {
      const imageRef = this.$refs['image']
      const viewportRef = this.$refs['viewport']
      const viewport = viewportRef.getBoundingClientRect()
      const image = imageRef.getBoundingClientRect()
      console.log({
        top: Math.max(0, image.top),
        left: Math.max(0, image.left),
      })

      // console.log(Math.max(0, image.left), Math.max(0, image.top))
      console.log(event.pageX, viewport.left, imageRef.width / 2)

      const x = event.pageX - viewport.left - imageRef.width / 2
      const y = event.pageY - viewport.top - imageRef.height / 2
      console.log(x, y)

      if (event.deltaY < 0) {
        this.scaleAt({ x, y }, 1.1)
        this.applyTo()
      } else {
        this.scaleAt({ x, y }, 1 / 1.1)
        this.applyTo()
      }
    },

    mouseEvent(event) {
      // if (event.type === 'mousedown') {
      //   this.mouse.button = true
      // }

      // if (event.type === 'mouseup' || event.type === 'mouseout') {
      //   this.mouse.button = false
      // }

      // this.mouse.oldX = this.mouse.x
      // this.mouse.oldY = this.mouse.y
      // this.mouse.x = event.pageX
      // this.mouse.y = event.pageY

      // if (this.mouse.button) {
      //   const image = this.$refs['image']

      //   // pan
      //   this.view.pan({
      //     x: this.mouse.x - this.mouse.oldX,
      //     y: this.mouse.y - this.mouse.oldY,
      //   })
      //   this.applyTo(image)
      // }

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
  position: absolute;
  top: 0px;
  left: 0px;
  border: 1px solid red;
}

// .canvas {
//   width: 100%;
//   height: 100%;
//   object-fit: contain;
// }
</style>
