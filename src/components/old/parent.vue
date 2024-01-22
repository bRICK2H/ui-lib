<template>
  <div>
    <div class="parent">
      <UiChild1 />
      <UiChild2 />
    </div>

    <ui-button @click="state.count"> Update </ui-button>
  </div>
</template>

<script>
import state from './state'

import UiChild1 from './child1.vue'
import UiChild2 from './child2.vue'

export default {
  name: 'IParent',
  components: {
    UiChild1,
    UiChild2,
  },

  data: () => ({
    state,
  }),
}
</script>

<style lang="scss">
.parent {
  display: flex;
}
</style>
