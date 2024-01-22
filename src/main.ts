import Vue from 'vue'
import UiLib from './ui-lib.vue'
import Components from './index'
// import Binder from '@/components/_global/binder'
import Loader from '@/components/_global/loader'

// Vue.use(Binder)
Vue.use(Loader)
Vue.use(Components)
Vue.config.productionTip = false

new Vue({
  render: (h) => h(UiLib),
}).$mount('#app')
