<script>
import { getItemStorage } from '@/helpers/local-storage'
import UiTableBodyCell from './ui-table-body-cell.vue'

export default {
  name: 'UiTableBodyRow',

  props: {
    store: {
      type: Object,
      required: true,
    },

    cacheColumnSize: {
      type: Object,
      required: true,
    },

    columnOptions: {
      type: Array,
      required: true,
    },

    row: {
      type: [Object, Array],
      required: true,
    },

    indexRow: {
      type: Number,
      required: true,
    },

    highlightCheckedRow: {
      type: Boolean,
      required: true,
    },

    horizontalBorder: {
      type: Boolean,
      required: true,
    },

    highlightRow: {
      type: [Boolean, Function],
      required: true,
    },

    rowCursorPointer: {
      type: [Boolean, Function],
      required: true,
    },
  },

  data: () => ({
    isHoverRow: false,
  }),

  computed: {
    isHighlightRow() {
      return typeof this.highlightRow === 'function'
        ? this.highlightRow(this.row)
        : this.highlightRow
    },

    isCursorPointer() {
      return typeof this.rowCursorPointer === 'function'
        ? this.rowCursorPointer(this.row)
        : this.rowCursorPointer
    },
  },

  methods: {
    getFirstInteractiveModeIndex() {
      return this.columnOptions.findIndex(({ columnProps }) => {
        const { interactiveMode } = columnProps

        return interactiveMode !== ''
      })
    },
  },

  render(h) {
    const firstInteractiveModeIndex = this.getFirstInteractiveModeIndex()

    return h(
      'tr',
      {
        class: [
          'ui-table-body-row',
          {
            'pointer-row': this.isCursorPointer,
            'highlight-row': this.isHighlightRow,
            'active-resize': this.store.isActiveResize,
            'horizontal-border': this.horizontalBorder,
            'highlight-checked-row':
              this.store.isCheckedBodyRow(this.row) && this.highlightCheckedRow,
          },
        ],
        on: {
          mouseenter: () => (this.isHoverRow = true),
          mouseleave: () => (this.isHoverRow = false),
        },
      },
      this.columnOptions.map((cell, i) => {
        const { scopedSlots } = cell
        const { id, cache } = this.cacheColumnSize
        const storageWidth = id && cache ? getItemStorage(id)?.[i] : 0
        const columnProps = {
          ...cell.columnProps,
          width: storageWidth || cell.columnProps.width || 0,
        }
        const { interactiveMode } = columnProps

        return h(UiTableBodyCell, {
          scopedSlots,
          key: `cell:${this.indexRow}-${i}`,
          props: {
            ...columnProps,
            ...this.$props,
            ...this.$attrs,
            indexColumn: i,
            slotName: 'body',
            isLastColumn: this.columnOptions.length - 1 === i,
            interactiveMode:
              firstInteractiveModeIndex === i ? interactiveMode : '',
          },
        })
      })
    )
  },
}
</script>

<style lang="scss">
$rowBodyHeight: var(--row-body-height);

.ui-table-body-row {
  width: 100%;
  height: $rowBodyHeight;
  display: block;
  transition: background-color 0.2s;

  &.pointer-row:not(.active-resize) {
    cursor: pointer;
  }

  &.highlight-row:not(.active-resize):hover,
  &.highlight-checked-row {
    background-color: $av-solid-brand-lightest;
  }

  &:not(:last-of-type) {
    &.horizontal-border {
      box-shadow: 1px 1px $av-solid-brand-accent;
    }
  }
}
</style>
