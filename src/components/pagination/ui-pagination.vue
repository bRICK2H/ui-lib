<template>
  <div class="vpc-pagination">
    <!-- Items -->
    <div
      class="vpc-pagination-items"
      :style="{
        '--button-size': `${buttonSize}px`,
        '--visible-list-size': `${pages * buttonSize + pages}px`,
      }"
    >
      <div
        v-if="hasPages && showPages"
        :class="[
          'vpc-pagination-action-item',
          { disabled: disabled || page === 1 },
        ]"
        @click="prevPage"
      >
        <ui-icon
          name="chevron-left"
          size="12"
        />
      </div>

      <div
        v-if="showPages"
        class="vpc-pagination-list"
      >
        <div
          v-for="item of paginationPages"
          :key="item.value"
          :class="[
            'vpc-pagination-action-item',
            {
              disabled,
              active: item.value === page,
            },
          ]"
          @click="changePage(item.value)"
        >
          <!-- <vpc-select-pagination
            v-if="Array.isArray(item)"
            :limit="limit"
            :total="total"
            :width="`${buttonSize}px`"
            @changes="changePage"
          >
            <ui-icon
              size="12"
              name="dots-h"
              class="vpc-pagination-icon-select"
            />
          </vpc-select-pagination> -->

          <span v-if="Array.isArray(item)">...</span>
          <span v-else>
            {{ item.value }}
          </span>
        </div>
      </div>

      <div
        v-if="hasPages && showPages"
        :class="[
          'vpc-pagination-action-item',
          { disabled: disabled || page === fullSizePages },
        ]"
        @click="nextPage"
      >
        <ui-icon
          name="chevron-right"
          size="12"
        />
      </div>
    </div>

    <!-- Right side -->
    <div
      v-if="isRightSide"
      class="vpc-pagination-right-side"
    >
      <!-- Limit -->
      <div class="vpc-pagination-right-side-limit">
        <p class="vpc-pagination-right-side--text">Показывать строк:</p>

        <!-- <vpc-select-pagination
          :limit="limit"
          :total="total"
          :disabled="disabled"
          @change="changeLimit"
        /> -->
      </div>

      <!-- Total -->
      <p class="vpc-pagination-right-side--text">
        {{ paginationInfo }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UiPagination',
  model: {
    prop: 'page',
    event: 'change-page',
  },
  props: {
    /**
     * Current page number
     * Текущий номер страницы
     */
    page: {
      type: Number,
      default: 1,
    },

    /**
     * Number of visible pages
     * Количество видимых страниц
     */
    pages: {
      type: Number,
      default: 10,
      validator(value) {
        return value >= 5
      },
    },

    /**
     * Number of pages displayed
     * Количество элементов на каждой страницы
     */
    limit: {
      type: Number,
      default: 20,
    },

    /**
     * Total number of elements
     * Общее количество элементов
     */
    total: {
      type: Number,
      default: 0,
    },

    /**
     * Disabling page navigation
     * Отключение постраничной навигации
     */
    disabled: {
      type: Boolean,
      default: false,
    },

    /**
     * Show page list
     * Показать список страниц
     */
    showPages: {
      type: Boolean,
      default: true,
    },

    /**
     * Button sizes for height and width
     * Размеры кнопок по высоте и ширине
     */
    buttonSize: {
      type: Number,
      default: 32,
    },

    /**
     * Show right panel with line limit
     * Показывать правую панель с лимитом строк
     */
    isRightSide: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      params: {
        page: this.page,
        limit: this.limit,
      },
    }
  },

  computed: {
    hasPages() {
      return this.paginationPages.length > 0
    },

    paginationInfo() {
      return this.showPages
        ? `${this.page} - ${this.limit} из ${this.total}`
        : ` ${this.limit} из ${this.total}`
    },

    paginationTriggerUpdate() {
      return `${this.page} ${this.pages} ${this.limit} ${this.total}`
    },

    maxSizeLimit() {
      return 100
    },

    fullSizePages() {
      return Math.ceil(this.total / this.limit)
    },

    paginationPages() {
      const getPages = () => {
        return new Array(this.fullSizePages)
          .fill()
          .map((_, i) => ({ value: i + 1 }))
      }

      let pages = getPages()
      const indexPage = pages.findIndex(({ value }) => value === this.page)
      const startIndex = 1
      const slotValueSelect = 1
      const ignoredPageValue = 1
      const offsetValue = this.pages < 10 ? 2 : 3
      const startEmptySpace = indexPage - ignoredPageValue
      const endEmptySpace = pages.length - this.page - ignoredPageValue
      const hiddenSizePages = pages.length - this.pages
      const hiddenSizePagesWithSlot = hiddenSizePages + slotValueSelect
      const endIndex = pages.length - hiddenSizePagesWithSlot - ignoredPageValue
      const sampleValue = offsetValue - (endIndex - this.page)

      if (pages.length < this.pages || hiddenSizePages <= 1) {
        return pages
      }

      // Условие для страниц с максимальным длинной < 8
      if (this.pages < 8) {
        const index = endEmptySpace > startEmptySpace ? endIndex : startIndex

        pages.splice(index, 0, pages.splice(index, hiddenSizePagesWithSlot))

        return pages
      }

      // Сформировать полную группировку в конце
      pages.splice(endIndex, 0, pages.splice(endIndex, hiddenSizePagesWithSlot))

      if (sampleValue > 0) {
        if (hiddenSizePagesWithSlot - sampleValue > 1) {
          // Распределение правую группу со смещением
          pages.splice(endIndex, 0, ...pages[endIndex].splice(0, sampleValue))

          // Сформировать часть группы слева
          pages.splice(startIndex, 0, pages.splice(startIndex, sampleValue + 1))
        } else {
          pages = getPages()

          // Сформировать полную группировку в начале
          pages.splice(
            startIndex,
            0,
            pages.splice(startIndex, hiddenSizePagesWithSlot)
          )
        }
      }

      console.log(pages)
      return pages
    },
  },

  watch: {
    page() {
      if (this.params.page !== this.page) {
        this.params.page = this.page
      }
    },

    params: {
      deep: true,
      handler() {
        if (this.disabled) {
          return
        }

        this.$emit('changes', this.params)
      },
    },
  },

  methods: {
    prevPage() {
      if (this.disabled || this.page === 1) {
        return
      }

      this.changePage(this.page - 1)
    },

    nextPage() {
      if (this.disabled || this.page === this.fullSizePages) {
        return
      }

      this.changePage(this.page + 1)
    },

    changePage(page) {
      console.log('changePage', page)
      this.params.page = this.validatePage(page)
    },

    changeLimit(limit) {
      const currentPage = this.params.page
      const currentSizePage = Math.ceil(this.total / limit)

      if (currentPage && currentPage > currentSizePage) {
        this.changePage(currentSizePage)
      }

      this.params.limit = this.validateLimit(limit)
    },

    validatePage(page) {
      if (page === '') {
        return this.page
      }

      if (page <= 0) {
        return 1
      }

      if (page > this.fullSizePages) {
        return this.fullSizePages
      }

      if (!Number.isInteger(page)) {
        return Math.floor(page)
      }

      return page
    },

    validateLimit(limit) {
      if (limit === '') {
        return this.limit
      }

      if (limit <= 0) {
        return 1
      }

      if (limit > this.maxSizeLimit) {
        return this.maxSizeLimit
      }

      if (!Number.isInteger(limit)) {
        return Math.floor(limit)
      }

      return limit
    },
  },
}
</script>

