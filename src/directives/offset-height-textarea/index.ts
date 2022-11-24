let step = 0
let minHeight = 0
let maxHeight = 0
let initialScrollHeight = 0

const listener = (event: Event) => {
  const target = event.target

  if (!target) return
  if (!('style' in target)) return
  if (!('scrollHeight' in target)) return
  console.log('initialScrollHeight', initialScrollHeight)

  const style = target['style'] as CSSStyleDeclaration
  const currentScrollHeight = target['scrollHeight'] as number

  if (currentScrollHeight !== initialScrollHeight) {
    step = step ? step : currentScrollHeight - initialScrollHeight

    initialScrollHeight +=
      currentScrollHeight > initialScrollHeight ? step : -step

    if (initialScrollHeight < minHeight || initialScrollHeight > maxHeight) {
      return
    }

    style.height = `${initialScrollHeight}px`
  }
}

export default {
  name: 'offset-height-textarea',
  directive: {
    inserted(el: Element) {
      const { minHeight: min, maxHeight: max } = getComputedStyle(el)

      minHeight = parseInt(min, 10)
      maxHeight = parseInt(max, 10)
      initialScrollHeight = el.scrollHeight

      el.addEventListener('input', listener)
    },

    unbind(el: Element) {
      el.removeEventListener('input', listener)
    },
  },
}
