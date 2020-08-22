<template>
  <div>
    <b-input-group id="search-group">
      <b-form-input placeholder="Look for dish? Search here."/>
      <b-input-group-append>
        <b-button>Search</b-button>
      </b-input-group-append>
    </b-input-group>
  </div>
</template>

<script>
export default {
  name: 'Search'
}
</script>

<style>
#search-group {
  position: absolute;
  width: 621px;
  height: 38px;
  left: 586px;
  top: 69px;
}
</style>