<style lang="scss">
$buttonSize: var(--button-size);
$visibleListSize: var(--visible-list-size);

@mixin pagination-item() {
  width: $buttonSize;
  min-width: $buttonSize;
  height: $buttonSize;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 0.4rem;
  color: $av-brand-primary;
  font-size: $av-font-size-xxs;
  font-weight: $av-font-weight-bold;
  background-color: transparent;
  transition: background-color 0.2s, color 0.2s;

  user-select: none;

  &:not(.disabled) {
    cursor: pointer;
  }

  &:not(.disabled):hover {
    background-color: $av-solid-brand-lightest;
  }

  &:not(.disabled):active {
    background-color: $av-solid-brand-bright;
  }

  &.active {
    background-color: $av-solid-brand-light;

    &.disabled {
      background-color: $av-solid-brand-lightest;
    }

    &:not(.disabled):hover {
      background-color: $av-solid-brand-light;
    }
  }

  &.disabled {
    color: $av-solid-brand-light;
  }
}

.vpc-pagination {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;

  &--items {
    gap: 0.1rem;
    display: flex;
    list-style-type: none;
  }
}
.vpc-pagination-items {
  gap: 0.1rem;
  display: flex;
  list-style-type: none;
}

.vpc-pagination-list {
  gap: 0.1rem;
  display: flex;
  align-items: center;
}

.vpc-pagination-action-item {
  @include pagination-item();
}

.vpc-pagination-icon-select {
  margin-top: 1.5rem;
}

.vpc-pagination-right-side {
  gap: 2.4rem;
  display: flex;
  align-items: center;

  &--text {
    font-size: $av-font-size-xxs;
    font-weight: $av-font-weight-bold;
    color: $av-solid-fixed-lighter;
  }
}

.vpc-pagination-right-side-limit {
  gap: 0.4rem;
  display: flex;
  align-items: center;
}
</style>
