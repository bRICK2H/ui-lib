<script>
export default {
  name: 'UiTableGroupRows',

  props: {
    groupKey: {
      type: String,
      required: true,
    },

    groupValue: {
      type: [String, Array],
      required: true,
    },
  },

  computed: {
    indexGroupRows() {
      return this.groupRows.indexOf(this)
    },

    groupRows() {
      return this.$parent.$children.filter(({ $options }) => {
        return ['ui-table-group-rows', 'UiTableGroupRows'].includes(
          $options._componentTag
        )
      })
    },
  },

  mounted() {
    //  Удаляем компонент текущий группы, что-бы не оставлять в дереве пустые экземпляры. Все необходимые ссылки прокидываем перед удалением на верхний уровень (таблице)
    this.$destroy()
  },

  beforeDestroy() {
    const tableContext = this.$parent

    tableContext.bus.$emit('group-rows-options', {
      ctx: tableContext,
      options: {
        groupRowsProps: this.$props,
        scopedSlots: this.$scopedSlots,
      },
    })
  },

  render: (h) => h('div'),
}
</script>
