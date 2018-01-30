<template>
  <div class="header-component">
    <div class="header-wrapper">
      <div class="header-left">
        <img :src="this.GLOBAL.baseUrl + data.avatar" width="100" height="100" class="avatar" />
      </div>
      <div class="header-right">
        <div class="introduce">
          <div class="name font-size-12">店铺名称: {{data.name}}</div>
          <div class="place font-size-12">产地: {{data.place}}</div>
          <div class="distribution font-size-12">配送方式: {{data.distribution}}</div>
          <div class="sendtime font-size-12">发货期限: {{data.sendTime}}</div>
        </div>
      </div>
    </div>
    <div class="header-loop">
      <span class="loop-tittle">公告</span>
      <marquee class="loop-content">{{data.notice}}</marquee>
    </div>
    <div class="bg-image"></div>
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

    }
  }
}
</script>

<style lang="stylus" scoped>
  .header-component
    width: 100%
    position: relative
    .header-wrapper
      padding: 12px 20px
      display: flex
      .header-left
        flex 0 0 100px
        width: 100px
        height: 100px
        border-radius: 3px
        overflow: hidden
        border: 1px solid rgba(7,17,27,0.1)
        margin-right: 1rem
      .header-right
        flex: 1
        .introduce
          width: 100%
          height: 100%
          display:-webkit-box
          display:-moz-box
          display:-webkit-flex
          display:-ms-flexbox
          -webkit-box-pack:justify
          -moz-box-pack:justify
          -webkit-justify-content:space-between
          -moz-justify-content:space-between
          -ms-flex-pack:justify
          justify-content:space-between
          overflow: hidden
          -webkit-box-orient: vertical
          -moz-box-orient: vertical
          .name, .place, .distribution, .sendtime
            color: rgb(245, 235, 150)
    .header-loop
      width: 100%
      height: 20px
      line-height: 20px
      display: flex
      .loop-tittle
        flex: 0 0 40px
        width: 40px
        text-align: center
        font-size: 12px
        color: rgb(240,20,20)
      .loop-content
        flex: 1
        overflow: hidden
        color: #fff
        font-size: 12px
    .bg-image
      position: absolute
      top: 0
      left: 0
      height: 100%
      width: 100%
      background: url("./bg-image.jpg") no-repeat center
      background-size: cover
      z-index: -1
      filter: blur(3px)
</style>
