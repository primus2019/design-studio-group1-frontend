<template>
  <div>
    <img id="logo" alt="logo" loading="lazy" :src="require('../assets/' + this.logoDir)"/>
    <!-- Icons made by <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a> -->
  </div>
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
  width: 69px;
  height: 69px;
  left: 38px;
  top: 8px;
}
</style>
