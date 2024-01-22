<template>
  <td
    :style="widthCell"
    :class="[
      'ui-table-body-cell-wrapper',
      {
        'hover-column': isHoverColumn && !isLastColumn,
        'vertical-border': verticalBorder,
      },
    ]"
    @click="actionRow"
  >
    <span
      v-if="resizableColumn && isHoverColumn && !isLastColumn"
      :class="[
        'ui-table-body-cell-resize',
        {
          'hover-resize': isHoverResize,
          'active-resize': store.isActiveResize,
        },
      ]"
    />

    <div
      ref="body-cell"
      :class="['ui-table-body-cell-container', { skeleton: loading }]"
      :style="[alignCell, widthCell, paddingCell]"
    >
      <div
        ref="body-text"
        :class="[
          'ui-table-body-cell-text-container',
          { 'is-ellipsis': isEllipsisCell },
        ]"
      >
        <!-- .stop блокирую вызов события action-row т.к. должен выполниться только один вызов select-row -->
        <div
          v-if="hasInteractiveMode"
          class="ui-table-body-cell-interactive-mode"
          @click.stop
        >
          <component
            :is="interactiveComponent"
            :name="radioName"
            :value="store.isCheckedBodyRow(row)"
            :checked="store.isCheckedBodyRow(row)"
            :disabled="store.isDisabledBodyRow(row)"
            size="md"
            @change="change"
          >
            <span
              slot="label-right"
              :title="title"
              :class="['ui-table-body-cell-data', classBodyCell]"
            >
              <slot
                :name="slotName"
                v-bind="{ row }"
              >
                {{ valueCell }}
              </slot>
            </span>
          </component>
        </div>
        <div
          v-else
          class="ui-table-body-cell-content"
        >
          <span
            :title="title"
            :class="['ui-table-body-cell-data', classBodyCell]"
          >
            <slot
              :name="slotName"
              v-bind="{ row }"
            >
              {{ valueCell }}
            </slot>
          </span>
        </div>
      </div>
    </div>
  </td>
</template>

