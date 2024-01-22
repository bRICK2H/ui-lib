<template>
  <th
    :style="widthCell"
    :class="[
      'ui-table-head-cell-wrapper',
      {
        'hover-column': isHoverColumn && !isLastColumn,
        'vertical-border': verticalBorder,
      },
    ]"
    @mouseenter="handlerHoverColumn(true)"
    @mouseleave="handlerHoverColumn(false)"
  >
    <span
      v-if="resizableColumn && isHoverColumn && !isLastColumn"
      class="ui-table-head-cell-resize"
      @mousedown="activeResize"
      @mouseenter="handlerHoverResize(true)"
      @mouseleave="handlerHoverResize(false)"
    />

    <div
      ref="head-cell"
      class="ui-table-head-cell-container"
      :style="[alignCell, widthCell, paddingCell]"
    >
      <div
        ref="head-text"
        class="ui-table-head-cell-text-container"
      >
        <div
          v-if="hasInteractiveMode && hasData"
          class="ui-table-head-cell-interactive-mode"
        >
          <component
            :is="interactiveComponent"
            :disabled="loading"
            :value="store.isCheckedHeadRow()"
            :checked="store.isCheckedHeadRow()"
            :indeterminate="store.isIndeterminateHeadRow()"
            size="md"
            @change="change"
          >
            <span
              slot="label-right"
              :title="title"
              class="ui-table-head-cell-data"
            >
              <slot :name="slotName">
                {{ label }}
              </slot>
            </span>
          </component>
        </div>

        <div
          v-else
          class="ui-table-head-cell-content"
        >
          <span
            class="ui-table-head-cell-data"
            :title="title"
          >
            <slot :name="slotName">
              {{ label }}
            </slot>
          </span>
        </div>

        <div
          v-if="sortBy"
          class="ui-table-head-cell-sort-container"
        >
          <ui-button
            variant="ghost-primary"
            size="xs"
            @click="sortColumn"
          >
            <ui-icon
              :size="12"
              :name="sortIconName"
              :color="
                store.activeSortIndex === indexColumn
                  ? colorSolidBrandPrimary
                  : colorSolidFixedLighter
              "
            />
          </ui-button>
        </div>
      </div>
    </div>
  </th>
</template>

<script>
import style from '@/assets/styles/globally/_export.modules.scss'

import UiRadio from '@/components/radio/ui-radio.vue'
import UiCheckbox from '@/components/checkbox/ui-checkbox.vue'

