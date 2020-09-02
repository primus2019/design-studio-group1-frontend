<template>
    <b-button
      id="place-order-button"
      variant="outline-success"
      pill
      size="sm"
      @click="addOrder"
      style="width: 5vw;"
    >
      <p style="font-weight:bold;">
        {{ orderSet ? '改单' : '下单' }}
      </p>
    </b-button>
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
