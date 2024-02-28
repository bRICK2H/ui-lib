<template>
  <div style="height: 100%; display: flex">
    <div
      style="min-width: 100px; border: 1px solid red; margin-right: 20px"
    ></div>
    <div>
      <div style="margin-bottom: 16px">
        <ui-button
          right-indent
          @click="tableTemplate = 1"
          >Table 1</ui-button
        >
        <ui-button
          right-indent
          @click="tableTemplate = 2"
          >Table 2</ui-button
        >
        <ui-button @click="tableTemplate = 3">Table 3</ui-button>
      </div>

      <!-- <keep-alive> -->
      <component :is="TableComponent" />
      <!-- </keep-alive> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'VTableContainer',

  components: {
    VTable1: () => import('./table-1.vue'),
    VTable2: () => import('./table-2.vue'),
    VTable3: () => import('./table-3.vue'),
  },

  data: () => ({
    tableTemplate: 1,
  }),

  computed: {
    TableComponent() {
      return `VTable${this.tableTemplate}`
    },
  },
}
</script>

<style lang="scss"></style>
