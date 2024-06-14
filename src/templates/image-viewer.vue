<template>
  <div
    style="
      height: 100%;
      display: flex;
      align-items: center;
      flex-direction: column;
      padding: 20px 80px;
    "
  >
    <div style="padding-bottom: 20px">
      <ui-button @click="upScale"> Up </ui-button>
      <input
        v-model="scalePercentage"
        type="text"
      />
      <ui-button @click="downScale"> Down </ui-button>
    </div>

    <ui-image-viewer
      :min-scale="1"
      :scale-count="scaleCount"
      :scale-percentage="scalePercentage"
      @scale="scale"
    />
    <!-- height="500" -->
    <!-- width="300" -->
  </div>
</template>

<script>
export default {
  name: 'VImageViewer',

  data: () => ({
    scaleCount: 1,
    scalePercentage: 100,
  }),

  methods: {
    scale({ percentages }) {
      this.scalePercentage = percentages
    },

    upScale() {
      this.scaleCount++
    },

    downScale() {
      this.scaleCount--
    },
  },
}
</script>

<style lang="scss"></style>
