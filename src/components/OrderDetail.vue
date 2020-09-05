<template>
  <b-modal
    :id="orderDetailModalId"
    centered
    scrollable
    ok-only
    button-size="md"
    title="Your orders"
  >
    <div v-if="emptyDish">No order</div>
    <b-list-group>
      <div v-for="dish in dishes" :key="dish.dish_id">
        <b-list-group-item  v-if="dish.orderCount !== 0">
          <b-row class="ml-1">
            <label>{{ dish.name }}</label>
          </b-row>
          <b-row align-h="between" align-v="center">
            <b-col xl="6" lg="6" md="6" sm="6" cols="6">
              <p>￥{{ dish.orderCount * dish.price }}</p>
            </b-col>
            <b-col xl="6" lg="6" md="6" sm="6" cols="6">
              <b-row align-h="end" align-v="center">
                <b-button
                  variant="outline-primary"
                  class="h5"
                  @click="changeOrderCount(dish.dish_id, dish.orderCount - 1)"
                  :disabled="dish.orderCount === 0 || orderSet"
                >
                  <b-icon icon="dash"/>
                </b-button>
                <p class="ml-2 mr-2">{{ dish.orderCount }}</p>
                <b-button
                  variant="primary"
                  class="h5"
                  @click="changeOrderCount(dish.dish_id, dish.orderCount + 1)"
                  :disabled="orderSet"
                >
                  <b-icon icon="plus"/>
                </b-button>
              </b-row>
            </b-col>
          </b-row>
        </b-list-group-item>
      </div>
    </b-list-group>
  </b-modal>
</template>

<script>
export default {
  name: 'OrderDetail',
  props: {
    dishes: {
      type: Array,
      default: () => [
        { dish_id: 0, name: '红烧肉1', price: 10.00, type: '肉类1', orderCount: 1 },
        { dish_id: 1, name: '红烧肉2', price: 11.00, type: '肉类2', orderCount: 1 },
        { dish_id: 2, name: '红烧肉3', price: 12.00, type: '肉类3', orderCount: 1 },
        { dish_id: 3, name: '红烧肉4', price: 13.00, type: '肉类4', orderCount: 1 },
        { dish_id: 4, name: '红烧肉5', price: 14.00, type: '肉类5', orderCount: 1 }
      ]
    },
    isMobile: {
      type: Boolean,
      default: false
    },
    orderDetailModalId: {
      type: String,
      default: 'orderDetailModalId'
    },
    orderSet: {
      type: Boolean
    }
  },
  data () {
    return {
      localDishes: this.dishes
    }
  },
  methods: {
    changeOrderCount (dishId, newOrderCount) {
      var oldOrderCount = 0
      this.dishes.forEach((dish) => {
        if (dish.dish_id === dishId) {
          oldOrderCount = dish.orderCount
          dish.orderCount = newOrderCount
        }
      })
      this.$emit('change', dishId, newOrderCount, oldOrderCount)
    }
  },
  computed: {
    emptyDish () {
      return this.dishes.filter(dish => dish.orderCount > 0).length === 0
    }
  }
}
</script>
