<template>
  <div id="menu-box">
    <div id="menu-heading-list">
      <b-list-group
        v-for="(item, index) in MenuHeading"
        :key="item.name"
        v-b-scrollspy:dish=390
      >
        <b-list-group-item
          class="d-flex justify-content-between align-items-center"
          :href="'#dish-card-'+index"
        >
          {{ item.name }}
          <b-badge>{{ item.orderNumber }}</b-badge>
        </b-list-group-item>
      </b-list-group>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MenuHeading',
  data () {
    return {
      MenuHeading: [
        { name: 'Vegetables', orderNumber: 10 },
        { name: 'Fruits', orderNumber: 10 },
        { name: 'Meat and Pourltry', orderNumber: 10 },
        { name: 'Fish and Seafoods', orderNumber: 10 },
        { name: 'Dairy Foods', orderNumber: 10 },
        { name: 'Grians, Beans and Nuts', orderNumber: 10 },
        { name: 'Other\'s', orderNumber: 10 }
      ]
    }
  }
}
</script>

<style>
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
</style>
