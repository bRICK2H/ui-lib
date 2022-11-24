<template>
  <div
    class="ui-input"
    :class="{
      'ui-input__has-label': label,
    }"
  >
    <span v-if="label">
      {{ label }}
    </span>

    <div class="ui-input__content">
      <ui-scrollbar :enable-internal-mode="false">
        <!-- Textarea -->
        <textarea
          v-if="isTextarea"
          v-offset-height-textarea
          :value="value"
          class="ui-input__textarea-content"
          @input="handleTextarea($event)"
        />
      </ui-scrollbar>

      <!-- Input area -->
      <input
        v-if="!isTextarea"
        :type="type"
        :value="value"
        class="ui-input__input-content"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'UiInput',
  props: {
    type: {
      type: String,
      default: 'text',
    },
    label: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number],
      required: true,
    },
  },
  computed: {
    isTextarea() {
      return this.type === 'textarea'
    },
  },
  methods: {
    handleTextarea(event) {
      // console.log(event.target.scrollHeight)
    },
  },
}
</script>

<style lang="scss">
@import 'input';
</style>
