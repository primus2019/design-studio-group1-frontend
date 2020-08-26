<template>
  <div class="order">
    <b-container :fluid="orderFluid">
      <b-row class="mb-5" align-v="center">
        <Logo :logoDir="orderLogoDir"/>
      </b-row>
      <b-row align-h="end" class="mb-4">
        <b-col cols="2">
          <b-button pill variant="outline-info" v-b-toggle.menu-sidebar>Menu Heading</b-button>
          <b-sidebar id="menu-sidebar" title="Menu" shadow :backdrop="menuSidebarBackdrop()">
            <MenuHeading :dishes="dishes"/>
          </b-sidebar>
        </b-col>
        <b-col cols="2"/>
        <b-col cols="8">
          <Search :dishes="dishes"/>
        </b-col>
      </b-row>
      <b-row align-h="center">
        <b-col>
          <DishPane
            :dishes="dishes"
            @change="changeOrderCount"
          ></DishPane>
        </b-col>
      </b-row>
      <b-row class="bg-light pt-3 pb-2">
        <b-col cols="3">
          <b-row align-h="start" align-v="center">
            <b-avatar
              class="mr-3"
              src="../assets/takeout-icon.png"
              style="width:5vh;height:5vh;"
              :badge="this.orderCountSum()"
              v-b-modal.orderDetailModalId
              badge-top
            ></b-avatar>
            <h2>￥{{ this.orderPriceSum() }}</h2>
            <OrderDetail
              orderDetailModalId="orderDetailModalId"
              :dishes="dishes"
              @change="changeOrderCount"
            ></OrderDetail>
          </b-row>
        </b-col>
        <b-col cols="7"/>
        <b-col cols="2">
          <PlaceOrderButton @addOrder="addOrder"/>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
import Logo from '../components/Logo'
import OrderDetail from '../components/OrderDetail'
import Search from '../components/Search'
import MenuHeading from '../components/MenuHeading'
import DishPane from '../components/DishPane'
import PlaceOrderButton from '../components/PlaceOrderButton'
import axios from 'axios'

export default {
  name: 'Order',
  components: {
    Logo,
    OrderDetail,
    Search,
    MenuHeading,
    DishPane,
    PlaceOrderButton
  },
  data () {
    return {
      orderLogoDir: 'order.png',
      orderFluid: 'xl',
      dishes: [],
      tableId: -1,
      takeoutId: -1
    }
  },
  methods: {
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
    menuSidebarBackdrop () {
      return this.isMobile
    },
    extendDishesDict (tmpDish) {
      for (var i = 0; i < this.dishes.length; i++) {
        tmpDish.orderCount = i
        tmpDish.price = 1
        this.dishes[i] = tmpDish
      }
    },
    prompt (text) {
      console.log(text)
    },
    // TODO: /api/dish_residue: request/response
    changeOrderCount (dishId, newOrderCount) {
      this.dishes.forEach((dish) => {
        if (dish.dish_id === dishId) {
          dish.orderCount = newOrderCount
        }
      })
      // console.log('Order: changeOrderCount', dishId, newOrderCount)
      // this.dishes[dishId].orderCount = newOrderCount
      const newOrder = this.dishes
        .filter(dish => dish.orderCount > 0)
        .map(dish => { return { dish_id: dish.dish_id, count: dish.orderCount } })
      axios({
        method: 'get',
        url: 'http://localhost:8081/api/dish_residue',
        data: { dishes: newOrder }
      })
        .then(res => this.handleSoldout(res.data.dishes))
        .catch(err => console.log(err))
    },
    handleSoldout (dishes) {
      dishes.forEach((dish, index) => {
        var soldOutList = []
        if (dish.sold_out === 1) {
          this.dishes[index].orderCount = 0
          this.dishes[index].selectable = false
          this.soldOutList.push(dish.name)
        }
        if (soldOutList.length !== 0) {
          this.prompt(soldOutList.join(','), 'has sold out!')
        }
      })
    },
    // TODO: /api/add_order: request/response (order only for now)
    // it should use the table related api
    addOrder () {
      console.log('Order: addOrder')
      const newOrder = this.dishes
        .filter(dish => dish.orderCount > 0)
        .map(dish => { return { dish_id: dish.dish_id, count: dish.orderCount } })
      console.log('\tnewOrder', newOrder)
      axios({
        method: 'post',
        url: 'http://localhost:8081/api/add_order',
        data: { table_id: this.tableId, dishes: newOrder }
      })
        .then((res) => {
          console.log('\t', res.data)
          if (res.data.success === 1) {
            this.prompt('Your orders are all set!')
          } else {
            var soldOutList = res.data.fail_dishes.map(dish => this.getDishName(dish.dish_id))
            this.prompt(soldOutList.join(','), 'has been sold out; your order fails!')
          }
        })
        .catch((err) => console.log(err))
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
    }
  },
  computed: {
    isMobile () {
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return true
      } else {
        return false
      }
    }
  },
  mounted () {
    const path = 'http://localhost:8081/api/dish'
    axios({
      method: 'get',
      url: path,
      data: {}
    })
      .then(res => this.convertStaticDishes(res.data.dishes))
      .catch(err => console.log(err))
  }
}
</script>
