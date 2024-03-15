<template>
  <div class="ui-filter-group">
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
    this.findParentContextFilter()
  },

  mounted() {
    this.setGroupHeight()
  },

  methods: {
    addGroup(context) {
      context.groups.push(this.$data)
    },

    toggleGroupVisibility() {
      this.isVisibleGroup = !this.isVisibleGroup
    },

    isParentFilterComponent(ctx) {
      return ['UiFilters', 'ui-filters'].includes(ctx.$options._componentTag)
    },

    findParentContextFilter() {
      let context = this.$parent

      while (!this.isParentFilterComponent(context)) {
        context = context.$parent

        if (this.isParentFilterComponent(context)) {
          this.addGroup(context)
        }
      }
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
.ui-filter-group,
.ui-filter-group-content {
  gap: 12px;

  display: flex;
  flex-direction: column;
}

.ui-filter-group-header {
  gap: 8px;

  display: flex;
  align-items: center;
}

.ui-filter-group-header-label {
  line-height: 16.2px;
  font-size: $av-font-size-xxs;
  color: $av-solid-fixed-light;
  font-weight: $av-font-weight-bold;

  @include ellipsis();
}

.ui-filter-group-header-line {
  flex: 1 1 50%;
  height: 1px;
  background-color: $av-solid-brand-bright;
}

.ui-filter-group-content {
  overflow: hidden;
  transition: 0.2s ease;
}
</style>
