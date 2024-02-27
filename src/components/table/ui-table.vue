<template>
  <div
    ref="table-wrapper"
    class="ui-table-wrapper"
  >
    <div
      ref="table-container"
      class="ui-table-container"
    >
      <table
        :class="[
          'ui-table',
          {
            'v-border': verticalBorder,
            'h-border': horizontalBorder,
          },
        ]"
        :style="{
          '--row-body-height': `${rowBodyHeight}px`,
          '--row-head-height': `${rowHeadHeight}px`,
        }"
      >
        <div
          ref="head-wrapper"
          class="ui-table-head-wrapper"
        >
          <thead
            ref="thead"
            class="ui-table-head"
            :style="tableScrollStyleWidth"
          >
            <div
              ref="thead-slot"
              class="ui-table-head-slot-row"
            >
              <slot name="header" />
            </div>

            <ui-table-head-row
              :bus="bus"
              :store="store"
              :loading="loading"
              :table-data="tableData"
              :padding-columns-x="paddingColumnsX"
              :column-options="columnOptions"
              :show-hover-hint="showHoverHint"
              :vertical-border="verticalBorder"
              :resizable-column="resizableColumn"
              :cache-column-size="cacheColumnSize"
              :horizontal-border="horizontalBorder"
            />
          </thead>
        </div>

        <ui-scrollbar
          @scroll.passive="scroll"
          @scroll-target="setScrollTarget"
        >
          <tbody
            ref="tbody"
            class="ui-table-body"
            :style="[
              tableBodyStyleHeight,
              tableScrollStyleWidth,
              { '--footer-row-body-padding': `${paddingColumnsX}px` },
            ]"
          >
            <template v-if="hasTableData">
              <template v-if="hasGroupRow">
                <ui-table-group-row
                  v-for="(groupRow, i) of groupRowsOptions"
                  :key="`group-row:${i}`"
                  :bus="bus"
                  :store="store"
                  :loading="loading"
                  :index-group-row="i"
                  :group-row="groupRow"
                  :padding-columns-x="paddingColumnsX"
                  :active-groups="activeGroups"
                  :highlight-row="highlightRow"
                  :column-options="columnOptions"
                  :row-body-height="rowBodyHeight"
                  :show-hover-hint="showHoverHint"
                  :vertical-border="verticalBorder"
                  :active-group-row="activeGroupRow"
                  :resizable-column="resizableColumn"
                  :cache-column-size="cacheColumnSize"
                  :show-visible-rows="showVisibleRows"
                  :group-table-data="groupTableData[i]"
                  :horizontal-border="horizontalBorder"
                  :row-cursor-pointer="rowCursorPointer"
                  :group-rows-options="groupRowsOptions"
                  :highlight-checked-row="highlightCheckedRow"
                  :primary-group-indexes="primaryGroupIndexes"
                  :sequential-group-indexes="sequentialGroupIndexes"
                  @set-active-group-row="
                    (event) => setActiveGroupRow({ event, index: i })
                  "
                />
              </template>

              <template v-else>
                <template v-for="(row, index) of tableData">
                  <ui-table-body-row
                    v-if="showVisibleRows(index)"
                    :key="`row:${index}`"
                    :row="row"
                    :bus="bus"
                    :store="store"
                    :index-row="index"
                    :loading="loading"
                    :padding-columns-x="paddingColumnsX"
                    :highlight-row="highlightRow"
                    :column-options="columnOptions"
                    :show-hover-hint="showHoverHint"
                    :vertical-border="verticalBorder"
                    :resizable-column="resizableColumn"
                    :cache-column-size="cacheColumnSize"
                    :horizontal-border="horizontalBorder"
                    :row-cursor-pointer="rowCursorPointer"
                    :highlight-checked-row="highlightCheckedRow"
                  />
                  <tr
                    v-else
                    :key="`row:${index}`"
                    class="ui-table-body-invisible-row"
                  ></tr>
                </template>
              </template>

              <div
                v-if="$slots['footer-table-row']"
                class="ui-table-body-footer-slot-row"
              >
                <slot name="footer-table-row" />
              </div>
            </template>
            <div
              v-else
              class="ui-table-body-row-empty"
            >
              <p class="ui-table-body-slot-empty-text">
                <slot name="empty-text">
                  {{ defaultEmptyText }}
                </slot>
              </p>
            </div>
          </tbody>
        </ui-scrollbar>

        <div class="ui-table-columns-slot-hidden">
          <slot />
        </div>
      </table>
    </div>

    <div
      ref="footer-container"
      class="ui-table-footer-container"
    >
      <slot name="footer" />
    </div>
  </div>
