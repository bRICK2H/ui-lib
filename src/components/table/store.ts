import Vue from 'vue'

import type {
  ISortedItem,
  INumberKeys,
  ISortedItems,
  IUnknownKeys,
  IBooleanKeys,
  IElementKeys,
  ISortedOption,
  INumberCollection,
} from './types'

declare module 'vue/types/vue' {
  interface Vue {
    selected: IUnknownKeys
    paddingColumnsX: number
    lastColumnIndex: number
    isActiveResize: boolean
    isColumnsWidthUpdated: boolean

    hoverResize: IBooleanKeys
    hoverColumn: IBooleanKeys
    matchedWidth: IBooleanKeys
    activeResizeColumns: IBooleanKeys

    width: INumberKeys
    dynamicWidth: INumberKeys
    minDynamicWidth: INumberKeys
    autoWidthNodes: IElementKeys
    collectionWidth: INumberCollection

    activeSortIndex: number
    amountPaddings: number[]
    tableData: IUnknownKeys[]
    columnProps: IUnknownKeys[]
    sortedItems: ISortedItems
    outerRowSelected: IUnknownKeys[]
    outerRowUnselected: IUnknownKeys[]

    getRowSizes: () => INumberKeys
    getValueRow: (row: string) => IUnknownKeys
    getKeyRow: (row: IUnknownKeys) => string

    isCheckedHeadRow: () => boolean
    isIndeterminateHeadRow: () => boolean
    isCheckedBodyRow: (row: IUnknownKeys) => boolean
    isDisabledBodyRow: (row: IUnknownKeys) => boolean

    getToTalSelectedRows: () => IUnknownKeys[]
    getCurrentUnlockedRows: () => IUnknownKeys[]
    getCurrentSelectedRows: () => IUnknownKeys[]
    getSortedItem: (index: number) => ISortedItem
    getKeyRows: (rows: IUnknownKeys[]) => string[]
    getValueRows: (rows: string[]) => IUnknownKeys[]

    clearCollectionWidth: () => void
    initTableProps: (props: IUnknownKeys) => void
    changeAllSelection: (checked: boolean) => void
    setActiveResizeStatus: (active: boolean) => void
    setOuterSelection: (rows: IUnknownKeys[]) => void
    initTableData: (tableData: IUnknownKeys[]) => void
    setAmountPadding: ({ padding }: IUnknownKeys) => void
    setDynamicWidth: (width: number, index: number) => void
    setHoverColumn: (hover: boolean, index: number) => void
    setHoverResize: (hover: boolean, index: number) => void
    checkWidthMatches: (width: number, index: number) => void
    setAutoWidthNodes: (ref: HTMLElement, index: number) => void
    selectRadioRow: (row: IUnknownKeys, checked: boolean) => void
    setActiveResizeColumn: (active: boolean, index: number) => void
    selectCheckboxRow: (row: IUnknownKeys, checked: boolean) => void
    setOuterRowUnselected: (keyRow: string, checked: boolean) => void
    updateOuterSelection: (rows: IUnknownKeys | IUnknownKeys[]) => void
    setSortedItems: ({ index, sortBy, columnKey }: ISortedOption) => void
    initColumnProps: (isLastColumn: boolean, columnProps: IUnknownKeys) => void
    changeSelection: (row: IUnknownKeys, checked: boolean, mode: string) => void
    setCollectionWidth: (
      width: number,
      index: number,
      isSpecifiedWidth: boolean
    ) => void
  }
}

