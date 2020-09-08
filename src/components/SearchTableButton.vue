<template>
  <div class="search-table">
    <b-button
      id="search-table-button"
      variant="outline-dark"
      size="lg"
      @click="search"
      class="search-table-button"
    >
      Search
    </b-button>
  </div>
</template>

<script>
export default {
  name: 'SearchTableButton',
  methods: {
    search () {
      this.$emit('search')
    }
  }
}
</script>

<style scoped>
.search-table-button{
  margin-bottom:8px;
}
</style>
