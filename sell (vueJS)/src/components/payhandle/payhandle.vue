<template>
  <div class="handle">
      <transition name="move">
          <div class="minus icon-remove_circle_outline" v-show="food.count > 0" @click.stop.prevent="minusCount($event)"></div>
      </transition>
      <div class="count" v-show="food.count > 0">{{food.count}}</div>
      <div class="plus icon-add_circle" @click.stop.prevent="addCount($event)"></div>
  </div>
</template>

<script>
import Vue from 'vue';
export default {
  props: {
      food: {
          type: Object
      }
  },
  created: function() {
      //console.log(this.food);
  },
  methods: {
      addCount: function(event) {
          if(!event._constructed) {  //禁止默认事件
              return false;
          }
          if(!this.food.count){  //判断 count 是否存在
                //初始化属性并赋值
              Vue.set(this.food, 'count', 1);
          }else {
              this.food.count++;
          }
          this.$emit('slideBall', event.target);
      },
      minusCount: function(event) {
          if(!event._constructed) {
              return false;
          }
          this.food.count--;
      }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

.move-enter-active, .move-leave-active
  transition: all .3s linear
.move-enter, .move-leave-active
  transform: translateX(100%) rotate(360deg)
  opacity: 0

.handle
    font-size: 0
    .minus, .count, .plus
        display: inline-block
        vertical-align: middle
    .minus, .plus
        padding: 4px
        font-size: 22px
        line-height: 22px
        color: rgb(0,160,220)
    .minus
        padding: 4px
    .count
        line-height: 22px
        width: 14px
        padding-top: 2px
        text-align: center
        font-size: 10px
        color: rgb(147,153,159)
    .plus
        color: rgb(0,160,220)
</style>
