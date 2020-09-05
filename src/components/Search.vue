<template>
  <div>
    <b-input-group>
      <b-form-input
        list="orderSearchList"
        v-model="orderSearchResult"
      />
      <b-input-group-append>
        <b-button variant="outline-info" style="min-width: 5vw;">
          <b-icon icon="search"/>
        </b-button>
      </b-input-group-append>
    </b-input-group>
    <datalist id="orderSearchList">
      <option v-for="dish in dishes" :key="dish.dish_id">
        {{ dish.name }}
      </option>
    </datalist>
  </div>
</template>

<script>
export default {
  name: 'Search',
  props: {
    dishes: {
      type: Array,
      default: () => [
        { dish_id: 0, name: '红烧肉1', price: 10.00, type: '肉类1', orderCount: 1 },
        { dish_id: 1, name: '红烧肉2', price: 11.00, type: '肉类2', orderCount: 2 },
        { dish_id: 2, name: '红烧肉3', price: 12.00, type: '肉类3', orderCount: 3 },
        { dish_id: 3, name: '红烧肉4', price: 13.00, type: '肉类4', orderCount: 4 },
        { dish_id: 4, name: '红烧肉5', price: 14.00, type: '肉类5', orderCount: 5 }
      ]
    }
  },
  data () {
    return {
      orderSearchModel: null,
      orderSearchResult: null
    }
  }
}
</script>
