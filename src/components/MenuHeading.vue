<template>
  <div id="menu-box">
    <div id="menu-heading-list">
      <b-list-group
        v-b-scrollspy:dish=390
      >
        <div
          v-for="item in dishTypes"
          :key="item.type"
        >
          <b-list-group-item
            class="d-flex justify-content-between align-items-center dish-type-list-border"
            :href="'#dish-card-'+item.type"
          >
                <label style="font-size:12pt;font-weight:600;margin-bottom:0;">{{ item.typeName }}</label>
                <b-badge style="font-size:8pt;" variant="light" v-if="showBadge">{{ item.orderCount }}</b-badge>
          </b-list-group-item>
        </div>
      </b-list-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuHeading',
  data: function () {
    return {
      showBadge: window.innerWidth >= 768
    }
  },
  mounted () {
    window.addEventListener('resize', () => {
      this.showBadge = window.innerWidth >= 768
    })
  },
  props: {
    dishes: {
      type: Array,
      default: () => [
        { dish_id: 0, name: '红烧肉1', price: 10.00, type: 0, orderCount: 1, typeName: '肉类' },
        { dish_id: 1, name: '红烧肉2', price: 11.00, type: 1, orderCount: 1, typeName: '肉类' },
        { dish_id: 2, name: '红烧肉3', price: 12.00, type: 2, orderCount: 1, typeName: '肉类' },
        { dish_id: 3, name: '红烧肉4', price: 13.00, type: 3, orderCount: 1, typeName: '肉类' },
        { dish_id: 4, name: '红烧肉5', price: 14.00, type: 4, orderCount: 1, typeName: '肉类' }
      ]
    }
  },
  computed: {
    dishTypes () {
      var tmpDishTypes = []
      this.dishes.slice().forEach((dish) => {
        var dup = false
        tmpDishTypes.map((uniDish) => {
          if (dish.type === uniDish.type) {
            dup = true
            uniDish.orderCount += dish.orderCount
          }
        })
        if (!dup) {
          tmpDishTypes.push(JSON.parse(JSON.stringify(dish)))
        }
      })
      return tmpDishTypes
    }
  }
}
</script>

<style scoped>
#menu-title {
  /* position: absolute;
  width: 62px;
  height: 26px;
  left: 38px;
  top: 103px; */

  /* font-family: Ubuntu;
  font-style: normal;
  font-weight: normal;
  font-size: 24px;
  line-height: 26px; */
  /* identical to box height, or 108% */

  display: flex;
  align-items: flex-end;

  color: #373A3C;
}
#menu-heading-list {
  /* position: absolute;
  width: 400px;
  height: 379px;
  left: 38px;
  top: 139px; */
}

.dish-type-list-border{
  border-color: white !important;
  padding: 0.75rem !important;
}
</style>
