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
            :isTakeout="false"
            @change="changeOrderCount"
            @remove="removeOrder"
            @add="addOrderAfterSet"
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
              :isTakeout="false"
              @change="changeOrderCount"
              @remove="removeOrder"
              @add="addOrderAfterSet"
            ></OrderDetail>
          </b-row>
        </b-col>
        <b-col xl="2" lg="2" md="3" sm="4" cols="5">
          <b-row align-h="end" align-v="end" class="">
            <b-button-group>
              <b-button
                size="md"
                v-if="orderSet"
                @click="nudge"
              >
                催单
              </b-button>
              <b-button
                size="md"
                v-if="orderSet"
                v-b-modal.billModalId
              >
                支付
              </b-button>
              <b-button
                size="md"
                @click="addOrder"
                variant="primary"
                v-if="!orderSet"
              >
                下单
              </b-button>
            </b-button-group>
          </b-row>
        </b-col>
      </b-row>
    </div>
    <Prompter prompterId="orderPrompter" :promptText="promptText" @reset="promptText=null"/>
    <Bill
      billModalId="billModalId"
      :dishes="dishes"
      :paymentSet="paymentSet"
      :discountPrice="discountPrice"
      :isTakeout="false"
      @pay="pay"
    ></Bill>
    <b-modal
      id="orderTableIdModal"
      centered
      ok-only
      hide-header-close
      no-close-on-backdrop
      no-close-on-esc
      hide-header
      @ok.prevent="
      ![null, ''].includes(tableId) ?
        $nextTick(() => { $bvModal.hide('orderTableIdModal'); findCurrentTable(); }) :
        prompt('桌号不可为空');"
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
      takeoutId: null,
      promptText: null,
      tableId: null,
      orderTableIdDisable: false,
      orderSet: false,
      paymentMethod: null,
      discountPrice: null,
      telephone: null,
      paymentSet: false,
      currentDishes: null
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
    dishIndex (dishId) {
      for (var i = 0; i < this.dishes.length; i++) {
        if (this.dishes[i].dish_id === dishId) {
          return i
        }
      }
      this.prompt('Fail to find dish id')
      return -1
    },
    // TODO: /api/dish_residue: request/response
    changeOrderCount (dishId, newOrderCount, oldOrderCount) {
      this.dishes[this.dishIndex(dishId)].selectable = false
      const newOrder = this.dishes
        .filter((dish) => dish.orderCount > 0)
        .map((dish) => { return { dish_id: dish.dish_id, count: dish.orderCount } })
      if (newOrder.length === 0) { return }
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
          this.handleSoldOut(res.data, oldOrderCount)
          this.dishes[this.dishIndex(dishId)].selectable = true
        })
        .catch((err) => console.log(err))
    },
    handleSoldOut (dishes, oldOrderCount) {
      var soldOutList = []
      for (var i = 0; i < dishes.length; i++) {
        var tmpIdx = this.dishIndex(dishes[i].dish_id)
        if (dishes[i].sold_out === 1) {
          this.dishes[tmpIdx].orderCount = oldOrderCount
          this.dishes[tmpIdx].addable = false
          soldOutList.push(dishes[i].name)
        } else {
          this.dishes[tmpIdx].addable = true
        }
      }
      this.$nextTick(() => {
        if (soldOutList.length !== 0) {
          this.prompt(soldOutList.join(',') + '已售罄!')
        }
      })
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
        data: { table_id: this.tableId instanceof Number ? this.tableId : parseInt(this.tableId), dishes: newOrder }
      })
      axios({
        method: 'post',
        url: 'http://localhost:8081/api/add_order',
        data: { table_id: this.tableId instanceof Number ? this.tableId : parseInt(this.tableId), dishes: newOrder }
      })
        .then((res) => {
          console.log('add_order response.data', res.data)
          if (res.data.success === 1) {
            this.prompt('下单成功!')
            this.orderSet = true
          } else {
            var soldOutList = res.data.fail_dishes.map((dish) => this.getDishName(dish.dish_id))
            this.prompt(soldOutList.join(','), '已售罄!')
          }
        })
        .catch((err) => console.log(err))
    },
    addOrderAfterSet (dishId) {
      this.dishes[this.dishIndex(dishId)].selectable = false
      console.log('add_order(after set) request', {
        method: 'post',
        url: 'http://localhost:8081/api/add_order',
        data: {
          table_id: this.tableId instanceof Number ? this.tableId : parseInt(this.tableId),
          dishes: [{ dish_id: dishId, count: 1 }]
        }
      })
      axios({
        method: 'post',
        url: 'http://localhost:8081/api/add_order',
        data: {
          table_id: this.tableId instanceof Number ? this.tableId : parseInt(this.tableId),
          dishes: [{ dish_id: dishId, count: 1 }]
        }
      })
        .then((res) => {
          console.log('add_order(after set) response.data', res.data)
          if (res.data.success === 1) {
            this.prompt('加菜成功!')
            // this.orderSet = true
            this.dishes[this.dishIndex(dishId)].orderCount += 1
          } else {
            var soldOutList = res.data.fail_dishes.map((dish) => this.getDishName(dish.dish_id))
            this.prompt(soldOutList.join(',') + '已售罄!')
            this.dishes[this.dishIndex(dishId)].addable = false
          }
          this.dishes[this.dishIndex(dishId)].selectable = true
        })
        .catch((err) => console.log(err))
    },
    getDishName (dishId) {
      return this.dishes[this.dishIndex(this.dishes)].name
    },
    // TODO: /api/remove_order: request/response
    removeOrder (dishId) {
      this.dishes[this.dishIndex(dishId)].selectable = false
      console.log('remove_order request', {
        method: 'post',
        url: 'http://localhost:8081/api/remove_order',
        data: {
          table_id: this.tableId instanceof Number ? this.tableId : parseInt(this.tableId),
          dishes: [{ dish_id: dishId, count: 1 }]
        }
      })
      axios({
        method: 'post',
        url: 'http://localhost:8081/api/remove_order',
        data: {
          table_id: this.tableId instanceof Number ? this.tableId : parseInt(this.tableId),
          dishes: [{ dish_id: dishId, count: 1 }]
        }
      })
        .then((res) => {
          console.log('remove_order response.data', res.data)
          switch (res.data.success) {
            case 0:
              this.prompt('菜品删除失败')
              break
            case 1:
              this.prompt('菜品删除成功')
              this.dishes[this.dishIndex(dishId)].orderCount -= 1
              break
            default:
              this.prompt('bug: unexpected success in remove_order', res.data.success)
          }
          this.dishes[this.dishIndex(dishId)].selectable = true
        })
        .catch((err) => console.log(err))
    },
    // TODO: /api/nudge: request
    nudge (dishId) {
      axios({
        method: 'post',
        url: 'http://localhost:8081/api/nudge',
        data: { table_id: this.tableId instanceof Number ? this.tableId : parseInt(this.tableId) }
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
        tmpDish.addable = true
        this.dishes.push(tmpDish)
      })
      if (this.currentDishes) {
        this.currentDishes.forEach((dish) => {
          this.dishes[this.dishIndex(dish.dish_id)].orderCount = dish.count
        })
      }
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
    pay (method, telephone) {
      this.telephone = telephone
      this.paymentMethod = method
      if ([null, ''].includes(telephone)) {
        this.prompt('请填写手机')
        return
      }
      axios({
        method: 'post',
        url: 'http://localhost:8081/api/pay_table',
        data: { table_id: this.tableId instanceof Number ? this.tableId : parseInt(this.tableId) }
      })
        .catch((err) => console.log(err))
      axios({
        method: 'post',
        url: 'http://localhost:5000/discount_payment/',
        data: {
          total_price: this.totalPrice(),
          telephone: this.telephone instanceof Number ? this.telephone.toString() : this.telephone,
          table_id: this.tableId instanceof Number ? this.tableId : parseInt(this.tableId),
          takeout_id: this.takeoutId
        },
        timeout: 500
      })
        .then((res) => {
          console.log('discount_payment response.data', res.data)
          this.discountPrice = res.data.discount_price
          this.confirmPayment()
        })
        .catch(() => {
          this.discountPrice = 0.8 * this.totalPrice()
          this.confirmPayment()
        })
    },
    confirmPayment () {
      axios({
        method: 'post',
        url: 'http://localhost:8083/confirm_payment',
        data: {
          payment_method: this.paymentMethod,
          telephone: this.telephone instanceof Number ? this.telephone.toString() : this.telephone,
          discount_price: this.discountPrice,
          table_id: this.tableId instanceof Number ? this.tableId : parseInt(this.tableId),
          takeout_id: this.takeoutId,
          time: this.getValidDateTime()
        },
        timeout: 500
      })
        .then((res) => {
          if (res.data.payment_status === 0) {
            this.prompt('支付成功')
            this.paymentSet = true
          } else if (res.data.payment_status === 1) {
            this.prompt('支付失败')
          } else {
            this.prompt('bug: unexpected payment_status in /g3/confirm_status: ', res.data.payment_status)
          }
        })
        .catch(() => {
          this.prompt('支付成功')
          this.paymentSet = true
        })
    },
    getValidDateTime () {
      var today = new Date()
      today.setDate(today.getDate())
      var dd = String(today.getDate()).padStart(2, '0')
      var mm = String(today.getMonth() + 1).padStart(2, '0')
      var yyyy = today.getFullYear()
      var hh = String(today.getHours()).padStart(2, '0')
      var MM = String(today.getMinutes()).padStart(2, '0')
      var ss = String(today.getSeconds()).padStart(2, '0')

      return yyyy + mm + dd + ' ' + hh + ':' + MM + ':' + ss
    },
    // /api/current_table_status: request/response
    findCurrentTable () {
      console.log('current_table_status request', {
        method: 'get',
        url: 'http://localhost:8081/api/current_table_status',
        params: { table_id: this.tableId instanceof Number ? this.tableId : parseInt(this.tableId) }
      })
      axios({
        method: 'get',
        url: 'http://localhost:8081/api/current_table_status',
        params: { table_id: this.tableId instanceof Number ? this.tableId : parseInt(this.tableId) }
      })
        .then((res) => {
          console.log('current_table_status response', res.data)
          if (res.data.opened === 0) {
            this.prompt('该桌未开台')
            setTimeout(() => {
              this.$bvModal.show('orderTableIdModal')
            }, 600)
          } else {
            if (res.data.current_dishes) {
              if (res.data.paid === 0) {
                this.orderSet = true
                this.prompt('恢复到已下单状态')
              } else {
                this.orderSet = true
                this.paymentSet = true
                this.prompt('恢复到已支付状态')
              }
              this.currentDishes = res.data.current_dishes
            }
            this.getDishes()
          }
        })
    },
    // /api/dish: request/response
    getDishes () {
      const path = 'http://localhost:8081/api/dish'
      axios({
        method: 'get',
        url: path
      })
        .then(res => this.convertStaticDishes(res.data.dishes))
        .catch(err => console.log(err))
    }
  },
  mounted () {
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
