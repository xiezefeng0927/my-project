<template>
  <transition name="list">
    <div class="goods-list-wrapper">
      <div class="list-title">
        <span class="back-icon" @click="goBack">
          <i class="fa fa-arrow-left"></i>
        </span>
        <span class="title">{{category}}</span>
      </div>
      <div class="goods-list" ref="goods">
        <ul class="goods clearfix">
          <li class="goods-item clearfix" v-for="item in list" @click="showGoodsDetail($event,item)">
            <div class="item-image">
              <img :src="baseUrl + item.swiperImages[0]" class="pic" alt="商品图片" title="商品图片" />
            </div>
            <div class="item-content">
              <div class="goods-title">{{item.introduce}}</div>
              <div class="goods-introduce">
                <div class="goods-price">
                  <span class="old-price">¥{{item.oldPrice}}</span>
                  <span class="now-price">¥{{item.nowPrice}}</span>
                </div>
                <div class="goods-account">库存<span class="amount">{{item.amount}}</span>个</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>

<script>
  import BScroll from 'better-scroll';

    export default {
      props: {
        list: {
          type: Array
        },
        category: {
          type: String,
          default: '分类'
        }
      },
      data: function() {
        return {
          baseUrl: this.GLOBAL.baseUrl
        }
      },
      created: function() {
        this.$nextTick(function() {
          this.goodsScroll = new BScroll(this.$refs.goods, {
            click: true
          });
        });
      },
      methods: {
        // 向父组件派发 返回 的事件
        goBack: function() {
          this.$emit("emptyListArray");
        },
        showGoodsDetail: function(event, item) {
          if(!event._constructed) { //_constructed
            return false;
          }
          console.log(item);
        }
      }
    }
</script>

<style scoped lang="stylus">

  .goods-list-wrapper
    position: absolute
    top: 0
    left: 0
    bottom: 0
    width: 100%
    background-color: #fff
    z-index: 9
    transform: translate(0, 0)
    &.list-enter-active, &.list-leave-active
      transition: all 0.3s linear
    &.list-enter, &.list-leave-active
      transform: translateX(100%)
    .list-title
      width: 100%
      height: 4rem
      position: relative
      border-bottom: 1px solid rgb(7,17,27)
      box-sizing: border-box
      .back-icon
        display: block
        height: 4rem
        width: 4rem
        line-height: 4rem
        text-align: center
        font-size: 1.6rem
        color: rgb(20, 160, 240)
      .title
        position: absolute
        left: 50%
        top: 50%
        transform: translate(-50%, -50%)
        color: rgb(7, 17, 27)
        font-size: 16px
    .goods-list
      position: absolute
      top: 4rem
      left: 0
      bottom: 0
      right: 0
      overflow: hidden
      .goods
        width: 100%
        padding: 1.5rem 0
        .goods-item
          width: 47.5%
          min-height: 100px
          box-sizing: border-box
          position: relative
          overflow: hidden
          &:nth-child(2n+1)
            float: left
            margin: 1% 0.75% 1% 1.75%
          &:nth-child(2n)
            float: right
            margin: 1% 1.75% 1% 0.75%
          .item-image
            width: 100%
            padding-top: 66.6%
            position: relative
            overflow: hidden
            .pic
              position: absolute
              left: 0
              top: 0
              width: 100%
              height: 100%
              display: block
          .item-content
            padding: 5px 6px
            background-color: rgba(7,17,27,.1)
            .goods-title
              width: 100%
              height: 24px
              line-height: 24px
              overflow: hidden
              white-space: nowrap
              text-overflow: ellipsis
              font-size: 12px
              color: rgb(7,17,27)
            .goods-introduce
              display: flex
              justify-content: space-between
              height: 18px
              line-height: 18px
              .goods-price
                font-size: 0
                .now-price
                  font-size: 12px
                  color: rgb(240,20,20)
                .old-price
                  text-decoration: line-through
                  font-size: 10px
                  color: rgb(77,85,93)
                  padding-right: 8px
              .goods-account
                color: rgb(7,17,27)
                .amount
                  padding: 0 4px
                  color: rgb(240,20,20)

</style>
