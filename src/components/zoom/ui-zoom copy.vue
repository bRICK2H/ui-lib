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
      @wheel="zoom"
      @mousedown.prevent="grabStart"
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

  data: () => ({
    current: {
      x: 0,
      y: 0,
    },
    prevent: {
      x: 0,
      y: 0,
    },
    scale: 1,
    isGrab: false,
    isMovement: false,
    image: null,
    viewport: null,
    resizeObserver: null,
  }),

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
        transform: `translate(${this.current.x}px, ${this.current.y}px) scale(${this.scale})`,
      }
    },
  },

  watch: {
    scale: {
      immediate: true,
      handler: 'allowMovement',
    },
  },

  created() {
    this.throttleGrabMove = throttle(this.grabMove, 10)
  },

  mounted() {
    this.registerEvents()
  },

  destroyed() {
    this.destroyEvents()
  },

  methods: {
    zoom(event) {
      const delta = Math.abs(event.wheelDelta) === event.wheelDelta ? 1 : 0
      const xs =
        (event.clientX - this.current.x - this.viewport.left) / this.scale
      const ys =
        (event.clientY - this.current.y - this.viewport.top) / this.scale

      if (delta === 1) {
        this.scale *= 1.2

        if (
          this.viewport.left > this.image.left ||
          this.viewport.right < this.image.right
        ) {
          this.current.x = event.clientX - xs * this.scale
        }

        if (
          this.viewport.top > this.image.top ||
          this.viewport.bottom < this.image.bottom
        ) {
          this.current.y = event.clientY - ys * this.scale
        }
      } else {
        this.scale = Math.max(1, (this.scale /= 1.2))
        this.current.x = this.scale > 1 ? this.current.x / this.scale : 0
        this.current.y = this.scale > 1 ? this.current.y / this.scale : 0
      }
    },

    // zoom(event) {
    //   const delta = Math.abs(event.wheelDelta) === event.wheelDelta ? 1 : 0

    //   if (delta === 1) {
    //     const xs = (event.clientX - this.current.x) / this.scale
    //     const ys = (event.clientY - this.current.y) / this.scale

    //     this.scale *= 1.2

    //     if (
    //       this.viewport.left > this.image.left ||
    //       this.viewport.right < this.image.right
    //     ) {
    //       this.current.x = event.clientX - xs * this.scale
    //     }

    //     if (
    //       this.viewport.top > this.image.top ||
    //       this.viewport.bottom < this.image.bottom
    //     ) {
    //       this.current.y = event.clientY - ys * this.scale
    //     }
    //   } else {
    //     this.scale = this.scale > 1.2 ? (this.scale /= 1.2) : 1

    //     this.current.x = this.scale > 1 ? this.current.x / this.scale : 0
    //     this.current.y = this.scale > 1 ? this.current.y / this.scale : 0
    //   }
    // },

    // zoom(event) {
    //   const delta = Math.abs(event.wheelDelta) === event.wheelDelta ? 1 : 0
    //   const xs =
    //     (event.clientX - this.viewport.left - this.current.x) / this.scale
    //   const ys =
    //     (event.clientY - this.viewport.top - this.current.y) / this.scale

    //   if (delta === 1) {
    //     this.scale *= 1.2
    //   } else {
    //     this.scale = this.scale > 1.2 ? (this.scale /= 1.2) : 1
    //   }

    //   this.current.x = event.clientX - xs * this.scale
    //   this.current.y = event.clientY - ys * this.scale
    // },

    grabEnd() {
      this.isGrab = false
    },

    grabStart(event) {
      if (!this.isMovement) {
        return
      }

      this.prevent.x = event.clientX - this.current.x
      this.prevent.y = event.clientY - this.current.y

      this.isGrab = true
    },

    grabMove(event) {
      if (!this.isGrab || !this.isMovement) {
        return
      }

      const immovableX = Math.floor(
        (this.viewport.width - this.image.width) / 2
      )
      const immovableY = Math.floor(
        (this.viewport.height - this.image.height) / 2
      )

      /**
       * 1. Необходимо доработать момент, в случае если уходит за границы одна сторона. На текущий момент она склеивается и картинка уже не двигается
       * 2. Подумать, как можно улучшить сам зум, в частности при возврате
       * 3. Подумать над шириной, кому лучше задавать, картинке или же вьюпорту
       */

      if (
        this.viewport.left > this.image.left ||
        this.viewport.right < this.image.right
      ) {
        this.current.x = event.clientX - this.prevent.x

        // LEFT
        if (immovableX >= this.current.x) {
          this.current.x = immovableX
        }

        // RIGHT
        if (Math.abs(immovableX) <= this.current.x) {
          this.current.x = Math.abs(immovableX)
        }
      }

      if (
        this.viewport.top > this.image.top ||
        this.viewport.bottom < this.image.bottom
      ) {
        this.current.y = event.clientY - this.prevent.y

        // UP
        if (immovableY >= this.current.y) {
          this.current.y = immovableY
        }

        // DOWN
        if (Math.abs(immovableY) <= this.current.y) {
          this.current.y = Math.abs(immovableY)
        }
      }
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

      this.isMovement =
        this.viewport.top > this.image.top ||
        this.viewport.left > this.image.left ||
        this.viewport.right < this.image.right ||
        this.viewport.bottom < this.image.bottom
    },

    registerEvents() {
      document.addEventListener('mouseup', this.grabEnd)
      document.addEventListener('mousemove', this.throttleGrabMove)

      const viewport = this.$refs['viewport']

      if (!viewport) {
        return
      }

      this.resizeObserver = new ResizeObserver(this.allowMovement)
      this.resizeObserver.observe(viewport)
    },

    destroyEvents() {
      this.resizeObserver?.disconnect()
      document.removeEventListener('mouseup', this.grabEnd)
      document.removeEventListener('mousemove', this.throttleGrabMove)
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
  border: 1px solid red;

  // object-fit: cover;
  // transform-origin: center;
  // transition: transform 0.2s ease;
}
</style>
