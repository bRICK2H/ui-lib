<template>
  <div style="height: 100%; display: flex; padding: 20px 80px">
    <ui-image-viewer
      @scale="scale"
      :minScale="1"
      :maxScale="5"
    />
    <!-- width="300" -->
    <!-- height="500" -->
  </div>
</template>

<script>
export default {
  name: 'VImageViewer',

  methods: {
    scale(value) {
      console.log('scale', value)
    },
  },
}
</script>

<style lang="scss"></style>
