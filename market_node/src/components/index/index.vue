<template>
  <div class="index-wrapper" ref="index">
    <div class="index">
      <v-header :data="data"></v-header>
      <v-split></v-split>
      <v-classify :data="data" @showProduction="classifyProduction"></v-classify>
      <v-split :height="15"></v-split>
      <v-brand :data="data" @showBrandProduction="brandProduction"></v-brand>
    </div>
    <v-goods-list v-show="goodsList.length > 0" :list="goodsList" :category="category"
                  @emptyListArray="listHidden"></v-goods-list>
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
  import GoodsList from '@/components/goodsList/goodsList';
  export default {
    data:function() {
      return {
        data: {},
        products: {},
        goodsList: [],
        category: ''  // 分类类别
      }
    },
    created: function() {
      this.$http.get(this.GLOBAL.baseUrl + '/getAppIntroduce').then(function(response) {

        response = typeof response == "string" ? JSON.parse(response) : response;
        this.data = response.body.result[0];
        this.$nextTick(function() {
          this._initScroll();
        });
        // console.log(this.data);
      }, function(err) {
        console.log(err);
      });
    },
    methods: {
      // 初始化 IScroll
      _initScroll: function() {
        this.indexScroll = new BScroll(this.$refs.index, {
          click: true
        });
      },
      classifyProduction: function(obj) {  // 接收子组件派发的事件和参数
        var param = obj.id;
        this._getClassifyProducts("classId", param);
      },
      brandProduction: function (obj) {
        var param = obj.id;
        this._getClassifyProducts("brandId", param);
      },
      // 向服务器请求分类的数据
      _getClassifyProducts: function(classify, params) {
        this.$http.get(this.GLOBAL.baseUrl + '/getClassifyProducts?classify=' + classify + '&id=' + params).then(function(response) {
          // console.log(response);
          this.goodsList = response.body.result;
          this.category = response.body.classify;
          // 切换列表时 index 首页禁止滚动
          this.indexScroll.disable();
        }, function(err) {
          console.log(err);
        })
      },
      // 清空数据所有元素
      listHidden: function(ary) {
        this.goodsList.splice(0, this.goodsList.length);
        // 切换回首页时 index 解除禁止滚动
        this.indexScroll.enable();
      }
    },
    components: {
      'v-header': Header,
      'v-split': SplitLine,
      'v-classify': Classify,
      'v-brand': Brand,
      'v-goods-list': GoodsList
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
