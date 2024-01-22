import Binder from '@/components/_global/binder/ui-binder.vue'
import { VueConstructor } from 'vue/types/umd'

export default {
  install(Vue: VueConstructor) {
    console.log('install')
    // Vue.prototype = new Vue(Binder)
    // Vue.prototype.$options.go = [() => ({})]

    Vue.prototype = new Vue(Binder)
    console.log(Vue.prototype)
  },

  // install: (Vue: VueConstructor) => (Vue.prototype = new Vue(Binder)),
}
