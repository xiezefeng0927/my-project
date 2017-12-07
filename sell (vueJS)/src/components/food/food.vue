<template>
    <transition name="food">
        <div v-show="showFlag" class="food" ref="food">
            <div class="food-content">
                <div class="image-header">
                    <img :src="food.image" class="food-image" />
                    <div class="back" @click="back()">
                        <span class="icon-arrow_lift"></span>
                    </div>
                </div>
                <div class="content">
                    <h2 class="title">{{food.name}}</h2>
                    <div class="detail">
                        <span class="sell-count">月售{{food.sellCount}}份</span>
                        <span class="rating">好评率{{food.rating}}%</span>
                    </div>
                    <div class="price">
                        <span class="now">￥{{food.price}}</span>
                        <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                    </div>
                </div>
                <div class="cartcontrol-wrapper">
                    <v-pay :food="food"></v-pay>
                </div>
                <transition name="add">
                    <div @click="addCart" class="add-cart" v-show="!food.count || food.count === 0">加入购物车</div>
                </transition>
            </div>
        </div>
    </transition>
</template>

<script>
import Vue from 'vue';
import BScroll from 'better-scroll';
import payhandle from '../payhandle/payhandle.vue';
export default {
  props: {
      food: {
          type: Object
      }
  },
  data: function() {
      return {
          showFlag: false
      }
  },
  methods: {
      show: function() {
          this.showFlag = true;
          this.$nextTick(function(){  //显示详情时初始化 better-scroll
              if(!this.scroll){
                  this.scroll = new BScroll(this.$refs.food, {
                      click: true
                  })
              }else{
                  this.scroll.refresh();
              }
          });
      },
      back: function() {
          this.showFlag = false;
      },
      addCart: function(event) {
          if(!event._constructed) {
              return false;
          }

          Vue.set(this.food, 'count', 1);
      }
  },
  components: {
      'v-pay': payhandle
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
    .food
        position: fixed
        left: 0
        top: 0
        bottom: 46px;
        width: 100%
        z-index: 30
        background: #fff
        transform: translate(0, 0)
        // opacity 1
        &.food-enter-active, &.food-leave-active
            transition: all .5s ease-in
        &.food-enter
            // opacity 0
            transform: translateX(100%)
        &.food-leave-active
            // opacity 0
            transform: translateX(100%)
        .food-content
            .image-header
                position: relative
                width: 100%
                height: 0
                padding-top:100%
                .food-image
                    position absolute
                    top: 0
                    left: 0
                    width: 100%
                    height: 100%
                .back
                    position: absolute
                    left: 20px
                    top: 20px
                    border-radius: 50%
                    border: 1px solid #fff
                    .icon-arrow_lift
                        display: block
                        padding:7px
                        font-size: 13px
                        color: #fff
            .content
                padding: 18px
                .title
                    line-height: 14px
                    margin-bottom: 8px
                    font-size: 14px
                    font-weight: 700
                    color: rgb(7,17,27)
                .detail
                    margin-bottom: 18px
                    height: 10px
                    line-height: 10px
                    font-size: 0
                    .sell-count, .rating
                        font-size: 10px
                        color: rgb(147,153,159)
                    .sell-count
                        margin-right: 12px
                .price
                    font-weight: 700
                    line-height: 24px
                    font-size: 0
                    .now
                        margin-right: 8px
                        font-size: 14px
                        color: rgb(240, 20, 20)
                    .old
                        text-decoration: line-through
                        font-size: 10px
                        color: rgb(147,153,159)
            .cartcontrol-wrapper
                position absolute
                right: 13px
                bottom: 14px
            .add-cart
                position absolute
                right 18px
                bottom 18px
                z-index 10
                height 24px
                line-height 24px
                padding 0 12px
                box-sizing: border-box
                border-radius: 12px
                color #fff
                font-size: 10px
                background rgb(0,160,220)
                opacity: 1
                &.add-enter-active, &.add-leave-active
                    transition: all .3s linear
                &.add-enter, &.add-leave-active
                    opacity: 0
</style>
