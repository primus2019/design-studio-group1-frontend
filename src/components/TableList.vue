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
      sticky-header="80vh"
      style="overflow-x:hidden;"
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
              预定
            </b-button>
            <b-button
              size="sm"
              class="table-list-operation-button"
              variant="outline-info"
              @click="updateOperation('merge', singleTable.item.table_id)"
              v-if="isCurrent"
            >
              并台
            </b-button>
            <b-button
              size="sm"
              class="table-list-operation-button"
              variant="outline-info"
              @click="updateOperation('finish', singleTable.item.table_id)"
              v-if="isCurrent && singleTable.item.book_status === 0"
            >
              关台
            </b-button>
            <b-button
              size="sm"
              class="table-list-operation-button"
              variant="outline-primary"
              v-if="singleTable.item.book_status === 1 && isCurrent"
              @click="updateOperation('open', singleTable.item.table_id)"
            >
              开台
            </b-button>
          </b-button-group>
        </b-row>
      </template>
      <template v-slot:cell(book_status)="singleTable">
        {{ bookStatusDict[singleTable.item.book_status] }}
        <!-- {{ singleTable.item.book_status }} -->
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: 'TableList',
  props: {
    tableList: {
      type: Array
    },
    showBookedTables: {
      type: Boolean,
      default: false
    },
    showUnavailableTables: {
      type: Boolean,
      default: false
    },
    isCurrent: {
      type: Boolean,
      default: true
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
      },
      localTableList: null
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
  },
  watch: {
    tableList: {
      deep: true,
      handler: function (val) {
        this.localTableList = val
      }
    }
  },
  mounted () {
    this.localTableList = this.tableList
    console.log('child component mounted localTableList', this.localTableList)
  }
}
</script>

<style scoped>
.table-list {
  overflow-y: auto;
  overflow-x: hidden;
}
.table-list-operation-button {
  width: 100px;
}
</style>
