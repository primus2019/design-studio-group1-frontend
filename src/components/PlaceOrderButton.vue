<template>
  <div>
    <b-button
      id="place-order-button"
      variant="outline-success"
      pill
      class="h2"
      @click="addOrder"
    >
      Place Orders
    </b-button>
  </div>
</template>

<script>
export default {
  name: 'PlaceOrderButton',
  methods: {
    addOrder () {
      this.$emit('addOrder')
    }
  }
}
</script>
