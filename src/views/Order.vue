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
            <MenuHeading/>
          </b-sidebar>
        </b-col>
        <b-col cols="2"/>
        <b-col cols="8">
          <Search :dishes="dishes"/>
        </b-col>
      </b-row>
      <b-row align-h="center">
        <b-col>
          <DishPane/>
        </b-col>
      </b-row>
      <b-row class="bg-light pt-3 pb-2">
        <b-col cols="3">
          <b-row align-h="start" align-v="center">
            <b-avatar
              class="mr-3"
              src="../assets/takeout-icon.png"
              style="width:5vh;height:5vh;"
              :badge="this.orderCount()"
              v-b-modal.orderDetailModalId
              badge-top
            ></b-avatar>
            <h2>￥{{ this.orderPrice() }}</h2>
            <OrderDetail
              orderDetailModalId="orderDetailModalId"
              :dishes="dishes"
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
      orderLogoDir: 'order.png',
      orderFluid: 'xl',
      dishes: [
        { dish_id: 0, name: '红烧肉1', price: 10.00, type: '肉类1', orderCount: 1 },
        { dish_id: 1, name: '红烧肉2', price: 11.00, type: '肉类2', orderCount: 2 },
        { dish_id: 2, name: '红烧肉3', price: 12.00, type: '肉类3', orderCount: 3 },
        { dish_id: 3, name: '红烧肉4', price: 13.00, type: '肉类4', orderCount: 4 },
        { dish_id: 4, name: '红烧肉5', price: 14.00, type: '肉类5', orderCount: 5 }
      ]
    }
  },
  methods: {
    orderCount () {
      var tmpSum = 0
      for (var i = 0; i < this.dishes.length; i++) {
        tmpSum += this.dishes[i].orderCount
      }
      return tmpSum.toString()
    },
    orderPrice () {
      var tmpSum = 0
      for (var i = 0; i < this.dishes.length; i++) {
        tmpSum += this.dishes[i].orderCount * this.dishes[i].price
      }
      return tmpSum.toString()
    },
    menuSidebarBackdrop () {
      return this.isMobile
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
