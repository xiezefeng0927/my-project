<template>
  <div class="classify-wrapper">
    <div class="recommend">
      <span class="recommend-content font-size-12">推荐分类</span>
      <span class="all-recommend font-size-12">全部分类</span>
    </div>
    <ul class="classify">
      <li v-for="(item, index) in data.allClassify" :key="item.tittle" class="item" @click.prevnet.stop="showClassifyProduction($event, item)">
        <img :src="baseUrl + item.picture" class="picture" />
        <span class="bg-tittle font-size-12">{{item.text}}</span>
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
      showClassifyProduction: function(event, obj) {
        console.log(obj);
      }
    }
  }
</script>

<style scoped lang="stylus">
  .classify-wrapper
    padding 0 12px
    .recommend
      height: 2.5rem
      display: flex
      justify-content: space-between
      -o-justify-content: space-between
      -ms-justify-content: space-between
      -moz-justify-content: space-between
      -webkit-justify-content: space-between
      .recommend-content, .all-recommend
        position: relative
        align-self: center
        -webkit-align-self: center
        padding: 3px 8px
        color: rgb(7,17,27)
      .recommend-content
        &::before
          display: block
          content: ''
          height: 100%
          border-left: 3px solid lightgreen
          position: absolute
          left: 0
          top: 0
      .all-recommend
        color: rgb(240,20,20)
        &::before
          display: block
          content: ''
          height: 100%
          border-left: 3px solid brown
          position: absolute
          right: 0
          top: 0
    .classify
      width: 100%
      display: flex
      justify-content: space-between
      -o-justify-content: space-between
      -ms-justify-content: space-between
      -moz-justify-content: space-between
      -webkit-justify-content: space-between
      flex-wrap: wrap
      .item
        width: 48%
        padding-top: 32%
        position: relative
        margin-top: 0.8rem
        border: 1px solid rgba(7,17,27,0.1)
        border-radius: 3px
        overflow: hidden
        &:first-child, &:nth-child(2)
          margin-top: 0
        .picture, .bg, .tittle
          position: absolute
        .picture
          width: 100%
          height: 100%
          display: block
          top: 0
          left: 0
        .bg-tittle
          display: block
          width: 100%
          height: 30px
          line-height: 30px
          text-align: center
          background-color: rgba(0,0,0,0.4)
          position: absolute
          left: 0
          bottom: 0
          color: #fff
</style>
