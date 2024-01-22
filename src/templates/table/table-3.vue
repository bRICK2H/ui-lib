<template>
  <div>
    <div style="margin-bottom: 16px">
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
        @click="clearCache"
        >Clear cache</ui-button
      >
      <ui-button
        right-indent
        @click="isShowBlock = !isShowBlock"
        >Show block</ui-button
      >

      <ui-button
        right-indent
        @click="addOuterObject"
        >Add outer object</ui-button
      >

      <div
        v-if="isShowBlock"
        style="width: 100%; height: 100px; background: green"
      ></div>
    </div>
    <!-- :offset-height-bottom="50" -->

    <div style="display: flex; gap: 20">
      <ui-table
        :table-data="tData"
        :loading="isLoading"
        :outer-row-selected="selected"
        :highlight-row="(row) => row.is_active === 1"
        :row-cursor-pointer="(row) => row.is_active === 1"
        :cache-column-size="cacheColumnSize"
        :force-table-size-update="isShowBlock"
        :padding-columns-x="20"
        scroll-update
        vertical-border
        show-hover-hint
        resizable-column
        highlight-checked-row
        group-opening-type="manual"
        @action-row="actionRow"
        @select-row="selectRow"
        @scroll-down="scrollDown"
        @scroll-right="scrollRight"
        @select-rows="selectRows"
        @sort-column="sortColumn"
        @resize-column="resizeColumn"
        @group-rows="groupRows"
      >
        <div slot="empty-text">Empty text</div>
        <!-- <div
        slot="header"
        style="
          width: inherit;
          height: 50px;
          min-width: 100%;
          display: flex;
          align-items: center;
          border: 1px solid #444;
          justify-content: center;
        "
      >
        HEADER TABLE ROW
      </div> -->

        <ui-table-group-rows
          group-key="type"
          group-value="default"
        >
          default
        </ui-table-group-rows>
        <ui-table-group-rows
          group-key="type"
          group-value="disabled"
        >
          disabled
        </ui-table-group-rows>
        <ui-table-group-rows
          group-key="type"
          :group-value="['default', 'disabled']"
        >
          default, disabled
        </ui-table-group-rows>

        <ui-table-group-rows
          group-key="type"
          group-value="mix"
        >
          mix
        </ui-table-group-rows>

        <ui-table-column
          sort-by="desc"
          width="auto"
          :label="labelId"
          column-key="id"
          interactive-mode="checkbox"
          :disabled-row="disabledRow"
        />

        <ui-table-column
          label="Type"
          sort-by="desc"
          column-key="type"
        />

        <ui-table-column
          label="Very very long field name"
          sort-by="desc"
          column-key="first_name"
        />

        <ui-table-column
          :width="200"
          label="Email (static 200)"
          column-key="email"
          sort-by="desc"
          align="center"
        />

        <ui-table-column label="Created">
          <template #body="{ row }">
            {{ new Date(row.created_date).toLocaleDateString() }}
          </template>
        </ui-table-column>

        <ui-table-column label="Active">
          <template #body="{ row }">
            {{ row.is_active ? 1 : 0 }}
          </template>
        </ui-table-column>

        <ui-table-column label="Updated">
          <template #body="{ row }">
            {{ new Date(row.password_modification_date).toLocaleDateString() }}
          </template>
        </ui-table-column>

        <ui-table-column
          label="Subscription"
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
              width: 100%;
              height: 100px;
              display: flex;
              align-items: center;
              justify-content: center;
              border: 1px solid #444;
            "
          >
            FOOTER TABLE ROW
          </div>
        </div>

        <ui-pagination
          slot="footer"
          style="width: 100%; margin-top: 20px"
          :page="p.page"
          :limit="p.limit"
          :total="p.total"
          :pages="p.pages"
          @changes="changePage"
        />
      </ui-table>
    </div>
  </div>
</template>

<script>
import UiTableColumn from '@/components/table/ui-table-column.vue'
import UiTableGroupRows from '@/components/table/ui-table-group-rows.vue'

