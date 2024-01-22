<template>
  <div style="width: 100%">
    <div>
      <span
        style="
          width: 100%;
          display: inline-block;
          text-align: center;
          font-size: 18px;
        "
      >
        Types
      </span>
      <div
        style="
          width: 100%;
          display: flex;
          justify-content: center;
          padding: 10px 10px 20px 10px;
          border-bottom: 1px solid #00204d;
        "
      >
        <ui-button
          size="md"
          right-indent
          ignore-rules
          @click="type = 'filled'"
        >
          Filled
        </ui-button>
        <ui-button
          size="md"
          variant="tonal-primary"
          right-indent
          ignore-rules
          @click="type = 'tonal'"
        >
          Tonal
        </ui-button>
        <ui-button
          size="md"
          right-indent
          ignore-rules
          variant="outline-primary"
          @click="type = 'outline'"
        >
          Outline
        </ui-button>
        <ui-button
          size="md"
          right-indent
          ignore-rules
          variant="ghost-primary"
          @click="type = 'ghost'"
        >
          Ghost
        </ui-button>
        <ui-button
          size="md"
          ignore-rules
          variant="text-primary"
          @click="type = 'text'"
        >
          Text
        </ui-button>
      </div>
    </div>
    <component
      :is="templateButton"
      :type="type"
    />
  </div>
</template>

<script>
const templates = (type) => () => import(`./v-button-${type}`)

export default {
  name: 'VButtonTemplate',
  data: () => ({
    type: 'filled',
  }),
  computed: {
    templateButton() {
      if (!this.type) {
        return ''
      }

      return templates(this.type)
    },
  },
}
</script>

<style lang="scss"></style>
