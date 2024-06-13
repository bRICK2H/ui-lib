<template>
  <div style="height: 100%; display: flex; padding: 20px 80px">
    <ui-button @click="upScale"> Up </ui-button>
    <ui-button @click="downScale"> Down </ui-button>
    {{ outerScale }}

    <ui-image-viewer
      v-model="outerScale"
      :min-scale="1"
      :max-scale="5"
      @scale="scale"
    />
    <!-- width="300" -->
    <!-- height="500" -->
  </div>
</template>

<script>
export default {
  name: 'VImageViewer',

  data: () => ({
    outerScale: 1,
  }),

  methods: {
    scale(value) {
      console.warn('scale', value, this.outerScale)
    },

    upScale() {
      this.outerScale++
    },
    downScale() {
      this.outerScale--
    },
  },
}
</script>

<style lang="scss"></style>
