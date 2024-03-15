<template>
  <div style="height: 100%; gap: 24px; display: flex; flex-direction: column">
    <div style="min-height: 0px; border: 1px solid #444"></div>
    <ui-button @click="openFilter"> Открыть фильтр </ui-button>

    <!-- <ui-filter
        :visible="visible"
        @close="closeFilter"
      /> -->
    <div style="display: flex; justify-content: space-between; height: 100%">
      <ui-filters
        v-model="visible"
        :width="400"
        @apply-filters="apply"
        @clear-filters="clear"
      >
        <ui-filter-row
          v-slot="{ row }"
          prop-name="checkbox"
          :default-value="false"
        >
          <ui-checkbox
            label="Чекбокс"
            :value="row.checkbox"
            :checked="row.checkbox"
            @change="(event) => (row.checkbox = event.target.checked)"
          />
        </ui-filter-row>

        <ui-filter-row
          v-slot="{ row }"
          prop-name="input"
        >
          <input
            type="text"
            :value="row.input"
            @input="(event) => (row.input = event.target.value)"
          />
        </ui-filter-row>

        <ui-filter-group label="Компьютеры">
          <ui-filter-row
            v-slot="{ row }"
            prop-name="radio"
            :default-value="false"
          >
            <ui-radio
              label="Радио"
              :value="row.radio"
              :checked="row.radio"
              @change="(event) => (row.radio = event.target.checked)"
            />
          </ui-filter-row>

          <ui-filter-row
            v-slot="{ row }"
            prop-name="input2"
          >
            <input
              v-model="row.input2"
              type="text"
            />
          </ui-filter-row>
        </ui-filter-group>

        <ui-filter-group label="Число"> 3 </ui-filter-group>

        <ui-filter-group
          label="Очень длинное описание лэйбла"
          icon-name="cross"
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque cum
          facilis sapiente eligendi libero minima? Aliquid, obcaecati laboriosam
          minima voluptatum harum, perspiciatis incidunt quia quaerat
          voluptatibus quas maxime illum odio.
        </ui-filter-group>
      </ui-filters>

      <ui-filters
        v-model="visible"
        :width="500"
        @apply-filters="apply"
        @clear-filters="clear"
      >
        <ui-filter-row
          v-slot="{ row }"
          prop-name="checkbox"
          :default-value="false"
        >
          <ui-checkbox
            label="Чекбокс"
            :value="row.checkbox"
            :checked="row.checkbox"
            @change="(event) => (row.checkbox = event.target.checked)"
          />
        </ui-filter-row>

        <ui-filter-row
          v-slot="{ row }"
          prop-name="input"
        >
          <input
            type="text"
            :value="row.input"
            @input="(event) => (row.input = event.target.value)"
          />
        </ui-filter-row>

        <ui-filter-group label="Компьютеры">
          <ui-filter-row
            v-slot="{ row }"
            prop-name="radio"
            :default-value="false"
          >
            <ui-radio
              label="Радио"
              :value="row.radio"
              :checked="row.radio"
              @change="(event) => (row.radio = event.target.checked)"
            />
          </ui-filter-row>

          <ui-filter-row
            v-slot="{ row }"
            prop-name="input2"
          >
            <input
              v-model="row.input2"
              type="text"
            />
          </ui-filter-row>
        </ui-filter-group>

        <ui-filter-group label="Число"> 3 </ui-filter-group>

        <ui-filter-group
          label="Очень длинное описание лэйбла"
          icon-name="cross"
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque cum
          facilis sapiente eligendi libero minima? Aliquid, obcaecati laboriosam
          minima voluptatum harum, perspiciatis incidunt quia quaerat
          voluptatibus quas maxime illum odio.
        </ui-filter-group>
      </ui-filters>
    </div>
  </div>
</template>

<script>
import UiFilterRow from '@/components/filters/ui-filter-row.vue'
import UiFilterGroup from '@/components/filters/ui-filter-group.vue'
import UiCheckbox from '@/components/checkbox/ui-checkbox.vue'

export default {
  name: 'VTemplateFilters',

  components: {
    UiFilterRow,
    UiFilterGroup,
    // UiCheckbox,
  },

  data: () => ({
    visible: true,
  }),

  methods: {
    openFilter() {
      this.visible = true
    },

    closeFilter(v) {
      console.log('closeFilter', v)
      this.visible = false
    },

    apply(result) {
      console.log('apply', result)
    },

    clear(result) {
      console.log('clear', result)
    },
  },
}
</script>

<style></style>
