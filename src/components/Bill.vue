<template>
  <b-modal
    :id="billModalId"
    centered
    hide-header
    scrollable
    button-size="lg"
  >
    <template v-slot:modal-footer>
      <b-container>
        <b-row align-h="end">
          <b-button-group>
            <b-button
              variant="primary"
              @click="$emit('pay', 'alipay')"
            >Pay with AliPay</b-button>
            <b-button
              variant="success"
              @click="$emit('pay', 'wechat')"
            >Pay with WeChat</b-button>
          </b-button-group>
        </b-row>
      </b-container>
    </template>
    <b-list-group v-for="dish in dishes" :key="dish.dish_id">
      <b-list-group-item  v-if="dish.orderCount !== 0">
        <b-container>
          <b-row class="mb-1">
            <h4>{{ dish.name }}</h4>
          </b-row>
          <b-row align-h="center" align-v="center">
            <b-col cols="5">
              <h5>总价 ￥{{ dish.orderCount * dish.price }}</h5>
            </b-col>
            <b-col cols="3"/>
            <b-col cols="2">
              <b-row align-h="center" align-v="center">
                <h5>数量 {{ dish.orderCount }}</h5>
              </b-row>
            </b-col>
          </b-row>
        </b-container>
      </b-list-group-item>
    </b-list-group>
    <b-list-group-item>
      <b-container>
        <b-row align-h="between">
          <b-col cols="3">
            <b-row align-h="start">
              <h4>总计</h4>
            </b-row>
          </b-col>
          <b-col cols="4">
            <b-row align-h="end">
              <h4>￥{{ countAllPrices() }}</h4>
            </b-row>
          </b-col>
        </b-row>
      </b-container>
    </b-list-group-item>
  </b-modal>
</template>

<script>
export default {
  name: 'Bill',
  props: {
    dishes: {
      type: Array
    },
    isMobile: {
      type: Boolean,
      default: false
    },
    billModalId: {
      type: String,
      default: 'billModalId'
    }
  },
  data () {
    return {
      localDishes: this.dishes
    }
  },
  methods: {
    countAllPrices () {
      var tmpSum = 0
      for (var i = 0; i < this.dishes.length; i++) {
        tmpSum += this.dishes[i].orderCount * this.dishes[i].price
      }
      return tmpSum
    }
  },
  computed: {
  }
}
</script>
