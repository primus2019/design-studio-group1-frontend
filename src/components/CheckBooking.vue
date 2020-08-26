<template>
  <div class="check-booking">
    <b-button
      class="check-booking-button"
      variant="outline-info"
      @click="showOperations"
    >
      Check Bookings
    </b-button>
  </div>
</template>

<script>
export default {
  name: 'CheckBooking',
  props: {
    operations: {
      type: Object,
      default: function () { return {} }
    }
  },
  data () {
    return {
      localOperations: {}
    }
  },
  methods: {
    showOperations () {
      console.log(this.operations)
    }
  },
  watch: {
    operations: {
      deep: true,
      handler: function (val) {
        this.localOperations = val
      }
    }
  },
  mounted () {
    this.localOperations = this.operations
  }
}
</script>

<style>
.check-booking-button {
  /* position: absolute; */
  width: 151px;
  height: 38px;
  /* left: 1080px;
  top: 963px; */
  z-index: 1;
}
</style>
