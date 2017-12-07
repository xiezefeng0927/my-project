<template>
  <div class="cart">
      <div class="content">
          <div class="content-left" @click="toggleList">
              <div class="logo-wrapper">
                  <div class="logo" :class="{'highlight': totalCount > 0}">
                      <span class="icon-shopping_cart" :class="{'highlight': totalCount > 0}"></span>
                  </div>
                  <div class="count" v-show="totalCount > 0">{{totalCount}}</div>
              </div>
              <div class="price" :class="{'highprice': totalPrice > 0}">￥{{totalPrice}}</div>
              <div class="desc">{{distFee}}</div>
          </div>
          <div class="content-right" @click.stop.prevent="pay()">
              <div class="pay" :class="payClass">
                  {{payDesc}}
              </div>
          </div>
      </div>
      <transition name="fold">
        <div v-show="listShow" class="cart-list">
            <div class="list-header">
                <h2 class="title">购物车</h2>
                <span class="empty" @click="cartEmpty()">清空</span>
            </div>
            <div class="list-content" ref="cart">
                <ul>
                    <li class="food border-1px" v-for="(food, $index) in selectedFood" :key="$index">
                        <span class="name">{{food.name}}</span>
                        <div class="price">
                            <span>￥{{ food.price * food.count }}</span>
                        </div>
                        <div class="handle-wrapper">
                            <v-pay :food="food"></v-pay>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
      </transition>
      <div class="ball-content">
          <transition name="fly" v-for="ball in balls" :key="ball.show" 
          v-on:before-enter="beforeEnter" 
          v-on:enter="enter" 
          v-on:after-enter="afterEnter">
              <div class="ball" v-show="ball.show">
                  <div class="inner inner-hook"></div>
              </div>
          </transition> 
      </div>
      <transition name="mark">
        <div class="list-mark" v-show="listShow" @click="toggleList"></div>
      </transition>
  </div>
  
</template>

