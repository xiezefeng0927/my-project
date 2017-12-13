<template>
    <div class="seller" ref="sellers">
        <div class="seller-content">
            <div class="seller-message">
                <h2 class="title">{{seller.name}}</h2>
                <div class="desc border-1px">
                    <v-star :size="36" :score="seller.score"></v-star>
                    <span class="text">({{seller.ratingCount}})</span>
                    <span class="text">月售 {{seller.sellCount}} 单</span>
                </div>
                <ul class="remark">
                    <li class="item">
                        <h2>起送价</h2>
                        <div class="content">
                            <span class="stress">{{seller.minPrice}}</span>元
                        </div>
                    </li>
                    <li class="item">
                        <h2>商家配送</h2>
                        <div class="content">
                            <span class="stress">{{seller.deliveryPrice}}</span>元
                        </div>
                    </li>
                    <li class="item">
                        <h2>平均配送时间</h2>
                        <div class="content">
                            <span class="stress">{{seller.deliveryTime}}</span>分钟
                        </div>
                    </li>
                </ul>
            </div>
            <v-split></v-split>
            <div class="bulletin">
                <h2 class="title">公告与活动</h2>
                <div class="content-wrapper border-1px">
                    <p class="content">{{seller.bulletin}}</p>
                </div>
            </div>
            <ul v-if="seller.supports" class="supports">
                <li v-for="(item, $index) in seller.supports" class="support-item border-1px" :key="$index" track-by="$index">
                    <span class="icon" :class="classMap[item.type]"></span>
                    <span class="text">{{item.description}}</span>
                </li>
            </ul>
            <v-split></v-split>
        </div>
    </div>
</template>

<script>
    import BScroll from "better-scroll";
    import star from '../star/star.vue';
    import split from '../split/split.vue'
    export default {
        name: 'seller',
        props: {
            seller: {
                type: Object
            }
        },
        data: function() {
            return {
            }
        },
        created: function() {
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
        },
        mounted: function() {  //组件挂载完成时执行
            this._initScroll();
        },
        watch: {  //由于 seller 是异步请求的，初始化时可能无法获取到整个组件的高度，所有监听 seller 的变化后重新刷新 better-scroll
            'seller':function() {
                this._initScroll();
            }
        },
        methods: {
            _initScroll: function() {
                if(!this.sellerScroll) {
                    this.sellerScroll = new BScroll(this.$refs.sellers, {
                        click: true
                    });
                }else {
                    this.sellerScroll.refresh();
                }
            }
        },
        components: {
            'v-star': star,
            'v-split': split
        }
    }
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/mixin.styl';

.seller
    position: absolute
    top: 174px
    left: 0
    bottom: 0
    width: 100%
    overflow: hidden
    .seller-message
        padding: 18px
        .title
            margin-bottom: 8px
            line-height: 14px
            color: rgb(7,17,27)
            font-size: 14px
        .desc
            padding-bottom: 18px
            font-size: 0
            border-1px(rgba(7,17,27,0.1))
            .star
                display: inline-block
                vertical-align: top
                margin-right: 8px
            .text
                margin-right: 12px
                display: inline-block
                vertical-align: top
                line-height: 18px
                font-size: 10px
                color: rgb(77,85,93)
        .remark
            display: flex
            padding-top: 18px
            .item
                flex: 1
                text-align: center
                border-right: 1px solid rgba(7,17,27,0.1)
                &:last-child
                    border: none
                h2
                    margin-bottom: 4px
                    line-height: 10px
                    font-size: 10px
                    color: rgb(147,153,159)
                .content
                    line-height: 24px
                    font-size: 10px
                    color: rgb(7,17,27)
                    .stress
                        font-size: 24px
    .bulletin
        padding: 18px 18px 0 18px
        .title
            margin-bottom: 8px
            line-height: 14px
            font-size: 14px
            color:rgb(7,17,27)
        .content-wrapper
            padding: 0 12px 16px
            border-1px(rgba(7,17,27,0.1))
            .content
                line-height: 24px
                font-size: 12px
                color: rgb(240,20,20)
    .supports
        // width: 80%
        // margin: 0 auto
        padding: 0 18px
        .support-item
            padding: 16px 12px
            font-size: 0
            border-1px(rgba(7,17,27,0.1))
            &:last-child::after
                border: none
            .icon
                display: inline-block
                width: 16px
                height: 16px
                vertical-align: middle
                margin-right: 6px
                background-size: 16px 16px
                background-repeat: no-repeat
                &.decrease
                    bg-image('decrease_4')
                &.discount
                    bg-image('discount_4')
                &.guarantee
                    bg-image('guarantee_4')
                &.invoice
                    bg-image('invoice_4')
                &.special
                    bg-image('special_4')
            .text
                display: inline-block
                vertical-align: middle
                line-height: 16px
                font-size: 12px
                color: rgb(7,17,27)
</style>