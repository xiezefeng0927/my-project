<template>
  <div class="brand-wrapper">
    <div class="brand-title">
      <span class="hot font-size-12">热门品牌</span>
      <span class="more font-size-12">更多品牌</span>
    </div>
    <ul class="brand-content">
      <li v-for="(item, index) in data.allBrand" :key="index" class="item"
          @click="showBrandProduction($event, item)">
        <img :src="baseUrl + item.picture" class="picture" />
        <p class="text font-size-12">{{item.text}}</p>
      </li>
    </ul>
  </div>
</template>

<script>
    export default {
      props: {
        data: {
          type: Object
        }
      },
      data: function() {
        return {
          baseUrl: this.GLOBAL.baseUrl
        }
      },
      methods: {
        showBrandProduction: function(evt, obj) {
          // 向父组件派发事件并将传递参数
          this.$emit("showBrandProduction", obj);
        }
      }
    }
</script>

<style scoped lang="stylus">

  .brand-wrapper
    padding 0 12px
    .brand-title
      height 2.5rem
      display: flex
      justify-content: space-between
      -o-justify-content: space-between
      -ms-justify-content: space-between
      -moz-justify-content: space-between
      -webkit-justify-content: space-between
      .hot, .more
        position: relative
        align-self: center
        -webkit-align-self: center
        padding: 3px 8px
        color: rgb(7,17,27)
      .hot
        &::before
          display: block
          content: ''
          height: 100%
          border-left: 3px solid lightgreen
          position: absolute
          left: 0
          top: 0
      .more
        color: rgb(240,20,20)
        &::before
          display: block
          content: ''
          height: 100%
          border-left: 3px solid brown
          position: absolute
          right: 0
          top: 0
    .brand-content
      width 100%
      .item
        width 100%
        height: 15rem
        position relative
        margin-top 1rem
        .picture
          height 100%
          width 100%
        .text
          width: 100%
          height 2rem
          line-height 2rem
          position absolute
          left 0
          bottom 0
          text-indent: 1.5em
          background-color rgba(0,0,0,0.3)
          color #fff
</style>
