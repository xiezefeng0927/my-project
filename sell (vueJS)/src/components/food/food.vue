<template>
    <transition name="food" v-on:before-enter="beforeEnter">
        <div v-show="showFlag" class="food" ref="food">
            <div class="food-content">
                <div class="image-header">
                    <img :src="food.image" class="food-image" />
                    <div class="back" @click="back()" ref="back">
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
                    <div class="cartcontrol-wrapper">
                        <v-pay :food="food"></v-pay>
                    </div>
                    <transition name="add">
                        <div @click="addCart" class="add-cart" v-show="!food.count || food.count === 0">加入购物车</div>
                    </transition>
                </div>
                <v-split v-show="food.info"></v-split>
                <div class="info" v-show="food.info">
                    <h1 class="title">商品介绍</h1>
                    <p class="text">{{food.info}}</p>
                </div>
                <v-split></v-split>
                <div class="ratings">
                    <h1 class="title">商品评价</h1>
                    <v-ratingselect v-on:ratingType="ratingTypes" v-on:toggleOnlyContent="toggle" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="food.ratings"></v-ratingselect>
                    <div class="rating-wrapper">
                        <ul v-show="food.ratings && food.ratings.length">
                            <li v-show="needShow(rating.rateType, rating.text)" class="rating-item" v-for="(rating, index) in food.ratings" :key="index">
                                <div class="user">
                                    <span class="name">{{rating.username}}</span>
                                    <img class="avatar" width="12" height="12" :src="rating.avatar" />
                                </div>
                                <div class="time">{{rating.rateTime | formatDate}}</div>
                                <p class="text">
                                    <span :class="{'icon-thumb_up': rating.rateType === 0,'icon-thumb_down': rating.rateType === 1}"></span>{{rating.text}}
                                </p>
                            </li>
                        </ul>
                        <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import Vue from 'vue';
import BScroll from 'better-scroll';
import payhandle from '../payhandle/payhandle.vue';
import ratingselect from '../ratingselect/ratingselect.vue';
import split from '../split/split.vue';
import {formatDate} from '../../common/js/date.js';

//返回图标定位的参数   :style="{top:scrollY + 'px'}"
var POSITIONTOP = 20;
var POSITIVE = 0;   //好评
var NEGATIVE = 1;   //差评
var ALL = 2; //所有评价

export default {
  props: {
      food: {
          type: Object
      },
      positionTop: {
          type: Number
      }
  },
  data: function() {
      return {
          num: 0,
          showFlag: false,
          scrollY: 0,
          selectType: ALL,
          onlyContent: true,
          desc: {
              all: '全部',
              positive: '推荐',
              negative: '吐槽'
          }
      }
  },
  methods: {
      beforeEnter: function() {  //页面过渡进入前调用此方法
          // this.$refs.food.style.top = "0px";
          this.$refs.back.style.top = POSITIONTOP + "px";
          this.scrollY = 0;
      },
      show: function() {
          var self = this;
          this.showFlag = true;
          // 由于每次查看的商品详情都不相同，所有每次都初始化这两个值
          this.selectType = ALL;
          this.onlyContent = false;

          this.$nextTick(function(){  //显示详情时初始化 better-scroll
          
              
              if(!this.scroll){
                  this.scroll = new BScroll(this.$refs.food, {
                      probeType: 3,
                      click: true
                  })
              }else{
                  this.scroll.refresh();
              }
              // 页面加载时重新滚动到顶部
              this.scroll.scrollToElement(this.$refs.food, 10);

              this.scroll.on("scroll", function(position){
                  if(position.y >= 0){
                      self.$refs.back.style.top = POSITIONTOP + "px";
                      return false;
                  }
                  self.scrollY = Math.abs( position.y ) + POSITIONTOP;
                  self.$refs.back.style.top = self.scrollY + "px";
              })
              
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
      },
      needShow: function(type, text) {  // 商品评论的显示逻辑判断
          if(this.onlyContent && !text) {  // 只显示有评论内容的评价
              return false;
          }
          if(this.selectType === ALL) { //全部显示
              return true;
          }else { // 根据 selectType 的值判断显示推荐或者吐槽
              return type === this.selectType;
          }
      },
      ratingTypes:function(type) {  //自定义事件，父子组件之间互相通信，改变 selectType 的值
          this.selectType = type;
          this.$nextTick(function() {
              this.scroll.refresh();
          });
      },
      toggle: function() {
          this.onlyContent = !this.onlyContent;
          this.$nextTick(function() {
              this.scroll.refresh();
          });
      }
  },
  filters: {
      formatDate: function(time) {
          var date = new Date(time);
          return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
      }
  },
  components: {
      'v-pay': payhandle,
      'v-split': split,
      'v-ratingselect': ratingselect
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl';
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
                    border: 1px solid rgb(0,160,220)
                    z-index: 999
                    .icon-arrow_lift
                        display: block
                        padding:7px
                        font-size: 13px
                        color: rgb(0,160,220)
            .content
                padding: 18px
                position: relative
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
            .info
                padding: 18px
                .title
                    line-height: 14px;
                    margin-bottom: 6px
                    font-size: 14px
                    color: rgb(7,17,27)
                .text
                    padding: 0 8px
                    line-height: 24px
                    font-size: 12px
                    color: rgb(77,85,93)
            .ratings
                padding-top: 18px;
                .title
                    line-height: 14px
                    margin-bottom: 6px
                    font-size: 14px
                    color: rgb(7,17,27)
                    margin-left:18px
                .rating-wrapper
                    padding: 0 18px
                    .rating-item
                        position: relative
                        padding: 16px 0
                        border-1px(rgba(7,17,27,0.1))
                        .user
                            position: absolute
                            right: 0
                            top: 16px
                            line-height: 12px
                            font-size: 0
                            .name
                                display: inline-block
                                vertical-align: middle
                                margin-right: 6px
                                font-size: 10px
                                color: rgb(147,153,159)
                            .avatar
                                border-radius: 50%
                                vertical-align: middle
                        .time
                            line-height: 12px
                            margin-bottom: 6px
                            font-size: 10px
                            color: rgb(147,153,159)
                        .text
                            line-height: 16px
                            font-size: 12px
                            color: rgb(7,17,27)
                            .icon-thumb_up, .icon-thumb_down
                                margin-right: 4px
                                line-height: 16px
                                font-size: 12px
                            .icon-thumb_up
                                color: rgb(0,160,220)
                            .icon-thumb_down
                                color: rgb(147,153,159)
                    .no-rating
                        padding: 16px 0
                        font-size: 12px
                        color: rgb(147,153,159)            
</style>
