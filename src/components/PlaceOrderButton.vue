<template>
  <div>
    <b-button
      id="place-order-button"
      variant="outline-success"
      pill
      class="h2"
      @click="addOrder"
    >
      {{ orderSet ? 'Change Orders' : 'Place Orders'}}
    </b-button>
  </div>
</template>

<script>
export default {
  name: 'PlaceOrderButton',
  props: {
    orderSet: {
      type: Boolean
    }
  },
  methods: {
    addOrder () {
      this.$emit('addOrder')
    }
  }
}
</script>
