<template>
    <div class="header">
        <div class="content-wrapper">
            <div class="avatar">
                <img width="64" height="64" :src="seller.avatar" />
            </div>
            <div class="content">
                <div class="title">
                    <span class="brand"></span>
                    <span class="name">{{seller.name}}</span>
                </div>
                <div class="description">
                    {{seller.description}} / {{seller.deliveryTime}} 分钟送达
                </div>
                <div v-if="seller.supports" class="support">
                    <span class="icon" :class="classMap[seller.supports[0].type]"></span>
                    <span class="text">{{seller.supports[0].description}}</span>
                </div>
            </div>
            <div v-if="seller.supports" class="support-count" @click="showDetail">
                <span class="count">{{seller.supports.length}}个</span>
                <span class="icon-keyboard_arrow_right"></span>
            </div>
        </div>
        <div class="bulletin-wrapper">
            <span class="bulletin-title"></span><marquee class="bulletin-text">{{seller.bulletin}}</marquee>
            <span class="icon-keyboard_arrow_right" @click="showDetail"></span>
        </div>
        <div class="bg-image">
            <img :src="seller.avatar" width="100%" height="100%" />
        </div>
        <transition name="introduce">
            <div v-show="detailShow" class="detail">
                <div class="detail-wrapper clearfix">
                    <div class="detail-main">
                        <h1 class="name">{{seller.name}}</h1>
                        <div class="star-wrapper">
                            <v-star :score="seller.score" :size="48"></v-star>
                        </div>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">优惠信息</div>
                            <div class="line"></div>
                        </div>
                        <ul v-if="seller.supports" class="supports">
                            <li v-for="item in seller.supports" class="support-item" track-by="$index">
                                <span class="icon" :class="classMap[item.type]"></span>
                                <span class="text">{{item.description}}</span>
                            </li>
                        </ul>
                        <div class="title">
                            <div class="line"></div>
                            <div class="text">商家公告</div>
                            <div class="line"></div>
                        </div>
                        <div class="bulletin">
                            <p class="content">{{seller.bulletin}}</p>
                        </div>
                    </div>
                </div>
                <div class="detail-close" @click="showDetail">
                    <i class="icon-close"></i>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
    import star from '../star/star.vue';

    export default {
        name: 'header',
        props: {
        	seller: {
        		type: Object
        	}
        },
        data: function() {
            return {
                detailShow: false
            }
        },
        created: function() {
            this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
        },
        methods: {
            showDetail: function() {
                this.detailShow = !this.detailShow;
            }
        },
        components: {
            'v-star': star
        }
    }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
    @import  "../../common/stylus/mixin.styl";

    .header
        color: #fff
        position:relative
        background: rgba(7,17,27,0.5)
        overflow: hidden
        .content-wrapper
            padding: 24px 12px 18px 24px
            position: relative
            font-size: 0
            .avatar
                display: inline-block
                vertical-align: top
                img
                    border-radius: 2px
            .content
                display: inline-block
                font-size: 14px
                margin-left: 16px
                .title
                    margin: 2px 0 8px 0
                    .brand
                        width: 30px
                        height: 18px
                        display: inline-block
                        vertical-align: middle
                        bg-image('brand')
                        background-size: 30px 18px
                        background-repeat: no-repeat
                    .name
                        display: inline-block
                        vertical-align: middle
                        padding-left: 6px
                        font-size: 16px
                        line-height: 18px
                        font-weight: bold
                .description
                    margin-bottom: 10px
                    line-height: 12px
                    font-size: 12px
                .support
                    font-size: 0
                    .icon
                        display: inline-block
                        vertical-align: top
                        width: 12px
                        height: 12px
                        margin-right: 4px
                        background-size: 12px 12px
                        background-repeat: no-repeat
                        &.decrease
                            bg-image('decrease_1')
                        &.discount
                            bg-image('discount_1')
                        &.guarantee
                            bg-image('guarantee_1')
                        &.invoice
                            bg-image('invoice_1')
                        &.special
                            bg-image('special_1')
                    .text
                        display: inline-block
                        vertical-align: top
                        font-size: 10px
                        line-height: 12px
            .support-count
                position: absolute
                right: 12px
                bottom: 18px
                padding: 0 8px
                height:24px
                line-height: 24px
                border-radius: 14px
                background: rgba(0,0,0,0.2)
                text-align: center
                .count
                    display: inline-block
                    line-height: 24px
                    vertical-align: top
                    font-size: 10px
                .icon-keyboard_arrow_right
                    margin-left: 2px
                    line-height: 24px
                    font-size: 10px
        .bulletin-wrapper
            position: relative
            height: 28px
            line-height: 28px
            padding: 0 22px 0 12px
            background: rgba(7,17,27,0.2)
            //font-size: 0
            .bulletin-title
                display: inline-block
                vertical-align: middle;
                width: 22px
                height: 12px
                bg-image('bulletin')
                background-size: 22px 12px
                background-repeat: no-repeat
            .bulletin-text
                width: calc(100% - 38px)
                width: -o-calc(100% - 38px)
                width: -ms-calc(100% - 38px)
                width: -moz-calc(100% - 38px)
                width: -webkit-calc(100% - 38px)
                display: inline-block
                vertical-align: middle;
                margin: 0 4px
                font-size: 10px
                overflow: hidden
                white-space: nowrap
                text-overflow: ellipsis
            .icon-keyboard_arrow_right
                position: absolute
                top: 50%
                right: 10px
                transform: translateY(-50%)
                font-size: 10px
        .bg-image
            position: absolute
            left: 0
            top: 0
            width: 100%
            height: 100%
            z-index: -1
            filter: blur(8px)
        .detail
            width: 100%
            height: 100%
            position: fixed
            left: 0
            top: 0
            z-index: 100
            overflow-y: auto
            overflow-x: hidden
            backdrop-filter: blur(10px)
            opacity: 1
            background: rgba(7,17,27,0.8)
            transform: translateX(0)
            &.introduce-enter-active, &.introduce-leave-active
                transition: all .3s ease-in
            &.introduce-enter
                opacity: 0
                background: rgba(7,17,27,0)
                transform: translateX(100%)
            &.introduce-leave-active
                opacity: 0
                background: rgba(7,17,27,0)
                transform: translateX(-100%)
            .detail-wrapper
                width: 100%
                min-height: 100%
                .detail-main
                    margin-top: 64px
                    padding-bottom: 64px
                    .name
                        line-height:16px
                        text-align:center
                        font-size: 16px
                        font-weight: 700
                    .star-wrapper
                        margin-top: 18px
                        padding: 2px 0
                        text-align: center
                    .title
                        width: 80%
                        margin: 28px auto 24px auto
                        display: flex
                        .line
                            flex: 1
                            position: relative
                            top: -6px
                            border-bottom: 1px solid rgba(255,255,255,0.2)
                        .text
                            padding: 0 12px
                            font-weight: 700
                            font-size: 14px
                    .supports
                        width: 80%
                        margin: 0 auto
                        .support-item
                            padding: 0 12px
                            margin-bottom: 12px
                            font-size: 0
                            &:last-child
                                margin-bottom: 0
                            .icon
                                display: inline-block
                                width: 16px
                                height: 16px
                                vertical-align: middle
                                margin-right: 6px
                                background-size: 16px 16px
                                background-repeat: no-repeat
                                &.decrease
                                    bg-image('decrease_2')
                                &.discount
                                    bg-image('discount_2')
                                &.guarantee
                                    bg-image('guarantee_2')
                                &.invoice
                                    bg-image('invoice_2')
                                &.special
                                    bg-image('special_2')
                            .text
                                display: inline-block
                                vertical-align: middle
                                line-height: 16px
                                font-size: 12px
                    .bulletin
                        width: 80%
                        margin: 0 auto
                        .content
                            padding: 0 12px
                            line-height: 24px
                            font-size: 12px

            .detail-close
                position: relative
                width: 32px
                height: 32px
                text-align: center
                line-height: 32px
                margin: -64px auto 0
                clear: both
                font-size: 32px
</style>