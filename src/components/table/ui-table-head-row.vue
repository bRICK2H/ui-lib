<script>
import { getItemStorage } from '@/helpers/local-storage'
import UiTableHeadCell from './ui-table-head-cell.vue'

export default {
  name: 'UiTableHeadRow',

  props: {
    columnOptions: {
      type: Array,
      required: true,
    },

    cacheColumnSize: {
      type: Object,
      required: true,
    },

    horizontalBorder: {
      type: Boolean,
      required: true,
    },
  },

  render(h) {
    return h(
      'tr',
      {
        class: [
          'ui-table-head-row',
          { 'horizontal-border': this.horizontalBorder },
        ],
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

        return h(UiTableHeadCell, {
          scopedSlots,
          key: `cell:${i}`,
          props: {
            ...columnProps,
            ...this.$props,
            ...this.$attrs,
            indexColumn: i,
            slotName: 'head',
            isLastColumn: this.columnOptions.length - 1 === i,
            interactiveMode: interactiveMode === 'radio' ? '' : interactiveMode,
          },
        })
      })
    )
  },
}
</script>

<style lang="scss">
$rowHeadHeight: var(--row-head-height);

.ui-table-head-row {
  width: 100%;
  display: block;
  height: $rowHeadHeight;

  &.horizontal-border {
    border-bottom: 1px solid $av-solid-brand-accent;
  }
}
</style>
