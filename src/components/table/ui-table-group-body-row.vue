<template>
  <div
    :style="heightGroupBodyRow"
    class="ui-table-group-body-row"
  >
    <template v-if="isActiveGroup">
      <template v-for="(row, index) of groupTableData">
        <ui-table-body-row
          v-if="showVisibleRows(currentPrimaryGroupIndexes + index)"
          :key="`group-body-row:${currentPrimaryGroupIndexes + index}`"
          :row="row"
          :bus="bus"
          :store="store"
          :index-row="index"
          :loading="loading"
          :padding-columns-x="paddingColumnsX"
          :highlight-row="highlightRow"
          :column-options="columnOptions"
          :show-hover-hint="showHoverHint"
          :vertical-border="verticalBorder"
          :resizable-column="resizableColumn"
          :cache-column-size="cacheColumnSize"
          :horizontal-border="horizontalBorder"
          :row-cursor-pointer="rowCursorPointer"
          :highlight-checked-row="highlightCheckedRow"
        />
        <tr
          v-else
          :key="`group-body-row:${currentPrimaryGroupIndexes + index}`"
          class="ui-table-body-invisible-row"
        ></tr>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: 'UiTableGroupBodyRow',

  components: {
    UiTableBodyRow: () => import('./ui-table-body-row.vue'),
  },

  props: {
    bus: {
      type: Object,
      required: true,
    },

    activeGroups: {
      type: Array,
      required: true,
    },

    groupTableData: {
      type: Array,
      required: true,
    },

    primaryGroupIndexes: {
      type: Array,
      required: true,
    },

    columnOptions: {
      type: Array,
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

    activeGroupRow: {
      type: Object,
      required: true,
    },

    sequentialGroupIndexes: {
      type: Object,
      required: true,
    },

    indexGroupRow: {
      type: Number,
      required: true,
    },

    rowBodyHeight: {
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

    showHoverHint: {
      type: Boolean,
      required: true,
    },

    verticalBorder: {
      type: Boolean,
      required: true,
    },

    horizontalBorder: {
      type: Boolean,
      required: true,
    },

    resizableColumn: {
      type: Boolean,
      required: true,
    },

    highlightCheckedRow: {
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

    showVisibleRows: {
      type: Function,
      required: true,
    },
  },

  computed: {
    isActiveGroup() {
      return this.activeGroups.some(
        ([index]) => Number(index) === this.indexGroupRow
      )
    },

    currentPrimaryGroupIndexes() {
      return this.primaryGroupIndexes[
        this.sequentialGroupIndexes[this.indexGroupRow]
      ]
    },

    heightGroupBodyRow() {
      return {
        height: this.isActiveGroup
          ? `${this.groupTableData.length * this.rowBodyHeight}px`
          : 0,
      }
    },
  },
}
</script>

<style lang="scss">
$rowBodyHeight: var(--row-body-height);

.ui-table-group-body-row {
  transition: height 0.2s ease;
}

.ui-table-body-invisible-row {
  width: 100%;
  display: block;
  height: $rowBodyHeight;
}
</style>
