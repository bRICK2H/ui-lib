<script>
import UiTableGroupHeadRow from './ui-table-group-head-row.vue'
import UiTableGroupBodyRow from './ui-table-group-body-row.vue'

export default {
  name: 'UiTableGroupRow',

  components: {
    UiTableGroupHeadRow,
    UiTableGroupBodyRow,
  },

  props: {
    groupRow: {
      type: Object,
      required: true,
    },
  },

  methods: {
    setActiveGroupRow(event) {
      this.$emit('set-active-group-row', event)
    },
  },

  render(h) {
    return h('div', { class: 'ui-table-group-row' }, [
      h('UiTableGroupHeadRow', {
        props: this.$attrs,
        on: { click: this.setActiveGroupRow },
        scopedSlots: this.groupRow.scopedSlots,
      }),
      h('UiTableGroupBodyRow', {
        props: this.$attrs,
      }),
    ])
  },
}
</script>

<style lang="scss">
.ui-table-group-row {
  overflow-y: clip;
}
</style>
