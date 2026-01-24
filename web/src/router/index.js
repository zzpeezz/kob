import { createRouter, createWebHistory } from 'vue-router'
import PkIndexView from '@/views/pk/PkIndexView.vue'
import RecordIndexView from '@/views/record/RecordIndexView.vue'
import RanklistIndexView from '@/views/ranklist/RanklistIndexView.vue'
import UserBotIndexView from '@/views/user/bots/UserBotIndexView.vue'
import NotFoundView from '@/views/error/NotFoundView.vue'
import UserAccountRegisterView from '@/views/user/account/UserAccountRegisterView.vue'
import UserAccountLoginView from '@/views/user/account/UserAccountLoginView.vue'

// 匹配是从上往下匹配
const routes = [
  {
    path: "/",  //输入根路径自动跳到pk
    name: "home",
    redirect: "/pk/"  //重定向
  },
  {
    path: "/pk/",  //这里是相对路径，也就是我们域名后面的路径
    name: "pk_index", //起名
    component: PkIndexView, //映射到这个组件
  },
  {
    path: "/record/", 
    name: "record_index",
    component: RecordIndexView,
  },
  {
    path: "/ranklist/", 
    name: "ranklist_index",
    component: RanklistIndexView,
  },
  {
    path: "/user/bot/", 
    name: "user_bot_index",
    component: UserBotIndexView,
  },
  {
    path: "/user/account/login/", 
    name: "user_account_login",
    component: UserAccountLoginView,
  },
  {
    path: "/user/account/register", 
    name: "user_account_register",
    component: UserAccountRegisterView,
  },
  {
    path: "/404/", 
    name: "404_index",
    component: NotFoundView,
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

export default router
