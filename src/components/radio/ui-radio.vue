<template>
  <label
    :title="title()"
    :class="['ui-radio-wrapper', { disabled }]"
  >
    <span
      v-if="(label && labelSide === 'left') || $slots['label-left']"
      :class="['ui-radio-label', 'left', size, { disabled }]"
    >
      <slot name="label-left">
        {{ label }}
      </slot>
    </span>

    <div
      :class="[
        'ui-radio',
        `ui-radio--${size}`,
        {
          size,
          disabled,
          selected: isSelected,
          unselected: !isSelected,
        },
      ]"
    />

    <span
      v-if="(label && labelSide === 'right') || $slots['label-right']"
      :class="['ui-radio-label', 'right', size, { disabled }]"
    >
      <slot name="label-right">
        {{ label }}
      </slot>
    </span>
    <span
      v-else-if="$slots.default"
      :class="['ui-radio-label', 'right', size, { disabled }]"
    >
      <slot>
        {{ label }}
      </slot>
    </span>

    <component
      :is="componentName"
      type="radio"
      v-bind="$attrs"
      :disabled="disabled"
      class="ui-radio-native"
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
  name: 'UiRadio',

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
.ui-radio-wrapper {
  max-width: 100%;
  display: inline-flex;
  align-items: center;
  user-select: none;
  position: relative;

  &:not(.disabled) {
    cursor: pointer;
  }
}

.ui-radio {
  z-index: 1;
  border-radius: 50%;
  border-style: solid;
  border-color: $av-solid-brand-light;
  background-color: $av-fixed-white;

  &.selected {
    border-color: $av-brand-primary;

    &:not(.disabled) {
      &:hover {
        border-color: $av-brand-primary-hover;
      }

      &:active {
        border-color: $av-brand-primary-active;
      }
    }

    &.disabled {
      border-color: $av-solid-brand-bright;
    }
  }

  &.unselected {
    border-width: 1px;

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

  &--xs {
    min-width: 12px;
    height: 12px;

    &.selected {
      border-width: 3.5px;
    }
  }

  &--md {
    min-width: 16px;
    height: 16px;

    &.selected {
      border-width: 5px;
    }
  }

  &--xl {
    min-width: 24px;
    height: 24px;

    &.selected {
      border-width: 7px;
    }
  }
}

.ui-radio-label {
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

.ui-radio-native {
  display: none;
}
</style>
