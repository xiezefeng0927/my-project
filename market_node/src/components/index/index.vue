<template>
  <div class="index-wrapper" ref="index">
    <div class="index">
      <v-header :data="data"></v-header>
      <v-split></v-split>
      <v-classify :data="data"></v-classify>
      <v-split :height="15"></v-split>
      <v-brand :data="data"></v-brand>
    </div>
  </div>
</template>

<script>
  // 使用全局变量
  // console.log(this.GLOBAL.baseUrl);
  import BScroll from 'better-scroll';
  import Header from '@/components/header/header';
  import SplitLine from '@/components/splitLine/splitLine';
  import Classify from '@/components/classify/classify';
  import Brand from '@/components/brand/brand';
  export default {
    data:function() {
      return {
        data: {}
      }
    },
    created: function() {
      this.$http.get(this.GLOBAL.baseUrl + '/getAppIntroduce').then(function(response) {

        response = typeof response == "string" ? JSON.parse(response) : response;
        this.data = response.body.result[0];
        this.$nextTick(function() {
          this._initScroll();
        });
        console.log(this.data);
      }, function(err) {
        console.log(err);
      });
    },
    methods: {
      _initScroll: function() {
        this.indexScroll = new BScroll(this.$refs.index, {
          click: true
        });
      }
    },
    components: {
      'v-header': Header,
      'v-split': SplitLine,
      'v-classify': Classify,
      'v-brand': Brand
    }
  }
</script>

<style lang="stylus" scoped>

.index-wrapper
  position fixed
  left 0
  top 0
  bottom 3.4rem
  width 100%
  overflow hidden
</style>