</template>

<script>
import bus from './bus'
import store from './store'
import {
  hasItemStorage,
  getItemStorage,
  setItemStorage,
  removeItemStorage,
} from '@/helpers/local-storage'
import UiTableHeadRow from './ui-table-head-row.vue'
import UiTableBodyRow from './ui-table-body-row.vue'
import UiTableGroupRow from './ui-table-group-row.vue'

export default {
  name: 'UiTable',

  components: {
    UiTableHeadRow,
    UiTableBodyRow,
    UiTableGroupRow,
  },

  props: {
    /**
     * Данные таблицы
     */
    tableData: {
      type: Array,
      required: true,
    },

    /**
     * Кэширование ширины столбца при ресайзе
     * 1. Если cache true все значения записываются в lS
     * 2. Если cache false значения удаляются из LS
     * 3. Ширина указанная в пропсах для колонок, будет игнорироваться в случае если в LS уже есть сохраненное значение
     */
    cacheColumnSize: {
      type: Object,
      default: () => ({
        id: '',
        cache: false,
      }),
    },

    /**
     * Внешние выбранные данные строки
     */
    outerRowSelected: {
      type: [Object, Array],
      default: null,
    },

    /**
     * Статичная высота таблицы
     */
    height: {
      type: Number,
      default: 0,
    },

    /**
     * Построчная высота (указываем количество строк)
     */
    maxRowCount: {
      type: Number,
      default: 0,
    },

    /**
     * Смещение высоты от нижнего края (работает только если не указываем статичную высоту "height" и "maxRowCount")
     */
    offsetHeightBottom: {
      type: Number,
      default: 0,
    },

    /**
     * Высота строки тела
     */
    rowBodyHeight: {
      type: Number,
      default: 40,
    },

    /**
     * Высота строки шапки
     */
    rowHeadHeight: {
      type: Number,
      default: 36,
    },

    /**
     * Горизонтальный отступ для всех колонок таблицы
     * - если указан размер у paddingColumnX, то у него будет приоритет
     */
    paddingColumnsX: {
      type: Number,
      default: 12,
    },

    /**
     * Шаблон текста пока нет данных
     */
    emptyText: {
      type: String,
      default: '',
    },

    /**
     * Тип раскрытия группы строк
     * auto - открывается новая, закрывается предыдущая
     * manual - открытие и закрытие каждой группы в вручную
     */
    groupOpeningType: {
      type: String,
      default: 'manual',
      validator(value) {
        return ['auto', 'manual'].includes(value)
      },
    },

    /**
     * Выделить (подсветить) строку при ее выборе
     */
    highlightCheckedRow: {
      type: Boolean,
      default: true,
    },

    /**
     * Загрузка, создает skeleton эффект для всех ячеек
     */
    loading: {
      type: Boolean,
      default: false,
    },

    /**
     * Занять стартовую позицию скролла (обновляется при изменении данных)
     */
    updateScrollOnLoad: {
      type: Boolean,
      default: true,
    },

    /**
     * Показать заголовок ячейки
     */
    showHoverHint: {
      type: Boolean,
      default: false,
    },

    /**
     * Изменяемый размер столбца
     */
    resizableColumn: {
      type: Boolean,
      default: true,
    },

    /**
     * Показать вертикальную границу
     */
    verticalBorder: {
      type: Boolean,
      default: false,
    },

    /**
     * Показать горизонтальную границу
     */
    horizontalBorder: {
      type: Boolean,
      default: true,
    },

    /**
     * Принудительно пересчитать размеры таблицы
     */
    forceTableSizeUpdate: {
      type: Boolean,
      default: false,
    },

    /**
     * Установить курсор pointer для всей строки
     */
    rowCursorPointer: {
      type: [Boolean, Function],
      default: false,
    },

    /**
     * Выделить (подсветить) строку при наведении
     */
    highlightRow: {
      type: [Boolean, Function],
      default: false,
    },
  },

  data: () => ({
    actions: [
      'action-row',
      'select-row',
      'select-rows',
      'sort-column',
      'resize-column',
      'column-options',
      'group-rows-options',
    ],
    bus: bus(),
    store: store(),
    activeGroupRow: {},
    columnOptions: [],
    groupRowsOptions: [],
    scrollTarget: null,
    resizeObserver: null,

    maxHeight: 0,
    scrollTop: 0,
    scrollLeft: 0,
    tableWidth: 0,
    scrollWidth: 0,
    startVisibleRowIndex: 0,
    currentActiveGroupIndex: 0,

    interactiveMode: '',
    dynamicHeight: 'auto',
  }),

  computed: {
    hasTableData() {
      return this.tableData.length > 0
    },

    hasGroupRow() {
      return this.groupRowsOptions.length > 0
    },

    groupTableData() {
      return this.groupRowsOptions.map(({ groupRowsProps }) => {
        const { groupKey, groupValue } = groupRowsProps

        return this.tableData.filter((item) =>
          groupValue.includes(item[groupKey])
        )
      })
    },

    activeSequentialIndexes() {
      return Object.keys(this.sequentialGroupIndexes).map(Number)
    },

    activeGroupsTableData() {
      return this.groupTableData.filter((_, i) =>
        this.activeSequentialIndexes.includes(i)
      )
    },

    lastActiveGroupIndex() {
      return this.activeSequentialIndexes[
        this.activeSequentialIndexes.length - 1
      ]
    },

    /**
     * activeGroups
     * ? Формирование активных групп
     *
     * @returns {Array[]} многомерный массив активных групп
     * ['0', true], ['1', true]]
     */
    activeGroups() {
      return Object.entries(this.activeGroupRow).filter(([, active]) => active)
    },

    /**
     * primaryGroupIndexes
     * ? Формирование первичных активных индексов для каждой группы
     * Первичные индексы определяют начальную позицию индекса для каждой группы исходя их количества элементов в каждой из групп.
     * Пример:
     * groupTableData = [[{..}], [{..}, {..}], [{..}, {..}, {..}]]
     * нужно определить, с какого индекса начинается каждая (активная) группа, т.е. результатом в данном примере будет [0, 1, 3]
     *
     * @returns {number[]} первичные активные индексы для каждой группы
     */
    primaryGroupIndexes() {
      return this.activeGroupsTableData.map(
        (_, i) => this.activeGroupsTableData.slice(0, i).flat().length
      )
    },

    /**
     * sequentialGroupIndexes
     * ? Формирования карты последовательных индексов для каждой открытой группы
     * Пример:
     * groupTableData = [[{..}], [{..}, {..}], [{..}, {..}, {..}]]
     * Открываем группу с первичным индексом 0 и 2 (т.е. первую и последнюю)
     * activeGroups = [['0', true], ['2', true]]
     * у каждой группы есть итерационный индекс 0, 1, 2
     * в последствии текущих вычислений получаем объект:
     * sequentialGroupIndexes = {0: 0, 2: 1}
     * исходя из этого результата, активный индекс группы "0" заберет последовательный индекс из sequentialGroupIndexes "0" а активный индекс группы "2" заберет последовательный индекс "1"
     * в итоге мы получает актуальный первичный индекс (т.е. общая последовательность индексов групп, не будет отличатся от последовательности индексов обычного списка), и не важно какая группа была открыта вторая, последняя или же все вместе.
     * @returns {object} карты последовательных индексов для каждой открытой группы {0: 0, 2: 1}
     *
     */
    sequentialGroupIndexes() {
      return this.activeGroups.reduce((acc, [index], i) => {
        acc[index] = i
        return acc
      }, {})
    },

    visibleRows() {
      const height = this.tableBodyValueHeight

      if (typeof height === 'number') {
        return Math.round(height / this.rowBodyHeight)
      }

      return 0
    },

    visibleRowIndexes() {
      const startDiff = Math.floor(
        this.startVisibleRowIndex - this.lastActiveGroupIndex - 1
      )
      const endDiff = Math.ceil(
        this.startVisibleRowIndex + this.lastActiveGroupIndex + 1
      )
      const end = this.visibleRows + endDiff
      const start = startDiff > 0 ? startDiff : 0

      return this.visibleTableData.map((_, i) => i).slice(start, end)
    },

    visibleTableData() {
      const activeGroupIndexes = this.activeGroups.map(([index]) =>
        Number(index)
      )
      const mergedGroupData = this.groupTableData.reduce((acc, curr, i) => {
        if (activeGroupIndexes.includes(i)) {
          acc = [...acc, ...curr]
        }

        return acc
      }, [])

      return this.hasGroupRow ? mergedGroupData : this.tableData
    },

    defaultEmptyText() {
      console.error('No data to display')
      return this.emptyText || 'No data to display'
    },

    tableScrollStyleWidth() {
      return {
        width: this.scrollLeft === 0 ? 'auto' : `${this.scrollWidth}px`,
      }
    },

    tableBodyStyleHeight() {
      const height = this.tableBodyValueHeight

      return {
        maxHeight: typeof height === 'number' ? `${height}px` : 'auto',
      }
    },

    tableBodyValueHeight() {
      if (this.maxRowCount === 0) {
        return this.height > 0 ? this.height : this.dynamicHeight
      }

      if (this.tableData.length === 0) {
        return this.rowBodyHeigh
      }

      return this.maxRowCount > this.tableData.length
        ? this.tableData.length * this.rowBodyHeight
        : this.maxRowCount * this.rowBodyHeight
    },
  },

  watch: {
    /**
     * Инициализация атрибутов в store для формирования состояния колонок
     */
    $props: {
      immediate: true,
      handler() {
        this.store.initTableProps(this.$props)
      },
    },

    tableData: {
      deep: true,
      immediate: true,
      handler() {
        this.initTable()
        this.store.initTableData(this.tableData)
      },
    },

    outerRowSelected: {
      deep: true,
      handler() {
        this.store.updateOuterSelection(this.outerRowSelected)
      },
    },

    cacheColumnSize: {
      deep: true,
      immediate: true,
      handler() {
        const { id, cache } = this.cacheColumnSize

        if (!id) {
          console.warn(
            `[ui-table]: For caching, set a unique id to the "cacheColumnSize.id" property`
          )
        }

        if (cache) {
          return
        }

        removeItemStorage(id)
      },
    },

    forceTableSizeUpdate() {
      this.calcTableHeight()
    },
  },

  created() {
    this.registerActions()
  },

  mounted() {
    this.setActiveGroupRow({
      event: null,
      index: this.currentActiveGroupIndex,
    })
  },

  destroyed() {
    this.bus.$off()
    this.resizeObserver?.disconnect()
  },

  methods: {
    async initTable() {
      await this.$nextTick()

      if (!this.$slots.default) {
        return
      }

      if (this.updateScrollOnLoad) {
        this.updateData()
        this.scrollUpdate()
      }

      this.initResizeObserver()
    },

    registerActions() {
      this.actions.forEach((action) => {
        this.bus.$on(action, (options) => {
          switch (action) {
            case 'resize-column':
              this.resizeColumn(options)
              break

            case 'column-options':
              this.createColumnOptions(options)
              break

            case 'group-rows-options':
              this.createGroupRowsOptions(options)
              break

            default:
              this.$emit(action, options)
              break
          }
        })
      })
    },

    createColumnOptions({ ctx, isLastColumn, options }) {
      const { columnProps } = options

      if (!this.interactiveMode) {
        ctx.interactiveMode = columnProps.interactiveMode
      }

      if (!ctx.checkInteractiveMode()) {
        ctx.$destroy()
        return
      }

      ctx.columnOptions.push(options)
      ctx.store.initColumnProps(isLastColumn, columnProps)
    },

    createGroupRowsOptions({ ctx, options }) {
      ctx.groupRowsOptions.push(options)
    },

    resizeColumn(options) {
      this.$emit('resize-column', options)

      const { id, cache, indexColumn, width } = options

      if (!id || !cache) {
        return
      }

      if (!hasItemStorage(id)) {
        setItemStorage(id, { [indexColumn]: width })

        return
      }

      const currentColumns = getItemStorage(id)
      setItemStorage(id, { ...currentColumns, ...{ [indexColumn]: width } })
    },

    setActiveGroupRow({ event, index }) {
      this.currentActiveGroupIndex = index

      if (event?.target) {
        this.$emit('group-rows', {
          event,
          activeIndex: index,
          activeGroupRow: this.activeGroupRow,
        })
      }

      if (this.groupOpeningType === 'manual') {
        this.$set(this.activeGroupRow, index, !this.activeGroupRow[index])
        return
      }

      this.$set(this, 'activeGroupRow', {
        [index]: !this.activeGroupRow[index],
      })
    },

    showVisibleRows(index) {
      return this.visibleRowIndexes.includes(index)
    },

    calcTableHeight() {
      this.setScrollWidth()
      this.defineMaxHeight()
      this.defineDynamicHeight()
      this.updateScrollSize()
    },

    defineMaxHeight() {
      const tableContainerElement = this.$refs['table-wrapper']

      if (!tableContainerElement || this.height !== 0) {
        return
      }

      const borderWidth = 2
      const { top } = tableContainerElement.getBoundingClientRect()
      const headSlotHeight = this.getHeight(this.$refs['thead-slot'])
      const footerSlotHeight = this.getHeight(this.$refs['footer-container'])
      const paddingBottom = this.getPaddingBottom(
        this.$refs['footer-container']
      )

      this.maxHeight =
        window.innerHeight -
        (borderWidth +
          paddingBottom +
          headSlotHeight +
          footerSlotHeight +
          this.offsetHeightBottom +
          top)
    },

    async defineDynamicHeight() {
      const tableHeight = this.getHeight(this.$refs['table-wrapper'])

      this.dynamicHeight =
        tableHeight > this.maxHeight
          ? this.maxHeight - this.rowHeadHeight
          : window.innerHeight
    },

    async updateScrollSize() {
      await this.$nextTick()

      const body = this.$refs['tbody']

      if (!body) {
        return
      }

      this.tableWidth = body.offsetWidth
      this.$emit('scroll-size', {
        target: body,
        scrollWidth: body.scrollWidth,
        offsetWidth: body.offsetWidth,
        scrollHeight: body.scrollHeight,
        offsetHeight: body.offsetHeight,
        hasScroll: body.scrollHeight > body.offsetHeight,
      })
    },

    getHeight(node) {
      if (!node) {
        return 0
      }

      const { height } = node.getBoundingClientRect()

      return height
    },

    getPaddingBottom(node) {
      if (!node) {
        return 0
      }

      const paddingValue = parseFloat(
        window.getComputedStyle(node).getPropertyValue('padding-bottom')
      )

      return paddingValue === 0
        ? this.getPaddingBottom(node.parentElement)
        : paddingValue
    },

    setScrollTarget(target) {
      this.scrollTarget = target
    },

    setScrollWidth(target) {
      this.scrollWidth = (target || this.scrollTarget).scrollWidth ?? 0
    },

    setScrollLeftHead({ scrollLeft }) {
      this.$refs['head-wrapper'].scrollLeft = scrollLeft
    },

    setScrollEnd(event) {
      const {
        scrollTop,
        scrollLeft,
        scrollWidth,
        scrollHeight,
        clientWidth,
        clientHeight,
      } = event.target

      const isScrollDown =
        scrollLeft === this.scrollLeft &&
        scrollHeight === scrollTop + clientHeight
      const isScrollRight =
        scrollTop === this.scrollTop && scrollWidth === scrollLeft + clientWidth

      this.scrollTop = scrollTop
      this.scrollLeft = scrollLeft

      if (isScrollDown) {
        this.$emit('scroll-down', event)
      }

      if (isScrollRight) {
        this.$emit('scroll-right', event)
      }
    },

    setStartVisibleRowIndex({ scrollTop, scrollLeft }) {
      if (scrollLeft !== this.scrollLeft) {
        return
      }

      this.startVisibleRowIndex = Math.min(
        this.visibleTableData.length,
        scrollTop / this.rowBodyHeight
      )
    },

    updateData() {
      this.startVisibleRowIndex = 0
    },

    scrollUpdate() {
      setTimeout(() => {
        this.scrollTarget.scrollTop = 0
        this.scrollTarget.scrollLeft = 0
      })
    },

    scroll(event) {
      this.$emit('scroll', event)

      this.setStartVisibleRowIndex(event.target)
      this.setScrollLeftHead(event.target)
      this.setScrollWidth(event.target)
      this.setScrollEnd(event)
    },

    initResizeObserver() {
      const tableContainer = this.$refs['table-wrapper']

      if (!tableContainer) {
        return
      }

      this.resizeObserver = new ResizeObserver(this.calcTableHeight)
      this.resizeObserver.observe(tableContainer)
    },

    checkInteractiveMode() {
      if (this.outerRowSelected === null) {
        return true
      }

      const type = Array.isArray(this.outerRowSelected)
        ? 'array'
        : typeof this.outerRowSelected

      if (
        this.interactiveMode === 'radio' &&
        Array.isArray(this.outerRowSelected)
      ) {
        console.error(
          `[ui-table]: Parameter "outerRowSelected" of type "${type}" and cannot work with radio buttons, use an object.`
        )

        return false
      }

      if (
        this.interactiveMode === 'checkbox' &&
        !Array.isArray(this.outerRowSelected)
      ) {
        console.error(
          `[ui-table]: Parameter "outerRowSelected" of type "${type}" and cannot work with checkbox, use an array.`
        )

        return false
      }

      return true
    },
  },
}
</script>

