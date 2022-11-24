import Vue from 'vue'
import { DirectiveBinding } from 'vue/types/options'
import UiScrollbar from '@/components/scrollbar/ui-scrollbar.vue'

// [Vue warn]: Invalid prop: custom validator check failed for prop "areaDragRule".
type ValueType = string | number | boolean

interface OptionsType {
  [key: string]: ValueType
}

interface ValidatorKeyType {
  [key: string]: (value: ValueType) => boolean
}

const colorValidator = (value: string): boolean => {
  const rgba = value.split(',')

  return value === '' || [3, 4].includes(rgba.length)
}

const dragValidator = (value: string): boolean => {
  return ['none', 'both', 'horizontal', 'vertical'].includes(value)
}

const validator = (key: string, value: ValueType): boolean => {
  const callKeys = {
    areaDragRule: dragValidator,
    crossColor: colorValidator,
    sliderColor: colorValidator,
    scrollBarColor: colorValidator,
    scrollBarBorderColor: colorValidator,
  }

  if (!(key in callKeys)) {
    return true
  }

  return (callKeys as ValidatorKeyType)[key](value)
}

export default {
  name: 'scrollbar',
  directive: {
    inserted(el: Element, binding: DirectiveBinding) {
      const propsOptions = binding.value
      const component = new Vue(UiScrollbar)
      const isValidationValue = (options: OptionsType = {}) => {
        return Object.entries(options).every(([key, value]) => {
          const validationResult = validator(key, value)

          if (!validationResult) {
            console.error(
              `[Directive v-scrollbar]: Invalid prop: custom validator check failed for prop "${key}".`
            )
          }

          return validationResult
        })
      }

      if (!isValidationValue(propsOptions)) {
        return
      }

      Vue.set(component, 'el', el)

      if (propsOptions) {
        Object.entries(propsOptions).forEach(([key, value]) => {
          Vue.set(component.$props, key, value)
        })
      }

      component.$mount(el)
    },
  },
}
