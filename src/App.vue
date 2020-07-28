<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" style="width:50px;">
    <Konversi/>
  </div>
</template>

<script>
import Konversi from './components/Konversi.vue'

export default {
  name: 'App',
  components: {
    Konversi
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
