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
      scale: 1, // current scale
      minScale: 1, // min scale
      scaleStep: 1.1,
      translateX: 0,
      translateY: 0,
      isMovementX: false,
      isMovementY: false,
      pos: { x: 0, y: 0 }, // current position of origin
      mouse: { x: 0, y: 0, oldX: 0, oldY: 0, grab: false },
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
        cursor: this.mouse.grab ? 'grabbing' : 'grab',
      }
    },

    transform() {
      return {
        transform: `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`,
      }
    },
  },

  watch: {
    scale: {
      immediate: true,
      handler: 'setMovement',
    },
  },

  created() {
    // this.throttleGrabMove = throttle(this.grabMove, 10)
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

      this.image = image
      this.viewport = viewport
      this.isMovementY =
        viewport.top > image.top || viewport.bottom < image.bottom
      this.isMovementX =
        viewport.left > image.left || viewport.right < image.right
    },

    // async scaleAt({ x, y }, offsetScale) {
    //   const imageRef = this.$refs['image']
    //   const image = imageRef.getBoundingClientRect()
    //   const scale = this.scale * offsetScale
    //   const isMinScale = scale < this.minScale

    //   this.scale = isMinScale ? 1 : scale

    //   await this.$nextTick()

    //   const immovableX = Math.floor((this.viewport.width - image.width) / 2)
    //   const immovableY = Math.floor((this.viewport.height - image.height) / 2)

    //   // this.translateX = isMinScale ? 0 : x - (x - this.translateX) * offsetScale
    //   // this.translateY = isMinScale ? 0 : y - (y - this.translateY) * offsetScale

    //   // if (offsetScale < this.minScale) {
    //   //   console.log('here')
    //   //   this.translateX = 0
    //   //   this.translateY = 0
    //   // }

    //   if (this.isMovementX) {
    //     this.translateX = x - (x - this.translateX) * offsetScale

    //     if (offsetScale < this.minScale) {
    //       console.log({ immovableX, translateX: this.translateX })

    //       // // LEFT
    //       // if (immovableX >= this.translateX) {
    //       //   console.log('left')
    //       //   // this.translateX = immovableX
    //       // }
    //       // // RIGHT
    //       // if (Math.abs(immovableX) <= this.translateX) {
    //       //   console.log('right')
    //       //   // this.translateX = Math.abs(immovableX)
    //       // }
    //     }
    //   } else {
    //     // this.translateX = 0
    //   }

    //   if (this.isMovementY) {
    //     this.translateY = y - (y - this.translateY) * offsetScale

    //     if (offsetScale < this.minScale) {
    //       console.log({ immovableY, translateY: this.translateY })
    //       // // UP
    //       if (immovableY >= this.translateY) {
    //         console.log('up')
    //         // this.translateY = immovableY
    //       }
    //       // // DOWN
    //       // if (Math.abs(immovableY) <= this.translateY) {
    //       //   console.log('down')
    //       //   // this.translateY = Math.abs(immovableY)
    //       // }
    //     }
    //   } else {
    //     // this.translateY = 0
    //   }
    // },

    async scaleAt({ x, y }, offsetScale) {
      const nextScale = this.scale * offsetScale
      const isMinScale = nextScale < this.minScale

      this.scale = isMinScale ? 1 : nextScale

      this.translateX = x - (x - this.translateX) * offsetScale
      this.translateY = y - (y - this.translateY) * offsetScale

      // await this.$nextTick()

      const image = this.getNode('image')
      const viewport = this.getNode('viewport')

      if (viewport.left < image.left || viewport.right > image.right) {
        this.translateX = 0
      }

      if (viewport.top < image.top || viewport.bottom > image.bottom) {
        this.translateY = 0
      }
    },

    mouseWheelEvent(event) {
      const image = this.$refs['image']
      const viewport = this.$refs['viewport']

      const offsetTop = image.offsetTop + viewport.offsetTop
      const offsetLeft = image.offsetLeft + viewport.offsetLeft
      const offsetScale =
        event.deltaY < 0 ? this.scaleStep : this.minScale / this.scaleStep

      const x = event.clientX - offsetLeft - image.width / 2
      const y = event.clientY - offsetTop - image.height / 2

      this.scaleAt({ x, y }, offsetScale)
    },

    // mouseWheelEvent(event) {
    //   const image = this.$refs['image']
    //   const viewport = this.$refs['viewport']

    //   const offsetTop = image.offsetTop + viewport.offsetTop
    //   const offsetLeft = image.offsetLeft + viewport.offsetLeft
    //   const offsetScale =
    //     event.deltaY < 0 ? this.scaleStep : this.minScale / this.scaleStep

    //   const x = event.clientX - offsetLeft - image.width / 2
    //   const y = event.clientY - offsetTop - image.height / 2

    //   this.scaleAt({ x, y }, offsetScale)
    // },

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

      if (this.mouse.grab && this.isMovement) {
        const immovableX = Math.floor(
          (this.viewport.width - this.image.width) / 2
        )
        const immovableY = Math.floor(
          (this.viewport.height - this.image.height) / 2
        )

        if (this.isMovementX) {
          this.translateX += this.mouse.x - this.mouse.oldX

          // LEFT
          if (immovableX >= this.translateX) {
            this.translateX = immovableX
          }

          // RIGHT
          if (Math.abs(immovableX) <= this.translateX) {
            this.translateX = Math.abs(immovableX)
          }
        }

        if (this.isMovementY) {
          this.translateY += this.mouse.y - this.mouse.oldY

          // UP
          if (immovableY >= this.translateY) {
            this.translateY = immovableY
          }

          // DOWN
          if (Math.abs(immovableY) <= this.translateY) {
            this.translateY = Math.abs(immovableY)
          }
        }
      }

      // event.preventDefault()
    },

    // mouseEvent(event) {
    //   if (event.type === 'mousedown') {
    //     this.mouse.grab = true
    //   }

    //   if (event.type === 'mouseup' || event.type === 'mouseout') {
    //     this.mouse.grab = false
    //   }

    //   this.mouse.oldX = this.mouse.x
    //   this.mouse.oldY = this.mouse.y
    //   this.mouse.x = event.clientX
    //   this.mouse.y = event.clientY

    //   if (this.mouse.grab && this.isMovement) {
    //     const imageRef = this.$refs['image']
    //     const viewportRef = this.$refs['viewport']
    //     const image = imageRef.getBoundingClientRect()
    //     const viewport = viewportRef.getBoundingClientRect()
    //     console.log({
    //       translateX: this.translateX,
    //       translateY: this.translateY,
    //     })

    //     console.log({
    //       thisTop: this.image.top,
    //       imageTop: image.top,
    //     })

    //     this.translateX += this.mouse.x - this.mouse.oldX
    //     this.translateY += this.mouse.y - this.mouse.oldY
    //   }

    //   // event.preventDefault()
    // },

    registerEvents() {
      document.addEventListener('mouseup', this.mouseEvent)
      document.addEventListener('mousemove', this.mouseEvent)

      // const viewport = this.$refs['viewport']

      // if (!viewport) {
      //   return
      // }

      // this.resizeObserver = new ResizeObserver(this.setMovement)
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
}

.ui-zoom-image {
  max-width: 100%;
  max-height: 100%;
  transition: 0.2s;
  border: 1px solid red;
}

// .canvas {
//   width: 100%;
//   height: 100%;
//   object-fit: contain;
// }
</style>
