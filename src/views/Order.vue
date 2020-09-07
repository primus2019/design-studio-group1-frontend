<template>
  <div class="order">
    <div :fluid="orderFluid">
      <b-row align-h="between" align-v="center" style="margin:0;height:10vh;" class="bg-light">
        <b-col xl="1" lg="2" md="2" sm="2" cols="2">
          <b-img src="../assets/order.png" style="height:10vh;"/>
        </b-col>
        <b-col xl="11" lg="9" md="9" sm="9" cols="9">
          <Search :dishes="dishes"/>
        </b-col>
      </b-row>
      <b-row no-gutters style="height:80vh;overflow-x:hidden;">
        <b-col xl="2" lg="2" md="2" sm="3" cols="3" style="height:100%">
          <MenuHeading :dishes="dishes"/>
        </b-col>
        <b-col xl="10" lg="10" md="10" sm="9" cols="9" style="overflow-y:auto;height:100%;">
          <DishPane
            :dishes="dishes"
            :orderSet="orderSet"
            @change="changeOrderCount"
            @remove="removeOrder"
          ></DishPane>
        </b-col>
      </b-row>
      <b-row class="bg-light" align-h="between" align-v="center" style="margin:0;height:10vh;">
        <b-col xl="1" lg="2" md="3" sm="3" cols="3" class="">
          <b-row align-h="start" align-v="center">
            <b-avatar
              src="../assets/takeout-icon.png"
              :badge="this.orderCountSum()"
              style="height:8vh;width:8vh;"
              v-b-modal.orderDetailModalId
              badge-top
            ></b-avatar>
            <label style="position:absolute;left:10vh;font-size:5vh;">￥{{ this.orderPriceSum() }}</label>
            <OrderDetail
              orderDetailModalId="orderDetailModalId"
              :orderSet="orderSet"
              :dishes="dishes"
              @change="changeOrderCount"
            ></OrderDetail>
          </b-row>
        </b-col>
        <b-col xl="2" lg="2" md="3" sm="4" cols="5">
          <b-row align-h="end" align-v="end" class="">
            <b-button
              pill
              size="md"
              style="width:50%;height:7vh;"
              v-if="orderSet"
              @click="nudge"
            >
              催单
            </b-button>
            <b-button
              pill
              size="md"
              style="width:50%;height:7vh;"
              v-if="orderSet"
              v-b-modal.billModalId
            >
              支付
            </b-button>
            <b-button
              pill
              size="md"
              style="width:50%;height:7vh;"
              @click="addOrder"
              variant="primary"
            >
              {{ orderSet ? '改单' : '下单' }}
            </b-button>
          </b-row>
        </b-col>
      </b-row>
    </div>
    <Prompter prompterId="orderPrompter" :promptText="promptText" @reset="promptText=null"/>
    <Bill billModalId="billModalId" :dishes="dishes" @pay="pay"></Bill>
    <b-modal
      id="orderTableIdModal"
      centered
      ok-only
      hide-header-close
      no-close-on-backdrop
      no-close-on-esc
      @ok.prevent="
      ![null, ''].includes(tableId) ?
        $nextTick(() => $bvModal.hide('orderTableIdModal')) :
        prompt('请输入桌号');"
    >
      <b-form>
        <label class="table-id-label" for="orderTableIdInput">您的桌号</label>
        <b-form-input
          id="orderTableIdInput"
          v-model="tableId"
          type="number"
        ></b-form-input>
      </b-form>
    </b-modal>
  </div>
</template>

<script>
import OrderDetail from '../components/OrderDetail'
import Search from '../components/Search'
import MenuHeading from '../components/MenuHeading'
import DishPane from '../components/DishPane'
// import PlaceOrderButton from '../components/PlaceOrderButton'
import axios from 'axios'
import Prompter from '../components/Prompter'
import Bill from '../components/Bill'

