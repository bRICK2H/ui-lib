<template>
  <div
    ref="viewport"
    class="ui-zoom-viewport"
  >
    <img
      :alt="alt"
      ref="image"
      :style="[size, cursor, transform]"
      class="ui-zoom-image"
      src="@/assets/images/roja.png"
      @wheel="zoom"
      @mousemove.prevent="grabMove"
      @mousedown.prevent="grabStart"
    />
  </div>
</template>

<script>
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
    x: 0,
    y: 0,
    prevent: {
      x: 0,
      y: 0,
    },
    scale: 1,
    isGrab: false,
    isMovement: false,
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
        transform: `translate(${this.x}px, ${this.y}px) scale(${this.scale})`,
      }
    },
  },

  watch: {
    scale() {
      this.allowMovement()
    },
  },

  mounted() {
    const observer = new ResizeObserver(this.allowMovement)

    this.resizeObserver = observer.observe(this.$refs['viewport'])
    document.addEventListener('mouseup', this.grabEnd)
  },

  destroyed() {
    this.resizeObserver?.disconnect()
    document.removeEventListener('mouseup', this.grabEnd)
  },

  methods: {
    zoom(event) {
      const delta = Math.abs(event.wheelDelta) === event.wheelDelta ? 1 : 0

      if (delta === 1) {
        this.scale *= 1.2
      } else {
        this.scale = this.scale > 1.2 ? (this.scale /= 1.2) : 1
      }

      // this.x = event.clientX
      // this.y = event.clientY
    },

    async allowMovement() {
      await this.$nextTick()

      const imageEl = this.$refs['image']
      const viewportEl = this.$refs['viewport']

      if (!imageEl || !viewportEl) {
        return
      }

      const image = imageEl.getBoundingClientRect()
      const viewport = viewportEl.getBoundingClientRect()

      this.isMovement = viewport.y > image.y || viewport.x > image.x
    },

    grabMove(event) {
      if (!this.isGrab || !this.isMovement) {
        return
      }

      // this.x = event.clientX - this.prevent.x
      this.y = event.clientY - this.prevent.y
    },

    grabStart(event) {
      if (!this.isMovement) {
        return
      }

      this.prevent.x = event.clientX
      this.prevent.y = event.clientY

      this.isGrab = true
    },

    grabEnd() {
      this.isGrab = false
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
  // overflow: hidden;

  border: 1px solid blue;
}

.ui-zoom-image {
  max-width: 100%;
  max-height: 100%;
  border: 1px solid red;

  // transform-origin: 0 0;
}
</style>
