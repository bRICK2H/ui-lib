<template>
  <div :class="['ui-filter-group', { collapsible }]">
    <!-- Шапка группы -->
    <header class="ui-filter-group-header">
      <ui-icon
        v-if="iconName"
        :name="iconName"
        :size="iconSize"
      />

      <span
        class="ui-filter-group-header-label"
        :title="label"
      >
        {{ label }}
      </span>

      <template v-if="collapsible">
        <span class="ui-filter-group-header-line" />

        <ui-button
          variant="ghost-primary"
          @click="toggleGroupVisibility"
        >
          <ui-icon
            size="16"
            :name="iconGroupName"
          />
        </ui-button>
      </template>
    </header>

    <!-- Содержимое группы -->
    <div
      ref="group-content"
      class="ui-filter-group-content"
      :style="calculatedGroupHeight"
    >
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'UiFilterGroup',

  inject: ['stateFilters'],

  props: {
    label: {
      type: String,
      default: '',
    },

    iconName: {
      type: String,
      default: '',
    },

    iconSize: {
      type: Number,
      default: 16,
    },

    collapsible: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    groupHeight: null,
    isVisibleGroup: true,
  }),

  computed: {
    iconGroupName() {
      return this.isVisibleGroup ? 'chevron-up' : 'chevron-down'
    },

    calculatedGroupHeight() {
      if (this.groupHeight === null) {
        return null
      }

      return {
        height: `${this.isVisibleGroup ? this.groupHeight : 0}px`,
      }
    },
  },

  created() {
    this.addGroup()
  },

  mounted() {
    this.setGroupHeight()
  },

  methods: {
    addGroup() {
      this.stateFilters.groups.push(this.$data)
    },

    toggleGroupVisibility() {
      this.isVisibleGroup = !this.isVisibleGroup
    },

    setGroupHeight() {
      const groupContent = this.$refs['group-content']

      if (groupContent) {
        const { height } = groupContent.getBoundingClientRect()

        this.groupHeight = height || groupContent.offsetHeight
      }
    },
  },
}
</script>

<style lang="scss">
.ui-filter-group {
  gap: 8px;
  display: flex;
  flex-direction: column;

  & .ui-filter-group-header {
    gap: 8px;

    display: flex;
    align-items: center;
  }

  & .ui-filter-group-header-label {
    line-height: 16.2px;
    font-size: $av-font-size-s;
    font-weight: $av-font-weight-normal;
    color: $av-solid-fixed-light;

    @include ellipsis();
  }

  & .ui-filter-group-header-line {
    flex: 1 1 50%;
    height: 1px;
    background-color: $av-solid-brand-bright;
  }

  & .ui-filter-group-content {
    gap: 16px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: 0.2s ease;
  }

  &.collapsible {
    gap: 12px;

    & .ui-filter-group-content {
      gap: 12px;
    }

    & .ui-filter-group-header-label {
      font-size: $av-font-size-xxs;
      font-weight: $av-font-weight-bold;
    }
  }
}
</style>
