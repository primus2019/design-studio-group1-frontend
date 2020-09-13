<template>
  <div id="dish">
    <b-container fluid>
      <div
        id="dishWidth"
        v-for="(dish, index) in dishes"
        :key="index"
      >
        <b-row
          v-if="index % 2 === 0"
          :id="'dish-card-'+dish.type"
        >
          <b-col xl="6" lg="6" md="6" sm="12" cols="12">
            <b-row no-gutters align-v="stretch" align-h="between">
              <b-col xl="5" lg="5" md="5" sm="5" cols="5">
                <b-row align-h="start" align-v="center" style="margin: 0;">
                  <b-img
                    :src="'data:image/png;base64,'+dish.picture"
                    style="max-width:100%;height:auto;"
                    :alt="dish.name"
                    rounded
                  ></b-img>
                </b-row>
              </b-col>
              <b-col xl="7" lg="7" md="7" sm="7" cols="7">
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
                    <b-row align-h="end" style="margin:0;margin-bottom:8px;margin-right:12px;padding-bottom:2px" align-v="center">
                      <b-button
                        class="add-remove-button"
                        :variant="dish.selectable ? 'outline-primary' : 'outline-secondary'"
                        @click="changeOrderCount(dish.dish_id, dish.orderCount - 1)"
                        :disabled="dish.orderCount === 0 || !dish.selectable"
                        v-if="!orderSet"
                      >
                        <b-icon scale="0.8" class="add-remove-icon" icon="dash"/>
                      </b-button>
                      <label style="text-align:center;vertical-align:bottom;margin-bottom:0;font-size:12pt;" class="ml-2 mr-2">{{ dish.orderCount }}</label>
                      <b-button
                        class="add-remove-button"
                        :variant="dish.selectable && dish.addable ? 'primary' : 'secondary'"
                        @click="changeOrderCount(dish.dish_id, dish.orderCount + 1)"
                        :disabled="!dish.selectable || !dish.addable"
                        v-if="!orderSet"
                      >
                        <b-icon scale="0.8" class="add-remove-icon" icon="plus"/>
                      </b-button>
                      <b-button
                        variant="outline-info"
                        v-if="orderSet && !isTakeout"
                        :disabled="!dish.selectable || !dish.addable || paymentSet"
                        @click="$emit('add', dish.dish_id)"
                      >
                        加菜
                      </b-button>
                      <b-button
                        variant="outline-secondary"
                        v-if="dish.orderCount !== 0 && orderSet && !isTakeout"
                        :disabled="dish.orderCount === 0 || !dish.selectable || paymentSet"
                        @click="$emit('remove', dish.dish_id)"
                      >
                        删菜
                      </b-button>
                    </b-row>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-col>
          <b-col xl="6" lg="6" md="6" sm="12" cols="12">
            <b-row no-gutters align-v="stretch" align-h="between">
              <b-col xl="5" lg="5" md="5" sm="5" cols="5">
                <b-row align-h="start" align-v="center" style="margin: 0;">
                  <b-img
                    :src="'data:image/png;base64,'+dishes[index + 1].picture"
                    style="max-width:100%;height:auto;"
                    :alt="dishes[index + 1].name"
                    rounded
                  ></b-img>
                </b-row>
              </b-col>
              <b-col xl="7" lg="7" md="7" sm="7" cols="7">
                <b-row align-h="start" align-v="start" style="margin:0;height:50%;">
                  <label class="dish-name-label">{{ dishes[index + 1].name }}</label>
                </b-row>
                <b-row align-h="between" align-v="end" style="height:50%;">
                  <b-col xl="4" lg="4" md="4" sm="4" cols="4">
                    <b-row align-h="start" style="margin:0;">
                      <label class="dish-price-label"><span class="yuan-symbol">￥</span>{{ dishes[index + 1].price }}</label>
                    </b-row>
                  </b-col>
                  <b-col xl="8" lg="8" md="8" sm="8" cols="8">
                    <b-row align-h="end" style="margin:0;margin-bottom:8px;margin-right:12px;padding-bottom:2px" align-v="center">
                      <b-button
                        class="add-remove-button"
                        :variant="dishes[index + 1].selectable ? 'outline-primary' : 'outline-secondary'"
                        @click="changeOrderCount(dishes[index + 1].dish_id, dishes[index + 1].orderCount - 1, dishes[index + 1].orderCount)"
                        :disabled="dishes[index + 1].orderCount === 0 || !dishes[index + 1].selectable"
                        v-if="!orderSet"
                      >
                        <b-icon scale="0.8" class="add-remove-icon" icon="dash"/>
                      </b-button>
                      <label style="text-align:center;vertical-align:bottom;margin-bottom:0;font-size:12pt;" class="ml-2 mr-2">{{ dishes[index + 1].orderCount }}</label>
                      <b-button
                        class="add-remove-button"
                        :variant="dishes[index + 1].selectable && dishes[index + 1].addable ? 'primary' : 'secondary'"
                        @click="changeOrderCount(dishes[index + 1].dish_id, dishes[index + 1].orderCount + 1, dishes[index + 1].orderCount)"
                        :disabled="!dishes[index + 1].selectable || !dishes[index + 1].addable"
                        v-if="!orderSet"
                      >
                        <b-icon scale="0.8" class="add-remove-icon" icon="plus"/>
                      </b-button>
                      <b-button
                        variant="outline-info"
                        v-if="orderSet && !isTakeout"
                        :disabled="!dishes[index + 1].selectable || !dishes[index + 1].addable || paymentSet"
                        @click="$emit('add', dishes[index + 1].dish_id)"
                      >
                        加菜
                      </b-button>
                      <b-button
                        variant="outline-secondary"
                        v-if="dishes[index + 1].orderCount !== 0 && orderSet && !isTakeout"
                        :disabled="dishes[index + 1].orderCount === 0 || !dishes[index + 1].selectable || paymentSet"
                        @click="$emit('remove', dishes[index + 1].dish_id)"
                      >
                        删菜
                      </b-button>
                    </b-row>
                  </b-col>
                </b-row>
              </b-col>
            </b-row>
          </b-col>
        </b-row>
      </div>
    </b-container>
  </div>
</template>

<script>
export default {
  name: 'DishPane',
  props: {
    orderSet: {
      type: Boolean
    },
    paymentSet: {
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
