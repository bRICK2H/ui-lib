<template>
  <!-- Содержимое фильтра -->
  <div class="ui-filter-row">
    <slot v-bind="row" />
  </div>
</template>

<script>
export default {
  name: 'UiFilterRow',

  inject: ['stateFilters'],

  props: {
    propName: {
      type: [String, Array],
      required: true,
    },

    defaultValue: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    const rows = Array.isArray(this.propName) ? this.propName : [this.propName]

    return {
      row: rows.reduce((acc, name) => {
        const defaultValue = this.defaultValue[name] ?? null

        acc[name] = {
          name,
          value: defaultValue,
          default: defaultValue,
        }

        return acc
      }, {}),
    }
  },

  created() {
    this.addFilter()
  },

  methods: {
    addFilter() {
      for (const item in this.row) {
        this.stateFilters.filters.push(this.row[item])
      }
    },
  },
}
</script>
