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
        <b-col cols="7">
          <Search :dishes="dishes"/>
        </b-col>
        <b-col cols="3">
          <TakeoutInfoForm
            id="takeoutInfoForm"
            :disable="orderSet"
            @submit="handleTakeoutInfo"
          ></TakeoutInfoForm>
        </b-col>
      </b-row>
      <b-row align-h="center">
        <b-col>
          <DishPane
            :dishes="dishes"
            :orderSet="orderSet"
            :isTakeout="true"
            @change="changeOrderCount"
            @remove="removeOrder"
            @nudge="nudge"
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
              :orderSet="orderSet"
              :dishes="dishes"
              @change="changeOrderCount"
            ></OrderDetail>
          </b-row>
        </b-col>
        <b-col cols="5"/>
        <b-col cols="2">
          <b-button
            pill
            v-if="orderSet"
            v-b-modal.billModalId
          >Pay orders
          </b-button>
        </b-col>
        <b-col cols="2">
          <PlaceOrderButton
            :orderSet="orderSet"
            @addOrder="addTakeout"
          ></PlaceOrderButton>
        </b-col>
      </b-row>
    </b-container>
    <Prompter prompterId="orderPrompter" :promptText="promptText" @reset="promptText=null"/>
    <Bill
      billModalId="billModalId"
      :dishes="dishes"
      @pay="pay"
    ></Bill>
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
import Prompter from '../components/Prompter'
import Bill from '../components/Bill'
import TakeoutInfoForm from '../components/TakeoutInfoForm'

export default {
  name: 'Order',
  components: {
    Logo,
    OrderDetail,
    Search,
    MenuHeading,
    DishPane,
    PlaceOrderButton,
    Prompter,
    Bill,
    TakeoutInfoForm
  },
  data () {
    return {
      orderLogoDir: 'order.png',
      orderFluid: 'xl',
      dishes: [],
      takeoutId: null,
      promptText: null,
      tableId: null,
      orderTableIdDisable: false,
      orderSet: false,
      paymentMethod: null,
      takeoutName: null,
      takeoutPhone: null,
      takeoutAddress: null
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
    handleTakeoutInfo (dict) {
      this.takeoutName = dict.name
      this.takeoutPhone = dict.phone
      this.takeoutAddress = dict.address
      console.log('parent handle tabkeout info', dict)
    },
    // TODO: /api/dish_residue: request/response
    changeOrderCount (dishId, newOrderCount) {
      this.dishes.forEach((dish) => {
        if (dish.dish_id === dishId) {
          dish.orderCount = newOrderCount
        }
      })
      const newOrder = this.dishes
        .filter((dish) => dish.orderCount > 0)
        .map((dish) => { return { dish_id: dish.dish_id, count: dish.orderCount } })
      console.log('parent dish_residue request', {
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
          console.log('parent dish_residue response.data', res.data)
          this.handleSoldout(res.data.dishes)
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
        }
      }
    },
    // /api/add_takeout: request/response
    addTakeout () {
      if (!this.takeoutName) {
        this.prompt('请输入姓名')
        return
      }
      if (!this.takeoutPhone) {
        this.prompt('请输入手机号')
        return
      }
      if (!this.takeoutAddress) {
        this.prompt('请输入地址')
        return
      }
      const newOrder = this.dishes
        .filter(dish => dish.orderCount > 0)
        .map(dish => { return { dish_id: dish.dish_id, count: dish.orderCount } })
      console.log('parent add_takeout request', {
        method: 'post',
        url: 'http://localhost:8081/api/add_takeout',
        data: {
          dishes: newOrder,
          name: this.takeoutName,
          phone: this.takeoutPhone,
          address: this.takeoutAddress
        }
      })
      axios({
        method: 'post',
        url: 'http://localhost:8081/api/add_takeout',
        data: {
          dishes: newOrder,
          name: this.takeoutName,
          phone: this.takeoutPhone,
          address: this.takeoutAddress
        }
      })
        .then((res) => {
          console.log('parent add_takeout response.data', res.data)
          if (res.data.success === 1) {
            this.prompt('Your takeouts are all set!')
            this.orderSet = true
            this.takeoutId = res.data.takeout_id
            setTimeout(() => {
              this.$bvModal.show('billModalId')
            }, 3000)
          } else {
            var soldOutList = res.data.fail_dishes.map((dish) => this.getDishName(dish.dish_id))
            this.prompt(soldOutList.join(','), 'has been sold out; your order fails!')
          }
        })
        .catch((err) => console.log(err))
    },
    // TODO: /api/remove_dish: request/response
    removeOrder (dishId) {
      axios({
        method: 'post',
        url: 'http://localhost:8081/api/remove_order',
        data: {
          table_id: this.tableId,
          dishes: {
            dish_id: dishId,
            count: 1
          }
        }
      })
        .then((res) => {
          if (res.data.success === 1) {
            this.prompt('菜品删除成功')
            this.dishes[dishId].orderCount -= 1
          } else if (res.data.success === 0) {
            this.prompt('菜品删除失败')
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
      url: path
    })
      .then(res => this.convertStaticDishes(res.data.dishes))
      .catch(err => console.log(err))
  }
}
</script>
