<template>
  <section
    v-show="isVisibleFilter"
    class="ui-filter"
    :style="styles"
  >
    <header class="ui-filter-header">
      <h3>Фильтры</h3>

      <ui-button
        variant="text-primary"
        @click="close"
      >
        <ui-icon
          name="chevron-left"
          size="16"
        />
        Свернуть
      </ui-button>
    </header>

    <ui-scrollbar>
      <div class="ui-filter-content">
        <slot />
      </div>
    </ui-scrollbar>

    <footer class="ui-filter-footer">
      <ui-button
        variant="text-primary"
        @click="clearFilters"
      >
        <ui-icon
          name="cross"
          size="16"
        />
        Сбросить все
      </ui-button>

      <ui-button @click="applyFilters">Применить</ui-button>
    </footer>
  </section>
</template>

<script>
export default {
  name: 'UiFilters',

  model: {
    prop: 'visibleModel',
  },

  props: {
    /**
     * ? Ширина обертки фильтра
     * - все переданные значения переводятся в пиксели
     */
    width: {
      type: [Number, String],
      default: '',
    },

    /**
     * ? Высота обертки фильтра
     * - все переданные значения переводятся в пиксели
     */
    height: {
      type: [Number, String],
      default: '',
    },

    /**
     * ? Видимость фильтра в ручную
     * - для открытия необходимо прокинуть в атрибут visible true
     * - для закрытия необходимо обработать событие close
     */
    visible: {
      type: Boolean,
      default: false,
    },

    /**
     * ? Видимость фильтра через v-model
     * - для переключения видимости компонента необходимо только привязать boolean переменную на внешнем уровне
     */
    visibleModel: {
      type: Boolean,
      default: null,
    },
  },

  data: () => ({
    filterRows: [],
  }),

  computed: {
    isVisibleFilter() {
      return this.visibleModel ?? this.visible
    },

    styles() {
      const width = this.width === '' ? '100%' : `${this.width}px`
      const height = this.height === '' ? '100%' : `${this.height}px`

      return { width, height }
    },

    resultFilterRows() {
      return this.filterRows.reduce((acc, row) => {
        const { name } = row
        acc[name] = row[name]

        return acc
      }, {})
    },
  },

  mounted() {
    const slots = this.$slots.default

    if (!slots) {
      return
    }

    this.defineFilterRows(slots)
    this.defineFilterGroup(slots)
    this.checkDuplicateFilterNames()
  },

  methods: {
    applyFilters() {
      this.close()
      this.$emit('apply-filters', this.resultFilterRows)
    },

    clearFilters() {
      for (const row of this.filterRows) {
        row[row.name] = null
      }

      for (const group of this.filterGroups) {
        group.isVisibleGroup = true
      }

      this.$emit('clear-filters', this.resultFilterRows)
    },

    close() {
      const event = this.visibleModel === null ? 'close' : 'input'

      this.$emit(event, false)
    },

    defineFilterRows(slots) {
      const tags = ['ui-filter-row', 'UiFilterRow']

      this.filterRows = slots.reduce((acc, vnode) => {
        const { componentInstance, componentOptions } = vnode

        if (tags.includes(componentOptions.tag)) {
          acc.push(componentInstance.row)
        } else {
          const deepSlots = componentInstance.$slots.default
          const deepRows = deepSlots.reduce((acc, { componentInstance }) => {
            if (componentInstance) {
              acc.push(componentInstance.row)
            }

            return acc
          }, [])

          acc.push(...deepRows)
        }

        return acc
      }, [])
    },

    defineFilterGroup(slots) {
      const tags = ['ui-filter-group', 'UiFilterGroup']

      this.filterGroups = slots.reduce((acc, vnode) => {
        const { componentInstance, componentOptions } = vnode

        if (tags.includes(componentOptions.tag)) {
          acc.push(componentInstance)
        }

        return acc
      }, [])
    },

    checkDuplicateFilterNames() {
      const filterNames = this.filterRows.reduce(
        (acc, { name }) => {
          if (!(name in acc)) {
            acc[name] = 1
          } else {
            acc[name] += acc[name]
          }

          if (acc[name] === 2) {
            acc.result.push(name)
          }

          return acc
        },
        { result: [] }
      )

      if (filterNames.result.length > 0) {
        console.error(
          `[UiFilters]: Filter names duplicated (${filterNames.result.join(
            ', '
          )}). Change the name or the first value will be erased.`
        )
      }
    },
  },
}
</script>

<style lang="scss">
.ui-filter {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid $av-solid-brand-bright;
}

.ui-filter-header,
.ui-filter-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ui-filter-header {
  height: 64px;
  min-height: 64px;
  padding: 0 24px;
  border-bottom: 1px solid $av-solid-brand-bright;
}

.ui-filter-footer {
  padding: 24px;
  border-top: 1px solid $av-solid-brand-bright;
}

.ui-filter-content {
  gap: 24px;
  padding: 24px;
  margin: 0 0 auto 0;

  display: flex;
  flex-direction: column;
}
</style>
