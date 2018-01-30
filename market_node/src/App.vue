<template>
  <div id="app">
    <router-view/>
    <div class="nav border-1px font-size-12">
      <div class="nav-item border-1px">
        <router-link to="/index">首页</router-link>
      </div>
      <div class="nav-item border-1px">
        <router-link to="/cart">购物车</router-link>
      </div>
      <div class="nav-item border-1px">
        <router-link to="/mine">我的</router-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="stylus" scoped>
@import './common/stylus/mixin.styl';
#app
  .nav
    width: 100%
    height: 3.4rem
    line-height: 3.4rem
    display flex
    left 0
    bottom 0
    position fixed
    &::after
      position absolute
      left 0
      top 0
      display block
      content: ''
      width 100%
      border-top: 1px solid rgba(7,17,27,0.1)
    .nav-item
      flex 1
      position relative
      &::after
        display: block
        content: ''
        height 60%
        position absolute
        right 0
        top 50%
        border-right: 1px solid rgba(7,17,27,0.1)
        transform translateY(-50%)
      &:last-child::after
        border: none
      a
        display block
        text-align center
        color #323232
        &.active
          color rgb(240,20,20)
</style>
