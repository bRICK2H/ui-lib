<template>
  <div style="width: 100%; margin-top: 10px">
    <span
      style="
        width: 100%;
        display: inline-block;
        text-align: center;
        font-size: 18px;
      "
    >
      Colors
    </span>
    <div
      style="
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 16px;
        margin: 10px 0;
        position: sticky;
        top: 0;
        z-index: 9999;
        border-bottom: 2px solid #fff;
        background: #d2ddeb;
      "
    >
      <ui-button
        size="lg"
        fluid
        variant="ghost-primary"
        ignore-rules
        right-indent
        @click="variant = 'ghost-primary'"
        >Primary</ui-button
      >
      <ui-button
        size="lg"
        fluid
        variant="ghost-success"
        ignore-rules
        right-indent
        @click="variant = 'ghost-success'"
        >Success</ui-button
      >
      <ui-button
        size="lg"
        fluid
        variant="ghost-danger"
        ignore-rules
        right-indent
        @click="variant = 'ghost-danger'"
        >Danger</ui-button
      >
      <ui-button
        size="lg"
        fluid
        variant="ghost-critical"
        ignore-rules
        @click="variant = 'ghost-critical'"
        >Critical</ui-button
      >
    </div>

    <div v-if="variant">
      <div
        style="display: flex; justify-content: space-between; margin: 20px 0"
      >
        <h2 style="font-size: 30px">Variant: {{ variant }}</h2>
      </div>
      <!-- Sizes -->

      <!-- md -->
      <div
        :style="{
          padding: '15px',
          marginBottom: '20px',
          color: variant === 'translucent' ? '#fff' : '#000',
          background: variant === 'translucent' ? '#00204d' : '#e9f0f9',
        }"
      >
        <h1 style="margin: 0 0 15px 0; font-size: 18px">md size (32px)</h1>
        <div style="display: flex; flex-direction: column">
          <div style="margin-bottom: 10px">
            <h1 style="margin: 0 0 5px 0; font-size: 14px">Basic</h1>

            <div style="display: flex">
              <ui-button
                size="md"
                :variant="variant"
                right-indent
              >
                Button
              </ui-button>

              <ui-button
                disabled
                size="md"
                :variant="variant"
              >
                Button disabled
              </ui-button>
            </div>
          </div>

          <div style="margin-bottom: 10px">
            <h1 style="margin: 0 0 5px 0; font-size: 14px">Props icon</h1>

            <div style="display: flex">
              <ui-button
                icon="add"
                size="md"
                :variant="variant"
                right-indent
              >
                Button
              </ui-button>

              <ui-button
                icon="add"
                size="md"
                :variant="variant"
                right-icon
                right-indent
              >
                Button
              </ui-button>

              <ui-button
                icon="add"
                size="md"
                :variant="variant"
              >
              </ui-button>
            </div>
          </div>

          <div style="margin-bottom: 10px">
            <h1 style="margin: 0 0 5px 0; font-size: 14px">Slot icon</h1>

            <div style="display: flex">
              <ui-button
                size="md"
                right-indent
                :variant="variant"
              >
                <ui-icon
                  width="16"
                  height="16"
                  name="add"
                />
                Button
              </ui-button>

              <ui-button
                size="md"
                :variant="variant"
                right-indent
              >
                Button
                <ui-icon
                  width="16"
                  height="16"
                  name="add"
                />
              </ui-button>

              <ui-button
                size="md"
                :variant="variant"
                show-hover-hint
              >
                <ui-icon
                  width="16"
                  height="16"
                  name="add"
                />
              </ui-button>
            </div>
          </div>

          <div style="margin-bottom: 10px">
            <h1 style="margin: 0 0 5px 0; font-size: 14px">Loading</h1>

            <div style="display: flex">
              <ui-button
                size="md"
                right-indent
                :variant="variant"
                loading
                @click="clickLoading"
              >
                Active
              </ui-button>

              <ui-button
                icon="add"
                size="md"
                right-indent
                :variant="variant"
                :loading="isLoading"
                @click="clickLoading"
              >
                Button
              </ui-button>

              <ui-button
                icon="add"
                size="md"
                :variant="variant"
                :loading="isLoading"
                right-indent
                right-icon
                @click="clickLoading"
              >
                Button
              </ui-button>

              <ui-button
                icon="add"
                size="md"
                :variant="variant"
                :loading="isLoading"
                show-hover-hint
                @click="clickLoading"
              >
              </ui-button>
            </div>
          </div>

          <div style="margin-bottom: 10px">
            <h1 style="margin: 0 0 5px 0; font-size: 14px">Fluid</h1>
            <ui-button
              size="md"
              :variant="variant"
              fluid
              right-indent
            >
              Button
            </ui-button>
          </div>

          <div style="margin-bottom: 10px">
            <h1 style="margin: 0 0 5px 0; font-size: 14px">Multiline</h1>
            <ui-button
              size="md"
              multiline
              style="max-width: 80px"
              show-hover-hint
              :variant="variant"
              >Multi-line button</ui-button
            >
          </div>

          <div>
            <h1 style="margin: 0 0 5px 0; font-size: 14px">
              Custom content using slots (with show hover hint)
            </h1>

            <div style="display: flex">
              <ui-button
                size="md"
                right-indent
                show-hover-hint
                :variant="variant"
              >
                <ui-icon
                  name="add"
                  width="16"
                  height="16"
                />
                Button
              </ui-button>
              <ui-button
                size="md"
                right-indent
                show-hover-hint
                :variant="variant"
              >
                Button
                <ui-icon
                  name="add"
                  width="16"
                  height="16"
                />
              </ui-button>

              <ui-button
                size="md"
                right-indent
                show-hover-hint
                :variant="variant"
              >
                <div class="custom-content-button-wrapper">
                  <div>Long label text button with Icon</div>
                  <ui-icon
                    name="add"
                    width="16"
                    height="16"
                  />
                </div>
              </ui-button>
              <ui-button
                size="md"
                show-hover-hint
                :variant="variant"
              >
                <div class="custom-content-button-wrapper">
                  <ui-icon
                    name="add"
                    width="16"
                    height="16"
                  />
                  <div>Long label text button with Icon</div>
                </div>
              </ui-button>
            </div>
          </div>
        </div>
      </div>

      <!-- lg -->
      <div
        :style="{
          padding: '15px',
          marginBottom: '20px',
          color: variant === 'translucent' ? '#fff' : '#000',
          background: variant === 'translucent' ? '#00204d' : '#e9f0f9',
        }"
      >
        <h1 style="margin: 0 0 15px 0; font-size: 18px">lg size (40px)</h1>
        <div style="display: flex; flex-direction: column">
          <div style="margin-bottom: 10px">
            <h1 style="margin: 0 0 5px 0; font-size: 14px">Basic</h1>

            <div style="display: flex">
              <ui-button
                size="lg"
                :variant="variant"
                right-indent
              >
                Button
              </ui-button>

              <ui-button
                disabled
                size="lg"
                :variant="variant"
              >
                Button disabled
              </ui-button>
            </div>
          </div>

          <div style="margin-bottom: 10px">
            <h1 style="margin: 0 0 5px 0; font-size: 14px">Props icon</h1>

            <div style="display: flex">
              <ui-button
                icon="add"
                size="lg"
                :variant="variant"
                right-indent
              >
                Button
              </ui-button>

              <ui-button
                icon="add"
                size="lg"
                :variant="variant"
                right-icon
                right-indent
              >
                Button
              </ui-button>

              <ui-button
                icon="add"
                size="lg"
                :variant="variant"
              >
              </ui-button>
            </div>
          </div>

          <div style="margin-bottom: 10px">
            <h1 style="margin: 0 0 5px 0; font-size: 14px">Slot icon</h1>

            <div style="display: flex">
              <ui-button
                size="lg"
                right-indent
                :variant="variant"
              >
                <ui-icon
                  width="16"
                  height="16"
                  name="add"
                />
                Button
              </ui-button>

              <ui-button
                size="lg"
                :variant="variant"
                right-indent
              >
                Button
                <ui-icon
                  width="16"
                  height="16"
                  name="add"
                />
              </ui-button>

              <ui-button
                size="lg"
                :variant="variant"
                show-hover-hint
              >
                <ui-icon
                  width="16"
                  height="16"
                  name="add"
                />
              </ui-button>
            </div>
          </div>

          <div style="margin-bottom: 10px">
            <h1 style="margin: 0 0 5px 0; font-size: 14px">Loading</h1>

            <div style="display: flex">
              <ui-button
                size="lg"
                right-indent
                :variant="variant"
                loading
                @click="clickLoading"
              >
                Active
              </ui-button>

              <ui-button
                icon="add"
                size="lg"
                right-indent
                :variant="variant"
                :loading="isLoading"
                @click="clickLoading"
              >
                Button
              </ui-button>

              <ui-button
                icon="add"
                size="lg"
                :variant="variant"
                :loading="isLoading"
                right-icon
                right-indent
                @click="clickLoading"
              >
                Button
              </ui-button>

              <ui-button
                icon="add"
                size="lg"
                :variant="variant"
                :loading="isLoading"
                show-hover-hint
                @click="clickLoading"
              >
              </ui-button>
            </div>
          </div>

          <div style="margin-bottom: 10px">
            <h1 style="margin: 0 0 5px 0; font-size: 14px">Fluid</h1>
            <ui-button
              size="lg"
              :variant="variant"
              fluid
              right-indent
            >
              Button
            </ui-button>
          </div>

          <div style="margin-bottom: 10px">
            <h1 style="margin: 0 0 5px 0; font-size: 14px">Multiline</h1>
            <ui-button
              size="lg"
              multiline
              style="max-width: 80px"
              show-hover-hint
              :variant="variant"
              >Multi-line button</ui-button
            >
          </div>

          <div>
            <h1 style="margin: 0 0 5px 0; font-size: 14px">
              Custom content using slots (with show hover hint)
            </h1>

            <div style="display: flex">
              <ui-button
                size="lg"
                right-indent
                show-hover-hint
                :variant="variant"
              >
                <ui-icon
                  name="add"
                  width="16"
                  height="16"
                />
                Button
              </ui-button>
              <ui-button
                size="lg"
                right-indent
                show-hover-hint
                :variant="variant"
              >
                Button
                <ui-icon
                  name="add"
                  width="16"
                  height="16"
                />
              </ui-button>

              <ui-button
                size="lg"
                right-indent
                show-hover-hint
                :variant="variant"
              >
                <div class="custom-content-button-wrapper">
                  <div>Long label text button with Icon</div>
                  <ui-icon
                    name="add"
                    width="16"
                    height="16"
                  />
                </div>
              </ui-button>
              <ui-button
                size="lg"
                show-hover-hint
                :variant="variant"
              >
                <div class="custom-content-button-wrapper">
                  <ui-icon
                    name="add"
                    width="16"
                    height="16"
                  />
                  <div>Long label text button with Icon</div>
                </div>
              </ui-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VButtonGhost',
  props: {
    type: {
      type: String,
      default: '',
    },
  },
  data: () => ({
    variant: 'ghost-primary',
    isLoading: false,
  }),
  methods: {
    clickLoading() {
      this.isLoading = true
      setTimeout(() => (this.isLoading = false), 5000)
    },
  },
}
</script>

<style lang="scss">
.custom-content-button-wrapper {
  min-width: 0;
  max-width: 200px;
  display: flex;
  align-items: center;
}
</style>
