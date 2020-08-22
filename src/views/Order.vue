<template>
  <div class="order">
    <Logo/>
    <OrderBrief/>
    <Search/>
    <MenuHeading/>
    <DishPane/>
    <CheckOrderButton/>
    <PlaceOrderButton/>
  </div>
</template>

<script>
import Logo from '../components/Logo'
import OrderBrief from '../components/OrderBrief'
import Search from '../components/Search'
import MenuHeading from '../components/MenuHeading'
import DishPane from '../components/DishPane'
import CheckOrderButton from '../components/CheckOrderButton'
import PlaceOrderButton from '../components/PlaceOrderButton'

export default {
  name: 'Order',
  components: {
    Logo,
    OrderBrief,
    Search,
    MenuHeading,
    DishPane,
    CheckOrderButton,
    PlaceOrderButton
  }
}
</script>
