<template>
  <b-modal
    :id="orderDetailModalId"
    centered
    hide-header
    scrollable
    ok-only
    button-size="lg"
  >
    <b-list-group v-for="dish in dishes" :key="dish.dish_id">
      <b-list-group-item>
        <b-container>
          <b-row class="mb-1">
            <h4>{{ dish.name }}</h4>
          </b-row>
          <b-row align-h="center" align-v="center">
            <b-col cols="3">
              <h5>￥{{ dish.orderCount * dish.price }}</h5>
            </b-col>
            <b-col cols="5"/>
            <b-col cols="1">
              <b-row align-h="center" align-v="center">
                <b-button variant="outline-primary" class="h5">
                  <b-icon icon="dash"/>
                </b-button>
              </b-row>
            </b-col>
            <b-col cols="2">
              <b-row align-h="center" align-v="center">
                <h5>{{ dish.orderCount }}</h5>
              </b-row>
            </b-col>
            <b-col cols="1">
              <b-row align-h="center" align-v="center">
                <b-button variant="primary" class="h5">
                  <b-icon icon="plus"/>
                </b-button>
              </b-row>
            </b-col>
          </b-row>
        </b-container>
      </b-list-group-item>
    </b-list-group>
  </b-modal>
</template>

<script>
export default {
  name: 'OrderDetail',
  props: {
    isMobile: {
      type: Boolean,
      default: false
    },
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
    orderDetailModalId: {
      type: String,
      default: 'orderDetailModalId'
    }
  },
  methods: {
  },
  computed: {
  }
}
</script>

<style>
#order-brief {
  /* position: absolute;
  width: 455px;
  height: 38px;
  left: 686px;
  top: 963px;
  background: #C4C4C4; */
}
</style>
