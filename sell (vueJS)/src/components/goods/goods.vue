<template>
    <div class="goods">
        <div class="menu-wrapper" ref="menu">
            <ul>
                <li v-for="(item, $index) in goods" :key="$index" class="menu-item border-1px" :class="{'current': currentIndex === $index}" @click="selectMenu($index, $event)">
                    <span class="text">
                        <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
                    </span>
                </li>
            </ul>
        </div>
        <div class="foods-wrapper" ref="foods">
            <ul>
                <li v-for="(item, $index) in goods" :key="$index" class="food-list food-list-hook">
                    <h2 class="title">{{item.name}}</h2>
                    <ul>
                        <li @click="checkedFoodDetail(food, $event)" v-for="(food, $index) in item.foods" :key="$index" class="food-item border-1px">
                            <div class="icon">
                                <img width="57" height="57" :src="food.icon" />
                            </div>
                            <div class="content">
                                <h2 class="name">{{food.name}}</h2>
                                <p class="desc">{{food.description}}</p>
                                <div class="extra">
                                    <span class="count">月售{{food.sellCount}}份</span>
                                    <span class="percent">好评率{{food.rating}}%</span>
                                </div>
                                <div class="price">
                                    <span class="now">￥{{food.price}}</span>
                                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                                </div>
                                <div class="payhandle-wrapper">
                                    <v-pay :food="food"  v-on:slideBall="slideB"></v-pay>
                                </div>
                            </div>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <v-cart ref="cart" :selected-food="selectedFood" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></v-cart>
        <v-food :food="selected" ref="food" :position-top="positionTop"></v-food>
    </div>
</template>

<script>
    import BScroll from "better-scroll";
    import cart from "../cart/cart.vue";
    import payhandle from "../payhandle/payhandle.vue";
    import food from '../food/food.vue';

    export default {
        name: 'goods',
        props: {
            seller: {
                type: Object
            }
        },
        data: function() {
            return {
                goods: [],
                listHeight: [],
                scrollY: 0,
                selected: {},
                positionTop: 20
            }
        },
        created: function() {
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
            
            this.$http.get('../../../data.json').then(function(response) {
                
                var resp = typeof response == "string" ? JSON.parse(response) : response;
                this.goods = resp.body.goods;
                this.$nextTick(function(){
                    //初始化better-scroll
                    this._initScroll();
                    //计算高度，两边联动
                    this._calculateHeight();
                })
            }, function(err){
                console.log(err);
            });
        },
        computed: {
            currentIndex: function() {
                for(var i = 0, len=this.listHeight.length; i < len; i++) {
                    // if (this.scrollY <= 0) {
                    //     return 0;
                    // }
                    //获取两个区间的值
                    var height_1 = this.listHeight[i];
                    var height_2 = this.listHeight[i + 1];
                    // 对比区间值， 然后返回这个区间的索引
                    // height_2是 +1 的，循环可能会数组越界，所以 height_2 为 undefined 时直接返回当前索引
                    if( !height_2 || (this.scrollY >= height_1 && this.scrollY < height_2) ) {
                        return i;
                    }
                }
                return 0;
            },
            selectedFood: function() {  //已选择的商品，这个是传给 cart 组件的
                var foods = [];
                this.goods.forEach(function(good) {
                    good.foods.forEach(function(food) {
                        if(food.count > 0) {
                            foods.push(food);
                        }
                    });
                })
                return foods;
            }
        },
        methods: {
            _initScroll: function() {
                //转换this指针变量
                var self = this;
                this.menuScroll = new BScroll(this.$refs.menu, {
                    click: true   //允许点击
                });
                this.foodScroll = new BScroll(this.$refs.foods, {
                    probeType: 3,    //表示能实时监听到better-scroll滚动的位置
                    click: true
                });

                this.foodScroll.on('scroll', function(_pos){
                    self.scrollY = Math.abs( Math.round(_pos.y) );
                })
            },
            _calculateHeight: function() {
                var foodList = this.$refs.foods.getElementsByClassName('food-list-hook');
                //console.log(foodList);
                var height = 0;
                this.listHeight.push( height );
                for(var i = 0, len = foodList.length; i < len; i++) {
                    var item = foodList[i];
                    //clientHeight 也可以获取到高度
                    height += item.offsetHeight;
                    this.listHeight.push(height);
                }
                //console.log(this.listHeight);
            },
            selectMenu: function(index, event) {
                if(!event._constructed){   //禁止pc端的默认事件，防止两次点击 
                    return false;
                }  
                //左边菜单栏选择
                var foodList = this.$refs.foods.getElementsByClassName("food-list-hook");
                var ele = foodList[index];
                //跳转到指定的节点位置
                this.foodScroll.scrollToElement(ele, 300);
            },
            checkedFoodDetail: function(food, event){
                if(!event._constructed){   //禁止pc端的默认事件，防止两次点击 
                    return false;
                }
                this.selected = food;
                this.$refs.food.show();
            },
            slideB: function(ele) {
                //console.log(ele);
                //体验优化，异步执行下落动画
                this.$nextTick(function() {
                    this.$refs.cart.swiperBall(ele);
                });
            }
        },
        components: {
            'v-cart': cart,
            'v-pay': payhandle,
            'v-food': food
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl';

.goods
    display: flex
    position: fixed
    width: 100%
    top: 174px
    bottom: 46px
    left: 0
    overflow: hidden
    .menu-wrapper
        flex: 0 0 80px
        width: 80px
        background: #f3f5f7
        .menu-item
            display: table
            height: 54px
            width:56px
            line-height: 14px
            padding: 0 12px
            border-1px(rgba(7,17,27,0.1))
            &:last-child::after
                display: none
            &.current
                position: relative
                z-index: 10
                margin-top: -1px
                background: #fff
                font-weight: 700
                .text
                    border: none
            .icon
                display: inline-block
                vertical-align: top
                width: 12px
                height: 12px
                margin-right: 2px
                background-size: 12px 12px
                background-repeat: no-repeat
                &.decrease
                    bg-image('decrease_3')
                &.discount
                    bg-image('discount_3')
                &.guarantee
                    bg-image('guarantee_3')
                &.invoice
                    bg-image('invoice_3')
                &.special
                    bg-image('special_3')
            .text
                display: table-cell;
                width: 56px
                vertical-align: middle
                font-size: 12px;
    .foods-wrapper
        flex: 1
        .food-list
            .title
                padding-left: 14px
                height:26px
                line-height:26px
                border-left: 2px solid #d9dde1
                font-size: 12px
                color: rgb(147,153,159)
                background: #f3f5f7
            .food-item
                display: flex
                margin: 18px 18px 0 18px
                //padding-bottom: 18px
                border-1px(rgba(7,17,27,0.1))
                &:last-child::after
                    display: none
                .icon
                    flex: 0 0 57px
                    margin-right: 10px
                .content
                    flex: 1
                    position: relative
                    .name
                        height: 14px
                        line-height: 14px
                        margin: 2px 0 8px 0
                        font-size: 14px
                        color: rgb(7,17,27)
                    .desc
                        margin-bottom: 8px
                        line-height: 12px
                        color: rgb(147,153,159)
                        font-size: 10px
                    .extra
                        line-height: 10px
                        font-size: 0
                        color: rgb(147,153,159)
                        .count, .percent
                            font-size: 10px
                        .count
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
                    .payhandle-wrapper
                        position: absolute
                        right: 0
                        bottom: 0px

</style>