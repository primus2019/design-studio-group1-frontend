<template>
  <div class="place-booking">
    <b-dropdown
      class="place-booking-button"
      variant="outline-success"
      text="Commit operations"
    >
      <div
        v-for="operation in operationList"
        :key="operation"
      >
        <b-dropdown-item
          @click="commit(operation)"
        >
          {{ operation }}
        </b-dropdown-item>
      </div>
    </b-dropdown>
  </div>
</template>

<script>
export default {
  name: 'PlaceBookingButton',
  data () {
    return {
      operationList: [
        'book',
        'cancel',
        'open',
        'merge',
        'split'
      ]
    }
  },
  methods: {
    commit (operation) {
      this.$emit('commit', operation)
      console.log('child component emit commit', operation)
    }
  }
}
</script>

<style>
.place-booking {
  vertical-align: middle;
}
.place-booking-button {
  /* position: absolute; */
  width: 144.02px;
  height: 38px;
  /* left: 1252px;
  top: 963px; */
  z-index: 1;
}
</style>
