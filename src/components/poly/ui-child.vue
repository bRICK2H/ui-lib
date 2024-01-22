<template>
  <div id="child">
    @
    <slot
      name="test"
      v-bind="{ a: 4 }"
    />
  </div>
</template>

<script>
export default {
  name: 'UiChild',
}
</script>

<style></style>
