<template>
  <div style="height: 600px; gap: 24px; display: flex; flex-direction: column">
    <div style="min-height: 200px; border: 1px solid #444"></div>
    <ui-button @click="openFilter"> Открыть фильтр </ui-button>

    <div style="width: 400px; height: 500px">
      <!-- <ui-filter
        :visible="visible"
        @close="closeFilter"
      /> -->

      <ui-filters
        v-model="visible"
        @apply-filters="apply"
        @clear-filters="clear"
      >
        <ui-filter-row field-name="test" />

        <ui-filter-row
          v-slot="{ row }"
          field-name="input"
        >
          <input
            v-model="row.input"
            type="text"
          />
        </ui-filter-row>

        <ui-filter-group label="Компьютеры">
          <ui-filter-row
            v-slot="{ row }"
            field-name="input2"
          >
            <input
              v-model="row.input2"
              type="text"
            />
          </ui-filter-row>
        </ui-filter-group>

        <ui-filter-group
          label="Тут очень длинный лэйбл"
          icon-name="cross"
        >
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Atque cum
          facilis sapiente eligendi libero minima? Aliquid, obcaecati laboriosam
          minima voluptatum harum, perspiciatis incidunt quia quaerat
          voluptatibus quas maxime illum odio.
        </ui-filter-group>

        <ui-filter-group label="Облако"> 3 </ui-filter-group>
      </ui-filters>
    </div>
  </div>
</template>

<script>
import UiFilterRow from '@/components/filter/ui-filter-row.vue'
import UiFilterGroup from '@/components/filter/ui-filter-group.vue'

export default {
  name: 'VTemplateFilters',

  components: {
    UiFilterRow,
    UiFilterGroup,
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
