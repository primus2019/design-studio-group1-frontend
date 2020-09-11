<template>
  <b-modal
    :id="orderDetailModalId"
    centered
    scrollable
    ok-only
    button-size="md"
    title="已选菜品"
  >
    <div v-if="emptyDish">没有已选菜品</div>
    <b-list-group>
      <div v-for="dish in dishes" :key="dish.dish_id">
        <b-list-group-item  v-if="dish.orderCount !== 0">
          <b-row class="ml-1">
            <label class="dish-name-label">{{ dish.name }}</label>
          </b-row>
          <b-row align-v="center">
            <b-col xl="5" lg="5" md="5" sm="5" cols="5">
              <p class="dish-price-label"><span class="yuan-symbol">￥</span>{{ dish.orderCount * dish.price }}</p>
            </b-col>
            <b-col xl="6" lg="6" md="6" sm="6" cols="6">
              <b-row align-h="end" align-v="center" style="margin-bottom:8px;">
                <b-button
                  variant="outline-primary"
                  class="h5"
                  @click="changeOrderCount(dish.dish_id, dish.orderCount - 1)"
                  :disabled="dish.orderCount === 0"
                  v-if="!orderSet"
                >
                  <b-icon icon="dash"/>
                </b-button>
                <p class="ml-3 mr-3" style="text-align:center;margin-bottom:8px;font-size:16pt;">{{ dish.orderCount }}</p>
                <b-button
                  variant="primary"
                  class="h5"
                  @click="changeOrderCount(dish.dish_id, dish.orderCount + 1)"
                  v-if="!orderSet"
                  :disabled="!dish.selectable"
                >
                  <b-icon icon="plus"/>
                </b-button>
                <b-button
                  variant="outline-primary"
                  class="h5"
                  @click="$emit('add', dish.dish_id)"
                  v-if="orderSet && !isTakeout"
                >
                  加菜
                </b-button>
                <b-button
                  variant="primary"
                  class="h5"
                  @click="$emit('remove', dish.dish_id)"
                  v-if="orderSet && !isTakeout"
                >
                  删菜
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
    },
    isTakeout: {
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

<style scoped>
.dish-name-label{
 padding: 5pt;
 font-size: 16pt;
 font-weight: 600;
}

.yuan-symbol{
  font-size: 12pt;
  margin-left: 3pt;
}

.dish-price-label{
  color: #ff4f36;
  font-weight: 600;
  font-size: 16pt;
}
</style>
