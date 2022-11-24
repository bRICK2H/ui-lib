import Vue from 'vue'
import UiLib from './ui-lib.vue'
import Components from './index'

Vue.use(Components)
Vue.config.productionTip = false

new Vue({
  render: (h) => h(UiLib),
}).$mount('#app')
