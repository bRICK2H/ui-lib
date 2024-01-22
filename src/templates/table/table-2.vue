<template>
  <div>
    <ui-button
      right-indent
      @click="selectAll"
      >Select all</ui-button
    >

    <ui-button
      right-indent
      @click="cancel"
      >Cancel</ui-button
    >

    <ui-button
      right-indent
      @click="changeLabel"
      >Change label</ui-button
    >

    <ui-button
      right-indent
      @click="clearCash"
      >Clear cash</ui-button
    >

    <ui-button
      right-indent
      @click="addOuterObject"
      >Add outer object</ui-button
    >

    <ui-table
      :table-data="tData"
      :loading="isLoading"
      :outer-row-selected="selected"
      vertical-border
      show-hover-hint
      resizable-column
      row-cursor-pointer
      highlight-row
      scroll-update
      :cache-column-size="cacheColumnSize"
      @action-row="actionRow"
      @select-row="selectRow"
      @scroll-down="scrollDown"
      @scroll-right="scrollRight"
      @select-rows="selectRows"
      @sort-column="sortColumn"
      @resize-column="resizeColumn"
    >
      <div slot="empty-text">Empty text</div>
      <div
        slot="header"
        style="
          border: 1px solid #444;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: flex-end;
        "
      >
        Header2
      </div>

      <ui-table-column
        sort-by="asc"
        :label="`auto-${labelId}`"
        column-key="id"
        interactive-mode="radio"
        :disabled-row="disabledRow"
        :padding-column-x="[2, 4]"
      />

      <ui-table-column
        label="Какое-то очень длинное имя"
        sort-by="desc"
        column-key="first_name"
        class-body-cell="class-cell"
        :padding-column-x="[0, 0]"
      >
        <template #body="{ row }">
          <div style="display: flex; gap: 10px; align-items: center">
            <span>
              {{ row.first_name }}
            </span>

            <ui-icon
              size="12"
              name="arrow-short-up"
            />
          </div>
        </template>
      </ui-table-column>

      <ui-table-column
        label="Почта пользователя"
        column-key="email"
        sort-by="desc"
        align="center"
      />

      <ui-table-column
        label="Created (static 100)"
        :width="100"
      >
        <template #body="{ row }">
          {{ new Date(row.created_date).toLocaleDateString() }}
        </template>
      </ui-table-column>

      <!-- <ui-table-column label="Активен">
        <template #body="{ row }">
          {{ row.is_active ? 1 : 0 }}
        </template>
      </ui-table-column> -->

      <ui-table-column label="Мод">
        <template #body="{ row }">
          {{ new Date(row.password_modification_date).toLocaleDateString() }}
        </template>
      </ui-table-column>

      <ui-table-column
        label="Подписка"
        align="right"
      >
        <template #body="{ row }">
          {{ row.is_subscribed ? 1 : 0 }}
        </template>
      </ui-table-column>

      <div
        slot="footer-table-row"
        style="width: 100%"
      >
        <div
          style="
            border: 1px solid #444;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: flex-end;
          "
        >
          SOME DATA
        </div>
      </div>

      <ui-pagination
        slot="footer"
        style="width: 100%; margin-top: 20px"
        :page="p.page"
        :limit="p.limit"
        :total="p.total"
        @changes="changePage"
      />
    </ui-table>
  </div>
</template>

<script>
import UiTableColumn from '@/components/table/ui-table-column.vue'

export default {
  name: 'VTable2',

  components: {
    UiTableColumn,
  },

  data: () => ({
    tData: [],
    selected: {
      id: `table-2_13`,
      email: `table-2_13@email.com`,
      first_name: `table-2_13-firstName`,
      last_name: `table-2_13-lastName`,
      client_type: 'lk_user',
      is_active: 1,
      is_subscribed: 0,
      password_modification_date: '2023-08-23T13:55:13.186657Z',
      created_date: '2023-08-23T13:55:12.462433Z',
    },
    isLoading: false,
    labelId: 'id',
    p: {
      page: 1,
      limit: 100,
      pages: 10,
      total: 400,
    },
    dataSize: 200,
    cacheColumnSize: {
      id: 'table-2',
      cache: true,
    },
  }),

  watch: {
    'p.page': {
      immediate: true,
      handler(page) {
        this.timeout(this.getDataTable(page, this.cacheColumnSize.id), 300)
      },
    },
  },

  methods: {
    timeout(data, time) {
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
        this.tData = data
      }, time)
    },

    disabledRow(row) {
      return !row.is_active
    },
    selectRow(v) {
      console.warn('selectRow', v)
    },
    selectRows(v) {
      console.warn('selectRows', v)
    },
    actionRow(v) {
      console.log('actionRow: ', v)
    },
    sortColumn(v) {
      console.log('sortColumn', v)
    },
    resizeColumn(v) {
      console.log('resizeColumn', v)
    },
    scrollDown(v) {
      console.log('scrollDown', v)
    },
    scrollRight(v) {
      console.log('scrollRight', v)
    },

    selectAll() {
      // this.selected = this.getDataTable()
    },

    changePage({ page }) {
      this.p.page = page
    },

    cancel() {
      this.selected = []
      console.log(this.selected)
    },

    changeLabel() {
      this.labelId = this.labelId === 'id' ? 'ИД' : 'id'
    },

    clearCash() {
      this.cacheColumnSize = {
        id: 'table-2',
        cash: false,
      }
    },

    addOuterObject() {
      this.selected = {
        id: `table-2_5`,
        email: `table-2_5@email.com`,
        first_name: `table-2_5-firstName`,
        last_name: `table-2_5-lastName`,
        client_type: 'lk_user',
        is_active: 1,
        is_subscribed: 0,
        password_modification_date: '2023-08-23T13:55:13.186657Z',
        created_date: '2023-08-23T13:55:12.462433Z',
      }
    },

    getDataTable(page, id) {
      const data = []
      const total = this.p.total / (this.p.total / this.p.limit)

      for (let i = 0; i < this.p.total; i++) {
        data.push({
          id: `${id}_${i}`,
          email:
            this.p.limit - 1 === i
              ? `${id}_${i}_loooooooooooooooooong@email.com`
              : `${id}_${i}@email.com`,
          first_name: `${id}_${i}-firstName`,
          last_name: `${id}_${i}-lastName`,
          client_type: 'lk_user',
          is_active: i % 2,
          is_subscribed: i % 1,
          password_modification_date: '2023-08-23T13:55:13.186657Z',
          created_date: '2023-08-23T13:55:12.462433Z',
        })
      }

      return data.splice(total * --page, total)
    },
  },
}
</script>

<style></style>
