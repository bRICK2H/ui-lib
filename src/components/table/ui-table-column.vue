<script>
export default {
  name: 'UiTableColumn',

  props: {
    /**
     * Ширина колонки (значения формируются в пикселях number или как string и только для значения auto)
     * 1. Необязательно указывать ширину сталбца, т.к. ширина формируеться из максимальной ширины всех значений колонок шапки и тела
     * 2. Если передать значение типа number, то это значение и будет зафиксированно для текущего столбца не больше и не меньше
     * 3. Если передать значение типа string (auto), то столбец займет свою свою максимальную ширину оставшующся от всех столбцов. Значение auto работает только для первой колонки в которой оно встретиться.
     * 4. Для последнего столца не обязательно указывать значение auto т.к. оно по умолчанию его наследует и знаимает всю оставшуюся ширину
     */
    width: {
      type: [String, Number],
      default: 0,
      validator(value) {
        return typeof value === 'number' || value === 'auto'
      },
    },

    /**
     * Горизонтальный отступ для выбранной колонки (значения переводятся в пиксели )
     * - левый и правый отступ сразу для двух сторон
     * - левый и правый отступ через массив [n, n]
     */
    paddingColumnX: {
      type: [Number, Array],
      default: -1,
      validator(value) {
        return (
          typeof value === 'number' ||
          (Array.isArray(value) &&
            value.length === 2 &&
            value.every((item) => typeof item === 'number'))
        )
      },
    },

    /**
     * Класс для тела ячейки
     */
    classBodyCell: {
      type: [String, Object, Array],
      default: '',
    },

    /**
     * Сортировать по возрастанию, убыванию
     */
    sortBy: {
      type: [String, Object],
      default: '',
      validator(value) {
        return (
          typeof (
            value === 'object' &&
            Boolean(value.order_by) &&
            Boolean(value.direction)
          ) || ['', 'asc', 'desc'].includes(value)
        )
      },
    },

    /**
     * Интерактивный режим включающий компоненты checkbox и radio button
     */
    interactiveMode: {
      type: String,
      default: '',
      validator(value) {
        return ['', 'checkbox', 'radio'].includes(value)
      },
    },

    /**
     * Заголовок колонки
     */
    label: {
      type: String,
      default: '',
    },

    /**
     * Выравнивание ячеек
     */
    align: {
      type: String,
      default: 'left',
    },

    /**
     * Название колонки как свойства объекта
     */
    columnKey: {
      type: String,
      default: '',
    },

    /**
     * Заблокировать внутренний интерактивный компонент
     */
    disabledRow: {
      type: [Boolean, Function],
      default: false,
    },
  },

  computed: {
    indexColumn() {
      return this.columns.indexOf(this)
    },

    isLastColumn() {
      return this.indexColumn === this.columns.length - 1
    },

    columns() {
      return this.$parent.$children.filter(({ $options }) => {
        return ['ui-table-column', 'UiTableColumn'].includes(
          $options._componentTag
        )
      })
    },
  },

  mounted() {
    //  Удаляем компонент текущий колонки, что-бы не оставлять в дереве пустые экземпляры. Все необходимые ссылки прокидываем перед удалением на верхний уровень (таблице)
    this.$destroy()
  },

  beforeDestroy() {
    const tableContext = this.$parent

    tableContext.bus.$emit('column-options', {
      ctx: tableContext,
      isLastColumn: this.isLastColumn,
      options: {
        columnProps: this.$props,
        scopedSlots: this.$scopedSlots,
      },
    })
  },

  render: (h) => h('div'),
}
</script>
