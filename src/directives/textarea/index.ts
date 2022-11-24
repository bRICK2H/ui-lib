const listener = (event: Event) => {
  console.log('listener')
}

export default {
  name: 'textarea',
  directive: {
    inserted(el: HTMLElement) {
      const { minHeight: min, maxHeight: max } = getComputedStyle(el)
      console.log('max', max)

      const offsetHeight = el.offsetHeight
      const scrollHeight = el.scrollHeight
      const minHeight = parseInt(min, 10)
      const maxHeight = parseInt(max, 10)
      // initialScrollHeight = el.scrollHeight
      console.log({ minHeight, maxHeight }, el.offsetHeight, el.scrollHeight)

      if (scrollHeight > offsetHeight) {
        el.style.height =
          !isNaN(maxHeight) && scrollHeight > maxHeight
            ? `${maxHeight}px`
            : `${scrollHeight}px`
      }

      el.addEventListener('input', listener)
    },

    unbind(el: Element) {
      el.removeEventListener('input', listener)
    },
  },
}
