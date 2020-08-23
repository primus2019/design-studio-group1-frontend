<template>
  <div class="table-list">
    <b-table
      class="table-table"
      :items="tableList"
      :fields="tableFields"
      head-variant="light"
      table-variant="light"
      hover
    >
      <template v-slot:cell(operations)="singleTable">
        <b-button
          size="sm"
          variant="outline-success"
          v-if="singleTable.item.status === 1"
        >
          Book
        </b-button>
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
        { table_id: 0, max_content: 4, status: 0 },
        { table_id: 1, max_content: 4, status: 1 },
        { table_id: 0, max_content: 4, status: 0 },
        { table_id: 0, max_content: 4, status: 0 },
        { table_id: 2, max_content: 4, status: 1 },
        { table_id: 0, max_content: 4, status: 0 },
        { table_id: 0, max_content: 4, status: 0 },
        { table_id: 0, max_content: 4, status: 0 },
        { table_id: 0, max_content: 4, status: 0 },
        { table_id: 3, max_content: 4, status: 1 },
        { table_id: 0, max_content: 4, status: 0 },
        { table_id: 0, max_content: 4, status: 0 },
        { table_id: 0, max_content: 4, status: 0 },
        { table_id: 0, max_content: 4, status: 0 },
        { table_id: 4, max_content: 4, status: 1 }
      ]
    }
  },
  data () {
    return {
      tableFields: ['table_id', 'max_content', 'status', 'operations']
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
</style>
