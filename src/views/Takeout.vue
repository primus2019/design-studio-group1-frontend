<template>
  <div class="Takeout">
    <Logo :logoDir="takeoutLogoDir"/>
    <OrderDetail/>
    <Search/>
    <MenuHeading/>
    <DishPane/>
    <PlaceOrderButton/>
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
  name: 'Takeout',
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
      takeoutLogoDir: 'takeout.png'
    }
  }
}
</script>
