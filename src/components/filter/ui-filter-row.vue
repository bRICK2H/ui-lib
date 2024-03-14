<template>
  <div class="ui-filter-row">
    <slot v-bind="{ row }" />
  </div>
</template>

<script>
export default {
  name: 'UiFilterRow',

  props: {
    fieldName: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      row: { name: this.fieldName, [this.fieldName]: null },
    }
  },
}
</script>

<style lang="scss"></style>
