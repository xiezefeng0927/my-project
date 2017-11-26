<template>
  <div id="app">
    <v-header></v-header>
    <div class="nav">
      <router-link to="/goods">商品</router-link>
      <router-link to="/ratings">评论</router-link>
      <router-link to="/seller">商家</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
  import header from './components/header/header';
export default {
  name: 'app',
  data: function() {
    return {

    }
  },
  components: {
    "v-header": header
  }
}
</script>

<style>
#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #323232;
}
</style>
