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
          <PlaceOrderButton/>
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
      orderLogoDir: 'takeout.png',
      orderFluid: 'xl',
      dishes: [
        { dish_id: 0, name: '红烧肉1', price: 10.00, type: 0, orderCount: 0, typeName: '肉类' },
        { dish_id: 1, name: '红烧肉1', price: 10.00, type: 0, orderCount: 0, typeName: '肉类' },
        { dish_id: 2, name: '红烧肉1', price: 10.00, type: 0, orderCount: 0, typeName: '肉类' },
        { dish_id: 3, name: '红烧肉1', price: 10.00, type: 0, orderCount: 0, typeName: '肉类' },
        { dish_id: 4, name: '红烧肉1', price: 10.00, type: 0, orderCount: 0, typeName: '肉类' },
        { dish_id: 5, name: '红烧肉2', price: 11.00, type: 1, orderCount: 0, typeName: '肉类' },
        { dish_id: 6, name: '红烧肉2', price: 11.00, type: 1, orderCount: 0, typeName: '肉类' },
        { dish_id: 7, name: '红烧肉2', price: 11.00, type: 1, orderCount: 0, typeName: '肉类' },
        { dish_id: 8, name: '红烧肉2', price: 11.00, type: 1, orderCount: 0, typeName: '肉类' },
        { dish_id: 9, name: '红烧肉2', price: 11.00, type: 1, orderCount: 0, typeName: '肉类' },
        { dish_id: 10, name: '红烧肉2', price: 11.00, type: 2, orderCount: 0, typeName: '肉类' },
        { dish_id: 11, name: '红烧肉3', price: 12.00, type: 2, orderCount: 0, typeName: '肉类' },
        { dish_id: 12, name: '红烧肉3', price: 12.00, type: 2, orderCount: 0, typeName: '肉类' },
        { dish_id: 13, name: '红烧肉3', price: 12.00, type: 3, orderCount: 0, typeName: '肉类' },
        { dish_id: 14, name: '红烧肉3', price: 12.00, type: 3, orderCount: 0, typeName: '肉类' },
        { dish_id: 15, name: '红烧肉4', price: 13.00, type: 4, orderCount: 0, typeName: '肉类' },
        { dish_id: 16, name: '红烧肉4', price: 13.00, type: 4, orderCount: 0, typeName: '肉类' },
        { dish_id: 17, name: '红烧肉4', price: 13.00, type: 4, orderCount: 0, typeName: '肉类' },
        { dish_id: 18, name: '红烧肉5', price: 14.00, type: 4, orderCount: 0, typeName: '肉类' },
        { dish_id: 19, name: '红烧肉5', price: 14.00, type: 4, orderCount: 0, typeName: '肉类' },
        { dish_id: 20, name: '红烧肉5', price: 14.00, type: 5, orderCount: 0, typeName: '肉类' },
        { dish_id: 21, name: '红烧肉5', price: 14.00, type: 5, orderCount: 0, typeName: '肉类' },
        { dish_id: 22, name: '红烧肉5', price: 14.00, type: 5, orderCount: 0, typeName: '肉类' },
        { dish_id: 23, name: '红烧肉5', price: 14.00, type: 5, orderCount: 0, typeName: '肉类' },
        { dish_id: 24, name: '红烧肉5', price: 14.00, type: 6, orderCount: 0, typeName: '肉类' }
      ]
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
    changeOrderCount (dishId, newOrderCount) {
      this.dishes.forEach((dish) => {
        if (dish.dish_id === dishId) {
          dish.orderCount = newOrderCount
        }
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
  }
}
</script>
