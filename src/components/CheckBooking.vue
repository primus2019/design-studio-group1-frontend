<template>
  <div class="check-booking">
    <b-button
      class="check-booking-button"
      variant="outline-info"
      v-b-modal.checkBookingModal
      @click="showOperations"
    >
      查看
    </b-button>
    <b-modal
      id="checkBookingModal"
      hide-header
      ok-only
    >
      <b-list-group>
        <div v-for="(oneTypeOperation, key, index) in operations" :key="index">
          <div v-for="singleOperation in oneTypeOperation" :key="singleOperation">
            <b-list-group-item>
              <b-row>
                <b-col cols="2">
                  <h5>{{ key }}</h5>
                </b-col>
                <b-col cols="2">
                  <h5>{{ singleOperation }}</h5>
                </b-col>
                <b-col cols="4"/>
                <b-col cols="4">
                  <b-row align-h="end">
                    <b-button
                     variant="outline-dark"
                     @click="removeOperation(key, singleOperation)"
                    >
                      remove
                    </b-button>
                  </b-row>
                </b-col>
              </b-row>
            </b-list-group-item>
          </div>
        </div>
      </b-list-group>
    </b-modal>
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
    },
    removeOperation (operation, tableId) {
      this.$emit('remove', operation, tableId)
    }
  },
  watch: {
    operations: {
      deep: true,
      handler: function (val) {
        this.localOperations = val
        console.log('child component update localOperations', this.localOperations)
      }
    }
  },
  mounted () {
    this.localOperations = this.operations
    console.log('child component mounted localOperations', this.localOperations)
  }
}
</script>
