<template>
    <div class="ratings" ref="ratings">
        <div class="ratings-content">
            <div class="overview">
                <div class="overview-left">
                    <h1 class="score">{{seller.score}}</h1>
                    <div class="title">综合评分</div>
                    <div class="rank">高于周边商家{{seller.rankRate}}%</div>
                </div>
                <div class="overview-right">
                    <div class="score-wrapper">
                        <span class="title">服务态度</span>
                        <v-star :size="36" :score="seller.serviceScore"></v-star>
                        <span class="score">{{seller.serviceScore}}</span>
                    </div>
                    <div class="score-wrapper">
                        <span class="title">商品评分</span>
                        <v-star :size="36" :score="seller.foodScore"></v-star>
                        <span class="score">{{seller.foodScore}}</span>
                    </div>
                    <div class="delivery-wrapper">
                        <span class="title">送达时间</span>
                        <span class="delivery">{{seller.deliveryTime}}分钟</span>
                    </div>
                </div>
            </div>
            <v-split></v-split>
            <v-ratingselect v-on:ratingType="ratingTypes" v-on:toggleOnlyContent="toggle" :select-type="selectType" :only-content="onlyContent" :desc="desc" :ratings="ratings" ></v-ratingselect>
            <div class="rating-wrapper">
                <ul>
                    <li v-if="showRatings(rating.text, rating.rateType)" v-for="(rating, index) in ratings" :key="index" class="rating-item">
                        <div class="avatar">
                            <img width="28" height="28" :src="rating.avatar" />
                        </div>
                        <div class="content">
                            <h1 class="name">{{rating.username}}</h1>
                            <div class="star-wrapper">
                                <v-star :size="24" :score="rating.score"></v-star>
                                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟</span>
                            </div>
                            <p class="text">{{rating.text}}</p>
                            <div class="recommend" v-if="rating.recommend && rating.recommend.length">
                                <span class="icon-thumb_up"></span>
                                <span v-for="(item, index) in rating.recommend" :key="index" class="item">{{item}}</span>
                            </div>
                            <div class="time">
                                {{rating.rateTime | formatDate}}
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import {formatDate} from '../../common/js/date.js';
    import star from '../star/star.vue';
    import split from '../split/split.vue';
    import ratingselect from '../ratingselect/ratingselect.vue';
    import BScroll from 'better-scroll';

    var POSITIVE = 0;   //好评
    var NEGATIVE = 1;   //差评
    var ALL = 2; //所有评价

    export default {
        name: 'ratings',
        props: {
            seller: {
                type: Object
            }
        },
        data: function() {
            return {
                selectType: ALL,
                onlyContent: true,
                desc: {
                    all: '全部',
                    positive: '满意',
                    negative: '不满意'
                },
                ratings:[]
            }
        },
        methods: {
            ratingTypes: function(type) {
                this.selectType = type;
                this.$nextTick(function() {
                    this.ratingScroll.refresh();
                });
            },
            toggle: function() {
                this.onlyContent = !this.onlyContent;
                this.$nextTick(function() {
                    this.ratingScroll.refresh();
                });
            },
            showRatings: function(text, type) {
                if(this.onlyContent && !text) {  // 只显示有评论内容的评价
                    return false;
                }
                if(this.selectType === ALL) { //全部显示
                    return true;
                }else { // 根据 selectType 的值判断显示推荐或者吐槽
                    return type === this.selectType;
                }
            }
        },
        filters: {
            formatDate: function(time) {
                var date = new Date(time);
                return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
            }
        },
        created: function() {
            this.$http.get('../../../data.json').then(function(resp) {
                var response = typeof resp == "string" ? JSON.parse(resp) : resp;
                this.ratings = response.body.ratings;
                this.$nextTick(function(){
                    this.ratingScroll = new BScroll(this.$refs.ratings, {
                        click: true
                    });
                });
            }, function(error) {
                console.log(error);
            })
        },
        components: {
            'v-star': star,
            'v-split': split,
            'v-ratingselect': ratingselect
        }
    }
</script>

<style lang="stylus" scoped>
@import '../../common/stylus/mixin.styl';

    .ratings
        position: absolute
        top: 174px
        bottom: 0
        width: 100%
        overflow: hidden
        .overview
            display: flex
            padding: 18px 0
            .overview-left
                flex: 0 0 137px
                width: 130px
                padding: 6px 0
                border-right: 1px solid rgba(7,17,27,0.1)
                text-align: center
                @media only screen and (max-width: 320px) {
                    flex: 0 0 120px
                    width: 120px
                }
                .score
                    margin-bottom: 6px
                    line-height: 28px
                    font-size: 24px;
                    color: rgb(255, 153, 0)
                .title
                    margin-bottom: 8px
                    line-height: 12px
                    font-size: 12px
                    font-weight: 700
                    color: #101010
                .rank
                    line-height: 10px
                    font-size: 10px
                    color: rgb(147,153,159)
            .overview-right
                flex: 1
                padding: 6px 0 6px 24px
                @media only screen and (max-width: 320px) {
                    padding: 6px 0 6px 6px
                }
                .score-wrapper    
                    margin-bottom: 8px
                    font-size: 0
                    .title
                        line-height: 18px
                        display: inline-block
                        vertical-align: top
                        font-size: 12px
                        font-weight: 700
                        color: #101010
                    .star
                        // line-height: 18px
                        display: inline-block
                        vertical-align: top
                        margin: 0 8px
                    .score
                        line-height: 18px
                        display: inline-block
                        vertical-align: top
                        font-size: 12px
                        color: rgb(255, 153, 0)
                .delivery-wrapper
                    font-size: 0
                    .title
                        display: inline-block
                        vertical-align: middle
                        font-size: 12px
                        font-weight: 700
                        color: #101010
                    .delivery
                        display: inline-block
                        vertical-align: middle
                        margin-left: 12px
                        font-size: 12px
                        color: rgb(147,153,159)
        .rating-wrapper
            padding: 0 18px
            .rating-item
                display: flex
                padding: 18px 0
                border-1px(rgba(7,17,27,0.1))
                &:last-child::after
                    border:none
                .avatar
                    flex: 0 0 28px
                    width: 28px
                    margin-right:12px
                    img
                        border-radius: 50%
                .content
                    flex: 1
                    position: relative
                    .name
                        line-height: 12px
                        color: rgb(7,17,27)
                        font-size: 10px
                        margin-bottom: 4px
                    .star-wrapper
                        margin-bottom: 6px
                        font-size: 0
                        .star
                            display: inline-block
                            vertical-align: top
                            margin-right: 6px
                        .delivery
                            display: inline-block
                            vertical-align: top
                            font-size: 12px
                            color: rgb(147,153,159)
                    .text
                        line-height: 18px
                        color: rgb(7,17,27)
                        font-size: 12px
                        margin-bottom: 8px
                    .recommend
                        line-height: 16px
                        font-size: 0
                        .icon-thumb_up, .item
                            display: inline-block
                            margin: 0 8px 4px 0
                            font-size: 9px
                        .icon-thumb_up
                            color: rgb(0,160,220)
                        .item
                            padding: 0 6px
                            border: 1px solid rgba(7,17,27,0.1)
                            border-radius: 1px
                            color: rgb(147,153, 159)
                            background: #fff
                    .time
                        position: absolute
                        top: 0
                        right: 0
                        line-height: 12px
                        font-size: 10px
                        color: rgb(147,153,159)
</style>