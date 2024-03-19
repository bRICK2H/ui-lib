<template>
  <!-- Содержимое фильтра -->
  <div class="ui-filter-row">
    <slot v-bind="{ row }" />
  </div>
</template>

<script>
export default {
  name: 'UiFilterRow',

  inject: ['stateFilters'],

  props: {
    propName: {
      type: String,
      required: true,
    },

    defaultValue: {
      type: null,
      default: null,
    },
  },

  data() {
    return {
      row: {
        name: this.propName,
        default: this.defaultValue,
        [this.propName]: this.defaultValue,
      },
    }
  },

  created() {
    this.addFilter()
  },

  methods: {
    addFilter() {
      this.stateFilters.filters.push(this.row)
    },
  },
}
</script>
