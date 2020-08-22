<template>
  <div id="dish">
    <b-card-group
      deck
      v-for="(item, index) in dishes"
      :key="index"
    >
      <b-card
        class="dish-card"
        img-left
        img-src="../assets/logo.png"
        img-alt="dish-pic"
        :title="item.name"
      >
        <b-card-text>{{ item.description }}</b-card-text>
        <h3>{{ item.price }}</h3>
        <b-button-group>
        <b-button>-</b-button>
        <b-button>+</b-button>
        </b-button-group>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
export default {
  name: 'DishPane',
  data () {
    return {
      dishes: [
        { name: 'hongshaorou0', price: 0, description: 'tasty' },
        { name: 'hongshaorou1', price: 1, description: 'tasty' },
        { name: 'hongshaorou2', price: 2, description: 'tasty' },
        { name: 'hongshaorou3', price: 3, description: 'tasty' },
        { name: 'hongshaorou4', price: 4, description: 'tasty' },
        { name: 'hongshaorou5', price: 5, description: 'tasty' }
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
  overflow-y: scroll;
}
.dish-card {
  position: absolute;
  width: 700px;
  height: 200px;
}
</style>
