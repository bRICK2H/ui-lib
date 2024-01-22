<template>
  <div class="test">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'VTest',
}
</script>

<style lang="scss">
.test {
  border: 1px solid #000;
}
</style>
