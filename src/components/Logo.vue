<template>
  <b-img
    fluid
    id="logo"
    alt="logo"
    loading="lazy"
    :src="require('../assets/' + this.logoDir)"
  ></b-img>
  <!-- Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a> -->
</template>

<script>
export default {
  name: 'Logo',
  props: {
    logoDir: {
      type: String,
      default: 'logo.png'
    }
  }
}
</script>

<style>
#logo {
  position: absolute;
  /* width: 315px; */
  max-width: 100%;
  width: 7vh;
  height: 7vh;
  /* left: 38px;
  top: 8px; */
}
</style>
