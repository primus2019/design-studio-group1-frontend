<template>
  <div class="table-list">
    <b-table
      class="table-table"
      :items="tableList"
      :fields="tableFields"
      :filter="filterTrigger"
      :filter-function="tableListFilter"
      :sort-by.sync="tableListSortBy"
      :sort-desc.sync="tableListDesc"
      head-variant="light"
      table-variant="light"
      hover
    >
      <template v-slot:cell(operations)="singleTable">
        <b-row align-h="start">
          <b-button-group>
            <b-button
              size="sm"
              class="table-list-operation-button"
              variant="outline-success"
              v-if="singleTable.item.status === 0"
            >
              Book
            </b-button>
            <b-button
              size="sm"
              class="table-list-operation-button"
              variant="outline-success"
              v-if="singleTable.item.status === 3"
            >
              Cancel
            </b-button>
            <b-button
              size="sm"
              class="table-list-operation-button"
              variant="outline-info"
              v-if="singleTable.item.status === 1 || singleTable.item.status === 2"
            >
              Merge
            </b-button>
            <b-button
              size="sm"
              class="table-list-operation-button"
              variant="outline-info"
              v-if="singleTable.item.status === 1 || singleTable.item.status === 2"
            >
              Split
            </b-button>
            <b-button
              size="sm"
              class="table-list-operation-button"
              variant="outline-primary"
              v-if="singleTable.item.status === 0 || singleTable.item.status === 3"
            >
              Open
            </b-button>
            <b-button
              size="sm"
              class="table-list-operation-button"
              variant="outline-primary"
              v-if="singleTable.item.status === 1 || singleTable.item.status === 2"
            >
              Close
            </b-button>
            <b-button
              size="sm"
              class="table-list-operation-button"
              variant="outline-secondary"
              v-if="singleTable.item.status !== -1"
            >
              Suspend
            </b-button>
            <b-button
              size="sm"
              class="table-list-operation-button"
              variant="outline-secondary"
              v-if="singleTable.item.status === -1"
            >
              Turn on
            </b-button>
          </b-button-group>
        </b-row>
      </template>
      <template v-slot:cell(status)="singleTable">
        {{ statusDict[singleTable.item.status] }}
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: 'TableList',
  props: {
    tableList: {
      type: Array,
      default: () => [
        { table_id: 0, max_content: 4, status: -1 },
        { table_id: 1, max_content: 4, status: 0 },
        { table_id: 2, max_content: 4, status: 1 },
        { table_id: 3, max_content: 4, status: 2 },
        { table_id: 4, max_content: 4, status: 3 },
        { table_id: 5, max_content: 4, status: 4 },
        { table_id: 6, max_content: 4, status: 0 },
        { table_id: 7, max_content: 4, status: 0 },
        { table_id: 8, max_content: 4, status: 0 },
        { table_id: 9, max_content: 4, status: 1 },
        { table_id: 10, max_content: 4, status: 0 },
        { table_id: 11, max_content: 4, status: 0 },
        { table_id: 12, max_content: 4, status: 0 },
        { table_id: 13, max_content: 4, status: 0 },
        { table_id: 14, max_content: 4, status: 1 }
      ]
    },
    showBookedTables: {
      type: Boolean,
      default: false
    },
    showUnavailableTables: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      tableFields: ['table_id', 'max_content', 'status', 'operations'],
      filterTrigger: { filterText: '' },
      tableListSortBy: 'table_id',
      tableListDesc: false,
      statusDict: {
        '-1': '不可使用',
        0: '可用',
        1: '已占(主台)',
        2: '已占(副台)',
        3: '被预定',
        4: '清洁中'
      }
    }
  },
  methods: {
    tableListFilter (table, filterObject) {
      return table.status === 0 || (this.showBookedTables && table.status === 3) ||
        (this.showUnavailableTables && [-1, 1, 2, 4].includes(table.status))
    }
  }
}
</script>

<style>
.table-list {
  position: absolute;
  width: 1247px;
  height: 621px;
  left: 77px;
  top: 297px;
  overflow-y: auto;
}
.table-table {
  position: absolute;
}
.table-list-operation-button {
  width: 100px;
}
</style>
