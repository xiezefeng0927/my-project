import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/index/index'
import Cart from '@/components/cart/cart'
import Mine from '@/components/mine/mine'

Vue.use(Router)

export default new Router({
    linkActiveClass: 'active',
    routes: [{
            path: "/",
            redirect: "/index"
        },
        {
            path: '/index',
            name: 'Index',
            component: Index
        },
        {
            path: '/cart',
            name: 'Cart',
            component: Cart
        },
        {
            path: '/mine',
            name: "Mine",
            component: Mine
        }
    ]
})