<template>
  <label
    :title="title()"
    :class="['ui-checkbox-wrapper', { disabled }]"
  >
    <span
      v-if="(label && labelSide === 'left') || $slots['label-left']"
      :class="['ui-checkbox-label', 'left', size, { disabled }]"
    >
      <slot name="label-left">
        {{ label }}
      </slot>
    </span>

    <div
      :class="[
        'ui-checkbox',
        `ui-checkbox--${size}`,
        {
          size,
          disabled,
          indeterminate,
          selected: isSelected,
          unselected: !isSelected,
        },
      ]"
    >
      <ui-icon
        v-if="isSelected"
        name="selected"
        :size="currentSize"
      />

      <ui-icon
        v-if="indeterminate && !isSelected"
        name="indeterminate"
        :size="currentSize"
      />
    </div>

    <span
      v-if="(label && labelSide === 'right') || $slots['label-right']"
      :class="['ui-checkbox-label', 'right', size, { disabled }]"
    >
      <slot name="label-right">
        {{ label }}
      </slot>
    </span>
    <span
      v-else-if="$slots.default"
      :class="['ui-checkbox-label', 'right', size, { disabled }]"
    >
      <slot>
        {{ label }}
      </slot>
    </span>

    <component
      :is="componentName"
      type="checkbox"
      v-bind="$attrs"
      :disabled="disabled"
      class="ui-checkbox-native"
      @click.stop
      @set-value="setValue"
      @change="changeValue"
      @input-value="inputValue"
    />
  </label>
</template>

<script>
import { SIZES } from './config'

export default {
  name: 'UiCheckbox',

  components: {
    VInputModel: () => import('@/components/input-modes/v-input-model.vue'),
    VInputValue: () => import('@/components/input-modes/v-input-value.vue'),
  },

  model: {
    prop: 'modelValue',
  },

  props: {
    label: {
      type: String,
      default: '',
    },

    disabled: {
      type: Boolean,
      default: false,
    },

    labelSide: {
      type: String,
      default: 'right',
    },

    showHoverHint: {
      type: Boolean,
      default: false,
    },

    indeterminate: {
      type: Boolean,
      default: false,
    },

    size: {
      type: String,
      default: 'md',
      validator: (value) => {
        return ['', ...Object.keys(SIZES)].includes(value)
      },
    },
  },

  data: () => ({
    isSelected: false,
  }),

  computed: {
    currentSize() {
      return SIZES[this.size] || SIZES.default
    },

    componentName() {
      return this.$attrs.modelValue === undefined
        ? 'VInputValue'
        : 'VInputModel'
    },
  },

  methods: {
    setValue(isSelected) {
      this.isSelected = isSelected
    },

    inputValue(value) {
      this.$emit('input', value)
    },

    changeValue(event) {
      this.$emit('change', event)
      this.setValue(event.target.checked)
    },

    title() {
      if (!this.showHoverHint) {
        return ''
      }

      if (this.label) {
        return this.label
      }

      const slot = this.$slots['label-left'] || this.$slots['label-right']

      if (!slot) {
        return ''
      }
      const textContent = this.getSlotTextContent(slot)

      if (textContent) {
        return textContent
      }

      return ''
    },

    getSlotTextContent(node) {
      return node
        .map((childNode) => {
          return childNode.children
            ? this.getSlotTextContent(childNode.children)
            : childNode.text
        })
        .join('')
        .trim()
    },
  },
}
</script>

<style lang="scss">
.ui-checkbox-wrapper {
  max-width: 100%;
  display: inline-flex;
  align-items: center;
  user-select: none;
  position: relative;

  &:not(.disabled) {
    cursor: pointer;
  }
}

.ui-checkbox {
  z-index: 1;

  &.selected,
  &.indeterminate {
    background-color: $av-brand-primary;

    &:not(.disabled) {
      &:hover {
        background-color: $av-brand-primary-hover;
      }

      &:active {
        background-color: $av-brand-primary-active;
      }
    }

    &.disabled {
      background-color: $av-solid-brand-bright;
    }
  }

  &:not(.indeterminate) {
    &.unselected {
      background-color: $av-fixed-white;
      border: 1px solid $av-solid-brand-light;

      &:not(.disabled) {
        &:hover {
          border: 1px solid $av-brand-primary;
        }

        &:active {
          border: 1px solid $av-brand-primary-hover;
        }
      }

      &.disabled {
        background-color: $av-brand-lightest;
        border: 1px solid $av-solid-brand-bright;
      }
    }
  }

  &--xs {
    min-width: 12px;
    height: 12px;
    border-radius: 2px;
  }

  &--md {
    min-width: 16px;
    height: 16px;
    border-radius: 2px;
  }

  &--xl {
    min-width: 24px;
    height: 24px;
    border-radius: 4px;
  }
}

.ui-checkbox-label {
  display: inline-block;
  color: $av-fixed-primary;
  font-weight: $av-font-weight-normal;

  @include ellipsis;

  &.disabled {
    color: $av-solid-fixed-lighter;
  }

  &.xs {
    font-size: $av-font-size-xxs;

    &.left {
      margin-right: 6px;
    }

    &.right {
      margin-left: 6px;
    }
  }

  &.md,
  &.xl {
    font-size: $av-font-size-xs;

    &.left {
      margin-right: 8px;
    }

    &.right {
      margin-left: 8px;
    }
  }
}

.ui-checkbox-native {
  display: none;
}
</style>
