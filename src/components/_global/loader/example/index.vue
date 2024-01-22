<template>
  <div class="ui-example-loader">
    <ui-button @click="toggleLoader">Toggle loader</ui-button>

    <!-- Сервисная обработка -->
    <div
      class="parent-loader"
      style="
        border: 1px solid blue;
        width: 100px;
        height: 100px;
        position: absolute;
        top: 100;
        left: 0;
      "
    ></div>

    <!-- Шаблонная обработка -->
    <div
      style="
        border: 1px solid white;
        width: 100px;
        height: 100px;
        position: absolute;
        top: 0;
        right: 0;
      "
    >
      <ui-loader
        :center="false"
        :size="16"
        :visible="loading"
        color="blue"
      />
    </div>

    <div
      style="
        border: 1px solid white;
        width: 100px;
        height: 100px;
        position: absolute;
        top: 100px;
        right: 0;
      "
    >
      <ui-loader
        :size="16"
        :visible="loading"
        color="red"
      />
    </div>

    <div
      style="
        border: 1px solid white;
        width: 100px;
        height: 100px;
        position: absolute;
        top: 200px;
        right: 0;
      "
    >
      <ui-loader
        :center="false"
        :size="16"
        :visible="loading"
        mask
        color="white"
      />
    </div>

    <div
      style="
        border: 1px solid white;
        width: 100px;
        height: 100px;
        position: absolute;
        top: 300px;
        right: 0;
      "
    >
      <ui-loader
        :size="16"
        :visible="loading"
        mask
        background="blue"
        color="white"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'UiExampleLoader',

  data: () => ({
    loading: false,
    loading2: false,
  }),

  watch: {
    loading(visible) {
      this.$loader({
        visible,
        size: 40,
        color: 'red',
      })
    },

    loading2(visible) {
      this.$loader({
        visible,
        size: 20,
        color: 'blue',
        target: '.parent-loader',
      })
    },
  },

  methods: {
    toggleLoader() {
      this.loading = !this.loading
      this.loading2 = !this.loading2
    },
  },
}
</script>

<style lang="scss">
.ui-example-loader {
  width: 100%;
  height: 100%;
}
</style>
