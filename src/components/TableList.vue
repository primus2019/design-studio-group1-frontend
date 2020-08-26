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
              v-if="singleTable.item.book_status === 1"
              @click="updateOperation('book', singleTable.item.table_id)"
            >
              Book
            </b-button>
            <b-button
              size="sm"
              class="table-list-operation-button"
              variant="outline-success"
              v-if="singleTable.item.book_status === 0"
              @click="updateOperation('cancel', singleTable.item.table_id)"
            >
              Cancel
            </b-button>
            <b-button
              size="sm"
              class="table-list-operation-button"
              variant="outline-info"
              @click="updateOperation('merge', singleTable.item.table_id)"
            >
              Merge
            </b-button>
            <b-button
              size="sm"
              class="table-list-operation-button"
              variant="outline-info"
              @click="updateOperation('split', singleTable.item.table_id)"
            >
              Split
            </b-button>
            <b-button
              size="sm"
              class="table-list-operation-button"
              variant="outline-primary"
              v-if="singleTable.item.book_status === 1"
              @click="updateOperation('open', singleTable.item.table_id)"
            >
              Open
            </b-button>
          </b-button-group>
        </b-row>
      </template>
      <template v-slot:cell(book_status)="singleTable">
        {{ bookStatusDict[singleTable.item.book_status] }}
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
        { table_id: 0, table_content: 4, book_status: 0 },
        { table_id: 1, table_content: 4, book_status: 0 },
        { table_id: 2, table_content: 4, book_status: 1 },
        { table_id: 3, table_content: 4, book_status: 1 },
        { table_id: 4, table_content: 4, book_status: 1 },
        { table_id: 5, table_content: 4, book_status: 1 },
        { table_id: 6, table_content: 4, book_status: 0 },
        { table_id: 7, table_content: 4, book_status: 0 },
        { table_id: 8, table_content: 4, book_status: 0 },
        { table_id: 9, table_content: 4, book_status: 1 },
        { table_id: 10, table_content: 4, book_status: 0 },
        { table_id: 11, table_content: 4, book_status: 0 },
        { table_id: 12, table_content: 4, book_status: 0 },
        { table_id: 13, table_content: 4, book_status: 0 },
        { table_id: 14, table_content: 4, book_status: 1 }
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
      tableFields: ['table_id', 'table_content', 'book_status', 'operations'],
      filterTrigger: { filterText: '' },
      tableListSortBy: 'table_id',
      tableListDesc: false,
      // statusDict: {
      //   '-1': '不可使用',
      //   0: '可用',
      //   1: '已占(主台)',
      //   2: '已占(副台)',
      //   3: '被预定',
      //   4: '清洁中'
      // },
      bookStatusDict: {
        0: '不可选', 1: '可选'
      }
    }
  },
  methods: {
    // tableListFilter (table, filterObject) {
    //   return table.status === 0 || (this.showBookedTables && table.status === 3) ||
    //     (this.showUnavailableTables && [-1, 1, 2, 4].includes(table.status))
    // }
    tableListFilter (table, filterObject) {
      return table.book_status === 1 || (table.book_status === 0 && this.showBookedTables)
    },
    updateOperation (operation, tableId) {
      console.log('child component update operation', operation, tableId)
      this.$emit('operation', operation, tableId)
    }
  }
}
</script>

<style>
.table-list {
  /* position: absolute; */
  /* width: 1247px;
  height: 621px; */
  /* left: 77px;
  top: 297px; */
  overflow-y: auto;
  overflow-x: hidden;
}
.table-table {
  /* position: absolute; */
}
.table-list-operation-button {
  width: 100px;
}
</style>