export default {
  name: 'VTable1',

  components: {
    UiTableColumn,
    UiTableGroupRows,
  },

  data: () => ({
    tData: [],
    tData2: [],
    selected: [
      {
        id: `table-3_0`,
        email: `table-3_0@email.com`,
        first_name: `table-3_0-firstName`,
        last_name: `table-3_0-lastName`,
        client_type: 'lk_user',
        is_active: 1,
        is_subscribed: 0,
        password_modification_date: '2023-08-23T13:55:13.186657Z',
        created_date: '2023-08-23T13:55:12.462433Z',
      },
      {
        id: `table-3_1`,
        email: `table-3_1@email.com`,
        first_name: `table-3_1-firstName`,
        last_name: `table-3_1-lastName`,
        client_type: 'lk_user',
        is_active: 1,
        is_subscribed: 0,
        password_modification_date: '2023-08-23T13:55:13.186657Z',
        created_date: '2023-08-23T13:55:12.462433Z',
      },
      {
        id: `table-3_13`,
        email: `table-3_13@email.com`,
        first_name: `table-3_13-firstName`,
        last_name: `table-3_13-lastName`,
        client_type: 'lk_user',
        is_active: 1,
        is_subscribed: 0,
        password_modification_date: '2023-08-23T13:55:13.186657Z',
        created_date: '2023-08-23T13:55:12.462433Z',
      },
      {
        id: `table-3_113`,
        email: `table-3_113@email.com`,
        first_name: `table-3_113-firstName`,
        last_name: `table-3_113-lastName`,
        client_type: 'lk_user',
        is_active: 1,
        is_subscribed: 0,
        password_modification_date: '2023-08-23T13:55:13.186657Z',
        created_date: '2023-08-23T13:55:12.462433Z',
      },
    ],
    isShowBlock: false,
    isLoading: false,
    labelId: 'id',
    p: {
      page: 1,
      limit: 20,
      pages: 5,
      total: 25,
    },
    cacheColumnSize: {
      id: 'table-3',
      cache: true,
    },

    p2: {
      page: 1,
      limit: 10,
      pages: 5,
      total: 5,
    },
    cacheColumnSize2: {
      id: 'table-3.1',
      cache: true,
    },
  }),

  watch: {
    'p.page': {
      immediate: true,
      handler(page) {
        this.timeout(() => {
          this.tData = this.getDataTable(page, this.cacheColumnSize.id, this.p)
        }, 300)
      },
    },
    'p.page2': {
      immediate: true,
      handler(page) {
        this.timeout(() => {
          this.tData2 = this.getDataTable(
            page,
            this.cacheColumnSize2.id,
            this.p2
          )
        }, 300)
      },
    },
  },

  methods: {
    timeout(fn, time) {
      this.isLoading = true
      setTimeout(() => {
        this.isLoading = false
        fn()
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
    groupRows(v) {
      console.log('groupRows', v)
    },
    scrollDown(v) {
      console.log('scrollDown', v)
    },
    scrollRight(v) {
      console.log('scrollRight', v)
    },

    selectAll() {
      // this.selected = this.getDataTable(0, this.cacheColumnSize.id)
      console.log(this.selected)
    },

    cancel() {
      this.selected = []
      console.log(this.selected)
    },

    changePage({ page }) {
      console.log(page)
      this.p.page = page
    },

    changeLabel() {
      this.labelId = this.labelId === 'id' ? 'ИД' : 'id'
    },

    clearCache() {
      this.cacheColumnSize = {
        id: 'table-3',
        cash: false,
      }
    },

    addOuterObject() {
      this.selected.push({
        id: `table-3_5`,
        email: `table-3_5@email.com`,
        first_name: `table-3_5-firstName`,
        last_name: `table-3_5-lastName`,
        client_type: 'lk_user',
        is_active: 1,
        is_subscribed: 0,
        password_modification_date: '2023-08-23T13:55:13.186657Z',
        created_date: '2023-08-23T13:55:12.462433Z',
      })
    },

    getDataTable(page, id, { total, limit }) {
      const data = []
      const totals = total / (total / limit)

      for (let i = 0; i < total; i++) {
        data.push({
          id: i === 40 ? `${id}_${i}_long name` : `${id}_${i}`,
          type: i % 3 === 0 ? 'mix' : i % 2 ? 'default' : 'disabled',
          email: `${id}_${i}@email.com`,
          first_name: `${id}_${i}-firstName`,
          last_name: `${id}_${i}-lastName`,
          client_type: 'lk_user',
          is_active: i % 2,
          is_subscribed: i % 1,
          password_modification_date: '2023-08-23T13:55:13.186657Z',
          created_date: '2023-08-23T13:55:12.462433Z',
        })
      }

      return page === 0 ? data : data.splice(totals * --page, totals)
    },
  },
}
</script>

<style></style>
