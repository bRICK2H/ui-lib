<template>
  <div style="margin-bottom: 30px">
    <div
      style="
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        margin-bottom: 20px;
        position: sticky;
        top: 0;
        background: #fff;
        z-index: 30;
        padding: 15px;
        border-bottom: 1px solid;
      "
    >
      <h2
        style="font-size: 30px; margin-bottom: 20px; text-transform: capitalize"
      >
        Variants
      </h2>

      <div style="display: flex; flex-direction: column">
        <div style="margin-bottom: 16px">
          <ui-button
            variant="primary"
            ignore-rules
            right-indent
            @click="variant = 'primary'"
            >Primary</ui-button
          >
          <ui-button
            variant="success"
            ignore-rules
            right-indent
            @click="variant = 'success'"
            >Success</ui-button
          >
          <ui-button
            variant="danger"
            ignore-rules
            right-indent
            @click="variant = 'danger'"
            >Danger</ui-button
          >
          <ui-button
            variant="critical"
            ignore-rules
            right-indent
            @click="variant = 'critical'"
            >Critical</ui-button
          >
          <div
            style="
              display: inline-block;
              padding: 10px;
              background: rgba(0, 32, 77, 1);
            "
          >
            <ui-button
              variant="translucent"
              ignore-rules
              @click="variant = 'translucent'"
              >Translucent</ui-button
            >
          </div>
        </div>
        <div style="margin-bottom: 16px">
          <ui-button
            variant="tonal-primary"
            ignore-rules
            right-indent
            @click="variant = 'tonal-primary'"
            >Tonal-primary</ui-button
          >
          <ui-button
            variant="tonal-success"
            ignore-rules
            right-indent
            @click="variant = 'tonal-success'"
            >Tonal-success</ui-button
          >
          <ui-button
            variant="tonal-danger"
            ignore-rules
            right-indent
            @click="variant = 'tonal-danger'"
            >Tonal-danger</ui-button
          >
          <ui-button
            variant="tonal-critical"
            ignore-rules
            right-indent
            @click="variant = 'tonal-critical'"
            >Tonal-critical</ui-button
          >
        </div>
        <div style="margin-bottom: 16px">
          <ui-button
            variant="outline-primary"
            ignore-rules
            right-indent
            @click="variant = 'outline-primary'"
            >Outline-primary</ui-button
          >
          <ui-button
            variant="outline-success"
            ignore-rules
            right-indent
            @click="variant = 'outline-success'"
            >Outline-success</ui-button
          >
          <ui-button
            variant="outline-danger"
            ignore-rules
            right-indent
            @click="variant = 'outline-danger'"
            >Outline-danger</ui-button
          >
          <ui-button
            variant="outline-critical"
            ignore-rules
            right-indent
            @click="variant = 'outline-critical'"
            >Outline-critical</ui-button
          >
        </div>
        <div style="margin-bottom: 16px">
          <ui-button
            variant="ghost-primary"
            ignore-rules
            right-indent
            @click="variant = 'ghost-primary'"
            >Ghost-primary</ui-button
          >
          <ui-button
            variant="ghost-success"
            ignore-rules
            right-indent
            @click="variant = 'ghost-success'"
            >Ghost-success</ui-button
          >
          <ui-button
            variant="ghost-danger"
            ignore-rules
            right-indent
            @click="variant = 'ghost-danger'"
            >Ghost-danger</ui-button
          >
          <ui-button
            variant="ghost-critical"
            ignore-rules
            right-indent
            @click="variant = 'ghost-critical'"
            >Ghost-critical</ui-button
          >
        </div>
        <div style="margin-bottom: 16px">
          <ui-button
            variant="text-primary"
            ignore-rules
            right-indent
            @click="variant = 'text-primary'"
            >Text-primary</ui-button
          >
          <ui-button
            variant="text-success"
            ignore-rules
            right-indent
            @click="variant = 'text-success'"
            >Text-success</ui-button
          >
          <ui-button
            variant="text-danger"
            ignore-rules
            right-indent
            @click="variant = 'text-danger'"
            >Text-danger</ui-button
          >
          <ui-button
            variant="text-critical"
            ignore-rules
            right-indent
            @click="variant = 'text-critical'"
            >Text-critical</ui-button
          >
        </div>
      </div>
    </div>

    <div style="border: 1px solid #444; padding: 20px; border-radius: 10px">
      <div
        style="
          display: flex;
          justify-content: space-between;
          margin-bottom: 40px;
        "
      >
        <h2 style="font-size: 30px; text-transform: capitalize">
          {{ variant }}
        </h2>
      </div>

      <!-- FAB -->
      <div
        :style="{
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '20px',
          color: variant === 'translucent' ? '#fff' : '#000',
          background: variant === 'translucent' ? '#00204d' : '#f4f7fc',
        }"
      >
        <h4 style="margin-bottom: 0 0 20px 0; font-size: 18px">FAB</h4>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-evenly;
          "
        >
          <div
            style="
              flex: 1;
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-right: 20px;
            "
          >
            <h4 style="margin-bottom: 10px">lg (40px)</h4>
            <ui-button
              fab
              icon="add"
              size="lg"
              :variant="variant"
              type="reset"
            >
            </ui-button>
          </div>

          <div
            style="
              flex: 1;
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-right: 20px;
            "
          >
            <h4 style="margin-bottom: 10px">xl (56px)</h4>
            <ui-button
              fab
              icon="add"
              size="xl"
              :variant="variant"
            >
            </ui-button>
          </div>

          <div
            style="
              flex: 1;
              display: flex;
              flex-direction: column;
              align-items: center;
              margin-right: 20px;
            "
          >
            <h4 style="margin-bottom: 10px">xxl (96px)</h4>
            <ui-button
              fab
              icon="add"
              size="xxl"
              :variant="variant"
              autofocus
            >
            </ui-button>
          </div>
        </div>
      </div>

      <!-- Sizes -->

      <!-- xs -->
      <div
        :style="{
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '20px',
          color: variant === 'translucent' ? '#fff' : '#000',
          background: variant === 'translucent' ? '#00204d' : '#f4f7fc',
        }"
      >
        <h1 style="margin: 0 0 15px 0; font-size: 18px">xs size (20px)</h1>
        <div style="display: flex; flex-direction: column">
          <div style="margin-bottom: 10px">
            <h1 style="margin: 0 0 5px 0; font-size: 14px">Basic</h1>

            <div style="display: flex">
              <ui-button
                size="xs"
                :variant="variant"
                right-indent
              >
                Button
              </ui-button>

              <ui-button
                disabled
                size="xs"
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
                size="xs"
                :variant="variant"
                right-indent
              >
                Button
              </ui-button>

              <ui-button
                icon="add"
                size="xs"
                :variant="variant"
                right-icon
                right-indent
              >
                Button
              </ui-button>

              <ui-button
                icon="add"
                size="xs"
                :variant="variant"
              >
              </ui-button>
            </div>
          </div>

          <div style="margin-bottom: 10px">
            <h1 style="margin: 0 0 5px 0; font-size: 14px">Slot icon</h1>

            <div style="display: flex">
              <ui-button
                size="xs"
                right-indent
                :variant="variant"
              >
                <ui-icon
                  width="12"
                  height="12"
                  name="add"
                />
                Button
              </ui-button>

              <ui-button
                size="xs"
                :variant="variant"
                right-indent
              >
                Button
                <ui-icon
                  width="12"
                  height="12"
                  name="add"
                />
              </ui-button>

              <ui-button
                size="xs"
                :variant="variant"
                show-hover-hint
              >
                <ui-icon
                  width="12"
                  height="12"
                  name="add"
                />
              </ui-button>
            </div>
          </div>

          <div style="margin-bottom: 10px">
            <h1 style="margin: 0 0 5px 0; font-size: 14px">Loading</h1>

            <div style="display: flex">
              <ui-button
                size="xs"
                right-indent
                :variant="variant"
                loading
                @click="clickLoading"
              >
                Active
              </ui-button>

              <ui-button
                icon="add"
                size="xs"
                right-indent
                :variant="variant"
                :loading="isLoading"
                @click="clickLoading"
              >
                Button
              </ui-button>

              <ui-button
                icon="add"
                size="xs"
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
                size="xs"
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
              size="xs"
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
              size="xs"
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
                size="xs"
                right-indent
                show-hover-hint
                :variant="variant"
              >
                <ui-icon
                  name="add"
                  width="12"
                  height="12"
                />
                Button
              </ui-button>
              <ui-button
                size="xs"
                right-indent
                show-hover-hint
                :variant="variant"
              >
                Button
                <ui-icon
                  name="add"
                  width="12"
                  height="12"
                />
              </ui-button>

              <ui-button
                size="xs"
                right-indent
                show-hover-hint
                :variant="variant"
              >
                <div class="custom-content-button-wrapper">
                  <div>Long label text button with Icon</div>
                  <ui-icon
                    name="add"
                    width="12"
                    height="12"
                  />
                </div>
              </ui-button>
              <ui-button
                size="xs"
                show-hover-hint
                :variant="variant"
              >
                <div class="custom-content-button-wrapper">
                  <ui-icon
                    name="add"
                    width="12"
                    height="12"
                  />
                  <div>Long label text button with Icon</div>
                </div>
              </ui-button>
            </div>
          </div>
        </div>
      </div>

      <!-- sm -->
      <div
        :style="{
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '20px',
          color: variant === 'translucent' ? '#fff' : '#000',
          background: variant === 'translucent' ? '#00204d' : '#f4f7fc',
        }"
      >
        <h1 style="margin: 0 0 15px 0; font-size: 18px">sm size (24px)</h1>
        <div style="display: flex; flex-direction: column">
          <div style="margin-bottom: 10px">
            <h1 style="margin: 0 0 5px 0; font-size: 14px">Basic</h1>

            <div style="display: flex">
              <ui-button
                size="sm"
                :variant="variant"
                right-indent
              >
                Button
              </ui-button>

              <ui-button
                disabled
                size="sm"
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
                size="sm"
                :variant="variant"
                right-indent
              >
                Button
              </ui-button>

              <ui-button
                icon="add"
                size="sm"
                :variant="variant"
                right-icon
                right-indent
              >
                Button
              </ui-button>

              <ui-button
                icon="add"
                size="sm"
                :variant="variant"
              >
              </ui-button>
            </div>
          </div>

          <div style="margin-bottom: 10px">
            <h1 style="margin: 0 0 5px 0; font-size: 14px">Slot icon</h1>

            <div style="display: flex">
              <ui-button
                size="sm"
                right-indent
                :variant="variant"
              >
                <ui-icon
                  width="12"
                  height="12"
                  name="add"
                />
                Button
              </ui-button>

              <ui-button
                size="sm"
                :variant="variant"
                right-indent
              >
                Button
                <ui-icon
                  width="12"
                  height="12"
                  name="add"
                />
              </ui-button>

              <ui-button
                size="sm"
                :variant="variant"
                show-hover-hint
              >
                <ui-icon
                  width="12"
                  height="12"
                  name="add"
                />
              </ui-button>
            </div>
          </div>

          <div style="margin-bottom: 10px">
            <h1 style="margin: 0 0 5px 0; font-size: 14px">Loading</h1>

            <div style="display: flex">
              <ui-button
                size="sm"
                right-indent
                :variant="variant"
                loading
                @click="clickLoading"
              >
                Active
              </ui-button>

              <ui-button
                icon="add"
                size="sm"
                right-indent
                :variant="variant"
                :loading="isLoading"
                @click="clickLoading"
              >
                Button
              </ui-button>

              <ui-button
                icon="add"
                size="sm"
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
                size="sm"
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
              size="sm"
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
              size="sm"
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
                size="sm"
                right-indent
                show-hover-hint
                :variant="variant"
              >
                <ui-icon
                  name="add"
                  width="12"
                  height="12"
                />
                Button
              </ui-button>
              <ui-button
                size="sm"
                right-indent
                show-hover-hint
                :variant="variant"
              >
                Button
                <ui-icon
                  name="add"
                  width="12"
                  height="12"
                />
              </ui-button>

              <ui-button
                size="sm"
                right-indent
                show-hover-hint
                :variant="variant"
              >
                <div class="custom-content-button-wrapper">
                  <div>Long label text button with Icon</div>
                  <ui-icon
                    name="add"
                    width="12"
                    height="12"
                  />
                </div>
              </ui-button>
              <ui-button
                size="sm"
                show-hover-hint
                :variant="variant"
              >
                <div class="custom-content-button-wrapper">
                  <ui-icon
                    name="add"
                    width="12"
                    height="12"
                  />
                  <div>Long label text button with Icon</div>
                </div>
              </ui-button>
            </div>
          </div>
        </div>
      </div>

      <!-- md -->
      <div
        :style="{
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '20px',
          color: variant === 'translucent' ? '#fff' : '#000',
          background: variant === 'translucent' ? '#00204d' : '#f4f7fc',
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
          borderRadius: '20px',
          color: variant === 'translucent' ? '#fff' : '#000',
          background: variant === 'translucent' ? '#00204d' : '#f4f7fc',
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

      <!-- xl -->
      <div
        :style="{
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '20px',
          color: variant === 'translucent' ? '#fff' : '#000',
          background: variant === 'translucent' ? '#00204d' : '#f4f7fc',
        }"
      >
        <h1 style="margin: 0 0 15px 0; font-size: 18px">xl size (56px)</h1>
        <div style="display: flex; flex-direction: column">
          <div style="margin-bottom: 10px">
            <h1 style="margin: 0 0 5px 0; font-size: 14px">Basic</h1>

            <div style="display: flex">
              <ui-button
                size="xl"
                :variant="variant"
                right-indent
              >
                Button
              </ui-button>

              <ui-button
                disabled
                size="xl"
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
                size="xl"
                :variant="variant"
                right-indent
              >
                Button
              </ui-button>

              <ui-button
                icon="add"
                size="xl"
                :variant="variant"
                right-icon
                right-indent
              >
                Button
              </ui-button>

              <ui-button
                icon="add"
                size="xl"
                :variant="variant"
              >
              </ui-button>
            </div>
          </div>

          <div style="margin-bottom: 10px">
            <h1 style="margin: 0 0 5px 0; font-size: 14px">Slot icon</h1>

            <div style="display: flex">
              <ui-button
                size="xl"
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
                size="xl"
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
                size="xl"
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
                size="xl"
                right-indent
                :variant="variant"
                loading
                @click="clickLoading"
              >
                Active
              </ui-button>

              <ui-button
                icon="add"
                size="xl"
                right-indent
                :variant="variant"
                :loading="isLoading"
                @click="clickLoading"
              >
                Button
              </ui-button>

              <ui-button
                icon="add"
                size="xl"
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
                size="xl"
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
              size="xl"
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
              size="xl"
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
                size="xl"
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
                size="xl"
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
                size="xl"
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
                size="xl"
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

      <!-- xxl -->
      <div
        :style="{
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '20px',
          color: variant === 'translucent' ? '#fff' : '#000',
          background: variant === 'translucent' ? '#00204d' : '#f4f7fc',
        }"
      >
        <h1 style="margin: 0 0 15px 0; font-size: 18px">
          xxl size (96px)
        </h1>
        <div style="display: flex; flex-direction: column">
          <div style="margin-bottom: 10px">
            <h1 style="margin: 0 0 5px 0; font-size: 14px">Basic</h1>

            <div style="display: flex">
              <ui-button
                size="xxl"
                :variant="variant"
                right-indent
              >
                Button
              </ui-button>

              <ui-button
                disabled
                size="xxl"
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
                size="xxl"
                :variant="variant"
                right-indent
              >
                Button
              </ui-button>

              <ui-button
                icon="add"
                size="xxl"
                :variant="variant"
                right-icon
                right-indent
              >
                Button
              </ui-button>

              <ui-button
                icon="add"
                size="xxl"
                :variant="variant"
              >
              </ui-button>
            </div>
          </div>

          <div style="margin-bottom: 10px">
            <h1 style="margin: 0 0 5px 0; font-size: 14px">Slot icon</h1>

            <div style="display: flex">
              <ui-button
                size="xxl"
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
                size="xxl"
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
                size="xxl"
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
                size="xxl"
                right-indent
                :variant="variant"
                loading
                @click="clickLoading"
              >
                Active
              </ui-button>

              <ui-button
                icon="add"
                size="xxl"
                right-indent
                :variant="variant"
                :loading="isLoading"
                @click="clickLoading"
              >
                Button
              </ui-button>

              <ui-button
                icon="add"
                size="xxl"
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
                size="xxl"
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
              size="xxl"
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
              size="xxl"
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
                size="xxl"
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
                size="xxl"
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
                size="xxl"
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
                size="xxl"
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

    <!-- <div
      :style="{
        padding: '15px',
        marginBottom: '20px',
        borderRadius: '20px',
        border: '1px solid #aaa',
      }"
    >
      <h1>Custom</h1>
      <div style="display: flex; margin: 0 0 15px 0; font-size: 218x;"></div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'VPrimary',
  data: () => ({
    isLoading: false,
    variant: 'primary',
  }),
  methods: {
    clickLoading() {
      console.log('click loading')
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
