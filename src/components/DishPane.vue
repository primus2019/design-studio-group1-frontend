<template>
  <div id="dish">
    <div
      v-for="(dish, index) in dishes"
      :key="dish.dish_id"
    >
      <!-- <b-card-group
        :id="'dish-card-'+dish.type"
        deck
      > -->
        <b-card
          :id="'dish-card-'+dish.type"
          class="dish-card"
          no-body
          @mouseover="setOverlayOn(index)"
          @mouseout="setOverlayOn(null)"
        >
          <b-overlay
            :ref="'dishCardOverlay'+index"
            :show="overlayOn !== index"
            style="position:absolute;height:100%"
            variant="white"
            :opacity="0.4"
          >
            <template v-slot:overlay>
              <div/>
            </template>
            <b-img
              :src="'data:image/png;base64,'+dish.picture"
              style="height:100%"
              :alt="dish.name"
            ></b-img>
          </b-overlay>
          <b-container style="z-index:20;position:absolute;height:100%">
            <b-row align-h="start" align-v="end" class="mt-3 mb-5 ml-3">
              <h1 class="mr-5">{{ dish.name }}</h1>
              <h4>单价 ￥{{ dish.price }}</h4>
            </b-row>
            <b-row align-h="end" align-v="center" style="height:100%">
              <b-col cols="7">
                <b-row align-h="start" align-v="center">
                  <b-button-group
                    class="h5 pl-4 pr-4 ml-5 mb-5"
                  >
                    <b-button
                      v-if="dish.orderCount !== 0 && orderSet && !isTakeout"
                      @click="$emit('remove', dish.dish_id)"
                    >
                      remove
                    </b-button>
                    <b-button
                      v-if="dish.orderCount !== 0 && orderSet && !isTakeout"
                      @click="$emit('nudge', dish.dish_id)"
                    >
                      nudge
                    </b-button>
                  </b-button-group>
                </b-row>
              </b-col>
              <b-col cols="2">
                <h5>￥{{ dish.orderCount * dish.price }}</h5>
              </b-col>
              <b-col cols="1">
                <b-row align-h="center" align-v="center">
                  <b-button
                    variant="outline-primary"
                    class="h5 pl-4 pr-4"
                    @click="changeOrderCount(dish.dish_id, dish.orderCount - 1)"
                    :disabled="dish.orderCount === 0 || !dish.selectable || orderSet"
                  >
                    <b-icon icon="dash"/>
                  </b-button>
                </b-row>
              </b-col>
              <b-col cols="1">
                <b-row align-h="center" align-v="center">
                  <h5>{{ dish.orderCount }}</h5>
                </b-row>
              </b-col>
              <b-col cols="1">
                <b-row align-h="center" align-v="center">
                  <b-button
                    variant="primary"
                    class="h5 pl-4 pr-4"
                    @click="changeOrderCount(dish.dish_id, dish.orderCount + 1)"
                    :disabled="!dish.selectable || orderSet"
                  >
                    <b-icon icon="plus"/>
                  </b-button>
                </b-row>
              </b-col>
            </b-row>
          </b-container>
        </b-card>
      <!-- </b-card-group> -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'DishPane',
  props: {
    orderSet: {
      type: Boolean
    },
    dishes: {
      type: Array,
      default: () => [
        { dish_id: 0, name: '红烧肉1', price: 10.00, type: 0, orderCount: 1, typeName: '肉类' },
        { dish_id: 1, name: '红烧肉2', price: 11.00, type: 1, orderCount: 1, typeName: '肉类' },
        { dish_id: 2, name: '红烧肉3', price: 12.00, type: 2, orderCount: 1, typeName: '肉类' },
        { dish_id: 3, name: '红烧肉4', price: 13.00, type: 3, orderCount: 1, typeName: '肉类' },
        { dish_id: 4, name: '红烧肉5', price: 14.00, type: 4, orderCount: 1, typeName: '肉类' }
      ]
    },
    isTakeout: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      localDishes: this.dishes,
      overlayOn: null
    }
  },
  methods: {
    changeOrderCount (dishId, newOrderCount) {
      // this.dishes.forEach((dish) => {
      //   if (dish.dish_id === dishId) {
      //     dish.orderCount = newOrderCount
      //   }
      // })
      // console.log('DishPane: changeOrderCount', dishId, newOrderCount)
      this.$emit('change', dishId, newOrderCount)
    },
    setOverlayOn (index) {
      this.overlayOn = index
    }
  }
}
</script>

<style>
#dish {
  height: 75vh;
  overflow-x: hidden;
  overflow-y: auto;
}
.dish-card {
  position: relative;
  height: 25vh;
}
</style>
