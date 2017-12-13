<template>
  <div class="rating-select">
      <div class="rating-type border-1px">
          <span @click="select(2,$event)" class="block positive" :class="{'active': selectType === 2}">{{desc.all}}
              <span class="count">{{ratings.length}}</span>
          </span>
          <span @click="select(0,$event)" class="block positive" :class="{'active': selectType === 0}">{{desc.positive}}
              <span class="count">{{positives.length}}</span>
          </span>
          <span @click="select(1,$event)" class="block negative" :class="{'active': selectType === 1}">{{desc.negative}}
              <span class="count">{{negatives.length}}</span>
          </span>
      </div>
      <div @click="toggleContent($event)" class="switch" :class="{'on': onlyContent}">
          <span class="icon-check_circle"></span>
          <span class="text">只看有内容的评价</span>
      </div>
  </div>
</template>

<script>
var POSITIVE = 0;   //好评
var NEGATIVE = 1;   //差评
var ALL = 2; //所有评价
export default {
  props: {
      ratings: {
          type: Array,
          default: function() {
              return [];
          }
      },
      selectType: {  //选择的类型
        type:Number,
        default: ALL
      },
      onlyContent: {  //是否查看只有内容的评价
          type: Boolean,
          default: false
      },
      desc: {   //选择按钮的默认值
          type: Object,
          default: function() {
              return {
                  all: '全部',
                  positive: '满意',
                  negative: '不满意'
              }
          }
      }
  },
  computed: {
      positives: function() {   //使用 vue 的 filter 过来数据
          return this.ratings.filter(function(rating) {
              return rating.rateType === POSITIVE;
          });
      },
      negatives: function() {
          return this.ratings.filter(function(rating) {
              return rating.rateType === NEGATIVE;
          });
      }
  },
  data: function() {
      return {
          // 由于 props 是单向数据绑定的，主动修改时没有更改父组件的值，系统无法记录该值，
          //这里自定义变量转换并操作自定义的变量
          mySelectType: this.selectType
      }
  },
  methods: {
      select: function(type, event) {
          if(!event._constructed) {
            return false;
          }
          //派发事件，与父组件通信
          this.$emit("ratingType", type);
          // 表示选中
          //this.selectType = type;
      },
      toggleContent: function(event) {
          if(!event._constructed) {
            return false;
          }
          this.$emit("toggleOnlyContent")
      }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/mixin.styl';

    .rating-select
        .rating-type
            padding: 18px 0
            margin: 0 18px
            border-1px(rgba(7,17,27,0.1))
            font-size: 0
            .block
                display: inline-block
                padding: 8px 12px
                border-radius: 2px
                margin-right: 8px
                line-height: 16px
                color: rgb(77,85,93)
                font-size: 12px
                &.active
                    color: #fff
                .count
                    margin-left: 2px
                    font-size: 8px
                &.positive
                    background: rgba(0,160,220,0.2)
                    &.active
                        background: rgb(0,160,220)
                &.negative
                    background: rgba(77,85,93,0.2)
                    &.active
                        background: rgb(77,85,93)
        .switch
            padding: 12px 18px
            line-height: 24px
            border-bottom 1px solid rgba(7,17,27,0.1)
            color: rgb(147,153,159)
            font-size: 0
            &.on
                .icon-check_circle
                    color: #00c850
            .icon-check_circle
                display: inline-block
                vertical-align middle
                margin-right: 4px
                font-size: 24px
            .text
                display inline-block
                vertical-align middle
                font-size: 12px
</style>
