<template>
  <!-- Содержимое фильтра -->
  <div class="ui-filter-row">
    <slot v-bind="{ row }" />
  </div>
</template>

<script>
export default {
  name: 'UiFilterRow',

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
    this.findParentContextFilter()
  },

  methods: {
    addFilter(ctx) {
      ctx.filters.push(this.row)
    },

    isParentFilterComponent(ctx) {
      return ['UiFilters', 'ui-filters'].includes(ctx.$options._componentTag)
    },

    findParentContextFilter() {
      let context = this.$parent

      while (!this.isParentFilterComponent(context)) {
        context = context.$parent

        if (this.isParentFilterComponent(context)) {
          this.addFilter(context)
        }
      }
    },
  },
}
</script>
