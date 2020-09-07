<template>
  <div id="dish">
    <b-card-group>
      <div
        id="dishWidth"
        v-for="(dish, index) in dishes"
        :key="index"
      >
      <b-card
        border-variant="light"
        :id="'dish-card-'+dish.type"
        class="dish-card"
        no-body
      >
        <b-row no-gutters align-v="center">
          <b-col xl="5" lg="5" md="5" sm="5" cols="5">
            <b-img
              :src="'data:image/png;base64,'+dish.picture"
              style="width:100%;"
              :alt="dish.name"
              rounded
            ></b-img>
          </b-col>
          <b-col xl="7" lg="7" md="7" sm="7" cols="7">
            <!-- <b-row style="margin:0;height:100%" class="d-flex flex-row justify-content-between">
              <b-col xl="4" lg="4" md="4" sm="4" cols="4" class="d-flex flex-column justify-content-between">
                <label>{{ dish.name }}</label>
                <label>￥{{ dish.price }}</label>
              </b-col>
              <b-col xl="8" lg="8" md="8" sm="8" cols="8" class="d-flex flex-column justify-content-end">
                <b-row align-h="end">
                  <b-button
                    style="width:5.5vmin;height:5.5vmin;border-radius:5.5vmin;padding:0 0.5vmin;"
                    variant="outline-primary"
                    class=""
                    @click="changeOrderCount(dish.dish_id, dish.orderCount - 1)"
                    :disabled="dish.orderCount === 0 || !dish.selectable"
                    v-if="!orderSet"
                  >
                    <b-icon style="width:4vmin;" icon="dash"/>
                  </b-button>
                  <label style="text-align:center;vertical-align:bottom;" class="ml-2 mr-2">{{ dish.orderCount }}</label>
                  <b-button
                    style="width:5.5vmin;height:5.5vmin;border-radius:5.5vmin;padding:0 0.5vmin;"
                    variant="primary"
                    class=""
                    @click="changeOrderCount(dish.dish_id, dish.orderCount + 1)"
                    :disabled="!dish.selectable"
                    v-if="!orderSet"
                  >
                    <b-icon style="width:4vmin;" icon="plus"/>
                  </b-button>
                  <b-button
                    v-if="dish.orderCount !== 0 && orderSet && !isTakeout"
                    @click="$emit('remove', dish.dish_id)"
                  >
                    remove
                  </b-button>
                </b-row>
              </b-col>
            </b-row> -->
            <b-row align-h="start" align-v="start" style="margin:0;height:50%;">
              <label class="dish-name-label">{{ dish.name }}</label>
            </b-row>
            <b-row align-h="between" align-v="end" style="height:50%;">
              <b-col xl="4" lg="4" md="4" sm="4" cols="4">
                <b-row align-h="start" style="margin:0;">
                  <label class="dish-price-label"><span class="yuan-symbol">￥</span>{{ dish.price }}</label>
                </b-row>
              </b-col>
              <b-col xl="8" lg="8" md="8" sm="8" cols="8">
                <b-row align-h="end" style="margin:0;margin-bottom:8px;margin-right:8px" align-v="center">
                  <b-button
                    class="add-remove-button"
                    variant="outline-primary"
                    @click="changeOrderCount(dish.dish_id, dish.orderCount - 1)"
                    :disabled="dish.orderCount === 0 || !dish.selectable"
                    v-if="!orderSet"
                  >
                    <b-icon scale="0.8" class="add-remove-icon" icon="dash"/>
                  </b-button>
                  <label style="text-align:center;vertical-align:bottom;margin-bottom:0;font-size:12pt;" class="ml-2 mr-2">{{ dish.orderCount }}</label>
                  <b-button
                    variant="primary"
                    class="add-remove-button"
                    @click="changeOrderCount(dish.dish_id, dish.orderCount + 1)"
                    :disabled="!dish.selectable"
                    v-if="!orderSet"
                  >
                    <b-icon scale="0.8" class="add-remove-icon" icon="plus"/>
                  </b-button>
                  <b-button
                    v-if="dish.orderCount !== 0 && orderSet && !isTakeout"
                    @click="$emit('remove', dish.dish_id)"
                  >
                    remove
                  </b-button>
                </b-row>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
          <!-- </b-container> -->
        <!-- </div> -->
      </b-card>
      </div>
    </b-card-group>
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
      var oldOrderCount = 0
      this.dishes.forEach((dish) => {
        if (dish.dish_id === dishId) {
          oldOrderCount = dish.orderCount
          dish.orderCount = newOrderCount
        }
      })
      // console.log('DishPane: changeOrderCount', dishId, newOrderCount)
      this.$emit('change', dishId, newOrderCount, oldOrderCount)
    }
  }
}
</script>

<style scoped>
#dish {
  overflow-x: hidden;
  overflow-y: auto;
}
@media all and (min-width: 576px) and (max-width: 992px) {
  #dishWidth {
    min-width: 100%;
  }
}
@media not all and (min-width: 576px) and (max-width: 992px) {
  #dishWidth {
    min-width: 50%;
  }
}

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

.add-remove-button{
  width:18px;
  height:18px;
  border-radius:18px;
  padding:0;
  position:relative;
}

.add-remove-icon{
  position:absolute;
  top:0px;
  left:0px;
  width:16px;
  height:16px;
}
</style>
