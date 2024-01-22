<template>
  <div
    :style="paddingGroupHeadRow"
    :class="['ui-table-group-head-row', { 'is-last-group': isLastGroup }]"
    v-on="$listeners"
  >
    <slot />

    <ui-button
      variant="ghost-primary"
      class="ui-table-group-head-chevron"
    >
      <ui-icon
        :size="16"
        :name="isActiveGroup ? 'chevron-up' : 'chevron-down'"
      />
    </ui-button>
  </div>
</template>

<script>
export default {
  name: 'UiTableGroupHeadRow',

  props: {
    activeGroups: {
      type: Array,
      required: true,
    },

    groupRowsOptions: {
      type: Array,
      required: true,
    },

    paddingColumnsX: {
      type: Number,
      required: true,
    },

    indexGroupRow: {
      type: Number,
      required: true,
    },
  },

  computed: {
    isActiveGroup() {
      return this.activeGroups.some(
        ([index]) => Number(index) === this.indexGroupRow
      )
    },

    isLastGroup() {
      return this.groupRowsOptions.length - 1 === this.indexGroupRow
    },

    paddingGroupHeadRow() {
      const padding = this.paddingColumnsX

      if (typeof padding === 'number') {
        return {
          paddingLeft: `${padding}px`,
        }
      }

      if (Array.isArray(padding)) {
        const [left] = padding

        return {
          paddingLeft: `${left}px`,
        }
      }

      return {
        paddingLeft: '0',
      }
    },
  },
}
</script>

<style lang="scss">
$rowBodyHeight: var(--row-body-height);

.ui-table-group-head-row {
  width: 100%;
  height: $rowBodyHeight;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  position: relative;
  user-select: none;
  background-color: $av-solid-brand-accent;

  &:hover {
    background-color: $av-solid-brand-lighter;
  }

  &:active {
    background-color: $av-solid-brand-bright;
  }

  &:not(.is-last-group) {
    border-bottom: 1px solid $av-solid-brand-bright;
  }

  & .ui-table-group-head-chevron {
    margin: 0 8px;
  }
}
</style>
