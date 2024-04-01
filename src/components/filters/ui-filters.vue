<template>
  <section
    class="ui-filter"
    :style="filterStyles"
  >
    <!-- Шапка фильтра -->
    <header class="ui-filter-header">
      <h3>Фильтры</h3>

      <!-- Свернуть -->
      <ui-button
        variant="text-primary"
        @click="closeFilter"
      >
        <ui-icon
          name="chevron-left"
          size="16"
        />
        Свернуть
      </ui-button>
    </header>

    <!-- Содержимое фильтра -->
    <div
      ref="filter-container"
      class="ui-filter-container"
      :style="filterContentHeight"
    >
      <ui-scrollbar v-if="isVisibleContent">
        <div class="ui-filter-content">
          <slot />
        </div>
      </ui-scrollbar>
    </div>

    <!-- Подвал фильтра -->
    <footer class="ui-filter-footer">
      <!-- Сбросить все -->
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

      <!-- Применить -->
      <ui-button @click="applyFilters">Применить</ui-button>
    </footer>
  </section>
</template>

<script>
export default {
  name: 'UiFilters',

  /**
   * ? provide
   * Внедрение зависимостей для вложенных компонентов
   * - необходим для записи состояния и последующих обновлений
   * - на все последующие события, будут возвращаться актуальные данные
   *
   * @returns {Function} состояние вложенных компонентов
   */
  provide() {
    return {
      stateFilters: {
        groups: this.groups,
        filters: this.filters,
      },
    }
  },

  model: {
    prop: 'visibleModel',
  },

  props: {
    /**
     * ? Ширина фильтра
     * - все переданные значения переводятся в пиксели
     */
    width: {
      type: Number,
      default: -1,
    },

    /**
     * ? Высота фильтра
     * - все переданные значения переводятся в пиксели
     */
    height: {
      type: Number,
      default: -1,
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
    groups: [],
    filters: [],
    contentHeight: -1,
    isVisibleContent: false,
  }),

  computed: {
    isVisibleFilter() {
      return this.visibleModel ?? this.visible
    },

    filterTotals() {
      return this.filters.reduce((acc, row) => {
        const { name, value } = row
        acc[name] = value

        return acc
      }, {})
    },

    filterStyles() {
      const width = this.getFilterSize(this.width)
      const height = this.getFilterSize(this.height)

      return {
        height,
        opacity: this.isVisibleFilter ? 1 : 0,
        width: this.isVisibleFilter ? width : 0,
      }
    },

    filterContentHeight() {
      return {
        height: this.contentHeight,
      }
    },
  },

  watch: {
    isVisibleFilter: {
      immediate: true,
      async handler() {
        await this.$nextTick()

        if (!this.isVisibleFilter) {
          return
        }

        this.setContentHeight()

        // Таймаут ждет завершение анимации .2s для контента
        setTimeout(() => (this.isVisibleContent = true), 200)
      },
    },
  },

  mounted() {
    this.checkDuplicateFilterNames()
  },

  methods: {
    applyFilters() {
      this.closeFilter()
      this.$emit('apply-filters', this.filterTotals)
    },

    closeFilter() {
      const event = this.visibleModel === null ? 'close' : 'input'

      this.$emit(event, false)
    },

    clearFilters() {
      for (const row of this.filters) {
        row.value = row.default
      }

      for (const group of this.groups) {
        group.isVisibleGroup = true
      }

      this.$emit('clear-filters', this.filterTotals)
    },

    checkDuplicateFilterNames() {
      const filterNames = this.filters.reduce(
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

    setContentHeight() {
      // В случае, если у родительского элемента не задано никаких значений высоты, то никаких расчетов высоты для контента фильтров не выполняются, используется внутренняя высота контента.
      if (this.$el.parentElement.style.height === '') {
        return
      }

      const filterContent = this.$refs['filter-container']

      if (filterContent) {
        const { height } = filterContent.getBoundingClientRect()

        this.contentHeight = `${height || filterContent.offsetHeight}px`
      }
    },

    getFilterSize(size) {
      return size === -1 ? '100%' : `${size}px`
    },
  },
}
</script>

<style lang="scss">
.ui-filter {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  overflow: hidden;
  transition: 0.2s ease;
  background: $av-fixed-white;
  border-left: 1px solid $av-solid-brand-bright;
  border-right: 1px solid $av-solid-brand-bright;
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

.ui-filter-container {
  height: 100%;
  padding: 24px;
}

.ui-filter-content {
  gap: 24px;
  display: flex;
  flex-direction: column;
}
</style>