export default {
  name: 'Order',
  components: {
    OrderDetail,
    Search,
    MenuHeading,
    DishPane,
    // PlaceOrderButton,
    Prompter,
    Bill
  },
  data () {
    return {
      orderLogoDir: 'order.png',
      orderFluid: true,
      dishes: [],
      takeoutId: -1,
      promptText: null,
      tableId: null,
      orderTableIdDisable: false,
      orderSet: false,
      paymentMethod: null
    }
  },
  methods: {
    prompt (text) {
      this.promptText = text
    },
    orderCountSum () {
      var tmpSum = 0
      for (var i = 0; i < this.dishes.length; i++) {
        tmpSum += (this.dishes[i].orderCount) || 0
      }
      return tmpSum.toString()
    },
    orderPriceSum () {
      var tmpSum = 0
      for (var i = 0; i < this.dishes.length; i++) {
        tmpSum += (this.dishes[i].orderCount * this.dishes[i].price) || 0
      }
      return tmpSum.toString()
    },
    extendDishesDict (tmpDish) {
      for (var i = 0; i < this.dishes.length; i++) {
        tmpDish.orderCount = i
        tmpDish.price = 1
        this.dishes[i] = tmpDish
      }
    },
    dishIndex (dishId) {
      for (var i = 0; i < this.dishes.length; i++) {
        if (this.dishes[i].dish_id === dishId) {
          return this.dishes[i].dish_id
        }
      }
      this.prompt('Fail to find dish id')
      return -1
    },
    // TODO: /api/dish_residue: request/response
    changeOrderCount (dishId, newOrderCount, oldOrderCount) {
      const newOrder = this.dishes
        .filter((dish) => dish.orderCount > 0)
        .map((dish) => { return { dish_id: dish.dish_id, count: dish.orderCount } })
      console.log('dish_residue request', {
        method: 'get',
        url: 'http://localhost:8081/api/dish_residue',
        params: { dishes: newOrder }
      })
      axios({
        method: 'get',
        url: 'http://localhost:8081/api/dish_residue',
        params: { dishes: newOrder }
      })
        .then((res) => {
          console.log('dish_residue response.data', res.data)
          const soldOut = this.handleSoldout(res.data.dishes, dishId, newOrderCount)
          if (soldOut) {
            this.dishes.forEach((dish) => {
              if (dish.dish_id === dishId) {
                dish.orderCount = oldOrderCount
              }
            })
          }
        })
        .catch((err) => console.log(err))
    },
    handleSoldout (dishes) {
      for (const [dish, index] in dishes) {
        var soldOutList = []
        if (dish.sold_out === 1) {
          this.dishes[index].orderCount = 0
          this.dishes[index].selectable = false
          this.soldOutList.push(dish.name)
        }
        if (soldOutList.length !== 0) {
          this.prompt(soldOutList.join(','), 'has sold out!')
          return true
        }
      }
      return false
    },
    // /api/add_order: request/response (order only for now)
    // it should use the table related api
    addOrder () {
      if (!this.tableId) {
        this.prompt('请输入桌号')
        return
      }
      const newOrder = this.dishes
        .filter(dish => dish.orderCount > 0)
        .map(dish => { return { dish_id: dish.dish_id, count: dish.orderCount } })
      console.log('add_order request', {
        method: 'post',
        url: 'http://localhost:8081/api/add_order',
        data: { table_id: this.tableId, dishes: newOrder }
      })
      axios({
        method: 'post',
        url: 'http://localhost:8081/api/add_order',
        data: { table_id: this.tableId, dishes: newOrder }
      })
        .then((res) => {
          console.log('add_order response.data', res.data)
          if (res.data.success === 1) {
            this.prompt('Your orders are all set!')
            this.orderSet = true
          } else {
            var soldOutList = res.data.fail_dishes.map((dish) => this.getDishName(dish.dish_id))
            this.prompt(soldOutList.join(','), 'has been sold out; your order fails!')
          }
        })
        .catch((err) => console.log(err))
    },
    // TODO: /api/remove_order: request/response
    removeOrder (dishId) {
      axios({
        method: 'post',
        url: 'http://localhost:8081/api/remove_order',
        data: {
          table_id: this.tableId,
          dishes: { dish_id: dishId, count: 1 }
        }
      })
        .then((res) => {
          switch (res.data.success) {
            case 0:
              this.prompt('菜品删除失败')
              break
            case 1:
              this.prompt('菜品删除成功')
              this.dishes[this.dishIndex(dishId)] -= 1
              break
            default:
              this.prompt('bug: unexpected success in remove_order', res.data.success)
          }
        })
        .catch((err) => console.log(err))
    },
    // TODO: /api/nudge: request
    nudge (dishId) {
      axios({
        method: 'post',
        url: 'http://localhost:8081/api/nudge',
        data: { table_id: this.tableId }
      })
        .catch((err) => console.log(err))
      this.prompt('催单成功')
    },
    convertStaticDishes (dishes) {
      this.dishes = []
      var allTypes = []
      dishes.forEach((dish) => {
        if (!allTypes.includes(dish.type)) {
          allTypes.push(dish.type)
        }
        // the index of dish type in `allTypes` is the no of dish type
        var tmpDish = {}
        tmpDish.dish_id = dish.id
        tmpDish.name = dish.name
        tmpDish.price = dish.price
        tmpDish.typeName = dish.type
        tmpDish.orderCount = 0
        tmpDish.type = allTypes.indexOf(dish.type)
        tmpDish.picture = dish.picture
        tmpDish.selectable = true
        this.dishes.push(tmpDish)
      })
    },
    totalPrice () {
      var tmpSum = 0
      for (var i = 0; i < this.dishes.length; i++) {
        tmpSum += this.dishes[i].price * this.dishes[i].orderCount
      }
      return tmpSum
    },
    // TODO: /g3/confirm_payment: request/response
    //
    //
    //
    //
    pay (method) {
      this.paymentMethod = method
      axios({
        method: 'post',
        url: 'http://localhost:8081/api/pay_table',
        data: { table_id: this.tableId }
      })
        .catch((err) => console.log(err))
      axios({
        method: 'post',
        url: 'http://localhost:8081/g3/discount_payment',
        data: {
          total_price: this.totalPrice(),
          telephone: this.telephone,
          table_id: this.tableId
        }
      })
        .then((res) => {
          this.discountPrice = res.data.discount_price
        })
        .catch((err) => console.log(err))
      axios({
        method: 'post',
        url: 'http://localhost:8081/g3/confirm_payment',
        data: {
          payment_method: this.paymentMethod
        }
      })
        .then((res) => {
          if (res.data.payment_status === 0) {
            this.prompt('Your purchase is all set.')
          } else if (res.data.payment_status === 1) {
            this.prompt('Your purchase fails; ask the servants for help.')
          } else {
            this.prompt('bug: unexpected payment_status in /g3/confirm_status: ', res.data.payment_status)
          }
        })
    }
  },
  // /api/dish: request/response
  mounted () {
    const path = 'http://localhost:8081/api/dish'
    axios({
      method: 'get',
      url: path
    })
      .then(res => this.convertStaticDishes(res.data.dishes))
      .catch(err => console.log(err))
    this.$bvModal.show('orderTableIdModal')
  }
}
</script>

<style scoped>
.table-id-label{
  font-size: 18pt;
}

h6 {
  font-size: 2.0vmin;
  vertical-align: middle;
  display: inline;
}
h5 {
  font-size: 2.5vmin;
  vertical-align: middle;
  display: inline;
}
h4 {
  font-size: 3.0vmin;
  vertical-align: middle;
  display: inline;
}
h3 {
  font-size: 3.5vmin;
  vertical-align: middle;
  display: inline;
}
h2 {
  font-size: 3.6vmin;
  vertical-align: middle;
  display: inline;
}
h1 {
  font-size: 4.0vmin;
  vertical-align: middle;
  display: inline;
}
</style>
