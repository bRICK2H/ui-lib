import type { IProps } from './types'
import { VueConstructor } from 'vue'

import UiLoader from '@/components/_global/loader/ui-loader.vue'

/**
 * ? getTargetElement
 * Получить целевой узел, в области которого будет монтироваться компонент
 *
 * @param {IProps} props пропсы компонента
 * @returns {HTMLElement} целевой узел
 */
const getTargetElement = (props: IProps): HTMLElement => {
  return document.querySelector(props.target) || document.body
}

/**
 * ? componentMount
 * Смонтировать компонент(ы)
 *
 * @param {VueConstructor} Vue базовый конструктор
 * @param {HTMLElement} areaElement целевой узел (область монтирования компонента)
 * @returns {void}
 */
const componentMount = (
  Vue: VueConstructor,
  areaElement: HTMLElement
): void => {
  if (loaderStack.has(areaElement)) {
    return
  }

  const Loader = Vue.extend(UiLoader)
  const rootElement = document.createElement('div')
  const hookElement = document.createElement('div')

  areaElement.append(rootElement)
  rootElement.append(hookElement)
  rootElement.classList.add(`ui-loader-${++loaderCount}`)

  loaderStack.set(areaElement, new Loader())
  loaderStack.get(areaElement).$mount(hookElement)
}

/**
 * ? setPropsToComponent
 * Установить значения пропсов
 *
 * @param {VueConstructor} Vue базовый конструктор
 * @param {IProps} props пропсы компонента
 * @param {HTMLElement} areaElement целевой узел (область монтирования компонента)
 * @returns {void}
 */
const setPropsToComponent = (
  Vue: VueConstructor,
  props: IProps,
  areaElement: HTMLElement
): void => {
  for (const prop in props) {
    Vue.set(
      loaderStack.get(areaElement).$props,
      prop,
      props[prop as keyof IProps]
    )
  }
}

let loaderCount = 0
const loaderStack = new Map()

export default {
  install(Vue: VueConstructor) {
    Vue.component('UiLoader', UiLoader)
    Vue.prototype.$loader = (props: IProps) => {
      const areaElement = getTargetElement(props)

      componentMount(Vue, areaElement)
      setPropsToComponent(Vue, props, areaElement)
    }
  },
}
