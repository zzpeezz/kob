import { createRouter, createWebHistory } from 'vue-router'
import PkIndexView from '@/views/pk/PkIndexView.vue'
import RecordIndexView from '@/views/record/RecordIndexView.vue'
import RanklistIndexView from '@/views/ranklist/RanklistIndexView.vue'
import UserBotIndexView from '@/views/user/bots/UserBotIndexView.vue'
import NotFoundView from '@/views/error/NotFoundView.vue'
import UserAccountRegisterView from '@/views/user/account/UserAccountRegisterView.vue'
import UserAccountLoginView from '@/views/user/account/UserAccountLoginView.vue'
import store from '@/store'

// 匹配是从上往下匹配
const routes = [
  {
    path: "/",  //输入根路径自动跳到pk
    name: "home",
    redirect: "/pk/",  //重定向
    meta: {requestAuth: true},  //需不需要授权

  },
  {
    path: "/pk/",  //这里是相对路径，也就是我们域名后面的路径
    name: "pk_index", //起名
    component: PkIndexView, //映射到这个组件
    meta: {requestAuth: true},
  },
  {
    path: "/record/", 
    name: "record_index",
    component: RecordIndexView,
    meta: {requestAuth: true},
  },
  {
    path: "/ranklist/", 
    name: "ranklist_index",
    component: RanklistIndexView,
    meta: {requestAuth: true},
  },
  {
    path: "/user/bot/", 
    name: "user_bot_index",
    component: UserBotIndexView,
    meta: {requestAuth: true},
  },
  {
    path: "/user/account/login/", 
    name: "user_account_login",
    component: UserAccountLoginView,
    meta: {requestAuth: false},
  },
  {
    path: "/user/account/register", 
    name: "user_account_register",
    component: UserAccountRegisterView,
    meta: {requestAuth: false},
  },
  {
    path: "/404/", 
    name: "404_index",
    component: NotFoundView,
    meta: {requestAuth: false},
  },
  {
    path: "/:catchAll(.*)",
    redirect: "/404/",
  },
]
const router = createRouter({
  history: createWebHistory(),
  routes
})
//route在执行之前起作用的一个函数
router.beforeEach((to, from, next) => {  //to:跳转到那个页面。from:从哪个页面跳转过去。next:将页面要不要执行下一步操作
    if (to.meta.requestAuth && !store.state.user.is_login) {
      next({name: "user_account_login"});
    }else{
      next();
    }
})
export default router
