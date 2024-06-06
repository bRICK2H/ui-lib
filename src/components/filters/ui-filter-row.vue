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
    /**
     * Название свойства (можно передавать строку или группу строк)
     */
    propName: {
      type: [String, Array],
      required: true,
    },

    /**
     * Значение по умолчанию (из компонента по умолчанию будет undefined)
     */
    defaultValue: {
      type: Object,
      default: () => ({}),
    },

    /**
     * Предустановленное значение (значение, которые было определено внешними факторами)
     */
    presetValue: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    const rows = Array.isArray(this.propName) ? this.propName : [this.propName]

    return {
      row: rows.reduce((acc, name) => {
        const defaultValue = this.defaultValue[name]
        const presetValue = this.presetValue[name] ?? defaultValue

        acc[name] = {
          name,
          value: presetValue,
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
