<template>
  <div class="star" :class="starType">
      <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item" track-by="$index"></span>
  </div>
</template>

<script>
//定义星星的长度
var LENGTH = 5;
var CLS_ON = 'on';
var CLS_HALF = 'half';
var CLS_OFF = 'off';

export default {
  name: 'star',
  props: {
    size: {
        type: Number
    },
    score: {
        type: Number
    }  
  },
  computed: {
    starType: function() {
        return 'star-' + this.size
    },
    itemClasses: function() {
        var result = [];
        var score = Math.floor(this.score * 2) / 2;
        var hasHalf = score % 1 !== 0;    //检查是否有半星状态
        var integer = Math.floor(score);
        for(var i =  0; i < integer; i++){
            result.push(CLS_ON);
        }
        if(hasHalf) {
            result.push(CLS_HALF);
        }
        while(result.length < LENGTH){
            result.push(CLS_OFF);
        }
        return result;
    }
  },
  data: function() {
      return {
          //itemClasses = [1,2,3,4]
      }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import "../../common/stylus/mixin.styl";

.star
    font-size: 0
    .star-item
        display: inline-block
        background-repeat: no-repeat
    &.star-48
        .star-item
            width: 20px
            height: 20px
            margin-right: 22px
            background-size: 20px 20px
            &:last-child
                margin-right: 0
            &.on
                bg-image('star48_on')
            &.half
                bg-image('star48_half')
            &.off
                bg-image('star48_off')
    &.star-36
        .star-item
            width: 15px
            height: 15px
            margin-right: 16px
            background-size: 15px 15px
            &:last-child
                margin-right: 0
            &.on
                bg-image('star36_on')
            &.half
                bg-image('star36_half')
            &.off
                bg-image('star36_off')
    &.star-24
        .star-item
            width: 10px
            height: 10px
            margin-right: 3px
            background-size: 10px 10px
            &:last-child
                margin-right: 0
            &.on
                bg-image('star24_on')
            &.half
                bg-image('star24_half')
            &.off
                bg-image('star24_off')
</style>
