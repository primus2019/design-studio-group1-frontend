<template>
  <div class="place-booking">
    <b-dropdown
      class="place-booking-button"
      variant="outline-success"
      text="提交"
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
        'open',
        'merge',
        'split',
        'finish'
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