export default {
  name: 'UiTableHeaderCell',

  components: {
    UiRadio,
    UiCheckbox,
  },

  props: {
    bus: {
      type: Object,
      required: true,
    },

    store: {
      type: Object,
      required: true,
    },

    cacheColumnSize: {
      type: Object,
      required: true,
    },

    tableData: {
      type: Array,
      required: true,
    },

    paddingColumnX: {
      type: [Number, Array],
      required: true,
    },

    width: {
      type: [String, Number],
      required: true,
    },

    label: {
      type: String,
      required: true,
    },

    align: {
      type: String,
      required: true,
    },

    sortBy: {
      type: [String, Object],
      required: true,
    },

    columnKey: {
      type: String,
      required: true,
    },

    slotName: {
      type: String,
      required: true,
    },

    interactiveMode: {
      type: String,
      required: true,
    },

    indexColumn: {
      type: Number,
      required: true,
    },

    paddingColumnsX: {
      type: Number,
      required: true,
    },

    loading: {
      type: Boolean,
      required: true,
    },

    isLastColumn: {
      type: Boolean,
      required: true,
    },

    showHoverHint: {
      type: Boolean,
      required: true,
    },

    resizableColumn: {
      type: Boolean,
      required: true,
    },

    verticalBorder: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    title: '',
    resizeWidth: 0,
    currentWidth: 0,
    grabPositionX: 0,
    isActiveResize: false,
    colorSolidBrandPrimary: style.colorSolidBrandPrimary,
    colorSolidFixedLighter: style.colorSolidFixedLighter,
  }),

  computed: {
    hasData() {
      return this.store.tableData.length > 0
    },

    hasInteractiveMode() {
      return this.interactiveMode !== ''
    },

    isHoverColumn() {
      return this.store.hoverColumn[this.indexColumn]
    },

    initWidth() {
      return this.store.width[this.indexColumn]
    },

    dynamicWidth() {
      return this.store.dynamicWidth[this.indexColumn]
    },

    minDynamicWidth() {
      return this.store.minDynamicWidth[this.indexColumn]
    },

    widthCell() {
      return {
        width: this.getWidth(),
        minWidth: this.getMinWidth(),
        maxWidth: this.getMaxWidth(),
      }
    },

    paddingCell() {
      const paddingX =
        this.paddingColumnX >= 0 || Array.isArray(this.paddingColumnX)
          ? this.paddingColumnX
          : this.paddingColumnsX

      if (typeof paddingX === 'number') {
        return {
          padding: `0 ${paddingX}px`,
        }
      }

      if (Array.isArray(paddingX)) {
        const [left, right] = paddingX

        return {
          padding: `0 ${right}px 0 ${left}px`,
        }
      }

      return {
        padding: '0',
      }
    },

    interactiveComponent() {
      const components = {
        radio: 'UiRadio',
        checkbox: 'UiCheckbox',
      }

      return this.hasInteractiveMode ? components[this.interactiveMode] : null
    },

    alignCell() {
      const align = {
        center: 'center',
        left: 'flex-left',
        right: 'flex-end',
        default: 'flex-left',
      }

      return {
        justifyContent: align[this.align] ?? align.default,
      }
    },

    currentSortBy() {
      return this.store.getSortedItem(this.indexColumn).sortBy
    },

    currentSortActive() {
      return this.store.getSortedItem(this.indexColumn).active
    },

    sortIconName() {
      const sort = {
        asc: 'arrow-short-up',
        desc: 'arrow-short-down',
        default: '',
      }

      return sort[this.currentSortBy] ?? sort.default
    },
  },

  watch: {
    tableData() {
      this.setWidth()
    },

    'store.isColumnsWidthUpdated': {
      immediate: true,
      handler() {
        this.setWidth()
      },
    },

    sortBy: {
      immediate: true,
      handler() {
        this.store.setSortedItems({
          sortBy: this.sortBy,
          index: this.indexColumn,
          columnKey: this.columnKey,
        })
      },
    },

    isActiveResize() {
      this.store.setActiveResizeStatus(this.isActiveResize)
      this.store.setActiveResizeColumn(this.isActiveResize, this.indexColumn)
      document.body.style.cursor = this.isActiveResize ? 'col-resize' : 'auto'
    },
  },

  destroyed() {
    this.removeHandleResize()
  },

  mounted() {
    this.title = this.getTitle()
  },

  methods: {
    async setWidth() {
      await this.$nextTick()

      const cellRef = this.$refs['head-cell']
      const textRef = this.$refs['head-text']
      const { width } = textRef.getBoundingClientRect()
      const initWidth = this.width === 'auto' ? width : this.width || width
      const isSpecifiedWidth =
        Boolean(this.width) && typeof this.width === 'number'

      if (this.width === 'auto') {
        this.store.setAutoWidthNodes(cellRef, this.indexColumn)
      }

      this.store.setCollectionWidth(
        initWidth,
        this.indexColumn,
        isSpecifiedWidth
      )
    },

    activeResize(event) {
      this.addHandleResize()
      this.isActiveResize = true
      this.grabPositionX = event.clientX

      const collectionAutoWidthNodes = Object.entries(this.store.autoWidthNodes)

      if (collectionAutoWidthNodes.length > 0) {
        collectionAutoWidthNodes.forEach(([index, ref]) => {
          if (this.store.lastColumnIndex === Number(index)) {
            return
          }

          const { width } = ref.getBoundingClientRect()

          this.$set(this.store, 'dynamicAutoWidth', null)
          this.store.setDynamicWidth(width, index)
        })
      }

      this.currentWidth = this.dynamicWidth || this.initWidth
    },

    deactivateResize() {
      this.removeHandleResize()
      this.isActiveResize = false
      this.store.setHoverColumn(false, this.indexColumn)

      this.bus.$emit('resize-column', {
        ...this.cacheColumnSize,
        label: this.title,
        indexColumn: this.indexColumn,
        width: this.dynamicWidth || this.initWidth,
      })
    },

    moveResize(event) {
      if (!this.isActiveResize) {
        return
      }

      this.resizeWidth =
        this.currentWidth + (event.clientX - this.grabPositionX)

      if (this.resizeWidth <= this.minDynamicWidth) {
        this.resizeWidth = this.minDynamicWidth
      }

      this.store.setDynamicWidth(this.resizeWidth, this.indexColumn)
    },

    change(event) {
      const { checked } = event.target

      this.store.changeAllSelection(checked)

      this.bus.$emit('select-rows', {
        checked,
        rows: this.store.getToTalSelectedRows(),
      })
    },

    sortColumn() {
      if (!this.sortBy) {
        return
      }

      this.store.updateSortedItems({
        index: this.indexColumn,
        sortBy: this.currentSortBy,
      })

      this.bus.$emit('sort-column', {
        sort: this.currentSortBy,
        columnKey: this.columnKey,
      })
    },

    handlerHoverColumn(hover) {
      if (this.store.isActiveResize || this.isLastColumn) {
        return
      }

      this.store.setHoverColumn(hover, this.indexColumn)
    },

    handlerHoverResize(hover) {
      this.store.setHoverResize(hover, this.indexColumn)
    },

    getTitle() {
      if (!this.showHoverHint) {
        return ''
      }

      const headNode = this.$refs['head-cell']
      const textContent = headNode?.textContent

      return textContent ? textContent.trim() : this.label
    },

    getWidth() {
      if (this.isLastColumn) {
        return '100%'
      }

      if (this.width === 'auto') {
        return this.store.dynamicAutoWidth
      }

      return null
    },

    getMinWidth() {
      return `${this.dynamicWidth || this.initWidth}px`
    },

    getMaxWidth() {
      if (this.isLastColumn) {
        return null
      }

      if (this.width === 'auto') {
        return this.dynamicWidth ? `${this.dynamicWidth}px` : null
      }

      if (
        this.width > 0 ||
        this.dynamicWidth ||
        this.store.isColumnsWidthUpdated
      ) {
        return this.getMinWidth()
      }

      return null
    },

    addHandleResize() {
      document.addEventListener('mouseup', this.deactivateResize)
      document.addEventListener('mousemove', this.moveResize)
    },

    removeHandleResize() {
      document.removeEventListener('mouseup', this.deactivateResize)
      document.removeEventListener('mousemove', this.moveResize)
    },
  },
}
</script>

