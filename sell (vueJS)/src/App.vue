<template>
  <div>
    <v-header :seller="seller"></v-header>
    <div class="nav border-1px">
      <div class="nav-item"><router-link to="/goods">商品</router-link></div>
      <div class="nav-item"><router-link to="/ratings">评论</router-link></div>
      <div class="nav-item"><router-link to="/seller">商家</router-link></div>
    </div>
    <transition name="fade" mode="out-in">
      <router-view :seller="seller"></router-view>
    </transition>
  </div>
</template>

<script>
  import header from './components/header/header';
export default {
  name: 'app',
  data: function() {
    return {
			seller: {}
    };
  },
  created: function() {
  	this.$http.get('../data.json').then(function(response){
  		this.seller = response.body.seller;
  	}, function(error){
  		console.log("请求数据失败！");
  	})
  },
  components: {
    "v-header": header
  }
}
</script>

<style scoped="scoped" lang="stylus" rel="stylesheet/stylus">
@import "./common/stylus/mixin.styl"

.fade-enter-active, .fade-leave-active
  transition: all .1s ease-in
.fade-enter
  transform: translateX(100%)
.fade-leave-active
  transform: translateX(-100%)
.nav
	display: flex
	width: 100%
	height: 40px
	line-height: 40px
	border-1px(rgba(7,17,27,0.1))
	.nav-item
		flex: 1
		text-align: center
		& > a
			display: block
			font-size: 14px
			color: rgb(77, 85, 93)
			&.active
				color: rgb(240, 20, 20)
// .fade-enter-active, .fade-leave-active
//   transition: all .3s ease-in
// .fade-leave-active, .fade-enter
//   opacity: 0
//   background: rgba(7,17,27,0)
//   transform: translateX(-100%)

</style>
