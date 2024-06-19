<template>
  <div
    style="
      position: absolute;
      top: 50%;
      left: 50%;
      border: 1px solid blue;
      width: calc(100% - 40px);
      height: calc(100% - 40px);
      transform: translate(-50%, -50%);
    "
  >
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
        <ui-button @click="downScale"> Down </ui-button>
        <input
          v-model="scalePercentage"
          type="text"
        />
        <ui-button @click="upScale"> Up </ui-button>
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
  </div>
</template>

<script>
export default {
  name: 'VImageViewer',

  data: () => ({
    scaleCount: 1,
    scalePercentage: 0,
  }),

  methods: {
    scale({ percentage }) {
      console.log('scale', percentage)
      this.scalePercentage = percentage
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