export default () =>
  new Vue({
    data: () => ({
      selected: {},
      tableData: [],
      columnProps: [],
      amountPaddings: [],
      outerRowSelected: [],
      outerRowUnselected: [],

      width: {},
      autoWidth: {},
      hoverResize: {},
      hoverColumn: {},
      sortedItems: {},
      dynamicWidth: {},
      matchedWidth: {},
      autoWidthNodes: {},
      minDynamicWidth: {},
      collectionWidth: {},
      activeResizeColumns: {},

      paddingColumnsX: 0,
      lastColumnIndex: -1,
      activeSortIndex: -1,
      defaultMinWidth: 100,
      dynamicAutoWidth: '100%',
      isActiveResize: false,
      isColumnsWidthUpdated: false,
    }),

    watch: {
      collectionWidth: {
        deep: true,
        handler() {
          const collections = Object.values(this.collectionWidth)

          collections.forEach((widths: number[], i: number) => {
            const width = Math.max(...widths)
            const minDynamicWidth =
              width < this.defaultMinWidth ? width : this.defaultMinWidth

            Vue.set(this.width, i, width)
            Vue.set(this.minDynamicWidth, i, minDynamicWidth)
          })
        },
      },

      matchedWidth() {
        const matchedWidth = Object.values(this.matchedWidth)

        this.isColumnsWidthUpdated =
          matchedWidth.length - 1 === this.lastColumnIndex &&
          matchedWidth.every((match: boolean) => match)
      },
    },

    methods: {
      initTableData(tableData: never[] & IUnknownKeys[]): void {
        this.tableData = tableData
        this.setOuterSelection(this.outerRowSelected)
      },

      initTableProps(props: IUnknownKeys): void {
        Object.assign(this, props)
      },

      initColumnProps(isLastColumn: boolean, columnProps: IUnknownKeys): void {
        if (isLastColumn) {
          this.lastColumnIndex = this.columnProps.length
        }

        this.columnProps.push(columnProps)
        this.setAmountPadding(columnProps)
      },

      isCheckedBodyRow(row: IUnknownKeys): boolean {
        const isChecked = this.selected[this.getKeyRow(row)]

        return typeof isChecked === 'boolean' ? isChecked : false
      },

      isCheckedHeadRow(): boolean {
        const { unlockedRowSize, selectedRowSize } = this.getRowSizes()

        return selectedRowSize > 0 && selectedRowSize === unlockedRowSize
      },

      isIndeterminateHeadRow(): boolean {
        const { unlockedRowSize, selectedRowSize } = this.getRowSizes()

        return selectedRowSize > 0 && selectedRowSize < unlockedRowSize
      },

      isDisabledBodyRow(row: IUnknownKeys): boolean {
        return this.columnProps.some((prop: IUnknownKeys) => {
          const { disabledRow } = prop

          return typeof disabledRow === 'function'
            ? disabledRow(row)
            : disabledRow
        })
      },

      changeSelection(row: IUnknownKeys, checked: boolean, mode: string): void {
        mode === 'radio'
          ? this.selectRadioRow(row, checked)
          : this.selectCheckboxRow(row, checked)
      },

      changeAllSelection(checked: boolean): void {
        this.tableData.forEach((row) => this.selectCheckboxRow(row, checked))
      },

      getSortedItem(index: number): ISortedItem {
        return this.sortedItems[index]
      },

      getValueRow(row: string): IUnknownKeys {
        return JSON.parse(row)
      },

      getKeyRow(row: IUnknownKeys): string {
        return JSON.stringify(row)
      },

      getKeyRows(rows: IUnknownKeys[]): string[] {
        return rows.map((row) => this.getKeyRow(row))
      },

      getValueRows(rows: string[]): IUnknownKeys[] {
        return rows.map((row) => this.getValueRow(row))
      },

      getRowSizes(): INumberKeys {
        return {
          unlockedRowSize: this.getCurrentUnlockedRows().length,
          selectedRowSize: this.getCurrentSelectedRows().length,
        }
      },

      getCurrentUnlockedRows(): IUnknownKeys[] {
        return this.tableData.filter((item) => !this.isDisabledBodyRow(item))
      },

      getCurrentSelectedRows(): IUnknownKeys[] {
        return this.tableData.filter((row) =>
          Object.entries(this.selected)
            .filter(([, value]) => value)
            .map(([key]) => key)
            .includes(this.getKeyRow(row))
        )
      },

      getToTalSelectedRows(): IUnknownKeys[] {
        return Object.entries(this.selected)
          .filter(([, value]) => value)
          .map(([key]) => this.getValueRow(key))
      },

      selectCheckboxRow(row: IUnknownKeys, checked: boolean): void {
        if (this.isDisabledBodyRow(row)) {
          return
        }

        const keyRow = this.getKeyRow(row)

        Vue.set(this.selected, keyRow, checked)
        this.setOuterRowUnselected(keyRow, checked)
      },

      selectRadioRow(row: IUnknownKeys, checked: boolean): void {
        if (this.isDisabledBodyRow(row)) {
          return
        }

        this.selected = { [this.getKeyRow(row)]: checked }
      },

      setOuterRowUnselected(keyRow: string, checked: boolean): void {
        if (this.outerRowSelected === null) {
          return
        }

        const outerSelectedKeyRows = this.getKeyRows(this.outerRowSelected)
        const containsUnselectedOuterRows =
          outerSelectedKeyRows.includes(keyRow)

        if (checked || !containsUnselectedOuterRows) {
          return
        }

        const outerUnselectedKeyRows = this.getKeyRows(this.outerRowUnselected)
        const uniqueOuterUnselectedKeyRows = [
          ...new Set([...outerUnselectedKeyRows, keyRow]),
        ]

        Vue.set(
          this,
          'outerRowUnselected',
          this.getValueRows(uniqueOuterUnselectedKeyRows)
        )
      },

      setOuterSelection(outerRowSelected: IUnknownKeys[]): void {
        if (outerRowSelected === null) {
          return
        }

        if (!Array.isArray(outerRowSelected)) {
          if (Object.keys(this.selected).length > 0) {
            return
          }

          this.selectRadioRow(outerRowSelected, true)

          return
        }

        const outerSelectedKeyRows = this.getKeyRows(outerRowSelected)
        const outerUnselectedKeyRows = this.getKeyRows(this.outerRowUnselected)

        this.tableData.forEach((row) => {
          const keyRow = this.getKeyRow(row)
          const containsOuterSelectedRows =
            outerSelectedKeyRows.includes(keyRow)
          const containsOuterUnselectedRows =
            outerUnselectedKeyRows.includes(keyRow)

          if (!containsOuterSelectedRows || containsOuterUnselectedRows) {
            return
          }

          this.selectCheckboxRow(row, true)
        })
      },

      updateOuterSelection(
        outerRowSelected: IUnknownKeys | IUnknownKeys[]
      ): void {
        if (outerRowSelected === null) {
          return
        }

        if (!Array.isArray(outerRowSelected)) {
          this.selectRadioRow(outerRowSelected, true)

          return
        }

        Vue.set(this, 'outerRowUnselected', [])
        Vue.set(this, 'outerRowSelected', outerRowSelected)

        if (outerRowSelected.length === 0) {
          Vue.set(this, 'selected', {})
          return
        }

        const outerSelectedKeyRows = this.getKeyRows(outerRowSelected)
        this.tableData.forEach((row) => {
          const keyRow = this.getKeyRow(row)
          const containOuterSelectedRows = outerSelectedKeyRows.includes(keyRow)

          if (!containOuterSelectedRows) {
            return
          }

          this.selectCheckboxRow(row, true)
        })
      },

      setAmountPadding({ paddingColumnX }: IUnknownKeys): void {
        if (typeof paddingColumnX === 'number') {
          const padding =
            paddingColumnX >= 0 ? paddingColumnX : this.paddingColumnsX
          this.amountPaddings.push(padding * 2)
        }

        if (Array.isArray(paddingColumnX)) {
          const [left, right] = paddingColumnX
          const padding = left + right

          this.amountPaddings.push(padding)
        }
      },

      setDynamicWidth(width: number, index: number): void {
        Vue.set(this.dynamicWidth, index, width)
      },

      setHoverColumn(hover: boolean, index: number): void {
        Vue.set(this.hoverColumn, index, hover)
      },

      setHoverResize(hover: boolean, index: number): void {
        Vue.set(this.hoverResize, index, hover)
      },

      setActiveResizeStatus(active: boolean): void {
        this.isActiveResize = active
      },

      setActiveResizeColumn(active: boolean, index: number): void {
        Vue.set(this.activeResizeColumns, index, active)
      },

      setAutoWidthNodes(ref: HTMLElement, index: number): void {
        Vue.set(this.autoWidthNodes, index, ref)
      },

      setSortedItems({ index, sortBy, columnKey }: ISortedOption) {
        if (sortBy === '') {
          return
        }

        if (typeof sortBy === 'string') {
          Vue.set(this.sortedItems, index, {
            sortBy,
            active: this.sortedItems[index]?.active,
          })
        }

        if (typeof sortBy === 'object') {
          const { order_by, direction } = sortBy
          const isActiveSort = order_by === columnKey

          Vue.set(this.sortedItems, index, {
            active: isActiveSort,
            sortBy: isActiveSort ? direction : 'asc',
          })
        }
      },

      updateSortedItems({ index, sortBy }: ISortedOption) {
        Object.entries(this.sortedItems).forEach(([key, value]) => {
          const isActive = Number(key) === index

          value.active = isActive

          if (isActive) {
            value.sortBy = sortBy === 'desc' ? 'asc' : 'desc'
          }
        })
      },

      setCollectionWidth(
        width: number,
        index: number,
        isSpecifiedWidth: boolean
      ): void {
        const padding = isSpecifiedWidth ? 0 : this.amountPaddings[index]
        const currentCollectionWidth: number[] =
          this.collectionWidth[index] ?? []
        const fullWidth = Math.ceil(width + padding)
        const totalWidth = fullWidth % 2 === 0 ? fullWidth : fullWidth + 1

        Vue.set(this.collectionWidth, index, [
          ...new Set([...currentCollectionWidth, totalWidth]),
        ])
      },

      checkWidthMatches(width: number, index: number): void {
        Vue.set(this.matchedWidth, index, width === this.width[index])
      },

      clearCollectionWidth(): void {
        this.collectionWidth = {}
      },
    },
  })