<script>
export default {
  name: 'UiTableBodyCell',

  components: {
    UiRadio: () => import('@/components/radio/ui-radio.vue'),
    UiCheckbox: () => import('@/components/checkbox/ui-checkbox.vue'),
  },

  props: {
    row: {
      type: Object,
      required: true,
    },

    bus: {
      type: Object,
      required: true,
    },

    store: {
      type: Object,
      required: true,
    },

    paddingColumnX: {
      type: [Number, Array],
      required: true,
    },

    classBodyCell: {
      type: [String, Object, Array],
      required: true,
    },

    width: {
      type: [String, Number],
      required: true,
    },

    align: {
      type: String,
      required: true,
    },

    slotName: {
      type: String,
      required: true,
    },

    columnKey: {
      type: String,
      required: true,
    },

    interactiveMode: {
      type: String,
      required: true,
    },

    indexRow: {
      type: Number,
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

    verticalBorder: {
      type: Boolean,
      required: true,
    },

    resizableColumn: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    title: '',
    intervalId: 0,
    bodyResizeObserver: null,
  }),

  computed: {
    radioName() {
      return this.interactiveMode === 'radio' ? 'table-row' : ''
    },

    isHoverColumn() {
      return this.store.hoverColumn[this.indexColumn]
    },

    isHoverResize() {
      return this.store.hoverResize[this.indexColumn]
    },

    hasInteractiveMode() {
      return this.interactiveMode !== ''
    },

    interactiveComponent() {
      const components = {
        radio: 'UiRadio',
        checkbox: 'UiCheckbox',
      }

      return this.hasInteractiveMode ? components[this.interactiveMode] : null
    },

    valueCell() {
      const value = this.row[this.columnKey]
      return typeof value === 'boolean' ? '' : value ?? ''
    },

    alignCell() {
      if (this.align === 'space') {
        return {
          display: 'block',
        }
      }

      const align = {
        center: 'center',
        left: 'flex-left',
        right: 'flex-end',
        default: 'flex-left',
      }

      return {
        'justify-content': align[this.align] ?? align.default,
      }
    },

    initWidth() {
      return this.store.width[this.indexColumn]
    },

    dynamicWidth() {
      return this.store.dynamicWidth[this.indexColumn]
    },

    isEllipsisCell() {
      return this.width > 0 || this.store.isActiveResize
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
  },

  watch: {
    async row() {
      this.store.clearCollectionWidth()

      await this.$nextTick()
      this.setWidth()
    },

    'store.isColumnsWidthUpdated'() {
      this.bodyResizeObserver?.disconnect()
    },
  },

  mounted() {
    this.initBody()
  },

  destroyed() {
    clearInterval(this.intervalId)
    this.bodyResizeObserver?.disconnect()
  },

  methods: {
    initBody() {
      this.title = this.getTitle()
      this.initBodyResizeObserver()
    },

    setWidth() {
      const cellRef = this.$refs['body-cell']
      const textRef = this.$refs['body-text']
      const isSpecifiedWidth =
        Boolean(this.width) && typeof this.width === 'number'
      const { width } = textRef.getBoundingClientRect()
      const initWidth = this.width === 'auto' ? width : this.width || width

      this.store.setCollectionWidth(
        initWidth,
        this.indexColumn,
        isSpecifiedWidth
      )

      clearInterval(this.intervalId)
      this.intervalId = setInterval(() => {
        const currentMinWidth = parseInt(getComputedStyle(cellRef).minWidth, 10)

        this.store.checkWidthMatches(currentMinWidth, this.indexColumn)

        if (this.store.isColumnsWidthUpdated) {
          clearInterval(this.intervalId)
        }
      })
    },

    change(event) {
      const { checked } = event.target
      const mode = this.interactiveMode

      this.store.changeSelection(this.row, checked, mode)
      this.bus.$emit('select-row', {
        mode,
        checked,
        row: this.row,
        indexRow: this.indexRow,
        columnKey: this.columnKey,
        indexColumn: this.indexColumn,
        rows: this.store.getToTalSelectedRows(),
      })
    },

    actionRow(event) {
      this.bus.$emit('action-row', {
        event,
        row: this.row,
        value: this.valueCell,
        indexRow: this.indexRow,
        columnKey: this.columnKey,
        indexColumn: this.indexColumn,
      })
    },

    getTitle() {
      if (!this.showHoverHint) {
        return ''
      }

      const bodyNode = this.$refs['body-cell']
      const textContent = bodyNode?.textContent

      return textContent ? textContent.trim() : this.valueCell
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

    async initBodyResizeObserver() {
      await this.$nextTick()

      const bodyNode = this.$refs['body-cell']

      this.bodyResizeObserver = new ResizeObserver(this.setWidth)
      this.bodyResizeObserver.observe(bodyNode)
    },
  },
}
</script>

<style lang="scss">
$rowBodyHeight: var(--row-body-height);

.ui-table-body-cell-wrapper {
  height: $rowBodyHeight;
  vertical-align: middle;
  user-select: none;
  position: relative;
  transition: background-color 0.2s;
  white-space: nowrap;

  &.hover-column {
    background-color: $av-solid-brand-lightest;
  }

  &.vertical-border {
    border-right: 1px solid $av-solid-brand-accent;
  }
}

.ui-table-body-cell-resize {
  width: 1px;
  height: calc(100% + 1px);
  background-color: $av-solid-brand-light;
  position: absolute;
  top: -1px;
  right: -1px;
  z-index: 1;

  &.hover-resize {
    background-color: $av-brand-primary;
  }

  &.active-resize {
    background-color: $av-brand-primary-hover;
  }
}

.ui-table-body-cell-container {
  display: flex;
  align-items: center;
  position: relative;

  &.skeleton {
    &:after {
      content: '';
      height: 8px;
      width: calc(100% / 3);
      display: inline-block;
      opacity: 0.4;
      border-radius: 4px;
      background-color: $av-brand-accent;
      position: absolute;
      animation: skeleton 2s infinite;

      @keyframes skeleton {
        0% {
          opacity: 0.3;
        }

        50% {
          opacity: 0.9;
        }

        100% {
          opacity: 0.3;
        }
      }
    }

    .ui-table-body-cell-content,
    .ui-table-body-cell-interactive-mode {
      opacity: 0;
    }
  }
}

.ui-table-body-cell-text-container {
  display: flex;
  align-items: center;

  &.is-ellipsis {
    @include ellipsis;
  }
}

.ui-table-body-cell-interactive-mode {
  max-width: 100%;
  display: flex;
  align-content: center;
}

.ui-table-body-cell-content {
  max-width: 100%;

  & .ui-table-body-cell-data {
    color: $av-fixed-primary;
    font-size: $av-font-size-xs;
    font-weight: $av-font-weight-normal;
  }
}

.ui-table-body-cell-data {
  display: block;
  @include ellipsis;
  line-height: 20px;
  font-size: $av-font-size-xs;
  font-weight: $av-font-weight-normal;
}
</style>
