import Vue from 'vue'
import Router from 'vue-router'
import  goods from '@/components/goods/goods'
import ratings from "../components/ratings/ratings";
import seller from "../components/seller/seller";
Vue.use(Router)
export default new Router({
  linkActiveClass:'active',
  /**
   * 路由
   * */
  routes: [
    {
      path: '/',
      /**
       * 指向某个路径
       * */
      redirect: '/goods'
    },
    {
      path: '/goods',
      component: goods
    },
    {
      path: '/ratings',
      component: ratings
    },
    {
      path: '/seller',
      component: seller
    },

  ]
})
