<template>
  <div class="search-table">
    <b-button
      id="search-table-button"
      variant="outline-dark"
      size="lg"
      @click="search"
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