<script>
import payhandle from '../payhandle/payhandle.vue';
import BScroll from 'better-scroll';
export default {
  props: {
      selectedFood: {
          type: Array,
          default: function() {
              return [];
          }
      },
      deliveryPrice: {
          type: Number
      },
      minPrice: {
          type: Number
      }
  },
  data:function() {
      return {
          balls: [
              {
                  show: false
              },
              {
                  show: false
              },
              {
                  show: false
              },
              {
                  show: false
              },
              {
                  show: false
              }
          ],
          dropBalls: [],
          fold: true
      }
  },
  computed: {
      totalPrice: function() {
          var total = 0;
          this.selectedFood.forEach(function(food) {
              total += food.price * food.count;
          })
          return total;
      },
      totalCount: function() {
          var count = 0;
          this.selectedFood.forEach(function(food) {
              count += food.count;
          })
          return count;
      },
      payDesc: function() {
          if(this.totalPrice === 0){
              return '￥' + this.minPrice + '起送';
          }else if(this.totalPrice < this.minPrice){
              return '还差￥' + (this.minPrice - this.totalPrice) + '元起送';
          }else {
              return '去结算';
          }
      },
      payClass: function() {
          if(this.totalPrice < this.minPrice){
              return 'not-enough';
          }else {
              return 'enough';
          }
      },
      distFee: function() {
          return  this.totalPrice > this.minPrice ? '免配送费': '另需配送费￥'+ this.deliveryPrice +'元'
      },
      listShow: function() {
          if(!this.totalCount){
              this.fold = true;
              return false;
          }
          var show = !this.fold
          if(show) {
              this.$nextTick(function() {
                  if(!this.scroll) {
                    this.scroll = new BScroll(this.$refs.cart, {
                        click: true
                    });
                  }else {
                      this.scroll.refresh();
                  }
              });
          }
          return show;
      }
  },
  methods: {
      toggleList: function() {
          if(!this.totalCount) {
              return;
          }
          this.fold = !this.fold;
      },
      cartEmpty: function() {
          this.selectedFood.forEach(function(food){
              food.count = 0;
          });
      },
      pay: function() {
          if(this.totalPrice < this.minPrice) {
              return false;
          }
          window.alert('你需要支付' + this.totalPrice + "元!");
      },
      swiperBall: function(ball) {
          for(var i = 0; i < this.balls.length; i++) {
              var _ball = this.balls[i];
              if(!_ball.show){
                  _ball.show = true;
                  _ball.ele = ball;
                  this.dropBalls.push(_ball);
                  return false;
              }
          }
      },
      beforeEnter: function(el) {
        var count = this.balls.length;
        while(count--) {
            var ball = this.balls[count];
            if(ball.show){
                var rect = ball.ele.getBoundingClientRect();
                var x = rect.left - 32;
                var y = -(window.innerHeight - rect.top - 22);
                el.style.display = "";
                el.style.webkitTransform = 'translate3d(0,'+ y +'px,0)';
                el.style.transform = 'translate3d(0,'+ y +'px,0)';
                var inner = el.getElementsByClassName('inner-hook')[0];
                inner.style.webkitTransform = 'translate3d('+ x +'px,0,0)';
                inner.style.transform = 'translate3d('+ x +'px,0,0)';
            }
        }
      },
      enter: function(el, done) {
        /*eslint-disable no-unused-vars*/  //注释是防止eslint报错
        var oh = el.offsetHeight;   //页面重绘
        this.$nextTick(function() {
            el.style.webkitTransform = 'translate3d(0,0,0)';
            el.style.transform = 'translate3d(0,0,0)';
            var inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.webkitTransform = 'translate3d(0,0,0)';
            inner.style.transform = 'translate3d(0,0,0)';
             done();// 触发afterEnter事件
        });
      
      },
      afterEnter: function(el) {
          var ball = this.dropBalls.shift();
          if(ball) {
              ball.show = false;
              el.style.display = "none";
          }
      }
  },
  components: {
      'v-pay': payhandle
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixin.styl';

.cart
    position: fixed
    bottom: 0
    left: 0
    width: 100%
    height: 46px
    z-index: 50
    background: #888
    .content
        display: flex
        background: #141d27
        .content-left
            flex: 1
            font-size: 0
            .logo-wrapper
                display: inline-block
                position: relative
                top: -10px
                margin: 0 6px
                padding: 6px
                width: 56px
                height: 56px
                box-sizing: border-box
                vertical-align: top
                border-radius: 50%
                background: #141d27
                .logo
                    width: 100%
                    height: 100%
                    text-align: center
                    border-radius: 50%
                    background: #2b343c
                    &.highlight
                        background: rgb(0,160,220)
                    .icon-shopping_cart
                        line-height: 44px
                        font-size: 24px
                        color: #80858a
                        &.highlight
                            color: #fff
                .count
                    position:absolute
                    top: 0
                    right: 0
                    width:24px
                    height: 16px
                    line-height: 16px
                    text-align:center
                    border-radius: 16px
                    background-color:rgb(240,20,20)
                    color: #fff
                    font-size: 9px
                    font-weight: 700
                    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4)
            .price
                display: inline-block
                vertical-align: top
                line-height: 24px
                margin-top: 12px
                box-sizing: border-box
                padding-right: 8px
                border-right: 1px solid rgba(255,255,255,0.1)
                font-size: 14px
                font-weight: 700
                color: rgba(255,255,255,0.4)
                &.highprice
                    color: #fff
            .desc
                display: inline-block
                vertical-align: top
                line-height: 24px
                margin: 12px 0 0 8px
                font-size: 12px
                color: rgba(255,255,255,0.4)
        .content-right
            flex: 0 0 105px
            width: 105px
            .pay
                height: 46px;
                line-height: 46px;
                text-align: center
                font-size: 12px
                color: rgba(255,255,255,0.4)
                font-weight: 700
                &.not-enough
                    background: #2b333b
                &.enough
                    background: #00b54c
                    color: #fff
    .cart-list
        position: absolute
        top: 0
        left: 0
        z-index: -1
        width: 100%
        opacity: 1
        transform: translate(0,-100%)
        &.fold-enter-active, &.fold-leave-active
            transition: all .3s ease-in
        &.fold-enter
            opacity: 0
            background: rgba(7,17,27,0)
            transform: translateY(0)
        &.fold-leave-active
            opacity: 0
            background: rgba(7,17,27,0)
            transform: translateY(0)
        .list-header
            height: 40px
            line-height: 40px
            padding: 0 18px
            background: #f3f5f7
            border-bottom: 1px solid rgba(7,17,27,0.1)
            .title
                float: left
                font-size: 14px
                color: rgb(7,17,27)
            .empty
                float:right
                font-size: 12px
                color: rgb(0,160,220)
        .list-content
            padding: 0 18px
            max-height: 217px
            background: #fff
            overflow: hidden
            .food
                position: relative
                padding: 12px 0
                box-sizing: border-box
                border-1px(rgba(7,17,27,0.1))
                &:last-child:after
                    border:none
                .name
                    line-height: 24px
                    font-size: 14px
                    color: rgb(7,17,27)
                .price
                    position: absolute
                    right: 90px
                    top: 50%
                    transform: translateY(-50%)
                    font-size: 14px
                    font-weight: 700
                    color: rgb(240,20,20)
                .handle-wrapper
                    position: absolute
                    right: 0
                    top: 50%
                    transform: translateY(-50%)

    .ball-content
        .ball
            position: fixed
            left: 32px
            bottom: 22px
            z-index: 200
            &.fly-enter
                transform: translate3d(100px, 200px, 0)
            &.fly-enter-active
                transition: all 0.3s
            .inner
                width: 16px
                height: 16px
                border-radius: 50%
                background:rgb(0,160,220)
    .list-mark
        opacity: 1
        width: 100%
        height: 100%
        position: fixed
        left: 0
        top: 0
        z-index: -2
        backdrop-filter: blur(10px)
        background: rgba(7,17,27,0.8)
        transform: translate(0, 0)
        &.mark-enter-active, &.mark-leave-active
            transition: all .3s ease-in
        &.mark-enter
            opacity: 0
            background: rgba(7,17,27,0)
            transform: translateY(100%)
        &.mark-leave-active
            opacity: 0
            background: rgba(7,17,27,0)
            transform: translateY(100%)

</style>


