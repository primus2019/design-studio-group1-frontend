<template>
  <div id="dish">
    <div
      v-for="(dishClass, dishClassIndex) in dishes"
      :key="dishClassIndex"
    >
      <b-card-group
        :id="'dish-card-'+dishClassIndex"
        deck
      >
        <div
          v-for="(singleDish, singleDishIndex) in dishClass"
          :key="singleDishIndex"
        >
        <b-card
          class="dish-card"
          img-left
          img-src="../assets/logo.png"
          img-alt="dish-pic"
          :title="singleDish.name"
        >
          <b-card-text>{{ singleDish.description }}</b-card-text>
          <h3>{{ singleDish.price }}</h3>
          <b-button-group>
          <b-button>-</b-button>
          <b-button>+</b-button>
          </b-button-group>
        </b-card>
        </div>
      </b-card-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DishPane',
  data () {
    return {
      dishes: [
        [
          { name: 'hongshaorou0', price: 0, description: 'tasty', type: 0 },
          { name: 'hongshaorou0', price: 0, description: 'not tasty', type: 0 },
          { name: 'hongshaorou0', price: 0, description: 'not tasty', type: 0 }
        ],
        [
          { name: 'hongshaorou1', price: 1, description: 'tasty', type: 1 },
          { name: 'hongshaorou1', price: 1, description: 'tasty', type: 1 }
        ],
        [
          { name: 'hongshaorou2', price: 2, description: 'tasty', type: 2 },
          { name: 'hongshaorou2', price: 2, description: 'tasty', type: 2 }
        ],
        [
          { name: 'hongshaorou3', price: 3, description: 'tasty', type: 3 },
          { name: 'hongshaorou3', price: 3, description: 'tasty', type: 3 }
        ],
        [
          { name: 'hongshaorou4', price: 4, description: 'tasty', type: 4 },
          { name: 'hongshaorou4', price: 4, description: 'tasty', type: 4 }
        ],
        [
          { name: 'hongshaorou5', price: 5, description: 'tasty', type: 5 },
          { name: 'hongshaorou5', price: 5, description: 'tasty', type: 5 }
        ],
        [
          { name: 'hongshaorou5', price: 5, description: 'tasty', type: 6 },
          { name: 'hongshaorou5', price: 5, description: 'tasty', type: 6 }
        ]
      ]
    }
  }
}
</script>

<style>
#dish {
  position: absolute;
  width: 887px;
  height: 820px;
  left: 467px;
  top: 111px;
  overflow-x: hidden;
  overflow-y: auto;
}
.dish-card {
  position: relative;
  width: 887px;
  height: 200px;
}
</style>
