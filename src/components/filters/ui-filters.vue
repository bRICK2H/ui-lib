<template>
  <section
    ref="filter"
    class="ui-filter"
    :style="[
      filterStyles,
      {
        '--header-height': `${headerHeight}px`,
        '--footer-height': `${footerHeight}px`,
      },
    ]"
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
    <ui-scrollbar :height="filterContentHeight">
      <div class="ui-filter-content">
        <slot />
      </div>
    </ui-scrollbar>

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
      <ui-button @click="applyFilters"> Применить </ui-button>
    </footer>
  </section>
</template>

<script>
import { throttle } from 'lodash'

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
     * ? Высота верхнего меню фильтра
     * - все переданные значения переводятся в пиксели
     */
    headerHeight: {
      type: Number,
      default: 64,
    },

    /**
     * ? Высота нижнего меню фильтра
     * - все переданные значения переводятся в пиксели
     */
    footerHeight: {
      type: Number,
      default: 64,
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
    maxHeight: 0,
    offsetTop: 0,
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
        maxHeight: this.maxHeight === 0 ? 'auto' : `${this.maxHeight}px`,
        opacity: this.isVisibleFilter ? 1 : 0,
        width: this.isVisibleFilter ? width : 0,
        minWidth: this.isVisibleFilter ? width : 0,
      }
    },

    filterContentHeight() {
      return (
        (this.height > 0 ? this.height : this.maxHeight) -
        (this.headerHeight + this.footerHeight)
      )
    },
  },

  watch: {
    isVisibleFilter: {
      immediate: true,
      async handler() {
        await this.$nextTick()

        if (!this.isVisibleFilter) {
          window.removeEventListener('resize', this.setMaxFilterHeight)
          return
        }

        const width = window.innerWidth

        this.setMaxFilterHeight()
        window.addEventListener('resize', (event) => {
          if (width !== event.target.innerWidth) {
            return
          }

          this.setMaxFilterHeight()
        })
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

    setMaxFilterHeight: throttle(function () {
      if (this.height > 0) {
        return
      }

      const { offsetTop } = this.$refs['filter']

      this.offsetTop = offsetTop
      this.maxHeight = window.innerHeight - offsetTop
    }, 200),

    getFilterSize(size) {
      return size === -1 ? '100%' : `${size}px`
    },
  },
}
</script>

<style lang="scss">
$headerHeight: var(--header-height);
$footerHeight: var(--footer-height);

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
  height: $headerHeight;
  min-height: $headerHeight;
  padding: 0 24px;
  border-bottom: 1px solid $av-solid-brand-bright;
}

.ui-filter-footer {
  height: $footerHeight;
  padding: 24px;
  border-top: 1px solid $av-solid-brand-bright;
}

.ui-filter-content {
  gap: 24px;

  display: flex;
  padding: 24px;
  flex-direction: column;
}
</style>