<style lang="scss">
$rowHeadHeight: var(--row-head-height);

.ui-table-head-cell-wrapper {
  height: $rowHeadHeight;
  user-select: none;
  position: relative;
  white-space: nowrap;

  &.hover-column {
    background-color: $av-solid-brand-lightest;
  }

  &.vertical-border {
    border-right: 1px solid $av-solid-brand-accent;
  }
}

.ui-table-head-cell-resize {
  width: 5px;
  height: 100%;
  background-color: $av-solid-brand-light;
  position: absolute;
  top: 0;
  right: -3px;
  z-index: 1;
  border-radius: 3px;
  cursor: col-resize;

  &:hover,
  &:active {
    width: 9px;
    right: -5px;
    border-radius: 5px;
  }

  &:hover {
    background-color: $av-brand-primary;
  }

  &:active {
    background-color: $av-brand-primary-hover;
  }
}

.ui-table-head-cell-container {
  display: flex;
  align-items: center;
}

.ui-table-head-cell-text-container {
  display: flex;
  align-items: center;
  @include ellipsis;
}

.ui-table-head-cell-interactive-mode {
  max-width: 100%;
  display: flex;
  align-content: center;
}

.ui-table-head-cell-content {
  max-width: 100%;
}

.ui-table-head-cell-sort-container {
  display: flex;
  align-content: center;
  justify-content: center;
  margin-left: 4px;
}

.ui-table-head-cell-data {
  display: block;
  @include ellipsis;
  line-height: 16px;
  color: $av-solid-fixed-light;
  font-size: $av-font-size-xxs;
  font-weight: $av-font-weight-normal;
}
</style>
