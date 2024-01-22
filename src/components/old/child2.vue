<template>
  <div class="child1">
    {{ state.newValue }}
  </div>
</template>

<script>
import state from './state'

export default {
  name: 'IChild2',

  data: () => ({
    state,
    child2: 2,
  }),
}
</script>

<style lang="scss">
.child1 {
  flex: 1 1 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid blue;
}
</style>