<style lang="scss">
$rowBodyHeight: var(--row-body-height);
$footerRowBodyPadding: var(--footer-row-body-padding);

.ui-table-wrapper {
  background-color: transparent;
}

.ui-table-container {
  width: 100%;
  overflow: hidden;
  border-radius: 4px;
  border: 1px solid $av-solid-brand-bright;
}

.ui-table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  background: $av-fixed-white;

  .ui-table-head-wrapper {
    position: relative;
    overflow-x: hidden;
    overflow-y: hidden;
  }

  .ui-table-head,
  .ui-table-body {
    width: 100%;
    display: block;
  }

  .ui-table-head-slot-row {
    width: inherit;
    display: block;
  }
}

.ui-table-body-row-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 0;
}

.ui-table-body-slot-empty-text {
  color: $av-solid-fixed-light;
  font-size: $av-font-size-xs;
  font-weight: $av-font-weight-normal;
}

.ui-table-columns-slot-hidden {
  display: none;
}

.ui-table-body-footer-slot-row {
  width: 100%;
  min-height: $rowBodyHeight;
  padding: $footerRowBodyPadding;
  display: block;
  box-shadow: -1px -1px $av-solid-brand-accent;
}

.ui-table-footer-container {
  display: flex;
  align-items: flex-end;
}

.ui-table-body-invisible-row {
  width: 100%;
  display: block;
  visibility: hidden;
  height: $rowBodyHeight;
}
</style>
